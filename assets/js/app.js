(() => {
  const root = document.documentElement.dataset.root || './';
  const pageId = document.body.dataset.page || 'home';
  const site = window.SITE;
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const href = (path) => root + path;
  document.querySelector('#header').innerHTML = `<header class="site-header"><a class="brand" href="${href('index.html')}">${escapeHTML(site.name)}<span> ✳</span></a><nav class="nav" aria-label="Main navigation">${site.pages.map(p => `<a href="${href(p.href)}" ${((pageId==='home' && p.href==='index.html') || p.href.endsWith('/'+pageId+'.html'))?'aria-current="page"':''}>${escapeHTML(p.label)}</a>`).join('')}</nav><button class="logout" id="logout" type="button">Lock site</button></header>`;
  document.querySelector('#footer').innerHTML = `<footer class="site-footer">Made with a little curiosity ✳</footer>`;
  const main = document.querySelector('#main');
  if(pageId==='home') {
    main.innerHTML = '<div class="home-empty" aria-label="Homepage content coming soon"></div>';
  } else {
    const data = window.PAGE_CONTENT[pageId];
    if(!data){ main.textContent = 'Page not found.'; return; }
    const paragraphs = arr => (arr||[]).map(p=>`<p>${escapeHTML(p)}</p>`).join('');
    const renderSection = s => {
      let content = '';
      if(s.type==='text') content = `<div class="section-body">${paragraphs(s.paragraphs)}</div>`;
      else if(s.type==='highlight') content = `<div class="feature"><div class="section-body">${paragraphs(s.paragraphs)}</div></div>`;
      else if(s.type==='cards') content = `<div class="cards">${(s.items||[]).map(i=>`<article class="mini-card"><h3>${escapeHTML(i.title)}</h3><p>${escapeHTML(i.text)}</p></article>`).join('')}</div>`;
      return `<section class="content-section"><div class="eyebrow">${escapeHTML(s.eyebrow)}</div><h2>${escapeHTML(s.title)}</h2>${content}</section>`;
    };
    main.innerHTML = `<section class="intro"><span class="sparkle" aria-hidden="true">✳</span><div class="eyebrow">${escapeHTML(data.eyebrow)}</div><h1>${escapeHTML(data.title)}</h1><p>${escapeHTML(data.introduction)}</p></section>${(data.sections||[]).map(renderSection).join('')}`;
  }
  const gate = document.querySelector('#gate');
  const unlock = () => {gate.classList.add('hidden'); document.querySelector('#site-shell').classList.remove('hidden');};
  if(sessionStorage.getItem('site-unlocked')==='yes') unlock();
  document.querySelector('#password-form').addEventListener('submit', e => {
    e.preventDefault();
    if(document.querySelector('#password').value===site.password){sessionStorage.setItem('site-unlocked','yes');unlock();}
    else document.querySelector('#error').textContent='That password doesn’t seem right. Try again.';
  });
  document.querySelector('#logout').addEventListener('click',()=>{sessionStorage.removeItem('site-unlocked');location.reload();});
})();
