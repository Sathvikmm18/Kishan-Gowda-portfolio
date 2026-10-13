const intro = document.getElementById("intro");
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxVideo = document.getElementById("lightboxVideo");
const lightboxClose = document.getElementById("lightboxClose");
const cursor = document.querySelector(".cursor");
const cursorDot = document.querySelector(".cursor-dot");

const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
if (isTouch) document.body.classList.add("touch");

document.body.classList.add("is-locked");

window.setTimeout(() => {
  intro.classList.add("is-done");
  intro.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}, 2800);

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".filters button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".project").forEach((project) => {
      const show = filter === "all" || project.dataset.category === filter;
      project.classList.toggle("is-hidden", !show);
    });
  });
});

document.querySelectorAll(".project").forEach((project) => {
  project.setAttribute("tabindex", "0");
  project.setAttribute("role", "button");
  const preview = project.querySelector("video");
  const open = () => {
    if (project.dataset.video) openVideo(project.dataset.video);
    else openImage(project.dataset.lightbox, project.querySelector("img")?.alt);
  };
  project.addEventListener("click", open);
  project.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
  if (preview && !isTouch) {
    project.addEventListener("mouseenter", () => preview.play().catch(() => {}));
    project.addEventListener("mouseleave", () => {
      preview.pause();
      preview.currentTime = 0;
    });
  }
});

const heroMedia = document.querySelector(".hero__media");
const heroVideo = heroMedia?.querySelector("video");
const heroImage = heroMedia?.querySelector("img");
if (heroVideo) {
  heroVideo.addEventListener("playing", () => {
    if (heroImage) heroImage.style.opacity = "0";
  });
}

window.addEventListener(
  "scroll",
  () => {
    if (!heroMedia) return;
    heroMedia.style.transform = `translate3d(0, ${window.scrollY * 0.18}px, 0)`;
  },
  { passive: true }
);

if (!isTouch) {
  document.querySelectorAll(".service").forEach((service) => {
    service.addEventListener("mouseenter", () => {
      document.querySelectorAll(".service").forEach((item) => item.classList.remove("is-open"));
      service.classList.add("is-open");
    });
  });
}

const showreelStage = document.getElementById("showreelOpen");
const showreelPreview = showreelStage.querySelector("video");
if (showreelPreview && !isTouch) {
  showreelPreview.play().catch(() => {});
}
showreelStage.addEventListener("click", () => openVideo(showreelStage.dataset.video));

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

document.querySelectorAll(".service__row").forEach((row) => {
  row.addEventListener("click", () => {
    const item = row.parentElement;
    const alreadyOpen = item.classList.contains("is-open");
    document.querySelectorAll(".service").forEach((service) => service.classList.remove("is-open"));
    if (!alreadyOpen) item.classList.add("is-open");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal, .project").forEach((el) => observer.observe(el));

if (!isTouch) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll("a, button, .project").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });
}

function openImage(src, alt) {
  stopVideo();
  lightboxVideo.hidden = true;
  lightboxImage.hidden = false;
  lightboxImage.src = src;
  lightboxImage.alt = alt || "";
  lightbox.hidden = false;
  document.body.classList.add("is-locked");
}

function openVideo(src) {
  lightboxImage.hidden = true;
  lightboxImage.src = "";
  lightboxVideo.hidden = false;
  lightboxVideo.src = src;
  lightbox.hidden = false;
  document.body.classList.add("is-locked");
  lightboxVideo.play().catch(() => {});
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  stopVideo();
  document.body.classList.remove("is-locked");
}

function stopVideo() {
  lightboxVideo.pause();
  lightboxVideo.removeAttribute("src");
  lightboxVideo.load();
}
