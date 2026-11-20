// ==UserScript==
// @name         Paragon — Thanksgiving Light Theme
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Thanksgiving autumn theme for all of Paragon - LIGHT and fun: warm cream page, warm-white panels, tan bars, pumpkin frames and data, cranberry SLA times, dark brown text, monospace text and uppercase headers - cheerful, with a fun turkey in the bottom-right corner — click him to tickle him: gobbles, facts, and good wishes, shuffled so it never feels the same twice. No grid background. A fixer lightens every dark surface toward cream (keeping its hue) and flips light text to dark - including collapsed content before it ever expands, so expanded follow-up replies stay readable. The reply composer and the review screen are themed directly like everything else - there is no inversion anywhere in this version. Also runs inside the CloudFront widget iframes (follow-ups, bookmarks, contact reason) and themes them from within. Changes the look only - no buttons, text, or functions are touched. Toggle it on/off in Tampermonkey without affecting the response scripts. 
// @author       J.T. Powers
// @match        https://paragon-na.amazon.com/*
// @match        https://d1u16vxl4h9h9c.cloudfront.net/widget.html*
// @match        https://*.cloudfront.net/widget.html*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    /* Palette: Thanksgiving LIGHT (per J.T., Nov 19) — warm cream,
       pumpkin, cranberry, warm brown. No grid background. Fun, not
       a cartoon: bright autumn colours, no characters or quotes. */
    var TG_BG = '#f9f1de';
    var SURFACE = '#fffaf0';
    var BAR_BG = '#f2e2bd';
    var AMBER = '#c85a17';
    var CARAMEL = '#8a5a2b';
    var BODY_TEXT = '#3a2415';
    var SLA = '#b03a2e';
    var STEEL = '#8a6d4b';

    var css = [
        /* Warm cream base + autumn confetti dots (pumpkin/gold) */
        'html, body {',
        '  background-color: ' + TG_BG + ' !important;',
        '  background-image:',
        '    radial-gradient(1px 1px at 12% 22%, rgba(224,123,42,0.8) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 68% 8%, rgba(232,160,76,0.6) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 84% 34%, rgba(224,123,42,0.55) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 32% 64%, rgba(224,123,42,0.55) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 52% 88%, rgba(232,160,76,0.65) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 94% 72%, rgba(232,160,76,0.45) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 4% 82%, rgba(224,123,42,0.6) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 44% 40%, rgba(232,160,76,0.4) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 76% 55%, rgba(224,123,42,0.45) 50%, transparent 51%) !important;',
        '  background-attachment: fixed !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        /* Computer-system data font where Paragon does not set its own. */
        '  font-family: ui-monospace, "Cascadia Mono", "SF Mono", Consolas, "Liberation Mono", monospace !important;',
        '}',
        ':root { color-scheme: dark; }',

        /* Amber-to-cranberry sweep across the top */
        'body::before {',
        '  content: "";',
        '  display: block;',
        '  height: 3px;',
        '  background: linear-gradient(90deg, transparent, ' + AMBER + ' 25%, ' + SLA + ' 75%, transparent);',
        '}',

        /* v2.2: the turkey is a real element now (not body::after), so it
           can be clicked - and it only exists on the main page, never
           inside the widget iframes (Bookmarks, Contact Reason). Click it for a Thanksgiving fact. */
        '/* v2.3: ticklish turkey, endless quotes */',
        '#tg-turkey {',
        '  position: fixed;',
        '  right: 20px;',
        '  bottom: 20px;',
        '  width: 170px;',
        '  height: 170px;',
        '  cursor: pointer;',
        '  z-index: 9998;',
        '  background-image: url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 200 200%27%3E%3Cellipse cx=%27100%27 cy=%2780%27 rx=%2715%27 ry=%2742%27 fill=%27%23b03a2e%27 transform=%27rotate(-55 100 125)%27/%3E%3Cellipse cx=%27100%27 cy=%2780%27 rx=%2715%27 ry=%2742%27 fill=%27%23c85a17%27 transform=%27rotate(-28 100 125)%27/%3E%3Cellipse cx=%27100%27 cy=%2780%27 rx=%2715%27 ry=%2742%27 fill=%27%23e8a04c%27 transform=%27rotate(0 100 125)%27/%3E%3Cellipse cx=%27100%27 cy=%2780%27 rx=%2715%27 ry=%2742%27 fill=%27%23d96a1e%27 transform=%27rotate(28 100 125)%27/%3E%3Cellipse cx=%27100%27 cy=%2780%27 rx=%2715%27 ry=%2742%27 fill=%27%238a5a2b%27 transform=%27rotate(55 100 125)%27/%3E%3Cline x1=%2788%27 y1=%27168%27 x2=%2788%27 y2=%27184%27 stroke=%27%23e07b2a%27 stroke-width=%275%27 stroke-linecap=%27round%27/%3E%3Cline x1=%27112%27 y1=%27168%27 x2=%27112%27 y2=%27184%27 stroke=%27%23e07b2a%27 stroke-width=%275%27 stroke-linecap=%27round%27/%3E%3Cline x1=%2782%27 y1=%27184%27 x2=%2794%27 y2=%27184%27 stroke=%27%23e07b2a%27 stroke-width=%275%27 stroke-linecap=%27round%27/%3E%3Cline x1=%27106%27 y1=%27184%27 x2=%27118%27 y2=%27184%27 stroke=%27%23e07b2a%27 stroke-width=%275%27 stroke-linecap=%27round%27/%3E%3Cellipse cx=%27100%27 cy=%27130%27 rx=%2738%27 ry=%2744%27 fill=%27%238a5a2b%27/%3E%3Cellipse cx=%27100%27 cy=%27144%27 rx=%2723%27 ry=%2726%27 fill=%27%23d9a066%27/%3E%3Ccircle cx=%27100%27 cy=%2776%27 r=%2720%27 fill=%27%238a5a2b%27/%3E%3Cpolygon points=%27113,71 129,77 113,83%27 fill=%27%23e07b2a%27/%3E%3Cellipse cx=%27114%27 cy=%2789%27 rx=%275%27 ry=%278%27 fill=%27%23b03a2e%27/%3E%3Ccircle cx=%27104%27 cy=%2769%27 r=%274.5%27 fill=%27%23fff%27/%3E%3Ccircle cx=%27105%27 cy=%2769%27 r=%272.2%27 fill=%27%233a2415%27/%3E%3C/svg%3E");',,
        '  background-size: contain;',
        '  background-repeat: no-repeat;',
        '  filter: drop-shadow(0 2px 4px rgba(58,36,21,0.25));',
        '  opacity: 0.95;',
        '}',
        '#tg-turkey:hover { opacity: 1; }',
        '#tg-turkey-fact {',
        '  position: fixed;',
        '  right: 20px;',
        '  bottom: 205px;',
        '  max-width: 320px;',
        '  padding: 12px 14px;',
        '  background-color: #fffaf0 !important;',
        '  color: #3a2415 !important;',
        '  border: 2px solid ' + AMBER + ' !important;',
        '  border-radius: 10px;',
        '  box-shadow: 0 4px 14px rgba(58,36,21,0.25);',
        '  font-size: 14px;',
        '  line-height: 1.45;',
        '  z-index: 9999;',
        '  cursor: pointer;',
        '  display: none;',
        '}',
        '#tg-turkey-fact.tg-show { display: block; }',
        '@keyframes tg-tickle {',
        '  0% { transform: rotate(0deg) translateY(0); }',
        '  20% { transform: rotate(-6deg) translateY(-4px); }',
        '  40% { transform: rotate(5deg) translateY(-2px); }',
        '  60% { transform: rotate(-4deg) translateY(-4px); }',
        '  80% { transform: rotate(3deg) translateY(-1px); }',
        '  100% { transform: rotate(0deg) translateY(0); }',
        '}',
        '#tg-turkey.tg-tickle { animation: tg-tickle 0.6s ease; }',

        /* No grid background (per J.T., Nov 19): the page stays a flat
           warm cream — the dotted grid from the Star Wars theme is gone. */

        /* Known Paragon hooks: correspondence text + main grid */
        '.body_RioZc { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '[class*="dvr-grid"] { background-color: transparent !important; }',

        /* Section header rows: warm shell, dotted amber underline + amber
           left edge, like a stitched edge (best effort -
           Paragon's header class may vary, so this is a bonus, not the fix) */
        '.header-row { background-color: ' + SURFACE + ' !important; border-bottom: 1px dotted rgba(224,123,42,0.45) !important; border-left: 3px solid ' + AMBER + ' !important; }',

        /* Expanded detail areas (follow-up replies, etc.) get an amber edge,
           like a warm edge - no layout change (inset shadow). */
        '[role="region"] { box-shadow: inset 2px 0 0 rgba(224,123,42,0.4) !important; }',

        /* The response bars belong to the theme now: warm shell, amber underline.
           Only the bar containers - their buttons keep their inline colors. */
        '#tm-main-bar, #tm-tech-bar, #tm-auctions-bar {',
        '  background-color: ' + BAR_BG + ' !important;',
        '  border-bottom: 2px solid rgba(224,123,42,0.55) !important;',
        '  box-shadow: 0 2px 12px rgba(0,0,0,0.6) !important;',
        '}',
        '.tm-switch-tray, #tm-suggestion-line, #tm-tech-suggestion-line,',
        '#tm-report-footer, #tm-tech-report-footer {',
        '  background-color: ' + BAR_BG + ' !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        '}',

        /* Links go amber, white on hover */
        'a { color: ' + AMBER + ' !important; }',
        'a:hover { color: #a84a12 !important; }',

        /* Headings in amber, uppercase and spaced like a readout, with a
           dotted amber underline like the data lines in the photo */
        'h1 { color: ' + AMBER + ' !important; letter-spacing: 0.5px !important; text-transform: uppercase !important; }',
        'h2, h3, h4, h5 { color: ' + CARAMEL + ' !important; letter-spacing: 0.5px !important; text-transform: uppercase !important; border-bottom: 1px dotted rgba(224,123,42,0.35) !important; }',

        /* Native Paragon buttons: warm tan with a taupe border,
           pumpkin on hover. No !important here on purpose - the response bars
           set their button colors inline, and inline styles beat this, so
           the bars keep theirs. (The fixer below also lightens black
           buttons directly, inline.) */
        'button {',
        '  background-color: #f3e3c2;',
        '  color: ' + BODY_TEXT + ';',
        '  border: 1px solid ' + STEEL + ';',
        '  border-radius: 6px;',
        '}',
        'button:hover { border-color: ' + AMBER + '; color: ' + AMBER + '; }',

        /* Warm form controls (reply box, dropdowns, search) */
        'input, textarea, select {',
        '  background-color: #fffaf0 !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        '  border: 1px solid ' + STEEL + ' !important;',
        '}',
        'input:focus, textarea:focus, select:focus {',
        '  border-color: ' + AMBER + ' !important;',
        '  outline: none !important;',
        '}',

        /* Tables: warm rows, faint borders, pumpkin headers; an amber row
           highlight on hover for the queue lists on the other pages */
        'table { background-color: transparent !important; color: ' + BODY_TEXT + ' !important; }',
        'th { color: ' + AMBER + ' !important; }',
        'td, th { border-color: #d9c39a !important; }',
        'tr:nth-child(even) td { background-color: rgba(224,123,42,0.04) !important; }',
        'tr:hover td { background-color: rgba(224,123,42,0.08) !important; }',

        /* Reopen / due rows (v2.1): a soft amber wash runs the whole row -
           a harvest wash laid across it, stronger amber at the left edge
           fading to the faint amber tint at the right end, on a pale gold
           backing. The gradient lives on the row
           itself (a per-cell gradient would restart at every cell), so the
           cells are transparent and the fixer stays off the row's background.
           The class name carries an em-dash, so the SLA spans are matched
           by substring, not by class selector. These rules sit after the
           table rules so they win the ties. */
        'tr.caseDue { background: linear-gradient(to right, rgba(224,123,42,0.35) 0%, rgba(224,123,42,0.05) 100%) !important; }',
        '/* v2.0: light autumn theme */',
        'tr.caseDue td { background-color: transparent !important; }',
        'tr.caseDue:hover { background: linear-gradient(to right, rgba(224,123,42,0.45) 0%, rgba(224,123,42,0.08) 100%) !important; }',
        // v2.8: Lobby due rows are lobby-case-followup-overdue, not caseDue.
        'tr.lobby-case-followup-overdue { background: linear-gradient(to right, rgba(224,123,42,0.35) 0%, rgba(224,123,42,0.05) 100%) !important; background-color: #fdeecb !important; }',
        // v3.2: the lobby due-cell text colour is set inline by the fixer now - the stylesheet's !important colour was overriding the SLA cranberry (the Lobby report proved it: the fixer had set the cell cranberry inline, but it computed light). The fixer sets every due cell's colour itself, so the stylesheet only forces the background transparent.
        '/* v2.0: lobby due-cell text colour is set inline by the fixer */',
        'tr.lobby-case-followup-overdue td { background-color: transparent !important; background-image: none !important; }',
        'tr.lobby-case-followup-overdue:hover { background: linear-gradient(to right, rgba(224,123,42,0.45) 0%, rgba(224,123,42,0.08) 100%) !important; }',
        '[class*="sla-exceeded-status"] { color: ' + SLA + ' !important; font-weight: 700 !important; text-shadow: none !important; }',

        /* v2.0 (light): the reply composer and the review screen are
           themed directly, like everything else - no inversion. Kat's
           card/input/label backgrounds live in shadow DOM and are
           unreachable, so these rules set warm light colours on the
           light-DOM parts, and injectComposerShadowCss covers the
           shadow roots. Nothing special-cased beyond that. */
        '#composer textarea, #review textarea, #composer input, #review input, #composer select, #review select {',
        '  background-color: #fffaf0 !important;',
        '  color: #3a2415 !important;',
        '  border-color: #8a6d4b !important;',
        '}',
        '#composer input:focus, #review input:focus, #composer textarea:focus, #review textarea:focus, #composer select:focus, #review select:focus {',
        '  border-color: #c85a17 !important;',
        '}',
        '#composer button, #review button {',
        '  background-color: #f3e3c2 !important;',
        '  color: #3a2415 !important;',
        '  border-color: #8a6d4b !important;',
        '}',
        '#composer button:hover, #review button:hover { border-color: #c85a17 !important; color: #c85a17 !important; }',
        '#composer h1, #review h1, #composer h2, #review h2, #composer h3, #review h3, #composer h4, #review h4, #composer h5, #review h5 {',
        '  color: #3a2415 !important;',
        '  border-bottom-color: transparent !important;',
        '}',
        '#composer a, #review a { color: #c85a17 !important; }',
        '#composer ::-webkit-scrollbar-track, #review ::-webkit-scrollbar-track { background: #f2e2bd !important; }',
        '#composer ::-webkit-scrollbar-thumb, #review ::-webkit-scrollbar-thumb { background: #c8a06a !important; }',

        /* Composer / review readability (v2.0): everything inside
           #composer / #review is warm light - placeholders get a
           readable mid-brown at full opacity, and the box and card
           get the theme surface directly. The #composer a rule still
           wins for links (higher specificity). */
        '#composer, #review { background: #fffaf0 !important; }',
        '#composer kat-card, #review kat-card { background: #fffaf0 !important; }',
        '#composer *, #review * { color: #3a2415 !important; }',
        '#composer textarea::placeholder, #composer input::placeholder, #review textarea::placeholder, #review input::placeholder { color: #8a6d4b !important; opacity: 1 !important; }',

        /* Dropdowns (v2.4): the Reason Category / Reason Code boxes stayed
           white. Their light-DOM parts get the theme surface directly,
           inside the composer/review and everywhere else in Paragon
           (the scoped rule wins inside by specificity). Text inside the
           header inherits the warm brown outside; inside, the #composer *
           rule already forces it brown. */
        '#composer .kat-select-container, #review .kat-select-container, #composer .select-header, #review .select-header, #composer .select-options, #review .select-options { background: #fffaf0 !important; }',
        '.kat-select-container, .select-header, .select-options { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.select-header .header-row-text, .select-header kat-icon, .select-header i { color: inherit !important; }',
        '.select-options .option-inner-container { background-color: transparent !important; }',

        /* v2.0: the old inversion safety net is gone with the
           inversion itself - nothing is ever inverted now. */

        /* v2.5: Contact Reason panel - cream panel, caramel headings,
           tan dropdowns (the fixer handles the rest). */
        'pm-card { background-color: ' + SURFACE + ' !important; }',
        'pm-card h3, pm-card h4, pm-card h5 { color: ' + CARAMEL + ' !important; }',

        /* v2.5: Case actions menu was a white box. Popover content gets
           the surface, its buttons get the bar background. */
        'kat-popover-content, [class*="popover-content"] { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        'kat-popover-content button, [class*="popover-content"] button { background-color: ' + BAR_BG + ' !important; color: ' + BODY_TEXT + ' !important; border: 1px solid ' + STEEL + ' !important; }',

        /* v2.5: composer errors must read as errors - cranberry on cream. */
        '#composer [class*="error" i], #review [class*="error" i] { color: #b03a2e !important; }',

        /* v2.6, Lobby check: header bar, table title/head and nav drawer
           came out medium grey, not warm cream, and the hamburger/globe/
           refresh/sort icons were near-invisible dark-on-grey. */
        'header, [role="banner"] { background-color: ' + BAR_BG + ' !important; border-bottom: 2px solid rgba(224,123,42,0.55) !important; }',
        'header button, header svg, header i { color: ' + BODY_TEXT + ' !important; }',
        'header svg { fill: ' + AMBER + ' !important; stroke: ' + AMBER + ' !important; }',
        'nav, aside, [role="navigation"] { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        'nav a, aside a, [role="navigation"] a { color: ' + AMBER + ' !important; }',
        'thead, thead tr, thead th { background-color: ' + BAR_BG + ' !important; }',
        'th button svg, th svg, td button svg { color: ' + AMBER + ' !important; fill: ' + AMBER + ' !important; opacity: 1 !important; }',
        '[class*="tooltip"] { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; border: 1px solid ' + STEEL + ' !important; }',
        /* v3.0, from the five Diagnostics v3.0 reports (11/19): the
           case-page Transfer / Reply / Annotate / filter buttons stayed
           plain white. The site's .tertiary/.link class rule beats the
           plain 'button' rule above, and the fixer had already marked
           them checked while their background was still transparent.
           Scoped to those classes only, so the response bars' classless
           buttons keep their inline colours. */
        'button.tertiary, button.link, kat-button[variant="tertiary"], kat-button[variant="link"] {',
        '  background-color: #f3e3c2 !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        '  border: 1px solid ' + STEEL + ' !important;',
        '}',
        'button.tertiary:hover, button.link:hover { border-color: ' + AMBER + ' !important; color: ' + AMBER + ' !important; }',
        /* Inside the composer/review the rule above still wins (higher
           specificity), so composer buttons keep rendering warm white,
           not the bar tan. */
        '#composer button.tertiary, #review button.tertiary, #composer button.link, #review button.link { background-color: #fffaf0 !important; color: #3a2415 !important; }',

        /* v3.0: the Transfer panel, the Contact Reason panel, the
           notification empty-state and the uc-kat-button stayed white -
           same late-paint cause as the buttons above, so the same
           backstop: theme them directly in CSS. */
        '.transfer-box { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.flo-box { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.flo-box .ng-binding, .flo-box h3, .flo-box h4 { color: ' + BODY_TEXT + ' !important; }',
        '.uc-kat-button { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.uc-notification-empty { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',

        /* v3.0: Bootstrap's active list item and page link are amber
           text on bright blue (#007bff) - 2.54:1. The active state
           becomes the theme primary; the rest of the pager goes brown. */
        '.list-group-item.active, .page-item.active .page-link { background-color: #c85a17 !important; border-color: #c85a17 !important; color: #fffaf0 !important; }',
        '.pagination .page-link, a.page-link { background-color: #f3e3c2 !important; color: ' + AMBER + ' !important; border-color: ' + STEEL + ' !important; }',

        /* v3.0: the nav user line ("User: jxpowers Tenant: Trans (3)")
           and the Lobby table / pagination icons are dark teal (#002f36)
           on cream - readable, but the warm brown keeps the palette
           together. The navItem class is CSS-module hashed, so match
           by substring; the icon font is <i> throughout Paragon.
           Inside #composer/#review the '#composer *' rule wins by
           specificity, so this never touches the composer. */
        'nav [class*="navItem"], aside [class*="navItem"], [role="navigation"] [class*="navItem"] { color: ' + BODY_TEXT + ' !important; }',
        'i { color: ' + BODY_TEXT + ' !important; }',
        '[class*="page-"].selected { color: ' + BODY_TEXT + ' !important; }',

        /* v3.1, from the v3.0 case-page report: v3.0 themed the
           Transfer box and the notification empty-state, but their
           labels kept the dark site colour (#002f36 / #3a2415).
           The fixer will not flip those - it skips text inside custom
           elements when the background is transparent, because the
           shadow background could be dark - so the labels get the
           warm brown directly here. Same reason for the label spans
           inside buttons ("Annotation", the transfer options): they
           carry their own dark colour, so they inherit the button's. */
        '.transfer-box span, .transfer-box label { color: ' + BODY_TEXT + ' !important; }',
        /* v3.4/v1.8: the "View translation" chips in the correspondence
           area are span.default OUTSIDE the composer - dark teal text
           on the dark teal chip (1.00:1, invisible). Give the chip a
           warm tan background and brown text. The composer rule below
           is more specific, so it still wins inside #composer/#review.
           The translation info-alerts are black text on a transparent
           background - same fix. */
        'span.default { color: ' + BODY_TEXT + ' !important; background-color: #f3e3c2 !important; }',
        '.info-alert { color: ' + BODY_TEXT + ' !important; }',
        /* v3.4/v1.8: labels in shadow trees inherit their parent's
           colour - a 'kat-button span' style rule cannot match inside
           a shadow tree, where the host is outside. Inert at top level
           (:host matches nothing outside a shadow tree); active in the
           stylesheet injected into open shadow roots. Insurance for
           the Transfer panel labels if they live in a shadow tree. */
        ':host label { color: inherit !important; }',
        '.uc-notification-empty * { color: ' + BODY_TEXT + ' !important; }',
        'button span, button .text, kat-button span, kat-button .text { color: inherit !important; }',

        /* v3.1: the recipient email chip in the composer/review is dark
           text (#3a2415) on a dark teal chip (#002f36) - unreadable.
           Give it a dark brown chip with cream text, so it stands out
           as a tag. */
        '#composer .default, #review .default { background-color: #3a2415 !important; color: #fffaf0 !important; }',

        /* Warm scrollbars */
        '::-webkit-scrollbar { width: 10px; height: 10px; }',
        '::-webkit-scrollbar-track { background: ' + TG_BG + '; }',
        '::-webkit-scrollbar-thumb { background: ' + STEEL + '; border-radius: 5px; }',
        '::-webkit-scrollbar-thumb:hover { background: ' + AMBER + '; }'
    ].join('\n');

    function injectCss(doc) {
        var style = doc.createElement('style');
        style.type = 'text/css';
        style.appendChild(doc.createTextNode(css));
        (doc.head || doc.documentElement).appendChild(style);
    }

    injectCss(document);

    /* ---- Dark-surface fixer (v2.0, mirrored from the dark theme) ------------
       Lightens EVERY dark surface, keeping its hue and tinting it cream
       (black goes pale warm tan, the dark teal panels go warm tan, the
       dark header goes cream) so the meaning of the colours is kept.
       Big lightened surfaces (panels, cards) also get a thin amber frame.
       Light text on those surfaces flips to dark; links keep their
       pumpkin. The response bars are never touched.
       v2.0: there is NO inversion anywhere in this version - no inverted
       leaves, no inverted composer/review. Kat components are themed
       directly: the reply composer (#composer) and the review screen
       (#review) get the theme surface and brown text inline, and their
       shadow roots get the theme colours from injectComposerShadowCss.
       Walks into open shadow roots and same-origin iframes. Every node is
       checked once (tgChecked) so deep nodes are never missed by a
       per-pass cap. -------------------------------------------------------- */
    var MAX_PER_PASS = 20000;
    var OBSERVE_OPTS = {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ['style', 'class'],
        // v3.2: the SLA-remaining durations tick every second by
        // changing the text node in place - without characterData
        // the fixer never hears about it.
        characterData: true
    };

    function parseRgb(str) {
        var m = str && str.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        var p = m[1].split(',').map(function (x) { return parseFloat(x); });
        return { r: p[0] || 0, g: p[1] || 0, b: p[2] || 0, a: (p.length > 3 ? p[3] : 1) };
    }

    function luminance(c) {
        function f(v) {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    }

    // v2.0 (light): a dark background - the mirror of the dark theme's
    // isLightBg. Luminance under 0.2 reads as dark on this page.
    function isDarkBg(c) {
        return c && c.a >= 0.6 && luminance(c) < 0.2;
    }

    // v2.6, Lobby check: Paragon's due-row wash is pale peach/salmon
    // (~#f8b090: r 248, g 176, b 144). isDarkBg() misses it because
    // peach is light, so the fixer would leave it peach with white
    // text on top - unreadable. Detect that wash directly as a safety
    // net, even when the row's class is not visible to the inspector.
    function isPeachBg(c) {
        return c && c.a >= 0.6 && c.r >= 230 && c.g >= 130 && c.g < 205 && c.b >= 90 && c.b < 180;
    }
    // v2.8: Lobby due rows are <tr class="lobby-case-followup-overdue">,
    // NOT tr.caseDue (proven by J.T.'s pasted row HTML, 11/19) - so
    // match 'overdue' as well as 'caseDue', on the element itself and
    // on its enclosing <tr>. The SLA is a plain <td> with no class, so
    // it is caught by the TD branch in fixOne, not by class.
    // v3.2: a due cell whose whole text is an SLA indicator - a long
    // date with a time, or a negative SLA-remaining duration. Shared by
    // the TD branch (first pass) and the re-check below (late text).
    var SLA_DATE_RE = /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M$/;
    var SLA_NEG_DUR_RE = /^\(\-\d{2}:\d{2}:\d{2}\)$/;
    function isSlaCellText(tx) { return SLA_DATE_RE.test(tx) || SLA_NEG_DUR_RE.test(tx); }

    function isCaseDueRow(el) {
        if (!el) return false;
        if (el.className && typeof el.className === 'string' &&
            (el.className.indexOf('caseDue') !== -1 ||
             el.className.indexOf('overdue') !== -1)) return true;
        if (el.closest) {
            try {
                var _tr = el.closest('tr');
                return !!(_tr && _tr.className && typeof _tr.className === 'string' &&
                    (_tr.className.indexOf('caseDue') !== -1 ||
                     _tr.className.indexOf('overdue') !== -1));
            } catch (e) { return false; }
        }
        return false;
    }

    function isTransparentBg(c) {
        return !c || c.a < 0.1;
    }

    // v2.0 (light): light text - the mirror of the dark theme's
    // isDarkText. White and pale greys flip to dark brown.
    function isLightText(c) {
        return c && luminance(c) > 0.55;
    }

    // v2.0 (light): lighten keeping the hue, tinted toward cream so dark
    // surfaces sit on the cream page instead of reading grey. A black
    // surface lands near pale warm tan (#d1c5aa).
    function lighten(c) {
        function d(v, target) { return Math.min(255, Math.round(v + (target - v) * 0.85)); }
        return 'rgb(' + d(c.r, 246) + ', ' + d(c.g, 232) + ', ' + d(c.b, 200) + ')';
    }

    function inBar(el) {
        return !!(el.closest && el.closest(
            '#tm-main-bar, #tm-tech-bar, #tm-auctions-bar, ' +
            '.tm-switch-tray, #tm-suggestion-line, #tm-tech-suggestion-line, ' +
            '#tm-report-footer, #tm-tech-report-footer'));
    }

    function insideCustomEl(el) {
        var p = el.parentElement, n = 0;
        while (p && n < 8) {
            if (p.tagName && p.tagName.indexOf('-') !== -1) return true;
            p = p.parentElement; n++;
        }
        return false;
    }



    function fixOne(el) {
        if (!el || el.nodeType !== 1) return;
        var tag = el.tagName;
        if (tag === 'HTML' || tag === 'BODY' || tag === 'HEAD' || tag === 'STYLE' ||
            tag === 'SCRIPT' || tag === 'INPUT' ||
            tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'OPTION') return;
        if (inBar(el)) return;
        // Reopen / SLA-overdue markers (v2.0, hardened v2.6): the CSS
        // gives them the harvest-wash treatment, but the CSS
        // never reaches inside shadow-DOM tables (Lobby), so on those
        // pages the SLA text stayed pale on peach - unreadable. Apply
        // the treatment INLINE here, so it holds wherever the fixer can
        // see the element, shadow root or not. The class name carries an
        // em-dash, so match by substring.
        if (el.className && typeof el.className === 'string' &&
            el.className.indexOf('sla-exceeded-status') !== -1) {
            if (!el.dataset.tgSla) {
                el.style.color = SLA;
                el.style.fontWeight = '700';
                el.style.textShadow = 'none';
                el.dataset.tgSla = '1';
            }
            return;
        }
        // v2.6: a due/reopen row (tr.caseDue) gets the wash INLINE, for
        // the same shadow-DOM reason - the stylesheet gradient cannot
        // reach it there. Cells are handled below (transparent, text
        // flipped dark if it was light).
        if (tag === 'TR' && isCaseDueRow(el)) {
            if (!el.dataset.tgCaseDue) {
                el.style.background = 'linear-gradient(to right, rgba(224,123,42,0.35) 0%, rgba(224,123,42,0.05) 100%)';
                el.style.backgroundColor = '#fdeecb';
                el.dataset.tgCaseDue = '1';
            }
            return;
        }
        // v2.6: a cell inside a due row, or a cell/row sitting on the
        // peach wash itself - force transparent so the row wash shows,
        // and flip light text dark. Dark text is left alone: on the
        // pale wash it is already readable (Lobby: white on peach
        // was the failure; dark on pale gold is the fix).
        if ((tag === 'TD' || tag === 'TH') && isCaseDueRow(el)) {
            // v2.9: back to the v2.1/v2.2 design - the wash lives on
            // the TR and fades ONCE across the whole row; cells are
            // transparent so it shows through. v2.7/v2.8 painted each
            // cell with its own gradient, which restarts at every cell
            // - a repeating sawtooth fade J.T. said no longer looks
            // nice. Transparent works now because v2.8's isCaseDueRow
            // actually matches these rows (v2.6 never reached the
            // cells at all), and the stylesheet above forces these
            // TDs transparent !important, so the site's peach rule
            // cannot paint over the row. Applied every pass, not
            // just the first, so cells painted by v2.7/v2.8 are
            // cleared back to transparent.
            el.style.background = 'none';
            el.style.backgroundColor = 'transparent';
            el.dataset.tgCaseDueCell = '1';
            // v2.7: on the Lobby the SLA is a plain cell, not a span -
            // the v2.0/v2.6 span targeting silently did nothing there.
            // A due cell whose whole text is a date WITH a time
            // ("November 18, 2026 08:19 PM") is the SLA cell; the
            // Created cell has a date but no time, so it does not match.
            var _tx0 = (el.textContent || '').trim();
            // v3.0: on search pages the SLA-remaining column shows a
            // duration - "(+12:20:59)" still has time, "(-03:16:54)" is
            // breached, so only the negative one goes cranberry. The date
            // regex is deliberately NOT extended to the numeric search
            // format here - every search cell has a time, so it would
            // also colour the Created cell; the sla-exceeded-status
            // spans already carry the SLA colour on search pages.
            if (isSlaCellText(_tx0)) {
                // v3.2: mark the SLA treatment, so the re-check below
                // knows this cell is done. Without the flag, a cell
                // whose text only becomes an SLA indicator later (a
                // ticking duration, a late-filling cell) would never
                // be re-run - that is why the search negative durations
                // stayed light in v3.0/v3.1.
                el.dataset.tgSla = '1';
                el.style.color = SLA;
                el.style.fontWeight = '700';
                el.style.textShadow = 'none';
            } else {
                var _cs0 = getComputedStyle(el);
                var _fg0 = parseRgb(_cs0.color);
                if (isLightText(_fg0)) el.style.color = BODY_TEXT;
            }
            return;
        }
        // v2.0 (light): the reply composer and the review screen are
        // themed directly, like everything else - no inversion anywhere.
        // Their card/input backgrounds are reached by the #composer /
        // #review CSS above and by injectComposerShadowCss below.
        if (el.id === 'composer' || el.id === 'review') {
            el.style.backgroundColor = SURFACE;
            el.style.color = BODY_TEXT;
            return;
        }
        // NOTE: no visibility skip here on purpose (v1.7). Collapsed
        // content (expanded replies, hidden panels) has no boxes yet, but
        // its computed styles are still readable - theme it now so it is
        // already right when it opens.
        var cs = getComputedStyle(el);
        var bg = parseRgb(cs.backgroundColor);
        var fg = parseRgb(cs.color);
        var bgIsDark = isDarkBg(bg);
        // v2.6: peach wash with no caseDue class in reach - treat it as
        // a due row anyway: pale gold underneath, text dark.
        if (isPeachBg(bg) && !el.dataset.tgPeach) {
            el.style.backgroundColor = '#fdeecb';
            if (fg) el.style.color = BODY_TEXT;
            el.dataset.tgPeach = '1';
            el.dataset.tgLightened = '1';
            // v2.7: peach SLA cell - same date-with-time test as above.
            var _txp = (el.textContent || '').trim();
            if (/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M$/.test(_txp)) {
                el.style.color = SLA;
                el.style.fontWeight = '700';
                el.style.textShadow = 'none';
            }
        }
        // Lighten any dark surface, keeping its hue, tinted cream.
        if (!el.dataset.tgLightened && bgIsDark) {
            el.style.backgroundColor = lighten(bg);
            el.dataset.tgLightened = '1';
            // Big surfaces (panels, cards) get the thin amber frame.
            // Small rows and buttons do not - they would turn
            // into a stack of boxes.
            if (el.offsetWidth >= 250 && el.offsetHeight >= 100) {
                el.style.outline = '1px solid rgba(224,123,42,0.28)';
                el.style.outlineOffset = '-1px';
            }
        }
        // v2.0 (light): NO inversion anywhere. Leaves render dark-on-light
        // natively, which is already the theme; a dark leaf is lightened
        // by the block above, and light text is flipped dark by the rule
        // below. (The dark theme inverted shadow-DOM leaves here.)
        // v2.5: pure-black native buttons (Transfer / Reply, Annotate,
        // Expand, Filter) stayed black - the fixer only lightens DARK
        // surfaces, and the CSS button rule has no !important on purpose
        // (the response bars keep their inline colours). Give black
        // buttons the warm tan treatment inline, bars excluded by inBar().
        if (tag === 'BUTTON' && !el.dataset.tgLightened && bg && bg.a >= 0.6 &&
            bg.r < 30 && bg.g < 30 && bg.b < 30) {
            el.style.backgroundColor = '#f3e3c2';
            el.style.color = BODY_TEXT;
            el.style.borderColor = STEEL;
            el.dataset.tgLightened = '1';
        }
        // Flip light text to dark. Always safe when we just lightened this
        // element's own background. On a transparent background, only when
        // the text is NOT inside a custom element (whose shadow background
        // could be dark - flipping there would be dark-on-dark).
        if (tag !== 'A' && isLightText(fg) &&
            (bgIsDark || (isTransparentBg(bg) && !insideCustomEl(el)))) {
            el.style.color = BODY_TEXT;
        }
    }

    // Roots already watched, so each shadow root / frame gets one observer.
    var observedRoots = new Set();
    var injectedDocs = new WeakSet();
    var injectedRoots = new WeakSet();

    // v2.6, Lobby check: injectCss() only ever injected into a Document,
    // so a tr.caseDue (or a header, or a table head) inside an OPEN
    // shadow root never saw any of the stylesheet - the gradient, the
    // header brown, the thead brown, all of it. Inject the same stylesheet
    // into each shadow root once, guarded so it never doubles up.
    function injectCssIntoRoot(root) {
        if (!root || injectedRoots.has(root)) return;
        injectedRoots.add(root);
        try {
            var s = document.createElement('style');
            s.appendChild(document.createTextNode(css));
            root.appendChild(s);
        } catch (e) { /* some roots refuse children; the fixer covers them */ }
    }

    // v3.0: the two <kat-card> shadow roots inside #composer/#review
    // have no theme <style> inside - injectCssIntoRoot never reaches
    // them, because fixSubtree does not walk shadow trees it cannot
    // see into. Inject a small stylesheet with the theme colours
    // directly (v2.0 is light, so no pre-inversion colours anymore).
    var composerShadowCss = [
        ':host { background-color: #fffaf0 !important; color: #3a2415 !important; }',
        'input, textarea, select, button { background-color: #fffaf0 !important; color: #3a2415 !important; border-color: #8a6d4b !important; }',
        'h1, h2, h3, h4, h5 { color: #3a2415 !important; }',
        'a { color: #c85a17 !important; }'
    ].join('\n');
    var injectedComposerRoots = new WeakSet();
    function injectComposerShadowCss() {
        var boxes = document.querySelectorAll('#composer, #review');
        for (var i = 0; i < boxes.length; i++) {
            var all = boxes[i].querySelectorAll('*');
            for (var j = 0; j < all.length; j++) {
                var sr = all[j].shadowRoot;
                if (sr && !injectedComposerRoots.has(sr)) {
                    injectedComposerRoots.add(sr);
                    try {
                        var s = document.createElement('style');
                        s.appendChild(document.createTextNode(composerShadowCss));
                        sr.appendChild(s);
                    } catch (e) { /* some roots refuse children */ }
                }
            }
        }
    }

    // v3.1: the text-based passes (composer extras, Lobby chrome,
    // dim text) only ran from fixAll, so text that appears late - the
    // Page Translation line on the Lobby, the Lobby title bar - was
    // never themed. Re-run them (throttled) whenever the page changes.
    var lastStyleRun = 0;
    function runStylePasses() {
        var now = Date.now();
        if (now - lastStyleRun < 1000) return;
        lastStyleRun = now;
        styleComposerExtras();
        styleLobbyChrome();
        styleDimText();
    }

    // v3.3: the duration text may tick inside a nested element (a
    // span in the TD), not the TD itself - walk up to the nearest
    // TD/TH so the re-check lands on the cell, not on the span.
    function nearestCell(el) {
        while (el) {
            if (el.tagName === 'TD' || el.tagName === 'TH') return el;
            el = el.parentNode;
        }
        return null;
    }

    function handleMutations(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            if (m.type === 'childList') {
                for (var j = 0; j < m.addedNodes.length; j++) {
                    if (m.addedNodes[j].nodeType === 1 ||
                        m.addedNodes[j].nodeType === 11) fixSubtree(m.addedNodes[j]);
                }
                // v3.2: a text node added inside a TD/TH (a ticking SLA
                // duration, a late-filling cell) is skipped by fixSubtree
                // above, so re-check the cell itself.
                // v3.3: trace up to the nearest cell - the text may sit
                // in a nested span, and re-checking the span never
                // reaches the TD.
                var _cell = nearestCell(m.target);
                if (_cell) fixSubtree(_cell);
            } else if (m.type === 'characterData') {
                // v3.2: a duration ticking in place - re-check the cell
                // so one that just went negative goes cranberry.
                // v3.3: trace up to the nearest cell (see above).
                var _cell2 = m.target ? nearestCell(m.target.parentNode) : null;
                if (_cell2) fixSubtree(_cell2);
                else if (m.target && m.target.parentNode) fixSubtree(m.target.parentNode);
            } else {
                // A class/style change (e.g. a reply expanding) can reveal
                // content - re-check the whole subtree, not just the node.
                // Already-fixed nodes are skipped cheaply (tgChecked), and
                // every fix is idempotent, so this cannot loop.
                fixSubtree(m.target);
            }
        }
        runStylePasses();
    }

    function watchRoot(root) {
        if (!root || observedRoots.has(root) || !window.MutationObserver) return;
        observedRoots.add(root);
        try {
            new MutationObserver(handleMutations).observe(root, OBSERVE_OPTS);
        } catch (e) { /* some roots refuse observers; the interval covers them */ }
    }

    function fixSubtree(root) {
        var queue = [root], head = 0, processed = 0;
        while (head < queue.length && processed < MAX_PER_PASS) {
            var el = queue[head++];
            if (el.nodeType === 11) { // shadow root / document fragment
                injectCssIntoRoot(el);
                watchRoot(el);
                var fk = el.children;
                for (var i = 0; i < fk.length; i++) queue.push(fk[i]);
                continue;
            }
            if (el.nodeType !== 1) continue;
            // v2.7: THE v2.6 miss. A row is checked once, then Paragon
            // adds the due class / peach background afterwards (async
            // table load), and the fixer never re-ran it - fixSubtree
            // skips every already-checked node, and the 60s interval
            // re-ran fixAll but fixAll re-ran the same skip. So clear
            // the checked flag for any untreated due / SLA candidate,
            // and for any untreated TR/TD whose background has since
            // turned peach, so fixOne runs on it again on this pass.
            // Already-treated rows keep their dataset flags and are
            // left alone, so this cannot loop.
            if (el.dataset.tgChecked) {
                // v2.9 migration: a due cell painted by v2.7/v2.8
                // carries a per-cell gradient in its inline style.
                // Clear its flags so fixOne re-runs and makes it
                // transparent (row-wide wash only).
                if ((el.tagName === 'TD' || el.tagName === 'TH') &&
                    el.dataset.tgCaseDueCell && el.style && el.style.background &&
                    el.style.background.indexOf('gradient') !== -1 &&
                    isCaseDueRow(el)) {
                    delete el.dataset.tgCaseDueCell;
                    delete el.dataset.tgChecked;
                }
                var _cls7 = (el.className && typeof el.className === 'string') ? el.className : '';
                var _due7 = _cls7.indexOf('caseDue') !== -1 ||
                    _cls7.indexOf('overdue') !== -1 ||
                    _cls7.indexOf('sla-exceeded-status') !== -1 ||
                    isCaseDueRow(el);
                if (_due7 && !el.dataset.tgCaseDue && !el.dataset.tgSla && !el.dataset.tgCaseDueCell) {
                    delete el.dataset.tgChecked;
                } else if ((el.tagName === 'TR' || el.tagName === 'TD' || el.tagName === 'TH') &&
                    !el.dataset.tgPeach && !el.dataset.tgCaseDue && !el.dataset.tgCaseDueCell) {
                    try {
                        var _bg7 = parseRgb(getComputedStyle(el).backgroundColor);
                        if (isPeachBg(_bg7)) delete el.dataset.tgChecked;
                    } catch (e) { /* computed style unavailable; skip */ }
                }
                // v3.2: a due cell whose text has BECOME an SLA
                // indicator since it was first checked - the search
                // durations tick every second and cells can fill in
                // after the first pass - but which has no SLA flag
                // yet. Clear the checked flag so fixOne re-runs and
                // colours it cranberry. (The first pass may have run on an
                // empty or positive cell; the v3.0/v3.1 reports proved
                // the negative durations stayed light.)
                // v3.3: also re-run when the cell HAS the flag but has
                // no inline colour - a flag can survive a style reset
                // while the colour is lost. If the inline colour IS
                // set, the fixer did its job and something else is
                // overriding it, so leave it alone (re-running would
                // only churn the same style every pass).
                if ((el.tagName === 'TD' || el.tagName === 'TH') &&
                    isCaseDueRow(el) &&
                    isSlaCellText((el.textContent || '').trim()) &&
                    (!el.dataset.tgSla || !el.style.color)) {
                    delete el.dataset.tgSla;
                    delete el.dataset.tgChecked;
                }
                // v3.0: buttons and panels that were first seen while
                // their background was still transparent, then painted
                // dark later (Transfer/Reply buttons, Transfer box,
                // Contact Reason flo-box, uc-kat-button, notification
                // empty-state). Re-check only those candidates, so the
                // pass stays cheap; the CSS backstops above cover them
                // even if this misses.
                if (!el.dataset.tgLightened &&
                    (el.tagName === 'BUTTON' || el.tagName === 'KAT-BOX' ||
                     el.tagName === 'KAT-CARD' || el.tagName === 'PM-CARD' ||
                     (el.className && typeof el.className === 'string' &&
                      (el.className.indexOf('flo-box') !== -1 ||
                       el.className.indexOf('transfer-box') !== -1 ||
                       el.className.indexOf('uc-kat-button') !== -1 ||
                       el.className.indexOf('uc-notification-empty') !== -1)))) {
                    try {
                        var _bg3 = parseRgb(getComputedStyle(el).backgroundColor);
                        if (isDarkBg(_bg3) || isPeachBg(_bg3)) delete el.dataset.tgChecked;
                    } catch (e) { /* computed style unavailable; skip */ }
                }
            }
            if (!el.dataset.tgChecked) {
                fixOne(el);
                el.dataset.tgChecked = '1';
                processed++;
            }
            if (el.shadowRoot) {
                injectCssIntoRoot(el.shadowRoot);
                watchRoot(el.shadowRoot);
                queue.push(el.shadowRoot);
            }
            var kids = el.children;
            for (var j = 0; j < kids.length; j++) queue.push(kids[j]);
        }
    }

    function fixFrame(iframe) {
        var doc;
        try { doc = iframe.contentDocument; } catch (e) { return; }
        if (!doc || !doc.body || injectedDocs.has(doc)) return;
        injectedDocs.add(doc);
        try {
            injectCss(doc);
            fixSubtree(doc.body);
            watchRoot(doc.body);
        } catch (e) { /* cross-origin or not ready yet; retried by the interval */ }
    }

    /* ---- CloudFront widget iframes (v1.6) -----------------------------------
       Follow ups, Bookmarks and Contact Reason are iframes loading
       widget.html from d1u16vxl4h9h9c.cloudfront.net - a different origin,
       so the top page cannot reach inside them at all. This same script
       runs inside those frames (see @match) and themes them from within.
       The frame tells the top page it is themed via postMessage; if no
       message arrives within ~3s of the frame appearing (Tampermonkey
       could not inject into the sandboxed frame), the top page just gives
       the frame element a warm background - a white widget on a cream
       page is fine, and v2.0 never inverts anything. ------------------------ */
    var widgetInnerScriptWorks = false;
    var widgetFrameSeen = new WeakMap();

    window.addEventListener('message', function (e) {
        if (e.data && e.data.tgThemed === true &&
            typeof e.origin === 'string' &&
            e.origin.indexOf('.cloudfront.net') !== -1) {
            widgetInnerScriptWorks = true;
        }
    });

    function checkWidgetFrames() {
        if (widgetInnerScriptWorks) return;
        var now = Date.now();
        var frames = document.querySelectorAll('iframe[src*="cloudfront.net/widget.html"]');
        for (var i = 0; i < frames.length; i++) {
            var f = frames[i];
            if (f.dataset.tgFallback) continue;
            if (!widgetFrameSeen.has(f)) { widgetFrameSeen.set(f, now); continue; }
            if (now - widgetFrameSeen.get(f) > 3000) {
                // No inner script answered: warm the frame element
                // itself. The widget content stays the site's own
                // light default, which reads fine on cream.
                f.style.backgroundColor = SURFACE;
                f.dataset.tgFallback = '1';
            }
        }
    }

    // v2.5: inside the composer / review, Review must stand out from
    // Cancel and errors must read as errors. CSS cannot target a button
    // by its text, so do it here by label, with direct colours: pumpkin
    // background with cream text for Review, cranberry for errors.
    // Runs separately because fixOne never matches a button by its
    // label text.
    function buttonLabel(el) {
        var tx = (el.textContent || '').trim();
        if (tx) return tx;
        if (el.shadowRoot) return (el.shadowRoot.textContent || '').trim();
        return '';
    }
    function styleComposerExtras() {
        var boxes = document.querySelectorAll('#composer, #review');
        for (var i = 0; i < boxes.length; i++) {
            var btns = boxes[i].querySelectorAll('button, kat-button');
            for (var j = 0; j < btns.length; j++) {
                if (buttonLabel(btns[j]) === 'Review' && !btns[j].dataset.tgPrimary) {
                    btns[j].style.backgroundColor = '#c85a17';
                    btns[j].style.color = '#fffaf0';
                    btns[j].style.borderColor = '#c85a17';
                    btns[j].style.fontWeight = '700';
                    btns[j].dataset.tgPrimary = '1';
                }
            }
            var all = boxes[i].querySelectorAll('*');
            for (var k = 0; k < all.length; k++) {
                var tx2 = (all[k].textContent || '').trim();
                if (tx2.indexOf('Error:') === 0 && !all[k].dataset.tgError) {
                    all[k].style.color = '#b03a2e';
                    all[k].dataset.tgError = '1';
                }
            }
        }
    }

    // v3.0: the Page Translation line "Viewing in original language."
    // is a classless div in mid-grey (#555555) on cream - readable,
    // but the warm brown keeps the palette together. No selector can
    // reach it, so match it by its text.
    function styleDimText() {
        var els = document.querySelectorAll('div, span');
        for (var i = 0; i < els.length; i++) {
            var t = (els[i].textContent || '').trim();
            if (t === 'Viewing in original language.' && !els[i].dataset.tgDimText) {
                els[i].style.color = BODY_TEXT;
                els[i].dataset.tgDimText = '1';
            }
            // v3.1: the info-table toggle is dark teal (#008296) on
            // cream - readable, but give it the theme pumpkin. (The
            // info table itself is collapsed until this is clicked,
            // which is why the diagnostic never found its heading.)
            if ((t === 'Show all case and seller info' || t === 'Hide case and seller info') && !els[i].dataset.tgDimText) {
                els[i].style.color = AMBER;
                els[i].dataset.tgDimText = '1';
            }
        }
    }

    // v2.7: the Lobby header bar is still the site's grey on v2.6 - the
    // CSS 'header' rule never matched it, so it is not a <header>
    // element (its tag/class are not exposed to the browser tools, so
    // this is text-based instead). Find the LOBBY heading and theme
    // its bar, and find the "N Open Cases" title bar and theme it.
    function styleLobbyChrome() {
        var h = document.querySelector('h1');
        if (h && h.textContent.trim() === 'LOBBY' && !h.dataset.tgLobbyHead) {
            var bar = h.closest('header') || h.parentElement;
            if (bar) {
                bar.style.backgroundColor = '#f2e2bd';
                bar.style.borderBottom = '2px solid rgba(224,123,42,0.55)';
                var icons = bar.querySelectorAll('button, svg, i');
                for (var ii = 0; ii < icons.length; ii++) {
                    icons[ii].style.color = '#3a2415';
                }
            }
            h.dataset.tgLobbyHead = '1';
        }
        // v3.0: the exact regex never matched - the bar carries an
        // icon or extra node, so its textContent is more than "N Open
        // Cases". v3.1: still not found, so the count may sit in a
        // separate element with no whitespace ("25Open Cases") - match
        // "Open Cases" alone. Take the shortest element that contains it.
        // v3.2: still not found, so the casing may differ ("Open cases") - match case-insensitively, and allow a longer container (the bar may carry extra controls).
        if (!document.querySelector('[data-tg-open-cases]')) {
            var els = document.querySelectorAll('div, span, h2, h3');
            var best = null, bestLen = Infinity;
            for (var jj = 0; jj < els.length; jj++) {
                var _t = (els[jj].textContent || '');
                if (/open cases/i.test(_t) && _t.length < 200 && _t.length < bestLen) {
                    best = els[jj]; bestLen = _t.length;
                }
            }
            if (best) {
                best.style.backgroundColor = '#f2e2bd';
                best.style.color = '#3a2415';
                best.dataset.tgOpenCases = '1';
            }
        }
    }

    function fixAll() {
        styleComposerExtras();
        styleLobbyChrome();
        styleDimText();
        injectComposerShadowCss();
        if (document.body) fixSubtree(document.body);
        var frames = document.querySelectorAll('iframe');
        for (var i = 0; i < frames.length; i++) fixFrame(frames[i]);
        checkWidgetFrames();
    }

    /* ---- Clickable turkey (v2.2) -------------------------------------------
       The turkey is a real element now, not a body::after overlay, so it
       can be clicked - and it is only created on the main page. The old
       body::after version rendered inside every widget iframe too
       (Bookmarks, Contact Reason), because this
       script runs in those frames as well. Click the turkey for a
       Thanksgiving fact; click again for another one. ---------------------- */
    var TG_FACTS = [
        "The first Thanksgiving feast in 1621 lasted three days.",
        "Wild turkeys can fly up to 55 mph in short bursts.",
        "A turkey\u2019s wattle and snood turn bright red when it\u2019s excited.",
        "Benjamin Franklin preferred the turkey to the bald eagle \u2014 he called the eagle \u2018a bird of bad moral character.\u2019",
        "Turkeys can see almost 270 degrees around them.",
        "Male turkeys are called toms, females are hens, and babies are poults.",
        "A group of turkeys is called a flock \u2014 or a rafter.",
        "Turkeys have about 3,500 feathers.",
        "Abraham Lincoln made Thanksgiving a national holiday in 1863.",
        "Minnesota raises more turkeys than any other state.",
        "A turkey\u2019s gobble can be heard up to a mile away.",
        "The wishbone tradition is ancient \u2014 whoever breaks off the bigger piece gets a wish."
    ];
    var TG_GOBBLES = [
        "Gobble gobble!",
        "Gobble gobble gobble!",
        "Gobble! Gobble! Gobble!",
        "Gobble gobble... gobble?",
        "GOBBLE!",
        "Gluck gluck! Gobble!"
    ];
    var TG_CHEER = [
        "Happy Thanksgiving!",
        "Grateful for you today \u2014 yes, you!",
        "Pass the gravy!",
        "Save room for pie!",
        "Family, food, and football. That\u2019s the whole holiday.",
        "May your turkey be moist and your naps be long.",
        "Thankful for good people and good gravy.",
        "Eat, nap, repeat.",
        "Gobble \u2019til you wobble!",
        "There\u2019s always room for one more slice of pie.",
        "Warm wishes and full plates!",
        "Today we feast!"
    ];
    // One shuffled deck of everything - facts, gobbles, good wishes -
    // so nothing repeats until you have seen the whole lot. Feels
    // endless; it is 30 deep, then it reshuffles.
    var tgDeck = [];
    function tgNextItem() {
        if (tgDeck.length === 0) {
            tgDeck = TG_FACTS.concat(TG_GOBBLES, TG_CHEER);
            for (var i = tgDeck.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var t = tgDeck[i]; tgDeck[i] = tgDeck[j]; tgDeck[j] = t;
            }
        }
        return tgDeck.pop();
    }
    var tgFactTimer = null;
    function addTurkey() {
        // Main page only: widget iframes (Bookmarks, Contact Reason,
        // never get a turkey.
        if (window.parent !== window) return;
        if (!document.body || document.getElementById('tg-turkey')) return;
        var turkey = document.createElement('div');
        turkey.id = 'tg-turkey';
        turkey.title = 'Click to tickle the turkey';
        var fact = document.createElement('div');
        fact.id = 'tg-turkey-fact';
        fact.title = 'Click to hide';
        function showFact() {
            // Tickle: the turkey wiggles, then says something.
            turkey.classList.remove('tg-tickle');
            void turkey.offsetWidth;
            turkey.classList.add('tg-tickle');
            var item = tgNextItem();
            if (TG_FACTS.indexOf(item) !== -1 && Math.random() < 0.3) item += ' Gobble gobble!';
            fact.textContent = item;
            fact.classList.add('tg-show');
            if (tgFactTimer) clearTimeout(tgFactTimer);
            tgFactTimer = setTimeout(function () { fact.classList.remove('tg-show'); }, 8000);
        }
        turkey.addEventListener('click', showFact);
        fact.addEventListener('click', function () {
            fact.classList.remove('tg-show');
            if (tgFactTimer) clearTimeout(tgFactTimer);
        });
        document.body.appendChild(turkey);
        document.body.appendChild(fact);
    }

    function start() {
        fixAll();
        addTurkey();
        if (document.body && window.MutationObserver) {
            watchRoot(document.body);
        }
        // Safety net while Paragon finishes loading the page, then stop.
        // Runs two minutes (v2.7, was one): some panels (follow-ups,
        // sidebar, queue lists, the Lobby table) load late, and the
        // v2.7 re-check in fixSubtree only helps if a pass runs after
        // the due class / peach background appears.
        var ticks = 0;
        var timer = setInterval(function () {
            fixAll();
            if (++ticks >= 40) {
                clearInterval(timer);
                // v3.3: slow heartbeat after the fast safety net - the
                // search durations tick forever, rows can load late, and
                // a page kept open all day outlives the 2-minute net.
                // One fixAll every 30s is cheap (checked nodes skip).
                setInterval(fixAll, 30000);
            }
        }, 3000);
        // Panels that load when the tab is shown again.
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) fixAll();
        });
        // Inside a widget frame, tell the top page this frame is themed
        // from within, so the fallback stays off.
        if (window.parent !== window) {
            try { window.parent.postMessage({ tgThemed: true }, '*'); } catch (e) {}
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
