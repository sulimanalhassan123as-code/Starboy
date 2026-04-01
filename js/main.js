/* SULEIMAN PLAY STORE - CORE ENGINE
  Premium Social Proof & 3D Animation Integration
*/

async function loadApps() {
  try {
    const res = await fetch('apps.json');
    const apps = await res.json();
    const container = document.getElementById('apps-container');
    const searchInput = document.getElementById('search');

    function render(list) {
      if (list.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px;">No apps found. Try searching for something else!</p>`;
        return;
      }

      container.innerHTML = list.map(app => `
        <div class="app-card">
          <div class="logo-3d-container">
            <div class="logo-flipper">
              <div class="logo-front">
                <img src="${app.icon}" alt="${app.title} Front">
              </div>
              <div class="logo-back">
                <img src="${app.iconBack}" alt="${app.title} Back">
              </div>
            </div>
          </div>

          <h2>${app.title}</h2>

          <div class="app-stats">
            <span>⭐ ${app.rating}</span>
            <span>📥 ${app.installs}</span>
            <span class="review-btn" onclick="toggleReviews('${app.id}')">💬 Reviews</span>
          </div>

          <p>${app.desc}</p>

          <div id="reviews-${app.id}" class="review-drawer">
            <h4 style="margin-bottom:10px; font-size:0.9rem;">Verified Reviews</h4>
            ${app.reviews.map(r => `
              <div class="review-item">
                <b>${r.user}</b>: ${r.comment}
              </div>
            `).join('')}
          </div>

          <a href="${app.url}" target="_blank">Open App</a>
        </div>
      `).join('');
    }

    // Initial render
    render(apps);

    // Live Search functionality
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      const filtered = apps.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
      render(filtered);
    });

  } catch (err) {
    console.error("Error loading apps:", err);
    document.getElementById('apps-container').innerHTML = "<p style='text-align:center; padding:50px;'>⚠️ Error loading store data. Please check apps.json!</p>";
  }
}

// Global function to handle review toggling
window.toggleReviews = function(id) {
  const drawer = document.getElementById(`reviews-${id}`);
  if (drawer) {
    const isVisible = drawer.style.display === "block";
    drawer.style.display = isVisible ? "none" : "block";
  }
};

// Start the engine
document.addEventListener('DOMContentLoaded', loadApps);
