/* =========================================================================
   Kivixa landing page — interaction layer
   Scroll reveals, glass micro-interactions, nav, accordion, copy, menu.
   No dependencies. Works on GitHub Pages as-is.
   ========================================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     0. Release metadata
     --------------------------------------------------------------- */
  var release = window.KivixaRelease;
  var releaseVersion = release && release.version;
  var releaseTag = release && release.tag;

  if (releaseVersion && releaseTag) {
    Array.prototype.slice.call(document.querySelectorAll("[data-release-version]")).forEach(
      function (element) {
        element.textContent = "v" + releaseVersion;
      }
    );

    var releaseBaseUrl =
      "https://github.com/990aa/Kivixa/releases/download/" + encodeURIComponent(releaseTag) + "/";
    Array.prototype.slice.call(document.querySelectorAll("[data-release-asset]")).forEach(
      function (link) {
        var asset = link.getAttribute("data-release-asset").replace("{version}", releaseVersion);
        link.href = releaseBaseUrl + encodeURIComponent(asset);
      }
    );
  }

  /* ---------------------------------------------------------------
     1. Scroll progress + frosted header state
     --------------------------------------------------------------- */
  var header = document.querySelector("[data-header]");
  var progressBar = document.querySelector(".scroll-progress span");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 8);

    if (progressBar) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? Math.min(y / docH, 1) : 0;
      progressBar.style.width = (pct * 100).toFixed(2) + "%";
    }
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     2. Entrance reveals (staggered via --d custom property)
     --------------------------------------------------------------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     3. Active nav link tracking
     --------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (navLinks.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------------
     4. Mobile menu
     --------------------------------------------------------------- */
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      mobileMenu.hidden = false;
    } else {
      mobileMenu.hidden = true;
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      var open = menuToggle.getAttribute("aria-expanded") === "true";
      setMenu(!open);
    });

    mobileMenu.addEventListener("click", function (event) {
      if (event.target.tagName === "A") setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  /* ---------------------------------------------------------------
     5. FAQ accordion (single-open)
     --------------------------------------------------------------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));

  faqItems.forEach(function (item) {
    var trigger = item.querySelector(".faq-q");
    if (!trigger) return;

    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        var btn = other.querySelector(".faq-q");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------------------------------------------------------------
     6. Copy-to-clipboard buttons
     --------------------------------------------------------------- */
  var copyButtons = Array.prototype.slice.call(document.querySelectorAll("[data-copy]"));

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      /* no-op */
    }
    document.body.removeChild(area);
  }

  copyButtons.forEach(function (button) {
    var label = button.textContent;
    var timer = null;

    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy") || "";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }

      button.textContent = "Copied";
      button.classList.add("is-done");
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        button.textContent = label;
        button.classList.remove("is-done");
      }, 1800);
    });
  });

  /* ---------------------------------------------------------------
     7. Pointer-tracked glow on glass cards
     --------------------------------------------------------------- */
  var glowCards = Array.prototype.slice.call(
    document.querySelectorAll("[data-tilt], .mini, .bento-card")
  );

  if (!reducedMotion && window.matchMedia("(hover: hover)").matches) {
    glowCards.forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width) * 100 + "%");
        card.style.setProperty("--my", ((event.clientY - rect.top) / rect.height) * 100 + "%");
      });
    });
  }

  /* ---------------------------------------------------------------
     8. Gentle hero parallax on the floating glass panels
     --------------------------------------------------------------- */
  var heroVisual = document.querySelector(".hero-visual");

  if (heroVisual && !reducedMotion) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY || window.pageYOffset;
        if (y > window.innerHeight * 1.2) return;
        heroVisual.style.transform = "translate3d(0," + y * -0.045 + "px,0)";
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------------
     9. Smooth in-page navigation with header offset
     --------------------------------------------------------------- */
  document.addEventListener("click", function (event) {
    var anchor = event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (!anchor) return;

    var id = anchor.getAttribute("href");
    if (!id || id === "#") return;

    var target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();
    var offset = header ? header.offsetHeight + 24 : 96;
    var top = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - offset;

    window.scrollTo({ top: Math.max(top, 0), behavior: reducedMotion ? "auto" : "smooth" });

    if (history.replaceState) history.replaceState(null, "", id);
  });
})();
