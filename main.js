document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const yearSpan = document.getElementById("year");
  const navToggle = document.querySelector(".nav-toggle");
  const desktopNav = document.querySelector(".desktop-nav");
  const contactForm = document.getElementById("contact-form");
  const quoteForm = document.getElementById("quote-request-form");
  const successModal = document.getElementById("success-modal");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    if (!navbar) return;
    const currentScrollY = window.scrollY;

    // Apply background styling when scrolled
    if (currentScrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Toggle hamburger visibility based on scroll direction (only if menu is not currently open)
    const isMenuOpen =
      desktopNav && desktopNav.classList.contains("mobile-open");
    if (!isMenuOpen) {
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down past 50px: show
        navbar.classList.remove("nav-hidden");
      } else if (currentScrollY < lastScrollY && currentScrollY > 50) {
        // Scrolling up: hide
        navbar.classList.add("nav-hidden");
      } else if (currentScrollY <= 50) {
        // Always show when at the very top
        navbar.classList.remove("nav-hidden");
      }
    }

    lastScrollY = currentScrollY;
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

  if (navToggle && desktopNav) {
    navToggle.addEventListener("click", () => {
      const opened = desktopNav.classList.toggle("mobile-open");
      if (!opened) {
        // closing mobile menu: ensure dropdowns are closed
        document.querySelectorAll(".nav-item.dropdown.open").forEach((n) => {
          n.classList.remove("open");
          const b = n.querySelector(".dropdown-toggle");
          if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  if (successModal) {
    successModal.addEventListener("click", (event) => {
      if (
        event.target === successModal ||
        event.target.hasAttribute("data-close-modal")
      ) {
        successModal.classList.remove("visible");
        successModal.setAttribute("aria-hidden", "true");
      }
    });
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    // Web3Forms configuration - Free email forwarding service
    // Get your key at: https://web3forms.com
    const accessKey = "16874b53-6f89-4579-be42-91d7b8f8dbf5";

    const formData = new FormData(form);
    formData.append("access_key", accessKey);
    formData.append("subject", "New Website Contact/Quote Request");

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : "Submit";
    if (submitBtn) {
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        if (successModal) {
          successModal.classList.add("visible");
          successModal.setAttribute("aria-hidden", "false");
        }
        form.reset();
      } else {
        alert("Something went wrong submitting the form: " + data.message);
      }
    } catch (error) {
      console.error("Form submit error", error);
      alert(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  };

  if (contactForm && successModal) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  if (quoteForm && successModal) {
    quoteForm.addEventListener("submit", handleFormSubmit);
  }

  const filterTabs = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-category]");

  if (filterTabs.length && projectCards.length) {
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.getAttribute("data-filter");
        filterTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        projectCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          if (!filter || filter === "all" || category === filter) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Trigger animations when elements scroll into view.
  // Adds `.in-view` which starts animations defined in CSS.
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  // include project images so they get `.in-view` when scrolled into view
  // include hero image so it fades in when scrolled into view
  const animTargets = document.querySelectorAll(
".tracking-in-expand-fwd, .animate__zoomIn, .animate__fadeIn, .animate__slideInLeft, .project-image, .hero-image, .testimonial-card"
  );

  if (animTargets.length) {
    if (prefersReduced) {
      // Respect reduced motion — immediately reveal without animation
      animTargets.forEach((el) => el.classList.add("in-view"));
    } else {
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );

      animTargets.forEach((el) => io.observe(el));
    }
  }

  // If we are on the services page and a hash is present, populate the
  // dedicated hero and selected-service block with the matching service.
  if (
    window.location.pathname.endsWith("services.html") ||
    window.location.pathname.endsWith("/services.html")
  ) {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const serviceEl = document.getElementById(hash);
      const hero = document.getElementById("service-hero");
      const heroBg = hero && hero.querySelector(".service-hero-bg");
      const heroTitle = hero && hero.querySelector(".service-hero-title");

      if (serviceEl && hero && heroBg && heroTitle) {
        // Pull content and image from the service block
        const content = serviceEl.querySelector(".service-content");
        const mediaImg = serviceEl.querySelector(".service-media img");

        // Set hero title to the service name + " Installation"
        const h2 = content.querySelector("h2");
        heroTitle.textContent = h2
          ? h2.textContent + " Installation"
          : "Service";

        // Use the media image as the hero background if available
        if (mediaImg && mediaImg.src) {
          heroBg.style.backgroundImage = `url(${mediaImg.src})`;
          // trigger fade-in on background
          setTimeout(() => heroBg.classList.add("in-view"), 60);
        }

        // Build the selected-service white block and inject content
        const servicesLayout = document.querySelector(".services-layout");
        let selected = document.getElementById("selected-service-block");
        if (!selected) {
          selected = document.createElement("section");
          selected.id = "selected-service-block";
          selected.className = "selected-service";
          selected.innerHTML = `
            <div class="container">
              <div class="selected-service-inner">
                <div class="service-content-outer"></div>
                <div class="service-media"></div>
              </div>
            </div>`;
          // Insert selected block right after the hero
          if (hero.parentNode)
            hero.parentNode.insertBefore(selected, hero.nextSibling);
        }

        const destContent = selected.querySelector(".service-content-outer");
        const destMedia = selected.querySelector(".service-media");
        destContent.innerHTML = content ? content.innerHTML : "";
        destMedia.innerHTML = mediaImg
          ? `<img src="${mediaImg.src}" alt="${mediaImg.alt}" />`
          : "";

        // Scroll to hero smoothly so user sees the full-bleed image then the white content
        setTimeout(() => {
          hero.setAttribute("aria-hidden", "false");
          hero.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    }
  }

  // Dropdown toggle handling for Services menu (click for mobile, keyboard accessible)
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  if (dropdownToggles.length) {
    dropdownToggles.forEach((btn) => {
      const parent = btn.closest(".nav-item.dropdown");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const isOpen = parent.classList.toggle("open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      btn.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          parent.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
          const first = parent.querySelector(".dropdown-menu a");
          if (first) first.focus();
        } else if (e.key === "Escape") {
          parent.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
          btn.focus();
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (ev) => {
      dropdownToggles.forEach((btn) => {
        const parent = btn.closest(".nav-item.dropdown");
        if (!parent) return;
        if (!parent.contains(ev.target)) {
          parent.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
    });
  }
});

// Performance: lazy-load non-navbar images, enable async decoding,
// and set width/height where possible to reduce layout shift (CLS).
(() => {
  try {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      // Skip critical UI images (logo and social icons) to keep them eager
      if (
        img.classList.contains("logo-img") ||
        img.closest(".social-links") ||
        img.closest(".navbar")
      )
        return;

      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.decoding) img.decoding = "async";

      // If dimensions are not set, use natural size once available to avoid layout shifts
      if (!img.hasAttribute("width") || !img.hasAttribute("height")) {
        if (img.complete && img.naturalWidth) {
          img.setAttribute("width", img.naturalWidth);
          img.setAttribute("height", img.naturalHeight);
        } else {
          img.addEventListener(
            "load",
            () => {
              if (img.naturalWidth) {
                img.setAttribute("width", img.naturalWidth);
                img.setAttribute("height", img.naturalHeight);
              }
            },
            { once: true },
          );
        }
      }
    });
  } catch (e) {
    // Fail silently — this is a progressive enhancement
    // eslint-disable-next-line no-console
    console &&
      console.warn &&
      console.warn("Image performance enhancement failed", e);
  }
})();
