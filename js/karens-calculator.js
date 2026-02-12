/**
 * karens-calculator.js - Waiting Period Calculator Logic
 * Calculates waiting period based on penalties and recidivism
 * Supports multiple repeat offenses with individual date/type/amount
 * Auto-calculates on any input change (no button needed)
 */

// State
let state = {
    penaltyType: 'bode_under_3000',
    penaltyDate: new Date().toISOString().split('T')[0],
    offenses: [] // Array of {id, type, date, amount}
};

let offenseIdCounter = 0;

// DOM Elements
const penaltyTypeSelect = document.getElementById('penaltyType');
const penaltyDateInput = document.getElementById('penaltyDate');
const dateSection = document.getElementById('dateSection');
const addOffenseBtn = document.getElementById('addOffenseBtn');
const offensesContainer = document.getElementById('offensesContainer');
const noOffensesText = document.getElementById('noOffensesText');
const resultSection = document.getElementById('resultSection');

const resultText = document.getElementById('resultText');
const statusBadge = document.getElementById('statusBadge');
const targetDate = document.getElementById('targetDate');
const statusLevel = document.getElementById('statusLevel');
const progressContainer = document.getElementById('progressContainer');
const explanation = document.getElementById('explanation');

/**
 * Karens period mapping (in years) based on penalty type
 */
function getKarensYears(type) {
    switch (type) {
        case 'bode_under_3000':
            return 0;
        case 'bode_over_3000':
            return 4.5;
        case 'fart_over_3000':
            return 4.5;
        case 'betinget':
        case 'ubetinget':
            return Infinity; // Permanent
        case 'sigtet':
            return -1; // Blocked
        default:
            return 0;
    }
}

/**
 * Get repeat offense karens extension (in years)
 * Speed violations: 3 years per repeat
 * Other offenses with karens: add the full karens period again
 */
function getRepeatKarensYears(type) {
    switch (type) {
        case 'fart_over_3000':
            return 3; // Speed violations: 3 years per repeat
        case 'bode_over_3000':
            return 4.5;
        case 'betinget':
        case 'ubetinget':
            return Infinity;
        case 'bode_under_3000':
            return 0; // No karens = no repeat effect
        default:
            return 0;
    }
}

/**
 * Calculate the end-of-month deadline for lovforslag
 * Karenstid must be fulfilled by end of the month where lovforslaget is expected to pass
 * Typically end of June or end of December
 */
function getNextLovforslagDeadline(afterDate) {
    const d = new Date(afterDate);
    // Check end of next June or December after the karens end date
    const year = d.getFullYear();
    const month = d.getMonth();

    // Possible deadlines: end of June, end of December
    const candidates = [
        new Date(year, 5, 30),     // End of June this year
        new Date(year, 11, 31),    // End of December this year
        new Date(year + 1, 5, 30), // End of June next year
        new Date(year + 1, 11, 31) // End of December next year
    ];

    // Find the first deadline that is after the karens end date
    for (const candidate of candidates) {
        if (candidate >= d) {
            return candidate;
        }
    }
    return candidates[candidates.length - 1];
}

/**
 * Calculate waiting period based on primary penalty and all repeat offenses
 */
function calculateKarens() {
    const primaryType = state.penaltyType;
    const primaryDate = state.penaltyDate;

    if (!primaryDate && primaryType !== 'sigtet') {
        return null;
    }

    let resultTextValue = "";
    let explanationText = "";
    let status = "OK";
    let isPermanent = false;
    let isBlocked = false;

    // Check primary offense
    const primaryKarens = getKarensYears(primaryType);

    if (primaryKarens === Infinity) {
        isPermanent = true;
        resultTextValue = "Permanent udelukket";
        explanationText = "Både betinget og ubetinget fængsel medfører permanent udelukkelse fra dansk statsborgerskab jf. UIM retningslinjer.";
        status = "CRITICAL";
    } else if (primaryKarens === -1) {
        isBlocked = true;
        resultTextValue = "Du kan ikke søge";
        explanationText = "Du kan ikke optages på et lovforslag om naturalisation, så længe sigtelsen opretholdes.";
        status = "CRITICAL";
    } else if (primaryKarens === 0 && state.offenses.length === 0) {
        resultTextValue = "Ingen karens";
        explanationText = "Bøder under 3.000 kr. udløser som udgangspunkt ikke karens ifølge UIM.";
        status = "OK";
    } else {
        // Calculate total karens from primary + repeat offenses
        // Per UIM: "Den samlede karenstid beregnes med udgangspunkt i den straf,
        // der isoleret betragtet medfører den karenstid, der udløber senest."

        let allOffenses = [];

        // Add primary offense
        if (primaryKarens > 0) {
            allOffenses.push({
                date: new Date(primaryDate),
                karensYears: primaryKarens,
                type: primaryType,
                isPrimary: true
            });
        }

        // Add repeat offenses
        state.offenses.forEach(offense => {
            const repeatKarens = getRepeatKarensYears(offense.type);
            if (repeatKarens === Infinity) {
                isPermanent = true;
            } else if (repeatKarens > 0 && offense.date) {
                allOffenses.push({
                    date: new Date(offense.date),
                    karensYears: repeatKarens,
                    type: offense.type,
                    isPrimary: false
                });
            }
        });

        if (isPermanent) {
            resultTextValue = "Permanent udelukket";
            explanationText = "En af dine straffe medfører permanent udelukkelse fra dansk statsborgerskab.";
            status = "CRITICAL";
        } else if (allOffenses.length === 0 && state.offenses.length > 0) {
            // All offenses are under 3000 (no karens)
            resultTextValue = "Ingen karens";
            explanationText = "Ingen af dine straffe udløser karens, da de alle er under 3.000 kr.";
            status = "OK";
        } else if (allOffenses.length > 0) {
            // Find the offense that, considered alone, has the latest expiry
            // Then add repeat extensions from other offenses
            let latestEndDate = null;
            let baseOffense = null;

            // First: find which individual offense expires latest
            allOffenses.forEach(o => {
                const endDate = new Date(o.date);
                endDate.setMonth(endDate.getMonth() + Math.round(o.karensYears * 12));
                if (!latestEndDate || endDate > latestEndDate) {
                    latestEndDate = endDate;
                    baseOffense = o;
                }
            });

            // Now add repeat extensions for all OTHER offenses (beyond the base)
            let totalRepeatExtensionMonths = 0;
            allOffenses.forEach(o => {
                if (o !== baseOffense) {
                    // Each repeat extends the karenstid
                    if (o.type === 'fart_over_3000') {
                        totalRepeatExtensionMonths += 36; // 3 years for speed repeats
                    } else {
                        totalRepeatExtensionMonths += Math.round(o.karensYears * 12);
                    }
                }
            });

            const finalDate = new Date(latestEndDate);
            finalDate.setMonth(finalDate.getMonth() + totalRepeatExtensionMonths);

            const now = new Date();
            const totalKarensYears = baseOffense.karensYears + (totalRepeatExtensionMonths / 12);

            if (now >= finalDate) {
                resultTextValue = "Karenstid overstået";
                status = "OK";
            } else {
                resultTextValue = "Karenstid udløber: " + CalculatorUtils.formatDateDanish(finalDate);
                status = "WARNING";
            }

            // Build explanation
            let parts = [];
            if (baseOffense.isPrimary) {
                parts.push(`Primær straf: ${totalKarensYears.toFixed(1).replace('.0', '')} års karens total`);
            }
            if (state.offenses.length > 0 && totalRepeatExtensionMonths > 0) {
                parts.push(`${state.offenses.length} gentagelsestilfælde forlænger karenstiden med ${(totalRepeatExtensionMonths / 12).toFixed(1).replace('.0', '')} år`);
            }
            explanationText = parts.join('. ') + '.';

            // Calculate progress
            const startDate = new Date(baseOffense.date);
            const totalDays = (finalDate - startDate) / (1000 * 60 * 60 * 24);
            const passedDays = (now - startDate) / (1000 * 60 * 60 * 24);
            const progressPercent = Math.min(100, Math.max(0, Math.round((passedDays / totalDays) * 100)));
            const remainingDays = Math.max(0, Math.round(totalDays - passedDays));

            return {
                resultText: resultTextValue,
                explanation: explanationText,
                status,
                isPermanent: false,
                isBlocked: false,
                progressPercent,
                remainingDays,
                finalDate,
                finalDateString: CalculatorUtils.formatDateDanish(finalDate)
            };
        } else {
            // Primary has no karens but also no offenses with karens
            resultTextValue = "Ingen karens";
            explanationText = "Bøder under 3.000 kr. udløser som udgangspunkt ikke karens ifølge UIM.";
            status = "OK";
        }
    }

    return {
        resultText: resultTextValue,
        explanation: explanationText,
        status,
        isPermanent,
        isBlocked,
        progressPercent: isPermanent || isBlocked ? 0 : 100,
        remainingDays: 0,
        finalDate: null,
        finalDateString: null
    };
}

/**
 * Update UI with calculation results
 */
function updateUI() {
    const calc = calculateKarens();
    if (!calc) return;

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
    if (!calc.isPermanent && !calc.isBlocked && calc.status !== 'OK') {
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
 * Create offense card HTML
 */
function createOffenseCard(offense) {
    const card = document.createElement('div');
    card.className = 'offense-card bg-slate-50 rounded-2xl border-2 border-slate-100 overflow-hidden';
    card.dataset.offenseId = offense.id;

    card.innerHTML = `
        <div class="offense-header flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onclick="toggleOffenseCard(${offense.id})">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 font-black text-sm">
                    ${state.offenses.indexOf(offense) + 1}
                </div>
                <span class="text-sm font-bold text-slate-700 offense-summary">Gentagelse #${state.offenses.indexOf(offense) + 1}</span>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="event.stopPropagation(); removeOffense(${offense.id})" class="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-slate-400 hover:text-red-500" aria-label="Fjern gentagelse">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
                <svg class="w-4 h-4 text-slate-400 offense-header-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
        <div class="offense-body px-5 pb-5 pt-2 space-y-4">
            <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Type</label>
                <select class="offense-type w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-3 focus:border-blue-500 transition-all outline-none font-semibold text-sm text-slate-700" data-offense-id="${offense.id}">
                    <option value="bode_over_3000" ${offense.type === 'bode_over_3000' ? 'selected' : ''}>Bøde på 3.000 kr. eller derover</option>
                    <option value="fart_over_3000" ${offense.type === 'fart_over_3000' ? 'selected' : ''}>Fartbøde (3.000 kr.+)</option>
                    <option value="bode_under_3000" ${offense.type === 'bode_under_3000' ? 'selected' : ''}>Bøde under 3.000 kr. (ingen karens)</option>
                    <option value="betinget" ${offense.type === 'betinget' ? 'selected' : ''}>Betinget fængsel</option>
                    <option value="ubetinget" ${offense.type === 'ubetinget' ? 'selected' : ''}>Ubetinget fængsel</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Afgørelsesdato</label>
                <input type="date" class="offense-date w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-3 focus:border-blue-500 transition-all outline-none font-semibold text-sm" data-offense-id="${offense.id}" value="${offense.date || ''}" />
            </div>
        </div>
    `;

    // Add event listeners
    setTimeout(() => {
        const typeSelect = card.querySelector('.offense-type');
        const dateInput = card.querySelector('.offense-date');

        typeSelect.addEventListener('change', (e) => {
            const off = state.offenses.find(o => o.id === offense.id);
            if (off) {
                off.type = e.target.value;
                updateUI();
            }
        });

        dateInput.addEventListener('change', (e) => {
            const off = state.offenses.find(o => o.id === offense.id);
            if (off) {
                off.date = e.target.value;
                updateUI();
            }
        });
    }, 0);

    return card;
}

/**
 * Toggle offense card accordion
 */
window.toggleOffenseCard = function (offenseId) {
    const card = document.querySelector(`[data-offense-id="${offenseId}"]`);
    if (!card) return;

    // On mobile: close others first (accordion behavior)
    if (window.innerWidth < 768) {
        document.querySelectorAll('.offense-card').forEach(c => {
            if (c !== card && !c.classList.contains('collapsed')) {
                c.classList.add('collapsed');
            }
        });
    }

    card.classList.toggle('collapsed');
};

/**
 * Remove an offense
 */
window.removeOffense = function (offenseId) {
    state.offenses = state.offenses.filter(o => o.id !== offenseId);
    renderOffenses();
    updateUI();
};

/**
 * Render all offense cards
 */
function renderOffenses() {
    offensesContainer.innerHTML = '';

    if (state.offenses.length === 0) {
        noOffensesText.classList.remove('hidden');
    } else {
        noOffensesText.classList.add('hidden');
        state.offenses.forEach(offense => {
            offensesContainer.appendChild(createOffenseCard(offense));
        });
    }
}

/**
 * Initialize event listeners
 */
function init() {
    // Set default date to today
    penaltyDateInput.value = state.penaltyDate;

    // Auto-calculate: Penalty type change
    penaltyTypeSelect.addEventListener('change', (e) => {
        state.penaltyType = e.target.value;

        // Hide/show date section based on selection
        if (state.penaltyType === 'sigtet') {
            dateSection.classList.add('hidden');
        } else {
            dateSection.classList.remove('hidden');
        }

        updateUI();
    });

    // Auto-calculate: Penalty date change
    penaltyDateInput.addEventListener('change', (e) => {
        state.penaltyDate = e.target.value;
        updateUI();
    });

    // Add offense button
    addOffenseBtn.addEventListener('click', () => {
        const newOffense = {
            id: ++offenseIdCounter,
            type: 'bode_over_3000',
            date: '',
            amount: ''
        };
        state.offenses.push(newOffense);
        renderOffenses();
        updateUI();
    });

    // Initial render
    renderOffenses();
    updateUI();
    console.log('✅ Karens calculator initialized (auto-calculate mode)');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
