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
   - This site renders posts client-side from `/posts/<slug>.md`.
   - Run `npm run build-posts-index` after adding or editing a post. It updates `/posts/index.json` and `/sitemap.xml`, and generates a static `/blog/<slug>.html` page with Open Graph and Twitter Card metadata for social previews.
   - Use `/blog/<slug>.html` links when sharing posts so social platforms can display the assigned image, title, and description. The older `/blog/post.html?post=<slug>` route remains available for compatibility.
   - To add new posts via CMS and have them appear in the blog list automatically, update `blog/index.html`'s `posts` array or implement a posts index build step.
    - To add new posts via CMS and have them appear in the blog list automatically, implement the posts index build step below.

5. Recommended next steps
   - Ensure your Netlify build runs `npm run build-posts-index` so the post listing and social-preview pages are regenerated during deployment.
   - Add Giscus or another comment system to `blog/post.html` for engagement.
