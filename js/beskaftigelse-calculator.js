/**
 * beskaftigelse-calculator.js - Employment Calculator Logic
 * Calculates employment eligibility based on work history
 */

// State
let state = {
    totalMonths: 42,
    employmentType: 'employee',
    isCurrentlyEmployed: true,
    weeklyHours: 37
};

// DOM Elements
const totalMonthsInput = document.getElementById('totalMonths');
const monthsDisplay = document.getElementById('monthsDisplay');
const weeklyHoursInput = document.getElementById('weeklyHours');
const hoursDisplay = document.getElementById('hoursDisplay');
const toggleEmploymentBtn = document.getElementById('toggleEmployment');
const toggleSwitch = document.getElementById('toggleSwitch');
const hoursSection = document.getElementById('hoursSection');
const resultCard = document.getElementById('resultCard');
const statusTitle = document.getElementById('statusTitle');
const statusIcon = document.getElementById('statusIcon');
const progressSection = document.getElementById('progressSection');
const messagesSection = document.getElementById('messagesSection');

/**
 * Calculate eligibility based on current state
 */
function calculateEligibility() {
    let messages = [];
    let isEligible = true;
    let warnings = [];
    let description = '';

    // Calculate history progress (max 100%)
    let historyProgress = Math.min(100, (state.totalMonths / 42) * 100);

    // 1. Exceptions (Pensioner)
    if (state.employmentType === 'pensioner') {
        return {
            isEligible: true,
            status: 'Klar (Undtaget)',
            description: 'Som folkepensionist eller førtidspensionist opfylder du automatisk kravet om beskæftigelse.',
            color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
            progress: 100,
            messages: [],
            warnings: []
        };
    }

    // 2. History check (3 years and 6 months = 42 months)
    if (state.totalMonths < 42) {
        isEligible = false;
        messages.push(`Du mangler ${42 - state.totalMonths} måneders fuldtidsarbejde (min. 120t/md) inden for de sidste 4 år.`);
    }

    // 3. Current job requirement (Active employment and hours)
    let currentJobOk = true;
    if (!state.isCurrentlyEmployed) {
        isEligible = false;
        currentJobOk = false;
        messages.push('Du skal være i beskæftigelse på det tidspunkt, hvor lovforslaget fremsættes.');
    } else if (state.weeklyHours < 15) {
        isEligible = false;
        currentJobOk = false;
        messages.push('Dit nuværende arbejde skal være på mindst 15 timer om ugen.');
    }

    // Adjust Progress Bar
    let finalProgress = historyProgress;
    if (historyProgress === 100 && !currentJobOk) {
        finalProgress = 95;
    }

    // Add warnings based on employment type
    if (state.employmentType === 'self-employed') {
        warnings.push("Som selvstændig gælder der særlige dokumentationskrav for overskud og omsætning.");
    }
    if (state.employmentType === 'student') {
        warnings.push("Kun erhvervsuddannelser (elevplads) tæller som beskæftigelse.");
    }

    return {
        isEligible,
        status: isEligible ? 'Du opfylder kravene' : 'Du mangler lidt endnu',
        messages,
        warnings,
        progress: finalProgress,
        color: isEligible ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'
    };
}

/**
 * Update UI based on calculation results
 */
function updateUI() {
    const result = calculateEligibility();

    // Update result card colors
    resultCard.className = `rounded-[2.5rem] p-8 border-2 transition-all sticky top-8 ${result.color}`;

    // Update status
    statusTitle.textContent = result.status;

    // Update icon
    const iconSVG = result.isEligible
        ? '<svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>'
        : '<svg class="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';
    statusIcon.innerHTML = `<div class="p-3 bg-white/50 rounded-2xl shadow-sm">${iconSVG}</div>`;

    // Update progress bar
    progressSection.innerHTML = CalculatorUtils.createProgressBar(result.progress, result.isEligible);

    // Update messages
    let messagesHTML = '';

    if (result.description) {
        messagesHTML += `<p class="text-sm font-bold leading-relaxed">${result.description}</p>`;
    }

    if (result.messages.length > 0) {
        result.messages.forEach(msg => {
            messagesHTML += `
                <div class="flex gap-3 text-sm font-bold leading-tight">
                    <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    ${msg}
                </div>
            `;
        });
    } else if (!result.description) {
        messagesHTML += `
            <div class="flex gap-3 text-sm font-bold leading-tight">
                <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                Baseret på dine svar opfylder du kravene til beskæftigelse.
            </div>
        `;
    }

    if (result.warnings.length > 0) {
        messagesHTML += `
            <div class="mt-4 pt-4 border-t border-current/10 space-y-2">
                <p class="text-[10px] font-black uppercase opacity-60">Vigtigt at vide:</p>
                ${result.warnings.map(warn => `
                    <div class="flex gap-2 text-xs font-semibold italic opacity-80 items-start">
                        <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                        <span>${warn}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    messagesSection.innerHTML = messagesHTML;
}

/**
 * Initialize event listeners
 */
function init() {
    // Months slider
    totalMonthsInput.addEventListener('input', (e) => {
        state.totalMonths = parseInt(e.target.value);
        monthsDisplay.textContent = state.totalMonths;
        updateUI();
    });

    // Weekly hours slider
    weeklyHoursInput.addEventListener('input', (e) => {
        state.weeklyHours = parseInt(e.target.value);
        hoursDisplay.textContent = state.weeklyHours;
        updateUI();
    });

    // Employment toggle
    toggleEmploymentBtn.addEventListener('click', () => {
        state.isCurrentlyEmployed = !state.isCurrentlyEmployed;

        // Update toggle visual
        if (state.isCurrentlyEmployed) {
            toggleEmploymentBtn.classList.remove('bg-slate-300');
            toggleEmploymentBtn.classList.add('bg-blue-600');
            toggleSwitch.classList.remove('left-1');
            toggleSwitch.classList.add('left-8');
            hoursSection.classList.remove('hidden');
        } else {
            toggleEmploymentBtn.classList.remove('bg-blue-600');
            toggleEmploymentBtn.classList.add('bg-slate-300');
            toggleSwitch.classList.remove('left-8');
            toggleSwitch.classList.add('left-1');
            hoursSection.classList.add('hidden');
        }

        updateUI();
    });

    // Employment type buttons
    const employmentTypeBtns = document.querySelectorAll('.employment-type-btn');
    employmentTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from all buttons
            employmentTypeBtns.forEach(b => {
                b.classList.remove('border-blue-600', 'bg-blue-50', 'text-blue-700', 'shadow-sm');
                b.classList.add('border-slate-100', 'bg-white', 'text-slate-500');
            });

            // Add active state to clicked button
            btn.classList.remove('border-slate-100', 'bg-white', 'text-slate-500');
            btn.classList.add('border-blue-600', 'bg-blue-50', 'text-blue-700', 'shadow-sm');

            // Update state
            state.employmentType = btn.dataset.type;
            updateUI();
        });
    });

    // Initial render
    updateUI();
    console.log('✅ Employment calculator initialized');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
