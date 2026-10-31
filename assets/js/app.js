
(() => {
  const root = document.documentElement.dataset.root || './';
  const pageId = document.body.dataset.page || 'home';
  const site = window.SITE;

  const escapeHTML = (value) =>
    String(value ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));

  const href = (path) => root + path;


  // ==========================================
  // TEXT FORMATTING
  // ==========================================

  const formatText = (value) => {
    let text = escapeHTML(value);

    // Bold + italic: ***text***
    text = text.replace(
      /\*\*\*(.+?)\*\*\*/g,
      '<strong><em class="text-cursive">$1</em></strong>'
    );

    // Bold: **text**
    text = text.replace(
      /\*\*(.+?)\*\*/g,
      '<strong>$1</strong>'
    );

    // Italic / cursive: *text*
    text = text.replace(
      /\*(.+?)\*/g,
      '<em class="text-cursive">$1</em>'
    );

    // Underline: __text__
    text = text.replace(
      /__(.+?)__/g,
      '<span class="text-underline">$1</span>'
    );

    // Strikethrough: ~~text~~
    text = text.replace(
      /~~(.+?)~~/g,
      '<del>$1</del>'
    );

    // Accent color: {{text}}
    text = text.replace(
      /\{\{(.+?)\}\}/g,
      '<span class="text-accent">$1</span>'
    );

    return text;
  };




  // ==========================================
  // NAVIGATION
  // ==========================================

  const isCurrentPage = (path) =>
    (pageId === 'home' && path === 'index.html') ||
    path.endsWith('/' + pageId + '.html');

  const navLink = (page) => `
    <a
      href="${escapeHTML(href(page.href))}"
      ${isCurrentPage(page.href)
      ? 'aria-current="page"'
      : ''}
    >
      ${escapeHTML(page.label)}
    </a>
  `;

  const pages = site.pages || [];

  const homePage = pages.find(
    p => p.href === 'index.html'
  );

  const aboutPage = pages.find(
    p => p.href === 'pages/about.html'
  );

  const otherPages = pages.filter(
    p => p !== homePage && p !== aboutPage
  );

  const issueOptions = (site.issues || [])
    .map(issue => `
      <option
        value="${escapeHTML(href(issue.href))}"
        ${isCurrentPage(issue.href)
        ? 'selected'
        : ''}
      >
        ${escapeHTML(issue.label)}
      </option>
    `)
    .join('');

  document.querySelector('#header').innerHTML = `
    <header class="site-header">

      <a class="brand" href="${href('index.html')}">
        ${escapeHTML(site.name)}
      </a>

      <nav class="nav" aria-label="Main navigation">

        ${homePage ? navLink(homePage) : ''}

        <select
          class="issue-picker"
          id="issue-picker"
          aria-label="Select newsletter issue"
        >
          <option value="" disabled ${!(site.issues || []).some(issue => isCurrentPage(issue.href)) ? 'selected' : ''}>
            Select Issue
          </option>
          ${issueOptions}
        </select>

        ${aboutPage ? navLink(aboutPage) : ''}

        ${otherPages.map(navLink).join('')}

        <span
          class="nav-divider"
          aria-hidden="true"
        ></span>

        
      <button
        class="logout"
        id="logout"
        type="button"
        aria-label="Lock site"
        title="Lock site"
      >
        <svg
          class="lock-icon"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <!-- Open shackle -->
          <path d="M8 10V7a4 4 0 0 1 8 0" />

          <!-- Lock body -->
          <rect
            x="5"
            y="10"
            width="14"
            height="11"
            rx="2"
          />

          <!-- Keyhole -->
          <circle cx="12" cy="15" r="1" />
          <path d="M12 16v2" />
        </svg>
      </button>


      </nav>

    </header>
  `;

  document.querySelector('#issue-picker')
    .addEventListener('change', event => {
      if (event.target.value) {
        window.location.href = event.target.value;
      }
    });


  // ==========================================
  // FOOTER
  // ==========================================

  document.querySelector('#footer').innerHTML = `
    <footer class="site-footer">
      Made for specifially the feral discord club
    </footer>
  `;

  // ==========================================
  // PAGE CONTENT
  // ==========================================

  const main = document.querySelector('#main');


  if (pageId === 'home') {

    // Get the latest issue from config.js
    // Assumes issues are listed oldest to newest
    const latestIssue = (site.issues || []).at(-1);

    const latestIssueHref = latestIssue
      ? href(latestIssue.href)
      : null;

    main.innerHTML = `
      <div class="home-empty">
        <div class="home-welcome">

          <span class="home-welcome-eyebrow">
            A LITTLE CORNER OF THE DEEP BLUE
          </span>

          <h1>Welcome to the WillMack Newsletter</h1>

          <p>
            A collection of whatever this considers itself to be.
          </p>

          ${latestIssueHref ? `
            <a
              class="home-welcome-button"
              href="${escapeHTML(latestIssueHref)}"
            >
              Dive into the latest issue
              <span aria-hidden="true">→</span>
            </a>
          ` : ''}
          
        </div>
      </div>
    `;


  } else {

    const data = window.PAGE_CONTENT[pageId];

    if (!data) {
      main.textContent = 'Page not found.';
    } else {

      // Render paragraphs
      const paragraphs = arr =>
        (arr || [])
          .map(p => `<p>${formatText(p)}</p>`)
          .join('');

      // Render reusable content sections
      const renderSection = s => {
        let content = '';

        if (s.type === 'text') {
          content = `
            <div class="section-body">
              ${paragraphs(s.paragraphs)}
            </div>
          `;
        }

        else if (s.type === 'highlight') {
          content = `
            <div class="feature">
              <div class="section-body">
                ${paragraphs(s.paragraphs)}
              </div>
            </div>
          `;
        }

        else if (s.type === 'cards') {
          content = `
            <div class="cards">
              ${(s.items || []).map(i => `
                <article class="mini-card">
                  <h3>${formatText(i.title)}</h3>
                  <p>${formatText(i.text)}</p>
                </article>
              `).join('')}
            </div>
          `;
        }




        else if (s.type === 'song') {

          // Extract the track ID from the Spotify URL
          const spotifyMatch = (s.url || '').match(
            /^https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/
          );

          const spotifyEmbedUrl = spotifyMatch
            ? `https://open.spotify.com/embed/track/${spotifyMatch[1]}?theme=0`
            : null;

          content = `
            <div class="song-card song-card-embed">

              <div class="song-details">

                <span class="song-label">
                  NOW PLAYING, SOMEWHERE IN THE DEEP
                </span>

                <h3>${escapeHTML(s.songTitle)}</h3>

                <p class="song-artist">
                  ${escapeHTML(s.artist)}
                </p>

              </div>

              ${spotifyEmbedUrl ? `
                <iframe
                  class="spotify-player"
                  src="${escapeHTML(spotifyEmbedUrl)}"
                  title="Spotify player: ${escapeHTML(s.songTitle)}"
                  width="100%"
                  height="152"
                  frameborder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              ` : ''}

            </div>
          `;
        }




        return `
          <section class="content-section">
            <div class="eyebrow">
              ${escapeHTML(s.eyebrow)}
            </div>

            <h2>${escapeHTML(s.title)}</h2>

            ${content}
          </section>
        `;
      };

      // Render the introduction and all sections
      main.innerHTML = `
        <section class="intro">

          <div class="eyebrow">
            ${escapeHTML(data.eyebrow)}
          </div>

          <h1>${escapeHTML(data.title)}</h1>

          <p>${formatText(data.introduction)}</p>

        </section>

        ${(data.sections || []).map(renderSection).join('')}
      `;
    }
  }

  // ==========================================
  // PASSWORD PROTECTION
  // ==========================================

  const gate = document.querySelector('#gate');

  const unlock = () => {
    gate.classList.add('hidden');

    document.querySelector('#site-shell')
      .classList.remove('hidden');
  };

  if (sessionStorage.getItem('site-unlocked') === 'yes') {
    unlock();
  }

  document.querySelector('#password-form')
    .addEventListener('submit', e => {
      e.preventDefault();

      const enteredPassword =
        document.querySelector('#password').value;

      if (enteredPassword === site.password) {
        sessionStorage.setItem('site-unlocked', 'yes');
        unlock();
      } else {
        document.querySelector('#error').textContent =
          'That password doesn’t seem right. Try again.';
      }
    });

  // ==========================================
  // LOCK SITE
  // ==========================================

  document.querySelector('#logout')
    .addEventListener('click', () => {
      sessionStorage.removeItem('site-unlocked');
      location.reload();
    });

})();
