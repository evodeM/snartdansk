/**
 * karens-calculator.js - Waiting Period Calculator Logic
 * Calculates waiting period based on penalties and recidivism
 */

// State
let state = {
    penaltyType: 'bode_under_3000',
    penaltyDate: new Date().toISOString().split('T')[0],
    isRecidivism: false,
    hasCalculated: false
};

// DOM Elements
const penaltyTypeSelect = document.getElementById('penaltyType');
const penaltyDateInput = document.getElementById('penaltyDate');
const dateSection = document.getElementById('dateSection');
const recidivismCheckbox = document.getElementById('recidivismCheckbox');
const checkIcon = document.getElementById('checkIcon');
const calculateBtn = document.getElementById('calculateBtn');
const resultPlaceholder = document.getElementById('resultPlaceholder');
const resultSection = document.getElementById('resultSection');

const resultText = document.getElementById('resultText');
const statusBadge = document.getElementById('statusBadge');
const targetDate = document.getElementById('targetDate');
const statusLevel = document.getElementById('statusLevel');
const progressContainer = document.getElementById('progressContainer');
const explanation = document.getElementById('explanation');

/**
 * Calculate waiting period based on penalty type
 */
function calculateKarens() {
    if (!state.penaltyDate && state.penaltyType !== 'sigtet') {
        return null;
    }

    const startDate = new Date(state.penaltyDate);
    let resultTextValue = "";
    let explanationText = "";
    let status = "OK";
    let isPermanent = false;
    let isBlocked = false;
    let karensYears = 0;

    switch (state.penaltyType) {
        case 'bode_under_3000':
            // UIM: Mindre bøder under 3.000 kr udløser som udgangspunkt ikke karens
            resultTextValue = "Ingen karens";
            explanationText = "Bøder under 3.000 kr. udløser som udgangspunkt ikke karens ifølge UIM.";
            status = "OK";
            break;

        case 'bode_over_3000':
        case 'fart_over_3000':
            karensYears = 4.5;
            if (state.isRecidivism) {
                // UIM: Ved gentagelse forlænges karenstiden med karenstiden for det nye forhold
                karensYears = 4.5 + 4.5; // 9 år total ved gentagelse
                explanationText = `Bøder på 3.000 kr. eller derover giver 4,5 års karens. Ved gentagelse forlænges karenstiden, så den samlede karenstid bliver ${karensYears} år.`;
            } else {
                explanationText = `Bøder på 3.000 kr. eller derover giver 4,5 års karens fra afgørelsesdatoen.`;
            }
            status = "WARNING";
            break;

        case 'betinget':
        case 'ubetinget':
            // UIM: "Du kan efter retningslinjerne ikke blive optaget på et lovforslag om indfødsrets meddelelse, hvis du er idømt betinget eller ubetinget fængsel"
            isPermanent = true;
            resultTextValue = "Permanent udelukket";
            explanationText = "Både betinget og ubetinget fængsel medfører permanent udelukkelse fra dansk statsborgerskab jf. UIM retningslinjer § 11.";
            status = "CRITICAL";
            break;

        case 'sigtet':
            isBlocked = true;
            resultTextValue = "Du kan ikke søge";
            explanationText = "Du kan ikke optages på et lovforslag om naturalisation, så længe sigtelsen opretholdes.";
            status = "CRITICAL";
            break;

        default:
            break;
    }

    let finalDate = null;
    let progressPercent = 0;
    let remainingDays = 0;

    if (!isPermanent && !isBlocked) {
        if (status === "OK") {
            progressPercent = 100;
        } else {
            finalDate = new Date(startDate);
            const totalMonths = karensYears * 12;
            finalDate.setMonth(finalDate.getMonth() + totalMonths);

            const now = new Date();
            const totalDays = (finalDate - startDate) / (1000 * 60 * 60 * 24);
            const passedDays = (now - startDate) / (1000 * 60 * 60 * 24);

            progressPercent = Math.min(100, Math.max(0, Math.round((passedDays / totalDays) * 100)));
            remainingDays = Math.max(0, Math.round(totalDays - passedDays));

            resultTextValue = "Kan søge: " + CalculatorUtils.formatDateDanish(finalDate);
        }
    }

    return {
        resultText: resultTextValue,
        explanation: explanationText,
        status,
        isPermanent,
        isBlocked,
        progressPercent,
        remainingDays,
        finalDate,
        finalDateString: finalDate ? CalculatorUtils.formatDateDanish(finalDate) : null
    };
}

/**
 * Update UI with calculation results
 */
function updateUI() {
    const calc = calculateKarens();

    if (!calc) return;

    // Hide placeholder, show results
    resultPlaceholder.classList.add('hidden');
    resultSection.classList.remove('hidden');
    resultSection.classList.add('animate-in', 'fade-in', 'zoom-in-95', 'duration-500');

    // Update result text
    resultText.textContent = calc.resultText;

    // Update status badge with icon
    const iconSVG = calc.status === 'OK'
        ? '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>'
        : '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

    const statusColor = CalculatorUtils.getStatusColor(calc.status);
    statusBadge.className = `p-4 rounded-2xl ${statusColor}`;
    statusBadge.innerHTML = iconSVG;

    // Update target date
    targetDate.textContent = calc.isPermanent || calc.isBlocked
        ? 'Ingen dato'
        : (calc.finalDateString || 'Allerede klar');

    // Update status level
    statusLevel.textContent = calc.status;
    statusLevel.className = `text-xs font-black uppercase px-2 py-1 rounded inline-block ${statusColor}`;

    // Update explanation
    explanation.textContent = `"${calc.explanation}"`;

    // Update progress bar
    if (!calc.isPermanent && !calc.isBlocked) {
        progressContainer.classList.remove('hidden');

        const progressHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-end">
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <span class="text-xs font-black text-slate-600 uppercase">Gennemført karens-tid</span>
                    </div>
                    <span class="text-2xl font-black text-slate-900">${calc.progressPercent}%</span>
                </div>
                <div class="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                    <div 
                        class="h-full rounded-full transition-all duration-1000 ease-out ${calc.progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'}"
                        style="width: ${calc.progressPercent}%"
                    ></div>
                </div>
                ${calc.progressPercent < 100 ? `
                    <p class="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                        Ca. ${calc.remainingDays} dage resterende
                    </p>
                ` : ''}
            </div>
        `;
        progressContainer.innerHTML = progressHTML;
    } else {
        progressContainer.classList.add('hidden');
    }
}

/**
 * Initialize event listeners
 */
function init() {
    // Set default date to today
    penaltyDateInput.value = state.penaltyDate;

    // Penalty type change
    penaltyTypeSelect.addEventListener('change', (e) => {
        state.penaltyType = e.target.value;
        state.hasCalculated = false;

        // Hide/show date section based on selection
        if (state.penaltyType === 'sigtet') {
            dateSection.classList.add('hidden');
        } else {
            dateSection.classList.remove('hidden');
        }
    });

    // Penalty date change
    penaltyDateInput.addEventListener('change', (e) => {
        state.penaltyDate = e.target.value;
        state.hasCalculated = false;
    });

    // Recidivism checkbox
    recidivismCheckbox.addEventListener('click', () => {
        state.isRecidivism = !state.isRecidivism;
        state.hasCalculated = false;

        // Update visual state
        if (state.isRecidivism) {
            recidivismCheckbox.classList.remove('border-slate-100', 'bg-white', 'hover:border-slate-200');
            recidivismCheckbox.classList.add('border-blue-600', 'bg-blue-50/50');
            recidivismCheckbox.querySelector('.w-6').classList.remove('border-slate-200', 'bg-white');
            recidivismCheckbox.querySelector('.w-6').classList.add('bg-blue-600', 'border-blue-600');
            checkIcon.classList.remove('hidden');
        } else {
            recidivismCheckbox.classList.remove('border-blue-600', 'bg-blue-50/50');
            recidivismCheckbox.classList.add('border-slate-100', 'bg-white', 'hover:border-slate-200');
            recidivismCheckbox.querySelector('.w-6').classList.remove('bg-blue-600', 'border-blue-600');
            recidivismCheckbox.querySelector('.w-6').classList.add('border-slate-200', 'bg-white');
            checkIcon.classList.add('hidden');
        }
    });

    // Calculate button
    calculateBtn.addEventListener('click', () => {
        state.hasCalculated = true;
        updateUI();
    });

    console.log('✅ Karens calculator initialized');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
