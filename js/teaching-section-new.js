// New Teaching & Collaboration Section Script
(function () {
    // Prevent double initialization
    if (window._teachingCollaboInitialized) return;
    window._teachingCollaboInitialized = true;
    
    // Ensure GSAP and necessary plugins are available
    function waitForGSAP(callback) {
      if (window.gsap && window.ScrollTrigger && window.gsap.plugins.scrollTo) {
        return callback();
      }
      setTimeout(() => waitForGSAP(callback), 50);
    }
  
    const section = document.getElementById('teaching-collaborative-piano');
    if (!section) return;

    const sectionTitleElement = section.querySelector('h2.section-title');
    let titleHTML = '';
    if (sectionTitleElement) {
        titleHTML = sectionTitleElement.outerHTML;
        // Optionally remove it before clearing innerHTML, though clear will do it
        // sectionTitleElement.remove(); 
    }
  
    // Replace old innerHTML with the new scroll-story markup
    section.innerHTML = titleHTML + `
      <div class="loading" id="loading"><div class="loading-text">Loading Experience...</div></div>
      <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
      <div class="nav-dots" id="navDots"></div>
      <div class="dynamic-bg" id="dynamicBg"></div>
      <div class="tc-content-wrapper">
        <div class="story-wrapper" id="storyWrapper">
            <div class="panels-container" id="panelsContainer">${createPanelsMarkup()}</div>
        </div>
        <div class="scroll-spacer"></div>
      </div>
    `;
  
    const totalPanels = 5;
    let currentPanel = 0;
    let scrollTriggerInstance = null;

    // --- Dynamic background crossfade helper ---
    const dynamicBgContainer = document.getElementById('dynamicBg');
    
    // Create ambient orbs once
    function createAmbientOrbs() {
      if (!dynamicBgContainer) return;
      
      // Create 3 ambient orbs
      for (let i = 1; i <= 3; i++) {
        const orb = document.createElement('div');
        orb.className = `ambient-orb orb-${i}`;
        dynamicBgContainer.appendChild(orb);
      }
    }
    
    // Create musical particle system
    function createParticleSystem() {
      if (!dynamicBgContainer) return;
      
      const particleContainer = document.createElement('div');
      particleContainer.className = 'particle-container';
      dynamicBgContainer.appendChild(particleContainer);
      
      // Create particles periodically
      const particleTypes = ['note', 'eighth', 'beam'];
      
      function createParticle() {
        const particle = document.createElement('i');
        const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particle.className = `musical-particle ${type}`;
        
        // Random horizontal position
        particle.style.left = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        particleContainer.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
          particle.remove();
        }, 25000);
      }
      
      // Create initial particles
      for (let i = 0; i < 5; i++) {
        setTimeout(createParticle, i * 3000);
      }
      
      // Continue creating particles
      setInterval(createParticle, 4000);
    }
    
    // Create subtle geometric elements
    function createGeometricElements() {
      if (!dynamicBgContainer) return;
      
      const geoContainer = document.createElement('div');
      geoContainer.className = 'geometric-elements';
      dynamicBgContainer.appendChild(geoContainer);
      
      // Define element types and their classes
      const elementTypes = [
        { class: 'geo-circle', count: 2 },
        { class: 'geo-triangle', count: 2 },
        { class: 'geo-square', count: 2 },
        { class: 'geo-line', count: 1 },
        { class: 'geo-dots', count: 1 }
      ];
      
      let elementIndex = 1;
      
      elementTypes.forEach(type => {
        for (let i = 0; i < type.count; i++) {
          const element = document.createElement('div');
          element.className = `geo-element ${type.class} geo-${elementIndex}`;
          geoContainer.appendChild(element);
          elementIndex++;
        }
      });
    }
    
    function changeBackground(panelIndex) {
      if (!dynamicBgContainer) return;
      // Create new gradient layer
      const newLayer = document.createElement('div');
      newLayer.className = `bg-layer bg-panel-${panelIndex + 1}`;
      gsap.set(newLayer, { opacity: 0 });
      dynamicBgContainer.appendChild(newLayer);
      // Fade in new layer
      gsap.to(newLayer, { opacity: 1, duration: 1.2, ease: 'power1.out' });
      // Fade out & remove previous layers
      dynamicBgContainer.querySelectorAll('.bg-layer').forEach(layer => {
        if (layer !== newLayer) {
          gsap.to(layer, {
            opacity: 0,
            duration: 1.2,
            ease: 'power1.out',
            onComplete: () => layer.remove()
          });
        }
      });
    }
  
    let isNavigating = false;
    
    // --- Unified Panel Navigation Logic ---
    function goToPanel(panelIndex) {
      if (panelIndex < 0 || panelIndex >= totalPanels || !scrollTriggerInstance || isNavigating) return;
      
      isNavigating = true;
      const progress = panelIndex / (totalPanels - 1);
      const scrollDistance = scrollTriggerInstance.end - scrollTriggerInstance.start;
      const targetScroll = scrollTriggerInstance.start + progress * scrollDistance;
      
      gsap.to(window, { 
        scrollTo: { y: targetScroll, autoKill: true }, 
        duration: 0.6, 
        ease: 'power2.out',
        onComplete: () => {
          isNavigating = false;
        }
      });
    }
  
    // --- Create navigation dots ---
    function createNavigation() {
      const navContainer = document.getElementById('navDots');
      for (let i = 0; i < totalPanels; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        if (i === 0) dot.classList.add('active');
        dot.dataset.panel = i;
        navContainer.appendChild(dot);
        
        // Detect if device is a mobile phone (not just touch-capable)
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Add navigation only for non-mobile devices
        const handleNavigation = (e) => {
          // Block navigation on mobile phones
          if (isMobileDevice) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          
          e.preventDefault();
          e.stopPropagation();
          goToPanel(i);
        };
        
        dot.addEventListener('click', handleNavigation);
        dot.addEventListener('touchend', handleNavigation);
        
        // Prevent default touch behavior on dots
        dot.addEventListener('touchstart', (e) => {
          e.preventDefault();
        });
      }
    }
  
    // --- Update active states (panels, dots, bg) ---
    function updateActiveStates(panelIndex) {
      if (panelIndex === currentPanel) return;
      
      const previousPanel = currentPanel;
      currentPanel = panelIndex;
  
      // Update nav dots
      document.querySelectorAll('.nav-dot').forEach((d, idx) => d.classList.toggle('active', idx === panelIndex));
      
      // Check if mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Simple class toggle for mobile - ensure all panels are properly updated
        document.querySelectorAll('.panel').forEach((p, idx) => {
          if (idx === panelIndex) {
            p.classList.add('active');
            // Force visibility on mobile
            const content = p.querySelector('.panel-content');
            if (content) {
              content.style.opacity = '1';
              content.style.transform = 'scale(1)';
            }
          } else {
            p.classList.remove('active');
            // Force hide on mobile
            const content = p.querySelector('.panel-content');
            if (content) {
              content.style.opacity = '0';
              content.style.transform = 'scale(0.95)';
            }
          }
        });
      } else {
        // Smooth GSAP transitions for desktop only
        document.querySelectorAll('.panel').forEach((p, idx) => {
          if (idx === panelIndex) {
            // Incoming panel
            p.classList.add('active');
            const content = p.querySelector('.panel-content');
            gsap.to(content, {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          } else if (idx === previousPanel) {
            // Outgoing panel - fade out faster for overlap
            const content = p.querySelector('.panel-content');
            gsap.to(content, {
              opacity: 0.3,
              scale: 0.8,
              duration: 0.5,
              ease: 'power2.in',
              overwrite: 'auto',
              onComplete: () => p.classList.remove('active')
            });
          }
        });
      }
      
      changeBackground(panelIndex);
    }
  
    // --- Initialize GSAP animations ---
    function initGSAP() {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  
      const navDots = document.getElementById('navDots');
      const progressBar = document.querySelector('.progress-bar');
      
      // Initially hide the UI elements
      gsap.set([navDots, progressBar], { autoAlpha: 0 });
  
      // Detect mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Add mobile class for CSS targeting
        document.body.classList.add('mobile-device');
      }
      
      // Remove the separate ScrollTrigger - we'll handle visibility in the main timeline
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.story-wrapper',
          pin: true,
          scrub: isMobile ? true : 0.5,  // Direct scrub for mobile
          snap: { 
            snapTo: 1 / (totalPanels - 1),
            duration: { min: 0.2, max: 0.3 },
            delay: isMobile ? 0.1 : 0.05,
            ease: "power2.inOut"
          },
          end: '+=400%',
          onToggle: self => {
            // Show navigation when pinned, hide when not pinned
            if (self.isActive) {
              gsap.to([navDots, progressBar], { autoAlpha: 1, duration: 0.3 });
            } else {
              gsap.to([navDots, progressBar], { autoAlpha: 0, duration: 0.3 });
            }
          },
          onUpdate: self => {
            const progress = self.progress;
            const panelIdx = Math.min(totalPanels - 1, Math.round(progress * (totalPanels - 1)));
            updateActiveStates(panelIdx);
            document.getElementById('progressFill').style.width = progress * 100 + '%';
          }
        }
      });
  
      tl.to('#panelsContainer', { 
        xPercent: -100 * (totalPanels - 1) / totalPanels, 
        ease: 'none',
        force3D: !isMobile  // Disable 3D transforms on mobile
      })
        .addLabel('panel1', 0);
        for (let i = 1; i < totalPanels; i++) {
          tl.addLabel(`panel${i + 1}`, i / (totalPanels - 1));
        }
  
      scrollTriggerInstance = tl.scrollTrigger;
    }
  
    // --- Build panels markup ---
    function createPanelsMarkup() {
      const panels = [
        { title: 'The Spark', text: `I was fortunate to have begun my schooling in an exceptional musical environment where everyone in my class, from grade one through six, was a "music major." There was lots of musical interaction, and every week all grades would come together for singing in chorus and playing in orchestra. In fact, I was just 6 years old when I played my first duo: Mozart's e minor Sonata for Piano and Violin, K. 304. I still remember how much I loved playing with the violinist and how I was able to help her at her final exam! She was one year my senior and near a nervous breakdown as we went in to play for a really scary jury. Instinctively I moved to calm her and held her very shaky right hand for a few seconds. I had no idea if that would help settle her, but later she told me how thrilled she was that her bow didn't shake! Looking back, I see that it was an intensely positive spark that would eventually propel my professional life.` },
        { title: 'A Natural Path', text: `Throughout my high school years, I continued to benefit from being in a class of only music majors and it was more than natural for me to play for my classmates' lessons, exams, recitals, etc. Nothing has changed except that I have been privileged to play with some of the world's finest artists! Supporting my partners both musically and emotionally brings me great personal satisfaction–I feel I have done something good for the day. Due to these formative years in Taiwan, I have always thought of solo and collaborative piano as equally important. I love playing the piano, both solo and collaborative, but to put it simply, making music with others is what brings me true fulfillment.` },
        { title: 'A Life-Changing Discovery', text: `I came to the U.S. from Taiwan focused on solo piano, but after a year, I was excited to discover that major conservatories offered graduate degrees in "Accompanying"—a major discipline then unheard of back home. I expedited my undergraduate studies, finishing in three years so I could join the master's program at The Juilliard School in what is now more appropriately called "Collaborative Piano." I immediately felt I belonged, finally able to concentrate on—and support myself with—the work I had loved my entire life. I also gained invaluable experience working long Saturdays at the pre-college, running between lessons every half-hour for what was then just $6! This is how I discovered my passion, and today I am devoted to all aspects of the collaborative field—I perform, teach, and I am excited to have helped build graduate collaborative piano programs.` },
        { title: 'Passion to Profession', text: `My work at four prominent U.S. conservatories has taught me how crucial a thriving collaborative piano program is to a school's success. Unfortunately, many institutions view these programs merely as a means to utilize pianists for service, often neglecting their educational needs. Achieving a balance between a student's educational experience and the demands of institutional service is challenging, yet essential. A well-designed graduate curriculum is vital for preparing individuals for a diverse collaborative career. This topic was the focus of my doctoral thesis, The Collaborative Pianists: Balancing Roles in Partnership (ADD LINK). It is encouraging to witness so many new programs in my field globally and how they inspire a new generation of pianists to share in my love and passion for this art form.` },
        { title: 'Are You the Right Fit?', text: `I hope sharing my background is helpful to young pianists considering this path. Studying collaborative piano at the graduate level is busy, often hectic. Your day is filled with personal practice, rehearsals, playing for lessons, classes, student juries, and recitals—ideal for learning repertoire and gaining experience. Solid training as a pianist is really a prerequisite because the repertoire we must learn and keep in our fingers is enormous, not to mention all the related skills (e.g., orchestral reductions, lyric diction, score reading). You should know that "Collaborative Piano" is certainly not an escape from difficult repertoire, but it is an art form and a career for those who love the piano and making music with others. If this sounds like you, and you take pleasure in both leading and supportive roles (both are absolutely necessary), then collaborative piano is a fit. You may spend more time at the piano than ever before, but your life will be richer in ways that you cannot imagine.` }
      ];
      return panels.map((p, idx) => `<section class="panel${idx === 0 ? ' active' : ''}" data-panel="${idx + 1}"><div class="panel-content"><h2>${p.title}</h2><p>${p.text}</p></div></section>`).join('');
    }
  
    // --- Keyboard navigation support ---
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goToPanel(currentPanel - 1);
      else if (e.key === 'ArrowRight') goToPanel(currentPanel + 1);
    });
  
    // --- Initialization sequence ---
    function initialize() {
      createNavigation();
      // createAmbientOrbs(); // REMOVED - causing performance issues
      // createParticleSystem(); // REMOVED - causing performance issues  
      // createGeometricElements(); // REMOVED - causing performance issues

      // Detect platforms and add classes for CSS targeting
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      if (isAndroid) {
        document.body.classList.add('android-device');
      }
      if (isIOS) {
        document.body.classList.add('ios-device');
      }
      if (isAndroid || isIOS) {
        document.body.classList.add('mobile-device');
      }

      // Isolate nav dots from section stacking contexts by moving it to the body
      const navDots = document.getElementById('navDots');
      if (navDots) {
        document.body.appendChild(navDots);
        
        // Disable backdrop-filter for Android
        if (isAndroid) {
          navDots.style.backdropFilter = 'none';
          navDots.style.webkitBackdropFilter = 'none';
        }
      }

      // Initialize first background layer if not present
      if (dynamicBgContainer && !dynamicBgContainer.querySelector('.bg-layer')) {
        const firstLayer = document.createElement('div');
        firstLayer.className = 'bg-layer bg-panel-1';
        dynamicBgContainer.appendChild(firstLayer);
      }

      document.getElementById('loading').classList.add('hidden');
      
      // Ensure first panel is active on initialization and force update
      const panels = document.querySelectorAll('.panel');
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      panels.forEach((panel, idx) => {
        if (idx === 0) {
          panel.classList.add('active');
          if (isMobile) {
            const content = panel.querySelector('.panel-content');
            if (content) {
              content.style.opacity = '1';
              content.style.transform = 'scale(1)';
            }
          }
        } else {
          panel.classList.remove('active');
          if (isMobile) {
            const content = panel.querySelector('.panel-content');
            if (content) {
              content.style.opacity = '0';
              content.style.transform = 'scale(0.95)';
            }
          }
        }
      });
      
      initGSAP();
    }
  
    waitForGSAP(initialize);
  })();
  