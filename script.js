const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.textContent = opened ? '✕' : '☰';
});
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});
document.getElementById('year').textContent = new Date().getFullYear();
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.nav a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, {rootMargin: '-35% 0px -55% 0px'});
sections.forEach(section => observer.observe(section));


// Image preview: profile photo
const profileUpload = document.getElementById('profileUpload');
const profilePreview = document.getElementById('profilePreview');
if (profileUpload && profilePreview) {
  profileUpload.addEventListener('change', event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('กรุณาเลือกไฟล์รูปภาพ'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      let img = profilePreview.querySelector('img');
      if (!img) { img = document.createElement('img'); profilePreview.prepend(img); }
      img.src = e.target.result;
      profilePreview.querySelectorAll(':scope > span').forEach(el => el.style.display = 'none');
    };
    reader.readAsDataURL(file);
  });
}

// Image preview: each portfolio card
document.querySelectorAll('.image-frame').forEach(frame => {
  const input = frame.querySelector('input[type="file"]');
  frame.addEventListener('click', event => {
    if (event.target === input) return;
    input.click();
  });
  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('กรุณาเลือกไฟล์รูปภาพ'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      let img = frame.querySelector('img');
      if (!img) { img = document.createElement('img'); frame.prepend(img); }
      img.src = e.target.result;
      frame.setAttribute('aria-label', 'ภาพผลงานที่อัปโหลดแล้ว');
    };
    reader.readAsDataURL(file);
  });
});

// Add multiple image cards to the portfolio gallery
const multiUpload = document.getElementById('multiUpload');
const workGrid = document.getElementById('workGrid');
if (multiUpload && workGrid) {
  multiUpload.addEventListener('change', () => {
    [...(multiUpload.files || [])].filter(file => file.type.startsWith('image/')).forEach(file => {
      const card = document.createElement('article');
      card.className = 'work-card';
      const frame = document.createElement('div');
      frame.className = 'work-placeholder image-frame';
      const img = document.createElement('img');
      const prompt = document.createElement('span');
      prompt.className = 'frame-prompt';
      prompt.textContent = 'ภาพผลงาน';
      const reader = new FileReader();
      reader.onload = e => { img.src = e.target.result; };
      reader.readAsDataURL(file);
      frame.append(img, prompt);
      const info = document.createElement('div');
      info.className = 'work-info';
      const type = document.createElement('span');
      type.className = 'work-type';
      type.textContent = 'MY PORTFOLIO';
      const title = document.createElement('h3');
      title.textContent = file.name.replace(/\.[^.]+$/, '');
      const desc = document.createElement('p');
      desc.textContent = 'เพิ่มคำอธิบายผลงานได้ในไฟล์ index.html';
      info.append(type, title, desc);
      card.append(frame, info);
      workGrid.append(card);
    });
    multiUpload.value = '';
  });
}

// Reveal sections as they enter the viewport
const revealTargets = document.querySelectorAll('.info-card, .timeline-card, .work-card, .company-banner, .contact-panel');
if ('IntersectionObserver' in window) {
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  revealTargets.forEach(el => revealObserver.observe(el));
}
