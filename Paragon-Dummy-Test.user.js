// ==UserScript==
// @name         Paragon Dummy — GitHub Update Test
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Dummy script to test GitHub auto-updates on Paragon. Adds a small badge showing the script version and a button for a random fun message. It does not read, change, or click anything on the case.
// @author       J.T.
// @match        https://paragon-na.amazon.com/hz/view-case?caseId=*
// @updateURL    https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Paragon-Dummy-Test.user.js
// @downloadURL  https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Paragon-Dummy-Test.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // The badge shows the version from this script's own header, so when a
    // GitHub update flows through you can SEE it change here (1.0 -> 1.1).
    // Falls back to "1.0" if GM_info is unavailable.
    var version = '1.0';
    try {
        if (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) {
            version = GM_info.script.version;
        }
    } catch (e) { /* keep the fallback */ }

    var MESSAGES = [
        '🚛 Another day, another load. You have got this.',
        '☕ Coffee first, cases second.',
        '📦 If it fits, it ships. Probably.',
        '🛣️ All roads lead to the dock.',
        '😄 You handled that case like a pro.',
        '🎉 Dummy script reporting for duty. Update check passed!',
        '🧪 This is only a test. The carriers will never know.',
        '⏰ It is always 8 AM somewhere in the queue.',
        '🌤️ Clear skies, full loads, cannot lose.',
        '🏆 Case closed. Somewhere, a dispatcher smiles.'
    ];

    var style = document.createElement('style');
    style.textContent = [
        '#dummy-test-badge {',
        '  position: fixed; right: 16px; bottom: 16px; z-index: 99999;',
        '  background: #7c3aed; color: #fff; font: 12px/1.4 sans-serif;',
        '  padding: 8px 12px; border-radius: 20px; cursor: pointer;',
        '  box-shadow: 0 2px 8px rgba(0,0,0,0.3); user-select: none;',
        '}',
        '#dummy-test-badge.spin { animation: dummy-test-spin 0.6s ease; }',
        '@keyframes dummy-test-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
        '#dummy-test-toast {',
        '  position: fixed; right: 16px; bottom: 64px; z-index: 99999;',
        '  background: #111827; color: #fff; font: 13px/1.4 sans-serif;',
        '  padding: 10px 14px; border-radius: 8px; max-width: 320px;',
        '  box-shadow: 0 2px 8px rgba(0,0,0,0.3); opacity: 0;',
        '  transition: opacity 0.3s ease; pointer-events: none;',
        '}',
        '#dummy-test-toast.show { opacity: 1; }'
    ].join('\n');
    document.head.appendChild(style);

    var badge = document.createElement('div');
    badge.id = 'dummy-test-badge';
    badge.textContent = '🧪 Dummy v' + version;
    badge.title = 'Dummy test script — click for a random message';
    document.body.appendChild(badge);

    var toast = document.createElement('div');
    toast.id = 'dummy-test-toast';
    document.body.appendChild(toast);

    var toastTimer = null;
    badge.addEventListener('click', function() {
        var msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        toast.textContent = msg;
        toast.classList.add('show');
        badge.classList.remove('spin');
        void badge.offsetWidth; // restart the spin animation
        badge.classList.add('spin');
        if (toastTimer) { clearTimeout(toastTimer); }
        toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 3500);
    });
})();

