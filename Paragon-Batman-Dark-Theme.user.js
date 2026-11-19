// ==UserScript==
// @name         Paragon — Batman Dark Theme
// @namespace    http://tampermonkey.net/
// @updateURL    https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Paragon-Batman-Dark-Theme.user.js
// @downloadURL  https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Paragon-Batman-Dark-Theme.user.js
// @version      1.7
// @description  Batman theme for all of Paragon. Gotham palette throughout: near-black charcoal, bat yellow frames and data, warm off-white text, strong uppercase headings in the classic Batman Forever fan font (embedded, so it works offline). Restrained, no characters or quotes, nothing cartoonish. A fixer darkens every light surface (keeping its hue, tinted charcoal) and flips dark text to light - including collapsed content before it ever expands, so expanded follow-up replies stay readable. The reply composer and the review screen are inverted as one piece each (Kat's card/input/label backgrounds live in shadow DOM and are unreachable any other way), and nothing inside them is themed element by element. Also runs inside the CloudFront widget iframes (follow-ups, bookmarks, contact reason) and themes them from within, with an invert fallback if injection fails. Changes the look only - no buttons, text, or functions are touched. Toggle it on/off in Tampermonkey without affecting the response scripts. Do not install this and the Star Wars theme at the same time - they do the same job and will fight each other. Reopen/due rows get a bat-yellow wash that fades across the row, and their SLA-overdue times stay a flat bold yellow. The composer and review screens now render in the theme charcoal with readable text. The Reason Category and Reason Code dropdowns now match the theme instead of staying white. v1.6: the Lobby due rows and SLA times are themed (the overdue class, not caseDue), the white buttons and panels get CSS backstops and a late-paint re-check, the nav icons, pagination and active item are themed, the dim text lines are themed by their text, the composer kat-card shadow roots get a pre-inversion stylesheet, and ticking SLA durations are caught live with a 30-second heartbeat after the 2-minute net. v1.7: the Translation / CIA popovers, the search header, side nav, search-type card and info alert get CSS backstops and a late-paint re-check, the Lobby header check is case-insensitive, and label spans in shadow trees inherit.
// @author       J.T. Powers
// @match        https://paragon-na.amazon.com/*
// @match        https://d1u16vxl4h9h9c.cloudfront.net/widget.html*
// @match        https://*.cloudfront.net/widget.html*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    /* Gotham palette: near-black charcoal, bat yellow, warm off-white. */
    var GOTHAM_BG = '#0a0a0d';
    var SURFACE = '#141419';
    var BAR_BG = '#101014';
    var YELLOW = '#ffd500';
    var PALE_YELLOW = '#ffedb0';
    var BODY_TEXT = '#ece9e0';
    var STEEL = '#3d4450';

    var css = [
        /* Classic Batman font: the fan-made "Batman Forever"
           (BatmanForeverAlternate) - the closest match to the 1989/1995
           movie logo lettering. DC never released an official font. Embedded
           as base64 so it works offline, including inside the sandboxed
           widget iframes (no network fetch to be blocked). Free for
           personal use. Headings only. */
        '@font-face {',
        '  font-family: "BatmanForeverAlternate";',
        '  font-style: normal;',
        '  font-weight: 400;',
        '  font-display: swap;',
        '  src: url(data:font/woff;base64,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") format("woff");',
        '}',
        /* Near-black Gotham base + a faint bat-signal glow top-right and a
           few dim city lights, barely there. */
        'html, body {',
        '  background-color: ' + GOTHAM_BG + ' !important;',
        '  background-image:',
        '    radial-gradient(420px 220px at 88% 0%, rgba(255,213,0,0.07) 0%, transparent 70%),',
        '    radial-gradient(1px 1px at 12% 22%, rgba(255,213,0,0.5) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 68% 8%, rgba(255,255,255,0.4) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 84% 34%, rgba(255,213,0,0.35) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 32% 64%, rgba(255,255,255,0.35) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 52% 88%, rgba(255,213,0,0.4) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 94% 72%, rgba(255,255,255,0.3) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 4% 82%, rgba(255,213,0,0.35) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 44% 40%, rgba(255,255,255,0.25) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 76% 55%, rgba(255,213,0,0.3) 50%, transparent 51%) !important;',
        '  background-attachment: fixed !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        /* Gotham industrial: a strong clean sans, not a computer font. */
        '  font-family: "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif !important;',
        '}',
        ':root { color-scheme: dark; }',

        /* Bat-yellow sweep across the top, fading at the edges */
        'body::before {',
        '  content: "";',
        '  display: block;',
        '  height: 3px;',
        '  background: linear-gradient(90deg, transparent, ' + YELLOW + ' 30%, ' + YELLOW + ' 70%, transparent);',
        '}',

        /* Faint city grid over the page, like a Gotham blueprint.
           pointer-events none so it never blocks a click; below the
           response bars (z-index 9999) and barely visible (3%). */
        'body::after {',
        '  content: "";',
        '  position: fixed;',
        '  inset: 0;',
        '  pointer-events: none;',
        '  z-index: 9998;',
        '  background-image:',
        '    linear-gradient(rgba(255,213,0,0.03) 1px, transparent 1px),',
        '    linear-gradient(90deg, rgba(255,213,0,0.03) 1px, transparent 1px);',
        '  background-size: 48px 48px;',
        '}',

        /* Known Paragon hooks: correspondence text + main grid */
        '.body_RioZc { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '[class*="dvr-grid"] { background-color: transparent !important; }',

        /* Section header rows: dark shell, dotted yellow underline + yellow
           left edge (best effort - Paragon's header class may vary, so this
           is a bonus, not the fix) */
        '.header-row { background-color: ' + SURFACE + ' !important; border-bottom: 1px dotted rgba(255,213,0,0.45) !important; border-left: 3px solid ' + YELLOW + ' !important; }',

        /* Expanded detail areas (follow-up replies, etc.) get a yellow edge,
           like a case file tab - no layout change (inset shadow). */
        '[role="region"] { box-shadow: inset 2px 0 0 rgba(255,213,0,0.45) !important; }',

        /* The response bars belong to the theme now: dark shell, yellow underline.
           Only the bar containers - their buttons keep their inline colors. */
        '#tm-main-bar, #tm-tech-bar, #tm-auctions-bar {',
        '  background-color: ' + BAR_BG + ' !important;',
        '  border-bottom: 2px solid rgba(255,213,0,0.55) !important;',
        '  box-shadow: 0 2px 12px rgba(0,0,0,0.6) !important;',
        '}',
        '.tm-switch-tray, #tm-suggestion-line, #tm-tech-suggestion-line,',
        '#tm-report-footer, #tm-tech-report-footer {',
        '  background-color: ' + BAR_BG + ' !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        '}',

        /* Links go bat yellow, white on hover */
        'a { color: ' + YELLOW + ' !important; }',
        'a:hover { color: #ffffff !important; }',

        /* Headings in yellow, uppercase, bold and spaced, with a dotted
           yellow underline */
        'h1 { color: ' + YELLOW + ' !important; font-family: \'BatmanForeverAlternate\', \'Segoe UI\', system-ui, sans-serif !important; letter-spacing: 2px !important; text-transform: uppercase !important; font-weight: 400 !important; }',
        'h2, h3, h4, h5 { color: ' + PALE_YELLOW + ' !important; font-family: \'BatmanForeverAlternate\', \'Segoe UI\', system-ui, sans-serif !important; letter-spacing: 2px !important; text-transform: uppercase !important; font-weight: 400 !important; border-bottom: 1px dotted rgba(255,213,0,0.35) !important; }',

        /* Native Paragon buttons: dark charcoal with a steel border,
           yellow on hover. No !important here on purpose - the response bars
           set their button colors inline, and inline styles beat this, so
           the bars keep theirs. (The fixer below also darkens white
           buttons directly, inline.) */
        'button {',
        '  background-color: #17171c;',
        '  color: ' + BODY_TEXT + ';',
        '  border: 1px solid ' + STEEL + ';',
        '  border-radius: 6px;',
        '}',
        'button:hover { border-color: ' + YELLOW + '; color: ' + YELLOW + '; }',

        /* Dark form controls (reply box, dropdowns, search) */
        'input, textarea, select {',
        '  background-color: #14141a !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        '  border: 1px solid ' + STEEL + ' !important;',
        '}',
        'input:focus, textarea:focus, select:focus {',
        '  border-color: ' + YELLOW + ' !important;',
        '  outline: none !important;',
        '}',

        /* Tables: dark rows, faint borders, yellow headers; a yellow row
           highlight on hover for the queue lists on the other pages */
        'table { background-color: transparent !important; color: ' + BODY_TEXT + ' !important; }',
        'th { color: ' + YELLOW + ' !important; }',
        'td, th { border-color: #232830 !important; }',
        'tr:nth-child(even) td { background-color: rgba(255,213,0,0.02) !important; }',
        'tr:hover td { background-color: rgba(255,213,0,0.05) !important; }',

        /* Reopen / due rows (v1.2): a bat-yellow wash runs the whole row,
           strong at the left edge fading to the faint yellow tint at the
           right end. The gradient lives on the row itself (a per-cell
           gradient would restart at every cell), so the cells are
           transparent and the fixer stays off the row's background. The
           SLA-overdue times stay a flat bold yellow - no glow, it blurred
           the text. The class name carries an em-dash, so the SLA spans
           are matched by substring, not by class selector. These rules
           sit after the table rules so they win the ties. */
        'tr.caseDue { background: linear-gradient(to right, rgba(255,213,0,0.65) 0%, rgba(255,213,0,0.08) 100%) !important; }',
        'tr.caseDue td { background-color: transparent !important; }',
        'tr.caseDue:hover { background: linear-gradient(to right, rgba(255,213,0,0.75) 0%, rgba(255,213,0,0.14) 100%) !important; }',
        /* v1.6: Lobby due rows are lobby-case-followup-overdue, not
           caseDue (proven by J.T.'s pasted row HTML, 11/19) - the Star
           Wars theme needed the same patch (v2.8). The wash lives on
           the row, the cells are transparent, and the SLA cell's colour
           lives only in the fixer's inline style (a stylesheet
           !important colour would override it). */
        'tr.lobby-case-followup-overdue { background: linear-gradient(to right, rgba(255,213,0,0.65) 0%, rgba(255,213,0,0.08) 100%) !important; background-color: ' + SURFACE + ' !important; }',
        '/* v1.6: lobby due rows + SLA re-check */',
        'tr.lobby-case-followup-overdue td { background-color: transparent !important; }',
        'tr.lobby-case-followup-overdue:hover { background: linear-gradient(to right, rgba(255,213,0,0.75) 0%, rgba(255,213,0,0.14) 100%) !important; }',
        '[class*="sla-exceeded-status"] { color: ' + YELLOW + ' !important; font-weight: 700 !important; text-shadow: none !important; }',

        /* Inside the reply composer and the review screen the theme inverts
           the whole box instead of theming each element (Kat's card/input/
           label backgrounds live in shadow DOM and are unreachable). These
           rules put the ORIGINAL light colours back inside them, so the
           single inversion turns them dark. Nothing inside #composer or
           #review is themed element by element. */
        '#composer textarea, #review textarea, #composer input, #review input, #composer select, #review select {',
        '  background-color: #ffffff !important;',
        '  color: #232f3e !important;',
        '  border-color: #aab0b8 !important;',
        '}',
        /* Composer links, focus rings and button hovers (v1.5): these were
           Amazon blue (#0066c0, rendering #51b7ff) - the one blue left in
           the file, carried over from the Star Wars build. Now they use
           the pre-inversion colour #3d1d00, which renders as pale gold
           #f9d9bc - the closest the invert+rotate matrix gets to bat
           yellow (the best match for #ffd500 renders orange, so pale
           gold wins). */
        '#composer input:focus, #review input:focus, #composer textarea:focus, #review textarea:focus, #composer select:focus, #review select:focus {',
        '  border-color: #3d1d00 !important;',
        '}',
        '#composer button, #review button {',
        '  background-color: #ffffff !important;',
        '  color: #232f3e !important;',
        '  border-color: #aab0b8 !important;',
        '}',
        '#composer button:hover, #review button:hover { border-color: #3d1d00 !important; color: #3d1d00 !important; }',
        '#composer h1, #review h1, #composer h2, #review h2, #composer h3, #review h3, #composer h4, #review h4, #composer h5, #review h5 {',
        '  color: #232f3e !important;',
        '  border-bottom-color: transparent !important;',
        '}',
        '#composer a, #review a { color: #3d1d00 !important; }',
        '#composer ::-webkit-scrollbar-track, #review ::-webkit-scrollbar-track { background: #ffffff !important; }',
        '#composer ::-webkit-scrollbar-thumb, #review ::-webkit-scrollbar-thumb { background: #aab0b8 !important; }',

        /* Composer / review readability (v1.3): the inverted box came out
           black instead of the theme charcoal, and text that inherited the
           theme's light body colour inverted to dark-on-dark. So inside
           #composer / #review everything is forced dark pre-inversion
           (which renders light), placeholders get a readable mid-grey at
           full opacity, and the box and card get their background from the
           exact pre-inversion colour of the theme surface (#eaeaef renders
           as #141419 through invert + hue-rotate), so they render charcoal.
           The #composer a rule still wins for links (higher specificity). */
        '#composer, #review { background: #eaeaef !important; }',
        '#composer kat-card, #review kat-card { background: #eaeaef !important; }',
        '#composer *, #review * { color: #232f3e !important; }',
        '#composer textarea::placeholder, #composer input::placeholder, #review textarea::placeholder, #review input::placeholder { color: #757575 !important; opacity: 1 !important; }',

        /* Dropdowns (v1.4): the Reason Category / Reason Code boxes stayed
           white. Their light-DOM parts get the theme surface - as the
           pre-inversion colour inside the inverted composer/review (renders
           charcoal), and as the surface directly everywhere else in Paragon
           (the scoped rule wins inside by specificity). Text inside the
           header inherits the light colour outside; inside, the #composer *
           rule already forces it dark pre-inversion (renders light). */
        '#composer .kat-select-container, #review .kat-select-container, #composer .select-header, #review .select-header, #composer .select-options, #review .select-options { background: #eaeaef !important; }',
        '.kat-select-container, .select-header, .select-options { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.select-header .header-row-text, .select-header kat-icon, .select-header i { color: inherit !important; }',
        '.select-options .option-inner-container { background-color: transparent !important; }',

        /* v1.6, from the Star Wars v3.0 reports: the Transfer / Reply /
           Annotate buttons stayed white with light text - the site's
           .tertiary/.link class rule beats the plain 'button' rule, and
           the fixer had marked them checked while transparent. Scoped
           to those classes only, so the response bars' classless buttons
           keep their inline colours. */
        'button.tertiary, button.link, kat-button[variant="tertiary"], kat-button[variant="link"] {',
        '  background-color: ' + BAR_BG + ' !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        '  border: 1px solid ' + STEEL + ' !important;',
        '}',
        'button.tertiary:hover, button.link:hover { border-color: ' + YELLOW + ' !important; color: ' + YELLOW + ' !important; }',
        /* Inside the inverted composer/review the pre-inversion rule
           above still wins (higher specificity), so composer buttons
           keep rendering charcoal, not the bar charcoal. */
        '#composer button.tertiary, #review button.tertiary, #composer button.link, #review button.link { background-color: #eaeaef !important; color: #232f3e !important; }',

        /* v1.6: the Transfer panel, the Contact Reason panel, the
           notification empty-state and the uc-kat-button stayed white -
           same late-paint cause as the buttons above, so the same
           backstop: theme them directly in CSS. */
        '.transfer-box { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.flo-box { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.flo-box .ng-binding, .flo-box h3, .flo-box h4 { color: ' + BODY_TEXT + ' !important; }',
        '.uc-kat-button { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.uc-notification-empty { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',

        /* v1.6: Bootstrap's active list item and page link are light
           text on bright blue (#007bff). The active state becomes bat
           yellow with dark text; the rest of the pager goes charcoal. */
        '.list-group-item.active, .page-item.active .page-link { background-color: ' + YELLOW + ' !important; border-color: ' + YELLOW + ' !important; color: #141419 !important; }',
        '.pagination .page-link, a.page-link { background-color: ' + BAR_BG + ' !important; color: ' + YELLOW + ' !important; border-color: ' + STEEL + ' !important; }',

        /* v1.6: the nav user line and the Lobby table / pagination icons
           are dark teal on charcoal. The navItem class is CSS-module
           hashed, so match by substring; the icon font is <i> throughout
           Paragon. Inside #composer/#review the '#composer *' rule wins
           by specificity, so this never touches the inverted composer. */
        'nav [class*="navItem"], aside [class*="navItem"], [role="navigation"] [class*="navItem"] { color: ' + BODY_TEXT + ' !important; }',
        'i { color: ' + BODY_TEXT + ' !important; }',
        '[class*="page-"].selected { color: ' + BODY_TEXT + ' !important; }',

        /* v1.6, from the Star Wars v3.1 case-page report: the theme
           darkened the Transfer box and the notification empty-state,
           but their labels kept the dark site colour on charcoal. The
           fixer will not flip those - it skips text inside custom
           elements when the background is transparent - so the labels
           get light text directly here. Same reason for the label spans
           inside buttons: they carry their own dark colour, so they
           inherit the button's. */
        '.transfer-box span { color: ' + BODY_TEXT + ' !important; }',
        '.uc-notification-empty * { color: ' + BODY_TEXT + ' !important; }',
        'button span, button .text, kat-button span, kat-button .text { color: inherit !important; }',

        /* v1.6: the recipient email chip in the composer/review is dark
           text on a dark chip - both render light through the inversion,
           so it stays unreadable. Give it pre-inversion colours: dark
           chip renders light, light text renders charcoal. */
        '#composer .default, #review .default { background-color: #232f3e !important; color: #eaeaef !important; }',

        /* v1.7, from the three v1.6 reports: the Translation / CIA
           popovers stayed white with light text - kat-popover-content
           floats outside the composer and paints late, and a container
           is never inverted, so theme it directly in CSS. On the search
           page the header, side nav, search-type card and "No results
           found" alert all stayed white for the same late-paint reason
           (the fixer had seen them transparent). The header is mid-grey
           on the Lobby and case pages and white on search - theme it
           directly instead of relying on the text match. */
        'kat-popover-content { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        'header.header_hUoWj { background-color: ' + BAR_BG + ' !important; }',
        'nav.sidenav_qcqYI { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '#content-type-selector { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.alert-info { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        /* v1.7: inside a shadow root, 'kat-button span' cannot match -
           the host is outside the tree - so label spans in shadow trees
           inherit their parent's colour. Inert at top level (:host
           matches nothing outside a shadow tree); active in the
           stylesheet injected into open shadow roots. The "Annotation"
           label stayed dark teal, likely inside such a tree. */
        ':host span.text { color: inherit !important; }',

        /* Dark scrollbars */
        '::-webkit-scrollbar { width: 10px; height: 10px; }',
        '::-webkit-scrollbar-track { background: ' + GOTHAM_BG + '; }',
        '::-webkit-scrollbar-thumb { background: ' + STEEL + '; border-radius: 5px; }',
        '::-webkit-scrollbar-thumb:hover { background: ' + YELLOW + '; }'
    ].join('\n');

    function injectCss(doc) {
        var style = doc.createElement('style');
        style.type = 'text/css';
        style.appendChild(doc.createTextNode(css));
        (doc.head || doc.documentElement).appendChild(style);
    }

    injectCss(document);

    /* ---- Light-surface fixer ----------------------------------------------
       Darkens EVERY light surface, keeping its hue and tinted charcoal
       (white goes dark grey, the green follow-up rows go dark slate-green,
       the yellow warning goes dark amber) so the meaning of the colours is
       kept. Big darkened surfaces (panels, cards) also get a thin yellow
       frame. Dark text on those surfaces flips to light; links keep their
       yellow. The response bars are never touched.
       The rules, learned the hard way: the fixer
       themes hidden content too (expanded replies stay readable), an
       inverted element's whole subtree is left alone (the ancestor's filter
       themes it - touching anything inside would undo the inversion), only
       LEAF Kat components (buttons, checkboxes, labels, icons, spinners,
       dividers, status indicators) are ever inverted - never a container
       (kat-box, kat-card, kat-radiobutton, kat-input, ...). The reply
       composer (#composer) and the review screen (#review) are the two
       containers inverted as a whole, because Kat's card/input backgrounds
       are unreachable any other way, and the CSS above restores the
       original light colours inside them so the single inversion turns
       them dark. Walks into open shadow roots and same-origin iframes, and
       inverts closed-shadow hosts it cannot reach into. Every node is
       checked once (batChecked) so deep nodes are never missed by a
       per-pass cap. -------------------------------------------------------- */
    var LIGHT_TEXT = BODY_TEXT;
    var MAX_PER_PASS = 20000;
    var OBSERVE_OPTS = {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ['style', 'class'],
        // v1.6: the SLA-remaining durations tick every second by
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

    function isLightBg(c) {
        return c && c.a >= 0.6 && c.r >= 200 && c.g >= 200 && c.b >= 200;
    }

    function isTransparentBg(c) {
        return !c || c.a < 0.1;
    }

    function isDarkText(c) {
        return c && luminance(c) < 0.5;
    }

    // Darken keeping the hue, tinted toward charcoal so surfaces sit on the
    // near-black page instead of reading grey.
    function darken(c) {
        function d(v, tint) { return Math.min(255, Math.round(v * 0.22 + tint)); }
        return 'rgb(' + d(c.r, 7) + ', ' + d(c.g, 7) + ', ' + d(c.b, 8) + ')';
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

    // True when a custom element shows nothing in the light DOM (its UI
    // lives in shadow DOM). The Kat checkbox carries a hidden 0x0 slot
    // span, so "no children" is not enough - children must have size.
    function hasVisibleLightDom(el) {
        var kids = el.children;
        for (var i = 0; i < kids.length; i++) {
            var r = kids[i].getBoundingClientRect();
            if (r.width > 0 && r.height > 0) return true;
        }
        return false;
    }

    // Safety net for when a container is inverted after some of its
    // descendants were already themed: strip the fixer's own inline
    // theming from the light-DOM descendants so the single inversion is
    // the only treatment they get.
    function unthemeDescendants(el) {
        var themed = el.querySelectorAll('[data-bat-darkened], [data-bat-inverted]');
        for (var i = 0; i < themed.length; i++) {
            var t = themed[i];
            t.style.backgroundColor = '';
            t.style.color = '';
            t.style.filter = '';
            t.style.outline = '';
            t.style.outlineOffset = '';
            delete t.dataset.batDarkened;
            delete t.dataset.batInverted;
        }
    }

    // v1.6, Lobby check (Star Wars v2.6): Paragon's due-row wash is pale
    // peach/salmon (~#f8b090: r 248, g 176, b 144). isLightBg() misses it
    // because green is < 200, so the fixer left it peach with white text
    // on top - unreadable. Detect that wash directly as a safety net.
    function isPeachBg(c) {
        return c && c.a >= 0.6 && c.r >= 230 && c.g >= 130 && c.g < 205 && c.b >= 90 && c.b < 180;
    }
    // v1.6 (Star Wars v2.8): Lobby due rows are
    // <tr class="lobby-case-followup-overdue">, NOT tr.caseDue - so match
    // 'overdue' as well as 'caseDue', on the element itself and on its
    // enclosing <tr>. The SLA is a plain <td> with no class, so it is
    // caught by the TD branch in fixOne, not by class.
    // A due cell whose whole text is an SLA indicator - a long date with
    // a time, or a negative SLA-remaining duration. Shared by the TD
    // branch (first pass) and the re-check (late text).
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

    // v1.6 (Star Wars v3.3): the duration text may tick inside a nested
    // element (a span in the TD), not the TD itself - walk up to the
    // nearest TD/TH so the re-check lands on the cell, not on the span.
    function nearestCell(el) {
        while (el) {
            if (el.tagName === 'TD' || el.tagName === 'TH') return el;
            el = el.parentNode;
        }
        return null;
    }

    function fixOne(el) {
        if (!el || el.nodeType !== 1) return;
        var tag = el.tagName;
        if (tag === 'HTML' || tag === 'BODY' || tag === 'HEAD' || tag === 'STYLE' ||
            tag === 'SCRIPT' || tag === 'INPUT' ||
            tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'OPTION') return;
        if (inBar(el)) return;
        // Reopen / SLA-overdue markers (v1.2): the CSS gives them the
        // bat-yellow treatment, so the fixer must not flip their yellow
        // text pale or darken them into mud. The class name carries an
        // em-dash, so match by substring.
        if (el.className && typeof el.className === 'string' &&
            el.className.indexOf('sla-exceeded-status') !== -1) return;
        // v1.6: a due/reopen row gets the wash INLINE, for the same
        // shadow-DOM reason - the stylesheet gradient cannot reach it
        // there. Cells are handled below (transparent, text flipped
        // light if it was dark).
        if (tag === 'TR' && isCaseDueRow(el)) {
            if (!el.dataset.batCaseDue) {
                el.style.background = 'linear-gradient(to right, rgba(255,213,0,0.65) 0%, rgba(255,213,0,0.08) 100%)';
                el.style.backgroundColor = SURFACE;
                el.dataset.batCaseDue = '1';
            }
            return;
        }
        // v1.6: a cell inside a due row - force transparent so the row
        // wash shows, and flip dark text light. The wash lives on the
        // TR and fades ONCE across the whole row; cells are transparent
        // so it shows through (a per-cell gradient would restart at
        // every cell - a repeating sawtooth fade).
        if ((tag === 'TD' || tag === 'TH') && isCaseDueRow(el)) {
            el.style.background = 'none';
            el.style.backgroundColor = 'transparent';
            el.dataset.batCaseDueCell = '1';
            // On the Lobby the SLA is a plain cell, not a span. A due
            // cell whose whole text is a date WITH a time is the SLA
            // cell; the Created cell has a date but no time, so it does
            // not match. On search pages the SLA-remaining column shows
            // a duration - "(+12:20:59)" still has time, "(-03:16:54)"
            // is breached, so only the negative one goes yellow. The
            // date regex is deliberately NOT extended to the numeric
            // search format - every search cell has a time, so it would
            // also colour the Created cell; the sla-exceeded-status
            // spans already carry the SLA colour on search pages.
            var _tx0 = (el.textContent || '').trim();
            if (isSlaCellText(_tx0)) {
                el.dataset.batSla = '1';
                el.style.color = YELLOW;
                el.style.fontWeight = '700';
                el.style.textShadow = 'none';
            } else {
                var _cs0 = getComputedStyle(el);
                var _fg0 = parseRgb(_cs0.color);
                if (isDarkText(_fg0)) el.style.color = LIGHT_TEXT;
            }
            return;
        }
        // v1.6: a container that was inverted while empty (no children
        // yet, so the leaf test passed) and has since filled - e.g. the
        // Contact Reason pm-card - must be un-inverted, or its children
        // render backwards (black panel, white dropdowns). Composer and
        // review are the intentional exceptions and keep their inversion.
        if (el.dataset.batInverted && el.id !== 'composer' && el.id !== 'review' &&
            /CARD|PANEL|MODAL|POPOVER|WIDGET/.test(tag) && hasVisibleLightDom(el)) {
            el.style.filter = '';
            delete el.dataset.batInverted;
            // fall through and theme it normally below
        }
        // Inside an inverted element, do nothing at all: the ancestor's
        // filter themes the whole subtree, and darkening, flipping or
        // inverting anything inside would undo it. (closest includes the
        // element itself, so an already-inverted element is a no-op here.)
        if (el.closest && el.closest('[data-bat-inverted]')) return;
        // The reply composer and the review screen are inverted as one
        // piece each (Kat's card/input backgrounds are unreachable any
        // other way). Nothing inside them is themed element by element -
        // see the #composer / #review CSS above.
        if (el.id === 'composer' || el.id === 'review') {
            if (!el.dataset.batInverted) {
                el.style.filter = 'invert(1) hue-rotate(180deg)';
                el.dataset.batInverted = '1';
                unthemeDescendants(el);
            }
            return;
        }
        // Inside the composer or the review screen (before it is inverted,
        // or if it is reached through another path): never theme element
        // by element.
        if (el.closest && el.closest('#composer, #review')) return;
        // NOTE: no visibility skip here on purpose. Collapsed content
        // (expanded replies, hidden panels) has no boxes yet, but its
        // computed styles are still readable - theme it now so it is
        // already right when it opens.
        var cs = getComputedStyle(el);
        var bg = parseRgb(cs.backgroundColor);
        var fg = parseRgb(cs.color);
        var bgIsLight = isLightBg(bg);
        // v1.6: peach wash with no caseDue class in reach - treat it as
        // a due row anyway: charcoal underneath, text light.
        if (isPeachBg(bg) && !el.dataset.batPeach) {
            el.style.backgroundColor = SURFACE;
            if (isDarkText(fg) || fg) el.style.color = LIGHT_TEXT;
            el.dataset.batPeach = '1';
            el.dataset.batDarkened = '1';
            // Peach SLA cell - same date-with-time test as above.
            var _txp = (el.textContent || '').trim();
            if (SLA_DATE_RE.test(_txp)) {
                el.style.color = YELLOW;
                el.style.fontWeight = '700';
                el.style.textShadow = 'none';
            }
        }
        // Darken any light surface, keeping its hue, tinted charcoal.
        if (!el.dataset.batDarkened && bgIsLight) {
            el.style.backgroundColor = darken(bg);
            el.dataset.batDarkened = '1';
            // Big surfaces (panels, cards) get the thin yellow frame.
            // Small rows and buttons do not - they would turn into a
            // stack of boxes.
            if (el.offsetWidth >= 250 && el.offsetHeight >= 100) {
                el.style.outline = '1px solid rgba(255,213,0,0.30)';
                el.style.outlineOffset = '-1px';
            }
        }
        // Inverted leaves only. A custom element whose UI lives in shadow
        // DOM (possibly closed) cannot be reached, so invert the host and
        // hue-rotate the colours back - but ONLY for leaves. Inverting a
        // container (kat-box, kat-card, kat-radiobutton, kat-input, ...)
        // would also invert every element the fixer already themed inside
        // it, flipping dark backgrounds back to light and light text back
        // to dark. Kat buttons only when transparent (tertiary / link -
        // the Edit/Resolve buttons); a primary button has its own coloured
        // background and must not be inverted.
        var invertOk = false;
        if (tag === 'KAT-BUTTON') {
            var v = el.getAttribute('variant');
            invertOk = (v === 'tertiary' || v === 'link') && !hasVisibleLightDom(el);
        } else if (tag === 'KAT-CHECKBOX' || tag === 'KAT-RADIO') {
            invertOk = !hasVisibleLightDom(el);
        } else if (tag === 'KAT-LABEL' || tag === 'KAT-SPINNER' ||
                   tag === 'KAT-STATUSINDICATOR' || tag === 'KAT-DIVIDER' ||
                   tag === 'KAT-ICON') {
            // Their text/dots live in shadow DOM or in light DOM the fixer
            // cannot flip (inside a custom element), so invert regardless
            // of visible children.
            invertOk = true;
        } else if (tag.indexOf('KAT-') !== 0 && tag.indexOf('-') !== -1) {
            // Non-Kat custom element: only when it is a true leaf - no
            // light-DOM children and no text (closed-shadow host).
            invertOk = (el.children.length === 0 && el.textContent.trim() === '');
        }
        if (invertOk && !el.dataset.batInverted &&
            (isTransparentBg(bg) || bgIsLight)) {
            el.style.filter = 'invert(1) hue-rotate(180deg)';
            el.dataset.batInverted = '1';
        }
        // Flip dark text to light. Always safe when we just darkened this
        // element's own background. On a transparent background, only when
        // the text is NOT inside a custom element (whose shadow background
        // is probably still white - flipping there would be light-on-white).
        if (tag !== 'A' && isDarkText(fg) &&
            (bgIsLight || (isTransparentBg(bg) && !insideCustomEl(el)))) {
            el.style.color = LIGHT_TEXT;
        }
    }

    // Roots already watched, so each shadow root / frame gets one observer.
    var observedRoots = new Set();
    var injectedDocs = new WeakSet();

    function handleMutations(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            if (m.type === 'childList') {
                for (var j = 0; j < m.addedNodes.length; j++) {
                    if (m.addedNodes[j].nodeType === 1 ||
                        m.addedNodes[j].nodeType === 11) fixSubtree(m.addedNodes[j]);
                }
                // v1.6: a text node added inside a TD/TH (a ticking SLA
                // duration, a late-filling cell) is skipped by fixSubtree
                // above, so re-check the cell itself - traced up to the
                // nearest cell, since the text may sit in a nested span
                // and re-checking the span never reaches the TD.
                var _cell = nearestCell(m.target);
                if (_cell) fixSubtree(_cell);
            } else if (m.type === 'characterData') {
                // v1.6: a duration ticking in place - re-check the cell
                // so one that just went negative goes yellow.
                var _cell2 = m.target ? nearestCell(m.target.parentNode) : null;
                if (_cell2) fixSubtree(_cell2);
                else if (m.target && m.target.parentNode) fixSubtree(m.target.parentNode);
            } else {
                // A class/style change (e.g. a reply expanding) can reveal
                // content - re-check the whole subtree, not just the node.
                // Already-fixed nodes are skipped cheaply (batChecked), and
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
                watchRoot(el);
                var fk = el.children;
                for (var i = 0; i < fk.length; i++) queue.push(fk[i]);
                continue;
            }
            if (el.nodeType !== 1) continue;
            // Never theme inside the inverted composer or review screen -
            // not even their shadow trees (closest() cannot see across a
            // shadow boundary).
            if (el.id !== 'composer' && el.id !== 'review' && el.closest && el.closest('#composer, #review')) continue;
            // v1.6: re-checks, ported from the Star Wars theme (v2.7 /
            // v3.0 / v3.2 / v3.3). A row is checked once, then Paragon
            // adds the due class / peach background afterwards, and the
            // fixer never re-ran it - fixSubtree skips already-checked
            // nodes. Clear the checked flag for any untreated due / SLA
            // candidate, and for any untreated TR/TD whose background
            // has since turned peach, so fixOne runs on it again on
            // this pass. Already-treated rows keep their flags and are
            // left alone, so this cannot loop.
            if (el.dataset.batChecked) {
                if (el.dataset.batInverted && el.id !== 'composer' && el.id !== 'review' &&
                    /CARD|PANEL|MODAL|POPOVER|WIDGET/.test(el.tagName) && hasVisibleLightDom(el)) {
                    el.style.filter = '';
                    delete el.dataset.batInverted;
                    delete el.dataset.batChecked;
                }
                var _cls7 = (el.className && typeof el.className === 'string') ? el.className : '';
                var _due7 = _cls7.indexOf('caseDue') !== -1 ||
                    _cls7.indexOf('overdue') !== -1 ||
                    _cls7.indexOf('sla-exceeded-status') !== -1 ||
                    isCaseDueRow(el);
                if (_due7 && !el.dataset.batCaseDue && !el.dataset.batSla && !el.dataset.batCaseDueCell) {
                    delete el.dataset.batChecked;
                } else if ((el.tagName === 'TR' || el.tagName === 'TD' || el.tagName === 'TH') &&
                    !el.dataset.batPeach && !el.dataset.batCaseDue && !el.dataset.batCaseDueCell) {
                    try {
                        var _bg7 = parseRgb(getComputedStyle(el).backgroundColor);
                        if (isPeachBg(_bg7)) delete el.dataset.batChecked;
                    } catch (e) { /* computed style unavailable; skip */ }
                }
                // A due cell whose text has BECOME an SLA indicator since
                // it was first checked (ticking durations, late-filling
                // cells) - or one that has the flag but lost its inline
                // colour. Clear the flags so fixOne re-runs and colours
                // it yellow. If the inline colour IS set, the fixer did
                // its job and re-running would only churn, so leave it.
                if ((el.tagName === 'TD' || el.tagName === 'TH') &&
                    isCaseDueRow(el) &&
                    isSlaCellText((el.textContent || '').trim()) &&
                    (!el.dataset.batSla || !el.style.color)) {
                    delete el.dataset.batSla;
                    delete el.dataset.batChecked;
                }
                // Buttons and panels first seen while transparent, then
                // painted white later (Transfer/Reply buttons, Transfer
                // box, Contact Reason flo-box, uc-kat-button,
                // notification empty-state). Re-check only those
                // candidates; the CSS backstops cover them even if this
                // misses.
                // v1.7: the search header, side nav, popovers, cards and
                // alerts paint white late for the same reason - add them
                // as candidates (tag/class checks are cheap; only
                // candidates pay for a computed-style read).
                if (!el.dataset.batDarkened && !el.dataset.batInverted &&
                    (el.tagName === 'BUTTON' || el.tagName === 'KAT-BOX' ||
                     el.tagName === 'KAT-CARD' || el.tagName === 'PM-CARD' ||
                     el.tagName === 'HEADER' || el.tagName === 'NAV' ||
                     el.tagName === 'KAT-POPOVER-CONTENT' ||
                     (el.className && typeof el.className === 'string' &&
                      (el.className.indexOf('flo-box') !== -1 ||
                       el.className.indexOf('transfer-box') !== -1 ||
                       el.className.indexOf('uc-kat-button') !== -1 ||
                       el.className.indexOf('uc-notification-empty') !== -1 ||
                       el.className.indexOf('card') !== -1 ||
                       el.className.indexOf('alert') !== -1)))) {
                    try {
                        var _bg3 = parseRgb(getComputedStyle(el).backgroundColor);
                        if (isLightBg(_bg3) || isPeachBg(_bg3)) delete el.dataset.batChecked;
                    } catch (e) { /* computed style unavailable; skip */ }
                }
            }
            if (!el.dataset.batChecked) {
                fixOne(el);
                el.dataset.batChecked = '1';
                processed++;
            }
            // The composer / review screen is inverted as one piece: do
            // not walk into it.
            if (el.id === 'composer' || el.id === 'review') continue;
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

    /* ---- CloudFront widget iframes -----------------------------------------
       Follow ups, Bookmarks and Contact Reason are iframes loading
       widget.html from d1u16vxl4h9h9c.cloudfront.net - a different origin,
       so the top page cannot reach inside them at all. This same script
       runs inside those frames (see @match) and themes them from within.
       The frame tells the top page it is themed via postMessage; if no
       message arrives within ~3s of the frame appearing (Tampermonkey
       could not inject into the sandboxed frame), the top page darkens
       it by inverting the frame element instead. The message guarantees
       the two never stack into a double inversion. -------------------------- */
    var widgetInnerScriptWorks = false;
    var widgetFrameSeen = new WeakMap();

    window.addEventListener('message', function (e) {
        if (e.data && e.data.batThemed === true &&
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
            if (f.dataset.batInverted) continue;
            if (!widgetFrameSeen.has(f)) { widgetFrameSeen.set(f, now); continue; }
            if (now - widgetFrameSeen.get(f) > 3000) {
                // No inner script answered: darken by inverting the frame.
                f.style.filter = 'invert(1) hue-rotate(180deg)';
                f.dataset.batInverted = '1';
            }
        }
    }

    var injectedRoots = new WeakSet();
    function injectCssIntoRoot(root) {
        if (!root || injectedRoots.has(root)) return;
        injectedRoots.add(root);
        try {
            var s = document.createElement('style');
            s.appendChild(document.createTextNode(css));
            root.appendChild(s);
        } catch (e) { /* some roots refuse children; the fixer covers them */ }
    }

    // v1.6: the <kat-card> shadow roots inside #composer/#review have no
    // theme <style> inside - fixSubtree never walks into the inverted
    // composer, so injectCssIntoRoot never reaches them. Inject a small
    // stylesheet with PRE-inversion colours (the ancestor filter inverts
    // them): #eaeaef renders as the theme surface, #232f3e renders as
    // light text, #3d1d00 renders as pale gold.
    var composerShadowCss = [
        ':host { background-color: #eaeaef !important; color: #232f3e !important; }',
        'input, textarea, select, button { background-color: #eaeaef !important; color: #232f3e !important; border-color: #232f3e !important; }',
        'h1, h2, h3, h4, h5 { color: #232f3e !important; }',
        'a { color: #3d1d00 !important; }'
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

    // v1.6: the text-based passes only ran from fixAll, so text that
    // appears late - the Page Translation line on the Lobby, the Lobby
    // title bar - was never themed. Re-run them (throttled) whenever
    // the page changes.
    var lastStyleRun = 0;
    function runStylePasses() {
        var now = Date.now();
        if (now - lastStyleRun < 1000) return;
        lastStyleRun = now;
        styleComposerExtras();
        styleLobbyChrome();
        styleDimText();
    }

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
                // The Review button is the primary action. These are
                // PRE-inversion colours: #3d1d00 renders pale gold,
                // #eaeaef renders charcoal, so the button reads as pale
                // gold with dark text - the Batman composer accent.
                if (buttonLabel(btns[j]) === 'Review' && !btns[j].dataset.batPrimary) {
                    btns[j].style.backgroundColor = '#3d1d00';
                    btns[j].style.color = '#eaeaef';
                    btns[j].style.borderColor = '#3d1d00';
                    btns[j].style.fontWeight = '700';
                    btns[j].dataset.batPrimary = '1';
                }
            }
            var all = boxes[i].querySelectorAll('*');
            for (var k = 0; k < all.length; k++) {
                var tx2 = (all[k].textContent || '').trim();
                if (tx2.indexOf('Error:') === 0 && !all[k].dataset.batError) {
                    all[k].style.color = '#ff6550';
                    all[k].dataset.batError = '1';
                }
            }
        }
    }

    // v1.6: the Page Translation line "Viewing in original language."
    // is a classless div in mid-grey on charcoal. No selector can reach
    // it, so match it by its text. The info-table toggle gets bat
    // yellow. (The info table itself is collapsed until this is
    // clicked, which is why the diagnostic never found its heading.)
    function styleDimText() {
        var els = document.querySelectorAll('div, span');
        for (var i = 0; i < els.length; i++) {
            var t = (els[i].textContent || '').trim();
            if (t === 'Viewing in original language.' && !els[i].dataset.batDimText) {
                els[i].style.color = BODY_TEXT;
                els[i].dataset.batDimText = '1';
            }
            if ((t === 'Show all case and seller info' || t === 'Hide case and seller info') && !els[i].dataset.batDimText) {
                els[i].style.color = YELLOW;
                els[i].dataset.batDimText = '1';
            }
        }
    }

    // v1.6: the Lobby header bar is still medium grey - the CSS
    // 'header' rule never matched it, so it is not a <header> element.
    // Find the LOBBY heading and theme its bar, and find the "N Open
    // Cases" title bar and theme it. The Open Cases bar is matched by
    // contains-match, case-insensitively, shortest element - the exact
    // text never matched (the bar carries an icon or extra node). The
    // Star Wars reports later proved no such text exists on the Lobby
    // at all - only "Search All Your Cases" - but the match is harmless
    // if it ever appears.
    function styleLobbyChrome() {
        var h = document.querySelector('h1');
        // v1.7: the h1 reads "Lobby", not "LOBBY" - the exact match
        // never fired, so the bar was never themed. Case-insensitive now.
        if (h && h.textContent.trim().toUpperCase() === 'LOBBY' && !h.dataset.batLobbyHead) {
            var bar = h.closest('header') || h.parentElement;
            if (bar) {
                bar.style.backgroundColor = BAR_BG;
                bar.style.borderBottom = '2px solid rgba(255,213,0,0.55)';
                var icons = bar.querySelectorAll('button, svg, i');
                for (var ii = 0; ii < icons.length; ii++) {
                    icons[ii].style.color = BODY_TEXT;
                }
            }
            h.dataset.batLobbyHead = '1';
        }
        if (!document.querySelector('[data-bat-open-cases]')) {
            var els = document.querySelectorAll('div, span, h2, h3');
            var best = null, bestLen = Infinity;
            for (var jj = 0; jj < els.length; jj++) {
                var _t = (els[jj].textContent || '');
                if (/open cases/i.test(_t) && _t.length < 200 && _t.length < bestLen) {
                    best = els[jj]; bestLen = _t.length;
                }
            }
            if (best) {
                best.style.backgroundColor = BAR_BG;
                best.style.color = BODY_TEXT;
                best.dataset.batOpenCases = '1';
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

    function start() {
        fixAll();
        if (document.body && window.MutationObserver) {
            watchRoot(document.body);
        }
        // Safety net while Paragon finishes loading the page: two
        // minutes of full passes, then a slow heartbeat forever - the
        // search durations tick every second, rows can load late, and a
        // page kept open all day outlives the fast net. One fixAll every
        // 30s is cheap (checked nodes skip).
        var ticks = 0;
        var timer = setInterval(function () {
            fixAll();
            if (++ticks >= 40) {
                clearInterval(timer);
                setInterval(fixAll, 30000);
            }
        }, 3000);
        // Panels that load when the tab is shown again.
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) fixAll();
        });
        // Inside a widget frame, tell the top page this frame is themed
        // from within, so the invert fallback stays off.
        if (window.parent !== window) {
            try { window.parent.postMessage({ batThemed: true }, '*'); } catch (e) {}
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
