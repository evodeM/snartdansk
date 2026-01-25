/**
 * udlandsophold-calculator.js - Travel/Foreign Stay Calculator Logic
 * Tracks trips and checks compliance with travel rules
 */

// State
let trips = [];
let currentYear = new Date().getFullYear();

// DOM Elements
const departureInput = document.getElementById('departureDate');
const returnInput = document.getElementById('returnDate');
const addTripBtn = document.getElementById('addTripBtn');
const yearSelector = document.getElementById('yearSelector');
const tripList = document.getElementById('tripList');
const totalDaysDisplay = document.getElementById('totalDays');
const globalStatus = document.getElementById('globalStatus');

// Rule cards
const rule4weeks = document.getElementById('rule4weeks');
const rule6weeks = document.getElementById('rule6weeks');
const ruleFrequency = document.getElementById('ruleFrequency');
const rule4text = document.getElementById('rule4text');
const rule6text = document.getElementById('rule6text');
const ruleFreqtext = document.getElementById('ruleFreqtext');

/**
 * Initialize year selector buttons
 */
function initYearSelector() {
    yearSelector.innerHTML = '';

    for (let i = 0; i < 12; i++) {
        const year = new Date().getFullYear() - i;
        const btn = document.createElement('button');
        btn.className = `year-btn px-3 py-1.5 text-[11px] bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-700 transition-all border border-slate-200 ${year === currentYear ? 'active' : ''}`;
        btn.textContent = year;
        btn.type = 'button';
        btn.onclick = () => setYear(year, btn);
        yearSelector.appendChild(btn);
    }
}

/**
 * Set year and update date inputs
 */
function setYear(year, btn) {
    currentYear = year;

    // Update button states
    document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update date inputs to selected year
    const dVal = departureInput.value;
    const rVal = returnInput.value;

    const suffix = (val) => val && val.includes('-') ? val.substring(4) : "-07-01";
    departureInput.value = year + suffix(dVal);
    returnInput.value = year + suffix(rVal);
}

/**
 * Add a new trip
 */
function addTrip() {
    const dVal = departureInput.value;
    const rVal = returnInput.value;

    if (!dVal || !rVal) {
        alert('Indtast begge datoer');
        return;
    }

    const d = new Date(dVal);
    const r = new Date(rVal);

    if (r < d) {
        alert('Hjemkomst skal være efter afrejse');
        return;
    }

    const days = Math.ceil(Math.abs(r - d) / (1000 * 60 * 60 * 24));

    trips.push({
        id: Date.now(),
        start: dVal,
        end: rVal,
        days: days,
        year: d.getFullYear()
    });

    // Sort trips by most recent first
    trips.sort((a, b) => new Date(b.start) - new Date(a.start));

    // Clear inputs
    departureInput.value = '';
    returnInput.value = '';

    updateUI();
}

/**
 * Remove a trip
 */
function removeTrip(id) {
    trips = trips.filter(t => t.id !== id);
    updateUI();
}

/**
 * Update the entire UI
 */
function updateUI() {
    tripList.innerHTML = '';

    let total = 0;
    let yearStats = {};
    let violations = { longTrip: false, yearLimit: false, frequency: false };

    trips.forEach(t => {
        total += t.days;

        if (!yearStats[t.year]) {
            yearStats[t.year] = { days: 0, count: 0 };
        }
        yearStats[t.year].days += t.days;
        yearStats[t.year].count++;

        // Check violations
        if (t.days > 28) violations.longTrip = true;
        if (yearStats[t.year].days > 42) violations.yearLimit = true;
        if (yearStats[t.year].count >= 10) violations.frequency = true;

        // Create trip card
        const div = document.createElement('div');
        div.className = `flex justify-between items-center p-4 bg-white border ${t.days > 28 ? 'border-red-500/50' : 'border-slate-200'} rounded-xl transition-all hover:shadow-md`;
        div.innerHTML = `
            <div>
                <p class="text-slate-900 font-bold text-sm">${t.start} — ${t.end}</p>
                <p class="text-[10px] text-slate-500 uppercase font-medium">${t.days} dage ${t.days > 28 ? '<span class="text-red-500 ml-2">⚠️ AFBRYDELSE</span>' : ''}</p>
            </div>
            <button onclick="removeTrip(${t.id})" class="text-slate-400 hover:text-red-500 text-[10px] font-black tracking-widest uppercase transition-colors">Slet</button>
        `;
        tripList.appendChild(div);
    });

    // Update rule cards
    updateRule(rule4weeks, rule4text, violations.longTrip, "Over 28 dage!", "Rejser under 28 dage");
    updateRule(rule6weeks, rule6text, violations.yearLimit, "Over 42 dage årligt!", "Under 6 uger årligt");
    updateRule(ruleFrequency, ruleFreqtext, violations.frequency, "For mange rejser (10+)", "Normal frekvens");

    // Update total
    totalDaysDisplay.textContent = total + " dage";

    // Update global status
    if (trips.length === 0) {
        globalStatus.textContent = "Ingen data";
        globalStatus.className = "inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 border border-slate-200";
    } else if (violations.longTrip || violations.yearLimit) {
        globalStatus.textContent = "Risiko for afslag";
        globalStatus.className = "inline-block px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold border border-red-400 shadow-lg shadow-red-200";
    } else {
        globalStatus.textContent = "Sikkert ophold";
        globalStatus.className = "inline-block px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold border border-emerald-400 shadow-lg shadow-emerald-200";
    }

    // Update empty state
    if (trips.length === 0) {
        tripList.innerHTML = '<p class="text-slate-400 text-sm italic text-center py-10 tracking-wide">Indtast rejser for at starte analysen...</p>';
    }
}

/**
 * Update a rule card
 */
function updateRule(card, text, isViolated, badMsg, goodMsg) {
    if (trips.length === 0) {
        card.className = "rule-card bg-white p-4 rounded-xl border border-slate-200";
        text.innerText = "Afventer data";
        text.className = "text-[11px] mt-1 text-slate-400";
        return;
    }

    if (isViolated) {
        card.className = "rule-card rule-violation p-4 rounded-xl border-red-500/30";
        text.innerText = "⚠️ " + badMsg;
        text.className = "text-[11px] mt-1 text-red-500 font-bold";
    } else {
        card.className = "rule-card rule-ok p-4 rounded-xl border-emerald-500/30";
        text.innerText = "✓ " + goodMsg;
        text.className = "text-[11px] mt-1 text-emerald-600 font-medium";
    }
}

/**
 * Initialize event listeners
 */
function init() {
    initYearSelector();

    // Add trip button
    addTripBtn.addEventListener('click', addTrip);

    // Allow Enter key in date fields
    departureInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTrip();
    });

    returnInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTrip();
    });

    console.log('✅ Travel calculator initialized');
}

// Make removeTrip available globally
window.removeTrip = removeTrip;

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
