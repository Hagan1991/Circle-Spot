// ==== STATE ====
const state = {
  username: 'SceneKid2005',
  status: 'hanging at the spot tonight',
  anthem: { src: 'assets/default-anthem.mp3', title: 'Default Banger', playing: false },
  circle: [
    {name:'Alex', img:'https://i.imgur.com/9pR2sKf.jpg'},
    {name:'Jordan', img:'https://i.imgur.com/2fJ6Q8z.jpg'},
    {name:'Sam', img:'https://i.imgur.com/5kR9pLm.jpg'},
    {name:'Taylor', img:'https://i.imgur.com/7vL3xQa.jpg'},
    {name:'Casey', img:'https://i.imgur.com/3mX7vYp.jpg'},
    {name:'Riley', img:'https://i.imgur.com/6cB4nEw.jpg'},
    {name:'Morgan', img:'https://i.imgur.com/1qW5zXr.jpg'},
  ],
  announcements: [],
  customCSS: '',
  customHTML: ''
};

// ==== DOM ====
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const els = {
  username: $('#username'),
  status: $('#status'),
  anthemAudio: $('#anthem-audio'),
  toggleBtn: $('#toggle-anthem'),
  anthemTitle: $('#anthem-title'),
  circleList: $('#circle-list'),
  cssInput: $('#custom-css'),
  htmlInput: $('#custom-html'),
  applyBtn: $('#apply-custom'),
  announcementList: $('#announcement-list'),
  newAnnouncement: $('#new-announcement'),
  postBtn: $('#post-announcement'),
  sparkleIn: $('#sparkle-input'),
  sparkleBtn: $('#make-sparkle'),
  sparkleOut: $('#sparkle-output')
};

// ==== RENDER ====
function renderCircle() {
  els.circleList.innerHTML = state.circle.map(f => `
    <div class="circle-card" draggable="true" data-name="${f.name}">
      <img src="${f.img}" alt="${f.name}" />
      <span>${f.name}</span>
    </div>`).join('');
  addDragHandlers();
}

function renderAnnouncements() {
  els.announcementList.innerHTML = state.announcements.map(a => `
    <div class="announcement"><strong>${a.author}:</strong> ${a.text}</div>
  `).join('');
}

// ==== INTERACTIONS ====
els.toggleBtn.onclick = () => {
  if (state.anthem.playing) {
    els.anthemAudio.pause();
    els.toggleBtn.textContent = 'Play Anthem';
  } else {
    els.anthemAudio.play().catch(() => {});
    els.toggleBtn.textContent = 'Pause';
  }
  state.anthem.playing = !state.anthem.playing;
};

els.applyBtn.onclick = () => {
  $('#injected-css')?.remove();
  $('#injected-html')?.remove();

  const style = document.createElement('style');
  style.id = 'injected-css';
  style.textContent = els.cssInput.value;
  document.head.appendChild(style);

  const div = document.createElement('div');
  div.id = 'injected-html';
  div.innerHTML = els.htmlInput.value;
  document.getElementById('container').appendChild(div);
};

els.postBtn.onclick = () => {
  const txt = els.newAnnouncement.value.trim();
  if (!txt) return;
  state.announcements.unshift({ author: state.username, text: txt, ts: Date.now() });
  els.newAnnouncement.value = '';
  renderAnnouncements();
};

els.makeSparkle.onclick = () => {
  const txt = els.sparkleIn.value || 'Circle Spot!';
  els.sparkleOut.textContent = txt;
};

// ==== DRAG CIRCLE ====
function addDragHandlers() {
  let dragged;
  $$('.circle-card').forEach(c => {
    c.addEventListener('dragstart', e => { dragged = c; c.style.opacity = '0.5'; });
    c.addEventListener('dragend', () => { dragged.style.opacity = ''; });
    c.addEventListener('dragover', e => e.preventDefault());
    c.addEventListener('drop', e => {
      e.preventDefault();
      if (!dragged || dragged === c) return;
      const from = state.circle.findIndex(f => f.name === dragged.dataset.name);
      const to = state.circle.findIndex(f => f.name === c.dataset.name);
      [state.circle[from], state.circle[to]] = [state.circle[to], state.circle[from]];
      renderCircle();
    });
  });
}

// ==== SYNC INPUTS ====
els.username.addEventListener('input', e => state.username = e.target.textContent);
els.status.addEventListener('input', e => state.status = e.target.textContent);

// ==== INIT ====
renderCircle();
renderAnnouncements();