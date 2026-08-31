document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Smooth Scroll Reveal using Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Active Link Highlighter on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNav.classList.add('active');
        } else {
          targetNav.classList.remove('active');
        }
      }
    });
  });

  // Contact Form & Toast Notification Handler (Web3Forms API)
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotification');
  const toastClose = document.getElementById('toastClose');
  const toastTitle = document.getElementById('toastTitle');
  const toastSub = document.getElementById('toastSub');
  let toastTimeout;

  // Function to display bottom-right toast notification
  function showToast(title, message) {
    if (!toast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastSub) toastSub.textContent = message;

    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // Close toast on cross icon click
  if (toastClose) {
    toastClose.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  }

  // Form submit event handler
  if (contactForm) {
    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const submitBtnText = submitBtn ? submitBtn.querySelector('.button__text') : null;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Incomplete Form', 'Please fill out all required fields.');
        return;
      }

      // Update button state and trigger sending toast
      if (submitBtnText) submitBtnText.textContent = 'Sending...';
      if (submitBtn) submitBtn.disabled = true;
      showToast('Sending Message...', 'Connecting to server.');

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: '8e96f2d3-3baa-4397-ba5b-4197caa19f08',
            name: name,
            email: email,
            message: message,
            subject: `New Portfolio Message from ${name}`
          })
        });

        const result = await response.json();

        if (result.success) {
          showToast('Message Sent!', 'Thank you! Your message has been delivered to Yasir.');
          contactForm.reset();
        } else {
          showToast('Submission Failed', result.message || 'Please try again later.');
        }
      } catch (error) {
        showToast('Network Error', 'Check your connection and try again.');
      } finally {
        if (submitBtnText) submitBtnText.textContent = 'Send Message';
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});