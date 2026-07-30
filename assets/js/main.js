document.documentElement.classList.add("is-ready");

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const siteMenu = document.getElementById("siteMenu");
  const menuLinks = document.querySelectorAll(".site-menu a");

  if (menuToggle && siteMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteMenu.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "メニューを閉じる" : "メニューを開く"
      );
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        siteMenu.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "メニューを開く");
      });
    });
  }

  const revealItems = document.querySelectorAll(".js-reveal");

  if ("IntersectionObserver" in window && revealItems.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const galleryMarquee = document.getElementById("galleryMarquee");
  const galleryCards = document.querySelectorAll(".gallery-card");
  const galleryInfo = document.getElementById("galleryInfo");
  let galleryPaused = false;

  if (galleryMarquee && galleryCards.length > 0 && galleryInfo) {
    galleryCards.forEach((card) => {
      card.addEventListener("click", () => {
        galleryPaused = !galleryPaused;
        galleryMarquee.classList.toggle("is-paused", galleryPaused);

        galleryCards.forEach((item) => item.classList.remove("is-active"));
        card.classList.add("is-active");

        const title = card.dataset.title || "";
        const desc = card.dataset.desc || "";

        galleryInfo.innerHTML = `
          <h3>${title}</h3>
          <p>${desc}</p>
        `;
      });
    });
  }
});

