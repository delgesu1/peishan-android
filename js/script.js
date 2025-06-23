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
    
    // Modern Gallery Functionality
    function initGallery() {
        // Elements
        const carousel = document.querySelector('.gallery-carousel');
        const slides = document.querySelectorAll('.gallery-slide');
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        const dots = document.querySelector('.gallery-dots');
        const thumbnails = document.querySelectorAll('.thumbnail');
        const modal = document.querySelector('.gallery-modal');
        const modalImg = document.querySelector('.modal-img');
        const modalClose = document.querySelector('.modal-close');
        const modalPrev = document.querySelector('.modal-prev');
        const modalNext = document.querySelector('.modal-next');
        
        // Variables
        const slideCount = slides.length;
        let currentIndex = 0;
        let autoplayInterval;
        let startX;
        let touchX;
        
        // Only initialize if the gallery elements exist
        if (!carousel || !slides.length) return;
        
        // Create dot indicators
        if (dots) {
            dots.innerHTML = ''; // Clear existing dots
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('data-index', i);
                dots.appendChild(dot);
                
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
            }
        }
        
        // Initialize
        function init() {
            updateSlidePositions();
            
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    goToSlide(index);
                });
            });
            
            slides.forEach((slide, index) => {
                slide.addEventListener('click', () => {
                    openModal(index);
                });
            });
            
            if (modalClose) modalClose.addEventListener('click', closeModal);
            if (modalPrev) modalPrev.addEventListener('click', () => navigateModal('prev'));
            if (modalNext) modalNext.addEventListener('click', () => navigateModal('next'));
            
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });
            }
            
            carousel.addEventListener('touchstart', handleTouchStart, false);
            carousel.addEventListener('touchmove', handleTouchMove, false);
            carousel.addEventListener('touchend', handleTouchEnd, false);
            
            document.addEventListener('keydown', handleKeydown);
            
            startAutoplay();
            
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
        }
        
        // Main functions
        function updateSlidePositions() {
            // Shift entire carousel so the current slide is in view
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        function goToSlide(index) {
            console.log('Go to slide', index);
            
            currentIndex = index;
            
            if (currentIndex < 0) currentIndex = slideCount - 1;
            if (currentIndex >= slideCount) currentIndex = 0;
            
            updateSlidePositions();
            
            document.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === currentIndex);
                if (i === currentIndex) {
                    scrollToThumbnail(thumb);
                }
            });
            
            resetAutoplay();
        }
        
        function scrollToThumbnail(thumbnail) {
            const thumbnailsContainer = document.querySelector('.gallery-thumbnails');
            if (!thumbnailsContainer) return;
            
            const containerWidth = thumbnailsContainer.offsetWidth;
            const thumbnailLeft = thumbnail.offsetLeft;
            const thumbnailWidth = thumbnail.offsetWidth;
            
            thumbnailsContainer.scrollTo({
                left: thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2),
                behavior: 'smooth'
            });
        }
        
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        // Modal functions
        function openModal(index) {
            if (!modal || !modalImg || !slides[index]) return;
            
            currentIndex = index;
            const img = slides[index].querySelector('img');
            if (img) {
                modalImg.src = img.src;
                modalImg.alt = img.alt;
            }
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeModal() {
            if (!modal) return;
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        function navigateModal(direction) {
            if (direction === 'prev') {
                currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            } else {
                currentIndex = (currentIndex + 1) % slideCount;
            }
            
            const img = slides[currentIndex].querySelector('img');
            if (img) {
                modalImg.src = img.src;
                modalImg.alt = img.alt;
            }
        }
        
        // Touch controls
        function handleTouchStart(e) {
            startX = e.touches[0].clientX;
            touchX = startX;
            stopAutoplay();
        }
        
        function handleTouchMove(e) {
            if (!startX) return;
            touchX = e.touches[0].clientX;
        }
        
        function handleTouchEnd() {
            if (!startX || !touchX) return;
            
            const diff = startX - touchX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            startX = null;
            touchX = null;
            startAutoplay();
        }
        
        // Keyboard navigation
        function handleKeydown(e) {
            const isModalActive = modal && modal.classList.contains('active');
            
            if (isModalActive) {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') navigateModal('prev');
                if (e.key === 'ArrowRight') navigateModal('next');
            } else {
                const rect = carousel.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isInViewport) {
                    if (e.key === 'ArrowLeft') prevSlide();
                    if (e.key === 'ArrowRight') nextSlide();
                }
            }
        }
        
        // Autoplay functions
        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }
        
        // Initialize the gallery
        init();
    }
    
    // Media tabs functionality
    function initMediaTabs() {
        const tabs = document.querySelectorAll('.media-tab');
        const contents = document.querySelectorAll('.media-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to current tab and content
                tab.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });
    }
    
    // ----- Teaching & Collaboration Scroll-triggered section -----
    function initTeachingCollaborationScroll() {
        // --- 1. Clean up previous state ---
        // Remove existing ScrollTriggers tied to this section
        ScrollTrigger.getAll().forEach(tg => {
            const trg = tg.trigger || tg.scroller || null;
            if (trg && trg.closest && trg.closest('#teaching-collaboration')) {
                tg.kill(); // kill trigger
            }
        });

        // Add a single resize listener that re-initialises this section when viewport crosses breakpoints
        if (!window._tcResizeBound) {
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    // initTeachingCollaborationScroll(); // disabled due to new teaching section implementation
                    ScrollTrigger.refresh();
                }, 200);
            });
            window._tcResizeBound = true;
        }
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('GSAP/ScrollTrigger not loaded');
            return;
        }
        gsap.registerPlugin(ScrollTrigger);

        const section = document.querySelector('#teaching-collaboration');
        if (!section) return;

        const sticky = section.querySelector('.tc-sticky-container');
        const panels = gsap.utils.toArray('.tc-panel');
        const sectionTop = section.offsetTop;
        const floatingEl = section.querySelector('.tc-floating-element');
        const floatingImg = floatingEl.querySelector('.tc-floating-img');
        const floatingQuote = floatingEl.querySelector('.tc-floating-quote');
        // reset nav visibility
        const progressNav = section.querySelector('.tc-progress-indicator');
        if (progressNav) progressNav.classList.remove('visible');

        // Remove old click listeners by cloning
        if (progressNav) {
            const cloned = progressNav.cloneNode(true);
            progressNav.parentNode.replaceChild(cloned, progressNav);
        }
        const progressNavNew = section.querySelector('.tc-progress-indicator');
        const dots = gsap.utils.toArray(progressNavNew.querySelectorAll('.tc-progress-dot'));

        // Define assets for floating element (image or quote)
        const floatAssets = [
            {type:'image', src:'images/teaching/rehearsal.jpg', alt:'Rehearsal Photo'},
            {type:'image', src:'images/teaching/juilliard.jpg',  alt:'Juilliard School'},
            {type:'image', src:'images/teaching/dissertation.jpg',alt:'Dissertation Cover'}
        ];

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.matchMedia('(max-width: 767px)').matches;

        function updateFloating(i) {
            if (isMobile) { // Hide floating element on mobile
                floatingEl.style.display = 'none';
                gsap.set(floatingEl, { autoAlpha: 0 }); // Also hide with GSAP for consistency
                return;
            }
            // Ensure it's visible on desktop and ready for GSAP animations
            floatingEl.style.display = 'block'; 
            gsap.set(floatingEl, { autoAlpha: 1 });

            if (i >= 0 && i < floatAssets.length) {
                const asset = floatAssets[i];
                gsap.to([floatingImg, floatingQuote], { autoAlpha: 0, duration: 0.3, onComplete: () => {
                    floatingImg.classList.remove('active');
                    floatingQuote.classList.remove('active');
                    if (asset.type === 'image') {
                        floatingImg.src = asset.src;
                        floatingImg.alt = asset.alt || '';
                        floatingImg.classList.add('active');
                        gsap.to(floatingImg, { autoAlpha: 1, duration: 0.3 });
                    } else if (asset.type === 'quote') {
                        floatingQuote.textContent = asset.text;
                        floatingQuote.classList.add('active');
                        gsap.to(floatingQuote, { autoAlpha: 1, duration: 0.3 });
                    }
                }});
            } else {
                // Optional: Hide both if index is out of bounds
                gsap.to([floatingImg, floatingQuote], { autoAlpha: 0, duration: 0.3 });
            }
        }

        updateFloating(0); // Initial call

        // Calculate dynamic scroll distance based on actual panel heights to ensure
        // each panel becomes visible even if its content exceeds the viewport height.
        function getDynamicEnd() {
            const totalHeight = panels.reduce((sum, panel) => {
                return sum + Math.max(panel.scrollHeight, window.innerHeight);
            }, 0);
            return '+=' + (totalHeight * 1.2); // Add 20% buffer for smooth transitions
        }

        // Pin sticky container on all viewports with dynamic end distance
        ScrollTrigger.create({
            trigger: sticky,
            start: 'top top',
            end: getDynamicEnd,
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            pinType: 'fixed'
        });

        // Show/hide progress navigation when section in view
        if (progressNavNew) {
            ScrollTrigger.create({
                trigger: section,
                start: 'top bottom', // section enters viewport
                end: 'bottom top',   // section leaves viewport
                onEnter: () => progressNavNew.classList.add('visible'),
                onEnterBack: () => progressNavNew.classList.add('visible'),
                onLeave: () => progressNavNew.classList.remove('visible'),
                onLeaveBack: () => progressNavNew.classList.remove('visible')
            });
        }

        // Create individual ScrollTriggers for each panel with better spacing
        panels.forEach((panel, i) => {
            const lines = panel.querySelectorAll('.tc-anim-line');
            gsap.set(lines, { opacity: 0, y: 15 });
            
            // Calculate start and end positions for each panel
            const startPosition = i * window.innerHeight;
            const endPosition = (i + 1) * window.innerHeight;
            
            ScrollTrigger.create({
                trigger: sticky,
                start: () => `top+=${startPosition} top`,
                end: () => `top+=${endPosition} top`,
                onUpdate: (self) => {
                    // Progressive activation based on scroll progress
                    const progress = self.progress;
                    if (progress > 0.1) { // Activate when 10% into the panel
                        panel.classList.add('active');
                        updateFloating(i);
                        dots.forEach((d, di) => d.classList.toggle('active', di === i));
                        
                        if (!prefersReduced && !panel.hasAttribute('data-animated')) {
                            gsap.to(lines, { 
                                opacity: 1, 
                                y: 0, 
                                duration: 0.8, 
                                stagger: 0.05,
                                ease: "power2.out"
                            });
                            panel.setAttribute('data-animated', 'true');
                        } else if (prefersReduced) {
                            gsap.set(lines, { opacity: 1, y: 0 });
                        }
                    } else {
                        panel.classList.remove('active');
                    }
                }
            });
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                window.scrollTo({
                    top: sectionTop + i * window.innerHeight,
                    behavior: 'smooth'
                });
            });
        });

        // refresh already handled by re-init listener above
    }

    // Video Player Modal Functionality
    function initVideoPlayer() {
        const videoItems = document.querySelectorAll('.video-item');
        const modal = document.querySelector('.video-modal');
        const closeModalBtn = document.querySelector('.video-modal-close');
        const iframe = document.getElementById('youtube-player');

        if (!videoItems.length || !modal || !closeModalBtn || !iframe) {
            console.log('Video player elements not found, skipping initialization.');
            return;
        }

        videoItems.forEach(item => {
            item.addEventListener('click', () => {
                const videoId = item.getAttribute('data-video-id');
                if (videoId) {
                    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });

        function closeModal() {
            modal.classList.remove('active');
            iframe.src = ''; // Stop the video from playing in the background
            document.body.style.overflow = ''; // Restore scrolling
        }

        closeModalBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Initialize gallery, tabs, and teaching collaboration
    initMediaTabs();
    initGallery();
    initVideoPlayer();
    // initTeachingCollaborationScroll(); // disabled due to new teaching section implementation

});
