const GITHUB_USER = "ryankingcoders";
const MAX_REPOS = 6;

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  PHP: "#4F5D95",
  Python: "#3572A5",
  Java: "#b07219",
  Ruby: "#701516",
  Vue: "#41b883",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Blade: "#f7523f",
  Shell: "#89e051",
};

document.getElementById("year").textContent = new Date().getFullYear();

const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

const avatar = document.getElementById("avatar");
avatar.addEventListener("error", () => {
  const fallback = document.createElement("div");
  fallback.className = "avatar-fallback";
  fallback.textContent = "RK";
  avatar.replaceWith(fallback);
});

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function repoCard(repo) {
  const color = LANGUAGE_COLORS[repo.language] || "#8b949e";
  const language = repo.language
    ? `<span><span class="dot" style="background:${color}"></span>${escapeHtml(repo.language)}</span>`
    : "";
  const stars = repo.stargazers_count ? `<span>★ ${repo.stargazers_count}</span>` : "";
  const demo = repo.homepage
    ? `<a href="${escapeHtml(repo.homepage)}" target="_blank" rel="noopener">Live demo →</a>`
    : "";
  const title = repo.name.replace(/[-_]/g, " ");

  return `
    <article class="repo">
      <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${escapeHtml(title)}</a></h3>
      <p>${escapeHtml(repo.description || "No description yet.")}</p>
      <div class="repo-meta">${language}${stars}${demo}</div>
    </article>`;
}

async function loadRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    if (!res.ok) return;
    const repos = (await res.json())
      .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== `${GITHUB_USER}.github.io`)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, MAX_REPOS);
    if (!repos.length) return;

    document.getElementById("repo-grid").innerHTML = repos.map(repoCard).join("");
    document.getElementById("github-projects").hidden = false;
  } catch {
    // The hand-written projects above still show if GitHub is unreachable.
  }
}

loadRepos();
