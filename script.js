document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector(".navbar-toggler");
  const navMenu = document.getElementById("mainNav");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      navMenu.classList.toggle("show");
    });
  }

  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function () {
      const button = contactForm.querySelector("button[type='submit']");
      const originalText = button.textContent;

      button.textContent = "Inquiry sent";
      button.disabled = true;

      setTimeout(function () {
        button.textContent = originalText;
        button.disabled = false;
        contactForm.reset();
      }, 2000);
    });
  }
});
