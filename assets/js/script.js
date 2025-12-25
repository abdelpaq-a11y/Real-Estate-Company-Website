document.addEventListener("DOMContentLoaded", function() {
  // Active link highlight
  const navLinks = document.querySelectorAll(".nav .menu li a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href").length > 1) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Loading bar
  const loadingInner = document.querySelector(".loading-inner");
  if (loadingInner) {
    if (document.readyState === "loading") loadingInner.style.width = "30%";
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "interactive") loadingInner.style.width = "60%";
      else if (document.readyState === "complete") {
        loadingInner.style.width = "100%";
        setTimeout(() => loadingInner.style.width = "0", 500);
      }
    });
  }

  // Scroll to top button
  const scrollBtn = document.createElement("button");
  scrollBtn.id = "scrollToTop";
  scrollBtn.innerHTML = "⬆";
  Object.assign(scrollBtn.style, {
    position: "fixed", right: "20px", bottom: "20px", padding: "10px 12px",
    border: "none", borderRadius: "50%", background: "#00695c", color: "#fff",
    cursor: "pointer", display: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
  });
  document.body.appendChild(scrollBtn);
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) scrollBtn.style.display = "block"; else scrollBtn.style.display = "none";
  });
  scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // EmailJS form handling (if emailjs is loaded)
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const status = document.getElementById("form-status");
    // init EmailJS if available and public key provided
    if (window.emailjs) {
      try {
        emailjs.init("zlovTi4xh8dI652px");
      } catch (err) {
        console.warn("EmailJS init error", err);
      }
    }

    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      // honeypot
      const hp = contactForm.querySelector('input[name="company"]');
      if (hp && hp.value) {
        if (status) status.textContent = "تم رصد محاولة سبام.";
        return;
      }

      // basic validation
      const name = contactForm.querySelector("[name='user_name']") || contactForm.querySelector("[name='name']");
      const email = contactForm.querySelector("[name='user_email']") || contactForm.querySelector("[name='email']");
      const message = contactForm.querySelector("[name='message']") || contactForm.querySelector("[name='message']");
      if (!name || !email || !message) {
        if (status) status.textContent = "الرجاء تعبئة الحقول المطلوبة.";
        return;
      }
      if (status) status.textContent = "جاري الإرسال...";

      if (window.emailjs) {
        emailjs.sendForm("service_x8tztaa", "template_4s7dj1c", contactForm)
          .then(function() {
            if (status) status.textContent = "تم الإرسال بنجاح ✅";
            contactForm.reset();
          }, function(error) {
            console.error("EmailJS error:", error);
            if (status) status.textContent = "حصل خطأ أثناء الإرسال ❌";
          });
      } else {
        // fallback: just show success (for offline or not configured)
        if (status) status.textContent = "تم (محاكاة) إرسال الرسالة. للتشغيل الفعلي فعّل EmailJS.";
        contactForm.reset();
      }
    });
  }

  // Set dynamic year
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
