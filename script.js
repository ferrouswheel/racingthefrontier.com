const BASE_COUNT = 1_201_301;
const countNodes = document.querySelectorAll(".js-count");
const dialog = document.querySelector("#join-dialog");
const joinForm = document.querySelector("#join-form");
const toast = document.querySelector(".toast");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getCount() {
  const localBoost = Number.parseInt(localStorage.getItem("frontier-horsepower") || "0", 10);
  return BASE_COUNT + (Number.isFinite(localBoost) ? localBoost : 0);
}

function updateCounts(value = getCount()) {
  countNodes.forEach((node) => {
    node.textContent = value.toLocaleString("en-US");
  });
}

function animateHeroCount() {
  const heroCount = document.querySelector(".hero .js-count");
  if (!heroCount || reducedMotion) return;

  const finalCount = getCount();
  const startCount = finalCount - 127_493;
  const duration = 950;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    heroCount.textContent = Math.floor(startCount + (finalCount - startCount) * eased).toLocaleString(
      "en-US",
    );
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

document.querySelectorAll(".js-open-dialog").forEach((button) => {
  button.addEventListener("click", () => dialog.showModal());
});

document.querySelector(".js-close-dialog").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  localStorage.setItem("frontier-horsepower", "1");
  updateCounts();
  dialog.close();
  joinForm.reset();
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
});

const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
    observer.observe(element);
  });
}

updateCounts();
window.addEventListener("load", animateHeroCount, { once: true });
