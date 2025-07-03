// New Teaching & Collaboration Section Script
(function () {
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
  
    const totalPanels = 6;
    let currentPanel = 0;
    let scrollTriggerInstance = null; // To store the main ST instance

    // --- Dynamic background crossfade helper ---
    const dynamicBgContainer = document.getElementById('dynamicBg');
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
          // Ensure perfect centering by applying snap position
          setTimeout(() => {
            const snapProgress = Math.round(progress * (totalPanels - 1)) / (totalPanels - 1);
            const snapTargetScroll = scrollTriggerInstance.start + snapProgress * scrollDistance;
            
            // Fine-tune position if needed
            if (Math.abs(window.pageYOffset - snapTargetScroll) > 1) {
              gsap.set(window, { scrollTo: { y: snapTargetScroll } });
            }
            
            isNavigating = false;
          }, 50);
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
      currentPanel = panelIndex;
  
      document.querySelectorAll('.panel').forEach((p, idx) => p.classList.toggle('active', idx === panelIndex));
      document.querySelectorAll('.nav-dot').forEach((d, idx) => d.classList.toggle('active', idx === panelIndex));
      changeBackground(panelIndex);
    }
  
    // --- Initialize GSAP animations ---
    function initGSAP() {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  
      const navDots = document.getElementById('navDots');
      const progressBar = document.querySelector('.progress-bar');
      
      // Initially hide the UI elements
      gsap.set([navDots, progressBar], { autoAlpha: 0 });
  
      // Use a ScrollTrigger to toggle visibility of the nav UI
          // Keep nav dots visible while the horizontal story is active
      ScrollTrigger.create({
        trigger: '.story-wrapper',
        start: 'top bottom',   // Show when story wrapper enters viewport
        end: '+=600%',  // Further extended to ensure dots stay visible through last panel
        onToggle: self => {
          gsap.to([navDots, progressBar], { autoAlpha: self.isActive ? 1 : 0, duration: 0.3 });
        }
      });
  
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.story-wrapper',
          pin: true,
          scrub: 1,
          snap: { 
            snapTo: (progress) => {
              // Don't snap during programmatic navigation
              if (isNavigating) return progress;
              return Math.round(progress * (totalPanels - 1)) / (totalPanels - 1);
            }, 
            duration: 0.35, 
            delay: 0.15,  // Increased delay for better mobile snap behavior
            ease: "power2.inOut"
          },
          end: '+=400%',
          onUpdate: self => {
            const progress = self.progress;
            const panelIdx = Math.min(totalPanels - 1, Math.round(progress * (totalPanels - 1)));
            updateActiveStates(panelIdx);
            document.getElementById('progressFill').style.width = progress * 100 + '%';
          }
        }
      });
  
      tl.to('#panelsContainer', { xPercent: -100 * (totalPanels - 1) / totalPanels, ease: 'none' })
        .addLabel('panel1', 0);
        for (let i = 1; i < totalPanels; i++) {
          tl.addLabel(`panel${i + 1}`, i / (totalPanels - 1));
        }
  
      scrollTriggerInstance = tl.scrollTrigger;
    }
  
    // --- Build panels markup ---
    function createPanelsMarkup() {
      const panels = [
        { title: 'The Spark', text: `I was fortunate to have begun my schooling in an exceptional musical environment where everyone in my class, from grade one through six, was a "music major." There was lots of musical interaction, and every week all grades would come together for singing in chorus and playing in orchestra. In fact, I was just 6 years old when I played my first duo: Mozart's e minor Sonata for Piano and Violin, K. 304. I still remember how much I loved playing with the violinist and how fearless I was at her final exam! She was one year my senior and near a nervous breakdown as we went in to play for a really scary jury. Instinctively I moved to calm her, touching her shoulder and holding her very shaky right hand for a few seconds. I had no idea if that helped settle her, but later she told me how thrilled she was that her bow didn't shake!` },
        { title: 'A Natural Path', text: `Throughout my high school years, I continued to benefit from a specialized musical education, and it became more than natural for me to play for my classmates' lessons, exams, recitals, etc. It is no different today! Supporting the people I play with both musically and emotionally brings me great personal satisfaction–I feel I have done something good for the day. While some friends seemed disappointed that I did not continue to pursue more solo playing, they didn't realize that because of my formative years in Taiwan I have never thought of collaborative piano as something less important. I love playing the piano, both solo and collaborative, but to put it simply, making music with others is what brings me true fulfillment.` },
        { title: 'A Fortunate Discovery', text: `I came to the U.S. from Taiwan focused on solo piano, but after a year, I discovered that major conservatories offered graduate degrees in "Accompanying"—a field then unheard of back home. I expedited my undergraduate studies, finishing in three years to join the master's program at The Juilliard School in what is now more aptly called "Collaborative Piano." I immediately felt I belonged, finally able to concentrate on—and support myself with—the work I had loved my entire life. During my undergrad, I also gained invaluable experience working long Saturdays at the pre-college, running between lessons every half-hour for what was then just $6.` },
        { title: 'The Art of Collaboration', text: `This is how I discovered my passion, and today I am devoted to all aspects of the collaborative field—I perform, teach, and am excited to be building graduate collaborative piano programs. I hope sharing my background has been helpful to young pianists considering this path. Here are a few more things to know: "Collaborative Piano" is not an escape from difficult repertoire; it is an art form and a career for those who love the piano and making music with others. Studying collaborative piano at the graduate level is busy. Life is often hectic, but a music school is ideal for learning repertoire and gaining experience. Your day is filled with personal practice, rehearsals, playing for your partner's lessons, classes, concerts, student juries, and recitals.` },
        { title: 'Are You the Right Fit?', text: `Having solid training as a pianist is really a pre-requisite–the repertoire we have to learn and keep in our fingers is enormous, not to mention all the related skills (e.g., lyric diction, opera coaching, score reading). If you are a good pianist, love to work hard, enjoy people and the exchange of musical ideas, take pleasure in both leading and supportive roles (the two are absolutely necessary), then collaborative piano is probably for you. You may spend more time at the piano than ever before, but your life will be richer in ways that you cannot imagine.` },
        { title: 'A Deeper Understanding', text: `My work at four major U.S. conservatories taught me how essential collaborative piano programs are to a school's overall success. I saw firsthand the challenge of balancing a student's education with institutional service needs, which inspired my doctoral work. It's unfortunate that some administrators misjudge these programs as just a source of service pianists—a misguided oversimplification that never works. Seeing new programs emerge worldwide, I felt my education from three of the world's best could be of help. My thesis, therefore, examines how to balance a demanding master's curriculum with a school's need for accompanists to create a model that truly serves everyone.` }
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

      // Isolate nav dots from section stacking contexts by moving it to the body
      const navDots = document.getElementById('navDots');
      if (navDots) {
        document.body.appendChild(navDots);
      }

      // Initialize first background layer if not present
      if (dynamicBgContainer && !dynamicBgContainer.querySelector('.bg-layer')) {
        const firstLayer = document.createElement('div');
        firstLayer.className = 'bg-layer bg-panel-1';
        dynamicBgContainer.appendChild(firstLayer);
      }

      document.getElementById('loading').classList.add('hidden');
      initGSAP();
    }
  
    waitForGSAP(initialize);
  })();
  