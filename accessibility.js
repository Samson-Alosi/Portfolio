(function () {
  const storageKey = "samson-portfolio-accessibility";
  const textScales = [1, 1.1, 1.2, 1.3, 1.4, 1.5];
  const defaultSettings = {
    textScale: 1,
    highContrast: false,
    underlineLinks: false
  };

  function loadSettings() {
    try {
      const savedSettings = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return {
        textScale: textScales.includes(savedSettings.textScale) ? savedSettings.textScale : 1,
        highContrast: savedSettings.highContrast === true,
        underlineLinks: savedSettings.underlineLinks === true
      };
    } catch (error) {
      console.warn("Accessibility preferences could not be loaded.", error);
      return { ...defaultSettings };
    }
  }

  let settings = loadSettings();

  const toolbar = document.createElement("aside");
  toolbar.className = "a11y-toolbar";
  toolbar.innerHTML = `
    <button class="a11y-toolbar-toggle" type="button" aria-expanded="false" aria-controls="a11y-toolbar-panel">
      <i class="fa-solid fa-universal-access" aria-hidden="true"></i>
      <span>Accessibility</span>
    </button>
    <section class="a11y-toolbar-panel" id="a11y-toolbar-panel" aria-labelledby="a11y-toolbar-title" hidden>
      <h2 id="a11y-toolbar-title">Accessibility options</h2>
      <div class="a11y-text-controls" role="group" aria-label="Text size">
        <button type="button" data-text-size="decrease" aria-label="Decrease text size">A−</button>
        <output class="a11y-text-size" aria-live="polite"></output>
        <button type="button" data-text-size="increase" aria-label="Increase text size">A+</button>
      </div>
      <button class="a11y-option" type="button" data-setting="highContrast" aria-pressed="false">High contrast</button>
      <button class="a11y-option" type="button" data-setting="underlineLinks" aria-pressed="false">Underline links</button>
      <button class="a11y-reset" type="button">Reset accessibility settings</button>
    </section>
  `;
  document.body.appendChild(toolbar);

  const toggleButton = toolbar.querySelector(".a11y-toolbar-toggle");
  const panel = toolbar.querySelector(".a11y-toolbar-panel");
  const textSizeOutput = toolbar.querySelector(".a11y-text-size");
  const decreaseButton = toolbar.querySelector('[data-text-size="decrease"]');
  const increaseButton = toolbar.querySelector('[data-text-size="increase"]');
  const highContrastButton = toolbar.querySelector('[data-setting="highContrast"]');
  const underlineLinksButton = toolbar.querySelector('[data-setting="underlineLinks"]');

  function saveSettings() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (error) {
      console.warn("Accessibility preferences could not be saved.", error);
    }
  }

  function applySettings() {
    document.documentElement.style.setProperty("--a11y-font-scale", settings.textScale);
    document.body.classList.toggle("a11y-high-contrast", settings.highContrast);
    document.body.classList.toggle("a11y-underline-links", settings.underlineLinks);

    textSizeOutput.value = `${Math.round(settings.textScale * 100)}%`;
    decreaseButton.disabled = settings.textScale === textScales[0];
    increaseButton.disabled = settings.textScale === textScales[textScales.length - 1];
    highContrastButton.setAttribute("aria-pressed", String(settings.highContrast));
    underlineLinksButton.setAttribute("aria-pressed", String(settings.underlineLinks));
  }

  toggleButton.addEventListener("click", function () {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    panel.hidden = isExpanded;
  });

  decreaseButton.addEventListener("click", function () {
    const currentIndex = textScales.indexOf(settings.textScale);
    if (currentIndex > 0) {
      settings.textScale = textScales[currentIndex - 1];
      applySettings();
      saveSettings();
    }
  });

  increaseButton.addEventListener("click", function () {
    const currentIndex = textScales.indexOf(settings.textScale);
    if (currentIndex < textScales.length - 1) {
      settings.textScale = textScales[currentIndex + 1];
      applySettings();
      saveSettings();
    }
  });

  highContrastButton.addEventListener("click", function () {
    settings.highContrast = !settings.highContrast;
    applySettings();
    saveSettings();
  });

  underlineLinksButton.addEventListener("click", function () {
    settings.underlineLinks = !settings.underlineLinks;
    applySettings();
    saveSettings();
  });

  toolbar.querySelector(".a11y-reset").addEventListener("click", function () {
    settings = { ...defaultSettings };
    applySettings();
    saveSettings();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) {
      panel.hidden = true;
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.focus();
    }
  });

  applySettings();
})();
