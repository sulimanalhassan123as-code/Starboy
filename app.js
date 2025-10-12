
// js/app.js - client-side logic (includes Google API key and CX on client side)
const API_KEY = "AIzaSyBPj8dveECyideRPYJTD8VbdLgTWfihyl0"; // user-provided (client-side)
const CX = "909f5c55f2a504e45"; // user-provided

document.addEventListener('DOMContentLoaded', ()=> {
  const form = document.getElementById('searchForm');
  const qInput = document.getElementById('q');
  const resultsEl = document.getElementById('results');
  const filter = document.getElementById('filter');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = qInput.value.trim();
    if(!q) return alert('Please enter a search term.');
    doSearch(q);
  });

  // submit page form
  const submitForm = document.getElementById('submitForm');
  if(submitForm){
    submitForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      const title = document.getElementById('s_title').value.trim();
      const url = document.getElementById('s_url').value.trim();
      const desc = document.getElementById('s_desc').value.trim();
      if(!title || !url) return alert('Title and URL required.');
      const submissions = JSON.parse(localStorage.getItem('islamic_subs_v1')||'[]');
      submissions.unshift({id:Date.now(),title,url,desc,status:'pending'});
      localStorage.setItem('islamic_subs_v1', JSON.stringify(submissions));
      alert('Submitted — pending moderation.');
      document.getElementById('s_title').value='';
      document.getElementById('s_url').value='';
      document.getElementById('s_desc').value='';
      renderSubmissions();
    });
    renderSubmissions();
  }

  function renderSubmissions(){
    const list = document.getElementById('submissionsList');
    if(!list) return;
    const submissions = JSON.parse(localStorage.getItem('islamic_subs_v1')||'[]');
    list.innerHTML = submissions.map(s=>`<li><strong>${escapeHtml(s.title)}</strong> — <small>${s.status}</small><br><a href="\${s.url}" target="_blank">\${s.url}</a></li>`).join('');
  }

  // simple carousel
  (function carousel(){
    const slides = document.querySelectorAll('.carousel .slide');
    if(!slides.length) return;
    let i=0;
    setInterval(()=> {
      slides.forEach((s,idx)=> s.style.transform = `translateX(${(idx-i)*100}%)`);
      i = (i+1) % slides.length;
    },4500);
  })();

  async function doSearch(query){
    resultsEl.innerHTML = '<p>Searching...</p>';
    try{
      const start = 1;
      const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&start=${start}`;
      const res = await fetch(url);
      if(!res.ok) throw new Error('Search request failed: '+res.status);
      const data = await res.json();
      const items = data.items || [];
      if(items.length === 0) {
        resultsEl.innerHTML = '<p>No results found.</p>';
        return;
      }
      resultsEl.innerHTML = items.map(it => {
        const title = it.title || '';
        const link = it.link || '';
        const snippet = it.snippet || '';
        const host = it.displayLink || '';
        return `<article class="card"><a class="resultTitle" href="${link}" target="_blank">${escapeHtml(title)}</a><div class="meta">${escapeHtml(host)}</div><p>${escapeHtml(snippet)}</p><div class="actions"><a href="${link}" target="_blank">Open</a> • <a href="https://wa.me/233599931348?text=${encodeURIComponent(title + ' ' + link)}" target="_blank">Share</a></div></article>`;
      }).join('');
    }catch(err){
      console.error(err);
      resultsEl.innerHTML = '<p>Error during search. See console for details.</p>';
    }
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]}); }
});
