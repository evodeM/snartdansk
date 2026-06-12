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
    const blockingBanner = document.getElementById('blockingBanner');
    const blockingText = document.getElementById('blockingText');

    const youngBenefitsInfo = document.getElementById('youngBenefitsInfo');
    const nordicBenefitsInfo = document.getElementById('nordicBenefitsInfo');

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

        const isHerboendeUng = u.isYoung && u.arrivedEarly;
        let rules = [];

        // 1. OPHOLDSTID
        let years = 9;
        if (u.origin === 'refugee') years = 8;
        if (u.origin === 'nordic') years = 2;
        if (isHerboendeUng) years = 8; // Særligt nedsat krav til herboende unge

        rules.push({
            id: 'residence',
            title: `Ophold i Danmark (${years} år)`,
            desc: isHerboendeUng 
                ? `Som herboende ung skal du have boet lovligt i Danmark i mindst 8 år i træk.`
                : `Du skal have boet uafbrudt og lovligt i Danmark i mindst ${years} år.`,
            icon: '🏠'
        });

        // 2. PERMANENT OPHOLDSTILLADELSE (Nordiske er fritaget)
        if (u.origin !== 'nordic') {
            rules.push({
                id: 'permanent',
                title: 'Permanent opholdstilladelse',
                desc: 'Du skal have en tidsubegrænset (permanent) opholdstilladelse i Danmark.',
                icon: '📄'
            });
        }

        // 3. BESKÆFTIGELSE / SKOLEGANG
        if (isHerboendeUng) {
            rules.push({
                id: 'education_doc',
                title: 'Dispensation for arbejdskrav',
                desc: 'Da du kom til DK før du fyldte 8 år, kan du søge dispensation fra det normale arbejdskrav ved at indsende bevis for din danske skolegang.',
                icon: '✨',
                tag: 'FORDELE'
            });
        } else if (u.origin !== 'nordic') {
            if (!u.hasWork) {
                rules.push({
                    id: 'work',
                    title: 'Beskæftigelse (Arbejdskrav ikke opfyldt)',
                    desc: 'Du opfylder ikke kravet om 3,5 års fuldtidsarbejde inden for de seneste 4 år.',
                    icon: '💼',
                    tag: 'BLOKERENDE'
                });
            } else {
                rules.push({
                    id: 'work',
                    title: 'Beskæftigelse (3,5 år)',
                    desc: 'Du skal have været i fuldtidsarbejde i mindst 3,5 år inden for de seneste 4 år, og være i arbejde nu.',
                    icon: '💼'
                });
            }
        }

        // 4. SELVFORSØRGELSE
        rules.push({
            id: 'selfSupport',
            title: 'Selvforsørgelse (ingen hjælp)',
            desc: 'Du må ikke have modtaget integrationsydelse, kontanthjælp eller lignende hjælp efter aktivloven de seneste 2 år, og max 4 mdr. de seneste 5 år.',
            icon: '🏦'
        });

        // 5. GÆLD
        rules.push({
            id: 'debt',
            title: 'Ingen forfalden gæld',
            desc: 'Du må ikke have ubetalt gæld til det offentlige. SU-lån tæller kun som forfalden, hvis du har misligholdt dine afdrag.',
            icon: '💳'
        });

        // 6. SPROGKRAV OG INDFØDSRETSPRØVE
        if (u.origin !== 'nordic') {
            if (isHerboendeUng) {
                rules.push({
                    id: 'language_exempt',
                    title: 'Sprogkrav (Erstattes via skole)',
                    desc: 'Dit afgangsbevis fra folkeskolen (gennemsnit på mindst 02) eller gymnasiet erstatter sprogprøven.',
                    icon: '🗣️',
                    tag: 'FORDELE'
                });
            } else {
                rules.push({
                    id: 'language',
                    title: 'Bestået sprogprøve (PD3)',
                    desc: 'Du skal have bestået Prøve i Dansk 3. (PD2 kan i særlige tilfælde accepteres ved langvarig selvforsørgelse).',
                    icon: '🗣️'
                });
            }
            
            // ALLE (også unge) skal bestå indfødsretsprøven
            rules.push({
                id: 'test',
                title: 'Bestået Indfødsretsprøve',
                desc: 'Du skal have bestået den officielle Indfødsretsprøve af 2021 (historie, samfund og kultur).',
                icon: '📚'
            });
        }

        // 7. VANDELSKRAV (Kriminalitet)
        if (u.criminal === 'clean') {
            rules.push({
                id: 'criminal_clean',
                title: 'Vandelskrav opfyldt',
                desc: 'Ingen strafbare forhold registreret på din straffeattest.',
                icon: '✅'
            });
        } else if (u.criminal === 'minor') {
            rules.push({
                id: 'criminal_minor',
                title: 'Vandelskrav (Bøde under 3.000 kr.)',
                desc: 'Bøder under 3.000 kr. giver sjældent karensperioder, men skal altid oplyses under ansøgningen.',
                icon: '⚠️',
                tag: 'TJEK DET'
            });
        } else if (u.criminal === 'waiting') {
            rules.push({
                id: 'criminal_blocking_wait',
                title: 'Udløb af karensperiode',
                desc: 'Du har begået et forhold, som medfører en karensperiode. Du kan først søge igen, når karensperioden udløber.',
                icon: '⏳',
                tag: 'BLOKERENDE'
            });
        } else if (u.criminal === 'serious') {
            rules.push({
                id: 'criminal_blocking_serious',
                title: 'Udelukkelse pga. fængselsdom',
                desc: 'Betingede eller ubetingede fængselsdomme medfører meget lange eller permanente karensperioder (udelukkelse).',
                icon: '🚫',
                tag: 'BLOKERENDE'
            });
        }

        // 8. TROSKABSERKLÆRING
        rules.push({
            id: 'loyalty',
            title: 'Troskabs- og loyalitetserklæring',
            desc: 'Afgives digitalt med MitID under selve ansøgningsprocessen.',
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
                        ${rule.tag ? `
                            <span class="text-[9px] font-black px-2 py-0.5 rounded ${
                                rule.tag === 'BLOKERENDE' 
                                    ? 'bg-red-100 text-red-600' 
                                    : rule.tag === 'FORDELE' 
                                        ? 'bg-emerald-100 text-emerald-600' 
                                        : rule.tag === 'UDDANNELSE'
                                            ? 'bg-violet-100 text-violet-600'
                                            : 'bg-slate-100 text-slate-500'
                            }">${rule.tag}</span>
                        ` : ''}
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
        const blockingRule = rules.find(r => r.tag === 'BLOKERENDE');

        if (blockingRule) {
            successBanner.classList.add('hidden');
            if (blockingBanner) {
                blockingBanner.classList.remove('hidden');
                blockingBanner.classList.add('celebrate');
            }

            const blockingTitle = document.getElementById('blockingTitle');
            const blockingLink = document.getElementById('blockingLink');
            const blockingLinkText = document.getElementById('blockingLinkText');

            if (blockingRule.id === 'work') {
                if (blockingTitle) blockingTitle.textContent = "⚠️ Arbejdskravet er ikke opfyldt";
                if (blockingText) blockingText.textContent = "Du opfylder ikke det obligatoriske beskæftigelseskrav på 3,5 års fuldtidsarbejde inden for de seneste 4 år. Du kan beregne din præcise beskæftigelsestid med vores beregner.";
                if (blockingLink && blockingLinkText) {
                    blockingLink.href = "https://snartdansk.dk/beskaeftigelsesberegner";
                    blockingLinkText.textContent = "Prøv Beskæftigelsesberegneren";
                }
            } else if (blockingRule.id.includes('wait')) {
                if (blockingTitle) blockingTitle.textContent = "⚠️ Ansøgning er forhindret";
                if (blockingText) blockingText.textContent = "Du afventer i øjeblikket en karensperiode på grund af strafbare forhold. Du kan først søge om dansk statsborgerskab, når din tidsbegrænsede karensperiode er udløbet.";
                if (blockingLink && blockingLinkText) {
                    blockingLink.href = "https://snartdansk.dk/karensberegner";
                    blockingLinkText.textContent = "Prøv Karensberegneren";
                }
            } else {
                if (blockingTitle) blockingTitle.textContent = "⚠️ Ansøgning er udelukket";
                if (blockingText) blockingText.textContent = "Betingede eller ubetingede fængselsdomme medfører typisk meget lange karensperioder eller permanent udelukkelse fra dansk indfødsret. Tjek mulighederne grundigt.";
                if (blockingLink && blockingLinkText) {
                    blockingLink.href = "https://snartdansk.dk/karensberegner";
                    blockingLinkText.textContent = "Prøv Karensberegneren";
                }
            }
        } else {
            if (blockingBanner) {
                blockingBanner.classList.add('hidden');
                blockingBanner.classList.remove('celebrate');
            }
            
            // Show success banner
            if (completedCount === totalCount && totalCount > 0) {
                successBanner.classList.remove('hidden');
                successBanner.classList.add('celebrate');
            } else {
                successBanner.classList.add('hidden');
                successBanner.classList.remove('celebrate');
            }
        }
    }

    // Update entire checklist
    function updateChecklist() {
        const isHerboendeUng = isYoung && arrivalCheck.value === 'early';

        if (youngBenefitsInfo) {
            youngBenefitsInfo.classList.toggle('hidden', !isHerboendeUng);
        }
        if (nordicBenefitsInfo) {
            nordicBenefitsInfo.classList.toggle('hidden', origin.value !== 'nordic');
        }

        const rules = generateRules();
        
        // Remove checked items that are no longer in the rules
        const currentRuleIds = new Set(rules.map(r => r.id));
        checkedItems.forEach(id => {
            if (!currentRuleIds.has(id)) {
                checkedItems.delete(id);
            }
        });

        renderChecklist(rules);
    }

    // Start
    init();
})();
