(() => {
  "use strict";
  const root = document.documentElement;
  const themeBtn = document.querySelector(".theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const menuBtn = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const year = document.querySelectorAll("[data-year]");
  year.forEach(el => el.textContent = new Date().getFullYear());

  let saved = null;
  try { saved = localStorage.getItem("taufeeq-theme"); } catch (_) {}
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(saved || (prefersLight ? "light" : "dark"));

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const light = theme === "light";
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      themeBtn.setAttribute("aria-pressed", String(light));
    }
    if (themeMeta) themeMeta.content = light ? "#f5f4ee" : "#10110f";
  }
  themeBtn?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("taufeeq-theme", next); } catch (_) {}
  });

  function closeMenu() {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation menu");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }
  menuBtn?.addEventListener("click", () => {
    const opening = menuBtn.getAttribute("aria-expanded") !== "true";
    menuBtn.setAttribute("aria-expanded", String(opening));
    menuBtn.setAttribute("aria-label", opening ? "Close navigation menu" : "Open navigation menu");
    mobileMenu?.classList.toggle("open", opening);
    mobileMenu?.setAttribute("aria-hidden", String(!opening));
    document.body.classList.toggle("menu-open", opening);
  });
  mobileMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 700) closeMenu(); }, {passive:true});

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), {threshold:0.12, rootMargin:"0px 0px -25px 0px"});
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add("visible"));

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (dot && ring && window.matchMedia("(hover:hover) and (pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let x = innerWidth/2, y = innerHeight/2, rx = x, ry = y, running = false;
    document.addEventListener("mousemove", e => {
      x=e.clientX; y=e.clientY; dot.style.left=x+"px"; dot.style.top=y+"px";
      if (!running) { running=true; requestAnimationFrame(tick); }
    }, {passive:true});
    function tick() {
      rx += (x-rx)*.22; ry += (y-ry)*.22;
      ring.style.left=rx+"px"; ring.style.top=ry+"px";
      if (Math.abs(x-rx)>.4 || Math.abs(y-ry)>.4) requestAnimationFrame(tick); else running=false;
    }
    document.querySelectorAll("a,button").forEach(el=>{
      el.addEventListener("mouseenter",()=>ring.classList.add("hover"));
      el.addEventListener("mouseleave",()=>ring.classList.remove("hover"));
    });
    document.addEventListener("mouseleave",()=>{dot.style.opacity="0";ring.style.opacity="0";});
    document.addEventListener("mouseenter",()=>{dot.style.opacity="";ring.style.opacity="";});
  }

  // Contact form opens the visitor's email client with a pre-filled message.
  document.querySelectorAll("[data-contact-form]").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const service = String(data.get("service") || "Website project");
      const message = String(data.get("message") || "").trim();
      const subject = encodeURIComponent("Portfolio inquiry — " + service);
      const body = encodeURIComponent(`Hi Taufeeq,\\n\\n${message}\\n\\nName: ${name}\\nEmail: ${email}\\nService: ${service}`);
      window.location.href = `mailto:taufeeqlaghari00@gmail.com?subject=${subject}&body=${body}`;
      const status = form.querySelector("[data-form-status]");
      if (status) status.textContent = "Your email app should open with your message ready to send.";
    });
  });
})();




document.addEventListener("DOMContentLoaded", function() {
  const track = document.querySelector('.ticker-track');
  if (track) {
    // Content ko 3-4 dafa duplicate karega taaki badi screen par bhi blank space na aaye
    const content = track.innerHTML;
    track.innerHTML = content + content + content + content;
  }
});
