
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

    text = text.replace(
      /\[\[signature\]\](.*?)\[\[\/signature\]\]/g,
      '<span class="handwritten-signature">$1</span>'
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

      const paragraphs = arr => {
        const items = Array.isArray(arr)
          ? arr
          : arr == null
            ? []
            : [arr];

        return items.map(item => {

          // Ordinary text paragraph
          if (typeof item === 'string') {
            return `<p>${formatText(item)}</p>`;
          }

          // Image between paragraphs
          if (item && item.type === 'image') {
            const allowedStyles = ['standard', 'web'];

            const style = allowedStyles.includes(item.style)
              ? item.style
              : 'standard';

            // Only allow local image paths or HTTPS URLs
            const src = String(item.src || '');

            const imageSrc = src.startsWith('assets/')
              ? root + src
              : src;

            if (
              !src ||
              !(
                src.startsWith('assets/images/') ||
                src.startsWith('https://')
              )
            ) {
              return '';
            }

            return `
              <figure class="article-image article-image-${style}">

                ${style === 'web' ? `
                  <div class="article-web-toolbar" aria-hidden="true">
                    <div class="article-web-buttons">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div class="article-web-address">
                      ${escapeHTML(item.address || 'x.com')}
                    </div>

                    <div class="article-web-menu">•••</div>
                  </div>
                ` : ''}

                <img
                  src="${escapeHTML(imageSrc)}"
                  alt="${escapeHTML(item.alt || '')}"
                  loading="lazy"
                >

                ${item.caption ? `
                  <figcaption>
                    ${formatText(item.caption)}
                  </figcaption>
                ` : ''}
              </figure>
            `;
          }

          return '';

        }).join('');
      };


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


        else if (s.type === 'excerpt') {
          content = `
            <div class="excerpt-card">

              ${s.bookTitle || s.author || s.source ? `
                <div class="excerpt-source">

                  ${s.bookTitle ? `
                    <span class="excerpt-book">
                      ${escapeHTML(s.bookTitle)}
                    </span>
                  ` : ''}

                  ${s.author ? `
                    <span class="excerpt-author">
                      by ${escapeHTML(s.author)}
                    </span>
                  ` : ''}

                  ${s.source ? `
                    <span class="excerpt-location">
                      ${escapeHTML(s.source)}
                    </span>
                  ` : ''}

                </div>
              ` : ''}

              <div class="excerpt-text">
                ${paragraphs(s.paragraphs)}
              </div>

            </div>
          `;
        }



        else if (s.type === 'diary') {
          content = `

            ${s.introduction ? `
              <div class="diary-introduction">
                ${paragraphs(
                  Array.isArray(s.introduction)
                    ? s.introduction
                    : [s.introduction]
                )}
              </div>
            ` : ''}

            <div class="diary-wrap">

              <div class="diary-magic" aria-hidden="true">
                <span>✦</span>
                <span>✧</span>
                <span>✳</span>
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✳</span>
                <span>✧</span>
              </div>

              <div class="diary-journal">


              <div class="diary-topline">
                <span class="diary-category">
                  ${escapeHTML(s.label || 'The Personal Journal')}
                </span>
                <span class="diary-symbol" aria-hidden="true">✦</span>
              </div>

              ${s.date ? `
                <div class="diary-date">
                  ${escapeHTML(s.date)}
                </div>
              ` : ''}

              ${s.diaryTitle ? `
                <h3 class="diary-title">
                  ${formatText(s.diaryTitle)}
                </h3>
              ` : ''}

              <div class="diary-entries">
                ${(s.entries || []).map((entry, index) => `
                  ${index > 0 ? `
                    <div class="diary-divider" aria-hidden="true">
                      <span>✧</span>
                    </div>
                  ` : ''}

                  <div class="diary-entry">
                    ${paragraphs(
                      Array.isArray(entry) ? entry : [entry]
                    )}
                  </div>
                `).join('')}
              </div>

              ${s.signature ? `
                <div class="diary-signature">
                  ${formatText(s.signature)}
                </div>
              ` : ''}

            </div>
          `;
        }



        else if (s.type === 'books') {
          content = `
            <div class="book-list">
              ${(s.items || []).map(book => {

            const epubPath = book.epub
              ? root + 'assets/epubs/' + encodeURIComponent(book.epub)
              : '';

            return `
                  <article class="book-card">

                    <div class="book-header">
                      <div class="book-heading">
                        <h3>${escapeHTML(book.title || '')}</h3>
                        <div class="book-author">
                          by ${escapeHTML(book.author || '')}
                        </div>
                      </div>


                    ${book.rating ? `
                      <div class="book-rating">
                        <span class="book-rating-badge">
                          ${escapeHTML(book.rating)}
                        </span>
                      </div>
                    ` : ''}

                    </div>

                    ${book.summary ? `
                      <div class="book-summary">
                        ${paragraphs(
              Array.isArray(book.summary)
                ? book.summary
                : [book.summary]
            )}
                      </div>
                    ` : ''}


                    ${(book.warnings?.length || book.tags?.length) ? `
                      <div class="book-tags">

                        ${(book.warnings || []).map(warning => {
              const neutralWarnings = [
                'No Archive Warnings Apply',
                'Creator Chose Not To Use Archive Warnings'
              ];

              const isNeutral = neutralWarnings.some(
                item => item.toLowerCase() === warning.trim().toLowerCase()
              );

              return `
                            <span class="book-tag ${isNeutral
                  ? 'book-tag-warning-neutral'
                  : 'book-tag-warning'}">
                              ${escapeHTML(warning)}
                            </span>
                          `;
            }).join('')}

                        ${(book.tags || []).map(tag => `
                          <span class="book-tag">
                            ${escapeHTML(tag)}
                          </span>
                        `).join('')}

                      </div>
                    ` : ''}


                    ${book.words ? `
                      <div class="book-wordcount">
                        <span class="book-meta-label">Length</span>
                        ${escapeHTML(String(book.words))} words
                      </div>
                    ` : ''}

                    ${epubPath ? `
                      <a class="book-download"
                        href="${epubPath}"
                        download>
                        Download EPUB
                        <span aria-hidden="true">↓</span>
                      </a>
                    ` : ''}

                  </article>
                `;
          }).join('')}
            </div>
          `;
        }

        else if (s.type === 'photocollage') {
          // Images are paths relative to the website root, e.g. assets/images/photo.jpg.
          // Each photograph may have a handwritten note and a rotation angle.
          const photos = (s.photos || []).map((photo, index) => {
            const angle = Math.max(-14, Math.min(14, Number(photo.rotate) || 0));
            const position = ['left', 'center', 'right'].includes(photo.notePosition)
              ? photo.notePosition : 'center';
            const photoPath = String(photo.src || '').replace(/^\/+/, '');
            const imageSrc = photoPath && !/^(?:javascript:|data:)/i.test(photoPath)
              ? `${root}${escapeHTML(photoPath)}` : '';
            return `
              <figure class="collage-photo" style="--photo-angle: ${angle}deg">
                <span class="collage-pin" aria-hidden="true"></span>
                ${imageSrc ? `<img src="${imageSrc}" alt="${escapeHTML(photo.alt || `Photo ${index + 1}`)}" loading="lazy">` : '<div class="collage-photo-placeholder">Add a photo</div>'}
                ${photo.note ? `<figcaption class="collage-handwriting collage-note-${position}">${escapeHTML(photo.note)}</figcaption>` : ''}
              </figure>
            `;
          }).join('');

          content = `
            <div class="collage-layout ${s.paragraphs && s.paragraphs.length ? 'collage-has-text' : ''}">
              <div class="collage-board" aria-label="Pinned photograph collage">${photos}</div>
              ${(s.paragraphs || []).length ? `
                <div class="collage-prose section-body">
                  ${paragraphs(s.paragraphs)}
                </div>
              ` : ''}
            </div>
          `;
        }

        else if (s.type === 'notes') {
          const allowedDoodles = [
            'heart', 'star', 'sparkle', 'arrow',
            'flower', 'wave', 'question', 'spiral'
          ];

          const doodles = (s.doodles || [])
            .filter(d => allowedDoodles.includes(d));

          content = `
            <div class="notes-paper">

              ${s.label ? `
                <div class="notes-label">
                  ${escapeHTML(s.label)}
                </div>
              ` : ''}

              <div class="notes-content">
                ${(s.notes || []).map(note => {
            const text = typeof note === 'string'
              ? note
              : note.text || '';

            const style = typeof note === 'string'
              ? 'normal'
              : note.style || 'normal';

            const allowedStyles = [
              'normal', 'emphasis', 'small',
              'crossed', 'highlight'
            ];

            const safeStyle = allowedStyles.includes(style)
              ? style
              : 'normal';

            return `
                    <p class="notes-entry notes-${safeStyle}">
                      ${formatText(text)}
                    </p>
                  `;
          }).join('')}
              </div>

              ${doodles.length ? `
                <div class="notes-doodles" aria-hidden="true">
                  ${doodles.map(d => `
                    <span class="notes-doodle notes-doodle-${d}">
                      ${({
              heart: '♡',
              star: '☆',
              sparkle: '✧',
              arrow: '↝',
              flower: '✿',
              wave: '〰',
              question: '???',
              spiral: '◎'
            })[d]}
                    </span>
                  `).join('')}
                </div>
              ` : ''}

              ${s.signature ? `
                <div class="notes-signature">
                  ${escapeHTML(s.signature)}
                </div>
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

          ${paragraphs(
        Array.isArray(data.introduction)
          ? data.introduction
          : [data.introduction]
      )}

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
