async function loadApps() {
  try {
    const res = await fetch('apps.json');
    const apps = await res.json();
    const container = document.getElementById('apps-container');
    const searchInput = document.getElementById('search');

    function render(list) {
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
          <p>${app.desc}</p>
          <a href="${app.url}" target="_blank">Open App</a>
        </div>
      `).join('');
    }

    render(apps);

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      const filtered = apps.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q)
      );
      render(filtered);
    });
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadApps);
