# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Pei-Shan Lee, a collaborative pianist and educator. The site is built with vanilla JavaScript, HTML, CSS, and uses Tailwind CSS for styling. It's deployed on Netlify and consists of a single-page application with multiple sections including biography, media, press reviews, teaching information, and contact forms.

## Key Technologies

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **CSS Framework**: Tailwind CSS (via CDN)
- **Animation**: GSAP (GreenSock Animation Platform) with ScrollTrigger
- **Deployment**: Netlify
- **Image Optimization**: Sharp.js for build-time optimization
- **Form Handling**: Web3Forms API

## Architecture and Structure

### HTML Structure
- `index.html` - Main single-page application
- `teachingcollaborativepiano.html` - Dedicated teaching page

### CSS Architecture
The project follows a section-based namespace pattern to avoid style conflicts:

```
css/
├── styles.css                  # Base styles and global resets
├── elegant-contact.css         # Contact section styles
├── press-overrides.css         # Press section specific overrides
├── teaching-section-new.css    # Teaching section styles
├── video-modal.css            # Video modal styles
├── links-section.css          # Links section styles
└── contact-web3forms.css      # Web3Forms integration styles
```

**Important**: Always scope new styles to their respective section using ID selectors (e.g., `#press`, `#contact`, `#teaching`) to maintain specificity and avoid conflicts.

### JavaScript Structure
```
js/
├── script.js                   # Main application logic, navigation, GSAP animations
├── elegant-contact.js          # Contact form handling and validation
└── teaching-section-new.js     # Teaching section interactions
```

### Cache Busting
CSS and JS files use query string versioning (e.g., `?v=YYYYMMDD`) for cache busting. Update these when making changes to ensure users see the latest version.

## Common Development Tasks

### Running Image Optimization
```bash
node optimize-images.js
```
This optimizes all JPEG images in `./Pei-Shan Images` and `./images` directories using Sharp.js.

### Local Development
Since this is a static site, use any local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server (if installed)
npx http-server

# Using VS Code Live Server extension
# Right-click on index.html and select "Open with Live Server"
```

### Deployment
The site auto-deploys to Netlify on push to the main branch. The `netlify.toml` configuration handles routing.

## Important Patterns and Conventions

### Section-Based Development
1. Each major section has its own ID (`#hero`, `#biography`, `#media`, `#press`, `#teaching`, `#contact`)
2. Styles are scoped to sections to prevent conflicts
3. JavaScript functionality is often section-specific

### GSAP Animations
- ScrollTrigger is used extensively for scroll-based animations
- Animations are defined in `script.js` with careful attention to performance
- Always test on mobile devices as animations may need different settings

### Form Handling
The contact form uses Web3Forms API. The access key is embedded in the HTML. Form validation and submission logic is in `elegant-contact.js`.

### Image Handling
- Hero images should be high quality (90% quality setting)
- Standard images are optimized to max 1920px width at 80% quality
- Always run `optimize-images.js` after adding new images

## Style Conflict Resolution Plan
Per `STYLE_NAMESPACE_REFactor_PLAN.md`, the project is moving away from global selectors to prevent style conflicts:
1. Generic selectors like `.article-link` are being replaced with section-scoped versions
2. Reusable styles are being moved to utility classes
3. Each section maintains its own namespace

## Mobile and Android-Specific Implementations

### Android Detection and Handling
The project includes extensive Android-specific optimizations to address rendering issues unique to Android WebView:

#### JavaScript Detection (teaching-section-new.js)
```javascript
const isAndroid = /Android/i.test(navigator.userAgent);
if (isAndroid) {
  document.body.classList.add('android-device');
}
```

#### GSAP ScrollTrigger Android Settings
Android devices use specific ScrollTrigger settings to prevent ghost text and rendering issues:
```javascript
pinType: isAndroid ? 'fixed' : 'transform',
anticipatePin: isAndroid ? 0 : 1,
fastScrollEnd: isAndroid ? false : true,
preventOverlaps: isAndroid ? true : false
```

#### CSS Android-Specific Fixes
The `.android-device` class is used to apply Android-specific styles:

1. **Backdrop Filter Disabled**: Android has limited support for backdrop-filter
   ```css
   .android-device .nav-dots,
   .android-device .progress-bar {
     backdrop-filter: none !important;
   }
   ```

2. **Will-Change Optimizations**: Prevents compositing issues
   ```css
   .android-device .story-wrapper,
   .android-device .panels-container,
   .android-device .dynamic-bg {
     will-change: auto !important;
   }
   ```

3. **Panel Visibility Management**: Completely hides non-active panels
   ```css
   .android-device .panel:not(.active) {
     display: none !important;
   }
   ```

4. **Z-Index Hierarchy**: Ensures proper layering
   ```css
   .android-device .nav-dots { z-index: 9999 !important; }
   .android-device .progress-bar { z-index: 9998 !important; }
   ```

5. **Solid Backgrounds**: Prevents text bleed-through
   ```css
   .android-device .panel-content {
     background: rgba(0, 0, 0, 0.95) !important;
   }
   ```

### Mobile-Responsive Design

#### Mobile Navigation
- Hamburger menu for screens < 768px
- Overlay menu with animated links
- Touch-friendly navigation dots in teaching section
- Mobile device detection excludes navigation dots on phones:
  ```javascript
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  ```

#### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

#### Mobile-Specific Features
- Touch gestures for panel navigation
- Simplified animations for performance
- Larger touch targets for interactive elements
- Optimized font sizes and spacing

### Known Android Issues and Solutions

1. **Ghost Text Issue**: Text from hidden panels appearing through active panels
   - Solution: Use `display: none` for inactive panels on Android
   - Add solid backgrounds to panel content
   - Disable will-change properties

2. **Transform Rendering**: Poor performance with transform animations
   - Solution: Use `pinType: 'fixed'` for ScrollTrigger
   - Add `transform: translateZ(0)` for hardware acceleration

3. **Backdrop Filter**: Limited support in Android WebView
   - Solution: Detect and disable backdrop-filter
   - Use solid backgrounds as fallback

## Testing Considerations
- Test all sections on both desktop and mobile viewports
- **Android Testing**: Test specifically on Android Chrome and WebView
- Verify smooth scrolling and navigation functionality
- Check form submission with valid/invalid data
- Test with browser cache disabled to ensure cache busting works
- Verify GSAP animations perform well on lower-end devices
- **Mobile Testing**: Test touch gestures and mobile menu functionality
- **Cross-Browser**: Test on iOS Safari, Android Chrome, and desktop browsers

## Performance Notes
- Tailwind CSS is loaded via CDN which may impact initial load time
- GSAP and its plugins are loaded asynchronously with defer
- Images should be optimized before deployment using the provided script
- Consider lazy loading for images below the fold
- **Mobile Performance**: Simplified animations and reduced particle effects for mobile
- **Android Optimization**: Disabled complex visual effects (backdrop-filter, will-change) for better performance