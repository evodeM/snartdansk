/**
 * tjekliste-calculator.js - Interactive citizenship checklist
 * Generates requirements based on user situation and tracks completion
 */

(function () {
    // State
    let isYoung = false;
    let checkedItems = new Set();

    // DOM Elements
    const ageButtons = document.querySelectorAll('.age-btn');
    const youngDetails = document.getElementById('youngDetails');
    const arrivalCheck = document.getElementById('arrivalCheck');
    const origin = document.getElementById('origin');
    const hasWork = document.getElementById('hasWork');
    const hasCriminal = document.getElementById('hasCriminal');
    const checklistItems = document.getElementById('checklistItems');
    const progressBadge = document.getElementById('progressBadge');
    const successBanner = document.getElementById('successBanner');

    // Initialize
    function init() {
        // Age group buttons
        ageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                ageButtons.forEach(b => {
                    b.classList.remove('active', 'border-violet-600', 'bg-violet-50', 'text-violet-700');
                    b.classList.add('border-slate-100', 'bg-white', 'text-slate-500');
                });
                btn.classList.add('active', 'border-violet-600', 'bg-violet-50', 'text-violet-700');
                btn.classList.remove('border-slate-100', 'bg-white', 'text-slate-500');

                isYoung = btn.dataset.age === 'young';
                youngDetails.classList.toggle('hidden', !isYoung);
                updateChecklist();
            });
        });

        // Dropdown changes
        [arrivalCheck, origin, hasWork, hasCriminal].forEach(el => {
            el.addEventListener('change', updateChecklist);
        });

        // Initial render
        updateChecklist();
    }

    // Generate rules based on user situation
    function generateRules() {
        const u = {
            origin: origin.value,
            hasWork: hasWork.value === 'yes',
            arrivedEarly: arrivalCheck.value === 'early',
            isYoung: isYoung,
            criminal: hasCriminal.value
        };

        let rules = [];

        // Check for dispensation eligibility
        const needsDispensation = u.isYoung && u.arrivedEarly && !u.hasWork;

        // 1. OPHOLDSTID
        let years = 9;
        if (u.origin === 'refugee') years = 8;
        if (u.origin === 'nordic') years = 2;
        rules.push({
            id: 'residence',
            title: `Ophold i Danmark (${years} år)`,
            desc: `Du skal have boet lovligt i Danmark i mindst ${years} år.`,
            icon: '🏠'
        });

        // 2. PERMANENT OPHOLD (ikke for nordiske)
        if (u.origin !== 'nordic') {
            rules.push({
                id: 'permanent',
                title: 'Permanent opholdstilladelse',
                desc: 'Du skal have tidsubegrænset opholdstilladelse.',
                icon: '📄'
            });
        }

        // 3. ARBEJDE ELLER DISPENSATION
        if (needsDispensation) {
            rules.push({
                id: 'dispensation',
                title: 'Motiveret ansøgning (Dispensation)',
                desc: 'Du kan søge dispensation fra arbejdskravet, da du kom til DK før du fyldte 8.',
                icon: '📝',
                tag: 'DISPENSATION'
            });
            rules.push({
                id: 'education',
                title: 'Uddannelsespapirer',
                desc: 'Dokumentation for al skolegang i Danmark.',
                icon: '🎓',
                tag: 'BILAG'
            });
        } else if (u.origin !== 'nordic') {
            rules.push({
                id: 'work',
                title: 'Beskæftigelse (3,5 år)',
                desc: 'Fuldtidsarbejde i mindst 3,5 år de sidste 4 år. Se Beskæftigelsesberegneren.',
                icon: '💼'
            });
        }

        // 4. VANDELSKRAV (Kriminalitet)
        if (u.criminal === 'clean') {
            rules.push({
                id: 'criminal',
                title: 'Vandelskrav opfyldt',
                desc: 'Ingen strafbare forhold registreret.',
                icon: '✅'
            });
        } else if (u.criminal === 'minor') {
            rules.push({
                id: 'criminal',
                title: 'Vandelskrav (bøde under 3.000 kr.)',
                desc: 'Bøder under 3.000 kr. medfører typisk ingen eller kort karensperiode. Se Karensberegneren.',
                icon: '⚠️',
                tag: 'TJEK KARENS'
            });
        } else if (u.criminal === 'waiting') {
            rules.push({
                id: 'criminal_waiting',
                title: 'Afvent karenstid',
                desc: 'Du skal vente til karensperioden udløber før du kan søge.',
                icon: '⏳',
                tag: 'BLOKERENDE'
            });
        } else if (u.criminal === 'serious') {
            rules.push({
                id: 'criminal_serious',
                title: 'Fængselsdom registreret',
                desc: 'Fængselsdomme medfører længere karensperioder. Se Karensberegneren.',
                icon: '🚫',
                tag: 'BLOKERENDE'
            });
        }

        // 5. ØKONOMI
        rules.push({
            id: 'debt',
            title: 'Ingen forfalden gæld',
            desc: 'Gæld med henstand/afdrag kan være hindrende. SU-lån er kun forfalden ved manglende ratebetaling.',
            icon: '💳'
        });
        rules.push({
            id: 'selfSupport',
            title: 'Selvforsørgelse',
            desc: 'Du må ikke have modtaget hjælp fra det offentlige de seneste 2 år, og max 4 måneder sammenlagt de seneste 5 år.',
            icon: '🏦'
        });

        // 6. SPROG (ikke for nordiske)
        if (u.origin !== 'nordic') {
            rules.push({
                id: 'language',
                title: 'Bestået sprogprøve (PD3)',
                desc: 'Eller PD2 hvis ingen offentlig hjælp i 2 år + max 3 mdr. i 9 år. Alternativt 9. kl./gym med min. 02.',
                icon: '🗣️'
            });
            rules.push({
                id: 'test',
                title: 'Indfødsretsprøven 2021',
                desc: 'Bestået prøve om dansk samfund, historie og kultur.',
                icon: '📚'
            });
        }

        // 7. TROSKABSERKLÆRING
        rules.push({
            id: 'loyalty',
            title: 'Troskabs- og loyalitetserklæring',
            desc: 'Erklæringerne underskrives med MitID som led i den digitale ansøgning.',
            icon: '🤝'
        });

        return rules;
    }

    // Render checklist
    function renderChecklist(rules) {
        checklistItems.innerHTML = '';

        rules.forEach((rule, index) => {
            const isChecked = checkedItems.has(rule.id);
            const isBlocking = rule.tag === 'BLOKERENDE';

            const item = document.createElement('div');
            item.className = `req-item flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${isChecked
                ? 'checked border-emerald-200 bg-emerald-50/50'
                : isBlocking
                    ? 'border-red-200 bg-red-50/30'
                    : 'border-slate-100 hover:border-slate-200'
                }`;
            item.style.animationDelay = `${index * 50}ms`;

            if (!isBlocking) {
                item.onclick = () => toggleItem(rule.id);
            }

            item.innerHTML = `
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${isChecked ? 'bg-emerald-500' : isBlocking ? 'bg-red-100' : 'bg-slate-100'
                }">
                    ${isChecked ? '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : rule.icon}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                        <h4 class="font-bold text-slate-800 ${isChecked ? 'line-through opacity-60' : ''}">${rule.title}</h4>
                        ${rule.tag ? `<span class="text-[9px] font-black px-2 py-0.5 rounded ${rule.tag === 'BLOKERENDE' ? 'bg-red-100 text-red-600' : rule.tag === 'DISPENSATION' ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'
                    }">${rule.tag}</span>` : ''}
                    </div>
                    <p class="text-sm text-slate-500 mt-0.5">${rule.desc}</p>
                </div>
            `;

            checklistItems.appendChild(item);
        });

        updateProgress(rules);
    }

    // Toggle item
    function toggleItem(id) {
        if (checkedItems.has(id)) {
            checkedItems.delete(id);
        } else {
            checkedItems.add(id);
        }
        updateChecklist();
    }

    // Update progress
    function updateProgress(rules) {
        const nonBlockingRules = rules.filter(r => r.tag !== 'BLOKERENDE');
        const completedCount = nonBlockingRules.filter(r => checkedItems.has(r.id)).length;
        const totalCount = nonBlockingRules.length;

        progressBadge.textContent = `${completedCount} / ${totalCount}`;

        // Update badge color
        const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        if (percentage === 100) {
            progressBadge.className = 'text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-600';
        } else if (percentage >= 50) {
            progressBadge.className = 'text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-blue-600';
        } else {
            progressBadge.className = 'text-xs font-black px-3 py-1 rounded-full bg-slate-100 text-slate-500';
        }

        // Check for blocking items
        const hasBlockingItem = rules.some(r => r.tag === 'BLOKERENDE');

        // Show success banner
        if (completedCount === totalCount && totalCount > 0 && !hasBlockingItem) {
            successBanner.classList.remove('hidden');
            successBanner.classList.add('celebrate');
        } else {
            successBanner.classList.add('hidden');
            successBanner.classList.remove('celebrate');
        }
    }

    // Update entire checklist
    function updateChecklist() {
        const rules = generateRules();
        renderChecklist(rules);
    }

    // Start
    init();
})();
