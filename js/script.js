const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const button = item.querySelector('.faq-question');

  button.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all items first
    faqItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // If it wasn't already open, open it
    if (!isOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

const header = document.querySelector('header');
let lastScrollY = window.scrollY;
let ticking = false;

function updateHeader() {
    const currentScrollY = window.scrollY;

    // Don't hide header at the very top of the page
    if (currentScrollY <= 0) {
        header.classList.remove('hidden');
        header.classList.add('visible');
        lastScrollY = currentScrollY;
        ticking = false;
        return;
    }

    if (currentScrollY > lastScrollY) {
        // Scrolling DOWN — hide header
        header.classList.add('hidden');
        header.classList.remove('visible');
    } else {
        // Scrolling UP — show header
        header.classList.remove('hidden');
        header.classList.add('visible');
    }

    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        // requestAnimationFrame keeps it smooth and performant
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});

