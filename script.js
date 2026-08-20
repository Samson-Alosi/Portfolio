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
    const saveInquiryToSupabase = async function (payload) {
      const config = window.SUPABASE_CONFIG || {};
      const hasSupabase = config.url && config.anonKey && !config.url.includes('YOUR_PROJECT_REF') && !config.anonKey.includes('YOUR_SUPABASE_ANON_KEY');

      if (!hasSupabase) {
        return false;
      }

      const response = await fetch(`${config.url}/rest/v1/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`
        },
        body: JSON.stringify({
          ...payload,
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to save inquiry.");
      }

      return true;
    };

    contactForm.reset();

    window.addEventListener("pageshow", function () {
      contactForm.reset();
    });

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const button = contactForm.querySelector("button[type='submit']");
      const originalText = button.textContent;
      const formData = new FormData(contactForm);
      const payload = {
        first_name: formData.get("firstName") || "",
        last_name: formData.get("lastName") || "",
        email: formData.get("email") || "",
        interest: formData.get("interest") || "",
        message: formData.get("message") || "",
        source: "website"
      };

      button.textContent = "Sending...";
      button.disabled = true;

      try {
        const savedToSupabase = await saveInquiryToSupabase(payload);

        if (savedToSupabase) {
          button.textContent = "Inquiry saved";
        } else {
          contactForm.submit();
          return;
        }
      } catch (error) {
        console.error("Supabase save failed:", error);
        contactForm.submit();
        return;
      }

      setTimeout(function () {
        button.textContent = originalText;
        button.disabled = false;
        contactForm.reset();
      }, 2000);
    });
  }
});
