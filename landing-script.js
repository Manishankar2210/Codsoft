// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navButtons = document.querySelector('.nav-buttons');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        // Create mobile menu if it doesn't exist
        let mobileMenu = document.querySelector('.mobile-menu');
        
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#pricing">Pricing</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <div class="mobile-buttons">
                    <a href="#" class="btn btn-outline">Login</a>
                    <a href="#" class="btn btn-primary">Get Started</a>
                </div>
            `;
            mobileMenu.style.cssText = `
                position: fixed;
                top: 70px;
                left: 0;
                right: 0;
                background: white;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                z-index: 999;
            `;
            mobileMenu.querySelector('ul').style.cssText = `
                list-style: none;
                text-align: center;
                margin-bottom: 20px;
            `;
            mobileMenu.querySelectorAll('li').forEach(li => {
                li.style.cssText = 'margin-bottom: 15px;';
            });
            mobileMenu.querySelectorAll('a').forEach(a => {
                a.style.cssText = 'color: #1a1a2e; font-weight: 500;';
            });
            mobileMenu.querySelector('.mobile-buttons').style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(mobileMenu);
        }
        
        mobileMenu.style.display = hamburger.classList.contains('active') ? 'block' : 'none';
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.style.display = 'none';
                hamburger.classList.remove('active');
            }
        }
    });
});

// Header scroll effect
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Form submission handler
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form inputs
        const inputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '#e2e8f0';
            }
        });
        
        if (isValid) {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        }
    });
}

// Counter animation for stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 30);
};

// Observe stats section
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('K+')) {
                        stat.dataset.suffix = 'K+';
                        animateCounter(stat, 10);
                    } else if (text.includes('%')) {
                        stat.dataset.suffix = '%';
                        animateCounter(stat, 98);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}
