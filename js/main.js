let allApps = [];

async function loadApps() {
  try {
    const res = await fetch('apps.json');
    allApps = await res.json();
    renderAll(allApps);

    document.getElementById('search').addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allApps.filter(a => a.title.toLowerCase().includes(term));
      renderAll(filtered);
    });
  } catch (err) { console.error(err); }
}

function renderAll(apps) {
  const categories = { 'islamic': 'islamic-container', 'tech': 'tech-container', 'games': 'games-container' };
  
  Object.keys(categories).forEach(cat => {
    const container = document.getElementById(categories[cat]);
    const filtered = apps.filter(a => a.category === cat);
    
    if (filtered.length > 0) {
      container.innerHTML = filtered.map(app => `
        <div class="app-card" onclick="openDetails('${app.id}')">
          <div class="logo-3d-container">
            <div class="logo-flipper">
              <div class="logo-front"><img src="${app.icon}"></div>
              <div class="logo-back"><img src="${app.iconBack}"></div>
            </div>
          </div>
          <h2>${app.title}</h2>
          <div class="mini-rating">⭐ ${app.rating}</div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `<div class="app-card coming-soon-card"><h2>Coming Soon</h2></div>`;
    }
  });
}

function openDetails(id) {
  const app = allApps.find(a => a.id === id);
  const modal = document.getElementById('app-modal');
  const body = document.getElementById('modal-body');

  // Find other apps in the same category
  const similarApps = allApps.filter(a => a.category === app.category && a.id !== app.id);

  body.innerHTML = `
    <div class="modal-header">
      <img src="${app.icon}" class="modal-app-icon">
      <div class="modal-app-info">
        <h1>${app.title}</h1>
        <p class="dev-name">Never Hide Empire</p>
        <div class="stats-bar">
          <div class="stat"><b>${app.rating} ⭐</b><br>Reviews</div>
          <div class="stat"><b>${app.installs}</b><br>Installs</div>
          <div class="stat"><b>3+</b><br>Rated</div>
        </div>
        <a href="${app.url}" class="install-btn" target="_blank">Install / Open</a>
      </div>
    </div>
    
    <div class="modal-desc">
      <h3>About this app</h3>
      <p>${app.desc}</p>
    </div>

    <div class="reviews-section">
      <h3>Ratings & Reviews</h3>
      ${app.reviews.map(r => `
        <div class="review-bubble">
          <b>${r.user}</b> <span>${"⭐".repeat(r.stars)}</span>
          <p>${r.comment}</p>
        </div>
      `).join('')}
    </div>

    <div class="more-section">
      <h3>More in ${app.category}</h3>
      <div class="mini-grid">
        ${similarApps.map(s => `<img src="${s.icon}" onclick="openDetails('${s.id}')">`).join('')}
      </div>
    </div>
  `;

  modal.style.display = "block";
}

// Close logic
document.querySelector('.close-modal').onclick = () => document.getElementById('app-modal').style.display = "none";
window.onclick = (event) => { if (event.target == document.getElementById('app-modal')) openDetailsClose(); }
function openDetailsClose() { document.getElementById('app-modal').style.display = "none"; }

document.addEventListener('DOMContentLoaded', loadApps);
