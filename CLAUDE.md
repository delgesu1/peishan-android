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

## Testing Considerations
- Test all sections on both desktop and mobile viewports
- Verify smooth scrolling and navigation functionality
- Check form submission with valid/invalid data
- Test with browser cache disabled to ensure cache busting works
- Verify GSAP animations perform well on lower-end devices

## Performance Notes
- Tailwind CSS is loaded via CDN which may impact initial load time
- GSAP and its plugins are loaded asynchronously with defer
- Images should be optimized before deployment using the provided script
- Consider lazy loading for images below the fold