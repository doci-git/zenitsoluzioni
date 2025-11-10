// Mobile Menu Toggle
const mobileToggle = document.querySelector(".mobile-toggle");
const navMenu = document.querySelector(".nav-menu");

mobileToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// Form submission
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Grazie per la tua richiesta! Ti contatteremo al più presto.");
  this.reset();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Header background on scroll
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    header.style.backdropFilter = "blur(10px)";
  } else {
    header.style.backgroundColor = "var(--white)";
    header.style.backdropFilter = "none";
  }
});

// Horizontal scroll gallery controls
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("worksTrack");
  if (!track) return;
  const prevBtn = document.querySelector(".scroll-gallery .prev");
  const nextBtn = document.querySelector(".scroll-gallery .next");

  const step = () => Math.min(track.clientWidth, 600);
  prevBtn && prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -step(), behavior: "smooth" });
    // reset auto scroll on manual action
    stopAuto(); startAuto();
  });
  nextBtn && nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: step(), behavior: "smooth" });
    // reset auto scroll on manual action
    stopAuto(); startAuto();
  });

  // Keyboard support when track is focused
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      track.scrollBy({ left: step(), behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    }
  });

  // Auto-scroll setup
  let autoTimer = null;
  const intervalMs = 3500;
  const atEnd = () => Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 2;
  const tick = () => {
    // pause when lightbox is open
    if (document.body.classList.contains("lightbox-open")) return;
    if (atEnd()) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: step(), behavior: "smooth" });
    }
  };
  const startAuto = () => {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(tick, intervalMs);
  };
  const stopAuto = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } };

  // Pause on hover/focus, resume on leave/blur
  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);
  track.addEventListener("focusin", stopAuto);
  track.addEventListener("focusout", startAuto);

  // Start auto-scroll
  startAuto();
});

// Lightbox open/close + hover zoom handled in CSS
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImage");
  const lbClose = document.querySelector(".lightbox-close");
  const lbPrev = document.querySelector(".lightbox-prev");
  const lbNext = document.querySelector(".lightbox-next");
  if (!lightbox || !lbImg) return;

  // Build ordered list of clickable images
  const clickable = Array.from(document.querySelectorAll(
    ".gallery-grid img, .scroll-gallery .sg-track img"
  ));
  let currentIndex = -1;

  const showAt = (idx) => {
    if (!clickable.length) return;
    // wrap around
    currentIndex = (idx + clickable.length) % clickable.length;
    const src = clickable[currentIndex].getAttribute("src");
    const alt = clickable[currentIndex].getAttribute("alt") || "";
    lbImg.src = src;
    lbImg.alt = alt;
  };

  const openLightbox = (idx) => {
    showAt(idx);
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.body.classList.add("lightbox-open");
  };
  const closeLightbox = () => {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.body.classList.remove("lightbox-open");
    setTimeout(() => { lbImg.src = ""; }, 150);
    currentIndex = -1;
  };

  // Click handlers to open at the right index
  clickable.forEach((img, idx) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(idx));
  });

  // Nav buttons
  lbPrev && lbPrev.addEventListener("click", () => showAt(currentIndex - 1));
  lbNext && lbNext.addEventListener("click", () => showAt(currentIndex + 1));

  // Close handlers
  lbClose && lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("show")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showAt(currentIndex + 1);
    if (e.key === "ArrowLeft") showAt(currentIndex - 1);
  });
});
