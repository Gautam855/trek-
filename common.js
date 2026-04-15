/**
 * common.js
 * Handles global components (Header, Footer) and shared UI logic.
 */

async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    const content = await response.text();
    const target = document.getElementById(elementId);
    if (target) {
      target.innerHTML = content;
      return true;
    }
  } catch (error) {
    console.error("Component Load Error:", error);
  }
  return false;
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Highlight active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
  links.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.onclick = () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    };
    
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.onclick = () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      };
    });
  }
}

function initFooterLogic() {
  // Scroll Top
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('show', window.scrollY > 300);
    });
    scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // WhatsApp Logic
  const waFloatBtn = document.getElementById('waFloatBtn');
  const waChatBox = document.getElementById('waChatBox');
  const waCloseBtn = document.getElementById('waCloseBtn');
  const waMessageInput = document.getElementById('waMessageInput');
  const waSendBtn = document.getElementById('waSendBtn');

  if (waFloatBtn && waChatBox && waCloseBtn) {
    waFloatBtn.onclick = () => {
      waChatBox.classList.toggle('open');
      if (waChatBox.classList.contains('open') && waMessageInput) {
        setTimeout(() => waMessageInput.focus(), 300);
      }
    };
    waCloseBtn.onclick = () => waChatBox.classList.remove('open');

    const sendMsg = () => {
      const text = waMessageInput.value.trim();
      const url = `https://wa.me/918860022081${text ? '?text=' + encodeURIComponent(text) : ''}`;
      window.open(url, '_blank');
      waMessageInput.value = '';
      waChatBox.classList.remove('open');
    };

    if (waSendBtn) waSendBtn.onclick = sendMsg;
    if (waMessageInput) {
      waMessageInput.onkeypress = (e) => { if (e.key === 'Enter') sendMsg(); };
    }
  }
}

function initScrollAnimations() {
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  
  fadeEls.forEach(el => observer.observe(el));
}

// Global initialization
async function initSite() {
  // Load Header
  const headerLoaded = await loadComponent('header-placeholder', 'header.html');
  if (headerLoaded) initNavbar();

  // Load Footer
  const footerLoaded = await loadComponent('footer-placeholder', 'footer.html');
  if (footerLoaded) initFooterLogic();

  // Initialize Scroll Animations for fade-up elements
  initScrollAnimations();
}

document.addEventListener('DOMContentLoaded', initSite);
