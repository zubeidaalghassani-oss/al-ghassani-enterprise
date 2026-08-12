/**
 * Al Ghassani Enterprises - Visitor Telemetry, Email & Discord Notifier with Traffic Analytics
 * Sends real-time notifications to Email (info@alghassani.com) and Discord when visitors view the website.
 */
(function () {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const DEFAULT_EMAIL_RECIPIENT = 'info@alghassani.com';
    const DEFAULT_WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL';
    const DEBOUNCE_MINUTES = 10; // Minutes to wait before sending another notification for the same page session
    const MAX_LOG_ENTRIES = 250; // Maximum local telemetry records kept in storage

    // Helper to get active webhook URL
    function getWebhookUrl() {
        return window.AGE_DISCORD_WEBHOOK_URL ||
            localStorage.getItem('age_discord_webhook_url') ||
            DEFAULT_WEBHOOK_URL;
    }

    // Helper to get active email recipient
    function getEmailRecipient() {
        return window.AGE_EMAIL_RECIPIENT ||
            localStorage.getItem('age_email_recipient') ||
            DEFAULT_EMAIL_RECIPIENT;
    }

    // Helper to check if running in local dev environment
    function isLocalEnvironment() {
        const hostname = window.location.hostname;
        const isLocalHost = hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '::1' ||
            window.location.protocol === 'file:';

        const forceDevNotify = localStorage.getItem('age_notify_dev') === 'true';
        return isLocalHost && !forceDevNotify;
    }

    // Helper to turn country ISO code into flag emoji (e.g. AE -> 🇦🇪)
    function getFlagEmoji(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '🌐';
        try {
            const codePoints = countryCode
                .toUpperCase()
                .split('')
                .map(char => 127397 + char.charCodeAt(0));
            return String.fromCodePoint(...codePoints);
        } catch (e) {
            return '🌐';
        }
    }

    // Detect browser name
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox/')) return 'Firefox';
        if (ua.includes('Edg/')) return 'Edge';
        if (ua.includes('Chrome/')) return 'Chrome';
        if (ua.includes('Safari/')) return 'Safari';
        if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
        return 'Browser';
    }

    // Detect OS
    function getOSInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Macintosh') || ua.includes('Mac OS X')) return 'macOS';
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('Linux')) return 'Linux';
        return 'Unknown OS';
    }

    // Generate or retrieve persistent Session ID
    function getSessionId() {
        let sid = sessionStorage.getItem('age_session_id');
        if (!sid) {
            sid = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
            sessionStorage.setItem('age_session_id', sid);
        }
        return sid;
    }

    // Telemetry Local Storage Manager
    function getStoredLogs() {
        try {
            const raw = localStorage.getItem('age_telemetry_logs');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveLogEntry(entry) {
        try {
            let logs = getStoredLogs();
            logs.unshift(entry); // Newest first
            if (logs.length > MAX_LOG_ENTRIES) {
                logs = logs.slice(0, MAX_LOG_ENTRIES);
            }
            localStorage.setItem('age_telemetry_logs', JSON.stringify(logs));
        } catch (e) {
            console.warn('[AGE Notifier] Failed to save local telemetry log:', e);
        }
    }

    // ==========================================
    // EMAIL DISPATCHER (Web3Forms API + Mailto)
    // ==========================================
    async function sendEmailNotification(logRecord, options = {}) {
        const emailRecipient = getEmailRecipient();
        const accessKey = window.AGE_WEB3FORMS_KEY || localStorage.getItem('age_web3forms_key');

        const flag = getFlagEmoji(logRecord.countryCode);
        const locationText = logRecord.countryCode
            ? `${logRecord.city}, ${logRecord.country} ${flag}`
            : 'Location Unavailable';

        const subject = `[AGE Visitor Alert] ${logRecord.title} (${logRecord.page})`;
        const messageBody = `
AL GHASSANI ENTERPRISES - SITE VISITOR ALERT
--------------------------------------------------
Page Visited: ${logRecord.title} (${logRecord.page})
Full URL: ${window.location.href}
Timestamp: ${logRecord.formattedTime}

VISITOR DETAILS:
• Location: ${locationText}
• Network/ISP: ${logRecord.org}
• Traffic Source: ${logRecord.referrer}
• Device & OS: ${logRecord.device} (${logRecord.screenSize})
• Session ID: ${logRecord.sessionId}

--------------------------------------------------
Al Ghassani Enterprises Automated Telemetry System
Recipient: ${emailRecipient}
`;

        // Attempt Web3Forms API submission if access key configured
        if (accessKey) {
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: accessKey,
                        email: emailRecipient,
                        subject: subject,
                        message: messageBody,
                        from_name: 'AGE Visitor Telemetry'
                    })
                });
                if (response.ok) {
                    console.log('[AGE Notifier] Email alert submitted via Web3Forms to ' + emailRecipient);
                    return true;
                }
            } catch (e) {
                console.warn('[AGE Notifier] Web3Forms API email dispatch failed:', e);
            }
        } else {
            console.info('[AGE Notifier] Web3Forms Key not set. Set window.AGE_WEB3FORMS_KEY or localStorage.setItem("age_web3forms_key", "KEY") for direct API email dispatch.');
        }

        return false;
    }

    // Main notification dispatcher
    async function sendVisitNotification(options = {}) {
        const webhookUrl = getWebhookUrl();
        const pagePath = window.location.pathname + window.location.search;
        const pageTitle = document.title || 'Al Ghassani Enterprises';
        const currentUrl = window.location.href;
        const referrer = document.referrer ? document.referrer : 'Direct Visit / Bookmark';
        const osStr = getOSInfo();
        const browserStr = getBrowserInfo();
        const screenSize = `${window.screen.width}x${window.screen.height}`;
        const sessionId = getSessionId();

        // Fetch location data (privacy-safe, max 3 second timeout)
        let geoData = { city: 'Unknown', country_name: 'Unknown', country_code: '', org: 'Unknown IP' };
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data && !data.error) {
                    geoData = {
                        city: data.city || 'Unknown',
                        country_name: data.country_name || 'Unknown',
                        country_code: data.country_code || '',
                        org: data.org || data.asn || 'Unknown Network'
                    };
                }
            }
        } catch (err) {
            // Non-critical: continue with default geo info if fetch fails or is blocked
        }

        const timestampStr = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Dubai',
            dateStyle: 'medium',
            timeStyle: 'medium'
        }) + ' (GST)';

        // Log entry object
        const logRecord = {
            id: 'v_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            timestamp: new Date().toISOString(),
            formattedTime: timestampStr,
            page: pagePath || '/',
            title: pageTitle,
            referrer: referrer,
            city: geoData.city,
            country: geoData.country_name,
            countryCode: geoData.country_code,
            org: geoData.org,
            device: `${osStr} • ${browserStr}`,
            screenSize: screenSize,
            sessionId: sessionId
        };

        // Always save to local telemetry log
        saveLogEntry(logRecord);

        if (isLocalEnvironment() && !options.force) {
            console.info('[AGE Notifier] Local environment detected. Skipping notification dispatch (set localStorage.setItem("age_notify_dev", "true") to override).');
            return;
        }

        const debounceKey = `age_last_notified_${pagePath}`;
        const lastNotified = sessionStorage.getItem(debounceKey);
        const now = Date.now();

        if (lastNotified && (now - parseInt(lastNotified, 10)) < DEBOUNCE_MINUTES * 60 * 1000 && !options.force) {
            console.info(`[AGE Notifier] Page view already logged within the last ${DEBOUNCE_MINUTES} minutes.`);
            return;
        }

        // Dispatch Email Notification
        sendEmailNotification(logRecord, options);

        // Check Discord Notification prerequisites
        if (!webhookUrl || webhookUrl === 'YOUR_DISCORD_WEBHOOK_URL') {
            console.info('[AGE Notifier] Discord Webhook URL not set. Set window.AGE_DISCORD_WEBHOOK_URL or localStorage.setItem("age_discord_webhook_url", "YOUR_URL").');
            return;
        }

        const flag = getFlagEmoji(geoData.country_code);
        const locationText = geoData.country_code
            ? `${geoData.city}, ${geoData.country_name} ${flag}`
            : 'Location Unavailable';

        // Construct Discord Embed Payload
        const embedPayload = {
            username: 'AGE Telemetry Bot',
            avatar_url: 'https://alghassani.com/logo.png',
            embeds: [
                {
                    title: '👁️ New Visitor on Al Ghassani Enterprise',
                    url: currentUrl,
                    color: 0xD4AF37, // #D4AF37 AGE Gold
                    fields: [
                        {
                            name: '📄 Page Visited',
                            value: `[${pageTitle}](${currentUrl})\n\`${pagePath}\``,
                            inline: false
                        },
                        {
                            name: '📍 Location',
                            value: `**${locationText}**\n\`${geoData.org}\``,
                            inline: true
                        },
                        {
                            name: '🌐 Traffic Source',
                            value: `\`${referrer}\``,
                            inline: true
                        },
                        {
                            name: '💻 Device & System',
                            value: `${osStr} • ${browserStr} (${screenSize})`,
                            inline: false
                        }
                    ],
                    footer: {
                        text: `Al Ghassani Enterprise Telemetry • ${timestampStr}`
                    }
                }
            ]
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embedPayload)
            });

            if (response.ok || response.status === 204) {
                sessionStorage.setItem(debounceKey, now.toString());
                console.log('[AGE Notifier] Visitor notification sent successfully to Discord.');
            } else {
                console.warn('[AGE Notifier] Webhook request returned status:', response.status);
            }
        } catch (error) {
            console.error('[AGE Notifier] Failed to send Discord notification:', error);
        }
    }

    // ==========================================
    // TRAFFIC ANALYTICS CALCULATOR
    // ==========================================
    function getTrafficSummary() {
        const logs = getStoredLogs();
        const totalViews = logs.length;

        // Unique Visitors (Sessions)
        const uniqueSessions = new Set(logs.map(l => l.sessionId)).size;

        // Views in Last 24 Hours
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        const viewsToday = logs.filter(l => new Date(l.timestamp).getTime() > oneDayAgo).length;

        // Page Breakdown
        const pageCounts = {};
        logs.forEach(l => {
            const p = l.page || '/';
            pageCounts[p] = (pageCounts[p] || 0) + 1;
        });
        const topPages = Object.entries(pageCounts)
            .map(([page, count]) => ({ page, count, percentage: totalViews ? Math.round((count / totalViews) * 100) : 0 }))
            .sort((a, b) => b.count - a.count);

        // Country Breakdown
        const countryCounts = {};
        logs.forEach(l => {
            const c = l.countryCode ? `${l.country} ${getFlagEmoji(l.countryCode)}` : 'Unknown Location';
            countryCounts[c] = (countryCounts[c] || 0) + 1;
        });
        const topCountries = Object.entries(countryCounts)
            .map(([country, count]) => ({ country, count, percentage: totalViews ? Math.round((count / totalViews) * 100) : 0 }))
            .sort((a, b) => b.count - a.count);

        // Referrer Breakdown
        const referrerCounts = {};
        logs.forEach(l => {
            let ref = 'Direct / Bookmark';
            if (l.referrer && l.referrer !== 'Direct Visit / Bookmark') {
                if (l.referrer.includes('google')) ref = 'Google Search';
                else if (l.referrer.includes('linkedin')) ref = 'LinkedIn';
                else if (l.referrer.includes('twitter') || l.referrer.includes('t.co')) ref = 'Twitter / X';
                else {
                    try {
                        ref = new URL(l.referrer).hostname;
                    } catch (e) {
                        ref = l.referrer;
                    }
                }
            }
            referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
        });
        const topReferrers = Object.entries(referrerCounts)
            .map(([source, count]) => ({ source, count, percentage: totalViews ? Math.round((count / totalViews) * 100) : 0 }))
            .sort((a, b) => b.count - a.count);

        return {
            totalViews,
            uniqueVisitors: uniqueSessions,
            viewsToday,
            topPages: topPages.slice(0, 5),
            topCountries: topCountries.slice(0, 5),
            topReferrers: topReferrers.slice(0, 5),
            recentVisits: logs.slice(0, 20)
        };
    }

    // Dispatch Traffic Summary Email Report to info@alghassani.com
    async function sendEmailReport(targetEmail) {
        const recipient = targetEmail || getEmailRecipient();
        const summary = getTrafficSummary();
        const accessKey = window.AGE_WEB3FORMS_KEY || localStorage.getItem('age_web3forms_key');

        const timestampStr = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Dubai',
            dateStyle: 'full',
            timeStyle: 'short'
        }) + ' (GST / Dubai)';

        const pagesFormatted = summary.topPages.length > 0
            ? summary.topPages.map(p => `- ${p.page}: ${p.count} views (${p.percentage}%)`).join('\n')
            : '- No pageview history recorded yet.';

        const countriesFormatted = summary.topCountries.length > 0
            ? summary.topCountries.map(c => `- ${c.country}: ${c.count} visits (${c.percentage}%)`).join('\n')
            : '- No location data recorded yet.';

        const referrersFormatted = summary.topReferrers.length > 0
            ? summary.topReferrers.map(r => `- ${r.source}: ${r.count} visits (${r.percentage}%)`).join('\n')
            : '- Direct traffic only.';

        const subject = `[AGE Executive Report] Website Traffic Summary — ${new Date().toLocaleDateString()}`;
        const emailBody = `
AL GHASSANI ENTERPRISES - EXECUTIVE WEBSITE TRAFFIC REPORT
Generated: ${timestampStr}
Recipient: ${recipient}
===========================================================

1. EXECUTIVE METRICS OVERVIEW:
-----------------------------------------------------------
• Total Page Views: ${summary.totalViews}
• Unique Visitor Sessions: ${summary.uniqueVisitors}
• 24-Hour Views: ${summary.viewsToday}

2. MOST VISITED PAGES:
-----------------------------------------------------------
${pagesFormatted}

3. GEOGRAPHIC VISITOR DISTRIBUTION:
-----------------------------------------------------------
${countriesFormatted}

4. TRAFFIC ACQUISITION CHANNELS:
-----------------------------------------------------------
${referrersFormatted}

===========================================================
Al Ghassani Enterprises Telemetry Module • https://alghassani.com
`;

        // If Web3Forms API Key is set, attempt silent API send
        if (accessKey) {
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: accessKey,
                        email: recipient,
                        subject: subject,
                        message: emailBody,
                        from_name: 'AGE Executive Telemetry'
                    })
                });
                if (response.ok) {
                    alert(`Traffic Summary Report successfully emailed to ${recipient}!`);
                    return true;
                }
            } catch (e) {
                console.warn('[AGE Notifier] Direct API email send failed:', e);
            }
        }

        // Fallback: Open mailto link pre-filled with report body
        const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoUrl, '_blank');
        return true;
    }

    // Dispatch formatted Discord Traffic Summary Report
    async function sendTrafficReport(options = {}) {
        const webhookUrl = getWebhookUrl();
        if (!webhookUrl || webhookUrl === 'YOUR_DISCORD_WEBHOOK_URL') {
            alert('Discord Webhook URL is not configured yet. Please configure it in visitor-notifier.js or localStorage.');
            return false;
        }

        const summary = getTrafficSummary();
        const timestampStr = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Dubai',
            dateStyle: 'full',
            timeStyle: 'short'
        }) + ' (GST / Dubai)';

        const pagesFormatted = summary.topPages.length > 0
            ? summary.topPages.map(p => `• \`${p.page}\`: **${p.count} views** (${p.percentage}%)`).join('\n')
            : 'No page view data recorded yet.';

        const countriesFormatted = summary.topCountries.length > 0
            ? summary.topCountries.map(c => `• **${c.country}**: **${c.count} visits** (${c.percentage}%)`).join('\n')
            : 'No location data recorded yet.';

        const referrersFormatted = summary.topReferrers.length > 0
            ? summary.topReferrers.map(r => `• **${r.source}**: **${r.count} visits** (${r.percentage}%)`).join('\n')
            : 'Direct traffic only.';

        const embedPayload = {
            username: 'AGE Telemetry Bot',
            avatar_url: 'https://alghassani.com/logo.png',
            embeds: [
                {
                    title: '📊 Al Ghassani Enterprise — Website Traffic Report',
                    color: 0xD4AF37, // Gold
                    description: 'Comprehensive executive summary of site traffic, engagement metrics, and visitor telemetry.',
                    fields: [
                        {
                            name: '📈 Key Metrics Overview',
                            value: `• **Total Page Views**: \`${summary.totalViews}\`\n• **Unique Visitors**: \`${summary.uniqueVisitors}\`\n• **Views (Last 24h)**: \`${summary.viewsToday}\``,
                            inline: false
                        },
                        {
                            name: '📄 Top Visited Pages',
                            value: pagesFormatted,
                            inline: false
                        },
                        {
                            name: '🌍 Top Geographic Locations',
                            value: countriesFormatted,
                            inline: true
                        },
                        {
                            name: '🔗 Traffic Channels',
                            value: referrersFormatted,
                            inline: true
                        }
                    ],
                    footer: {
                        text: `Al Ghassani Enterprise Executive Telemetry Report • ${timestampStr}`
                    }
                }
            ]
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embedPayload)
            });

            if (response.ok || response.status === 204) {
                console.log('[AGE Notifier] Traffic Summary Report sent to Discord.');
                return true;
            } else {
                console.warn('[AGE Notifier] Traffic Report failed with status:', response.status);
                return false;
            }
        } catch (e) {
            console.error('[AGE Notifier] Error sending traffic report:', e);
            return false;
        }
    }

    // Export Telemetry Log as CSV Spreadsheet
    function exportCSV() {
        const logs = getStoredLogs();
        if (logs.length === 0) {
            alert('No traffic data recorded to export yet.');
            return;
        }

        const headers = ['Visit ID', 'Timestamp (ISO)', 'Formatted Time', 'Page Path', 'Page Title', 'Referrer', 'City', 'Country', 'Network/ISP', 'Device', 'Screen Size', 'Session ID'];
        const csvRows = [headers.join(',')];

        logs.forEach(l => {
            const row = [
                `"${l.id || ''}"`,
                `"${l.timestamp || ''}"`,
                `"${(l.formattedTime || '').replace(/"/g, '""')}"`,
                `"${(l.page || '').replace(/"/g, '""')}"`,
                `"${(l.title || '').replace(/"/g, '""')}"`,
                `"${(l.referrer || '').replace(/"/g, '""')}"`,
                `"${(l.city || '').replace(/"/g, '""')}"`,
                `"${(l.country || '').replace(/"/g, '""')}"`,
                `"${(l.org || '').replace(/"/g, '""')}"`,
                `"${(l.device || '').replace(/"/g, '""')}"`,
                `"${(l.screenSize || '').replace(/"/g, '""')}"`,
                `"${(l.sessionId || '').replace(/"/g, '""')}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
        const link = document.createElement('a');
        link.setAttribute('href', csvContent);
        link.setAttribute('download', `alghassani_traffic_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Send Automated Email, Auto-Responder & Discord Alert on Form Submission
    async function sendFormSubmissionNotification(formData) {
        const recipient = getEmailRecipient(); // info@alghassani.com
        const accessKey = window.AGE_WEB3FORMS_KEY || localStorage.getItem('age_web3forms_key') || "dc0090f0-d1d8-451a-a1c1-36f1728a3e47";
        const webhookUrl = getWebhookUrl();

        const timestampStr = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Dubai',
            dateStyle: 'full',
            timeStyle: 'short'
        }) + ' (GST / Dubai)';

        const refId = 'AGE-REF-' + Math.floor(100000 + Math.random() * 900000);

        // 1. ADMIN NOTIFICATION EMAIL TO info@alghassani.com
        const adminSubject = `📩 Strategic Inquiry Submitted: ${formData.name || 'Client'} (${formData.company || 'Enterprise'}) [${refId}]`;
        const adminMessageBody = `
AL GHASSANI ENTERPRISES - NEW FORM SUBMISSION RECEIVED
===========================================================
Submitted: ${timestampStr}
Reference ID: ${refId}
Target Recipient: ${recipient}

VISITOR & ENTERPRISE DETAILS:
-----------------------------------------------------------
• Full Name: ${formData.name || 'N/A'}
• Corporate Title: ${formData.role || 'N/A'}
• Corporate Email: ${formData.email || 'N/A'}
• Direct Phone: ${formData.phone || 'N/A'}
• Enterprise Name: ${formData.company || 'N/A'}

GROWTH DIRECTIVES & FRICTION AREAS:
-----------------------------------------------------------
${formData.message || 'No additional directives provided.'}

===========================================================
Al Ghassani Enterprises Form Submissions • https://alghassani.com
`;

        try {
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: accessKey,
                    email: recipient,
                    replyto: formData.email || recipient,
                    subject: adminSubject,
                    message: adminMessageBody,
                    from_name: 'AGE Form Submission Engine'
                })
            }).then(res => {
                if (res.ok) console.log('[AGE Notifier] Form submission email dispatched to ' + recipient);
            }).catch(e => console.warn('[AGE Notifier] Admin form email dispatch error:', e));
        } catch (e) {
            console.warn('[AGE Notifier] Admin email error:', e);
        }

        // 2. AUTOMATED AUTO-RESPONDER CONFIRMATION EMAIL TO VISITOR (formData.email)
        if (formData.email && formData.email.includes('@')) {
            const visitorSubject = `Receipt & Confirmation: Al Ghassani Enterprises Strategic Advisory Request [${refId}]`;
            const visitorAutoResponderBody = `Dear ${formData.name || 'Valued Executive'},

Thank you for contacting Al Ghassani Enterprises. We have received your strategic advisory inquiry for ${formData.company || 'your enterprise'}.

SUBMISSION SUMMARY:
-----------------------------------------------------------
• Executive Name: ${formData.name || 'N/A'}
• Corporate Title: ${formData.role || 'Executive'}
• Enterprise Name: ${formData.company || 'N/A'}
• Corporate Email: ${formData.email}
• Direct Phone: ${formData.phone || 'N/A'}
• Reference ID: ${refId}
• Submitted: ${timestampStr}

NEXT STEPS:
Our executive advisory office is reviewing your submitted directives. A senior partner from Al Ghassani Enterprises will contact you within 24 hours to schedule a confidential strategic consultation session.

If you have additional context or documentation to share, please reply directly to this email or write to info@alghassani.com.

Warm regards,

Executive Advisory Office
Al Ghassani Enterprises Group Ltd.
Dubai International Financial Centre (DIFC) | ADGM | Dubai, UAE
Website: https://alghassani.com
Email: info@alghassani.com
`;

            try {
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: accessKey,
                        email: formData.email,
                        replyto: recipient, // Reply to info@alghassani.com
                        subject: visitorSubject,
                        message: visitorAutoResponderBody,
                        from_name: 'Al Ghassani Enterprises Executive Office'
                    })
                }).then(res => {
                    if (res.ok) console.log('[AGE Notifier] Auto-responder confirmation email dispatched to visitor: ' + formData.email);
                }).catch(e => console.warn('[AGE Notifier] Auto-responder email dispatch error:', e));
            } catch (e) {
                console.warn('[AGE Notifier] Auto-responder error:', e);
            }
        }

        // 3. DISCORD WEBHOOK NOTIFICATION
        if (webhookUrl && webhookUrl !== 'YOUR_DISCORD_WEBHOOK_URL') {
            const embedPayload = {
                username: 'AGE Form Bot',
                avatar_url: 'https://alghassani.com/logo.png',
                embeds: [
                    {
                        title: '📩 New Strategic Inquiry Form Received',
                        color: 0x00FF66, // Green
                        fields: [
                            {
                                name: '👤 Executive',
                                value: `**${formData.name || 'N/A'}** (${formData.role || 'Executive'})`,
                                inline: true
                            },
                            {
                                name: '🏢 Enterprise',
                                value: `**${formData.company || 'N/A'}**`,
                                inline: true
                            },
                            {
                                name: '✉️ Contact Email',
                                value: `\`${formData.email || 'N/A'}\``,
                                inline: true
                            },
                            {
                                name: '📞 Contact Phone',
                                value: `\`${formData.phone || 'N/A'}\``,
                                inline: true
                            },
                            {
                                name: '🆔 Reference ID',
                                value: `\`${refId}\``,
                                inline: true
                            },
                            {
                                name: '💬 Growth Directives',
                                value: formData.message || 'No message provided.',
                                inline: false
                            }
                        ],
                        footer: {
                            text: `Al Ghassani Enterprise Form Engine • ${timestampStr}`
                        }
                    }
                ]
            };

            try {
                fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(embedPayload)
                });
            } catch (e) {
                console.warn('[AGE Notifier] Discord form alert error:', e);
            }
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => sendVisitNotification());
    } else {
        sendVisitNotification();
    }

    // Expose global controller API
    window.AGEVisitorNotifier = {
        send: sendVisitNotification,
        sendEmailNotification: sendEmailNotification,
        sendEmailReport: sendEmailReport,
        sendFormSubmissionNotification: sendFormSubmissionNotification,
        sendTrafficReport: sendTrafficReport,
        getTrafficSummary: getTrafficSummary,
        exportCSV: exportCSV,
        getStoredLogs: getStoredLogs,
        setEmailRecipient: function (email) {
            localStorage.setItem('age_email_recipient', email);
            console.log('[AGE Notifier] Email recipient updated to ' + email);
        },
        getEmailRecipient: getEmailRecipient,
        setWebhookUrl: function (url) {
            localStorage.setItem('age_discord_webhook_url', url);
            console.log('[AGE Notifier] Webhook URL saved to localStorage.');
        },
        getWebhookUrl: getWebhookUrl
    };
})();
