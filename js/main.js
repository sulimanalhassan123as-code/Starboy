let allApps = [];

async function loadApps() {
  try {
    const res = await fetch('apps.json');
    allApps = await res.json();
    renderHome(allApps);
  } catch (err) { console.error("Error loading apps:", err); }
}

// 1. RENDER HOME SCREEN (Category Overview)
function renderHome(apps) {
  const containers = { 'islamic': 'islamic-container', 'tech': 'tech-container', 'games': 'games-container' };
  
  Object.keys(containers).forEach(cat => {
    const container = document.getElementById(containers[cat]);
    const filtered = apps.filter(a => a.category === cat);
    
    if (filtered.length > 0) {
      container.innerHTML = filtered.map(app => `
        <div class="app-card" onclick="openCategoryMenu('${app.category}')">
          <div class="logo-3d-container">
            <div class="logo-flipper">
              <div class="logo-front"><img src="${app.icon}"></div>
              <div class="logo-back"><img src="${app.iconBack}"></div>
            </div>
          </div>
          <h3>${app.title}</h3>
          <p>Tap to view ${cat} apps</p>
        </div>
      `).join('');
    } else {
      container.innerHTML = `<div class="app-card coming-soon"><h3>Coming Soon</h3></div>`;
    }
  });
}

// 2. OPEN CATEGORY SUB-MENU
function openCategoryMenu(category) {
  const home = document.getElementById('home-screen');
  const catView = document.getElementById('category-view');
  const listContainer = document.getElementById('category-apps-list');
  const title = document.getElementById('current-category-name');

  // Switch screens
  home.style.display = 'none';
  catView.style.display = 'block';
  window.scrollTo(0, 0);

  title.innerText = category.toUpperCase() + " APPS";

  const appsInCat = allApps.filter(a => a.category === category);

  // Render Play Store style detailed cards
  listContainer.innerHTML = appsInCat.map(app => `
    <div class="detailed-app-card">
      <div class="card-top">
        <img src="${app.icon}" class="detail-icon">
        <div class="detail-info">
          <h2>${app.title}</h2>
          <p class="author">Never Hide Tech Empire</p>
          <div class="tags"><span>Contains ads</span> <span>In-app purchases</span></div>
        </div>
      </div>
      
      <div class="stats-row">
        <div class="stat-item"><b>${app.rating} ⭐</b><br>40K reviews</div>
        <div class="stat-item"><b>${app.installs}</b><br>Downloads</div>
        <div class="stat-item"><b>120K</b><br>Likes</div>
        <div class="stat-item"><b>3+</b><br>Rated</div>
      </div>

      <div class="action-buttons">
        <a href="${app.url}" target="_blank" class="install-button">Install</a>
        <button class="wish-button">♡ Add to Wishlist</button>
      </div>

      <div class="comment-preview">
        <p><b>Top Comment:</b> "This is exactly what I needed for my daily routine!" — <i>Verified User</i></p>
      </div>
    </div>
  `).join('');
}

function goHome() {
  document.getElementById('home-screen').style.display = 'block';
  document.getElementById('category-view').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', loadApps);
