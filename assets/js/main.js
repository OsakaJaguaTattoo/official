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
  const galleryInfo = document.getElementById("galleryInfo");

  if (galleryMarquee && galleryTrack && galleryInfo) {
    const originalCards = Array.from(
      galleryTrack.querySelectorAll(".gallery-card")
    );

    if (originalCards.length > 0) {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.classList.remove("is-active");
        galleryTrack.appendChild(clone);
      });
    }

    const galleryCards = Array.from(
      galleryTrack.querySelectorAll(".gallery-card")
    );

    let position = 0;
    const autoSpeed = 0.45;
    let currentSpeed = autoSpeed;
    let isDragging = false;
    let isTouchDragging = false;
    let dragMoved = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let velocity = 0;
    let momentum = 0;
    let animationId = null;
    let touchMode = null;

    const getLoopWidth = () => galleryTrack.scrollWidth / 2;

    const normalizePosition = () => {
      const loopWidth = getLoopWidth();

      if (!loopWidth) return;

      while (position <= -loopWidth) {
        position += loopWidth;
      }

      while (position > 0) {
        position -= loopWidth;
      }
    };

    const render = () => {
      galleryTrack.style.transform = `translate3d(${position}px, 0, 0)`;
    };

    const updateGallery = () => {
      position -= currentSpeed;
      position -= momentum;

      normalizePosition();

      momentum *= 0.95;
      if (Math.abs(momentum) < 0.02) {
        momentum = 0;
      }

      render();
      animationId = requestAnimationFrame(updateGallery);
    };

    const stopAnimation = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const startAnimation = () => {
      stopAnimation();
      animationId = requestAnimationFrame(updateGallery);
    };

    const setActiveCard = (card) => {
      galleryCards.forEach((item) => item.classList.remove("is-active"));
      card.classList.add("is-active");

      const title = card.dataset.title || "";
      const desc = card.dataset.desc || "";

      galleryInfo.innerHTML = `
        <h3>${title}</h3>
        <p>${desc}</p>
      `;
    };

    const beginDrag = (clientX) => {
      isDragging = true;
      dragMoved = false;
      startX = clientX;
      lastX = clientX;
      velocity = 0;
      currentSpeed = 0;
      momentum = 0;
      galleryMarquee.classList.add("is-dragging");
    };

    const moveDrag = (clientX) => {
      if (!isDragging) return;

      const delta = clientX - lastX;

      if (Math.abs(clientX - startX) > 4) {
        dragMoved = true;
      }

      position += delta;
      velocity = delta;
      lastX = clientX;

      normalizePosition();
      render();
    };

    const endDrag = () => {
      if (!isDragging) return;

      isDragging = false;
      galleryMarquee.classList.remove("is-dragging");
      currentSpeed = autoSpeed;
      momentum = velocity * 0.6;
    };

    galleryMarquee.addEventListener("mousedown", (e) => {
      beginDrag(e.clientX);
    });

    window.addEventListener("mousemove", (e) => {
      moveDrag(e.clientX);
    });

    window.addEventListener("mouseup", () => {
      endDrag();
    });

    galleryMarquee.addEventListener(
      "mouseleave",
      () => {
        endDrag();
      },
      { passive: true }
    );

    galleryMarquee.addEventListener(
      "touchstart",
      (e) => {
        const touch = e.touches[0];
        isTouchDragging = true;
        touchMode = null;
        dragMoved = false;
        startX = touch.clientX;
        startY = touch.clientY;
        lastX = touch.clientX;
        velocity = 0;
        momentum = 0;
      },
      { passive: true }
    );

    galleryMarquee.addEventListener(
      "touchmove",
      (e) => {
        if (!isTouchDragging) return;

        const touch = e.touches[0];
        const diffX = touch.clientX - startX;
        const diffY = touch.clientY - startY;

        if (touchMode === null) {
          if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
            touchMode =
              Math.abs(diffX) > Math.abs(diffY) ? "horizontal" : "vertical";

            if (touchMode === "horizontal") {
              beginDrag(touch.clientX);
            }
          }
        }

        if (touchMode === "horizontal") {
          e.preventDefault();
          moveDrag(touch.clientX);
        }
      },
      { passive: false }
    );

    galleryMarquee.addEventListener(
      "touchend",
      () => {
        if (touchMode === "horizontal") {
          endDrag();
        }

        isTouchDragging = false;
        touchMode = null;
      },
      { passive: true }
    );

    galleryMarquee.addEventListener(
      "touchcancel",
      () => {
        if (touchMode === "horizontal") {
          endDrag();
        }

        isTouchDragging = false;
        touchMode = null;
      },
      { passive: true }
    );

    galleryCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (dragMoved) {
          e.preventDefault();
          return;
        }

        setActiveCard(card);
      });
    });

    const initialCard =
      galleryTrack.querySelector(".gallery-card.is-active") || galleryCards[0];

    if (initialCard) {
      setActiveCard(initialCard);
    }

    render();
    startAnimation();
  }
});
