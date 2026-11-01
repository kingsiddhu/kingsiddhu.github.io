# Siddharth Katabathula’s portfolio

Hand-built static website hosted with GitHub Pages at https://siddharthk.is-a.dev/.

The homepage uses `css/style.new.css`, `css/css.css`, `css/custom_carousel.css`, and `js/carousel.js`. No build step is required.

## Content review — October 22, 2026

- Billify: https://devpost.com/software/bills-simplified — team submission to RevolutionUC 2026, local OCR/redaction and Gemini analysis; redaction validation remains future work.
- HASS: https://devpost.com/software/hass-doom-scrolling-with-a-purpose — team submission to MakeUC 2025; Siddharth’s listed contribution is frontend and backend integration.
- Other project descriptions and skills retain the owner’s existing account; their current completion status could not be independently verified. No new release or credential claims were added.
- Project visuals now use local diagrams, concept illustrations, and an original QACA frontend screenshot. See `img/projects/README.md` for provenance and verification limits. Unfinished placeholder entries were removed.
- Early blog posts are archived. The outdated referral/earnings instructions were retired rather than presented as current advice.

To update projects, keep the title, body, and image tracks in the same order and with equal entry counts. The carousel derives its count from the title track.

The original author permits adapting this code, but asks that you do not make an exact copy of the site.

## Search and AI discovery

The canonical host is `https://siddharthk.is-a.dev`, matching `CNAME`. Public search pages are explicitly listed in `scripts/seo.mjs`; it generates their descriptions, canonical links, Open Graph/Twitter previews, JSON-LD, `sitemap.xml`, and `robots.txt`. Other HTML experiments, duplicates, and utility pages receive `noindex, follow`. Crawling stays allowed so engines can read those directives. This does not make those pages private.

Run `node scripts/seo.mjs` after adding a public page to the list or changing its search description. Run `node scripts/seo.mjs --check` to verify generated files without changing them. No Node dependencies or production build step are required. Sitemap modification dates are intentionally omitted rather than invented.

`llms.txt` provides AI discovery links; `llm.txt` points readers using the singular spelling to it. `index.md` is a concise portfolio summary linked from the homepage metadata. Update these summaries alongside portfolio changes, retaining prototype limitations and team attribution. These files are discovery aids, not ranking guarantees. The logo is the current social preview image.

After deploying through the existing GitHub Pages workflow, submit `https://siddharthk.is-a.dev/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Check the deployed homepage and a blog post with Google's Rich Results Test and URL Inspection. Indexing and search appearance remain search-engine decisions.

## Recruiter-focused update — October 24, 2026

Removed the duplicate Hackathon log and its navigation link. Billify and HASS remain in Projects with team context and write-up links. Added repository links to inspectable projects and replaced all nine stock landscape placeholders with labeled local visuals.

The carousel advances only through visitor input so project descriptions and source links stay readable.
