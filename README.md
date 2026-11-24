# Siddharth Katabathula’s portfolio

Hand-built static website hosted with GitHub Pages at https://siddharthk.is-a.dev/.

The homepage uses `css/style.new.css`, `css/css.css`, `css/custom_carousel.css`, and `js/carousel.js`. No build step is required.

## Deploy to Node01

The **Deploy website to Node01** workflow runs after a push to `main`. A GitHub-hosted runner joins the tailnet, connects to Node01 over OpenSSH, and fast-forwards the checkout Nginx serves. You can also run it from the repository's Actions tab on `main`.

1. In [Tailscale access controls](https://login.tailscale.com/admin/acls), create `tag:website-deploy` and grant it TCP port 22 access to Node01's Tailscale IP. In [Trust credentials](https://login.tailscale.com/admin/settings/trust-credentials), create a federated identity with issuer `https://token.actions.githubusercontent.com`, subject `repo:kingsiddhu/kingsiddhu.github.io:ref:refs/heads/main`, the Auth Keys write scope, and `tag:website-deploy`. For the custom claim rule, match `workflow_ref` to `kingsiddhu/kingsiddhu.github.io/.github/workflows/deploy-node01.yml@refs/heads/main`.
2. From a directory outside the repo on a trusted computer, run `ssh-keygen -t ed25519 -f website-deploy` and leave the passphrase blank for unattended use. Copy `scripts/deploy-node01.sh` to Node01 with Unix line endings and install it as `/usr/local/bin/deploy-website` using `sudo install -o root -g root -m 0755 deploy-node01.sh /usr/local/bin/deploy-website`. Use the existing checkout owner as the deployment user on Node01's OpenSSH server. Confirm that this user can write to the checkout, Nginx can read it, the checked-out branch is `main`, and `origin` points to this GitHub repo. Append the following line to the deployment user's `~/.ssh/authorized_keys`, substituting the actual checkout path and the complete contents of `website-deploy.pub`.

   ```text
   restrict,command="/usr/local/bin/deploy-website '/absolute/path/to/live/checkout'" ssh-ed25519 REPLACE_WITH_DEPLOY_PUBLIC_KEY
   ```

3. Under [Settings → Secrets and variables → Actions](https://github.com/kingsiddhu/kingsiddhu.github.io/settings/secrets/actions), enter these settings. For the host key, take the key type and key from Node01's `/etc/ssh/ssh_host_ed25519_key.pub` over an already trusted session. Use Node01's Tailscale hostname or IP as the first field of the `known_hosts` line.

   | Setting | Type | Value |
   | --- | --- | --- |
   | `TS_CLIENT_ID` | Variable | Tailscale federated identity client ID |
   | `TS_AUDIENCE` | Variable | Tailscale federated identity audience |
   | `WEBSITE_SSH_HOST` | Variable | Node01's full Tailscale hostname or Tailscale IP |
   | `WEBSITE_SSH_USER` | Variable | Linux user who owns the live checkout |
   | `WEBSITE_SSH_KNOWN_HOSTS` | Variable | One line in the form `HOST ssh-ed25519 HOST_PUBLIC_KEY` |
   | `WEBSITE_SSH_PRIVATE_KEY` | Secret | Full contents of the generated `website-deploy` private key |

4. Push the workflow to `main` and check its Actions log for `Website deployed at` and the new commit SHA. If a run fails, fix the reported issue and rerun it. The deployment stops if the checkout has tracked edits, is on the wrong branch, or has commits that have diverged from or are ahead of GitHub.

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
