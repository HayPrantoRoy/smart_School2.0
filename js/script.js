// Optimized Global Variables with better performance
const APP_CONFIG = {
    slideIndex: 0,
    currentMonthIndex: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    captions: ["বিদ্যালয় গেট", "প্রধান ভবন", "শ্রেণীকক্ষ", "খেলার মাঠ"],
    months: ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"],
    bengaliDigits: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
    newsItems: [
        "২০২৫ সালের অর্ধ-বার্ষিক পরীক্ষার ফলাফল ওয়েবসাইটে প্রকাশ।",
        "নতুন শিক্ষাবর্ষের ভর্তি প্রক্রিয়া শুরু হয়েছে।",
        "বিদ্যালয়ের বার্ষিক ক্রীড়া প্রতিযোগিতা আগামী মাসে অনুষ্ঠিত হবে।",
        "শিক্ক-অভিভাবক সভা আগামী সপ্তাহে অনুষ্ঠিত হবে।",
        "বার্ষিক সাংস্কৃতিক অনুষ্ঠানের জন্য নিবন্ধন শুরু হয়েছে।"
    ]
};

// Cache DOM elements for better performance
const DOM_CACHE = {};

function cacheElement(id) {
    if (!DOM_CACHE[id]) {
        DOM_CACHE[id] = document.getElementById(id);
    }
    return DOM_CACHE[id];
}

// Optimized Mobile Menu Toggle with GPU acceleration
const toggleMenu = (() => {
    let isOpen = false;
    return () => {
        const menu = cacheElement('navMenu');
        if (!menu) return;
        
        isOpen = !isOpen;
        menu.style.transform = isOpen ? 'translateX(0)' : 'translateX(-100%)';
        menu.classList.toggle('show', isOpen);
    };
})();

// Fast Accordion Toggle with single reflow
function toggleBox(header) {
    if (!header?.parentElement) return;
    
    const box = header.parentElement;
    const content = box.querySelector('.box-content');
    const isOpen = box.classList.contains('open');
    
    // Use transform instead of display for better performance
    requestAnimationFrame(() => {
        box.classList.toggle('open', !isOpen);
        if (content) {
            content.style.maxHeight = !isOpen ? content.scrollHeight + 'px' : '0';
            content.style.opacity = !isOpen ? '1' : '0';
        }
    });
}

// Ultra-smooth Image Slider with hardware acceleration
const SliderController = (() => {
    let container, caption, dots;
    let isTransitioning = false;
    
    const init = () => {
        container = cacheElement('sliderContainer');
        caption = cacheElement('imageCaption');
        dots = document.querySelectorAll('.dot, .slide-line');
        
        if (container) {
            container.style.willChange = 'transform';
            container.style.transform = 'translate3d(0, 0, 0)'; // Enable GPU acceleration
        }
    };
    
    const updateSlider = () => {
        if (!container || isTransitioning) return;
        
        isTransitioning = true;
        const translateX = -(APP_CONFIG.slideIndex * 100);
        
        requestAnimationFrame(() => {
            container.style.transform = `translate3d(${translateX}%, 0, 0)`;
            
            if (caption) {
                caption.textContent = APP_CONFIG.captions[APP_CONFIG.slideIndex];
            }
            
            // Update dots efficiently
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === APP_CONFIG.slideIndex);
            });
            
            // Update slide counter
            const counter = cacheElement('currentSlide');
            if (counter) {
                counter.textContent = String(APP_CONFIG.slideIndex + 1).padStart(2, '0');
            }
            
            setTimeout(() => { isTransitioning = false; }, 300);
        });
    };
    
    const changeSlide = (direction) => {
        if (isTransitioning) return;
        
        APP_CONFIG.slideIndex += direction;
        const maxSlides = APP_CONFIG.captions.length;
        
        if (APP_CONFIG.slideIndex >= maxSlides) APP_CONFIG.slideIndex = 0;
        else if (APP_CONFIG.slideIndex < 0) APP_CONFIG.slideIndex = maxSlides - 1;
        
        updateSlider();
    };
    
    const currentSlide = (index) => {
        if (isTransitioning) return;
        APP_CONFIG.slideIndex = index - 1;
        updateSlider();
    };
    
    return { init, updateSlider, changeSlide, currentSlide };
})();

// Optimized Calendar with minimal DOM manipulation
const CalendarController = (() => {
    let calendarBody, monthYearEl;
    let calendarHTML = '';
    
    const init = () => {
        calendarBody = cacheElement('calendarBody');
        monthYearEl = cacheElement('monthYear');
    };
    
    const generateCalendar = (month, year) => {
        if (!calendarBody) return;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        let html = '';
        let date = 1;
        
        // Build HTML string in memory (faster than DOM manipulation)
        for (let i = 0; i < 6; i++) {
            html += '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    html += '<td></td>';
                } else if (date > daysInMonth) {
                    break;
                } else {
                    const isToday = (date === today.getDate() && 
                                   month === today.getMonth() && 
                                   year === today.getFullYear());
                    const classes = isToday ? 'today' : (date === 15 ? 'highlight' : '');
                    html += `<td class="${classes}">${date}</td>`;
                    date++;
                }
            }
            html += '</tr>';
            if (date > daysInMonth) break;
        }
        
        // Single DOM update
        requestAnimationFrame(() => {
            calendarBody.innerHTML = html;
            if (monthYearEl) {
                monthYearEl.textContent = `${APP_CONFIG.months[month]} ${year}`;
            }
        });
    };
    
    const changeMonth = (direction) => {
        APP_CONFIG.currentMonthIndex += direction;
        
        if (APP_CONFIG.currentMonthIndex > 11) {
            APP_CONFIG.currentMonthIndex = 0;
            APP_CONFIG.currentYear++;
        } else if (APP_CONFIG.currentMonthIndex < 0) {
            APP_CONFIG.currentMonthIndex = 11;
            APP_CONFIG.currentYear--;
        }
        
        generateCalendar(APP_CONFIG.currentMonthIndex, APP_CONFIG.currentYear);
    };
    
    return { init, generateCalendar, changeMonth };
})();

// Optimized Attendance with batch updates
const AttendanceController = (() => {
    const updateAttendance = () => {
        const total = 537;
        const present = Math.floor(Math.random() * 50) + 480;
        const absent = total - present;
        
        requestAnimationFrame(() => {
            const presentEl = cacheElement('todayPresent');
            const absentEl = cacheElement('todayAbsent');
            
            if (presentEl) presentEl.textContent = present;
            if (absentEl) absentEl.textContent = absent;
        });
    };
    
    return { updateAttendance };
})();

// Fast Visitor Counter with optimized updates
const VisitorController = (() => {
    const updateVisitorCount = () => {
        const currentElement = cacheElement('visitorCount');
        if (!currentElement) return;
        
        const current = parseInt(currentElement.textContent) || 0;
        requestAnimationFrame(() => {
            currentElement.textContent = (current + 1).toString().padStart(7, '0');
        });
    };
    
    return { updateVisitorCount };
})();

// Ultra-smooth Typewriter Effect with RAF
const TypewriterController = (() => {
    let itemIndex = 0;
    let charIndex = 0;
    let typewriter;
    let animationId;
    
    const config = {
        typingSpeed: 60,
        deletingSpeed: 30,
        pauseBetween: 1500
    };
    
    const init = () => {
        typewriter = cacheElement("typewriter");
    };
    
    const typeEffect = () => {
        if (!typewriter) return;
        
        const currentText = APP_CONFIG.newsItems[itemIndex];
        if (charIndex < currentText.length) {
            typewriter.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            animationId = setTimeout(typeEffect, config.typingSpeed);
        } else {
            animationId = setTimeout(deleteEffect, config.pauseBetween);
        }
    };
    
    const deleteEffect = () => {
        if (!typewriter) return;
        
        if (charIndex > 0) {
            typewriter.textContent = APP_CONFIG.newsItems[itemIndex].substring(0, charIndex - 1);
            charIndex--;
            animationId = setTimeout(deleteEffect, config.deletingSpeed);
        } else {
            itemIndex = (itemIndex + 1) % APP_CONFIG.newsItems.length;
            animationId = setTimeout(typeEffect, 200);
        }
    };
    
    const start = () => {
        if (typewriter) typeEffect();
    };
    
    const stop = () => {
        if (animationId) clearTimeout(animationId);
    };
    
    return { init, start, stop };
})();

// Utility Functions with better performance
const Utils = {
    toBengaliNumber: (number) => {
        return number.toString().replace(/\d/g, digit => APP_CONFIG.bengaliDigits[digit]);
    },
    
    fadeIn: (element, duration = 300) => {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Enhanced Touch and Keyboard Support
const InputController = (() => {
    let startX = 0;
    let startY = 0;
    
    const initTouchSupport = () => {
        const container = cacheElement('sliderContainer');
        if (!container) return;
        
        const handleTouchStart = Utils.throttle((e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, 16);
        
        const handleTouchEnd = Utils.throttle((e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only handle horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
                SliderController.changeSlide(diffX > 0 ? 1 : -1);
            }
        }, 16);
        
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });
    };
    
    const initKeyboardSupport = () => {
        const handleKeydown = Utils.throttle((e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    SliderController.changeSlide(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    SliderController.changeSlide(1);
                    break;
                case 'Escape':
                    toggleMenu();
                    break;
            }
        }, 100);
        
        document.addEventListener('keydown', handleKeydown);
    };
    
    return { initTouchSupport, initKeyboardSupport };
})();

// Optimized Event Handlers
const EventHandlers = (() => {
    const initClickOutside = () => {
        const handleClickOutside = Utils.debounce((e) => {
            const nav = cacheElement('navMenu');
            const toggle = document.querySelector('.mobile-toggle');
            
            if (nav && toggle && 
                !nav.contains(e.target) && 
                !toggle.contains(e.target)) {
                nav.classList.remove('show');
            }
        }, 50);
        
        document.addEventListener('click', handleClickOutside, { passive: true });
    };
    
    const initImageLoading = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0.7';
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                    this.style.transition = 'opacity 0.3s ease';
                }, { once: true });
            }
        });
    };
    
    return { initClickOutside, initImageLoading };
})();

// Main Initialization with performance optimization
const initializeApp = () => {
    // Use RAF for smooth initialization
    requestAnimationFrame(() => {
        // Initialize controllers
        SliderController.init();
        CalendarController.init();
        TypewriterController.init();
        
        // Generate initial calendar
        CalendarController.generateCalendar(APP_CONFIG.currentMonthIndex, APP_CONFIG.currentYear);
        
        // Start typewriter
        TypewriterController.start();
        
        // Update initial attendance
        AttendanceController.updateAttendance();
        
        // Initialize input handlers
        InputController.initTouchSupport();
        InputController.initKeyboardSupport();
        
        // Initialize event handlers
        EventHandlers.initClickOutside();
        EventHandlers.initImageLoading();
        
        // Set up optimized intervals with RAF
        let lastAttendanceUpdate = 0;
        let lastVisitorUpdate = 0;
        let lastSlideChange = 0;
        
        const gameLoop = (timestamp) => {
            // Update attendance every 5 minutes
            if (timestamp - lastAttendanceUpdate > 300000) {
                AttendanceController.updateAttendance();
                lastAttendanceUpdate = timestamp;
            }
            
            // Update visitor count every 30 seconds
            if (timestamp - lastVisitorUpdate > 30000) {
                VisitorController.updateVisitorCount();
                lastVisitorUpdate = timestamp;
            }
            
            // Auto slide every 3 seconds
            if (timestamp - lastSlideChange > 3000) {
                SliderController.changeSlide(1);
                lastSlideChange = timestamp;
            }
            
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
    });
};

// Enhanced DOMContentLoaded with faster loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for global access
window.AppFunctions = {
    toggleMenu,
    toggleBox,
    changeSlide: SliderController.changeSlide,
    currentSlide: SliderController.currentSlide,
    changeMonth: CalendarController.changeMonth,
    updateAttendance: AttendanceController.updateAttendance,
    updateVisitorCount: VisitorController.updateVisitorCount,
    ...Utils
};

// Performance monitoring (development only)
if (typeof performance !== 'undefined') {
    window.addEventListener('load', () => {
        console.log(`Page loaded in ${Math.round(performance.now())}ms`);
    });
}