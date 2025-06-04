document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;
    let isMenuOpen = false;

    // Debug logging
    console.log('Mobile menu elements found:');
    console.log('Button:', mobileMenuBtn);
    console.log('Overlay:', mobileMenuOverlay);
    console.log('Links:', mobileMenuLinks.length);

    // Toggle mobile menu
    function toggleMobileMenu() {
        console.log('Toggle Mobile Menu called');
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenuBtn.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            body.classList.add('menu-open');
            mobileMenuLinks.forEach((link, index) => {
                link.style.animation = 'none';
                link.offsetHeight; // Trigger reflow
                link.style.animation = `menuItemFloatIn 0.6s ${index * 0.08}s forwards cubic-bezier(0.18, 0.89, 0.32, 1.28)`;
            });
        } else {
            // Close menu
            console.log('Closing mobile menu');
            mobileMenuBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Reset menu items
            mobileMenuLinks.forEach(link => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(20px)';
            });
        }
    }

    // Mobile menu button click
    if (mobileMenuBtn) {
        console.log('Adding click listener to mobile menu button');
        mobileMenuBtn.addEventListener('click', function(e) {
            console.log('Mobile menu button clicked!');
            e.preventDefault();
            toggleMobileMenu();
        });
    } else {
        console.error('Mobile menu button not found!');
    }

    // Close menu when clicking on overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                console.log('Mobile menu overlay clicked!');
                toggleMobileMenu();
            }
        });
    } else {
        console.error('Mobile menu overlay not found!');
    }

    // Close menu when clicking on mobile nav links
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Mobile nav link clicked!');
            toggleMobileMenu();
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            console.log('Escape key pressed, closing mobile menu!');
            toggleMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            console.log('Window resized, closing mobile menu!');
            toggleMobileMenu();
        }
        
        // Add resize class to prevent transitions during resize
        body.classList.add('is-resizing');
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            body.classList.remove('is-resizing');
        }, 250);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a, .mobile-nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
    
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    const navMenu = document.querySelector('nav ul'); // Keep navMenu for other potential uses

    // Header background change on scroll
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { // Add class after scrolling 50px
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // Highlight active menu item based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a.nav-link, .mobile-nav-link');
    
    function highlightActiveLink() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if(scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Handle case when at top of page
        if(scrollPosition < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
        }
    }
    
    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink(); // Call once to set initial state

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    }
    
    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Check on initial load

    // Audio player functionality
    const audioPlayers = document.querySelectorAll('.audio-player');
    
    audioPlayers.forEach(player => {
        const playButton = player.querySelector('.play-button');
        const progressBar = player.querySelector('.progress-bar');
        const progressFill = player.querySelector('.progress-fill');
        const audioTime = player.querySelector('.audio-time');
        
        if (playButton && progressBar && progressFill && audioTime) {
            let isPlaying = false;
            
            playButton.addEventListener('click', function() {
                isPlaying = !isPlaying;
                playButton.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
                
                // Simulate progress (in a real implementation, this would be tied to actual audio)
                if (isPlaying) {
                    let progress = 0;
                    const interval = setInterval(() => {
                        progress += 1;
                        if (progress > 100) {
                            clearInterval(interval);
                            isPlaying = false;
                            playButton.innerHTML = '<i class="fas fa-play"></i>';
                            return;
                        }
                        
                        progressFill.style.width = `${progress}%`;
                        
                        // Update time display (simulated)
                        const totalSeconds = 180; // 3 minutes
                        const currentSeconds = Math.floor(totalSeconds * (progress / 100));
                        const minutes = Math.floor(currentSeconds / 60);
                        const seconds = currentSeconds % 60;
                        audioTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                    }, 300);
                }
            });
        }
    });

    // Repertoire tabs
    const repertoireTabs = document.querySelectorAll('.repertoire-tab');
    const repertoireContents = document.querySelectorAll('.repertoire-content');
    
    if (repertoireTabs.length && repertoireContents.length) {
        repertoireTabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                repertoireTabs.forEach(t => t.classList.remove('active'));
                repertoireContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                repertoireContents[index].classList.add('active');
            });
        });
    }

    // Dynamic hero background image adjustment
    const heroBackground = document.querySelector('.hero-background');
    
    function adjustHeroBackground() {
        if (!heroBackground) return;
        
        const windowWidth = window.innerWidth;
        
        if (windowWidth <= 1000) {
            // Calculate position to keep the 30% point centered as window narrows
            // For a 1000px window, we want the 30% point (300px from left) to be centered
            // As window narrows, we smoothly adjust the percentage to keep that visual point centered
            
            // Calculate the position percentage (0% = left edge, 100% = right edge)
            // This formula maps the 1000px threshold to 0% (left aligned)
            // and narrows down to smaller widths with increasing % to keep 30% point centered
            const baseWidth = 1000;
            const narrowingFactor = (baseWidth - windowWidth) / baseWidth;
            
            // Calculate how much we need to shift right as a percentage
            // The magic number 40 represents a tuned value that achieves the 30% centering effect
            const positionPercentage = Math.min(40 * narrowingFactor, 40);
            
            // Apply the calculated position
            heroBackground.style.backgroundPosition = `${positionPercentage}% center`;
            heroBackground.style.backgroundSize = `cover`;
        } else {
            // Default position for larger screens
            heroBackground.style.backgroundPosition = 'left center';
            heroBackground.style.backgroundSize = 'cover';
        }
    }
    
    // Initial adjustment
    window.addEventListener('load', adjustHeroBackground);
    
    // Adjust on window resize
    window.addEventListener('resize', adjustHeroBackground);
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        });
    }

    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });
    }

    // Form validation
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = contactForm.querySelector('input[name="name"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');
            
            let isValid = true;
            
            if (nameInput && nameInput.value.trim() === '') {
                nameInput.classList.add('error');
                isValid = false;
            } else if (nameInput) {
                nameInput.classList.remove('error');
            }
            
            if (emailInput && (emailInput.value.trim() === '' || !emailInput.value.includes('@'))) {
                emailInput.classList.add('error');
                isValid = false;
            } else if (emailInput) {
                emailInput.classList.remove('error');
            }
            
            if (messageInput && messageInput.value.trim() === '') {
                messageInput.classList.add('error');
                isValid = false;
            } else if (messageInput) {
                messageInput.classList.remove('error');
            }
            
            if (isValid) {
                // Simulate form submission
                const submitButton = contactForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    const originalText = submitButton.textContent;
                    submitButton.textContent = 'Sending...';
                    submitButton.disabled = true;
                    
                    setTimeout(() => {
                        contactForm.reset();
                        submitButton.textContent = 'Message Sent!';
                        
                        setTimeout(() => {
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        }, 2000);
                    }, 1500);
                }
            }
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            if (emailInput && emailInput.value.trim() !== '' && emailInput.value.includes('@')) {
                // Simulate subscription
                const submitButton = newsletterForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    const originalText = submitButton.textContent;
                    submitButton.textContent = 'Subscribing...';
                    submitButton.disabled = true;
                    
                    setTimeout(() => {
                        newsletterForm.reset();
                        submitButton.textContent = 'Subscribed!';
                        
                        setTimeout(() => {
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        }, 2000);
                    }, 1500);
                }
            } else if (emailInput) {
                emailInput.classList.add('error');
                
                setTimeout(() => {
                    emailInput.classList.remove('error');
                }, 2000);
            }
        });
    }
});
