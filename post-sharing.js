(function () {
  const encode = encodeURIComponent;

  function setStatus(message) {
    document.getElementById('post-share-status').textContent = message;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    textArea.remove();
    if (!copied) {
      throw new Error('Clipboard copy was not available');
    }
  }

  window.initializePostSharing = function (title, postUrl) {
    const shareText = `${title}\n${postUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encode(shareText)}`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encode(title)}&url=${encode(postUrl)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encode(postUrl)}&quote=${encode(title)}`;

    document.getElementById('share-whatsapp').href = whatsappUrl;
    document.getElementById('share-x').href = xUrl;
    document.getElementById('share-facebook').href = facebookUrl;
    document.title = `${title} — Samson Alosi Obongo`;
    document.getElementById('post-share').hidden = false;

    document.getElementById('copy-post-link').addEventListener('click', async function () {
      try {
        await copyText(shareText);
        setStatus('Post title and link copied.');
      } catch {
        setStatus('Could not copy automatically. Please copy the post link from your browser address bar.');
      }
    });

    document.getElementById('share-instagram').addEventListener('click', async function () {
      if (navigator.share) {
        try {
          await navigator.share({ title, text: title, url: postUrl });
          setStatus('Share options opened.');
        } catch (error) {
          if (error.name !== 'AbortError') {
            setStatus('Could not open sharing options. Try copying the post link instead.');
          }
        }
        return;
      }

      try {
        await copyText(shareText);
        setStatus('Post title and link copied. Paste them into Instagram.');
      } catch {
        setStatus('Instagram does not support direct web sharing here. Please copy the post link from your browser address bar.');
      }
    });
  };
})();
