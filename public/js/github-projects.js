/**
 * GitHub Projects — 动态获取最新公开仓库
 * 在首页 #projects-grid 容器中渲染项目卡片
 */
(async function () {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  // 尝试 sessionStorage 缓存（5 分钟）
  const CACHE_KEY = 'gh_projects';
  const cached = (() => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts < 300_000) return data;
      }
    } catch {}
    return null;
  })();

  let repos;
  if (cached) {
    repos = cached;
  } else {
    try {
      const res = await fetch(
        'https://api.github.com/users/mxppxm/repos?sort=pushed&direction=desc&per_page=10&type=public'
      );
      if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
      repos = await res.json();
      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: repos, ts: Date.now() })
        );
      } catch {}
    } catch (err) {
      container.innerHTML = `<p class="projects-error">⚠️ 加载项目失败，<a href="https://github.com/mxppxm" target="_blank">去 GitHub 查看 →</a></p>`;
      console.error('GitHub Projects: fetch failed', err);
      return;
    }
  }

  if (!repos || repos.length === 0) {
    container.innerHTML =
      '<p class="projects-empty">暂无公开项目</p>';
    return;
  }

  const emojiFor = (name) => {
    const map = {
      budget: '📊',
      firework: '🎆',
      chatp2p: '💬',
      'prompt-optimizer': '🤖',
      habit: '✅',
      'birthday-mxo': '🎂',
      openclacky: '🤖',
      blog: '📝',
      dotfiles: '⚙️',
    };
    return map[name.toLowerCase()] || '📦';
  };

  // 过滤掉 blog 自身 repo 和 fork
  const filtered = repos.filter(
    (r) => r.name !== 'mxppxm.github.io' && !r.fork
  );
  const top6 = filtered.slice(0, 6);

  if (top6.length === 0) {
    container.innerHTML = '<p class="projects-empty">暂无公开项目</p>';
    return;
  }

  container.innerHTML = top6
    .map((repo) => {
      const lang = repo.language || '';
      const desc = repo.description || '暂无描述';
      const stars = repo.stargazers_count ?? 0;
      const emoji = emojiFor(repo.name);

      return `
    <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-card">
      <div class="project-top">
        ${lang ? `<span class="project-lang">${lang}</span>` : ''}
      </div>
      <h3>${emoji} ${repo.name}</h3>
      <p>${escHtml(desc)}</p>
      <div class="project-meta">
        <span>⭐ ${stars}</span>
        <span>🔗 GitHub</span>
      </div>
    </a>`;
    })
    .join('');

  function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
})();