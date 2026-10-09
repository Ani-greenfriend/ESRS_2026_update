Read CLAUDE.md and PROGRESS.md in the project root, then start session 1 following the Session Protocol.

Do First Session Setup (docs/, docs/reference/; move prototype-reference.html, the final mockup, into docs/reference/), then confirm Supabase project ref jfalwveuccerzeffxftx with me and check it is still empty before you build into it.

Notes from me for this session (spec v1.9):
- Look, copy and voice come from docs/reference/prototype-reference.html. Voice: warm, light, short answer first, small icons and tips, "we" for greenfriend. Keep the spec's wording for tags, tooltips and source (i) references.
- The Netlify environment variables were entered by hand, not by the Supabase extension: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY. Verify the names, and that the key values start with sb_, on the first live build.
- Cloudflare Turnstile is NOT part of version 1: no bot check, no Turnstile keys.
- Add a netlify.toml: build command `npm run build`, publish directory `dist`, functions directory `netlify/functions`.
- Unlock form: email only, plus one optional unticked box "greenfriend may contact me about my results (optional)". No newsletter, no company, industry or interests fields; button "Get it free". Keep the table columns and leave them empty.
- Use only EFRAG-derived datapoint figures (292 / 31 / 491 / 269; revised = 323 with the 31 general datapoints). Other details (estimator line, services labels, "Why the numbers differ" toggle, GDR chip) are in product-spec.md Section 8; if the mockup already shows them, follow the mockup.
- Self-host the fonts (no Google Fonts), no analytics, no on-page PDF preview.

Work through Remaining work in order and make a save point after each module.
