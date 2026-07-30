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

  const revealItems = document.querySelectorAll(".reveal-target");
  if ("IntersectionObserver" in window && revealItems.length > 0) {
    revealItems.forEach((item) => item.classList.add("reveal-prepared"));

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
  }

  const galleryMarquee = document.getElementById("galleryMarquee");
  const galleryTrack = document.getElementById("galleryTrack");
  const galleryCards = document.querySelectorAll(".gallery-card");
  const galleryInfo = document.getElementById("galleryInfo");

  if (galleryMarquee && galleryTrack && galleryCards.length > 0 && galleryInfo) {
    let position = 0;
    let autoSpeed = 0.45;
    let currentSpeed = autoSpeed;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let dragMoved = false;
    let velocity = 0;
    let momentum = 0;
    let animationId = null;

    const updateGallery = () => {
      const halfWidth = galleryTrack.scrollWidth / 2;

      position -= currentSpeed;
      position -= momentum;

      if (position <= -halfWidth) {
        position += halfWidth;
      }

      if (position > 0) {
        position -= halfWidth;
      }

      momentum *= 0.95;
      if (Math.abs(momentum) < 0.02) {
        momentum = 0;
      }

      galleryTrack.style.transform = `translate3d(${position}px, 0, 0)`;
      animationId = requestAnimationFrame(updateGallery);
    };

    const stopAnimation = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };

    const startAnimation = () => {
      stopAnimation();
      animationId = requestAnimationFrame(updateGallery);
    };

    const pointerDown = (clientX) => {
      isDragging = true;
      dragMoved = false;
      startX = clientX;
      lastX = clientX;
      velocity = 0;
      currentSpeed = 0;
      momentum = 0;
      galleryMarquee.classList.add("is-dragging");
    };

    const pointerMove = (clientX) => {
      if (!isDragging) return;

      const delta = clientX - lastX;
      if (Math.abs(clientX - startX) > 3) {
        dragMoved = true;
      }

      position += delta;
      velocity = delta;
      lastX = clientX;

      const halfWidth = galleryTrack.scrollWidth / 2;

      if (position <= -halfWidth) {
        position += halfWidth;
      }

      if (position > 0) {
        position -= halfWidth;
      }

      galleryTrack.style.transform = `translate3d(${position}px, 0, 0)`;
    };

    const pointerUp = () => {
      if (!isDragging) return;

      isDragging = false;
      galleryMarquee.classList.remove("is-dragging");
      currentSpeed = autoSpeed;
      momentum = velocity * 0.6;
    };

    galleryMarquee.addEventListener("mousedown", (e) => {
      pointerDown(e.clientX);
    });

    window.addEventListener("mousemove", (e) => {
      pointerMove(e.clientX);
    });

    window.addEventListener("mouseup", () => {
      pointerUp();
    });

    galleryMarquee.addEventListener(
      "touchstart",
      (e) => {
        pointerDown(e.touches[0].clientX);
      },
      { passive: true }
    );

    galleryMarquee.addEventListener(
      "touchmove",
      (e) => {
        pointerMove(e.touches[0].clientX);
      },
      { passive: true }
    );

    galleryMarquee.addEventListener("touchend", () => {
      pointerUp();
    });

    galleryCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (dragMoved) {
          e.preventDefault();
          return;
        }

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

    startAnimation();
  }
});
