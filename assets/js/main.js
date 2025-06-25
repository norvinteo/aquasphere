// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.innerHTML = navMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth Scrolling and Active Nav
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// Progress Bar and Active Section
const sections = document.querySelectorAll('section');
const progressBar = document.querySelector('.progress-bar');

function updateProgress() {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxScroll) * 100;
    progressBar.style.width = progress + '%';

    // Update active nav link
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            const id = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateProgress);

// Scroll Indicator
const scrollIndicator = document.querySelector('.scroll-indicator');
scrollIndicator.addEventListener('click', () => {
    document.getElementById('logos').scrollIntoView({ behavior: 'smooth' });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Color Copy to Clipboard
const colorDisplays = document.querySelectorAll('.color-display');
const toast = document.getElementById('toast');

colorDisplays.forEach(display => {
    display.addEventListener('click', () => {
        const color = display.getAttribute('data-color');
        navigator.clipboard.writeText(color).then(() => {
            showToast(`Copied ${color} to clipboard!`);
        });
    });
});

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Enhanced Lightbox for Logos
const lightbox = document.getElementById('lightbox');
const lightboxContainer = document.getElementById('lightbox-img-container');
const lightboxClose = document.querySelector('.lightbox-close');
const logoItems = document.querySelectorAll('.logo-item');
let currentZoom = 1;
let currentImageSrc = '';

// Create zoom controls
function createZoomControls() {
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    zoomControls.innerHTML = `
        <button class="zoom-btn zoom-out" title="Zoom Out"><span>−</span></button>
        <span class="zoom-level">100%</span>
        <button class="zoom-btn zoom-in" title="Zoom In"><span>+</span></button>
        <button class="zoom-btn zoom-reset" title="Reset Zoom"><span>⟲</span></button>
    `;
    return zoomControls;
}

// Image loading with spinner
function loadImageWithSpinner(src, alt) {
    lightboxContainer.innerHTML = '<div class="loading-spinner"></div>';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || 'Logo Preview';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '70vh';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.transition = 'transform 0.3s ease';
    img.style.transform = `scale(${currentZoom})`;
    
    img.onload = () => {
        lightboxContainer.innerHTML = '';
        lightboxContainer.appendChild(img);
        
        // Add zoom controls
        const controls = createZoomControls();
        lightboxContainer.appendChild(controls);
        
        // Setup zoom functionality
        setupZoomControls(img);
        
        lightbox.classList.add('active');
        currentImageSrc = src;
    };
    
    img.onerror = () => {
        lightboxContainer.innerHTML = '<p style="color: #666;">Failed to load image</p>';
        lightbox.classList.add('active');
    };
}

// Setup zoom controls
function setupZoomControls(img) {
    const zoomIn = lightboxContainer.querySelector('.zoom-in');
    const zoomOut = lightboxContainer.querySelector('.zoom-out');
    const zoomReset = lightboxContainer.querySelector('.zoom-reset');
    const zoomLevel = lightboxContainer.querySelector('.zoom-level');
    
    function updateZoom(newZoom) {
        currentZoom = Math.max(0.5, Math.min(3, newZoom));
        img.style.transform = `scale(${currentZoom})`;
        zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
        
        zoomOut.disabled = currentZoom <= 0.5;
        zoomIn.disabled = currentZoom >= 3;
    }
    
    zoomIn.addEventListener('click', () => updateZoom(currentZoom + 0.25));
    zoomOut.addEventListener('click', () => updateZoom(currentZoom - 0.25));
    zoomReset.addEventListener('click', () => updateZoom(1));
}

// Lightbox click handler
logoItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const logoImg = item.querySelector('img');
        if (logoImg) {
            currentZoom = 1;
            loadImageWithSpinner(logoImg.src, logoImg.alt);
        }
    });
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case '+':
            case '=':
                const zoomInBtn = lightboxContainer.querySelector('.zoom-in');
                if (zoomInBtn && !zoomInBtn.disabled) zoomInBtn.click();
                break;
            case '-':
            case '_':
                const zoomOutBtn = lightboxContainer.querySelector('.zoom-out');
                if (zoomOutBtn && !zoomOutBtn.disabled) zoomOutBtn.click();
                break;
            case '0':
                const zoomResetBtn = lightboxContainer.querySelector('.zoom-reset');
                if (zoomResetBtn) zoomResetBtn.click();
                break;
        }
    }
});

function closeLightbox() {
    lightbox.classList.remove('active');
    currentZoom = 1;
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Touch/Swipe Support for Mobile
let touchStartX = 0;
let touchEndX = 0;
let currentSection = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentSection < sections.length - 1) {
            // Swipe left - next section
            currentSection++;
        } else if (diff < 0 && currentSection > 0) {
            // Swipe right - previous section
            currentSection--;
        }
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
    }
}

// Update current section on scroll
window.addEventListener('scroll', () => {
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= -100 && rect.top <= 100) {
            currentSection = index;
        }
    });
});

// Navbar hide on scroll down, show on scroll up
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Dark Mode Toggle
function createDarkModeToggle() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.title = 'Toggle Dark Mode';
    document.body.appendChild(darkModeToggle);
    
    // Check for saved preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// Removed download all button functionality

// Image preloading for better performance
function preloadImages() {
    const imagePaths = [
        'assets/images/main.png',
        'assets/images/logo only.png',
        'assets/images/letterhead.png'
    ];
    
    imagePaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createDarkModeToggle();
    preloadImages();
});