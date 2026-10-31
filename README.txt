FIXED NEWSLETTER

Open index.html (or deploy the whole folder to your existing host).

Each page loads only its own content file:
- pages/issue_001.html -> assets/js/pages/issue-001.js
- pages/issue_002.html -> assets/js/pages/issue-002.js
- pages/about.html -> assets/js/pages/about.js

To add another issue, copy an existing HTML page, update body data-page and its script reference, create a corresponding JS content file, and add the issue link to assets/js/config.js.

No build tools or imports required.
