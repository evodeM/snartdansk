/**
 * main.js - Controller for Name Search Functionality
 * Handles fetching data.json and rendering search results
 */

// Global variable to store data
let lovforslagData = [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const resultsArea = document.getElementById('resultsArea');
const statusText = document.getElementById('statusText');
const placeholder = document.getElementById('placeholder');

/**
 * Safe Highlight Function (prevents regex errors)
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} - HTML with highlighted text
 */
function highlight(text, query) {
    if (!query) return text;
    // Escape special regex characters
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${safeQuery})`, 'gi');
    return text.replace(re, '<span class="highlight">$1</span>');
}

/**
 * Load data from JSON file
 */
async function loadData() {
    try {
        const response = await fetch('data.json');
        lovforslagData = await response.json();
        console.log(`✅ Loaded ${lovforslagData.length} names`);
    } catch (error) {
        console.error('❌ Error loading data:', error);
        resultsArea.innerHTML = `
            <div class="text-center py-12 px-4 bg-red-50 rounded-3xl border border-red-200">
                <h3 class="text-red-900 font-bold text-lg mb-2">Kunne ikke indlæse data</h3>
                <p class="text-red-700 text-sm">Prøv at genindlæse siden.</p>
            </div>
        `;
    }
}


/**
 * Handle search input
 */
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const portalContent = document.getElementById('portal-content');

    // Clear current list
    resultsArea.innerHTML = '';

    // Handle empty/short input
    if (query.length < 2) {
        statusText.style.opacity = '0';

        // Show Portal
        if (portalContent) portalContent.classList.remove('hidden');
        resultsArea.classList.add('hidden');

        return;
    }

    // Active Search
    if (portalContent) portalContent.classList.add('hidden');
    resultsArea.classList.remove('hidden');

    // Filter Data
    const matches = lovforslagData.filter(p =>
        p.n.toLowerCase().includes(query) || p.k.toLowerCase().includes(query)
    );

    // Update Status
    statusText.textContent = matches.length === 0
        ? 'Ingen resultater fundet'
        : `${matches.length} ${matches.length === 1 ? 'RESULTAT' : 'RESULTATER'} FUNDET`;
    statusText.style.opacity = '1';

    // Render Results
    if (matches.length > 0) {
        renderResults(matches, query);
    } else {
        renderNoResults();
    }
}

/**
 * Render search results
 * @param {Array} matches - Filtered results
 * @param {string} query - Search query for highlighting
 */
function renderResults(matches, query) {
    const fragment = document.createDocumentFragment();

    matches.forEach((p, index) => {
        const card = document.createElement('div');

        // Add staggered animation delay
        const delay = Math.min(index * 0.05, 0.5);
        card.style.animationDelay = `${delay}s`;

        // Smart Card HTML
        card.innerHTML = `
            <div class="result-card bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 hover:shadow-md transition-all duration-300 mb-4 cursor-default">
                <div>
                    <h3 class="text-xl font-bold text-slate-800 tracking-tight">${highlight(p.n, query)}</h3>
                    <div class="flex items-center text-blue-600 font-bold text-xs mt-2 uppercase tracking-wider">
                        <svg class="w-3.5 h-3.5 mr-1.5 opacity-70" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/></svg>
                        ${highlight(p.k, query)}
                    </div>
                </div>
                <div class="w-12 h-12 flex items-center justify-center bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-100 transition-colors duration-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
            </div>
        `;

        // Append the actual card element (first child of wrapper)
        fragment.appendChild(card.firstElementChild);
    });

    resultsArea.appendChild(fragment);

    // Add guide section
    const guideContainer = document.createElement('div');
    guideContainer.innerHTML = `
        <div class="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-3xl animate-fadeIn">
            <h4 class="text-blue-900 font-bold mb-3 flex items-center">
                <span class="mr-2">🎉</span> Du er på listen! Hvad er næste skridt?
            </h4>
            <ul class="space-y-3 text-sm text-blue-800/80">
                <li class="flex gap-2">
                    <span class="font-bold">1.</span> 
                    <span><strong>Lovforslaget skal vedtages:</strong> Folketinget behandler normalt lovforslaget over de kommende måneder (3 behandlinger).</span>
                </li>
                <li class="flex gap-2">
                    <span class="font-bold">2.</span> 
                    <span><strong>Grundlovsceremoni:</strong> Når loven er vedtaget og underskrevet, inviteres du til ceremoni i din kommune.</span>
                </li>
                <li class="flex gap-2">
                    <span class="font-bold">3.</span> 
                    <span><strong>Bestil pas:</strong> Efter ceremonien er du officielt statsborger og kan bestille dit danske pas.</span>
                </li>
            </ul>
            <a href="https://www.ft.dk/samling/20251/lovforslag/L98/index.htm" target="_blank" 
               class="mt-6 inline-block w-full text-center bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
                Se officielt dokument på FT.dk
            </a>
        </div>
    `;
    resultsArea.appendChild(guideContainer);
}

/**
 * Render no results state
 */
function renderNoResults() {
    resultsArea.innerHTML = `
        <div class="text-center py-8 px-4 bg-white rounded-3xl border-2 border-dashed border-slate-200 result-card">
            <h3 class="text-slate-900 font-bold text-lg mb-1">Ingen match fundet</h3>
            <p class="text-slate-500 text-xs mb-6">Vi fandt ikke navnet eller kommunen i L 98.</p>
            
            <div class="text-left bg-slate-50 rounded-2xl p-4 border border-slate-100 max-w-sm mx-auto">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Prøv i stedet:</p>
                <div class="grid grid-cols-1 gap-2 text-[11px] text-slate-600">
                    <p class="flex items-center gap-2">
                        <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                        Søg kun på dit <strong>efternavn</strong>
                    </p>
                    <p class="flex items-center gap-2">
                        <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                        Tjek din <strong>kommunes</strong> stavning
                    </p>
                    <p class="flex items-center gap-2">
                        <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                        Søg på de første 4-5 bogstaver
                    </p>
                </div>
            </div>

            <p class="mt-6 text-[9px] text-slate-300 uppercase tracking-tight">
                Kun gældende for lovforslag L 98 (jan 2026)
            </p>
        </div>
    `;
}

/**
 * Initialize the app
 */
async function init() {
    await loadData();

    // Add event listener
    searchInput.addEventListener('input', handleSearch);

    console.log('✅ Name search initialized');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
