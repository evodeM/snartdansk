/**
 * calculators.js - Shared utilities for all calculator pages
 * Contains common functions for date manipulation, validation, and UI helpers
 */

const CalculatorUtils = {
    /**
     * Format a date to Danish locale
     * @param {Date} date - Date object
     * @returns {string} - Formatted date string
     */
    formatDateDanish(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('da-DK', options);
    },

    /**
     * Calculate difference in days between two dates
     * @param {Date} startDate 
     * @param {Date} endDate 
     * @returns {number} - Number of days
     */
    daysBetween(startDate, endDate) {
        const diffTime = Math.abs(endDate - startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    /**
     * Add months to a date
     * @param {Date} date 
     * @param {number} months 
     * @returns {Date} - New date
     */
    addMonths(date, months) {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + months);
        return newDate;
    },

    /**
     * Get status color classes based on status type
     * @param {string} status - Status type (OK, WARNING, DANGER, CRITICAL)
     * @returns {string} - Tailwind CSS classes
     */
    getStatusColor(status) {
        const colors = {
            'OK': 'text-emerald-600 bg-emerald-50 border-emerald-100',
            'WARNING': 'text-amber-600 bg-amber-50 border-amber-100',
            'DANGER': 'text-orange-600 bg-orange-50 border-orange-100',
            'CRITICAL': 'text-red-600 bg-red-50 border-red-100'
        };
        return colors[status] || 'text-slate-600 bg-slate-50 border-slate-100';
    },

    /**
     * Create a progress bar element
     * @param {number} percentage - Progress percentage (0-100)
     * @param {boolean} isComplete - Whether progress is complete
     * @returns {string} - HTML string for progress bar
     */
    createProgressBar(percentage, isComplete = false) {
        const colorClass = isComplete ? 'bg-emerald-500' : 'bg-blue-600';
        return `
            <div class="space-y-2">
                <div class="flex justify-between text-[10px] font-black uppercase">
                    <span>Samlet status</span>
                    <span>${percentage.toFixed(0)}%</span>
                </div>
                <div class="h-4 w-full bg-white/40 rounded-full overflow-hidden p-1 shadow-inner">
                    <div class="h-full ${colorClass} rounded-full transition-all duration-1000" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    },

    /**
     * Create year selector buttons
     * @param {function} onYearSelect - Callback when year is selected
     * @param {number} yearsBack - Number of years to show (default 12)
     * @returns {string} - HTML string for year buttons
     */
    createYearSelector(onYearSelect, yearsBack = 12) {
        const currentYear = new Date().getFullYear();
        let html = '<div class="grid grid-cols-4 gap-1" id="yearSelector">';

        for (let i = 0; i < yearsBack; i++) {
            const year = currentYear - i;
            html += `
                <button 
                    type="button"
                    onclick="${onYearSelect}(${year}, this)" 
                    class="year-btn px-3 py-1.5 text-[11px] bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-700 transition-all border border-slate-200"
                >
                    ${year}
                </button>
            `;
        }

        html += '</div>';
        return html;
    },

    /**
     * Validate date string
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {boolean} - Whether date is valid
     */
    isValidDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    },

    /**
     * Show/hide element with animation
     * @param {HTMLElement} element 
     * @param {boolean} show 
     */
    toggleElement(element, show) {
        if (show) {
            element.classList.remove('hidden');
            element.classList.add('animate-in', 'fade-in', 'slide-in-from-top-2');
        } else {
            element.classList.add('hidden');
        }
    },

    /**
     * Create icon SVG
     * @param {string} iconName - Name of icon (check, alert, clock, info)
     * @returns {string} - SVG HTML
     */
    getIcon(iconName) {
        const icons = {
            'check': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>',
            'alert': '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>',
            'clock': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            'info': '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>'
        };
        return icons[iconName] || icons['info'];
    },

    /**
     * Create disclaimer section
     * @param {string} text - Disclaimer text
     * @returns {string} - HTML string
     */
    createDisclaimer(text) {
        return `
            <div class="mt-8 p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-3">
                <div class="flex items-center gap-2 text-slate-600">
                    <svg class="w-5 h-5 shrink-0 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                    </svg>
                    <h4 class="text-xs font-black uppercase tracking-wider">Ansvarsfraskrivelse</h4>
                </div>
                <p class="text-[11px] leading-relaxed text-slate-500 font-medium">
                    ${text}
                </p>
            </div>
        `;
    },

    /**
     * Load shared header and footer
     */
    async loadSharedComponents() {
        try {
            // Load header
            const headerResponse = await fetch('/components/header.html');
            const headerHTML = await headerResponse.text();
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = headerHTML;

                // Initialize mobile menu after header is loaded
                this.initMobileMenu();
            }

            // Load footer
            const footerResponse = await fetch('/components/footer.html');
            const footerHTML = await footerResponse.text();
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = footerHTML;
            }
        } catch (error) {
            console.error('Error loading shared components:', error);
        }
    },

    /**
     * Initialize mobile menu toggle
     */
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
            console.log('✅ Mobile menu initialized');
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculatorUtils;
}
