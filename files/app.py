import os
from functools import wraps
import mysql.connector
from flask import (Flask, g, render_template, request, redirect, url_for,
                   session, flash, jsonify, abort)
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-change-me")
DB = dict(host=os.environ.get("DB_HOST", "localhost"),
          user=os.environ.get("DB_USER", "root"),
          password=os.environ.get("DB_PASSWORD", ""),
          database=os.environ.get("DB_NAME", "socialapp"))

# ---------- database helpers ----------
def db():
    if "db" not in g:
        g.db = mysql.connector.connect(**DB)
    return g.db

@app.teardown_appcontext
def close_db(_):
    conn = g.pop("db", None)
    if conn:
        conn.close()

def q(sql, args=(), one=False, write=False):
    cur = db().cursor(dictionary=True)
    cur.execute(sql, args)
    if write:
        db().commit()
        last = cur.lastrowid
        cur.close()
        return last
    rows = cur.fetchall()
    cur.close()
    return (rows[0] if rows else None) if one else rows

# ---------- auth ----------
@app.before_request
def load_user():
    uid = session.get("uid")
    g.user = q("SELECT * FROM users WHERE id=%s", (uid,), one=True) if uid else None

def login_required(f):
    @wraps(f)
    def wrapper(*a, **kw):
        if not g.user:
            return redirect(url_for("login"))
        return f(*a, **kw)
    return wrapper

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        f = request.form
        username, email = f["username"].strip().lower(), f["email"].strip().lower()
        if not (3 <= len(username) <= 30) or not username.isalnum():
            flash("Username must be 3–30 letters or numbers.")
        elif len(f["password"]) < 8:
            flash("Password must be at least 8 characters.")
        elif q("SELECT id FROM users WHERE username=%s OR email=%s", (username, email), one=True):
            flash("That username or email is already taken.")
        else:
            uid = q("INSERT INTO users (username,email,password_hash,display_name) VALUES (%s,%s,%s,%s)",
                    (username, email, generate_password_hash(f["password"]),
                     f.get("display_name", "").strip() or username), write=True)
            session["uid"] = uid
            return redirect(url_for("feed"))
    return render_template("auth.html", mode="register")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        u = q("SELECT * FROM users WHERE username=%s", (request.form["username"].strip().lower(),), one=True)
        if u and check_password_hash(u["password_hash"], request.form["password"]):
            session["uid"] = u["id"]
            return redirect(url_for("feed"))
        flash("Wrong username or password.")
    return render_template("auth.html", mode="login")

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect(url_for("login"))

# ---------- posts ----------
POST_SELECT = """
SELECT p.id, p.body, p.created_at, p.user_id, u.username, u.display_name, u.avatar_url,
  (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.id) AS likes,
  EXISTS(SELECT 1 FROM likes l WHERE l.post_id=p.id AND l.user_id=%s) AS liked
FROM posts p JOIN users u ON u.id=p.user_id """

@app.route("/")
@login_required
def feed():
    me = g.user["id"]
    posts = q(POST_SELECT + """
        WHERE p.user_id=%s OR p.user_id IN (
          SELECT IF(requester_id=%s, addressee_id, requester_id) FROM friendships
          WHERE status='accepted' AND %s IN (requester_id, addressee_id))
        ORDER BY p.created_at DESC LIMIT 50""", (me, me, me, me))
    return render_template("feed.html", posts=posts)

@app.route("/post", methods=["POST"])
@login_required
def create_post():
    body = request.form.get("body", "").strip()
    if body and len(body) <= 500:
        q("INSERT INTO posts (user_id, body) VALUES (%s,%s)", (g.user["id"], body), write=True)
    else:
        flash("Posts must be 1–500 characters.")
    return redirect(request.referrer or url_for("feed"))

@app.route("/post/<int:pid>/delete", methods=["POST"])
@login_required
def delete_post(pid):
    q("DELETE FROM posts WHERE id=%s AND user_id=%s", (pid, g.user["id"]), write=True)
    return redirect(request.referrer or url_for("feed"))

@app.route("/post/<int:pid>/like", methods=["POST"])
@login_required
def like_post(pid):
    if not q("SELECT id FROM posts WHERE id=%s", (pid,), one=True):
        abort(404)
    me = g.user["id"]
    if q("SELECT 1 AS x FROM likes WHERE user_id=%s AND post_id=%s", (me, pid), one=True):
        q("DELETE FROM likes WHERE user_id=%s AND post_id=%s", (me, pid), write=True)
        liked = False
    else:
        q("INSERT INTO likes (user_id, post_id) VALUES (%s,%s)", (me, pid), write=True)
        liked = True
    n = q("SELECT COUNT(*) AS n FROM likes WHERE post_id=%s", (pid,), one=True)["n"]
    return jsonify(liked=liked, likes=n)

# ---------- profiles ----------
def relation(me, other):
    if me == other:
        return "self"
    r = q("""SELECT * FROM friendships WHERE (requester_id=%s AND addressee_id=%s)
             OR (requester_id=%s AND addressee_id=%s)""", (me, other, other, me), one=True)
    if not r:
        return "none"
    if r["status"] == "accepted":
        return "friends"
    return "sent" if r["requester_id"] == me else "received"

@app.route("/u/<username>")
@login_required
def profile(username):
    u = q("SELECT * FROM users WHERE username=%s", (username.lower(),), one=True)
    if not u:
        abort(404)
    posts = q(POST_SELECT + "WHERE p.user_id=%s ORDER BY p.created_at DESC LIMIT 50", (g.user["id"], u["id"]))
    count = q("""SELECT COUNT(*) AS n FROM friendships WHERE status='accepted'
                 AND %s IN (requester_id, addressee_id)""", (u["id"],), one=True)["n"]
    return render_template("profile.html", u=u, posts=posts, friend_count=count,
                           rel=relation(g.user["id"], u["id"]))

@app.route("/profile/edit", methods=["GET", "POST"])
@login_required
def edit_profile():
    if request.method == "POST":
        f = request.form
        q("UPDATE users SET display_name=%s, bio=%s, avatar_url=%s WHERE id=%s",
          (f["display_name"].strip()[:60] or g.user["username"], f["bio"].strip()[:300],
           f["avatar_url"].strip()[:255], g.user["id"]), write=True)
        return redirect(url_for("profile", username=g.user["username"]))
    return render_template("edit_profile.html")

# ---------- people & friends ----------
@app.route("/people")
@login_required
def people():
    term = request.args.get("q", "").strip()
    users = []
    if term:
        like = f"%{term}%"
        users = q("""SELECT id, username, display_name, avatar_url, bio FROM users
                     WHERE (username LIKE %s OR display_name LIKE %s) AND id<>%s LIMIT 30""",
                  (like, like, g.user["id"]))
        for u in users:
            u["rel"] = relation(g.user["id"], u["id"])
    return render_template("people.html", users=users, term=term)

@app.route("/friends")
@login_required
def friends():
    me = g.user["id"]
    cols = "u.id, u.username, u.display_name, u.avatar_url, u.bio"
    incoming = q(f"""SELECT {cols} FROM friendships f JOIN users u ON u.id=f.requester_id
                     WHERE f.addressee_id=%s AND f.status='pending'""", (me,))
    outgoing = q(f"""SELECT {cols} FROM friendships f JOIN users u ON u.id=f.addressee_id
                     WHERE f.requester_id=%s AND f.status='pending'""", (me,))
    mine = q(f"""SELECT {cols} FROM friendships f
                 JOIN users u ON u.id=IF(f.requester_id=%s, f.addressee_id, f.requester_id)
                 WHERE f.status='accepted' AND %s IN (f.requester_id, f.addressee_id)
                 ORDER BY u.display_name""", (me, me))
    return render_template("friends.html", incoming=incoming, outgoing=outgoing, friends=mine)

@app.route("/friend/<int:uid>/<action>", methods=["POST"])
@login_required
def friend_action(uid, action):
    me = g.user["id"]
    if uid == me or not q("SELECT id FROM users WHERE id=%s", (uid,), one=True):
        abort(400)
    rel = relation(me, uid)
    if action == "request" and rel == "none":
        q("INSERT INTO friendships (requester_id, addressee_id) VALUES (%s,%s)", (me, uid), write=True)
    elif action == "accept" and rel == "received":
        q("UPDATE friendships SET status='accepted' WHERE requester_id=%s AND addressee_id=%s", (uid, me), write=True)
    elif action in ("decline", "cancel", "remove") and rel != "none":
        q("""DELETE FROM friendships WHERE (requester_id=%s AND addressee_id=%s)
             OR (requester_id=%s AND addressee_id=%s)""", (me, uid, uid, me), write=True)
    else:
        abort(400)
    return jsonify(ok=True)

if __name__ == "__main__":
    app.run(debug=True)
