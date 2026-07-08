/* ==========================================================================
   AL GHASSANI ENTERPRISES - INTERACTIVE PROTOTYPE MOTOR (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE LUCIDE ICONS
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. THEME TOGGLE MECHANISM
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // 1.5 EMEA REGIONALIZATION CONFIGURATION
    const regionConfigs = {
        gcc: {
            currency: 'AED',
            locale: 'en-AE',
            rate: 3.67,
            symbol: 'AED ',
            name: 'GCC (AED)',
            badge: 'GCC Strategic Growth & Executive Advisory'
        },
        europe: {
            currency: 'EUR',
            locale: 'de-DE',
            rate: 0.92,
            symbol: '€',
            name: 'Europe (EUR)',
            badge: 'EMEA Strategic Growth & Executive Advisory'
        },
        global: {
            currency: 'USD',
            locale: 'en-US',
            rate: 1.0,
            symbol: '$',
            name: 'Global (USD)',
            badge: 'Global Strategic Growth & Executive Advisory'
        }
    };

    let activeRegion = localStorage.getItem('ghassani-region') || 'gcc';

    // Toggle region selector dropdown
    const regionToggleBtn = document.getElementById('region-toggle-btn');
    const regionSelectWrapper = document.getElementById('region-select-wrapper');

    if (regionToggleBtn && regionSelectWrapper) {
        regionToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            regionSelectWrapper.classList.toggle('open');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            regionSelectWrapper.classList.remove('open');
        });
    }

    // Switch region handler
    window.selectRegion = (regionId) => {
        if (!regionConfigs[regionId]) return;
        activeRegion = regionId;
        localStorage.setItem('ghassani-region', regionId);

        // Update active class in dropdown options
        document.querySelectorAll('.region-option').forEach(btn => {
            if (btn.getAttribute('data-region') === regionId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update button text
        const currentRegionText = document.getElementById('current-region');
        if (currentRegionText) {
            currentRegionText.innerText = regionConfigs[regionId].name;
        }

        // Update hero badge region text
        const heroBadge = document.getElementById('hero-badge-region');
        if (heroBadge) {
            heroBadge.innerText = regionConfigs[regionId].badge;
        }

        // Close dropdown
        if (regionSelectWrapper) {
            regionSelectWrapper.classList.remove('open');
        }

        // Trigger calculator update
        if (typeof updateCalculatorResults === 'function') {
            updateCalculatorResults();
        }

        // Update other metrics
        updateRegionalContent();

        showToast(`Region switched to ${regionConfigs[regionId].name}`, 'info');
    };

    // Regional content scaling (lively localized visual stats)
    function updateRegionalContent() {
        const rate = regionConfigs[activeRegion].rate;
        const aumVal = Math.round(245 * rate);
        const aumNode = document.querySelector('.stat-item:nth-child(1) .stat-val');
        const aumUnit = document.querySelector('.stat-item:nth-child(1) .stat-unit');
        
        if (aumNode && aumUnit) {
            aumNode.innerText = aumVal;
            if (activeRegion === 'gcc') {
                aumUnit.innerText = 'M AED+';
            } else if (activeRegion === 'europe') {
                aumUnit.innerText = 'M €+';
            } else {
                aumUnit.innerText = 'M+';
            }
        }
    }

    // Set initial region state on page load
    const initRegion = () => {
        const currentRegionText = document.getElementById('current-region');
        if (currentRegionText) {
            currentRegionText.innerText = regionConfigs[activeRegion].name;
        }
        
        const heroBadge = document.getElementById('hero-badge-region');
        if (heroBadge) {
            heroBadge.innerText = regionConfigs[activeRegion].badge;
        }

        // Update active class in dropdown options
        document.querySelectorAll('.region-option').forEach(btn => {
            if (btn.getAttribute('data-region') === activeRegion) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        updateRegionalContent();
    };
    initRegion();

    // Check system preference or localStorage, default to light for public pages and dark for portal
    const isPortalPage = window.location.pathname.includes('portal.html');
    const defaultTheme = isPortalPage ? 'dark' : 'light';
    const savedTheme = localStorage.getItem('ghassani-theme') || defaultTheme;
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('ghassani-theme', newTheme);
            showToast(`Theme switched to ${newTheme === 'dark' ? 'Obsidian Dark' : 'Crystal Light'}`, 'info');
        });
    }

    // 3. CURSOR-REACTIVE GLASS CARDS GLOW EFFECT
    const glassCards = document.querySelectorAll('.glass-card, .portfolio-card, .vault-item-card');
    
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 4. ELITE MCKINSEY-STYLE ASSESSMENT MODELER
    const lSlider = document.getElementById('score-leadership');
    const mSlider = document.getElementById('score-market');
    const tSlider = document.getElementById('score-technology');
    const oSlider = document.getElementById('score-operations');
    const aSlider = document.getElementById('score-ai');
    const pSlider = document.getElementById('score-partnerships');
    const cSlider = document.getElementById('score-capital');
    const gSlider = document.getElementById('score-government');

    const updateAssessmentResults = () => {
        if (!lSlider || !mSlider || !tSlider || !oSlider || !aSlider || !pSlider || !cSlider || !gSlider) return;

        const L = +lSlider.value;
        const M = +mSlider.value;
        const T = +tSlider.value;
        const O = +oSlider.value;
        const A = +aSlider.value;
        const P = +pSlider.value;
        const C = +cSlider.value;
        const G = +gSlider.value;

        // Update labels in real-time
        document.getElementById('val-leadership').innerText = `${L} / 10`;
        document.getElementById('val-market').innerText = `${M} / 10`;
        document.getElementById('val-technology').innerText = `${T} / 10`;
        document.getElementById('val-operations').innerText = `${O} / 10`;
        document.getElementById('val-ai').innerText = `${A} / 10`;
        document.getElementById('val-partnerships').innerText = `${P} / 10`;
        document.getElementById('val-capital').innerText = `${C} / 10`;
        document.getElementById('val-government').innerText = `${G} / 10`;

        // 1. Calculate Growth Maturity Score (Average of all 8)
        const totalScore = L + M + T + O + A + P + C + G;
        const maturityPct = Math.round((totalScore / 80) * 100);
        document.getElementById('res-maturity-score').innerText = `${maturityPct}%`;

        // Update SVG Radial Progress Bar
        const radialBar = document.getElementById('score-radial-bar');
        if (radialBar) {
            const circumference = 282.7;
            const offset = circumference - (circumference * (maturityPct / 100));
            radialBar.style.strokeDashoffset = offset;
        }

        // 2. Investment Readiness (Capital + Leadership)
        const capitalLeadership = C + L;
        const resInvestmentLevelNode = document.getElementById('res-investment-level');
        let investmentLevel = "Low";
        if (capitalLeadership >= 15) {
            investmentLevel = "High";
            resInvestmentLevelNode.className = "text-green";
        } else if (capitalLeadership >= 9) {
            investmentLevel = "Moderate";
            resInvestmentLevelNode.className = "text-gold";
        } else {
            investmentLevel = "Low";
            resInvestmentLevelNode.className = "text-magenta";
        }
        resInvestmentLevelNode.innerText = investmentLevel;

        // 3. Expansion Score (Market + Government + Partnerships)
        const expansionPct = Math.round(((M + G + P) / 30) * 100);
        document.getElementById('res-expansion-score').innerText = `${expansionPct}%`;
        
        const resExpansionStatusNode = document.getElementById('res-expansion-status');
        if (expansionPct >= 80) {
            resExpansionStatusNode.innerText = "High Potential";
        } else if (expansionPct >= 50) {
            resExpansionStatusNode.innerText = "Moderate Capability";
        } else {
            resExpansionStatusNode.innerText = "Emerging Status";
        }

        // 4. Risk Level Profile (Operations + Technology + Government)
        const riskAvg = (O + T + G) / 3;
        const resRiskLevelNode = document.getElementById('res-risk-level');
        const resRiskStatusNode = document.getElementById('res-risk-status');
        if (riskAvg >= 7.5) {
            resRiskLevelNode.innerText = "Low";
            resRiskLevelNode.className = "res-val text-green";
            resRiskStatusNode.innerText = "Optimized Alignment";
        } else if (riskAvg >= 4.5) {
            resRiskLevelNode.innerText = "Moderate";
            resRiskLevelNode.className = "res-val text-gold";
            resRiskStatusNode.innerText = "Managed Vulnerabilities";
        } else {
            resRiskLevelNode.innerText = "High";
            resRiskLevelNode.className = "res-val text-magenta";
            resRiskStatusNode.innerText = "Action Required";
        }

        // 5. Recommended Strategic Solution (Find the lowest metric dimension)
        const scores = [
            { name: "Leadership", score: L, service: "AGE Capital™", desc: "Preparing corporate files, valuation auditing, and structuring joint venture or equity alliances for regional investment." },
            { name: "Market", score: M, service: "AGE Launch™", desc: "Comprehensive market entry support, ADGM/DIFC establishment, and regulatory navigation in the GCC." },
            { name: "Technology", score: T, service: "AGE AI™", desc: "Implementation of modern AI models and digital frameworks to eliminate administrative overhead." },
            { name: "Operations", score: O, service: "AGE Scale™", desc: "Active commercial acceleration to expand client acquisition pipelines and optimize operations." },
            { name: "AI", score: A, service: "AGE AI™", desc: "Implementation of modern AI models and digital frameworks to eliminate administrative overhead." },
            { name: "Partnerships", score: P, service: "AGE Connect™", desc: "Executive matchmaking and strategic alignments connecting your business directly to regional boards and decision-makers." },
            { name: "Capital", score: C, service: "AGE Capital™", desc: "Preparing corporate files, valuation auditing, and structuring joint venture or equity alliances for regional investment." },
            { name: "Government", score: G, service: "AGE Launch™", desc: "Comprehensive market entry support, ADGM/DIFC establishment, and regulatory navigation in the GCC." }
        ];

        // Sort to find lowest score
        scores.sort((a, b) => a.score - b.score);
        const recommendation = scores[0]; // Lowest dimension

        document.getElementById('res-recommended-product').innerText = recommendation.service;
        document.getElementById('res-recommended-desc').innerText = recommendation.desc;
    };
    window.updateAssessmentResults = updateAssessmentResults;

    // Add listeners to sliders
    const sliders = [lSlider, mSlider, tSlider, oSlider, aSlider, pSlider, cSlider, gSlider];
    sliders.forEach(slider => {
        if (slider) {
            slider.addEventListener('input', updateAssessmentResults);
        }
    });

    // Run initial assessment calculation on load
    updateAssessmentResults();

    // Helper Currency Formatter (Dynamic EMEA Locale/Currency)
    function formatCurrency(numUSD) {
        const config = regionConfigs[activeRegion];
        const converted = numUSD * config.rate;
        
        if (activeRegion === 'gcc') {
            return `AED ` + new Intl.NumberFormat('en-AE', {
                maximumFractionDigits: 0
            }).format(converted);
        } else if (activeRegion === 'europe') {
            return new Intl.NumberFormat('de-DE', {
                maximumFractionDigits: 0
            }).format(converted) + ` €`;
        } else {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(converted);
        }
    }

    // Helper Millions Formatter
    function formatMillions(numUSD) {
        const config = regionConfigs[activeRegion];
        const converted = numUSD * config.rate;
        const formattedVal = (converted / 1000000).toFixed(1);
        
        if (activeRegion === 'gcc') {
            return `AED ${formattedVal}M`;
        } else if (activeRegion === 'europe') {
            return `${formattedVal}M €`;
        } else {
            return `$${formattedVal}M`;
        }
    }

    // 7. TOAST NOTIFICATION ENGINE
    window.showToast = (message, type = 'success') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconName = 'check-circle';
        if (type === 'info') iconName = 'info';
        if (type === 'warning') iconName = 'alert-triangle';

        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span class="toast-msg">${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Re-init icons to render the toast icon
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Fades out after 3.5 seconds
        setTimeout(() => {
            toast.classList.add('removing');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3500);
    };

    // 8. PARTNER PORTAL SANDBOX INTERACTIVE STATE MACHINE
    window.switchDbTab = (tabId, element) => {
        // Toggle tab highlights
        const navItems = document.querySelectorAll('.db-nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        element.classList.add('active');

        // Toggle visibility of panel panes
        const panes = document.querySelectorAll('.db-tab-pane');
        panes.forEach(pane => pane.classList.remove('active'));

        const targetPane = document.getElementById(`pane-${tabId}`);
        if (targetPane) {
            targetPane.classList.add('active');
        }

        // Dynamic Subtitles and Header adjustments
        const dbTitle = document.getElementById('db-tab-title');
        const dbSub = document.querySelector('.db-subtitle');

        if (tabId === 'overview') {
            dbTitle.innerText = "Executive Workspace";
            dbSub.innerText = "Consolidated growth metrics across active corporate accounts";
        } else if (tabId === 'vault') {
            dbTitle.innerText = "Shared Resource Vault";
            dbSub.innerText = "Check out specialized corporate infrastructure without capital expense";
        } else if (tabId === 'pipeline') {
            dbTitle.innerText = "Introducer Channels";
            dbSub.innerText = "Track warm paths, co-pitch opportunities, and GCC sports procurement matchmaking";
        } else if (tabId === 'assessment') {
            dbTitle.innerText = "Strategic Growth Index";
            dbSub.innerText = "Evaluate enterprise maturity and regional readiness";
        }
    };

    // 2. Simulated Assets checkout
    window.checkoutAsset = (assetName) => {
        showToast(`Resource Allocated: ${assetName} successfully provisioned! Allocation routed.`, 'success');
    };

    // Simulated pipeline registration
    window.registerSynergyOpportunity = () => {
        const dealNameInput = document.getElementById('deal-name');
        const dealSectorSelect = document.getElementById('deal-sector');

        if (!dealNameInput || dealNameInput.value.trim() === "") {
            showToast("Target / Opportunity name cannot be empty.", "warning");
            return;
        }

        const dealName = dealNameInput.value.trim();
        const dealSector = dealSectorSelect.value;
        const alignments = ["Strategic Opportunity", "Joint Venture Fit", "High Synergy Value", "Market Expansion Fit", "Corporate Integration"];
        const randomAlignment = alignments[Math.floor(Math.random() * alignments.length)];

        const pipelineRowsContainer = document.querySelector('.pipeline-rows');
        if (pipelineRowsContainer) {
            const newRow = document.createElement('div');
            newRow.className = "pipeline-row-item";
            newRow.style.opacity = '0';
            newRow.style.transform = 'translateY(10px)';
            newRow.style.transition = 'all var(--transition-normal)';

            newRow.innerHTML = `
                <span class="p-opt">${dealName}</span>
                <span class="p-ops">${dealSector} & Al Ghassani Matchmade</span>
                <span class="p-val text-cyan">${randomAlignment}</span>
                <span class="p-status badge-cyan">Introduced</span>
            `;

            pipelineRowsContainer.appendChild(newRow);
            
            // Trigger visual appearance
            setTimeout(() => {
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateY(0)';
            }, 50);

            // Clean inputs
            dealNameInput.value = "";
            showToast(`Introducer target '${dealName}' registered globally in Client pipeline!`, 'success');
            
            // Add custom row to Telemetry stream as well
            const telemetryFeed = document.getElementById('activity-feed');
            if (telemetryFeed) {
                const actRow = document.createElement('div');
                actRow.className = "activity-row";
                actRow.innerHTML = `
                    <span class="activity-time">Just Now</span>
                    <p class="activity-desc"><strong>${dealSector}</strong> initiated warm path for <strong>${dealName}</strong> with <strong>${randomAlignment}</strong> alignment via playmaker network.</p>
                    <span class="activity-tag tag-cyan">Path Shared</span>
                `;
                telemetryFeed.insertBefore(actRow, telemetryFeed.firstChild);
            }
        }
    };

    // 9. DYNAMIC PORTFOLIO PARTNER SYNERGY MATRIX MODAL
    const modal = document.getElementById('partner-modal');
    const modalTitle = document.getElementById('modal-partner-name');
    const modalSector = document.getElementById('modal-sector');
    const modalNodeName = document.getElementById('modal-node-name');
    const modalDesc = document.getElementById('modal-desc');
    const modalSavings = document.getElementById('modal-savings');
    const modalReferrals = document.getElementById('modal-referrals');
    const modalIP = document.getElementById('modal-ip');
    const modalAlignments = document.getElementById('modal-alignments-list');

    // Google Sheets Integration Config
    const GOOGLE_SHEET_ID = "1Yt_Jqu2YlVCmTTz3HNY9fMY1JY6pnrkdllQQGKytJxE";

    let partnerData = {
        "Nexus Analytics": {
            sector: "Family Offices & Large Corporations",
            tag: "large-corp",
            desc: "Nexus Analytics implements advanced AI and statistical modeling to optimize capital allocation and operational efficiency for GCC family offices.",
            savings: "G&A -30%",
            referrals: "+$550,000",
            ip: "Available (ADGM Financial Tech)",
            alignments: [
                "Secured market licensing and legal frameworks in ADGM via Al Ghassani.",
                "Consolidated finance and payroll accounting under G&A Shared Services."
            ]
        },
        "AeroTech Int": {
            sector: "SMEs & Technology Startups",
            tag: "sme-startup",
            desc: "AeroTech designs smart aviation component tracking software and predictive scheduling algorithms for regional airline operators.",
            savings: "G&A -45%",
            referrals: "+$850,000",
            ip: "AeroTech Scheduling Core IP",
            alignments: [
                "Accessing GCC sovereign procurement bids via Midfield Playmaker assist.",
                "Pre-integrated compliance audits and MOHRE payroll rails."
            ]
        },
        "Vertex Health": {
            sector: "SMEs & Technology Startups",
            tag: "sme-startup",
            desc: "Vertex Healthcare develops secure cloud diagnostics software for regional clinics, integrating zero-trust frameworks and Arabic medical interfaces.",
            savings: "G&A -35%",
            referrals: "+$1,200,000",
            ip: "Arabic Diagnostics Middleware",
            alignments: [
                "AI adoption middleware completed under Innovation Consulting track.",
                "Legal M&A council and compliance audits insulated via central G&A."
            ]
        },
        "GCC Commercial": {
            sector: "Sports Networks & Sponsorships",
            tag: "sports-commercial",
            desc: "GCC Commercial Networks manages high-profile regional athlete portfolios, securing premium corporate sponsorships and brand representation deals.",
            savings: "G&A -40%",
            referrals: "+$680,000",
            ip: "Sponsorship Rights Engine",
            alignments: [
                "Commercial sports sponsorship contract finalized with Saudi Pro League.",
                "Executive advisory and coaching support managed by Al Ghassani."
            ]
        }
    };

    // Render the alliance grid cards dynamically
    const renderPortfolioGrid = () => {
        const grid = document.getElementById('alliance-grid');
        if (!grid) return;

        grid.innerHTML = "";

        Object.keys(partnerData).forEach(partnerName => {
            const partner = partnerData[partnerName];
            
            const card = document.createElement('div');
            card.className = "alliance-card glass-card";
            card.onclick = () => showPartnerDetails(partnerName);

            // Assign border accent based on tag
            let accentColor = "var(--color-cyan)";
            if (partner.tag === "large-corp") accentColor = "var(--color-gold)";
            if (partner.tag === "sports-commercial") accentColor = "var(--color-magenta)";

            card.innerHTML = `
                <div>
                    <div class="alliance-card-header">
                        <span class="badge-tier" style="border-color: ${accentColor}; color: ${accentColor};">${partner.sector}</span>
                    </div>
                    <h3 class="alliance-card-name">${partnerName}</h3>
                    <p class="alliance-card-desc">${partner.desc}</p>
                </div>
                <div class="alliance-card-footer">
                    <span class="text-muted">Direct Offset: <strong style="color: var(--color-cyan);">${partner.savings}</strong></span>
                    <span class="alliance-card-metric" style="color: var(--color-gold);">${partner.referrals}</span>
                </div>
            `;
            grid.appendChild(card);
        });

        // Initialize Lucide Icons for dynamic content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Dynamically populate select dropdown options inside Client Portal
    const populatePortalDropdowns = () => {
        const select = document.getElementById('deal-sector');
        if (!select) return;

        select.innerHTML = "";

        Object.keys(partnerData).forEach(partnerName => {
            const opt = document.createElement('option');
            opt.value = partnerName;
            opt.innerText = partnerName;
            select.appendChild(opt);
        });
    };

    // Google Sheets fetch loader
    const loadPartnersFromGoogleSheet = () => {
        if (!GOOGLE_SHEET_ID || GOOGLE_SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") {
            console.log("Using default fallback portfolio data.");
            renderPortfolioGrid();
            populatePortalDropdowns();
            return;
        }

        const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json`;

        fetch(url)
            .then(res => res.text())
            .then(text => {
                const jsonString = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
                const json = JSON.parse(jsonString);
                
                if (!json.table || !json.table.rows) {
                    throw new Error("Invalid Google Sheets data structure");
                }

                const rows = json.table.rows;
                const newPartnerData = {};

                rows.forEach(row => {
                    const cells = row.c;
                    if (!cells || cells.length < 4) return;

                    const name = cells[0] ? (cells[0].v || "").toString().trim() : "";
                    if (!name) return;

                    const sector = cells[1] ? (cells[1].v || "").toString().trim() : "";
                    const tag = cells[2] ? (cells[2].v || "").toString().trim() : "";
                    const desc = cells[3] ? (cells[3].v || "").toString().trim() : "";
                    const savings = cells[4] ? (cells[4].v || "").toString().trim() : "";
                    const referrals = cells[5] ? (cells[5].v || "").toString().trim() : "";
                    const ip = cells[6] ? (cells[6].v || "").toString().trim() : "";
                    
                    const alignments = [];
                    if (cells[7] && cells[7].v) alignments.push(cells[7].v.toString().trim());
                    if (cells[8] && cells[8].v) alignments.push(cells[8].v.toString().trim());

                    newPartnerData[name] = {
                        sector,
                        tag,
                        desc,
                        savings,
                        referrals,
                        ip,
                        alignments
                    };
                });

                if (Object.keys(newPartnerData).length > 0) {
                    partnerData = newPartnerData;
                    console.log("Successfully loaded portfolio data from Google Sheets:", partnerData);
                }
                
                renderPortfolioGrid();
                populatePortalDropdowns();
            })
            .catch(err => {
                console.error("Failed to load portfolio from Google Sheets, using fallback:", err);
                renderPortfolioGrid();
                populatePortalDropdowns();
            });
    };

    // Render the Case Studies / Insights grid dynamically
    const renderInsightsGrid = (insightsList) => {
        const grid = document.getElementById('insights-grid');
        if (!grid) return;

        grid.innerHTML = "";

        insightsList.forEach(item => {
            const card = document.createElement('div');
            card.className = "portfolio-card glass-card";
            card.style.position = "relative";
            card.style.overflow = "hidden";
            card.style.borderRadius = "var(--radius-md)";

            // Check category for border accents
            let accentClass = "accent-cyan";
            if (item.category === "PARTNERSHIP") accentClass = "accent-gold";
            if (item.category === "COMPLIANCE") accentClass = "accent-magenta";

            // Parse Challenge, Solution, Outcome from summary
            let problem = "";
            let solution = "";
            let outcome = "";
            const raw = item.summary || "";

            const pIdx = raw.indexOf("Problem:");
            const sIdx = raw.indexOf("Solution:");
            const oIdx = raw.indexOf("Outcome:");

            if (pIdx !== -1 && sIdx !== -1 && oIdx !== -1) {
                problem = raw.substring(pIdx + 8, sIdx).trim();
                solution = raw.substring(sIdx + 9, oIdx).trim();
                outcome = raw.substring(oIdx + 8).trim();
            } else {
                problem = raw;
            }

            card.innerHTML = `
                <div class="card-accent ${accentClass}"></div>
                <div class="portfolio-header" style="margin-bottom: 1.5rem;">
                    <span class="badge-tier equity" style="font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;">${item.category}</span>
                    <span class="status-text" style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500;">${item.date}</span>
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 600; margin-bottom: 1.2rem; color: var(--text-primary);">${item.title}</h3>
                
                <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.8rem;">
                    <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.65; margin: 0;">
                        <strong>Challenge:</strong> ${problem}
                    </p>
                    ${solution ? `
                    <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.65; margin: 0;">
                        <strong>AGE Solution:</strong> ${solution}
                    </p>
                    ` : ''}
                    ${outcome ? `
                    <p style="font-size: 0.82rem; color: var(--color-gold); line-height: 1.65; font-weight: 600; margin: 0;">
                        <strong>Outcome:</strong> ${outcome}
                    </p>
                    ` : ''}
                </div>
                
                <a href="${item.url}" class="btn btn-secondary btn-sm" style="display: block; width: 100%; text-align: center; text-decoration: none; border-radius: 4px; padding: 0.6rem; font-weight: 600; font-size: 0.8rem; border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);">Read Case Study</a>
            `;
            grid.appendChild(card);
        });
    };

    // Load insights from Google Sheets (second tab)
    const loadInsightsFromGoogleSheet = () => {
        const fallbackList = [
            {
                title: "UAE Healthcare Expansion",
                category: "GTM & ACCESS",
                summary: "Problem: Clinic group needed to scale cross-border. Solution: Deployed AGE Launch™ to navigate filings. Outcome: Established 3 regional hubs, accelerating licensing by 40%.",
                date: "CASE STUDY",
                url: "#contact"
            },
            {
                title: "Saudi Sports Matchmaking",
                category: "PARTNERSHIP",
                summary: "Problem: Sports tech firm sought Saudi access. Solution: Activated AGE Connect™ to secure pathways. Outcome: Secured 2 multi-year sponsorships, growing footprint by 55%.",
                date: "CASE STUDY",
                url: "#contact"
            },
            {
                title: "ADGM Fintech Licensing",
                category: "COMPLIANCE",
                summary: "Problem: Fintech firm required regulatory setup. Solution: Orchestrated AGE Scale™ to conduct audits. Outcome: Secured full license in record time with zero friction.",
                date: "CASE STUDY",
                url: "#contact"
            }
        ];

        if (!GOOGLE_SHEET_ID || GOOGLE_SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") {
            renderInsightsGrid(fallbackList);
            return;
        }

        const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&sheet=Insights`;

        fetch(url)
            .then(res => res.text())
            .then(text => {
                const jsonString = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
                const json = JSON.parse(jsonString);
                
                if (!json.table || !json.table.rows) {
                    throw new Error("Invalid Google Sheets structure");
                }

                const rows = json.table.rows;
                const insightsList = [];

                rows.forEach(row => {
                    const cells = row.c;
                    if (!cells || cells.length < 4) return;

                    const title = cells[0] ? (cells[0].v || "").toString().trim() : "";
                    if (!title) return;

                    const category = cells[1] ? (cells[1].v || "").toString().trim() : "";
                    const date = cells[2] ? (cells[2].v || "").toString().trim() : "";
                    const summary = cells[3] ? (cells[3].v || "").toString().trim() : "";
                    
                    // Validate URL format to prevent broken G&A redirect issues
                    let urlVal = cells[4] ? (cells[4].v || "").toString().trim() : "#contact";
                    if (!urlVal.startsWith('http://') && !urlVal.startsWith('https://') && !urlVal.startsWith('#')) {
                        urlVal = "#contact";
                    }

                    insightsList.push({
                        title,
                        category,
                        date,
                        summary,
                        url: urlVal
                    });
                });

                // Pad the grid to at least 3 cards using fallback cards for layout balance
                if (insightsList.length > 0) {
                    if (insightsList.length < 3) {
                        const needed = 3 - insightsList.length;
                        for (let i = 0; i < needed; i++) {
                            if (fallbackList[i]) {
                                insightsList.push(fallbackList[i]);
                            }
                        }
                    }
                    renderInsightsGrid(insightsList);
                } else {
                    renderInsightsGrid(fallbackList);
                }
            })
            .catch(err => {
                console.error("Failed to load insights from Google Sheets, using fallback:", err);
                renderInsightsGrid(fallbackList);
            });
    };

    window.showPartnerDetails = (partnerName) => {
        const data = partnerData[partnerName];
        if (!data || !modal) return;

        modalTitle.innerText = partnerName;
        modalSector.innerText = data.sector;
        modalNodeName.querySelector('.node-label').innerText = partnerName;
        modalDesc.innerText = data.desc;
        modalSavings.innerText = data.savings;
        modalReferrals.innerText = data.referrals;
        modalIP.innerText = data.ip;

        // Reset list alignments
        modalAlignments.innerHTML = "";
        data.alignments.forEach(alignText => {
            const li = document.createElement('li');
            li.innerHTML = `<i data-lucide="link" class="text-cyan"></i> ${alignText}`;
            modalAlignments.appendChild(li);
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    };

    window.closePartnerModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scrolling
    };

    // Close modal on background clicks
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePartnerModal();
            }
        });
    }

    // 10. PRE-FILL CONTACT FORM FROM SYNERGY CALCULATOR
    window.prefillAssessmentContactForm = () => {
        if (!lSlider || !mSlider || !tSlider || !oSlider || !aSlider || !pSlider || !cSlider || !gSlider) return;
        
        const L = +lSlider.value;
        const M = +mSlider.value;
        const T = +tSlider.value;
        const O = +oSlider.value;
        const A = +aSlider.value;
        const P = +pSlider.value;
        const C = +cSlider.value;
        const G = +gSlider.value;

        const maturityPct = document.getElementById('res-maturity-score').innerText;
        const investmentLevel = document.getElementById('res-investment-level').innerText;
        const expansionPct = document.getElementById('res-expansion-score').innerText;
        const riskLevel = document.getElementById('res-risk-level').innerText;
        const recommendedProduct = document.getElementById('res-recommended-product').innerText;
        
        const messageTextarea = document.getElementById('contact-message');
        if (messageTextarea) {
            messageTextarea.value = `We are interested in an AGE Strategic Growth Session.
Executive Readiness Assessment Results:
- Growth Maturity Score: ${maturityPct}
- Investment Readiness: ${investmentLevel}
- Expansion Score: ${expansionPct}
- Risk Level Profile: ${riskLevel}
- Recommended Strategic Product: ${recommendedProduct}

Individual Maturity Markers (1-10):
- Leadership & Governance: ${L}/10
- Market & GCC Positioning: ${M}/10
- Technology & Infrastructure: ${T}/10
- Operational Efficiency: ${O}/10
- AI & Automation Adoption: ${A}/10
- Strategic Partnerships: ${P}/10
- Capital & Investment: ${C}/10
- Government & Regulatory: ${G}/10

We would like to analyze how Al Ghassani Enterprises can support navigating our growth and scaling priorities.`;
            showToast("Your executive assessment indicators have been loaded into the request form below!", "info");
        }
    };

    // 11. INQUIRY FORM SUBMISSION - WEB3FORMS BACKGROUND INTEGRATION
    window.handleInquirySubmit = (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('contact-name');
        const roleInput = document.getElementById('contact-role');
        const emailInput = document.getElementById('contact-email');
        const phoneInput = document.getElementById('contact-phone');
        const companyInput = document.getElementById('contact-company');
        const messageInput = document.getElementById('contact-message');
        const form = document.getElementById('inquiry-form');

        if (!nameInput || !companyInput) return;

        const name = nameInput.value.trim();
        const role = roleInput ? roleInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const phone = phoneInput ? phoneInput.value.trim() : "";
        const company = companyInput.value.trim();
        const message = messageInput ? messageInput.value.trim() : "";

        // Replace this with your Web3Forms Access Key from web3forms.com
        const accessKey = "dc0090f0-d1d8-451a-a1c1-36f1728a3e47";

        // Visual feedback
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Encrypting Node Pipeline...";
        submitBtn.disabled = true;

        if (accessKey === "YOUR_ACCESS_KEY_HERE") {
            // Fallback to mailto link if key is not yet set
            setTimeout(() => {
                submitBtn.innerText = "Opening Secure Mail Channel...";
                submitBtn.style.background = "#00FF66";
                submitBtn.style.color = "#04050D";

                showToast(`Access Key not set. Launching mail client...`, 'info');

                const subject = encodeURIComponent(`AGE Advisory Request - ${company}`);
                const body = encodeURIComponent(`AGE Advisory Inquiry Details:
---------------------------------------------
Full Name: ${name}
Corporate Title: ${role}
Secure Corporate Email: ${email}
Direct Contact Number: ${phone}
Enterprise Name: ${company}

Growth Directives & Friction Areas:
${message}
---------------------------------------------
Sent from AGE Al Ghassani Enterprises Portal`);

                window.location.href = `mailto:info@alghassani.com?subject=${subject}&body=${body}`;

                setTimeout(() => {
                    form.reset();
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = "";
                    submitBtn.style.color = "";
                }, 3000);
            }, 1000);
            return;
        }

        // Web3Forms API submission in background
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: accessKey,
                name: name,
                email: email,
                subject: `AGE Advisory Request - ${company}`,
                message: `AGE Advisory Inquiry Details:\n---------------------------------------------\nFull Name: ${name}\nCorporate Title: ${role}\nSecure Corporate Email: ${email}\nDirect Contact Number: ${phone}\nEnterprise Name: ${company}\n\nGrowth Directives & Friction Areas:\n${message}\n---------------------------------------------`
            })
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                submitBtn.innerText = "Advisory Request Transmitted!";
                submitBtn.style.background = "#00FF66";
                submitBtn.style.color = "#04050D";
                showToast(`Thank you, ${name}. Secure advisory request for '${company}' has been transmitted.`, 'success');
                
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = "";
                    submitBtn.style.color = "";
                }, 3000);
            } else {
                throw new Error(json.message || "Submission failed");
            }
        })
        .catch(error => {
            submitBtn.innerText = "Transmission Failed";
            submitBtn.style.background = "#FF0055";
            submitBtn.style.color = "#FFFFFF";
            showToast(`Error: ${error.message || "Failed to transmit request"}`, 'warning');
            
            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = "";
                submitBtn.style.color = "";
            }, 3000);
        });
    };

    // 13. RESPONSIVE MOBILE NAVIGATION MENU
    const hamburger = document.getElementById('menu-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 14. INTERACTIVE FOUNDER TACTICAL PLAYBOOK ENGINE
    const founderQuotes = {
        playmaker: {
            quote: `"From elite sport to enterprise growth, Yahya Al Ghassani brings the discipline, vision and relationship-building philosophy of a professional playmaker to business leadership."`,
            signature: "— Yahya Al Ghassani, Founder & Chairman"
        },
        resilience: {
            quote: `"A solid defense is the foundation of any championship squad. We absorb your non-core back-office G&A friction—compliance, HR, and legal audits—forming a secure shield so you are never caught off guard."`,
            signature: "— Al Ghassani Enterprises Board"
        },
        acceleration: {
            quote: `"In the attacking third, speed and synchronization are everything. We align strategic partnerships and activate warm GCC matchmaking routes, accelerating your enterprise to regional dominance."`,
            signature: "— Corporate Advisory & GTM Lead"
        }
    };

    window.switchFounderTactic = (tacticId) => {
        const quoteTextNode = document.getElementById('founder-quote');
        const signatureNode = document.querySelector('.founder-signature');
        
        if (!quoteTextNode || !founderQuotes[tacticId]) return;

        // Visual fade out transition
        quoteTextNode.style.opacity = '0';
        quoteTextNode.style.transform = 'translateY(-5px)';
        
        setTimeout(() => {
            // Swap content
            quoteTextNode.innerText = founderQuotes[tacticId].quote;
            if (signatureNode) {
                signatureNode.innerText = founderQuotes[tacticId].signature;
            }

            // Fade back in
            quoteTextNode.style.opacity = '1';
            quoteTextNode.style.transform = 'translateY(0)';
            quoteTextNode.style.transition = 'all var(--transition-fast)';
        }, 200);

        // Update button highlight states
        const tacticButtons = document.querySelectorAll('.tactic-btn');
        tacticButtons.forEach(btn => btn.classList.remove('active'));

        const activeBtn = document.getElementById(`btn-tactic-${tacticId}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update tactics board SVG container class name for lines self-drawing animation
        const tacticsBoard = document.getElementById('tactics-board');
        if (tacticsBoard) {
            tacticsBoard.className = `pitch-svg ${tacticId}-active`;
        }

        showToast(`Tactical Creed shifted: ${tacticId.charAt(0).toUpperCase() + tacticId.slice(1)} Mode activated!`, 'info');
    };

    // 15. FOUNDER STRATEGIC NETWORK ASSIST SIMULATION
    window.triggerFounderMediaBoost = () => {
        showToast("Strategic Network Assist Activated! Elite warm-path introductions queued.", "success");
        
        // Add row to live activity stream
        const telemetryFeed = document.getElementById('activity-feed');
        if (telemetryFeed) {
            const actRow = document.createElement('div');
            actRow.className = "activity-row";
            actRow.style.background = "rgba(201, 162, 39, 0.08)";
            actRow.style.borderLeft = "3px solid var(--color-cyan)";
            actRow.style.padding = "1rem";
            actRow.style.borderRadius = "var(--radius-sm)";
            actRow.style.marginBottom = "0.8rem";
            actRow.style.opacity = '0';
            actRow.style.transform = 'translateY(-10px)';
            actRow.style.transition = 'all var(--transition-normal)';
            
            actRow.innerHTML = `
                <span class="activity-time">Just Now</span>
                <p class="activity-desc">🤝 <strong>NETWORK ASSIST:</strong> Chairman activated strategic warm route to GCC Sovereign Investment Boards for active client pipelines.</p>
                <span class="activity-tag tag-magenta">Network Active</span>
            `;
            
            telemetryFeed.insertBefore(actRow, telemetryFeed.firstChild);
            
            // Render visual entrance
            setTimeout(() => {
                actRow.style.opacity = '1';
                actRow.style.transform = 'translateY(0)';
            }, 50);
        }
    };

    // 16. SCROLL REVEAL OBSERVER ENGINE
    const revealSections = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealSections.forEach(section => {
        revealObserver.observe(section);
    });

    // 17. GEMINI API KEY INITIALIZATION (GOOGLE AI STUDIO SUPPORT)
    const savedApiKey = localStorage.getItem('age-gemini-key');
    const apiKeyInputNode = document.getElementById('ai-api-key');
    const aiStatusNode = document.getElementById('ai-status');
    const btnRunAiNode = document.getElementById('btn-run-ai');

    if (savedApiKey && apiKeyInputNode && aiStatusNode) {
        apiKeyInputNode.value = savedApiKey;
        aiStatusNode.innerText = "Active (AI Powered)";
        aiStatusNode.classList.add('active');
        if (btnRunAiNode) btnRunAiNode.style.display = 'block';
    }

    window.testApiKey = () => {
        if (!apiKeyInputNode || !aiStatusNode) return;
        const key = apiKeyInputNode.value.trim();
        if (key) {
            localStorage.setItem('age-gemini-key', key);
            aiStatusNode.innerText = "Active (AI Powered)";
            aiStatusNode.classList.add('active');
            if (btnRunAiNode) btnRunAiNode.style.display = 'block';
            showToast("Gemini AI Advisory Engine connected!", "success");
            
            // Auto-trigger an initial analysis to showcase it
            runAiAnalysis();
        } else {
            localStorage.removeItem('age-gemini-key');
            aiStatusNode.innerText = "Inactive (Rule-Based)";
            aiStatusNode.classList.remove('active');
            if (btnRunAiNode) btnRunAiNode.style.display = 'none';
            showToast("Gemini AI Engine disconnected. Defaulting to local rules.", "info");
            
            // Re-run static recommendations
            if (typeof updateAssessmentResults === 'function') {
                updateAssessmentResults();
            }
        }
    };

    window.runAiAnalysis = async () => {
        const key = localStorage.getItem('age-gemini-key');
        if (!key) {
            showToast("Please connect a Gemini API Key first.", "warning");
            return;
        }

        const spinner = document.getElementById('ai-loading-spinner');
        const descriptionNode = document.getElementById('res-recommended-desc');
        const btnRun = document.getElementById('btn-run-ai');

        if (spinner && descriptionNode) {
            spinner.style.display = 'block';
            descriptionNode.style.display = 'none';
            if (btnRun) btnRun.style.display = 'none';

            try {
                const L = +document.getElementById('score-leadership').value;
                const M = +document.getElementById('score-market').value;
                const T = +document.getElementById('score-technology').value;
                const O = +document.getElementById('score-operations').value;
                const A = +document.getElementById('score-ai').value;
                const P = +document.getElementById('score-partnerships').value;
                const C = +document.getElementById('score-capital').value;
                const G = +document.getElementById('score-government').value;

                const promptText = `You are the AI Advisory Engine of AGE - Al Ghassani Enterprises, an elite boutique strategic growth firm in the GCC. 
Analyze the following client readiness scores (each out of 10) and write a highly professional, concise, executive advisory report (maximum 150 words).

Client Scores:
- Leadership & Governance: ${L}/10
- Market & GCC Positioning: ${M}/10
- Technology & Infrastructure: ${T}/10
- Operational Efficiency: ${O}/10
- AI & Automation Adoption: ${A}/10
- Strategic Partnerships: ${P}/10
- Capital & Investment Readiness: ${C}/10
- Government & Regulatory Readiness: ${G}/10

Identify:
1. The single biggest friction area (lowest score).
2. A customized strategic recommendation using one of our named services: AGE Launch™ (for market/gov), AGE Connect™ (for partnerships), AGE Scale™ (for operations), AGE AI™ (for tech/AI), or AGE Capital™ (for capital/leadership).
3. The next immediate step for the executive board.

Keep the tone prestigious, strategic, and direct. Do not use formatting like headers (h1/h2) - just use bolding and bullet points.`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: promptText
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                if (data.contents && data.contents[0] && data.contents[0].parts && data.contents[0].parts[0]) {
                    let generatedText = data.contents[0].parts[0].text;
                    
                    // Simple formatter for markdown bold to HTML bold and newlines to breaks
                    generatedText = generatedText
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\n/g, '<br>');

                    descriptionNode.innerHTML = generatedText;
                    
                    // Also update contact form with this customized AI report!
                    const messageTextarea = document.getElementById('contact-message');
                    if (messageTextarea) {
                        const maturityPct = document.getElementById('res-maturity-score').innerText;
                        const investmentLevel = document.getElementById('res-investment-level').innerText;
                        const recommendedProduct = document.getElementById('res-recommended-product').innerText;
                        
                        // Plain text conversion for textarea
                        const plainTextReport = data.contents[0].parts[0].text;
                        
                        messageTextarea.value = `We are interested in an AGE Strategic Growth Session.
Executive Readiness Assessment Results:
- Growth Maturity Score: ${maturityPct}
- Investment Readiness: ${investmentLevel}
- Recommended Strategic Product: ${recommendedProduct}

Tailored AI Advisory Insight:
${plainTextReport}

Individual Maturity Markers (1-10):
- Leadership & Governance: ${L}/10
- Market & GCC Positioning: ${M}/10
- Technology & Infrastructure: ${T}/10
- Operational Efficiency: ${O}/10
- AI & Automation Adoption: ${A}/10
- Strategic Partnerships: ${P}/10
- Capital & Investment: ${C}/10
- Government & Regulatory: ${G}/10

We would like to analyze how Al Ghassani Enterprises can support navigating our growth and scaling priorities.`;
                    }

                    showToast("Custom AI Advisory insights generated successfully!", "success");
                } else {
                    throw new Error("Invalid response format from Gemini API");
                }
            } catch (err) {
                console.error(err);
                descriptionNode.innerHTML = `<span style="color: var(--text-magenta); font-size: 0.85rem;">Failed to generate AI insights: ${err.message}. Defaulting to rule-based fallback.</span>`;
                showToast("Failed to connect to Gemini API Node.", "warning");
            } finally {
                spinner.style.display = 'none';
                descriptionNode.style.display = 'block';
                if (btnRun) btnRun.style.display = 'block';
            }
        }
    };

    // 15. DYNAMIC DEVICE/VIEWMODE SWITCHER (MOBILE <=> PC)
    const viewportMeta = document.getElementById('viewport-meta');
    const switcherFab = document.getElementById('device-switcher-fab');
    
    function applyViewportMode(mode) {
        if (!viewportMeta) return;
        
        const pcIcon = document.getElementById('switcher-icon-pc');
        const mobileIcon = document.getElementById('switcher-icon-mobile');
        const switcherText = document.getElementById('switcher-text');
        
        const isDesktopScreen = window.innerWidth > 1024;
        
        if (isDesktopScreen) {
            // NATIVE DESKTOP VIEWPORT
            if (mode === 'mobile') {
                document.documentElement.classList.add('simulated-mobile-mode');
                document.documentElement.classList.remove('forced-pc-mode');
                viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
                
                if (pcIcon) pcIcon.style.display = 'inline-block';
                if (mobileIcon) mobileIcon.style.display = 'none';
                if (switcherText) switcherText.innerText = 'Desktop View';
                
                showToast("Switched to Simulated Mobile View", "success");
            } else {
                document.documentElement.classList.remove('simulated-mobile-mode');
                document.documentElement.classList.remove('forced-pc-mode');
                viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
                
                if (pcIcon) pcIcon.style.display = 'none';
                if (mobileIcon) mobileIcon.style.display = 'inline-block';
                if (switcherText) switcherText.innerText = 'Mobile View';
                
                showToast("Switched to Standard Desktop View", "success");
            }
        } else {
            // NATIVE MOBILE VIEWPORT
            if (mode === 'pc') {
                viewportMeta.setAttribute('content', 'width=1200, initial-scale=0.3, shrink-to-fit=no');
                document.documentElement.classList.add('forced-pc-mode');
                document.documentElement.classList.remove('simulated-mobile-mode');
                
                if (pcIcon) pcIcon.style.display = 'none';
                if (mobileIcon) mobileIcon.style.display = 'inline-block';
                if (switcherText) switcherText.innerText = 'Mobile View';
                
                showToast("Switched to Desktop Mode", "success");
            } else {
                viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
                document.documentElement.classList.remove('forced-pc-mode');
                document.documentElement.classList.remove('simulated-mobile-mode');
                
                if (pcIcon) pcIcon.style.display = 'inline-block';
                if (mobileIcon) mobileIcon.style.display = 'none';
                if (switcherText) switcherText.innerText = 'Desktop View';
                
                showToast("Switched to Mobile Mode", "success");
            }
        }
        
        // Re-align any dynamic layouts if needed
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    if (switcherFab) {
        const isDesktopScreen = window.innerWidth > 1024;
        const savedMode = localStorage.getItem('viewport-mode');
        
        // Determine initial active mode
        let initialMode;
        if (isDesktopScreen) {
            initialMode = (savedMode === 'mobile') ? 'mobile' : 'pc';
        } else {
            initialMode = (savedMode === 'pc') ? 'pc' : 'mobile';
        }
        
        // Apply initial state representation silently without toast alert
        const pcIcon = document.getElementById('switcher-icon-pc');
        const mobileIcon = document.getElementById('switcher-icon-mobile');
        const switcherText = document.getElementById('switcher-text');
        
        if (isDesktopScreen) {
            if (initialMode === 'mobile') {
                document.documentElement.classList.add('simulated-mobile-mode');
                if (pcIcon) pcIcon.style.display = 'inline-block';
                if (mobileIcon) mobileIcon.style.display = 'none';
                if (switcherText) switcherText.innerText = 'Desktop View';
            } else {
                document.documentElement.classList.remove('simulated-mobile-mode');
                if (pcIcon) pcIcon.style.display = 'none';
                if (mobileIcon) mobileIcon.style.display = 'inline-block';
                if (switcherText) switcherText.innerText = 'Mobile View';
            }
        } else {
            if (initialMode === 'pc') {
                if (viewportMeta) viewportMeta.setAttribute('content', 'width=1200, initial-scale=0.3, shrink-to-fit=no');
                document.documentElement.classList.add('forced-pc-mode');
                if (pcIcon) pcIcon.style.display = 'none';
                if (mobileIcon) mobileIcon.style.display = 'inline-block';
                if (switcherText) switcherText.innerText = 'Mobile View';
            } else {
                if (viewportMeta) viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
                document.documentElement.classList.remove('forced-pc-mode');
                if (pcIcon) pcIcon.style.display = 'inline-block';
                if (mobileIcon) mobileIcon.style.display = 'none';
                if (switcherText) switcherText.innerText = 'Desktop View';
            }
        }
        
        switcherFab.addEventListener('click', () => {
            const currentIsDesktop = window.innerWidth > 1024;
            let currentMode;
            if (currentIsDesktop) {
                currentMode = document.documentElement.classList.contains('simulated-mobile-mode') ? 'mobile' : 'pc';
            } else {
                currentMode = document.documentElement.classList.contains('forced-pc-mode') ? 'pc' : 'mobile';
            }
            
            const newMode = (currentMode === 'mobile') ? 'pc' : 'mobile';
            localStorage.setItem('viewport-mode', newMode);
            applyViewportMode(newMode);
        });
    }

    // 16. DYNAMIC WIDGET REVEAL ENGINES
    window.activateInteractive = (id) => {
        const node = document.getElementById(id === 'calculator' ? 'calc-card-node' : 'portal-dashboard-node');
        if (node) {
            node.classList.remove('interactive-covered');
            const overlay = node.querySelector('.interactive-cover-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
                setTimeout(() => {
                    overlay.remove();
                }, 400);
            }
            showToast(id === 'calculator' ? "Strategic Growth Index Activated" : "Client Workspace Activated", "success");
        }
    };

    // ==========================================================================
    // GCC MAP AND RELATIONSHIP NETWORK INTERACTIVITY
    // ==========================================================================
    const mapNodes = document.querySelectorAll('.map-node');
    const mapDetailsTitle = document.getElementById('map-details-title');
    const mapDetailsText = document.getElementById('map-details-text');
    const mapDetailsBadge = document.getElementById('map-details-badge');
    const mapDetailsOverlay = document.getElementById('map-node-details');

    const nodeData = {
        dubai: {
            title: "Dubai, UAE (Corporate Hub)",
            text: "Operational headquarters for GCC introductions. Direct sandbox licensing, market entry frameworks, and strategic advisory connections.",
            badge: "Primary HQ"
        },
        abudhabi: {
            title: "Abu Dhabi, UAE (Sovereign Hub)",
            text: "Direct portal for ADGM licensing, sovereign co-investments, regulatory integration, and family office matchmaking.",
            badge: "Sovereign Hub"
        },
        riyadh: {
            title: "Riyadh, Saudi Arabia",
            text: "Gateway to Saudi Giga-Projects under Vision 2030. Accelerating national registry filings, defense logistics, and infrastructure introduction routes.",
            badge: "Strategic Hub"
        },
        doha: {
            title: "Doha, Qatar",
            text: "Strategic corridor for Qatar financial center introductions, institutional wealth backing, and global sports partnerships.",
            badge: "Regional Hub"
        },
        muscat: {
            title: "Muscat, Oman",
            text: "Facilitating Oman port partnerships, logistics pipelines, maritime trade clearances, and sustainable tourism ventures.",
            badge: "Regional Hub"
        }
    };

    mapNodes.forEach(node => {
        const updateNodeDetails = () => {
            const nodeKey = node.getAttribute('data-node');
            const data = nodeData[nodeKey];
            if (data) {
                mapNodes.forEach(n => n.classList.remove('active'));
                node.classList.add('active');
                
                if (mapDetailsOverlay) {
                    mapDetailsOverlay.style.opacity = '0';
                    setTimeout(() => {
                        if (mapDetailsTitle) mapDetailsTitle.innerText = data.title;
                        if (mapDetailsText) mapDetailsText.innerText = data.text;
                        if (mapDetailsBadge) mapDetailsBadge.innerText = data.badge;
                        mapDetailsOverlay.style.opacity = '1';
                    }, 150);
                }
            }
        };

        node.addEventListener('mouseenter', updateNodeDetails);
        node.addEventListener('click', updateNodeDetails);
    });

    // RELATIONSHIP NETWORK CANVAS ANIMATION
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        const updateCanvasSize = () => {
            if (canvas.offsetWidth !== width || canvas.offsetHeight !== height) {
                width = canvas.offsetWidth;
                height = canvas.offsetHeight;
                canvas.width = width;
                canvas.height = height;
            }
        };

        window.addEventListener('resize', updateCanvasSize);

        // Nodes definition
        const centerNode = { x: 0, y: 0, label: "AGE", size: 30, color: "#C8A04D" };
        const orbitLabels = ["Family Offices", "Government", "AI Platforms", "Sports Academies", "Trade Logistics", "Institutional Wealth"];
        const outerNodes = orbitLabels.map((label, idx) => {
            const angle = (idx * Math.PI * 2) / orbitLabels.length;
            return {
                label,
                angle,
                dist: 110,
                size: 8,
                color: "#D4B15A",
                pulsePhase: Math.random() * Math.PI
            };
        });

        let animationFrameId;
        const animateNetwork = (time) => {
            updateCanvasSize();
            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            // Draw links first
            outerNodes.forEach((node, idx) => {
                node.pulsePhase += 0.02;
                const distOffset = Math.sin(node.pulsePhase) * 6;
                const nx = cx + Math.cos(node.angle) * (node.dist + distOffset);
                const ny = cy + Math.sin(node.angle) * (node.dist + distOffset);

                // Draw pulsing golden line
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(nx, ny);
                const grad = ctx.createLinearGradient(cx, cy, nx, ny);
                grad.addColorStop(0, "rgba(200, 160, 77, 0.4)");
                grad.addColorStop(0.5, `rgba(225, 201, 122, ${0.3 + Math.sin(node.pulsePhase * 2) * 0.15})`);
                grad.addColorStop(1, "rgba(200, 160, 77, 0.05)");
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Draw tiny orbital connecting dust particles
                const particleCount = 2;
                for (let i = 1; i <= particleCount; i++) {
                    const ratio = ((time * 0.0015 * i + idx * 0.3) % 1.0);
                    const px = cx + (nx - cx) * ratio;
                    const py = cy + (ny - cy) * ratio;
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(225, 201, 122, ${1 - ratio})`;
                    ctx.fill();
                }
            });

            // Draw outer nodes
            outerNodes.forEach(node => {
                const distOffset = Math.sin(node.pulsePhase) * 6;
                const nx = cx + Math.cos(node.angle) * (node.dist + distOffset);
                const ny = cy + Math.sin(node.angle) * (node.dist + distOffset);

                // Outer node glow
                ctx.beginPath();
                ctx.arc(nx, ny, node.size + 4 + Math.sin(node.pulsePhase) * 3, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(212, 177, 90, 0.08)";
                ctx.fill();

                // Outer node dot
                ctx.beginPath();
                ctx.arc(nx, ny, node.size, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();

                // Outer node text
                ctx.font = "500 11px Inter";
                ctx.fillStyle = "#D5D8DF";
                ctx.textAlign = nx > cx ? "left" : "right";
                ctx.textBaseline = "middle";
                const offset = nx > cx ? 12 : -12;
                ctx.fillText(node.label, nx + offset, ny);
            });

            // Draw center node (AGE)
            ctx.beginPath();
            ctx.arc(cx, cy, centerNode.size + 8 + Math.sin(time * 0.003) * 4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(200, 160, 77, 0.08)";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, centerNode.size, 0, Math.PI * 2);
            ctx.fillStyle = "#111d2e";
            ctx.strokeStyle = centerNode.color;
            ctx.lineWidth = 2.5;
            ctx.fill();
            ctx.stroke();

            // Labeled text inside center
            ctx.font = "800 13px Inter";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(centerNode.label, cx, cy);

            animationFrameId = requestAnimationFrame(animateNetwork);
        };

        // Start canvas loop when section is near
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animationFrameId) {
                        animationFrameId = requestAnimationFrame(animateNetwork);
                    }
                } else {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                }
            });
        }, { threshold: 0.1 });
        observer.observe(canvas);
    }

    // PORTAL CHART ANIMATION ON SCROLL
    const portalChartPath = document.getElementById('portal-chart-path');
    if (portalChartPath) {
        const length = portalChartPath.getTotalLength() || 400;
        portalChartPath.style.strokeDasharray = length;
        portalChartPath.style.strokeDashoffset = length;
        portalChartPath.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(0.25, 0.8, 0.25, 1)';

        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    portalChartPath.style.strokeDashoffset = 0;
                    chartObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        chartObserver.observe(portalChartPath);
    }

    // Initialize Google Sheets Portfolio & Insights Data
    loadPartnersFromGoogleSheet();
    loadInsightsFromGoogleSheet();
});
