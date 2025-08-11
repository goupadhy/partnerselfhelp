// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const cards = document.querySelectorAll('.card');
const actionButtons = document.querySelectorAll('.action-btn');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on menu items
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const sectionTop = section.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Add click event listeners to navigation links
document.querySelectorAll('.nav-menu a, .cta-button').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const sectionId = href.substring(1);
            scrollToSection(sectionId);
        }
    });
});

// Filter Cards Functionality
function filterCards(category) {
    // Remove active class from all buttons
    actionButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    const activeButton = Array.from(actionButtons).find(btn => 
        btn.textContent.toLowerCase().includes(category.toLowerCase()) || 
        (category === 'all' && btn.textContent.toLowerCase().includes('show all'))
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }

    cards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            card.classList.add('visible');
            
            // Add staggered animation delay
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        }
    });
}

// Add event listeners to filter buttons
actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes('getting started')) {
            filterCards('getting-started');
        } else if (buttonText.includes('technical')) {
            filterCards('technical');
        } else if (buttonText.includes('business')) {
            filterCards('business');
        } else if (buttonText.includes('show all')) {
            filterCards('all');
        }
    });
});

// Card hover effects and interactions
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
    
    // Add click tracking for analytics (placeholder)
    card.addEventListener('click', () => {
        const cardTitle = card.querySelector('h3').textContent;
        console.log(`Card clicked: ${cardTitle}`);
        
        // Add ripple effect
        createRippleEffect(card, event);
    });
});

// Create ripple effect on card click
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Add ripple styles
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(0, 120, 212, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add CSS for ripple animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 120, 212, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #0078d4, #106ebe)';
        navbar.style.backdropFilter = 'none';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loading');
            
            // Add staggered animation for cards in the same section
            const sectionCards = entry.target.querySelectorAll('.card');
            sectionCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Search functionality (placeholder for future enhancement)
function searchResources(query) {
    const searchTerm = query.toLowerCase();
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('search-result');
        } else {
            card.style.display = 'none';
            card.classList.remove('search-result');
        }
    });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Press '1', '2', '3' to navigate to sections
    if (e.key === '1') scrollToSection('getting-started');
    if (e.key === '2') scrollToSection('technical-resources');
    if (e.key === '3') scrollToSection('business-support');
});

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // Integrate with your analytics platform here
}

// Track page load
document.addEventListener('DOMContentLoaded', () => {
    trackEvent('page_load', {
        page: 'Azure Marketplace Resources',
        timestamp: new Date().toISOString()
    });
    
    // Initialize default filter (show all)
    filterCards('all');
    
    // Add loading animation to initial elements
    setTimeout(() => {
        document.querySelectorAll('.card').forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
});

// Resource link click tracking
document.querySelectorAll('.card-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const cardTitle = link.closest('.card').querySelector('h3').textContent;
        const href = link.getAttribute('href');
        
        // Only prevent default for placeholder links (href="#")
        if (href === '#') {
            e.preventDefault();
            console.log(`Navigating to resource: ${cardTitle}`);
        }
        
        trackEvent('resource_click', {
            resource: cardTitle,
            section: link.closest('.section').id,
            url: href
        });
        
        // Add visual feedback
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
    });
});

// Theme toggle functionality (bonus feature)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Performance optimization: Lazy loading for images (if added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Call lazy loading if images are present
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        line: e.lineno
    });
});

// Export functions for external use (if needed)
window.AzureMarketplaceApp = {
    scrollToSection,
    filterCards,
    searchResources,
    trackEvent,
    toggleTheme
};
