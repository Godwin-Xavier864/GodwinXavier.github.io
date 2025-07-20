// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling and active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Catalogue page turning functionality
    let currentPage = 0;
    const totalPages = 4;
    const pages = document.querySelectorAll('.book-page');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageCounter = document.getElementById('pageCounter');
    let isAnimating = false;

    function updatePageCounter() {
        pageCounter.textContent = `Page ${currentPage + 1} of ${totalPages}`;
    }

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentPage);
        });
    }

    function updateNavigationButtons() {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
    }

    function showPage(pageIndex, direction = 'next') {
        if (isAnimating || pageIndex < 0 || pageIndex >= totalPages) return;
        
        isAnimating = true;
        const currentPageElement = pages[currentPage];
        const targetPageElement = pages[pageIndex];

        // Add turning animation classes
        if (direction === 'next') {
            currentPageElement.classList.add('turning-out');
            setTimeout(() => {
                currentPageElement.classList.remove('active', 'turning-out');
                targetPageElement.classList.add('turning-in');
                setTimeout(() => {
                    targetPageElement.classList.remove('turning-in');
                    targetPageElement.classList.add('active');
                    isAnimating = false;
                }, 400);
            }, 400);
        } else {
            currentPageElement.classList.add('turning-out');
            setTimeout(() => {
                currentPageElement.classList.remove('active', 'turning-out');
                targetPageElement.classList.add('turning-in');
                setTimeout(() => {
                    targetPageElement.classList.remove('turning-in');
                    targetPageElement.classList.add('active');
                    isAnimating = false;
                }, 400);
            }, 400);
        }

        currentPage = pageIndex;
        updatePageCounter();
        updateIndicators();
        updateNavigationButtons();
    }

    // Navigation button event listeners
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages - 1) {
            showPage(currentPage + 1, 'next');
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentPage > 0) {
            showPage(currentPage - 1, 'prev');
        }
    });

    // Indicator click event listeners
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            if (index !== currentPage) {
                const direction = index > currentPage ? 'next' : 'prev';
                showPage(index, direction);
            }
        });
    });

    // Keyboard navigation for catalogue
    document.addEventListener('keydown', function(e) {
        if (document.querySelector('#catalogue').getBoundingClientRect().top < window.innerHeight && 
            document.querySelector('#catalogue').getBoundingClientRect().bottom > 0) {
            if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
                showPage(currentPage + 1, 'next');
            } else if (e.key === 'ArrowLeft' && currentPage > 0) {
                showPage(currentPage - 1, 'prev');
            }
        }
    });

    // Initialize catalogue
    updatePageCounter();
    updateIndicators();
    updateNavigationButtons();

    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple form validation
        if (!data.name || !data.email || !data.phone || !data.service) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We\'ll get back to you within 24 hours.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .project-item, .contact-card, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Auto-advance catalogue pages (optional)
    let autoAdvanceInterval;
    
    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(() => {
            if (!isAnimating) {
                const nextPage = (currentPage + 1) % totalPages;
                showPage(nextPage, 'next');
            }
        }, 8000); // Change page every 8 seconds
    }
    
    function stopAutoAdvance() {
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
        }
    }
    
    // Start auto-advance when catalogue is in view
    const catalogueSection = document.querySelector('#catalogue');
    const catalogueObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoAdvance();
            } else {
                stopAutoAdvance();
            }
        });
    }, { threshold: 0.5 });
    
    catalogueObserver.observe(catalogueSection);
    
    // Stop auto-advance on user interaction
    [prevBtn, nextBtn, ...indicators].forEach(element => {
        element.addEventListener('click', () => {
            stopAutoAdvance();
            // Restart after 10 seconds of inactivity
            setTimeout(startAutoAdvance, 10000);
        });
    });

    // Smooth reveal animations for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // Add CSS for section animations
    const style = document.createElement('style');
    style.textContent = `
        .section-hidden {
            opacity: 0;
            transform: translateY(50px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .section-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});