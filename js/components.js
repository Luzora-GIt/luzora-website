// Loads an HTML file and injects it into a target element
async function loadComponent(selector, filePath) {
    const element = document.querySelector(selector);
    if (!element) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error('Component load error:', error);
    }
}

// Load all components when page is ready
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load components first
    await loadComponent('header', 'components/header.html');
    await loadComponent('.footer-section', 'components/footer.html');

    // 2. NOW query elements — they exist in the DOM at this point
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('close-button');
    const navOverlay = document.querySelector('.navigation-overlay');

    // 3. Safety check — stop if any element is missing
    if (!menuBtn || !closeBtn || !navOverlay) {
        console.error('Nav elements not found:', { menuBtn, closeBtn, navOverlay });
        return;
    }

    // 4. Nav functions
    function openNav() {
        navOverlay.style.visibility = 'visible';
        navOverlay.style.opacity = '1';
        navOverlay.style.transform = 'translateY(0) scale(1)';
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        navOverlay.style.visibility = 'hidden';
        navOverlay.style.opacity = '0';
        navOverlay.style.transform = 'translateY(-8px) scale(0.98)';
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // 5. Event listeners
    menuBtn.addEventListener('click', openNav);
    closeBtn.addEventListener('click', closeNav);

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navOverlay.style.visibility === 'visible' &&
            !navOverlay.contains(e.target) &&
            !menuBtn.contains(e.target)
        ) {
            closeNav();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });

    // Close when a nav link is clicked
    const overlayLinks = document.querySelectorAll('.overlay-nav-button');
    overlayLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

});