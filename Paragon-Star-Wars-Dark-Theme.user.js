// ==UserScript==
// @name         Paragon — Star Wars Dark Theme
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Star Wars tactical-display theme for all of Paragon, inspired by the cockpit targeting screen J.T. sent: deep navy, bright cyan frames and data, red accents, dotted data lines, monospace text and uppercase headers - restrained, no characters or quotes, nothing cartoonish. A fixer darkens every light surface (keeping its hue, tinted navy) and flips dark text to light - including collapsed content before it ever expands, so expanded follow-up replies stay readable. The reply composer and the review screen are inverted as one piece each instead (Kat's card/input/label backgrounds live in shadow DOM and are unreachable any other way), and nothing inside them is themed element by element - mixing the two undoes both. Also runs inside the CloudFront widget iframes (follow-ups, bookmarks, contact reason) and themes them from within, with an invert fallback if injection fails. Changes the look only - no buttons, text, or functions are touched. Toggle it on/off in Tampermonkey without affecting the response scripts. Reopen/due rows get an ignited-red lightsaber wash that fades across the row, and their SLA-overdue times stay a flat bold red. The composer and review screens now render in the theme navy with readable text. The Reason Category and Reason Code dropdowns now match the theme instead of staying white. v2.5: the composer textbox and buttons render navy, not black, Review is the primary button and errors render red, and the Contact Reason panel no longer inverts into black with white dropdowns. v2.6: due/reopen rows are readable on the Lobby (inline wash + SLA red, stylesheet injected into shadow roots), and the Lobby header, table head and nav drawer are navy. v2.7: the v2.6 due-row fix never reached the Lobby rows - they are checked once, then Paragon adds the due class / peach background afterwards and the fixer never re-ran them. v2.7 re-checks due/peach rows on every pass, paints each due cell dark red itself (not just the row), reads the SLA date straight from the cell text, and themes the Lobby header/title by their text. v2.8: J.T. pasted the real row HTML - Lobby due rows are class "lobby-case-followup-overdue", NOT tr.caseDue, so no caseDue selector ever matched them; the row WAS darkened by the peach safety net but its TDs were untouched. v2.8 targets the overdue class itself, so every cell gets the dark-red wash and the SLA cell goes red. v2.9: J.T. said the red no longer looks nice - the v2.7/v2.8 per-cell gradient restarts at every cell, a repeating sawtooth fade. v2.9 puts the wash back on the row only, fading once across the whole row, with cells transparent (the v2.1/v2.2 design); the stylesheet now forces those cells transparent so the site peach cannot paint over the row. v3.0: the white buttons/panels (Transfer, Reply, Annotate, Transfer box, Contact Reason, notification) get CSS backstops and a re-check for late painting; the nav user line, Lobby icons, pagination and the active list item are themed; the "Viewing in original language." line is themed by its text; the "N Open Cases" bar is found by contains-match; the composer kat-card shadow roots get a pre-inversion stylesheet; a negative SLA-remaining duration goes red. v3.1: the Transfer panel labels, notification text and button label spans keep their dark site colour on the now-dark panels - they get light text directly; h5 joins the heading rules; the info-table toggle goes cyan; the text-based passes (composer extras, Lobby chrome, dim text) now also run on mutations, throttled, so late-appearing text is themed; the "N Open Cases" bar matches "Open Cases" with no digit requirement. v3.2: the lobby due-cell text colour is set inline by the fixer, not the stylesheet (the stylesheet's !important colour was overriding the SLA red); a due cell whose text becomes an SLA indicator later (a ticking duration, a late-filling cell) is re-checked and goes red, and the fixer now watches text changes so ticking durations are caught live; the "N Open Cases" bar matches case-insensitively. v3.3: the SLA re-check is self-healing (a cell with the SLA flag but no inline colour is re-run), text changes are traced up to the nearest TD/TH instead of only the parent, and a 30-second heartbeat keeps late content themed after the 2-minute fast net stops. v3.4: the Transfer panel labels are themed whether they are spans or labels (and inside shadow trees), the 'View translation' chips in the correspondence area get light text, and the translation info-alerts get light text.
// @author       Scout (for J.T.)
// @match        https://paragon-na.amazon.com/*
// @match        https://d1u16vxl4h9h9c.cloudfront.net/widget.html*
// @match        https://*.cloudfront.net/widget.html*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    /* Palette from the tactical-display photo: deep navy, bright cyan,
       a little red. No gold in the photo, so gold is retired. */
    var NAVY_BG = '#070b1e';
    var SURFACE = '#0d142e';
    var BAR_BG = '#0b1226';
    var CYAN = '#2ee6d6';
    var PALE_CYAN = '#c9f6f1';
    var BODY_TEXT = '#dfe9ec';
    var RED = '#ff4444';
    var STEEL = '#1f4a55';

    var css = [
        /* Deep navy base + starfield (cyan/white dots, a couple red) */
        'html, body {',
        '  background-color: ' + NAVY_BG + ' !important;',
        '  background-image:',
        '    radial-gradient(1px 1px at 12% 22%, rgba(46,230,214,0.8) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 68% 8%, rgba(255,255,255,0.6) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 84% 34%, rgba(255,68,68,0.55) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 32% 64%, rgba(46,230,214,0.55) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 52% 88%, rgba(255,255,255,0.65) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 94% 72%, rgba(255,255,255,0.45) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 4% 82%, rgba(46,230,214,0.6) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 44% 40%, rgba(255,255,255,0.4) 50%, transparent 51%),',
        '    radial-gradient(1px 1px at 76% 55%, rgba(255,68,68,0.45) 50%, transparent 51%) !important;',
        '  background-attachment: fixed !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        /* Computer-system data font where Paragon does not set its own. */
        '  font-family: ui-monospace, "Cascadia Mono", "SF Mono", Consolas, "Liberation Mono", monospace !important;',
        '}',
        ':root { color-scheme: dark; }',

        /* Cyan-to-red sweep across the top, like the display in the photo */
        'body::before {',
        '  content: "";',
        '  display: block;',
        '  height: 3px;',
        '  background: linear-gradient(90deg, transparent, ' + CYAN + ' 25%, ' + RED + ' 75%, transparent);',
        '}',

        /* Faint tactical grid over the page, like a star-map display.
           pointer-events none so it never blocks a click; below the
           response bars (z-index 9999) and barely visible (3.5%). */
        'body::after {',
        '  content: "";',
        '  position: fixed;',
        '  inset: 0;',
        '  pointer-events: none;',
        '  z-index: 9998;',
        '  background-image:',
        '    linear-gradient(rgba(46,230,214,0.035) 1px, transparent 1px),',
        '    linear-gradient(90deg, rgba(46,230,214,0.035) 1px, transparent 1px);',
        '  background-size: 48px 48px;',
        '}',

        /* Known Paragon hooks: correspondence text + main grid */
        '.body_RioZc { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '[class*="dvr-grid"] { background-color: transparent !important; }',

        /* Section header rows: dark shell, dotted cyan underline + cyan
           left edge, like the dotted data lines in the photo (best effort -
           Paragon's header class may vary, so this is a bonus, not the fix) */
        '.header-row { background-color: ' + SURFACE + ' !important; border-bottom: 1px dotted rgba(46,230,214,0.45) !important; border-left: 3px solid ' + CYAN + ' !important; }',

        /* Expanded detail areas (follow-up replies, etc.) get a cyan edge,
           like a console readout - no layout change (inset shadow). */
        '[role="region"] { box-shadow: inset 2px 0 0 rgba(46,230,214,0.4) !important; }',

        /* The response bars belong to the theme now: dark shell, cyan underline.
           Only the bar containers - their buttons keep their inline colors. */
        '#tm-main-bar, #tm-tech-bar, #tm-auctions-bar {',
        '  background-color: ' + BAR_BG + ' !important;',
        '  border-bottom: 2px solid rgba(46,230,214,0.55) !important;',
        '  box-shadow: 0 2px 12px rgba(0,0,0,0.6) !important;',
        '}',
        '.tm-switch-tray, #tm-suggestion-line, #tm-tech-suggestion-line,',
        '#tm-report-footer, #tm-tech-report-footer {',
        '  background-color: ' + BAR_BG + ' !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        '}',

        /* Links go cyan, white on hover */
        'a { color: ' + CYAN + ' !important; }',
        'a:hover { color: #ffffff !important; }',

        /* Headings in cyan, uppercase and spaced like a readout, with a
           dotted cyan underline like the data lines in the photo */
        'h1 { color: ' + CYAN + ' !important; letter-spacing: 0.5px !important; text-transform: uppercase !important; }',
        'h2, h3, h4, h5 { color: ' + PALE_CYAN + ' !important; letter-spacing: 0.5px !important; text-transform: uppercase !important; border-bottom: 1px dotted rgba(46,230,214,0.35) !important; }',

        /* Native Paragon buttons: dark navy with a steel-cyan border,
           cyan on hover. No !important here on purpose - the response bars
           set their button colors inline, and inline styles beat this, so
           the bars keep theirs. (The fixer below also darkens white
           buttons directly, inline.) */
        'button {',
        '  background-color: #101a33;',
        '  color: ' + BODY_TEXT + ';',
        '  border: 1px solid ' + STEEL + ';',
        '  border-radius: 6px;',
        '}',
        'button:hover { border-color: ' + CYAN + '; color: ' + CYAN + '; }',

        /* Dark form controls (reply box, dropdowns, search) */
        'input, textarea, select {',
        '  background-color: #0d1530 !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        '  border: 1px solid ' + STEEL + ' !important;',
        '}',
        'input:focus, textarea:focus, select:focus {',
        '  border-color: ' + CYAN + ' !important;',
        '  outline: none !important;',
        '}',

        /* Tables: dark rows, faint borders, cyan headers; a cyan row
           highlight on hover for the queue lists on the other pages */
        'table { background-color: transparent !important; color: ' + BODY_TEXT + ' !important; }',
        'th { color: ' + CYAN + ' !important; }',
        'td, th { border-color: #1c2f4a !important; }',
        'tr:nth-child(even) td { background-color: rgba(46,230,214,0.02) !important; }',
        'tr:hover td { background-color: rgba(46,230,214,0.05) !important; }',

        /* Reopen / due rows (v2.1): the red runs the whole row - an ignited
           lightsaber laid across it, strong red at the left edge fading to
           the faint red tint at the right end. The gradient lives on the row
           itself (a per-cell gradient would restart at every cell), so the
           cells are transparent and the fixer stays off the row's background.
           The class name carries an em-dash, so the SLA spans are matched
           by substring, not by class selector. These rules sit after the
           table rules so they win the ties. */
        'tr.caseDue { background: linear-gradient(to right, rgba(255,68,68,0.65) 0%, rgba(255,68,68,0.08) 100%) !important; }',
        '/* v3.3: SLA re-check hardened + 30s heartbeat */',
        'tr.caseDue td { background-color: transparent !important; }',
        'tr.caseDue:hover { background: linear-gradient(to right, rgba(255,68,68,0.75) 0%, rgba(255,68,68,0.14) 100%) !important; }',
        // v2.8: Lobby due rows are lobby-case-followup-overdue, not caseDue.
        'tr.lobby-case-followup-overdue { background: linear-gradient(to right, rgba(255,68,68,0.65) 0%, rgba(255,68,68,0.08) 100%) !important; background-color: #2a0e14 !important; }',
        // v3.2: the lobby due-cell text colour is set inline by the fixer now - the stylesheet's !important colour was overriding the SLA red (the Lobby report proved it: the fixer had set the cell red inline, but it computed light). The fixer sets every due cell's colour itself, so the stylesheet only forces the background transparent.
        '/* v3.2: lobby due-cell text colour is set inline by the fixer */',
        'tr.lobby-case-followup-overdue td { background-color: transparent !important; background-image: none !important; }',
        'tr.lobby-case-followup-overdue:hover { background: linear-gradient(to right, rgba(255,68,68,0.75) 0%, rgba(255,68,68,0.14) 100%) !important; }',
        '[class*="sla-exceeded-status"] { color: ' + RED + ' !important; font-weight: 700 !important; text-shadow: none !important; }',

        /* Inside the reply composer and the review screen the theme
           inverts the whole box instead of theming each element (Kat's
           card/input/label backgrounds live in shadow DOM and are
           unreachable). These rules put the ORIGINAL light colours back
           inside them, so the single inversion turns them dark. Nothing
           inside #composer or #review is themed element by element. */
        '#composer textarea, #review textarea, #composer input, #review input, #composer select, #review select {',
        '  background-color: #e0e9ff !important;',
        '  color: #232f3e !important;',
        '  border-color: #232f3e !important;',
        '}',
        '#composer input:focus, #review input:focus, #composer textarea:focus, #review textarea:focus, #composer select:focus, #review select:focus {',
        '  border-color: #0066c0 !important;',
        '}',
        '#composer button, #review button {',
        '  background-color: #e0e9ff !important;',
        '  color: #232f3e !important;',
        '  border-color: #232f3e !important;',
        '}',
        '#composer button:hover, #review button:hover { border-color: #0066c0 !important; color: #0066c0 !important; }',
        '#composer h1, #review h1, #composer h2, #review h2, #composer h3, #review h3, #composer h4, #review h4, #composer h5, #review h5 {',
        '  color: #232f3e !important;',
        '  border-bottom-color: transparent !important;',
        '}',
        '#composer a, #review a { color: #0066c0 !important; }',
        '#composer ::-webkit-scrollbar-track, #review ::-webkit-scrollbar-track { background: #ffffff !important; }',
        '#composer ::-webkit-scrollbar-thumb, #review ::-webkit-scrollbar-thumb { background: #aab0b8 !important; }',

        /* Composer / review readability (v2.3): the inverted box came out
           black instead of the theme navy, and text that inherited the
           theme's light body colour inverted to dark-on-dark. So inside
           #composer / #review everything is forced dark pre-inversion
           (which renders light), placeholders get a readable mid-grey at
           full opacity, and the box and card get their background from the
           exact pre-inversion colour of the theme surface (#e0e9ff renders
           as #0d142e through invert + hue-rotate), so they render navy.
           The #composer a rule still wins for links (higher specificity). */
        '#composer, #review { background: #e0e9ff !important; }',
        '#composer kat-card, #review kat-card { background: #e0e9ff !important; }',
        '#composer *, #review * { color: #232f3e !important; }',
        '#composer textarea::placeholder, #composer input::placeholder, #review textarea::placeholder, #review input::placeholder { color: #5a5a5a !important; opacity: 1 !important; }',

        /* Dropdowns (v2.4): the Reason Category / Reason Code boxes stayed
           white. Their light-DOM parts get the theme surface - as the
           pre-inversion colour inside the inverted composer/review (renders
           navy), and as the surface directly everywhere else in Paragon
           (the scoped rule wins inside by specificity). Text inside the
           header inherits the light colour outside; inside, the #composer *
           rule already forces it dark pre-inversion (renders light). */
        '#composer .kat-select-container, #review .kat-select-container, #composer .select-header, #review .select-header, #composer .select-options, #review .select-options { background: #e0e9ff !important; }',
        '.kat-select-container, .select-header, .select-options { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.select-header .header-row-text, .select-header kat-icon, .select-header i { color: inherit !important; }',
        '.select-options .option-inner-container { background-color: transparent !important; }',

        /* v2.5, live page check: if ANY container is inverted (a pm-card
           that loaded empty and got inverted, an iframe fallback), its
           dropdowns / inputs / headings must use the pre-inversion
           colours too, or the dark theme surface inverts to white and
           the light text inverts to dark grey - exactly the Contact
           Reason panel on case 23480368871 (black panel, white
           dropdowns, unreadable headings). */
        '[data-sw-inverted] .kat-select-container, [data-sw-inverted] .select-header, [data-sw-inverted] .select-options, [data-sw-inverted] input, [data-sw-inverted] textarea, [data-sw-inverted] select { background: #e0e9ff !important; color: #232f3e !important; }',
        '[data-sw-inverted] h1, [data-sw-inverted] h2, [data-sw-inverted] h3, [data-sw-inverted] h4, [data-sw-inverted] h5 { color: #232f3e !important; }',
        'pm-card[data-sw-inverted] { background: #e0e9ff !important; }',
        'pm-card[data-sw-inverted] * { color: #232f3e !important; }',

        /* v2.5: Contact Reason panel when it is NOT inverted - navy panel,
           pale-cyan headings, navy dropdowns (the fixer handles the rest). */
        'pm-card { background-color: ' + SURFACE + ' !important; }',
        'pm-card h3, pm-card h4, pm-card h5 { color: ' + PALE_CYAN + ' !important; }',

        /* v2.5: Case actions menu was a white box. Popover content gets
           the surface, its buttons get the bar background. */
        'kat-popover-content, [class*="popover-content"] { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        'kat-popover-content button, [class*="popover-content"] button { background-color: ' + BAR_BG + ' !important; color: ' + BODY_TEXT + ' !important; border: 1px solid ' + STEEL + ' !important; }',

        /* v2.5: composer errors were white text that did not signal an
           error. #ff6550 renders as #f55b46 through invert + hue-rotate,
           close to the red accent. */
        '#composer [class*="error" i], #review [class*="error" i] { color: #ff6550 !important; }',

        /* v2.6, Lobby check: header bar, table title/head and nav drawer
           came out medium grey, not navy, and the hamburger/globe/refresh/
           sort icons were near-invisible dark-on-grey. */
        'header, [role="banner"] { background-color: ' + BAR_BG + ' !important; border-bottom: 2px solid rgba(46,230,214,0.55) !important; }',
        'header button, header svg, header i { color: ' + BODY_TEXT + ' !important; }',
        'header svg { fill: ' + CYAN + ' !important; stroke: ' + CYAN + ' !important; }',
        'nav, aside, [role="navigation"] { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        'nav a, aside a, [role="navigation"] a { color: ' + CYAN + ' !important; }',
        'thead, thead tr, thead th { background-color: ' + BAR_BG + ' !important; }',
        'th button svg, th svg, td button svg { color: ' + CYAN + ' !important; fill: ' + CYAN + ' !important; opacity: 1 !important; }',
        '[class*="tooltip"] { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; border: 1px solid ' + STEEL + ' !important; }',
        /* v3.0, from the five Diagnostics v3.0 reports (11/19): the
           case-page Transfer / Reply / Annotate / filter buttons stayed
           white with light text. The site's .tertiary/.link class rule
           beats the plain 'button' rule above, and the fixer had already
           marked them checked while their background was still
           transparent. Scoped to those classes only, so the response
           bars' classless buttons keep their inline colours. */
        'button.tertiary, button.link, kat-button[variant="tertiary"], kat-button[variant="link"] {',
        '  background-color: #101a33 !important;',
        '  color: ' + BODY_TEXT + ' !important;',
        '  border: 1px solid ' + STEEL + ' !important;',
        '}',
        'button.tertiary:hover, button.link:hover { border-color: ' + CYAN + ' !important; color: ' + CYAN + ' !important; }',
        /* Inside the inverted composer/review the pre-inversion rule
           above still wins (higher specificity), so composer buttons
           keep rendering navy, not the bar navy. */
        '#composer button.tertiary, #review button.tertiary, #composer button.link, #review button.link { background-color: #e0e9ff !important; color: #232f3e !important; }',

        /* v3.0: the Transfer panel, the Contact Reason panel, the
           notification empty-state and the uc-kat-button stayed white -
           same late-paint cause as the buttons above, so the same
           backstop: theme them directly in CSS. */
        '.transfer-box { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.flo-box { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.flo-box .ng-binding, .flo-box h3, .flo-box h4 { color: ' + BODY_TEXT + ' !important; }',
        '.uc-kat-button { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',
        '.uc-notification-empty { background-color: ' + SURFACE + ' !important; color: ' + BODY_TEXT + ' !important; }',

        /* v3.0: Bootstrap's active list item and page link are cyan
           text on bright blue (#007bff) - 2.54:1. The active state
           becomes the theme primary; the rest of the pager goes navy. */
        '.list-group-item.active, .page-item.active .page-link { background-color: #007690 !important; border-color: #007690 !important; color: #ebf1ff !important; }',
        '.pagination .page-link, a.page-link { background-color: #101a33 !important; color: ' + CYAN + ' !important; border-color: ' + STEEL + ' !important; }',

        /* v3.0: the nav user line ("User: jxpowers Tenant: Trans (3)")
           and the Lobby table / pagination icons are dark teal (#002f36)
           on navy - 1.26:1. The navItem class is CSS-module hashed, so
           match by substring; the icon font is <i> throughout Paragon.
           Inside #composer/#review the '#composer *' rule wins by
           specificity, so this never touches the inverted composer. */
        'nav [class*="navItem"], aside [class*="navItem"], [role="navigation"] [class*="navItem"] { color: ' + BODY_TEXT + ' !important; }',
        'i { color: ' + BODY_TEXT + ' !important; }',
        '[class*="page-"].selected { color: ' + BODY_TEXT + ' !important; }',

        /* v3.1, from the v3.0 case-page report: v3.0 darkened the
           Transfer box and the notification empty-state, but their
           labels kept the dark site colour (#002f36 / #232f3e on navy).
           The fixer will not flip those - it skips text inside custom
           elements when the background is transparent, because the
           shadow background is usually still white - so the labels get
           light text directly here. Same reason for the label spans
           inside buttons ("Annotation", the transfer options): they
           carry their own dark colour, so they inherit the button's. */
        '.transfer-box span, .transfer-box label { color: ' + BODY_TEXT + ' !important; }',
        /* v3.4/v1.8: the "View translation" chips in the correspondence
           area are span.default OUTSIDE the composer - dark teal text
           on the dark teal chip (1.00:1, invisible). The composer rule
           below is more specific, so it still wins inside
           #composer/#review. The translation info-alerts are black
           text on a transparent background (1.16:1) - same fix. */
        'span.default { color: ' + BODY_TEXT + ' !important; }',
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
           text (#232f3e) on a dark teal chip (#002f36) - both render
           light through the inversion, so it stays unreadable. Give it
           pre-inversion colours: dark chip renders light, light text
           renders navy. */
        '#composer .default, #review .default { background-color: #232f3e !important; color: #e0e9ff !important; }',

        /* Dark scrollbars */
        '::-webkit-scrollbar { width: 10px; height: 10px; }',
        '::-webkit-scrollbar-track { background: ' + NAVY_BG + '; }',
        '::-webkit-scrollbar-thumb { background: ' + STEEL + '; border-radius: 5px; }',
        '::-webkit-scrollbar-thumb:hover { background: ' + CYAN + '; }'
    ].join('\n');

    function injectCss(doc) {
        var style = doc.createElement('style');
        style.type = 'text/css';
        style.appendChild(doc.createTextNode(css));
        (doc.head || doc.documentElement).appendChild(style);
    }

    injectCss(document);

    /* ---- Light-surface fixer (v1.8) -----------------------------------------
       Darkens EVERY light surface, keeping its hue and tinting it navy (white
       goes dark navy-grey, the green follow-up rows go dark slate-green, the
       yellow warning goes dark amber) so the meaning of the colours is kept.
       Big darkened surfaces (panels, cards) also get a thin cyan frame, like
       the display in the photo. Dark text on those surfaces flips to light;
       links keep their cyan. The response bars are never touched.
       v1.8 rule (from the reply composer): an inverted element's whole
       subtree is left alone - the ancestor's filter themes it, and touching
       anything inside would undo the inversion. Only LEAF Kat components
       (buttons, checkboxes, labels, icons, spinners, dividers, status
       indicators) are ever inverted - never a container (kat-box, kat-card,
       kat-radiobutton, kat-input, ...). The reply composer (#composer) and
       the review screen (#review) are the two containers inverted as a
       whole, because Kat's card/input backgrounds are unreachable any other
       way, and the CSS above restores the original light colours inside
       them so the single inversion turns them dark. Walks into open shadow roots and same-origin iframes, and
       inverts closed-shadow hosts it cannot reach into. Every node is
       checked once (swChecked) so deep nodes are never missed by a
       per-pass cap. -------------------------------------------------------- */
    var LIGHT_TEXT = BODY_TEXT;
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

    function isLightBg(c) {
        return c && c.a >= 0.6 && c.r >= 200 && c.g >= 200 && c.b >= 200;
    }

    // v2.6, Lobby check: Paragon's due-row wash is pale peach/salmon
    // (~#f8b090: r 248, g 176, b 144). isLightBg() misses it because
    // green is < 200, so the fixer left it peach with white text on top
    // - unreadable. Detect that wash directly as a safety net, even
    // when the row's class is not visible to the inspector.
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

    function isDarkText(c) {
        return c && luminance(c) < 0.5;
    }

    // Darken keeping the hue, tinted toward navy so surfaces sit on the
    // deep-navy page instead of reading grey.
    function darken(c) {
        function d(v, tint) { return Math.min(255, Math.round(v * 0.22 + tint)); }
        return 'rgb(' + d(c.r, 3) + ', ' + d(c.g, 5) + ', ' + d(c.b, 14) + ')';
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
        var themed = el.querySelectorAll('[data-sw-darkened], [data-sw-inverted]');
        for (var i = 0; i < themed.length; i++) {
            var t = themed[i];
            t.style.backgroundColor = '';
            t.style.color = '';
            t.style.filter = '';
            t.style.outline = '';
            t.style.outlineOffset = '';
            delete t.dataset.swDarkened;
            delete t.dataset.swInverted;
        }
    }

    function fixOne(el) {
        if (!el || el.nodeType !== 1) return;
        var tag = el.tagName;
        if (tag === 'HTML' || tag === 'BODY' || tag === 'HEAD' || tag === 'STYLE' ||
            tag === 'SCRIPT' || tag === 'INPUT' ||
            tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'OPTION') return;
        if (inBar(el)) return;
        // Reopen / SLA-overdue markers (v2.0, hardened v2.6): the CSS
        // gives them the ignited-red-lightsaber treatment, but the CSS
        // never reaches inside shadow-DOM tables (Lobby), so on those
        // pages the SLA text stayed white on peach - unreadable. Apply
        // the treatment INLINE here, so it holds wherever the fixer can
        // see the element, shadow root or not. The class name carries an
        // em-dash, so match by substring.
        if (el.className && typeof el.className === 'string' &&
            el.className.indexOf('sla-exceeded-status') !== -1) {
            if (!el.dataset.swSla) {
                el.style.color = RED;
                el.style.fontWeight = '700';
                el.style.textShadow = 'none';
                el.dataset.swSla = '1';
            }
            return;
        }
        // v2.6: a due/reopen row (tr.caseDue) gets the wash INLINE, for
        // the same shadow-DOM reason - the stylesheet gradient cannot
        // reach it there. Cells are handled below (transparent, text
        // flipped light if it was dark).
        if (tag === 'TR' && isCaseDueRow(el)) {
            if (!el.dataset.swCaseDue) {
                el.style.background = 'linear-gradient(to right, rgba(255,68,68,0.65) 0%, rgba(255,68,68,0.08) 100%)';
                el.style.backgroundColor = '#2a0e14';
                el.dataset.swCaseDue = '1';
            }
            return;
        }
        // v2.6: a cell inside a due row, or a cell/row sitting on the
        // peach wash itself - force transparent so the row wash shows,
        // and flip dark text light. White/pale text is left alone: on
        // the dark wash it is already readable (Lobby: white on peach
        // was the failure; white on dark red is the fix).
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
            el.dataset.swCaseDueCell = '1';
            // v2.7: on the Lobby the SLA is a plain cell, not a span -
            // the v2.0/v2.6 span targeting silently did nothing there.
            // A due cell whose whole text is a date WITH a time
            // ("November 18, 2026 08:19 PM") is the SLA cell; the
            // Created cell has a date but no time, so it does not match.
            var _tx0 = (el.textContent || '').trim();
            // v3.0: on search pages the SLA-remaining column shows a
            // duration - "(+12:20:59)" still has time, "(-03:16:54)" is
            // breached, so only the negative one goes red. The date
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
                el.dataset.swSla = '1';
                el.style.color = RED;
                el.style.fontWeight = '700';
                el.style.textShadow = 'none';
            } else {
                var _cs0 = getComputedStyle(el);
                var _fg0 = parseRgb(_cs0.color);
                if (isDarkText(_fg0)) el.style.color = LIGHT_TEXT;
            }
            return;
        }
        // v2.5: a container that was inverted while empty (no children
        // yet, so the leaf test passed) and has since filled - e.g. the
        // Contact Reason pm-card - must be un-inverted, or its children
        // render backwards (black panel, white dropdowns). Composer and
        // review are the intentional exceptions and keep their inversion.
        if (el.dataset.swInverted && el.id !== 'composer' && el.id !== 'review' &&
            /CARD|PANEL|MODAL|POPOVER|WIDGET/.test(tag) && hasVisibleLightDom(el)) {
            el.style.filter = '';
            delete el.dataset.swInverted;
            // fall through and theme it normally below
        }
        // Inside an inverted element, do nothing at all: the ancestor's
        // filter themes the whole subtree, and darkening, flipping or
        // inverting anything inside would undo it. (closest includes the
        // element itself, so an already-inverted element is a no-op here.)
        if (el.closest && el.closest('[data-sw-inverted]')) return;
        // The reply composer and the review screen are inverted as one
        // piece each (Kat's card/input backgrounds are unreachable any
        // other way). Nothing inside them is themed element by element -
        // see the #composer / #review CSS above.
        if (el.id === 'composer' || el.id === 'review') {
            if (!el.dataset.swInverted) {
                el.style.filter = 'invert(1) hue-rotate(180deg)';
                el.dataset.swInverted = '1';
                unthemeDescendants(el);
            }
            return;
        }
        // Inside the composer or the review screen (before it is inverted,
        // or if it is reached through another path): never theme element
        // by element.
        if (el.closest && el.closest('#composer, #review')) return;
        // NOTE: no visibility skip here on purpose (v1.7). Collapsed
        // content (expanded replies, hidden panels) has no boxes yet, but
        // its computed styles are still readable - theme it now so it is
        // already right when it opens.
        var cs = getComputedStyle(el);
        var bg = parseRgb(cs.backgroundColor);
        var fg = parseRgb(cs.color);
        var bgIsLight = isLightBg(bg);
        // v2.6: peach wash with no caseDue class in reach - treat it as
        // a due row anyway: dark red underneath, text light.
        if (isPeachBg(bg) && !el.dataset.swPeach) {
            el.style.backgroundColor = '#2a0e14';
            if (isDarkText(fg) || fg) el.style.color = LIGHT_TEXT;
            el.dataset.swPeach = '1';
            el.dataset.swDarkened = '1';
            // v2.7: peach SLA cell - same date-with-time test as above.
            var _txp = (el.textContent || '').trim();
            if (/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M$/.test(_txp)) {
                el.style.color = RED;
                el.style.fontWeight = '700';
                el.style.textShadow = 'none';
            }
        }
        // Darken any light surface, keeping its hue, tinted navy.
        if (!el.dataset.swDarkened && bgIsLight) {
            el.style.backgroundColor = darken(bg);
            el.dataset.swDarkened = '1';
            // Big surfaces (panels, cards) get the thin cyan frame from
            // the photo. Small rows and buttons do not - they would turn
            // into a stack of boxes.
            if (el.offsetWidth >= 250 && el.offsetHeight >= 100) {
                el.style.outline = '1px solid rgba(46,230,214,0.28)';
                el.style.outlineOffset = '-1px';
            }
        }
        // Inverted leaves only. A custom element whose UI lives in shadow
        // DOM (possibly closed) cannot be reached, so invert the host and
        // hue-rotate the colours back - but ONLY for leaves. Inverting a
        // container (kat-box, kat-card, kat-radiobutton, kat-input, ...)
        // would also invert every element the fixer already themed inside
        // it, flipping dark backgrounds back to light and light text back
        // to dark - which is exactly what left the composer a light island
        // in v1.7. Kat buttons only when transparent (tertiary / link -
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
            // light-DOM children and no text (closed-shadow host, v1.4 rule).
            // v2.5: never invert a card / panel / modal / popover / widget
            // container, even if it happens to be empty when first seen -
            // it will fill later (Contact Reason pm-card) and then render
            // backwards. Those are themed element by element instead.
            invertOk = (el.children.length === 0 && el.textContent.trim() === '' &&
                /CARD|PANEL|MODAL|POPOVER|WIDGET/.test(tag) === false);
        }
        if (invertOk && !el.dataset.swInverted &&
            (isTransparentBg(bg) || bgIsLight)) {
            el.style.filter = 'invert(1) hue-rotate(180deg)';
            el.dataset.swInverted = '1';
        }
        // v2.5: pure-black native buttons (Transfer / Reply, Annotate,
        // Expand, Filter) stayed black - the fixer only darkened LIGHT
        // surfaces, and the CSS button rule has no !important on purpose
        // (the response bars keep their inline colours). Give black
        // buttons the navy treatment inline, bars excluded by inBar().
        if (tag === 'BUTTON' && !el.dataset.swDarkened && bg && bg.a >= 0.6 &&
            bg.r < 30 && bg.g < 30 && bg.b < 30) {
            el.style.backgroundColor = '#101a33';
            el.style.color = LIGHT_TEXT;
            el.style.borderColor = STEEL;
            el.dataset.swDarkened = '1';
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
    var injectedRoots = new WeakSet();

    // v2.6, Lobby check: injectCss() only ever injected into a Document,
    // so a tr.caseDue (or a header, or a table head) inside an OPEN
    // shadow root never saw any of the stylesheet - the gradient, the
    // header navy, the thead navy, all of it. Inject the same stylesheet
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
    // have no theme <style> inside - fixSubtree never walks into the
    // inverted composer, so injectCssIntoRoot never reaches them.
    // Inject a small stylesheet with PRE-inversion colours (the
    // ancestor filter inverts them): #e0e9ff renders as the theme
    // surface, #232f3e renders as light text.
    var composerShadowCss = [
        ':host { background-color: #e0e9ff !important; color: #232f3e !important; }',
        'input, textarea, select, button { background-color: #e0e9ff !important; color: #232f3e !important; border-color: #232f3e !important; }',
        'h1, h2, h3, h4, h5 { color: #232f3e !important; }',
        'a { color: #0066c0 !important; }'
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
                // so one that just went negative goes red.
                // v3.3: trace up to the nearest cell (see above).
                var _cell2 = m.target ? nearestCell(m.target.parentNode) : null;
                if (_cell2) fixSubtree(_cell2);
                else if (m.target && m.target.parentNode) fixSubtree(m.target.parentNode);
            } else {
                // A class/style change (e.g. a reply expanding) can reveal
                // content - re-check the whole subtree, not just the node.
                // Already-fixed nodes are skipped cheaply (swChecked), and
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
            // Never theme inside the inverted composer or review screen -
            // not even their shadow trees (closest() cannot see across a
            // shadow boundary).
            if (el.id !== 'composer' && el.id !== 'review' && el.closest && el.closest('#composer, #review')) continue;
            // v2.5: re-check an inverted container even if it was already
            // checked - it may have filled since it was (wrongly) inverted
            // while empty. Clear the inversion and the checked flag so
            // fixOne themes it normally below.
            if (el.dataset.swInverted && el.id !== 'composer' && el.id !== 'review' &&
                /CARD|PANEL|MODAL|POPOVER|WIDGET/.test(el.tagName) && hasVisibleLightDom(el)) {
                el.style.filter = '';
                delete el.dataset.swInverted;
                delete el.dataset.swChecked;
            }
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
            if (el.dataset.swChecked) {
                // v2.9 migration: a due cell painted by v2.7/v2.8
                // carries a per-cell gradient in its inline style.
                // Clear its flags so fixOne re-runs and makes it
                // transparent (row-wide wash only).
                if ((el.tagName === 'TD' || el.tagName === 'TH') &&
                    el.dataset.swCaseDueCell && el.style && el.style.background &&
                    el.style.background.indexOf('gradient') !== -1 &&
                    isCaseDueRow(el)) {
                    delete el.dataset.swCaseDueCell;
                    delete el.dataset.swChecked;
                }
                var _cls7 = (el.className && typeof el.className === 'string') ? el.className : '';
                var _due7 = _cls7.indexOf('caseDue') !== -1 ||
                    _cls7.indexOf('overdue') !== -1 ||
                    _cls7.indexOf('sla-exceeded-status') !== -1 ||
                    isCaseDueRow(el);
                if (_due7 && !el.dataset.swCaseDue && !el.dataset.swSla && !el.dataset.swCaseDueCell) {
                    delete el.dataset.swChecked;
                } else if ((el.tagName === 'TR' || el.tagName === 'TD' || el.tagName === 'TH') &&
                    !el.dataset.swPeach && !el.dataset.swCaseDue && !el.dataset.swCaseDueCell) {
                    try {
                        var _bg7 = parseRgb(getComputedStyle(el).backgroundColor);
                        if (isPeachBg(_bg7)) delete el.dataset.swChecked;
                    } catch (e) { /* computed style unavailable; skip */ }
                }
                // v3.2: a due cell whose text has BECOME an SLA
                // indicator since it was first checked - the search
                // durations tick every second and cells can fill in
                // after the first pass - but which has no SLA flag
                // yet. Clear the checked flag so fixOne re-runs and
                // colours it red. (The first pass may have run on an
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
                    (!el.dataset.swSla || !el.style.color)) {
                    delete el.dataset.swSla;
                    delete el.dataset.swChecked;
                }
                // v3.0: buttons and panels that were first seen while
                // their background was still transparent, then painted
                // white later (Transfer/Reply buttons, Transfer box,
                // Contact Reason flo-box, uc-kat-button, notification
                // empty-state). Re-check only those candidates, so the
                // pass stays cheap; the CSS backstops above cover them
                // even if this misses.
                if (!el.dataset.swDarkened && !el.dataset.swInverted &&
                    (el.tagName === 'BUTTON' || el.tagName === 'KAT-BOX' ||
                     el.tagName === 'KAT-CARD' || el.tagName === 'PM-CARD' ||
                     (el.className && typeof el.className === 'string' &&
                      (el.className.indexOf('flo-box') !== -1 ||
                       el.className.indexOf('transfer-box') !== -1 ||
                       el.className.indexOf('uc-kat-button') !== -1 ||
                       el.className.indexOf('uc-notification-empty') !== -1)))) {
                    try {
                        var _bg3 = parseRgb(getComputedStyle(el).backgroundColor);
                        if (isLightBg(_bg3) || isPeachBg(_bg3)) delete el.dataset.swChecked;
                    } catch (e) { /* computed style unavailable; skip */ }
                }
            }
            if (!el.dataset.swChecked) {
                fixOne(el);
                el.dataset.swChecked = '1';
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

    /* ---- CloudFront widget iframes (v1.6) -----------------------------------
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
        if (e.data && e.data.swThemed === true &&
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
            if (f.dataset.swInverted) continue;
            if (!widgetFrameSeen.has(f)) { widgetFrameSeen.set(f, now); continue; }
            if (now - widgetFrameSeen.get(f) > 3000) {
                // No inner script answered: darken by inverting the frame.
                f.style.filter = 'invert(1) hue-rotate(180deg)';
                f.dataset.swInverted = '1';
            }
        }
    }

    // v2.5: inside the inverted composer / review, Review must stand
    // out from Cancel and errors must read as errors. CSS cannot target
    // a button by its text, so do it here by label, with PRE-inversion
    // colours (the ancestor filter inverts them): #007690 renders as a
    // bright blue [66,184,210], #ebf1ff renders as dark navy text, and
    // #ff6550 renders as red [245,91,70]. Runs separately because
    // fixSubtree never walks inside #composer / #review.
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
                if (buttonLabel(btns[j]) === 'Review' && !btns[j].dataset.swPrimary) {
                    btns[j].style.backgroundColor = '#007690';
                    btns[j].style.color = '#ebf1ff';
                    btns[j].style.borderColor = '#007690';
                    btns[j].style.fontWeight = '700';
                    btns[j].dataset.swPrimary = '1';
                }
            }
            var all = boxes[i].querySelectorAll('*');
            for (var k = 0; k < all.length; k++) {
                var tx2 = (all[k].textContent || '').trim();
                if (tx2.indexOf('Error:') === 0 && !all[k].dataset.swError) {
                    all[k].style.color = '#ff6550';
                    all[k].dataset.swError = '1';
                }
            }
        }
    }

    // v3.0: the Page Translation line "Viewing in original language."
    // is a classless div in mid-grey (#555555) on navy, 2.44:1, on
    // every page. No selector can reach it, so match it by its text.
    function styleDimText() {
        var els = document.querySelectorAll('div, span');
        for (var i = 0; i < els.length; i++) {
            var t = (els[i].textContent || '').trim();
            if (t === 'Viewing in original language.' && !els[i].dataset.swDimText) {
                els[i].style.color = BODY_TEXT;
                els[i].dataset.swDimText = '1';
            }
            // v3.1: the info-table toggle is dark teal (#008296) on
            // navy, 2.39:1 - give it the theme cyan. (The info table
            // itself is collapsed until this is clicked, which is why
            // the diagnostic never found its heading.)
            if ((t === 'Show all case and seller info' || t === 'Hide case and seller info') && !els[i].dataset.swDimText) {
                els[i].style.color = CYAN;
                els[i].dataset.swDimText = '1';
            }
        }
    }

    // v2.7: the Lobby header bar is still medium grey on v2.6 - the
    // CSS 'header' rule never matched it, so it is not a <header>
    // element (its tag/class are not exposed to the browser tools, so
    // this is text-based instead). Find the LOBBY heading and theme
    // its bar, and find the "N Open Cases" title bar and theme it.
    function styleLobbyChrome() {
        var h = document.querySelector('h1');
        if (h && h.textContent.trim() === 'LOBBY' && !h.dataset.swLobbyHead) {
            var bar = h.closest('header') || h.parentElement;
            if (bar) {
                bar.style.backgroundColor = '#0b1226';
                bar.style.borderBottom = '2px solid rgba(46,230,214,0.55)';
                var icons = bar.querySelectorAll('button, svg, i');
                for (var ii = 0; ii < icons.length; ii++) {
                    icons[ii].style.color = '#dfe9ec';
                }
            }
            h.dataset.swLobbyHead = '1';
        }
        // v3.0: the exact regex never matched - the bar carries an
        // icon or extra node, so its textContent is more than "N Open
        // Cases". v3.1: still not found, so the count may sit in a
        // separate element with no whitespace ("25Open Cases") - match
        // "Open Cases" alone. Take the shortest element that contains it.
        // v3.2: still not found, so the casing may differ ("Open cases") - match case-insensitively, and allow a longer container (the bar may carry extra controls).
        if (!document.querySelector('[data-sw-open-cases]')) {
            var els = document.querySelectorAll('div, span, h2, h3');
            var best = null, bestLen = Infinity;
            for (var jj = 0; jj < els.length; jj++) {
                var _t = (els[jj].textContent || '');
                if (/open cases/i.test(_t) && _t.length < 200 && _t.length < bestLen) {
                    best = els[jj]; bestLen = _t.length;
                }
            }
            if (best) {
                best.style.backgroundColor = '#0b1226';
                best.style.color = '#dfe9ec';
                best.dataset.swOpenCases = '1';
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
        // from within, so the invert fallback stays off.
        if (window.parent !== window) {
            try { window.parent.postMessage({ swThemed: true }, '*'); } catch (e) {}
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
