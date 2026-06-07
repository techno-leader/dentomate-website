/* DentoMate Global Scripts */

document.addEventListener('DOMContentLoaded', function () {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function () {
                const faqItem = this.parentElement;
                faqItem.classList.toggle('active');
            });
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navUl.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when a link is clicked
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                menuToggle.classList.remove('active');
                navUl.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to animated elements
    document.querySelectorAll('.stat-card, .feature-card, .benefit-card, .faq-item, .section-header, .hero-content').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // Logo click handling for home
    const logo = document.querySelector('.logo');
    if (logo && !logo.getAttribute('href')) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    // Form validation feedback
    const inputs = document.querySelectorAll('input, select');
    if (inputs.length > 0) {
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (!this.value && this.required) {
                    this.classList.add('invalid');
                    this.style.borderColor = '#ef4444';
                } else {
                    this.classList.remove('invalid');
                    this.style.borderColor = '';
                }
            });

            input.addEventListener('focus', function () {
                this.classList.remove('invalid');
                this.style.borderColor = 'var(--primary)';
            });
        });
    }
});
