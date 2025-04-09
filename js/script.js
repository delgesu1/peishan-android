document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if it's open
                if (window.innerWidth <= 900) {
                    document.querySelector('nav ul').classList.remove('active');
                    document.querySelector('.menu-toggle').classList.remove('active');
                    document.body.classList.remove('menu-open');
                    if (menuOverlay) menuOverlay.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    // Create menu overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        menuOverlay.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }

    // Add body styles when menu is open to prevent scrolling
    const style = document.createElement('style');
    style.textContent = `
        body.menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

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
    const navLinks = document.querySelectorAll('nav a.nav-link');
    
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
