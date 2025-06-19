// New Teaching & Collaboration Section Script
(function () {
  // Ensure GSAP is available
  function waitForGSAP(callback) {
    if (window.gsap && window.ScrollTrigger) {
      return callback();
    }
    setTimeout(() => waitForGSAP(callback), 50);
  }

  const section = document.getElementById('teaching-collaboration');
  if (!section) return;

  // Replace old innerHTML with the new scroll-story markup
  section.innerHTML = `
    <!-- Loading screen -->
    <div class="loading" id="loading">
        <div class="loading-text">Loading Experience...</div>
    </div>

    <!-- Progress bar -->
    <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
    </div>

    <!-- Navigation dots -->
    <div class="nav-dots" id="navDots"></div>

    <!-- Scroll indicator -->
    <div class="scroll-indicator" id="scrollIndicator">Scroll to explore</div>

    <!-- Main story wrapper -->
    <div class="story-wrapper" id="storyWrapper">
        <!-- Dynamic background -->
        <div class="dynamic-bg" id="dynamicBg"></div>

        <!-- Panels container -->
        <div class="panels-container" id="panelsContainer">
            ${createPanelsMarkup()}
        </div>
    </div>

    <!-- Spacer for scroll distance -->
    <div class="scroll-spacer"></div>
  `;

  const totalPanels = 6;
  let currentPanel = 0;

  // Create navigation dots
  function createNavigation() {
    const navContainer = document.getElementById('navDots');
    navContainer.innerHTML = '';
    for (let i = 0; i < totalPanels; i++) {
      const dot = document.createElement('div');
      dot.className = 'nav-dot';
      if (i === 0) dot.classList.add('active');
      dot.dataset.panel = i;
      navContainer.appendChild(dot);
      dot.addEventListener('click', () => {
        const progress = i / (totalPanels - 1);
        const scrollPosition = progress * (document.body.scrollHeight - window.innerHeight);
        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
      });
    }
  }

  // Update active states (panels, dots, bg)
  function updateActiveStates(panelIndex) {
    if (panelIndex === currentPanel) return;
    currentPanel = panelIndex;

    document.querySelectorAll('.panel').forEach((panel, idx) => {
      panel.classList.toggle('active', idx === panelIndex);
    });
    document.querySelectorAll('.nav-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === panelIndex);
    });

    const bg = document.getElementById('dynamicBg');
    bg.className = `dynamic-bg bg-panel-${panelIndex + 1}`;

    if (panelIndex > 0) {
      document.getElementById('scrollIndicator').classList.add('hidden');
    }
  }

  // Initialize GSAP animations
  function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline({
      scrollTrigger: {
        trigger: '.story-wrapper',
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 'labels',
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1
        },
        end: '+=400%',
        onUpdate: (self) => {
          const progress = self.progress;
          const panelIdx = Math.round(progress * (totalPanels - 1));
          updateActiveStates(panelIdx);
          document.getElementById('progressFill').style.width = progress * 100 + '%';
        }
      }
    })
      .to('#panelsContainer', {
        x: '-83.333%',
        ease: 'none',
        duration: 1
      })
      .addLabel('panel1', 0)
      .addLabel('panel2', 0.2)
      .addLabel('panel3', 0.4)
      .addLabel('panel4', 0.6)
      .addLabel('panel5', 0.8)
      .addLabel('panel6', 1);
  }

  // Build panels markup (same prose as standalone page)
  function createPanelsMarkup() {
    const panels = [
      {
        title: 'The Spark',
        text: `I was fortunate to have begun my schooling in an exceptional musical environment where everyone in my class, from grade one through six, was a "music major." There was lots of musical interaction, and every week all grades would come together for singing in chorus and playing in orchestra. In fact, I was just 6 years old when I played my first duo: Mozart's e minor Sonata for Piano and Violin, K. 304. I still remember how much I loved playing with the violinist and how fearless I was at her final exam! She was one year my senior and near a nervous breakdown as we went in to play for a really scary jury. Instinctively I moved to calm her, touching her shoulder and holding her very shaky right hand for a few seconds. I had no idea if that helped settle her, but later she told me how thrilled she was that her bow didn't shake!`
      },
      {
        title: 'A Natural Path',
        text: `Throughout my high school years, I continued to benefit from a specialized musical education, and it became more than natural for me to play for my classmates' lessons, exams, recitals, etc. It is no different today! Supporting the people I play with both musically and emotionally brings me great personal satisfaction–I feel I have done something good for the day. While some friends seemed disappointed that I did not continue to pursue more solo playing, they didn't realize that because of my formative years in Taiwan I have never thought of collaborative piano as something less important. I love playing the piano, both solo and collaborative, but to put it simply, making music with others is what brings me true fulfillment.`
      },
      {
        title: 'A Fortunate Discovery',
        text: `As a kid in Taiwan, my piano focus was solo, and I first came to the U.S. to continue the study of solo piano. It was after spending a year in the U.S. that I learned that several major conservatories offered graduate degrees in "Accompanying." This was something unheard of in Taiwan (fortunately it's different now!). I decided to expedite my undergraduate studies, earned my bachelor's degree in three years, and was admitted to the master's degree program in "Accompanying" at The Juilliard School. Today, the program has been more appropriately renamed "Collaborative Piano." Immediately I felt this field is where I belong—I was so content that I could concentrate on (and financially support myself with) what I loved doing all my life. Throughout my undergraduate years, I worked 9 to 6 Saturdays at the pre-college, running from one place to another every half-hour (the pay back then was $6 for 30 minutes!) and gaining invaluable experience playing with other people.`
      },
      {
        title: 'The Art of Collaboration',
        text: `This is how I discovered my passion. Today I am completely devoted to all aspects of the collaborative field—I perform, I teach, and I am excited to be building graduate collaborative piano programs. To young pianists considering these same choices, I hope that sharing my background here has been helpful. Here are a few more things to know about following a collaborative path: "Collaborative Piano" is not an escape from difficult repertoire—it is an art form and a career choice, a different role for those who truly love the piano and love making music with others. Studying collaborative piano at the graduate level is busy. Life is often hectic, but a music school setting is ideal for learning repertoire and accumulating experience. Your day is filled with personal practice, rehearsals, playing for your partner's lessons, in classes, concerts, student juries and recitals, etc.`
      },
      {
        title: 'Are You the Right Fit?',
        text: `Having solid training as a pianist is really a pre-requisite–the repertoire we have to learn and keep in our fingers is enormous, not to mention all the related skills (e.g., lyric diction, opera coaching, score reading). If you are a good pianist, love to work hard, enjoy people and the exchange of musical ideas, take pleasure in both leading and supportive roles (the two are absolutely necessary), then collaborative piano is probably for you. You may spend more time at the piano than ever before, but your life will be richer in ways that you cannot imagine.`
      },
      {
        title: 'A Deeper Understanding',
        text: `Working and studying at four major music conservatories in the U.S. taught me how essential a collaborative piano program is to the success of the rest of a school. I became aware of what worked and what didn't, and how challenging it could be to balance the education of a collaborative piano major with the service needs of the institution. As a doctoral student, I began teaching sonata coaching and collaborative courses to pianists and instrumentalists, organizing several departmental events, and started to look for subjects for my doctoral thesis. It is unfortunate that some school administrators think of this program only as a way to attract pianists to play for their instrumental and vocal students, a misguided oversimplification that never works. When I discovered that more and more music schools of the world were beginning to establish collaborative piano programs, I realized I could potentially be of help by writing about what I had learned–I have been educated in three of the best collaborative piano programs in the world! The bulk of my paper examines how to balance the service needs of a school accompanying system with the demanding curriculum of a MM in Collaborative Piano.`
      }
    ];

    return panels
      .map((p, idx) => {
        return `<section class="panel${idx === 0 ? ' active' : ''}" data-panel="${idx + 1}"><div class="panel-content"><h2>${p.title}</h2><p>${p.text}</p></div></section>`;
      })
      .join('');
  }

  // Initialization sequence
  function initialize() {
    createNavigation();
    document.getElementById('loading').classList.add('hidden');
    setTimeout(() => initGSAP(), 200);
  }

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPanel > 0) {
      const progress = (currentPanel - 1) / (totalPanels - 1);
      const scrollPosition = progress * (document.body.scrollHeight - window.innerHeight);
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    } else if (e.key === 'ArrowRight' && currentPanel < totalPanels - 1) {
      const progress = (currentPanel + 1) / (totalPanels - 1);
      const scrollPosition = progress * (document.body.scrollHeight - window.innerHeight);
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  });

  waitForGSAP(initialize);
})();
