Netlify CMS setup (quick notes)

1. Admin UI
   - Visit `/admin/` (e.g., https://your-site.netlify.app/admin/) after deploying to Netlify.
   - The CMS reads `/admin/config.yml` to show collections.

2. Authentication
   - For the `git-gateway` backend, enable Git Gateway in your Netlify site's settings and connect to a Git provider.
   - Alternatively change `backend` to `github` and provide OAuth details.

3. Posts
   - Create posts via the CMS — they will be saved to `/posts/` as Markdown files.
   - This repository includes one example post at `/posts/sample-first-post.md`.

4. Rendering
   - This site renders posts client-side: `/blog/post.html?post=sample-first-post` will load `/posts/sample-first-post.md` and render it.
   - To add new posts via CMS and have them appear in the blog list automatically, update `blog/index.html`'s `posts` array or implement a posts index build step.

5. Recommended next steps
   - Add a build step to generate a JSON index of posts during deploy (Netlify build plugin or a small script) so the blog list is dynamic.
   - Add Giscus or another comment system to `blog/post.html` for engagement.
