# Loop – Flask + MySQL social app

## Run
1. `pip install -r requirements.txt`
2. `mysql -u root -p < schema.sql`
3. Optional env vars: `DB_HOST DB_USER DB_PASSWORD DB_NAME SECRET_KEY`
4. `python app.py` → http://127.0.0.1:5000

## Features
- Accounts: register / login / logout (hashed passwords)
- Profiles: display name, bio, avatar URL, friend count
- Posts: create, delete own, like/unlike (AJAX)
- Friends: search, send / cancel / accept / decline / remove
- Feed: your posts + your friends' posts

## Before production
Add CSRF protection (Flask-WTF), rate limiting, a connection pool, and a real SECRET_KEY.
