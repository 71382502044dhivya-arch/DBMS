const post = (url) => fetch(url, { method: "POST" }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });

document.addEventListener("click", async (e) => {
  const like = e.target.closest("[data-like]");
  if (like) {
    try {
      const d = await post(`/post/${like.dataset.like}/like`);
      like.classList.toggle("on", d.liked);
      like.setAttribute("aria-pressed", d.liked);
      like.querySelector(".label").textContent = d.liked ? "Liked" : "Like";
      like.querySelector(".count").textContent = d.likes;
    } catch { alert("Couldn't update your like. Try again."); }
    return;
  }
  const fr = e.target.closest("[data-friend]");
  if (fr) {
    if (fr.dataset.confirm && !confirm(fr.dataset.confirm)) return;
    fr.disabled = true;
    try { await post(`/friend/${fr.dataset.friend}/${fr.dataset.action}`); location.reload(); }
    catch { fr.disabled = false; alert("That didn't work. Refresh and try again."); }
  }
});

document.querySelectorAll(".composer textarea").forEach(t => {
  const c = t.closest("form").querySelector("[data-counter]");
  const upd = () => (c.textContent = `${t.value.length}/500`);
  t.addEventListener("input", upd); upd();
});
