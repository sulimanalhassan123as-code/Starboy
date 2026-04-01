/* SULEIMAN PLAY STORE - MAIN PRODUCTION SCRIPT (v3.0)
  Developer: Sulieman Alhassan 
  Features: 3D Logo Flip, Social Stats, Unique Comments, View Routing
*/

let allApps = [];
let currentCategoryContext = null;

// 1. INITIALIZATION
document.addEventListener('DOMContentLoaded', async () => {
  setupThemeSwitcher();
  setupSearch();
  
  try {
    const res = await fetch('apps.json');
    if (!res.ok) throw new Error("Check if apps.json is in the root folder.");
    allApps = await res.json();
    renderHome();
  } catch (err) {
    console.error("Database Error:", err);
    document.getElementById('app-container').innerHTML = `<p style="padding:20px; text-align:center;">⚠️ Error: ${err.message}</p>`;
  }
});

// 2. VIEW ROUTER (Handles screen switching)
function showView(viewId) {
  document.querySelectorAll('.view-screen').forEach(el => el.classList.remove('active-view'));
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active-view');
    window.scrollTo(0, 0); 
  }
}

// 3. 3D LOGO GENERATOR (The Rotation Feature)
function get3DLogoHTML(appId, size = "60px") {
  return `
    <div class="logo-3d-container" style="width: ${size}; height: ${size};">
      <div class="logo-flipper">
        <div class="logo-front">
          <img src="icons/${appId}-front.png" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'><rect width=\'100\' height=\'100\' fill=\'#004d40\'/></svg>'">
        </div>
        <div class="logo-back">
          <img src="icons/${appId}-back.png" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'><rect width=\'100\' height=\'100\' fill=\'#d4af37\'/></svg>'">
        </div>
      </div>
    </div>
  `;
}

// 4. HOME VIEW RENDERING
function renderHome() {
  // Horizontal sections
  document.getElementById('trending-container').innerHTML = createMiniCards(allApps.filter(a => a.isTrending));
  document.getElementById('downloaded-container').innerHTML = createMiniCards(allApps.filter(a => a.isMostDownloaded));
  
  // Category Grid
  const categories = [
    { id: 'islamic', name: '🕌 Islamic Apps' },
    { id: 'cybersecurity', name: '🛡️ Tech & Cyber' },
    { id: 'tech', name: '💻 Dev Tools' }
  ];

  const catHtml = categories.map(cat => {
    const count = allApps.filter(a => a.category === cat.id).length;
    return `
      <div class="category-card" onclick="openCategory('${cat.id}')">
        <h4>${cat.name}</h4>
        <p class="sub-text">${count} Apps Available</p>
      </div>
    `;
  }).join('');
  document.getElementById('category-cards-container').innerHTML = catHtml;
}

function createMiniCards(appsArray) {
  return appsArray.map(app => `
    <div class="mini-app-card" onclick="openAppDetail('${app.id}')">
      ${get3DLogoHTML(app.id, "50px")}
      <p style="font-size: 0.7rem; font-weight: bold; margin-top:8px; text-align:center;">${app.title}</p>
    </div>
  `).join('');
}

// 5. CATEGORY & LIST RENDERING
function openCategory(catId) {
  currentCategoryContext = catId;
  const appsInCat = allApps.filter(a => a.category === catId);
  document.getElementById('cat-view-list').innerHTML = createVerticalList(appsInCat);
  showView('category-view');
}

function createVerticalList(appsArray) {
  return appsArray.map(app => `
    <div class="app-list-item" onclick="openAppDetail('${app.id}')">
      ${get3DLogoHTML(app.id, "60px")}
      <div class="app-list-info" style="margin-left:15px; flex:1;">
        <h4 style="margin:0;">${app.title}</h4>
        <div class="app-stats-row" style="font-size:0.75rem; color:gray; margin:5px 0;">
          👍 ${app.likes} | 📥 ${app.installs}
        </div>
        <div class="app-actions">
          <button class="btn-install" onclick="event.stopPropagation(); window.open('${app.url}', '_blank')">Install</button>
        </div>
      </div>
    </div>
  `).join('');
}

// 6. APP DETAIL VIEW (With Premium Social Proof)
function openAppDetail(appId) {
  const app = allApps.find(a => a.id === appId);
  if (!app) return;

  const content = `
    <div class="detail-header" style="display:flex; align-items:center; gap:20px; margin-bottom:20px;">
      ${get3DLogoHTML(app.id, "100px")}
      <div>
        <h2 style="margin:0;">${app.title}</h2>
        <p class="sub-text">Never Hide Tech Empire • Verified</p>
      </div>
    </div>
    
    <div class="detail-stats" style="display:flex; justify-content:space-between; background:var(--card-bg); padding:15px; border-radius:15px; margin-bottom:20px; text-align:center;">
      <div><b>${app.likes}</b><br><span class="sub-text">Likes 👍</span></div>
      <div><b>${app.installs}</b><br><span class="sub-text">Installs 📥</span></div>
      <div onclick="toggleComments('${app.id}')" style="cursor:pointer; color:var(--primary);">
        <b>${app.comments.length}</b><br><span>Reviews 💬</span>
      </div>
    </div>

    <div id="comments-list-${app.id}" class="comment-drawer" style="display:none; background:rgba(0,0,0,0.03); padding:15px; border-radius:12px; margin-bottom:20px;">
      <h4 style="margin-bottom:10px;">User Reviews</h4>
      ${app.comments.map(c => `
        <div style="margin-bottom:10px; border-bottom:1px solid rgba(0,0,0,0.05); padding-bottom:5px;">
          <b style="font-size:0.8rem;">${c.name}</b>
          <p style="font-size:0.8rem; margin:2px 0;">"${c.text}"</p>
        </div>
      `).join('')}
    </div>

    <div class="app-actions" style="display:flex; gap:10px;">
      <button class="btn-install" style="flex:1;" onclick="window.open('${app.url}', '_blank')">Install Now</button>
      <button class="btn-open" style="flex:1;" onclick="window.open('${app.url}', '_blank')">Open Web App</button>
    </div>
    
    <div style="margin-top:25px;">
      <h4>About</h4>
      <p style="line-height:1.6;">${app.desc}</p>
    </div>
  `;

  document.getElementById('detail-view-content').innerHTML = content;
  showView('app-detail-view');
}

function toggleComments(appId) {
    const el = document.getElementById(`comments-list-${appId}`);
    el.style.display = (el.style.display === "none") ? "block" : "none";
}

// 7. SEARCH & THEME
function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (term.length === 0) { showView('home-view'); return; }
    const filtered = allApps.filter(a => a.title.toLowerCase().includes(term));
    document.getElementById('search-app-list').innerHTML = createVerticalList(filtered);
    showView('search-view');
  });
}

function setupThemeSwitcher() {
  const selector = document.getElementById('theme-select');
  if (selector) {
    selector.addEventListener('change', (e) => document.body.setAttribute('data-theme', e.target.value));
  }
}
