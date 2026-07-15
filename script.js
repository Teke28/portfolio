/* ==========================================================================
   ELEMENT REFERENCES
   ========================================================================== */
const navLinks = document.querySelectorAll('header nav a');
const logoLink = document.querySelector('.logo');
const header = document.querySelector('header');
const barsBox = document.querySelector('.bars-box');
const sections = document.querySelectorAll('section');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('header nav');

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */

/**
 * Close the mobile menu and update accessibility attributes
 */
const closeMobileMenu = () => {
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
    menuIcon.setAttribute('aria-expanded', 'false');
};

/**
 * Open the mobile menu and update accessibility attributes
 */
const openMobileMenu = () => {
    menuIcon.classList.add('bx-x');
    navbar.classList.add('active');
    menuIcon.setAttribute('aria-expanded', 'true');
};

// Click handler for menu toggle
menuIcon.addEventListener('click', () => {
    if (navbar.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

// Keyboard support for menu button (Enter/Space)
menuIcon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        menuIcon.click();
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menuIsOpen = navbar.classList.contains('active');
    const clickedInsideNav = navbar.contains(e.target);
    const clickedMenuIcon = menuIcon.contains(e.target);

    if (menuIsOpen && !clickedInsideNav && !clickedMenuIcon) {
        closeMobileMenu();
    }
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
        closeMobileMenu();
        menuIcon.focus();
    }
});

/* ==========================================================================
   SECTION TRANSITIONS
   ========================================================================== */

const activePage = () => {
    header.classList.remove('active');
    setTimeout(() => {
        header.classList.add('active');
    }, 1100);

    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });

    barsBox.classList.remove('active');
    setTimeout(() => {
        barsBox.classList.add('active');
    }, 1100);

    sections.forEach(section => {
        section.classList.remove('active');
    });

    closeMobileMenu();
};

/* ==========================================================================
   URL HASH ROUTING
   ========================================================================== */

const DEFAULT_HASH = 'home';

/**
 * Extract hash from a nav link's href attribute
 * @param {Element} link - The navigation link element
 * @returns {string} The hash without the '#' character
 */
const getHashFromLink = (link) => link.getAttribute('href').replace('#', '');

/**
 * Find a nav link by its hash
 * @param {string} hash - The section ID/hash
 * @returns {Element|undefined} The matching nav link
 */
const findLinkByHash = (hash) =>
    Array.from(navLinks).find(link => getHashFromLink(link) === hash);

/**
 * Activate a section and its corresponding nav link
 * @param {string} hash - The section ID/hash to activate
 * @param {Object} options - Configuration options
 * @param {boolean} options.animate - Whether to play the transition animation
 */
const activateSection = (hash, { animate = true } = {}) => {
    const targetSection = document.getElementById(hash);
    const targetLink = findLinkByHash(hash);

    // Invalid hash → fall back to Home
    if (!targetSection || !targetLink) {
        activateSection(DEFAULT_HASH, { animate: false });
        return;
    }

    if (!animate) {
        // Initial load: set final state directly, no animation
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });
        sections.forEach(section => section.classList.remove('active'));

        targetLink.classList.add('active');
        targetLink.setAttribute('aria-current', 'page');
        targetSection.classList.add('active');
        return;
    }

    // Animated navigation: reset and activate with delay
    activePage();
    targetLink.classList.add('active');
    targetLink.setAttribute('aria-current', 'page');

    setTimeout(() => {
        targetSection.classList.add('active');
    }, 1100);
};

/* ----- Nav Link Clicks ----- */
navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const hash = getHashFromLink(link);

        if (link.classList.contains('active')) {
            closeMobileMenu();
            return;
        }

        history.pushState(null, '', `#${hash}`);
        activateSection(hash);
    });
});

/* ----- Logo Click ----- */
logoLink.addEventListener('click', (e) => {
    e.preventDefault();

    if (findLinkByHash(DEFAULT_HASH).classList.contains('active')) {
        closeMobileMenu();
        return;
    }

    history.pushState(null, '', `#${DEFAULT_HASH}`);
    activateSection(DEFAULT_HASH);
});

/* ----- Browser Back/Forward ----- */
window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '') || DEFAULT_HASH;
    activateSection(hash);
});

/* ----- Initial Load (Deep Linking) ----- */
const initialHash = window.location.hash.replace('#', '') || DEFAULT_HASH;
activateSection(initialHash, { animate: false });

/* ==========================================================================
   RESUME TAB BUTTONS
   - Experience, Education, Skills, About Me
   - Accessibility: aria-pressed state sync
   ========================================================================== */
const resumeBtns = document.querySelectorAll('.resume-btn');

resumeBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        const resumeDetails = document.querySelectorAll('.resume-detail');

        // Reset all buttons
        resumeBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });

        // Activate clicked button
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Show corresponding detail panel
        resumeDetails.forEach(detail => {
            detail.classList.remove('active');
        });
        resumeDetails[idx].classList.add('active');
    });
});

/* ==========================================================================
   PORTFOLIO CAROUSEL
   ========================================================================== */
const arrowRight = document.querySelector('.portfolio-box .navigation .arrow-right');
const arrowLeft = document.querySelector('.portfolio-box .navigation .arrow-left');
let index = 0;

const activePortfolio = () => {
    const imgSlide = document.querySelector('.portfolio-carousel .img-slide');
    const portfolioDetails = document.querySelectorAll('.portfolio-detail');
    const maxIndex = portfolioDetails.length - 1;

    // Slide the carousel
    imgSlide.style.transform = `translateX(calc(${index * -100}% - ${index * 2}rem))`;

    // Show matching project detail
    portfolioDetails.forEach(detail => {
        detail.classList.remove('active');
    });
    portfolioDetails[index].classList.add('active');

    // Toggle arrow states
    arrowLeft.classList.toggle('disabled', index === 0);
    arrowRight.classList.toggle('disabled', index === maxIndex);
    arrowLeft.setAttribute('aria-disabled', index === 0);
    arrowRight.setAttribute('aria-disabled', index === maxIndex);
};

// Event listeners for carousel arrows
arrowRight.addEventListener('click', () => {
    const portfolioDetails = document.querySelectorAll('.portfolio-detail');
    const maxIndex = portfolioDetails.length - 1;
    if (index < maxIndex) {
        index++;
        activePortfolio();
    }
});

arrowLeft.addEventListener('click', () => {
    if (index > 0) {
        index--;
        activePortfolio();
    }
});

// Initialize carousel
activePortfolio();

/* ==========================================================================
   CONTACT FORM
   ========================================================================== */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    const submitBtn = document.getElementById('contact-submit-btn');
    const btnTextEl = submitBtn.querySelector('.btn-text');
    const statusEl = document.getElementById('form-status');
    const originalBtnText = btnTextEl.textContent;

    /* ----- Backend Configuration -----
     * Choose your backend:
     * 'demo'    - Simulates submission for testing
     * 'formspree' - Formspree.io (set endpoint below)
     * 'emailjs' - EmailJS (set serviceId & templateId below)
     */
    const BACKEND = 'formspree';

    const CONFIG = {
        formspree: {
            endpoint: 'https://formspree.io/f/xaqrqykn',
        },
        emailjs: {
            // TODO: Replace with your EmailJS credentials
            serviceId: 'YOUR_SERVICE_ID',
            templateId: 'YOUR_TEMPLATE_ID',
        },
    };

    // Additional email validation regex
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /**
     * Set the status message in the aria-live region
     * @param {string} message - The message to display
     * @param {string} type - 'success' or 'error'
     */
    const setStatus = (message, type) => {
        statusEl.textContent = message;
        statusEl.classList.remove('success', 'error');
        if (type) statusEl.classList.add(type);
    };

    /**
     * Toggle loading state on submit button
     * @param {boolean} isLoading - Whether the form is submitting
     */
    const setLoading = (isLoading) => {
        submitBtn.classList.toggle('is-loading', isLoading);
        submitBtn.disabled = isLoading;
        submitBtn.setAttribute('aria-busy', String(isLoading));
        btnTextEl.textContent = isLoading ? 'Sending…' : originalBtnText;
    };

    /**
     * Submit form data to the configured backend
     * @param {FormData} formData - The form data to submit
     * @returns {Promise} - Resolves on successful submission
     */
    const submitToBackend = async (formData) => {
        if (BACKEND === 'formspree') {
            const response = await fetch(CONFIG.formspree.endpoint, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`Formspree responded with status ${response.status}`);
            }
            return response.json();
        }

        if (BACKEND === 'emailjs') {
            if (typeof emailjs === 'undefined') {
                throw new Error(
                    'EmailJS SDK not loaded. Add the script tag in index.html:\n' +
                    '<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"><\/script>'
                );
            }
            const templateParams = Object.fromEntries(formData.entries());
            return emailjs.send(
                CONFIG.emailjs.serviceId,
                CONFIG.emailjs.templateId,
                templateParams
            );
        }

        // Demo mode: simulate network request
        return new Promise((resolve) => setTimeout(resolve, 1200));
    };

    // Form submit handler
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Native HTML validation (blocks submission if invalid)
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            setStatus('Please fill in all fields correctly before sending.', 'error');
            return;
        }

        const formData = new FormData(contactForm);

        // Check for empty form
        const allFieldsEmpty = Array.from(formData.values())
            .every(value => String(value).trim() === '');
        if (allFieldsEmpty) {
            setStatus('Please fill out the form before sending.', 'error');
            return;
        }

        // Additional email validation
        const email = String(formData.get('email') || '').trim();
        if (!EMAIL_REGEX.test(email)) {
            setStatus('Please enter a valid email address.', 'error');
            return;
        }

        // Submit form
        setLoading(true);
        setStatus('Sending your message…');

        try {
            await submitToBackend(formData);
            setStatus("Message sent! I'll get back to you soon.", 'success');
            contactForm.reset();
        } catch (err) {
            console.error('Contact form submission failed:', err);
            setStatus('Something went wrong — please try again or email me directly.', 'error');
        } finally {
            setLoading(false);
        }
    });
}

/* ==========================================================================
   CERTIFICATE VIEWER MODAL (LIGHTBOX)
   ========================================================================== */
const certModal = document.getElementById('cert-modal');

if (certModal) {
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalClose = document.getElementById('cert-modal-close');
    const certButtons = document.querySelectorAll('.cert-btn');

    // Remembers which button opened the modal, so focus can return to it
    // on close instead of getting lost (accessibility).
    let lastFocusedCertBtn = null;

    /**
     * Open the modal with the image from the clicked certificate card
     * @param {HTMLElement} btn - The "View Certificate" link that was clicked
     */
    const openCertModal = (btn) => {
        // Walk up to the card, then find its image — robust to markup
        // changes, unlike assuming a fixed position/index.
        const card = btn.closest('.certificate-box');
        const img = card ? card.querySelector('.cert-img-box img') : null;
        if (!img) return; // fails safe: no image found, don't open an empty modal

        certModalImg.src = img.currentSrc || img.src;
        certModalImg.alt = img.alt;

        lastFocusedCertBtn = btn;
        certModal.classList.add('active');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('cert-modal-open'); // locks background scroll
        certModalClose.focus(); // moves keyboard focus into the modal
    };

    /**
     * Close the modal and restore the page behind it
     */
    const closeCertModal = () => {
        certModal.classList.remove('active');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('cert-modal-open');
        certModalImg.src = ''; // stop holding the (possibly large) image once closed
        if (lastFocusedCertBtn) {
            lastFocusedCertBtn.focus(); // return focus to where the user was
        }
    };

    // Wire up every "View Certificate" button — this is the actual fix.
    certButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // stop the dead href="#" navigation/new-tab
            openCertModal(btn);
        });
    });

    certModalClose.addEventListener('click', closeCertModal);
    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) {
            closeCertModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!certModal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeCertModal();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            certModalClose.focus();
        }
    });
}