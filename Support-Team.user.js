// ==UserScript==
// @name         Amazon Relay Responses R4C & RCM Support — J.T. Personal
// @namespace    http://tampermonkey.net/
// @version      2.40
// @description  Automatically inserts responses for Relay issues
// @author       Julian Woolcott & Hayden Lindsey & Sheshu Venugopal
// @match        https://paragon-na.amazon.com/hz/view-case?caseId=*
// @grant        none
// ==/UserScript==
    /*UPDATES:
    11/26/2026: Responsive bar (2.40): the button bar now shrinks on smaller screens - below 1600px wide or 850px tall it uses tighter buttons and caps its own height at 45% of the viewport so the case stays visible. It switches back to the full layout automatically on a larger screen, re-checked on every resize and every second.
    11/21/2026: NEW "Performance Final" and "Account Access" buttons (2.39, per J.T.): Performance Final (SUPPORT & GENERAL, next to Performance) answers final performance decisions - both dispute options used, decision final, rolls off in six weeks; Account Access (SUPER ADMIN ISSUES, next to Portal Login Trouble) is a triage reply for sign-in trouble - phone/2FA update, DOT/MC linked to another account, Primary Admin suspension, or amazon-engagement. Both copy the closest existing dropdown mapping (Performance/Dispute; RLB Tech Issue/Carrier Account). Sim on all 1,094 logged Support rows (Nov 11-20, live-accurate scoring): the two buttons win 4 cluster customs; 2 suggestion thefts remain (emailAlreadyInUse via 'primary administrator' in thread text; Driver Verification via 'verification code' + 'old phone number' on a driver locked out by an old phone) - wrong suggestions, not wrong sends. 'final decision' was dropped after it stole a Multi case. (The review's 0-theft figure came from the weaker excerpt sim.)
    11/21/2026: EditSignature click fix (2.39, per J.T.): the signature toggle click is now wrapped in try/catch - if it throws (as on case 23474480791), the 2-second signature fill is still scheduled instead of being skipped, and the clicked button's text/class is logged so a wrong-selector cause can be ruled out.
    11/19/2026: Keyword retune from the Nov 19 exports (2.38, per J.T.): 5 phrases added, sim Nov 19 100/18/57 -> 106/18/51 and Nov 13 +1, zero regressions Nov 11-14. Insurance gains 'insurance need updated' + 'update my insurance'; Assets gains 'add truck'; Missing BOL gains 'i need bol'; Submit BOL gains 'bols for'. Rejected: 'need bol' (+2/-1, fires on a Call Back case) and 'issues connecting' (+0/-1).
    11/17/2026: Button groups re-sorted most buttons on top (2.37, per J.T.): ACCOUNT & COMPLIANCE (18), SUPPORT & GENERAL (16), SUPER ADMIN ISSUES (13), TRIPS & OPERATIONS (12). Fixed rule from now on: groups always run most buttons first.
    11/17/2026: Super Admin row (2.36, per J.T.): removed 6 duplicates - More Info Needed, App Crashing/Freezing, GPS/Location Not Tracking, Check-In Not Working, App Status Not Updating, Driver Using Multiple Devices - and recolored the row orange (was teal, too close to green).
    11/17/2026: NEW "Super Admin Issues" row (2.35, per J.T.): 19 buttons, his texts verbatim (Support greeting "Dear Valued Carrier,").
    11/17/2026: Winter weather signature block (2.34, per J.T.): US + Canadian notices with Relay Learning links, added to the signature.
    11/14/2026: Keyword retune from the Nov 14 exports + RCM gate line to one space (2.33, per J.T.): 21 phrases added, sim Nov 14 154/17/71 -> 175/16/51, zero regressions Nov 11-13.
    11/13/2026: Combo rule v1 (2.32, per J.T.): an app phrase plus a trip phrase now suggests the matching App + combo button.
    11/13/2026: Keyword retune from the Nov 13 exports (2.31, per J.T.): In-Transit gains 'heavy traffic' (75 rows across the week's exports, 74 of them In-Transit - it breaks the ties where 'traffic' alone scored 2 against a performance phrase at 3), 'construction' (8/8 In-Transit) and 'change of time' (2/2 In-Transit, the 'change of time on relay' wording). 'revoked' was already in Suspended's map, so nothing was added there. Sim across all four Support corpora (Nov 11, Nov 12 morning, Nov 12 afternoon, Nov 13): Nov 13 goes 119 correct / 33 wrong / 70 missed -> 124 / 33 / 65, the three earlier corpora unchanged, zero regressions. Tested and rejected: dropping bare 'load board' from RLB - it loses more correct RLB suggestions than the wrongs it fixes (Nov 11 -7 correct, Nov 13 -4 correct and +12 missed), because the RLB / Load Board Fluctuation overlap is a real taxonomy ambiguity (the same 'loads visibility reduced' wording got RLB once and Load Board Fluctuation twice from him). Personal-only retune; Team files unchanged. v2.30 is untouched as the fallback.
    11/12/2026: Tab-switch catch-up (2.30, per J.T.): he opens 50-75 cases in tabs and works through them, and asked whether the suggestion can populate before he clicks a tab. There was no visibility gate in the script - the observer already watches document.body and scores as soon as Paragon puts the case text in the page, background tab or not - but the 800ms debounced check and the 5s safety net are timers, and browsers throttle background-tab timers, so on a tab opened long ago the check could sit queued. NEW: when you switch to a tab, the suggestion now scores immediately instead of waiting for the next timer tick. The listener is registered once per page load and always calls the current case's check, so a same-tab re-init never leaves it pointing at a stale container. No buttons, responses, keywords, dropdowns or logging changed. Whether it is already there before you click still depends on Paragon rendering the case text in the background tab - if Paragon only loads the text when the tab is focused, nothing in the script can beat that, and this is the test for it. Team files unchanged (no suggestion or logging). v2.29 is untouched as the fallback.
    11/12/2026: Carrier-only suggestion + full-text logging (2.29, per J.T.): the suggestion now scores only the carrier's message - pulled from 'Describe your issue:', 'Explain the issue here:', or the Tech VRID/Contract-ID block - instead of the whole thread, so subject lines, form boilerplate, transfer notices and your own replies no longer fire keywords. If no carrier message is found it falls back to the whole thread as before, so it never has less to work with. The case log now reports everything: each row carries the full thread text (up to 12,000 chars) plus the extracted carrier message and whether the suggestion was scored carrier-only - the JSON you upload has the complete case, not just the first/last 1,000 chars. Also fixed the log cap: it kept the OLDEST 500 entries, so once full the newest cases were never recorded - it now keeps the newest 500, and on a storage-quota failure it retries with the newest 250 instead of losing the entry. Needs live testing in Paragon - the extractor can't be tested here. Team files unchanged (no suggestion or logging). v2.28 is untouched as the fallback.
    11/12/2026: Keyword retune from the Nov 11 case logs (2.28, 109 Support cases / 102 unique): Suspended now catches load-board-access-after-verification cases ('load board not restored', 'loadboard is disabled', 'still suspended', 'make my account active', 'unable to book loads', 'has not updated', 'restore access', 'previously restricted', 'not restored', 'account active'); dropped 'account was closed' (misfired on a BASIC-score case). RLB dropped bare 'loadboard'. Link dropped 'verification link' (the verification form itself contains it, so it fired on every transferred verification case) - replaced with carrier-worded 'link expired', 'expired link', 'resend link', 'link is not working', "link doesn't work". Carb dropped 'ctc' (fired on VRID codes). Bank dropped bare 'bank' (fired on email addresses like ebanks...). Insurance dropped bare 'insurance' (fired on attachment filenames) and added 'insurance claim'. Cancel added permanent-closure phrasing. Patience dropped 'any update' and 'status of my case' (too generic - they fire on topic follow-ups). Contracts added 'access to contracts' and 'book contracts'. Performance and In-Transit added 'don't penalize us' and delay-arrival phrasing. Sim on the Nov 11 logs: Support 30 correct / 23 wrong / 47 missed -> 44 / 17 / 39. No new buttons - the 9 custom replies were one-offs. Team files unchanged: keyword tuning stays Personal-only, per the standing rule. v2.27 is untouched as the fallback.
    11/12/2026: Line breaks (2.27, per J.T.): added paragraph breaks to the UIIA and Auction Support responses so the messages read more easily - every section header now stands on its own line with a blank line after it, and the two footer links are on separate lines. No wording changed. Support-Team-v2.17 carries the same fixes plus the Trailer Defect port, per the standing both-versions rule. v2.26 is untouched as the fallback.
    11/11/2026: NEW button "Auction Support" (2.26, per J.T.): overview of Amazon Relay Auctions - how bidding works, who can access them, the Learning Center course link, and the Relay Auction Support topic for technical issues. Message adapted per queue: Support opens "Dear Valued Carrier," as given; Tech opens "Dear Carrier," per Tech's standard greeting; the body is otherwise identical and verbatim from his message. Placed at the end of the account group after UIIA. Dropdown mapping is a best-fit copy - no auction-specific code was found in the taxonomy (Support: generic account mapping RLB Tech Issue / Carrier Account, same as Other; Tech: General Support mapping Relay-account-category-main-category / Other) - correct it if Paragon offers a better code. Not added to the Auctions (RFA) scripts - he asked for Support and Tech only. Support-Team-v2.16 carries the same button/response/mapping (plain, no suggestion or logging), per the standing both-versions rule. v2.25 is untouched as the fallback.
    11/11/2026: NEW button "UIIA" (2.25, per J.T.): intermodal certification canned message, his text verbatim (opens "Dear Valued Carrier," as given). Placed at the end of the account group (Support ACCOUNT & COMPLIANCE / Tech ACCOUNT & REDIRECTS). Dropdown mapping is a best-fit copy - no UIIA/intermodal-specific code was found in the taxonomy (Support: generic account mapping RLB Tech Issue / Carrier Account, same as Other; Tech: General Support mapping Relay-account-category-main-category / Other) - correct it if Paragon offers a better code. Support-Team-v2.15 carries the same button/response/mapping (plain, no suggestion or logging), per the standing both-versions rule. v2.24 is untouched as the fallback.
    11/11/2026: Suggestion re-init fix (2.24, per J.T. — still missing after v2.23): found the remaining hole. tmLastSuggestion is set once per page load, but when Paragon opens another case in the SAME tab it re-runs init() without reloading the script — so the new case inherited the previous case's 'suggestion already shown' flag, and the re-score observer disconnected itself immediately while the safety-net interval stopped on its first check. That left each later case with only the retry loop, and a refresh (full reload) is what cleared the flag, which matches the symptom exactly. Fix: runSuggestion() now resets tmLastSuggestion to null, so every case starts with a live watcher. No buttons, responses, keywords, dropdowns or logging changed. Tech-JT-Personal-v3.27 carries the same fix. v2.23 is untouched as the fallback.
    11/11/2026: Suggestion timing fix (2.23, per J.T.): the suggestion sometimes never appeared until a page refresh. Root cause: the v2.22 re-score observer watched the .body_RioZc node itself, but Paragon replaces that node when the full thread loads, leaving the observer on a detached node that never fires again; the retry loop only covered ~16 seconds, so text arriving later was never scored. On refresh the text loads fast (cached), which is why a refresh fixed it. Fix: the observer now watches document.body, a node Paragon never swaps out, and a 5-second safety-net re-check runs while no suggestion is shown (stops on its own after 10 minutes), so a suggestion now appears within ~5 seconds of the text arriving even if a mutation is missed. Retry loop extended from 8 to 30 attempts (~60s). Also fixed a latent bug: tmLastSuggestion was set before the button-exists check, which could have killed the watcher permanently. Still suggest-only, still never replaces a shown suggestion or re-shows after Dismiss. No buttons, responses, keywords, dropdowns or logging changed. v2.22 is untouched as the fallback.
    11/10/2026: End-of-day keyword tuning + late-text re-score (v2.22, per J.T.): Scout tuned the suggestion keywords from today's Support + Tech exports (99 rows). Measured on the logged case text, Support suggestions go from 4 correct / 2 wrong / 48 missed (live) to 43 correct / 4 wrong / 7 missed in simulation; Tech goes from 1 / 1 / 29 to 29 / 2 / 0. The bigger fix is not keywords: the scorer only read the case text for ~18 seconds after the bar built, but Paragon often fills the correspondence in later, so identical cases scored 6 one time and 0 the next. NEW: a debounced re-score observer watches the correspondence text and re-runs the suggestion while none has been shown yet - it never replaces a shown suggestion and never re-shows one after Dismiss. Keyword changes (all tested in simulation): appIssue drops 'relay app'/'mobile app' (they fired on the Tech-queue subject line on every case) and gains 'experiencing glitches'/'glitches'; contracts drops bare 'contract' (it fired on the "VRID/Tour/Block/Contract ID:" header); Suspended gains reinstatement/revocation/load-board-access wording; Performance gains dispute wording ('performance impact', 'app malfunction', 'controllable', 'carrier controllable', 'negative performance impact', "shouldn't affect", 'company performance', 'is not late'); In-Transit gains timestamp/missing-timestamp/still-showing/empty-move/schedule-error/transit-time wording plus 'came as unexpected'; Assets gains trailer-space wording ('not enough room', 'cube out', 'tractor'); Submit BOL gains 'upload the bol'/'bol for drop'; Missing BOL gains 'pod are missing'/'pod is missing'; 'close my account' moves from Cancel to Close Account Verify (J.T. answered a plain close request with Verify); arc drops 'crash' (crash-delay cases go to In-Transit); Site Escalation gains 'still on the train'; Call Back gains 'callme'; Trailer Defect gains 'container is damaged'/'container damaged'/"trailer's issue"; Driver Verification gains 'account is still not verified'; Bank gains 'update my profile'; Payment Dispute gains 'compensation'. No buttons, responses, dropdowns or logging changed. v2.21 is untouched as the fallback.
    11/10/2026: Personal vs Team split (v2.21, per J.T.): this file is now the PERSONAL version, for J.T. only. @name is now "... — J.T. Personal" so it is unmistakable in the Tampermonkey dashboard, the report footer carries a purple "J.T. Personal" badge while the bar is running, and the file is named Support-JT-Personal-v2.21.user.js. Nothing else changed from v2.20: suggestion + case logging (reopen rows, non-canned auto-log) are in this file only. The TEAM version is Support-Team-v2.14.user.js - the plain v2.14 code with no suggestion and no logging. Because the @name changed, Tampermonkey sees this as a new script: delete the v2.20 entry first if you installed it, then install this one. Do NOT install both the Personal and Team Support scripts at once - they would build two bars on the same queue.
    11/10/2026: Reopen rows + non-canned auto-log (v2.20, per J.T.): (1) Reopens: the log no longer overwrites by case ID - every button click is now its own row (exact duplicates within 60 seconds are still skipped, so a double-click does not log twice). Each entry now also carries threadTail (the last 1,000 chars of the thread, so a reopen message is not cut off by the first-1,000-char excerpt) and isReopen (true when the thread contains reopen wording like "not solved", "still no solution", "still waiting", "didn't work", "issue persists"). (2) Non-canned replies: the script now watches for clicks on the Review button. When you send a reply that does not match any canned template, it auto-logs a row with actualButton "Custom reply", outcome "custom", and replyExcerpt (the first 500 chars of what you wrote) so Scout can see what you actually said and whether a button should exist for it. If the reply matches a canned template and that button was already logged for the case in the last 10 minutes, nothing extra is logged. Note: logging happens on the Review click, the closest observable send step - if you open Review to preview and back out without sending, that row is a false log. CSV gains isReopen, threadTail and replyExcerpt columns. v2.19 is untouched as the fallback.
    11/10/2026: Backfill analysis + NEW "Trailer Defect" button (v2.19, per J.T.): Scout analyzed the 500-case backfill export (2026-11-10). 468 of 500 replies matched a canned template; the suggestion was right only 44 times on the 212 cases with a readable carrier message (24%), so the keywords below were retuned from the actual carrier wording. Measured on those 212 cases, the keyword retune alone moves correct suggestions 44 -> 64 and missed suggestions 100 -> 78 (wrong 38 -> 40). With the new Trailer Defect button added, 7 defect cases that used to point at Assets/Call Back now point at Trailer Defect instead (its intended new home), so against the old buttons the file scores 58 correct / 45 wrong - those 7 are the new button working, not errors. NEW BUTTON: "Trailer Defect" (id trailerDefect, TRIPS & OPERATIONS group, green) - the clearest uncovered trend was carriers reporting a physical defect on an Amazon trailer/container at pickup or delivery (missing mudflap, loose door hinges, air leak, damaged tire rim, missing door, broken chassis, mechanical/container issue; 11 clear cases in the 500, previously split between Assets and Call Back). Its response asks for trailer number, VRID, location and photos and to complete the DVIR, and points to a case under Topic: Asset - the same resolution path as the Assets button, with defect-specific wording. Dropdown mapping is the same as Assets: Reason Category "In-Transit Issues" (37058497991), Reason Code "On-Site Issues (ROC)" (39474113041). Keyword additions (all tested on the backfill): Assets adds asset-registration wording; Suspended adds reinstatement/reactivation/account-closed/BASIC-scores wording; Performance adds score-dropped/score-remained/trip-completion-status/late wording; Call Back adds please-call/call-me/please-confirm; Payment Dispute adds didn't-get-paid/rate-per-mile; Missing BOL adds waybill; Driver Verification adds selfie mis-match/identity wording; Site Escalation adds kingpin-lock/parking-fee/gate-refusal wording; Contracts adds dedicated-contract/closed-node; Patience (had none) adds still-waiting/still-no-solution/any-update wording for follow-up cases; RLB adds "post a truck". Note for the next backfill: 209 of the 500 logged cases had no readable carrier message in the export (the logger was reading the page header instead of the quoted carrier email), so the real suggestion rate on live cases is better than the 44/468 in this file suggests - Scout Case Logger v1.3 fixes that extraction.
    11/10/2026: Case logger + export (v2.18, per J.T.): NEW. Every canned-button click now auto-logs that case to the browser only (localStorage, nothing leaves the machine): case ID, date, queue, carrier message excerpt, button actually used, what was suggested, and right/wrong/missed. A report footer at the bottom of the bar shows the logged count and has Export JSON, Export CSV, "Log this case" (for a completed case you open later - it matches your reply against the canned templates), and Clear log buttons. Upload the exported file to Scout to refine the suggestion keywords. v2.17 is untouched as the fallback.
    11/10/2026: Suggestion tuning (v2.17, per J.T.): added "traffic" and "delay" to the In-Transit keywords. Removed reading the subject line (and page title) - it is static across issues and was adding noise; the suggestion now reads only the carrier's message in the correspondence body. No other logic changed.
    11/10/2026: Suggestion color (v2.16, per J.T.): suggestion highlight changed from orange to purple (#7c3aed), so it cannot be confused with the orange switch buttons. Suggestion line is now pale purple with a purple border; the "Use it" button is purple. Switch buttons stay orange. No logic changed from v2.15.
    11/10/2026: Case suggestion (v2.15, per J.T.): NEW, suggest-only. The script now reads the case subject + carrier message, scores it against keyword lists for each button, and if one button clearly wins it highlights that button with a "Suggested" badge and shows a "Suggested: <button> - matched '<phrase>'" line at the top of the bar, with a "Use it" button (clicks the suggested button, same as clicking it yourself) and a "Dismiss" button. It NEVER clicks, inserts, or sends anything on its own. If no button clearly wins, it shows "No clear suggestion - pick a button below." and highlights nothing. v2.14 is untouched - keep it installed as the fallback if v2.15/v2.16 misbehave; disable v2.16 and re-enable v2.14 to roll back.
    11/04/2026: Safety Score button (v2.14, per J.T.): renamed the BASICs button to 'Safety Score Not Compliant' (same id basicsCompliant, so no duplicate button), re-keyed its dropdown mapping to the new button text, and replaced its canned response with the expanded FMCSA version. Dropdown values unchanged: Performance / Dispute.
    11/04/2026: 3-way switch (per J.T.): generalized from 2-way to Support / Tech / Auctions. Switch buttons now live in a shared bottom-right tray inside any native bar, so two switches never overlap. Back button returns to whichever bar was hidden. Bar chrome unified (sticky full-width, same switch/back styling). Buttons, responses, dropdown mappings and signatures unchanged — dropdown work is still to come.
    11/04/2026: Second gate (v2.12, per J.T.): added rcm-support@amazon.com
    as a second allowed queue, so the Support bar now also builds natively
    on RCM cases (previously only r4c-support@amazon.com passed the gate,
    so RCM cases showed neither bar). Tech script is untouched — its gate
    is relay-feedback@amazon.com, so no double-bar conflict on RCM.
    10/31/2026: Squished-buttons fix (v2.11, per J.T.): unhideOtherBar
    used to restore a hidden native bar with display='' (block), losing its
    flex column layout — so after switching back, the groups collapsed and
    the buttons looked squished together. It now restores display='flex'
    explicitly, so the bar comes back with its original layout intact.
    10/31/2026: Back button location (v2.10, per J.T.): the top-left "Back to"
    button in the override bar is removed. Instead, the override bar gets a
    single button at its bottom-right corner, labelled "Back to Tech
    responses", in the same spot as the original switch button. Clicking it
    restores the native bar, whose original switch button (hidden with it)
    becomes visible again. Override clicks remain text-only.
    10/31/2026: Switch button location (v2.9, per J.T.): page bottom-right chip
    removed. The switch now lives ONLY inside the native bar, at its bottom-right
    corner, as an out-of-flow (absolute) button — so it does not add a row,
    change the bar height, or change the spacing of the existing buttons.
    Override clicks remain text-only.
    10/31/2026: Switch button back to bottom-right (v2.8, per J.T.'s preference):
    the top strip is replaced by a small fixed button at the bottom-right
    corner, labelled "Switch to Support responses". The switch button inside
    the native bar (v2.7) is kept as well. Chip is still always shown on load.
    Override clicks remain text-only.
    10/31/2026: Switch button inside the native bar (v2.7): the top strip could
    be wiped by a page re-render even when the native bar survived. This
    version also polls for the other script's bar and, when it appears,
    appends an orange "Switch to Support responses" button inside that bar
    itself (at the bottom), so the switch lives with the bar that survives.
    Clicking it still builds this bar, hides the native bar, and the Back
    button restores it. Override clicks remain text-only.
    10/31/2026: Override chip always shown (v2.6): the chip no longer depends on
    the queue gate to appear — it is shown on page load on every case, so a
    gate-read failure cannot hide it. Clicking it still builds this bar,
    hides the native bar, and the Back button restores it. Override clicks
    remain text-only.
    10/31/2026: Override chip moved to top (v2.5): the switch button was a small
    bottom-right chip and could be missed or covered. It is now a bright,
    full-width strip at the very top of the page, labelled "Switch to Support
    responses". Clicking it still builds this bar, hides the native bar, and
    the Back button restores it. Override clicks remain text-only.
    10/31/2026: Override text-only (v2.4): when the override chip has been used,
    a button click now only inserts the canned message — it does not touch
    the Reason Category / Reason Code dropdowns and does not click Review.
    Native (non-override) buttons are unchanged: insert + auto-select + Review.
    10/31/2026: Override chip (v2.3): when the queue gate does not match, a small
    "Show Support responses anyway" chip appears (bottom-right). Clicking it
    builds this bar on the other queue's case, hiding the native bar (not
    removing it). A "Back to Tech responses" button at the top of the
    override bar restores the native bar. Override bars skip the lock-case
    step (the native script already locked the case). As of v2.4, override
    button clicks are text-only (see above); native buttons keep their
    normal insert + auto-select + Review flow.
    10/30/2026: Text cleanup (v2.2): canned messages only — misspellings,
    grammar, and sentence/paragraph spacing fixed; greetings standardized
    to "Dear Valued Carrier," and endings to "Thanks for continuing to
    haul with Relay!" (including moving the Thanks line to the end in
    Background Check and Driver Verification). No button text, mapping,
    URL, email, or code changed.
    10/30/2026: Bar height match (v2.1): the support bar has only 3 rows
    against the tech bar's 5, so it was noticeably shorter. The container
    now has minHeight 154px (the tech bar's measured height on his page)
    with its rows spread evenly, so both bars stand the same height.
    10/30/2026: Same page-move changes as tech v3.7 (v2.0): sticky full-width
    bar inserted at the top of the page flow so Paragon content shifts down
    below it, and #page-sidebar is unpinned (position: absolute) and shifted
    down by the bar's height via a MutationObserver, so the whole page moves
    as one instead of the sidebar staying still.
    10/29/2026: Queue gate (v1.9): the script now reads the Queue field and only
    builds its bar / locks a case when the queue is r4c-support@amazon.com,
    so it can stay enabled alongside the tech script without showing two bars.
    If that queue does not appear within 15 seconds, it stays silent.
    8/28/2026: when buttons are clicked the Reason Category and Reason Code are selected automatically.
    08/14/2026 Organized buttons into categories and color coded them.
    06/02/2025 After sev 2 paragon, fixed it to work properly (hope).
    05/29/2025: Added Remove CC'd Emails to script. Added auto-height to signature and response fields.
    */
    // Configuration object
const dropdownMappings = {
    "Safety Score Not Compliant": { category: "Performance", categoryValue: "37058498011", code: "Dispute", codeValue: "39474112881" },
    "CARB":                  { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Insurance":             { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "RLB Access / Visibility": { category: "RLB Access", categoryValue: "39778217681", code: "Load Board Visibility", codeValue: "39474112921" },
    "Suspended":             { category: "RLB Access", categoryValue: "39778217681", code: "Suspended", codeValue: "39474112901" },
    "Driver Verification":   { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Background Check":      { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Domicile":              { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Selfie / Verification": { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Retake 101":            { category: "RLB Access", categoryValue: "39778217681", code: "Suspended", codeValue: "39474112901" },
    "Contracts":             { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Contracts", codeValue: "48827581941" },
    "Pending Verification":  { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Verification Link":     { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Assets":                { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "In-Transit":            { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Submit BOL":            { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Missing BOL":           { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Assign Drivers":        { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Driver Assignment Issue": { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Accident":              { category: "In-Transit Issues", categoryValue: "37058497991", code: "Accident Report", codeValue: "39474113031" },
    "Loss Prevention":       { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Site Escalation":       { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "TONU":                  { category: "Payment Related", categoryValue: "37058498001", code: "Dispute", codeValue: "39474112971" },
    "Load Not Showing":      { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Call Back":             { category: "In-Transit Issues", categoryValue: "37058497991", code: "Call back request", codeValue: "39474113021" },
    "App Issue":             { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Relay Mobile App", codeValue: "48827582041" },
    "Performance":           { category: "Performance", categoryValue: "37058498011", code: "Dispute", codeValue: "39474112881" },
    "Performance Final":     { category: "Performance", categoryValue: "37058498011", code: "Dispute", codeValue: "39474112881" },
    "Payment Dispute":       { category: "Payment Related", categoryValue: "37058498001", code: "Dispute", codeValue: "39474112971" },
    "More Info":             { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Other":                 { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "App + In-Transit":      { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "App + Performance":     { category: "Performance", categoryValue: "37058498011", code: "Dispute", codeValue: "39474112881" },
    "Multiple Cases":        { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "DOT/DPS Audit":         { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Badge":                 { category: "In-Transit Issues", categoryValue: "37058497991", code: "Badge Request", codeValue: "39474113121" },
    "Patience":              { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Contact MMPM":          { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Scorecard":             { category: "Performance", categoryValue: "37058498011", code: "Training", codeValue: "39474112891" },
    "Close Account Verify":  { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Close Account FRL":     { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Load Board Fluctuation": { category: "RLB Access", categoryValue: "39778217681", code: "Load Board Visibility", codeValue: "39474112921" },
    "Solicitation":           { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Update Bank Info":       { category: "Payment Related", categoryValue: "37058498001", code: "Update Banking Info", codeValue: "39474112991" },
    "UIIA":                   { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Auction Support":        { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Add Admin/Dispatcher":   { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Add Driver":             { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Invite Not Received":    { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Email Already In Use":   { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Remove User":            { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Change User Role":       { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Dispatcher No Payout":   { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "User Missing Trips":     { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Portal Login Trouble":   { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Account Access":        { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Transfer Role":          { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Super Admin Left Company":{ category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Driver Can't Log In":    { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Relay Mobile App", codeValue: "48827582041" },
    "Driver Not Seeing Load": { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Relay Mobile App", codeValue: "48827582041" },
    "Trailer Defect":         { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },

};
function setDropdownValue(dropdownId, value, displayName) {
    const dropdown = document.querySelector('#' + dropdownId);
    if (!dropdown) {
        console.warn('Dropdown #' + dropdownId + ' not found');
        return false;
    }

    // Open the dropdown first
    var trigger = dropdown.querySelector('.dropdown-trigger') ||
                  dropdown.querySelector('.header-row') ||
                  dropdown.shadowRoot?.querySelector('.dropdown-trigger');
    if (trigger) {
        trigger.click();
    }

    // Wait for dropdown to open, then click the correct option
    setTimeout(function() {
        // Find and click the matching option
        var options = dropdown.querySelectorAll('kat-option, .option-row, li');
        var found = false;
        options.forEach(function(opt) {
            if (opt.getAttribute('value') === value || opt.textContent.trim() === displayName) {
                opt.click();
                found = true;
                console.log('Clicked option: ' + displayName + ' (' + value + ')');
            }
        });

        // Fallback: if no option was found by click, set it directly
        if (!found) {
            dropdown.value = value;
            console.log('Fallback set ' + dropdownId + ' to: ' + displayName + ' (' + value + ')');
        }
    }, 300);

    return true;
}

function autoSelectDropdowns(buttonLabel) {
    const mapping = dropdownMappings[buttonLabel];
    if (!mapping) {
        console.warn('No dropdown mapping found for button: ' + buttonLabel);
        return;
    }

    // Step 1: Set the Reason Category dropdown
    setDropdownValue('resolutionCategoryFormDropdown', mapping.categoryValue, mapping.category);

    // Step 2: Wait for the Reason Code dropdown to update its options, then set it
    setTimeout(function() {
        setDropdownValue('resolutionReasonFormDropdown', mapping.codeValue, mapping.code);
    }, 800);
}


(function() {
    'use strict';
    const config = {
buttonGroups: [
    {
        name: 'ACCOUNT & COMPLIANCE',
        backgroundColor: '#0b66c3',
        hoverColor: '#084a8c',
        labelColor: '#0b66c3',
        buttons: [
            { id: 'basicsCompliant', text: 'Safety Score Not Compliant' },
            { id: 'carb', text: 'CARB' },
            { id: 'insurance', text: 'Insurance' },
            { id: 'rlb', text: 'RLB Access / Visibility' },
            { id: 'suspended', text: 'Suspended' },
            { id: 'Driververification', text: 'Driver Verification' },
            { id: 'BGCheck', text: 'Background Check' },
            { id: 'Domicile', text: 'Domicile' },
            { id: 'selfie', text: 'Selfie / Verification' },
            { id: 'retake', text: 'Retake 101' },
            { id: 'contracts', text: 'Contracts' },
            { id: 'pending', text: 'Pending Verification' },
            { id: 'link', text: 'Verification Link' },
            { id: 'assets', text: 'Assets' },
            { id: 'Solicitation', text: 'Solicitation' },
            { id: 'bank', text: 'Update Bank Info' },
            { id: 'uiia', text: 'UIIA' },
            { id: 'auctionSupport', text: 'Auction Support' },
        ]
    },
    {
        name: 'SUPPORT & GENERAL',
        backgroundColor: '#6b7280',
        hoverColor: '#4b5563',
        labelColor: '#6b7280',
        buttons: [
            { id: 'appIssue', text: 'App Issue' },
            { id: 'performance', text: 'Performance' },
            { id: 'performanceFinal', text: 'Performance Final' },
            { id: 'paymentDispute', text: 'Payment Dispute' },
            { id: 'moreinfo', text: 'More Info' },
            { id: 'other', text: 'Other' },
            { id: 'appintransit', text: 'App + In-Transit' },
            { id: 'appperformance', text: 'App + Performance' },
            { id: 'Multi', text: 'Multiple Cases' },
            { id: 'DOTDPS', text: 'DOT/DPS Audit' },
            { id: 'badge', text: 'Badge' },
            { id: 'patience', text: 'Patience' },
            { id: 'middlemile', text: 'Contact MMPM' },
            { id: 'scorecard', text: 'Scorecard' },
            { id: 'close', text: 'Close Account Verify' },
            { id: 'loadboard', text: 'Load Board Fluctuation' },
            { id: 'cancel', text: 'Close Account FRL' }
        ]
    },
    {
        name: 'SUPER ADMIN ISSUES',
        backgroundColor: '#ea580c',
        hoverColor: '#c2410c',
        labelColor: '#ea580c',
        buttons: [
            { id: 'addAdminDispatcher', text: 'Add Admin/Dispatcher' },
            { id: 'addDriver', text: 'Add Driver' },
            { id: 'inviteNotReceived', text: 'Invite Not Received' },
            { id: 'emailAlreadyInUse', text: 'Email Already In Use' },
            { id: 'removeUser', text: 'Remove User' },
            { id: 'changeUserRole', text: 'Change User Role' },
            { id: 'dispatcherNoPayout', text: 'Dispatcher No Payout' },
            { id: 'userMissingTrips', text: 'User Missing Trips' },
            { id: 'portalLoginTrouble', text: 'Portal Login Trouble' },
            { id: 'accountAccess', text: 'Account Access' },
            { id: 'transferRole', text: 'Transfer Role' },
            { id: 'superAdminLeftCompany', text: 'Super Admin Left Company' },
            { id: 'driverCantLogIn', text: "Driver Can't Log In" },
            { id: 'driverNotSeeingLoad', text: 'Driver Not Seeing Load' },
        ]
    },
    {
        name: 'TRIPS & OPERATIONS',
        backgroundColor: '#2e8b57',
        hoverColor: '#22663f',
        labelColor: '#2e8b57',
        buttons: [
            { id: 'intransit', text: 'In-Transit' },
            { id: 'submitBol', text: 'Submit BOL' },
            { id: 'MissingBOL', text: 'Missing BOL' },
            { id: 'assigndrivers', text: 'Assign Drivers' },
            { id: 'driverassignmentissue', text: 'Driver Assignment Issue' },
            { id: 'arc', text: 'Accident' },
            { id: 'lossprevention', text: 'Loss Prevention' },
            { id: 'siteescalation', text: 'Site Escalation' },
            { id: 'tonu', text: 'TONU' },
            { id: 'load', text: 'Load Not Showing' },
            { id: 'CallBack', text: 'Call Back' },
            { id: 'trailerDefect', text: 'Trailer Defect' }
        ]
    }
],
buttonStyle: {
    backgroundColor: '#0066c0',
    hoverColor: '#004b8c',
    textColor: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    margin: '0',
    fontSize: '12px'
},

containerStyle: {
    // Sticky, in the page flow: full width, Paragon's content shifts down
    // below the bar instead of sitting behind it, and the bar stays pinned
    // at the top while scrolling.
    position: 'sticky',
    top: '0',
    left: '0',
    right: '0',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    justifyContent: 'space-evenly',
    minHeight: '154px',
    zIndex: '9999',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '3px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}
};
    // Response templates
    const responses = {
        assets: `Dear Valued Carrier,

Thank you for reaching out. For inquiries related to assets, please navigate to the Relay Support Center via your Relay account and create a case under the Topic: Asset. Our support team will review your case and follow up accordingly.

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
                bank: `Dear Valued Carrier,

Thank you for reaching out to Amazon Relay Support.

For changes to bank account information, tax details, or other account payment issues, please send your request directly to our accounts payable team at aprelay@amazon.com. Please include your SCAC and company name in the email so they can locate your account and assist you promptly.

That team specializes in banking and payment-related account updates and will be able to process your request.

For additional resources, please visit:

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
                Solicitation: `Dear Valued Carrier,

Thank you for reaching out and sharing your company's capabilities. We appreciate your interest in supporting Amazon's transportation needs.

This support channel is dedicated to assisting carriers with account and operational inquiries. For capacity and freight opportunities, we encourage you to explore the Amazon Relay self-service portal directly:

To get started or sign up with Relay: https://relay.amazon.com/get-started
To browse and book available loads: Log in to your Relay account and visit the Load Board
If your company is already registered with Relay, you can find and book available opportunities directly through the portal. If you are not yet registered, the link above will walk you through the sign-up process.

For additional resources, please visit:

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
                loadboard: `Dear Valued Carrier,

Thank you for reaching out regarding your Relay Load Board visibility.

Load Board availability is dynamic and fluctuates based on several factors, including current network demand, regional capacity needs, seasonal volume shifts, and how loads are matched to carrier profiles. It is normal to see variation in the types and volume of loads available at any given time, and periods of reduced visibility for certain load types do not necessarily indicate an issue with your account.

To help ensure you are seeing the broadest range of available loads, we recommend the following:

Confirm your equipment type settings in Relay are accurate and reflect all equipment you are able to operate
Review and update your domicile locations to ensure they align with the areas you are actively servicing
Verify your Post A Truck preferences are current and reflect your real-time availability and capacity
Check that your filters on the Load Board are not unintentionally narrowing your results
Maintain strong performance scores, as higher Relay Performance Scores may provide broader access to available loads
Load availability can change frequently throughout the day, so checking the Load Board at different times may also help capture newly posted loads.

For additional resources and tips on optimizing your Load Board experience, please visit:

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning
If you continue to experience concerns after reviewing the steps above, please do not hesitate to open a new support case through the Relay Support Center for further assistance.

Thanks for continuing to haul with Relay!`,
                load: `Dear Valued Carrier,

Thank you for reaching out regarding this load. We understand the urgency and want to help you get moving as quickly as possible.

If you received an email confirmation that the load was booked but it is not appearing in your upcoming trips, please try the following steps:

Log out and log back in to both the Relay dispatcher app and the browser portal.
Check your trip filters — ensure no date or status filters are hiding the load from your view.
Verify the load ID matches exactly what was confirmed in your booking email.
Ensure your app is updated to the latest version available.

If the load still does not appear after completing these steps, this may be a system sync issue that requires further investigation from our technical team.

Self-Escalation Options:

For immediate live support, use the "Request a Call Back" feature within the Relay app to connect with our operations team directly.

To submit a new support case, visit the Relay Support Center: https://relay.amazon.com/cases/sc/help — select "App Issue" or "In-Transit" as the topic and include your load ID and a screenshot of your booking confirmation email.

For additional resources and FAQs, visit the Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
               cancel: `Dear Valued Carrier,

Thank you for reaching out. We understand you'd like to close your Relay account and that you're aware this action is permanent.

To proceed, please email the following team directly with your closure request:

amazon-engagement@amazon.com

In your email, please include:

Your SCAC code and DOT number
A statement confirming you'd like your account closed
Confirmation that you understand this cannot be reversed
The team will review your request and reach out directly if they have any questions.

For any additional support in the meantime, please visit:

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
                scorecard: `Dear Valued Carrier,

We want to ensure you have a clear understanding of how your Relay Performance Scorecard works so you can monitor and improve your performance while hauling with Amazon Relay.

What is the Scorecard?

The Relay Performance Scorecard is a performance evaluation system that measures how effectively your company executes tendered loads. Your score determines your booking access and hauling opportunities — higher scores unlock more opportunities, while lower scores may restrict access.

How Your Score is Calculated

Your performance score is calculated every six weeks using your most recent hauling data across four key metrics. Your overall grade is determined by the lowest score among the four metrics — meaning your weakest metric sets your overall grade.

The Four Key Metrics:

On-Time Performance — Measures how well your company delivers loads on time to both origin and destination. Loads that arrive within the scheduled time window with no carrier-controlled delays are considered compliant.

Acceptance — Measures the percentage of tendered contracts, blocks, and loads that are accepted and successfully executed. Rejections due to carrier-controllable reasons negatively impact this score. Rejections less than 0 hours from execution impact scores 8x more heavily.

App Usage — Measures how well drivers use the Relay mobile app. This is split equally between:

Location Availability (50%) — Keeping location services active during load execution
App Steps Completion (50%) — Completing all required in-app steps: Check-in at Origin, Attach Trailer, Depart at Origin, and Arrive at Destination
Disruption-Free — Measures how well loads are executed without interruption. Two disruption types are tracked:

Driver Not Assigned (DNA) — Occurs when a driver is not assigned within 5 hours of scheduled arrival. We recommend assigning drivers at least 12 hours before pickup.
Trailer/Tractor Not Moving (TNM) — Triggered when the unit remains stationary beyond the built-in threshold for driver breaks.
Understanding Active Weeks

Your score is based on your last 6 active weeks of performance. An active week is any week in which your company has executed, rejected, or cancelled at least one load. If you have fewer than 6 active weeks in the last 13 months, your performance score will not be displayed.

Grades and What They Mean

Your overall score ranges from 0–100% and translates to a letter grade.

Reason Codes

Each defect is classified by controllability:

CC (Carrier Controlled) — Issue caused by your company's actions; impacts your score
AC (Amazon Controlled) — Issue caused by Amazon operations; does NOT impact your score
UC (Uncontrollable) — External factors beyond anyone's control (e.g., severe weather); does NOT impact your score
How to View Your Scorecard

Log in to your Relay account and click "Scorecard" in the left navigation bar. From there you can:

View your overall grade and individual metric scores
Use filters (Timeframe, Week, Load Type, Domicile) to drill into specific data
Toggle "Preview Score" to see your upcoming week's projected score
View individual driver performance breakdowns
Export detailed data as Excel reports
Disputing a Defect

If you believe a defect was not carrier-controlled, you can dispute it directly from your Scorecard:

Navigate to the specific metric detail page
Click "Enter Reason" within 72 hours of the delay to document your perspective
Once the "Dispute" button appears, click it to submit your dispute (available for 14 days from the delay)
Your dispute will be reviewed and the outcome updated on your Scorecard

Tips for Maintaining a Strong Score:

Assign drivers at least 12 hours before pickup
Ensure drivers keep the Relay App open with location services ON for the entire trip
Complete all app steps (check-in, attach trailer, depart, arrive)
Report delays and disruptions to ROC promptly using the "Request a call back" feature
Reject loads at the block level as early as possible if capacity changes
Use the Relay Support Center to request contract cancellations if needed
For additional resources on improving your performance, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

For support with any questions, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

If you believe your score does not accurately reflect your performance, you can submit a dispute directly through your Scorecard or create a support case through the Relay Support Center.

Thanks for continuing to haul with Relay!`,
                middlemile: `Dear Valued Carrier,

Thank you for reaching out! We'd be happy to help connect you with the right support.

To ensure we get you to the correct team as quickly as possible, could you let us know a bit more about what you need assistance with? For example:

Performance-related questions (RPS score, on-time metrics, rejections)
Contract or lane questions
A specific VRID or load issue
General account support
In the meantime, many common questions can be answered through our self-service resources:

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

If your question is performance-related, you can also submit a performance dispute directly through your Relay Scorecard by reviewing the specific metric and clicking the "Dispute" button on the right side of the load details.

Once we understand your needs, we'll make sure the appropriate team follows up with you directly.

Thanks for continuing to haul with Relay!`,
                patience: `Dear Valued Carrier,

Thank you for reaching out. We want to assure you that your case has been received and is in our queue. Our team processes cases in the order they are received, and we appreciate your patience as we work through each one.

In the meantime, please keep an eye on your email for any updates or follow-up communications from our team regarding your case.

While you wait, we encourage you to explore the following self-service resources that may help address your questions:

Relay Learning Center: https://relay.amazon.com/cases/sc/learning
Relay Support Center: https://relay.amazon.com/cases/sc/help

If your issue requires immediate attention or you have not received a response within a reasonable timeframe, you may submit a new support case through the Relay Support Center for further assistance.

Thanks for continuing to haul with Relay!`,
          link: `Dear Valued Carrier,

Thank you for reaching out about your ownership documents.

For ownership verification matters, please email the dedicated team directly at:

relay-account-verification@amazon.com

When emailing, please include the following information so they can assist you promptly:

SCAC:
Company Name:
Contact Name:
Description of Issue: Briefly explain which ownership documents you have already submitted and what additional documents (if any) you were asked to provide
Attachments: Re-attach any relevant ownership documents for their review
This team specializes in account and ownership verification and will be able to guide you through any remaining steps.

For additional resources and self-service support, please visit:

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
                badge: `Dear Valued Carrier,

Thank you for reaching out to Relay Support regarding driver badging.

Please submit your request using the following link:

https://amazonexteu.qualtrics.com/jfe/form/SV_bvFdbH9GdVfIt0O

When submitting your request, please include the following details to help expedite the process:

Driver full name
Driver email
SCAC
Site(s) where badge access is needed
Brief description of the issue or request
A few helpful notes:

All drivers new to a facility will receive a temporary badge at security in order to enter the building for loading.
For permanent badge requests, the Badge Support Team will guide you through the process after you submit the form.
If your driver's badge has been deactivated, the Badge Support Team can review and assist with reactivation steps.
If you need to verify a driver who was previously associated with another carrier or Amazon, the Badge Support Team can check the system and assist.
For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
        DOTDPS: `Dear Valued Carrier,

Thank you for reaching out, and we appreciate your diligence in completing your DOT/DPS Audit.

For documentation requests related to DOT/DPS audits, our Compliance team is best positioned to assist you. Please email atscompliance@amazon.com with the following details so they can locate and provide the appropriate documentation:

Trip ID:
Date:
Lane:
SCAC:
Purpose:

In the meantime, you can also access your trip records and any available load documentation through your Relay account under your trip history.

For additional resources, please visit:

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
          close: `Dear Valued Carrier,

Thank you for reaching out. We're sorry to hear you'd like to close your Relay account.

Before we proceed, we want to make sure you're aware of the following:

Closing your account will remove access to the Relay Load Board, any active or future contracts, and your account history.
Any outstanding payments will still be processed per standard timelines.
If you change your mind in the future, you would need to complete the sign-up process again.
If you'd still like to move forward with closing your account, please confirm by replying to this message with:

Confirmation that you wish to permanently close the account for your company, please list the company's full name and SCAC code.
Confirmation that there are no outstanding loads or active contracts currently assigned.

If you have any other questions or need additional support, please visit our Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
               pending: `Dear Valued Carrier,

Thank you for reaching out, and we appreciate your patience while your business identity verification is being processed.

Verification reviews can sometimes take additional time depending on the volume of submissions. Here are a few steps to confirm everything is in order on your end:

Log in to your Relay account at relay.amazon.com
Navigate to your Account Settings and review the verification section
Confirm that all requested documents have been uploaded and that no additional action items are flagged
Check the email associated with your account for any messages from Relay regarding next steps or additional documentation requests — including your spam/junk folder

If you have confirmed all steps are complete and the status still shows "pending," please reply to this case confirming that, and we will escalate internally for further review.

For additional support and resources, please visit:

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
        retake: `Dear Valued Carrier,

Thank you for reaching out. To regain access to the Relay Load Board, you will need to complete the Relay Onboarding for Carriers course (Relay 101). Below are step-by-step instructions:

Step 1: Log in to your Relay account at relay.amazon.com

Step 2: Navigate to the Learning Center by selecting it from your account menu, or go directly here: https://relay.amazon.com/learning?openCourse=d7811415-deb6-4da4-82a1-62791a8969c7&ref=owp_nav_learning_center

Step 3: Locate the "Relay Onboarding for Carriers" course (approximately 40 minutes)

Step 4: Complete all modules within the course

Step 5: Once the course is marked as complete, your Relay Load Board access will be enabled

Important Notes:

The course must be completed by the carrier admin on the account
Please ensure you complete all sections — partial completion will not unlock access
If you experience any issues accessing the course, please submit a support case through the Relay Support Center
For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay!`,
         Multi: `Dear Valued Carrier,

Thank you for reaching out. This inquiry has already been addressed on Case #[NUMBER]. To ensure continuity and timely resolution, all further communication regarding this matter should be submitted on that existing case.

You can access and respond to your open cases through the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay!`,
         appperformance: `Dear Valued Carrier,

Thank you for reaching out. Below you'll find guidance for resolving Relay app issues and submitting a performance dispute.

Relay App Troubleshooting
If you are experiencing issues with the Relay app, we recommend the following steps:

Close and restart the app — Swipe the app closed completely, then reopen it
Restart your device — Power the device off and back on
Update the app — Ensure you are running the latest version from your device's app store
Verify operating system compatibility:
Android: Version 7.0 or higher
iPhone (iOS): Version 9.0 or higher
If the issue persists, submit feedback directly through the app:

Select "Give Feedback" → Choose "Relay App" as the topic → Describe the issue
This helps our product team identify and resolve technical concerns.

Still experiencing issues? Navigate to the Relay Support Center via your Relay account and create a case under: Relay App & Web Portal Tech Support.

Performance Dispute Process
If you believe your performance score was impacted by circumstances outside of your control, you have the option to submit a dispute.

How to Submit:

Navigate to the Performance page in your Relay portal
Locate the applicable Tour ID / VRID
Click the "Dispute" button next to the load details
Provide objective supporting evidence as to why the issue was outside of your control
Important Guidelines:

Submit disputes within 14 days of load completion
Supporting documentation (e.g., screenshots, timestamps, relevant details) strengthens your case
The performance dispute team will review your submission and provide a decision
Appeal Process: If you do not agree with the initial decision, you have one opportunity to appeal by replying directly on the same case. Please include any additional supporting evidence with your appeal.

Helpful Resources
Performance Disputes: https://relay.amazon.com/cases/sc/help/search/details?detailProps=JTdCJTIydHlwZSUyMiUzQSUyMkNPVVJTRSUyMiUyQyUyMmlkJTIyJTNBJTIyZjI0YzMwNTYtOWJkMi00ZmUxLThkOGMtMWM2MmFiYjUxNmE2JTIyJTdE
Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
          BGCheck: `Dear Valued Carrier,

Thank you for reaching out regarding your background check status.

The timing of completion depends on a number of factors, including previous residential history, court turnaround times, and response to any requests for additional information. Checks take an average of 6 days but may take longer depending on these variables.

While your check is in progress, please take the following steps:

Monitor your email (including spam/junk folders) for any messages from the background check provider or Amazon. If additional information has been requested and not yet provided, this may be contributing to the delay.

Check your Driver Roster in Relay at https://relay.amazon.com/drivers — your background check status will display there. If the status shows "Email response required," there may be a pending action on your end.

If you've confirmed all of the above and the status still shows "in review," please email Relay-driver-verification-checks@amazon.com with your SCAC and the driver's name, and the verification team will be able to look into this further for you.


For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
          appintransit: `Dear Valued Carrier,

Thank you for reaching out. Below you'll find guidance for resolving Relay app issues and accessing in-transit trip support.

Relay App Troubleshooting
If you are experiencing issues with the Relay app, we recommend the following steps:

Close and restart the app — Swipe the app closed completely, then reopen it
Restart your device — Power the device off and back on
Update the app — Ensure you are running the latest version from your device's app store
Verify operating system compatibility:
Android: Version 7.0 or higher
iPhone (iOS): Version 9.0 or higher
If the issue persists, submit feedback directly through the app:

Select "Give Feedback" → Choose "Relay App" as the topic → Describe the issue
This helps our product team identify and resolve technical concerns.

Still experiencing issues? Navigate to the Relay Support Center via your Relay account and create a case under: Relay App & Web Portal Tech Support.

How to Get In-Transit Trip Support:

Navigate to the "Trips" tab in the Relay portal
Select the trip needing support
Click "Ask a question"
Select the specific load
Describe the issue and follow the prompts
How to Report a Delay:

If you are experiencing a delay, you can report it directly in the Relay portal:

Navigate to Trips > In Transit
Click on the trip that is delayed
Select "Report delay"
Complete the form with the updated ETA and the reason for the delay
Reporting delays promptly helps support your On-Time Performance score.

Trip Completion Status Disputes:

If you need to dispute a trip completion status, please navigate to the Relay Support Center via your Relay account and create a case under the Topic: Relay Trip Completion Status Dispute.

If your trip is stuck in-transit and the above steps do not resolve the issue, you can send an email to Relay-tripstatus-disputes@amazon.com. Please make sure to include your VRID and any relevant details about the situation (e.g., if you were verbally released from a load). The team will process the necessary updates in the system.

Helpful Resources:

Relay Assistant for In-Transit Trips: https://relay.amazon.com/learning?filterCriteria=Relay%20Assistant%3A%20Trip%20Support&openCourse=4eb24a0b-6896-4d50-8dee-5c4451b93841&ref=owp_nav_learning_center
Relay Assistant for Drivers: https://relay.amazon.com/cases/sc/help/search/details?detailProps=JTdCJTIydHlwZSUyMiUzQSUyMkNPVVJTRSUyMiUyQyUyMmlkJTIyJTNBJTIyODlmMmFhZmQtNzkyZC00NDBjLTgzNmQtYjdlMjU5MzQ4MjA5JTIyJTdE
Reporting Delays (LTR) for On-Time Performance: https://relay.amazon.com/cases/sc/help/search?query=JTIyUmVwb3J0aW5nJTIwRGVsYXlzJTIwKExUUiklMjBmb3IlMjBPbiUyMFRpbWUlMjBQZXJmb3JtYW5jZSUyMg
Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
      Domicile: `Dear Valued Carrier,

We wanted to share a helpful reminder about finding opportunities on the Relay Load Board.

You do not need to set domiciles in your Relay account to search for loads. The Load Board allows you to search for available loads from any origin or destination using the search filters — regardless of your domicile settings.

Here's how to find loads from any location:

Use the Origin City filter to search for loads departing from any city
Use the Destination City filter to search for loads arriving at any city
Set the Domicile dropdown to "Anywhere" to view all available loads
These filters give you full flexibility to find opportunities that fit your capacity, without needing to add or update domicile settings.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
        CallBack: `Dear Valued Carrier,

Thank you for reaching out regarding this load.

Unfortunately, we are unable to provide callbacks through this support channel. However, if you need live assistance with an active load, you can request a callback directly through the Relay app by following these steps:

Open the Relay Mobile App

Navigate to the load in question

Select "Request a call back" to connect with our live operations team

If your issue is not time-sensitive and does not require a live call, please reply to this email with a description of the specific issue you're experiencing with this load, and we'll be happy to assist or connect you with the appropriate team.

For additional resources, please visit:

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
        Driververification: `Dear Valued Carrier,

Thank you for reaching out regarding your driver verification inquiry.

We recommend the following steps to help resolve this:

Please have the driver check their spam/junk folder for any communications regarding verification next steps.
Confirm the driver's email address is entered correctly in the Relay portal.
If the driver has completed all requirements and still has not received further communication, please have the driver email Relay-driver-verification-checks@amazon.com with their full name, carrier SCAC, and a description of the issue.


For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay!`,

        lossprevention: `Dear Valued Carrier,

Thank you for reaching out. For inquiries related to Loss Prevention, please navigate to the Relay Support Center via your Relay account and create a case under the Topic: Loss Prevention. Our support team will review your case and follow up accordingly.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        siteescalation: `Dear Valued Carrier,

Thank you for reaching out. For site-level concerns — including facility issues, safety events, equipment issues, or carrier behavior incidents — the Relay Site Escalations team is the dedicated team that will investigate and work toward resolution on your behalf. To get your case started, please follow these steps:

Log in to your Relay account
Navigate to the Relay Support Center
Select "Create a Case"
Choose the Topic: Site Escalations
In your case description, please include:
Site code
Date and time of the incident
A brief description of the issue
Any supporting details or documentation you have available

Including these details upfront will help the team begin their review without needing to follow up for additional information, which means a faster resolution for you. Once submitted, the team will review your case and respond in the order cases are received. Please allow time for the team to investigate, and they will reach out directly if they have any questions.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help
For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        trailerDefect: `Dear Valued Carrier,

Thank you for reaching out about the trailer defect.

To get this looked into, please navigate to the Relay Support Center via your Relay account and create a case under the Topic: Asset. In your case description, please include:
Trailer number
VRID
Location where the defect was found
A description of the defect (for example: missing mudflap, loose door hinges, air leak, damaged tire rim, missing door, or broken chassis)
Photos of the defect, if you have them

Please also make sure the DVIR (Driver Vehicle Inspection Report) for the trailer is completed. Including these details upfront will help the team begin their review without needing to follow up for additional information.

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        arc: `Dear Valued Carrier,

Thank you for reaching out. If you need to report an accident or safety incident, please contact the Accident Reporting Central (ARC) directly:

ARC Phone: 856-333-6510

The ARC team is available to assist with accident reporting and next steps. If you do not receive a response within 10 minutes, please try calling again at the same number.

When contacting ARC, we recommend having the following information ready to help expedite the process:

VRID or load number
Date, time, and location of the incident
Brief description of what occurred
For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        other: `Dear Valued Carrier,

Thank you for reaching out. If your inquiry does not fall under a specific listed topic, please navigate to the Relay Support Center via your Relay account and create a case under the Topic: "Other". Our support team will review your case and route it to the appropriate team for further assistance.

To help us address your inquiry as efficiently as possible, please include a detailed description of your concern when submitting your case.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        moreinfo: `Dear Valued Carrier,

Thank you for reaching out. To assist you further and investigate this matter, we kindly ask that you provide the following information:

Load ID / VRID associated with the issue
Screenshot(s) showing the error or issue encountered
Brief description of what occurred, including the date and time
Once we receive these details, our team will review and follow up with next steps.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        driverassignmentissue: `Dear Valued Carrier,

Thank you for your continued patience as we work to support you on this matter. To help resolve the driver assignment issue, please try the following troubleshooting steps:

Step 1 — Hard Refresh & Clear Browser Cache

Before attempting to reassign the driver, please perform a hard refresh of your browser:

Windows/Chrome: Press Ctrl + Shift + R
Mac/Safari or Chrome: Press Cmd + Shift + R
After the hard refresh, clear your browser cache and cookies, then log back into the Relay portal and attempt the driver assignment again.

Step 2 — Try a Different Browser

If the issue persists after the hard refresh, we recommend attempting the driver assignment using Google Chrome, as it is the recommended browser for the Relay portal. If you are already using Chrome, please try an Incognito/Private window to rule out any cached session data.

Step 3 — Confirm Prior Block Status

If the driver recently completed a prior block on this same contract, please verify that the previous block shows a status of Completed in your Relay portal before attempting to assign the driver to the current block. An open or in-progress prior block may prevent the system from accepting a new assignment for the same driver.

Please attempt these steps and let us know if the issue is resolved. If the problem continues after completing all steps above, please reply to this case and we will escalate for further investigation.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        assigndrivers: `Dear Valued Carrier,

Thank you for reaching out. Below are recommended best practices for driver assignment timing to help support your Relay Performance Score:

Driver Assignment Timing Recommendations:

Best Practice: Assign drivers a minimum of 12 hours before pick-up time
Minimum Recommended: Assign drivers at least 5 hours before pick-up time to avoid impact to your "Disruption Free" Relay Performance Score
Important: If a driver is not assigned 3 hours prior to execution for linehaul loads, or 1 hour prior to execution for Delivery Destination Unit (DDU) loads, this may result in a load rejection
How to Assign a Driver:

You can assign a driver to a trip or load at any time through your Relay portal:

Navigate to Trips > Upcoming or Trips > In-Transit
Beside each load or trip, select the dropdown list displaying your available drivers
Select the driver you would like assigned to the load
Assigning drivers early helps ensure smooth execution and supports strong performance scores.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        contracts: `Dear Valued Carrier,

Thank you for reaching out regarding your contract concern.

To ensure your request is reviewed by the appropriate team, please follow the steps below to self-escalate:

For contract questions, modifications, or cancellation requests:

Log in to your Relay account at relay.amazon.com
Navigate to the Support Center
Select Create a Case
Provide the following details in your case:
Your SCAC code
The specific contract or lane(s) affected
A brief description of your concern or request
Any supporting documentation (screenshots, load IDs, etc.)

Our contracts team will review your submission and follow up directly if they have any questions.

Helpful Resources:

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        insurance: `Dear Valued Carrier,

Thank you for reaching out. For inquiries related to insurance compliance — including updates, changes, or questions regarding your insurance documentation — please navigate to the Relay Support Center via your Relay account and create a case under the Topic: Insurance Compliance. Our support team will review your case and provide follow-up assistance.

When submitting your case, we recommend including the following details to help expedite the review:

SCAC (Standard Carrier Alpha Code)
Brief description of your insurance inquiry (e.g., policy update, certificate of insurance question, compliance status)
Supporting documentation, if applicable
For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        intransit: `Dear Valued Carrier,

Thank you for reaching out. For inquiries related to in-transit trips, you can access real-time support directly through the Relay portal by following these steps:

How to Get In-Transit Trip Support:

Navigate to the "Trips" tab in the Relay portal
Select the trip needing support
Click "Ask a question"
Select the specific load
Describe the issue and follow the prompts
How to Report a Delay:

If you are experiencing a delay, you can report it directly in the Relay portal:

Navigate to Trips > In Transit
Click on the trip that is delayed
Select "Report delay"
Complete the form with the updated ETA and the reason for the delay
Reporting delays promptly helps support your On-Time Performance score.

Trip Completion Status Disputes:

If you need to dispute a trip completion status, please navigate to the Relay Support Center via your Relay account and create a case under the Topic: Relay Trip Completion Status Dispute.

If your trip is stuck in-transit and the above steps do not resolve the issue, you can send an email to Relay-tripstatus-disputes@amazon.com. Please make sure to include your VRID and any relevant details about the situation (e.g., if you were verbally released from a load). The team will process the necessary updates in the system.

Helpful Resources:

Relay Assistant for In-Transit Trips: https://relay.amazon.com/learning?filterCriteria=Relay%20Assistant%3A%20Trip%20Support&openCourse=4eb24a0b-6896-4d50-8dee-5c4451b93841&ref=owp_nav_learning_center
Relay Assistant for Drivers: https://relay.amazon.com/cases/sc/help/search/details?detailProps=JTdCJTIydHlwZSUyMiUzQSUyMkNPVVJTRSUyMiUyQyUyMmlkJTIyJTNBJTIyODlmMmFhZmQtNzkyZC00NDBjLTgzNmQtYjdlMjU5MzQ4MjA5JTIyJTdE
Reporting Delays (LTR) for On-Time Performance: https://relay.amazon.com/cases/sc/help/search?query=JTIyUmVwb3J0aW5nJTIwRGVsYXlzJTIwKExUUiklMjBmb3IlMjBPbiUyMFRpbWUlMjBQZXJmb3JtYW5jZSUyMg
Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,


        performance: `Dear Valued Carrier,

Thank you for reaching out. If you believe your performance score was impacted by circumstances outside of your control, you have the option to submit a performance dispute. Below is an overview of the process:

How to Submit a Performance Dispute:

Navigate to the Performance page in your Relay portal
Locate the applicable Tour ID / VRID
Click the "Dispute" button next to the load details
Provide objective supporting evidence as to why the issue was outside of your control
Important Guidelines:

Disputes should be submitted within 14 days of load completion
Supporting documentation (e.g., screenshots, timestamps, relevant details) strengthens your case
The performance dispute team will review your submission and provide a decision
Appeal Process:

If you do not agree with the initial decision, you have one opportunity to appeal by replying directly on the same case. Please include any additional supporting evidence with your appeal.

Helpful Resources:

For additional resources on Performance Disputes: https://relay.amazon.com/cases/sc/help/search/details?detailProps=JTdCJTIydHlwZSUyMiUzQSUyMkNPVVJTRSUyMiUyQyUyMmlkJTIyJTNBJTIyZjI0YzMwNTYtOWJkMi00ZmUxLThkOGMtMWM2MmFiYjUxNmE2JTIyJTdE

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay!`,

        performanceFinal: `Dear Valued Carrier,

Thank you for reaching out, and we understand how important your performance score is to your business.

We are not able to change your performance score from this support queue. If you have already used both dispute options for this trip, that decision is final, and this queue can't change or reopen it. If you have not yet submitted an appeal, you have one opportunity to appeal by replying directly on the original dispute case — please include any additional supporting evidence, such as the VRID of the affected load and photos taken at the time.

The good news is that if you continue to accept and complete trips, this decision will have less of an impact on your score over the next six weeks and will fall off in six weeks.

Thank you for continuing to haul with Relay!`,

        basicsCompliant: `Dear Valued Carrier,

Thank you for reaching out. After reviewing your account, the suspension is due to your company's FMCSA BASIC (Behavioral Analysis Safety Improvement Categories) safety scores not meeting Amazon Relay's safety score requirements. BASIC scores are calculated by the FMCSA based on safety violations, inspections, severity of violations, accidents, timing of violations, and your company's mileage driven. Scores are evaluated on a rolling 24-month window, with violations in the most recent 6 months carrying additional weight. To review your current safety standing, please sign into your Federal Motor Carrier Safety Administration (FMCSA) profile to view your BASIC percentiles: https://ai.fmcsa.dot.gov/SMS

FMCSA BASIC Threshold Guidelines:

To maintain eligibility for hauling with Relay, we recommend ensuring your BASIC percentiles remain below the following thresholds:

> | BASIC Category | Recommended Threshold |
> | Unsafe Driving | Below 60% |
> | HOS Compliance | Below 60% |
> | Vehicle Maintenance | Below 75% |
> | Controlled Substance/Alcohol | Below 75% |
> | Driver Fitness | Below 75% |

Next Steps:

We monitor updates to BASIC scores and will reach out directly once your company's metrics support reinstatement

If you believe any violations are inaccurate, you can submit a DataQs challenge at: https://dataqs.fmcsa.dot.gov

Please note that additional factors beyond FMCSA BASICs may be considered when evaluating eligibility to haul with Relay

For additional information on CSA scores and how to address them, visit: https://relay.amazon.com/blog/csa-scores-what-they-are-how-to-fix-them

In the meantime, we recommend reviewing FMCSA resources to support improvement in your safety metrics: https://csa.fmcsa.dot.gov

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning


Thanks for continuing to haul with Relay!`,

        appIssue: `Dear Valued Carrier,

Thank you for reaching out. If you are experiencing issues with the Relay app, we recommend trying the following troubleshooting steps:

Troubleshooting Steps:

Close and restart the app — Swipe the app closed completely, then reopen it
Restart your device — Power the device off and back on
Update the app — Ensure you are running the latest version of the Relay app from your device's app store
Verify operating system compatibility:
Android: Version 7.0 or higher recommended
iPhone (iOS): Version 9.0 or higher recommended
Provide Feedback:

If the issue persists, we recommend submitting feedback directly through the app:

Select the "Give Feedback" option within the app
Choose "Relay App" as the topic
Describe the issue you are experiencing
This helps our product team identify and resolve technical concerns.

Still Experiencing Issues?

If the troubleshooting steps above do not resolve the issue, please navigate to the Relay Support Center via your Relay account and create a case under the Topic: Relay App & Web Portal Tech Support.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        carb: `Dear Valued Carrier,

Thank you for reaching out. Below is important information regarding California Clean Truck Check (CTC) compliance for carriers operating or seeking to operate within the state of California.

CTC Compliance — Upload Requirements:

Carriers operating or seeking to operate in California are required to verify their Clean Truck Check (CTC) compliance by uploading their CTC certificate(s) into their Relay account.

How to Upload or Update Your CTC Documentation:

Log into your Relay account
Navigate to Carrier Account > Documents > California Compliance
Upload your current CTC certificate(s)
Verification Timeline:

Documentation will be verified within 2 business days of submission
You will receive reminders when verification is needed or when certificates are approaching expiration
California Attestation:

If your company attested during onboarding that you do not operate in California, please note that loads within California state lines will not be available for booking. If your operating status has changed, you can update your attestation by navigating to Carrier Account > Documents > California Compliance.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        tonu: `Dear Valued Carrier,

Thank you for reaching out. Below is information regarding Trip Not Operated Under Load (TONU) payments and the dispute process should a payment discrepancy arise.

TONU Payment Overview:

If Amazon tenders your company a trip but cancels the entire trip less than 2 hours before the scheduled start time due solely to changes in Amazon's needs, your company will receive a flat fee of $175 or the Base Rate, whichever is less. This payment is automated and should process accordingly.

If You Did Not Receive a TONU Payment:

If you believe a TONU payment was not received, please follow these steps:

Review the Payments Guide — Refer to the attached guide starting on page 21 for instructions on how to add missing items for loads not reflected on your invoice
File a Payment Dispute — Submit a Payment Dispute through the Relay portal (see attached guide for detailed instructions)
Payment Dispute Guidelines:

Payment disputes may be filed within 30 calendar days after the applicable invoice is provided to you
The dispute process allows one dispute filing per invoice submission
Once your dispute is reviewed and resolved, you have one opportunity to appeal — please ensure your initial dispute submission is complete with all supporting documentation
For detailed instructions on the appeal process, please refer to page 46 of the Payments guide
Important Note:

If a written dispute is not submitted within the 30-day window, the payment is considered accepted as issued.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        rlb: `Dear Valued Carrier,

Thank you for reaching out. We have reviewed your account and can confirm there are no holds or restrictions in place preventing you from accessing the Relay Load Board. You should be able to view available loads at this time.

Load Availability:

Load volume on the Relay Load Board fluctuates based on network availability. Here are a few things to keep in mind:

Load availability varies throughout the day and week — we recommend checking the Load Board regularly for additional opportunities
High-volume events such as Peak and Prime Days typically offer increased load availability
Maximizing Load Visibility:

To ensure you are seeing the broadest selection of available loads, we recommend reviewing the following:

Filters — Check your current filter settings (domiciles, times, equipment type, etc.) as these directly impact how many loads are visible to you.

Post A Truck — Consider setting up Post A Truck orders, which automatically match available loads to your posted capacity.

Relay Performance Score — Load visibility is primarily based on your company's performance score. We recommend reviewing your score regularly to identify opportunities for improvement. Carriers with strong performance scores typically have access to a broader selection of loads.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        selfie: `Dear Valued Carrier,

Thank you for reaching out. If you believe a driver verification check was completed in error, you have the option to submit a dispute for review. Please follow the steps below:

How to Submit a Driver Verification Dispute:

Log into your company's Relay account
Navigate to the Support Center
Select "Create a new case" under "Submit a new case to Customer Support"
Choose the topic: "Relay Driver Verification Dispute"
Provide a detailed description of the concern, including any supporting documentation
Once submitted, our team will review your case and follow up with next steps.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        paymentDispute: `Dear Valued Carrier,

Thank you for reaching out. If an entire load or trip is missing from your invoice, you can submit a dispute directly through the Relay portal. Please follow the steps below:

How to Add a Missing Item to a Payment Dispute:

Navigate to your most recent invoice in the Relay portal
Select "+ Missing item" located in the upper right corner
Choose the load type from the drop-down menu
Enter the valid load or trip ID associated with the missing payment
After adding your missing item, review any remaining items that need to be included and select "Add to dispute"
Specify the requested payment amount for each item
(Optional) Click the conversation bubble icon on the right side of the amount field to enter additional details regarding your reason for disputing
Once all information is complete, click "Submit dispute"
Important Reminders:

Please ensure all applicable missing items are included before submitting, as the dispute process allows one dispute filing per invoice submission
Include as much supporting detail as possible to help expedite the review process
Once submitted, our team will review your dispute and follow up with a resolution.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        submitBol: `Dear Valued Carrier,

Thank you for reaching out. For assistance with submitting your Bill of Lading (BOL) or Proof of Delivery (POD), please contact the Amazon Freight Payments team directly at:

ap-freight@amazon.com

When reaching out, we recommend including the following details to help expedite your request:

Load ID / VRID associated with the documentation
Type of document being submitted (BOL or POD)
Attached documentation in a clear, legible format (PDF or image)
Our team will review your submission and follow up accordingly.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        suspended: `Dear Valued Carrier,

Thank you for reaching out. We understand your concern regarding your account status. However, account suspension inquiries are handled by a specialized team that has the tools and access to assist you directly.

Next Steps:

Please contact the Account Management team at the following email for further assistance with your suspended account:

Open a new case by emailing relay-am@amazon.com

When reaching out, we recommend including the following details to help expedite your request:

SCAC (Standard Carrier Alpha Code)
Brief description of the circumstances surrounding the suspension
Any relevant documentation that may support your inquiry
The Account Management team will review your case and provide guidance on next steps.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

      MissingBOL: `Dear Valued Carrier,

Thank you for reaching out regarding the missing Bill of Lading (BOL).

BOL documents are available for download directly through your Relay account. Please follow these steps:

Log in to your Relay account at relay.amazon.com

Navigate to the completed trip associated with the VRID.

Select the load details to locate and download the BOL.

If you are unable to locate the BOL through your Relay account, please reply to this email confirming you have attempted the steps above and we will investigate further.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay!`,


        uiia: `Dear Valued Carrier,

Thank you for your interest in hauling intermodal loads with Amazon Relay. Here is an overview of the UIIA certification and the Amazon Relay steps your company will need to complete.

Step 1: Join the UIIA

The Uniform Intermodal Interchange and Facilities Access Agreement (UIIA) is a standard interchange agreement. It collects your insurance certificates and checks your company against the requirements of each equipment provider. You can apply online on the UIIA website (Motor Carriers section). Please have the following ready:

An active US DOT number and Motor Carrier Operating Authority number (if applicable) with FMCSA. The company name on your UIIA application should match the name your DOT and MC numbers are registered under.
An active Standard Carrier Alpha Code (SCAC) with the National Motor Freight Traffic Association.
Your Federal Tax Identification Number.
Insurance submitted online by your insurance agent in the UIIA database. It should meet the UIIA base requirements and the requirements of each equipment provider you plan to work with.
Step 2: Get your addenda through the UIIA

Rail drayage: You need addenda for the railroads at the locations where your company plans to operate.
Port drayage: You need a Flexivan (FLXC) chassis addendum and Ocean Carrier (steamship line) addenda. We recommend getting addenda with all the ocean carriers Amazon works with, so your company has the most load opportunities: CMA CGM (CMDU), Evergreen (EGLV), Hyundai (HDMU), Hapag-Lloyd (HLCU), Maersk (MAEU), MSC (MSCU), Ocean Network Express (ONEY), COSCO Shipping (COSU), Yang Ming (YMLU), ZIM (ZIMU), and OOCL (OOLU).
Step 3: Complete the Amazon Relay steps

To be eligible for intermodal loads on Amazon Relay, your company needs to:

Have an active Amazon Relay account for 30 days or more.
Complete the Intermodal Safety course in the Relay Learning Center.
Keep an Independent UIIA Driver Roster up to date.
Follow the requirements of each rail yard or port where your company operates.
Port drayage only: complete the port self-attestations in Relay under Carrier Account → Company Profile → Certifications.
AFE drayage only: hold a Relay performance score (RPS) of B or higher.
Stay in compliance with the Relay Program Policies, including current insurance and no active safety suspensions.
Step 4: Allow time for your updates to sync

Once the UIIA approves your application and addenda, please allow 24 to 48 hours for the updates to show up in Amazon Relay before booking intermodal loads.

Questions about intermodal certification

For questions about intermodal loads or certification, please email imdlcertifications@amazon.com. Include your company name, SCAC, and a short description of your question.

For questions about the Relay app or portal, please open a case through the Relay Support Center.

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,



        auctionSupport: `Dear Valued Carrier,

Thank you for reaching out about Amazon Relay Auctions. Here's an overview of how they work.

What are Auctions?

Auctions let your company bid on lanes and set the price it wants to haul for. Most auctions are one-way, so they're a good fit for backhauls and for naming your price.

How bidding works

Single or bulk bids: You can bid on one lane or on several lanes at once.
Full transparency: Each auction shows how much time is left and the current leading bid, so you can make informed decisions before you bid.
Who can access Auctions

Access depends on your company's performance grade. A grade needs 6 weeks of performance history hauling for Relay. If you don't see Auctions yet, we recommend reviewing your performance grade in your Relay portal.

Learn more

For a step-by-step walkthrough, see the Auctions course in the Relay Learning Center: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=377045ba-0b0d-4fba-b9ba-fe32d56c2948

If you have a technical issue while bidding, please open a case through the Relay Support Center and select the topic "Relay Auction Support." Include your SCAC, the auction or lane details, and a screenshot of the issue.

Relay Support Center: https://relay.amazon.com/cases/sc/help
Relay Learning Center: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,
        addAdminDispatcher: `Dear Valued Carrier,

As the Super Admin, you can invite Admins and Dispatchers to your company's Relay account. Log in to relay.amazon.com, go to your user management area and send the invite to the person's email address. They will receive an email to finish setting up their account.

If the invite does not arrive, ask them to check their spam folder before you send it again.

You may find this optional Relay Learning Center course helpful:
- Get started with Relay 101: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=70c8bf62-bd37-48a8-bef4-34128b223a60

Thanks for continuing to haul with Relay!`,
        addDriver: `Dear Valued Carrier,

You can invite drivers from the Driver Roster page at relay.amazon.com. Once the driver accepts, they can log in to the Relay mobile app with the same email address.

We recommend that drivers use the latest Relay app version on Android 7 or later, or iOS 13.1 or later.

You may find these optional Relay Learning Center resources helpful:
- Driver Background Check Guide: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=4bcb6fd6-9383-4834-bdb5-20bce34da56b
- How to avoid Automatic Rejections: Asset Not Assigned & No Driver Assigned: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=948c6d87-d6b8-4a91-8a9c-834182a49336

Thanks for continuing to haul with Relay!`,
        inviteNotReceived: `Dear Valued Carrier,

If a user or driver did not receive their Relay invite, we recommend the following:

1. Ask them to check their spam or junk folder.
2. Confirm the email address on the invite is spelled correctly.
3. Send the invite again from relay.amazon.com.

If the invite still does not arrive, please reply to this case with the user's email address, their role (Admin, Dispatcher, or Driver), and the date you sent the invite.

Thanks for continuing to haul with Relay!`,
        emailAlreadyInUse: `Dear Valued Carrier,

A Relay login can be linked to more than one carrier account or role. If you see a message that the email is already in use, the person may already have a Relay account under that email.

We recommend asking the user to log in with their existing credentials. If they need a separate login for your company, please invite them with a different email address.

If the issue continues, please reply to this case with the email address, the role you are trying to assign, and a screenshot of the message.

Thanks for continuing to haul with Relay!`,
        removeUser: `Dear Valued Carrier,

As the Super Admin, you can remove Admins, Dispatchers, and drivers from your company's Relay account at relay.amazon.com. We recommend reviewing your user list regularly so that only current users have access.

If you are unable to remove a user, please reply to this case with the user's email address, their role, and a screenshot of what you see.

You may find this optional Relay Learning Center course helpful:
- Get started with Relay 101: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=70c8bf62-bd37-48a8-bef4-34128b223a60

Thanks for continuing to haul with Relay!`,
        changeUserRole: `Dear Valued Carrier,

Each user on your account has a role: Admin, Dispatcher, or Driver. Admins can see payout information for loads; Dispatchers cannot. Before changing a role, consider what each person needs to see.

As the Super Admin, you can update a user's access at relay.amazon.com. If you are unable to change the role, please reply to this case with the user's email address, the current role, the role you would like, and a screenshot.

You may find this optional Relay Learning Center course helpful:
- Get started with Relay 101: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=70c8bf62-bd37-48a8-bef4-34128b223a60

Thanks for continuing to haul with Relay!`,
        dispatcherNoPayout: `Dear Valued Carrier,

This is expected. Admins can see payout information for loads, but Dispatchers cannot. If this person needs to see payouts, you may consider inviting them as an Admin instead.

Thanks for continuing to haul with Relay!`,
        userMissingTrips: `Dear Valued Carrier,

If domiciles are assigned to a user on the Carrier Profile or Driver Roster page, that user will only see trips that start in those domiciles. As the Super Admin, you can review and update each user's domiciles there.

If the domiciles are correct and trips are still missing, please reply to this case with the Load ID, the user's role, and a screenshot.

Thanks for continuing to haul with Relay!`,
        portalLoginTrouble: `Dear Valued Carrier,

If you are having trouble logging in to relay.amazon.com, we recommend the following:

1. Use the "Forgot password" option on the login page.
2. Clear your browser cache and cookies, then do a hard refresh.
3. Try a different browser.

If you still cannot log in, please reply to this case with your SCAC, the email address on the account, a screenshot of any error message, and the date and time of the attempt.

You may find this optional Relay Learning Center course helpful:
- Get started with Relay 101: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=70c8bf62-bd37-48a8-bef4-34128b223a60

Thanks for continuing to haul with Relay!`,
        accountAccess: `Dear Carrier,

Thank you for reaching out, and we're sorry for the trouble signing in. The right fix depends on what is blocking your sign-in:

If you can still sign in on another device, update the phone number first: sign in at amazon.com with the same email and password you use for Relay, go to Account & Lists, then Your Account, then Login & security. Next to Mobile number, select Edit, enter the new number, and enter the verification code sent to that number. If you are still signed in to the Relay mobile app, please stay signed in for now — signing out may prevent you from getting back in until the phone number is updated.

If your company's DOT and MC numbers appear to be linked to a different Relay account, this has to be reviewed by the team that handles account verification. Please email atscompliance@amazon.com with your company's DOT and MC numbers, the email address you're trying to sign in with, and any other email address that may have been used to register the account.

If your Primary Administrator can't sign in because their Amazon.com account is suspended, the quickest way to restore access is to resolve that suspension first: have the Primary Administrator contact Amazon.com Customer Service about the Amazon.com account suspension and follow the steps provided to restore access.

For other account issues, including problems related to sign-in, unauthorized access, or account security concerns, you can reach out to amazon-engagement@amazon.com for assistance. Please note that Amazon will never request personal information such as passwords, OTPs, or credit card numbers via phone or email.

Thanks for continuing to haul with Relay!`,
        transferRole: `Dear Valued Carrier,

Each Relay account has one Super Admin. To move the role to someone else, please open a case in the Relay Support Center at relay.amazon.com and include your SCAC, the current Super Admin's email, and the new Super Admin's email.

If you already have an open case about this, please reply on that case with these details instead of opening a new one.

Thanks for continuing to haul with Relay!`,
        superAdminLeftCompany: `Dear Valued Carrier,

If your Super Admin is no longer with your company, the role will need to be moved to a new person. Please open a case in the Relay Support Center at relay.amazon.com and include your SCAC, the former Super Admin's email, and the new Super Admin's name and email.

If you already have an open case about this, please reply on that case with these details instead of opening a new one.

Thanks for continuing to haul with Relay!`,
        driverCantLogIn: `Dear Valued Carrier,

If your company's driver is unable to log in to the Relay mobile app, we recommend the following:

1. Confirm the driver accepted their invite and is using the same email address the invite was sent to.
2. Use the "Forgot password" option on the app login screen.
3. Update to the latest Relay app version (Android 7 or later, or iOS 13.1 or later).
4. Close and restart the app, and check for a stable internet connection.

You may find this optional Relay Learning Center course helpful:
- Introduction to Primary and Secondary Devices: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=1b83c2f9-1e32-4d56-9f3c-1c8e8e988998

If the driver still cannot log in, please reply to this case with the driver's email address, phone type and OS version, a screenshot of any error message, and the date and time of the attempt.

Thanks for continuing to haul with Relay!`,
        driverNotSeeingLoad: `Dear Valued Carrier,

If your company's driver cannot see an assigned load in the Relay mobile app, we recommend the following:

1. Confirm the driver is assigned to the load on the Trips page at relay.amazon.com.
2. Have the driver log out and back in, then refresh the app.
3. Update to the latest Relay app version.

You may find these optional Relay Learning Center courses helpful:
- How to avoid Automatic Rejections: Asset Not Assigned & No Driver Assigned: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=948c6d87-d6b8-4a91-8a9c-834182a49336
- Confirming Load Specifics: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=ab2993e7-0b0a-4baa-92a0-01d3fa58461d

If the load still does not appear, please reply to this case with the Load ID or VRID, the driver's email address, and a screenshot of the driver's app.

Thanks for continuing to haul with Relay!`,
    };
    // Create and insert response
    var replyClicked = false;
const insertResponse = (response) => {
    const textArea = document.querySelector('textarea');
    if (textArea) {
        textArea.value = response;
        textArea.dispatchEvent(new Event('input', { bubbles: true }));
        textArea.style.height = "1px";
        setTimeout(function(){
            textArea.style.height = textArea.scrollHeight + "px";
        },800);
    }
};
    //Edit signature
    //                Julian    Dany       Isaiah      Kaesy     Jeremy      Ricky         Kristy      "Rebecca"
    const loginID = ["sheshuv", "proskeal", "khatania", "chmnnin", "kiranmst", "kanellye", "chroscoe", "teewoma", "joswyatt", "legoodm", "isaispen", "wilsojel", "vkandu", "vaishgch", "tnadas", "jxpowers", "sulkeirh", "klakendr", "booxford" ]
    const initials = ["-SV", "-AP", "-AK", "-CM", "-KM", "-NK", "-RR","-TEW","-TW", "-LG", "-Zay", "-JW", "VK", "VS", "TD", "JP", "KS", "LR", "BO" ]

    // Winter weather signature (11/17/2026, per J.T.): both notices in every signature - the case data has no reliable US/Canada signal, so each carrier reads their own section. Plain-text signature box, so links sit in parentheses next to the words (email clients make them clickable).
    const winterBlockUS = 'Attention Carriers — With winter weather approaching, preparation for challenging driving conditions is essential. We have several resources on Relay Learning Center, including Winter Weather Driving (https://relay.amazon.com/learning/all-resources?filterCriteria=winter) training, mechanical maintenance trainings found under the "Maintenance Category" (https://relay.amazon.com/learning/home) and The 90-Second Garage series (https://relay.amazon.com/learning/all-resources?filterCriteria=90-second), which has been expanded to include quick tips on vehicle inspections and basic mechanical fixes. Be sure to take advantage of available Deals and Discounts (https://relay.amazon.com/rewards/value-added-service) to maintain a healthy fleet and perform thorough pre-trip and post-trip vehicle inspections. Stay safe this season!';
    const winterBlockCA = 'Attention Carriers — With winter weather approaching, preparation for challenging driving conditions is essential. We have several resources on Relay Learning Centre, including Winter Weather Driving (https://relay.amazon.ca/learning/all-resources?filterCriteria=winter) training, mechanical maintenance trainings found under the "Maintenance Category" (https://relay.amazon.ca/learning/all-resources?filterCriteria=maintenance) and the 90-Second Garage (https://relay.amazon.ca/learning/all-resources?filterCriteria=garage) series, which has been expanded to include quick tips on vehicle inspections and basic mechanical fixes. Be sure to perform thorough pre-trip and post-trip vehicle inspections. Stay safe this season!';
    function EditSignature()
    {
        console.log("Edit Signature 2");
        var signatureButton = document.querySelectorAll('[class="email-button py-0 selected"]')[0];
        if(!signatureButton.textContent.includes("Discard"))
        {
            try {
                signatureButton.click();
            } catch (e) {
                console.log('[Relay Script] EditSignature: signature toggle click failed, filling signature anyway. Error: ' + (e && e.message ? e.message : e) + ' Button text: ' + JSON.stringify(signatureButton.textContent) + ' Button class: ' + signatureButton.className);
            }
            setTimeout(function() {
                var signatureBox = document.getElementsByClassName("shadow-none")[1];
                if(signatureBox)
                {
                    var navListuserName = document.getElementsByClassName("text_hF6BH")[0].children[0].textContent.split("User: ")[1].split("Tenant: ")[0].trim() // trims all of the whitespace in username and only gets login
                    var userName = loginID.indexOf(navListuserName);
                    var findInitial = initials[userName]
                    signatureBox.value = findInitial + "\r\nRelay Account Support (RAS)\r\n\r\nUS Carriers:\r\n" + winterBlockUS + "\r\n\r\nCanadian Carriers:\r\n" + winterBlockCA;//changes ROC to RAS
                    signatureBox.dispatchEvent(new Event('input', {bubbles:true}));
                    signatureBox.style.height = "1px";
                    signatureBox.style.height = signatureBox.scrollHeight + "px";
                }
            }, 2000);
        }
    }
    // Registry of built buttons by id, so the suggestion feature can highlight one.
    const tmButtons = {};
    // Create button element with styles
const createButton = ({ id, text, backgroundColor, hoverColor }) => {
    const button = document.createElement('button');
    button.className = 'tm-response-btn';
    tmButtons[id] = button;
    const style = config.buttonStyle;

    const buttonBg = backgroundColor || style.backgroundColor;
    const buttonHover = hoverColor || style.hoverColor;

    Object.assign(button.style, {
        padding: style.padding,
        backgroundColor: buttonBg,
        color: style.textColor,
        border: 'none',
        borderRadius: style.borderRadius,
        cursor: 'pointer',
        margin: style.margin,
        fontSize: style.fontSize,
        minWidth: '105px',
        whiteSpace: 'nowrap'
    });

    button.textContent = text;
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = buttonHover;
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = buttonBg;
    });

button.addEventListener('click', () => {
    try { tmLogCase(id, text); } catch (e) { console.warn('Case log failed', e); }
    insertResponse(responses[id]);
    if (crossQueueMode) {
        console.log("Override mode - text only, dropdowns untouched: " + text);
        return;
    }
    autoSelectDropdowns(text);

    // Click the "Review" button after response + dropdowns are done
    setTimeout(function(){
        console.log("REVIEW BUTTON - triggered by: " + text);
        function clickReview(attempts) {
            if (attempts <= 0) {
                console.warn("Review button not found after all retries");
                return;
            }
            const reviewBtn =
                document.querySelector('kat-button[label="Review"] button') ||
                document.querySelector('kat-button[data-csm-name="reply-composer-review"] button') ||
                Array.from(document.querySelectorAll('kat-button button')).find(b => b.textContent.trim() === 'Review');

            if (reviewBtn) {
                reviewBtn.click();
                console.log("Review button clicked successfully");
            } else {
                console.log("Review button not found, retrying... (" + attempts + " left)");
                setTimeout(function() {
                    clickReview(attempts - 1);
                }, 1000);
            }
        }
        clickReview(5);
    }, 2000);
});


    return button;
};

    function AfterLock()
    {
        console.log("AfterLock");
        var lockButton = document.querySelector('[label="Lock Case"]');
        var releaseButton = document.querySelector('[label="Release Case"]');
        //setTimeout(function(){
        if(!releaseButton)
        {
            lockButton.click()
            console.log("Failed");
            setTimeout(function(){
                AfterLock();
            },1000);
        }
        else
        {
            console.log("Passed");

            //Change signature
            setTimeout(function(){
                console.log("Edit Signature 1");
                EditSignature();
            }, 2000);

            //Set to resolve
            function setResolved(attempts) {
                if (attempts <= 0) {
                    console.warn("Could not find Resolved button after retries");
                    return;
                }
                var resolveButton = document.querySelector('kat-radiobutton[value="Resolved"] input[type="radio"]');
                if (resolveButton) {
                    resolveButton.click();
                    var caseStatusGroup = document.querySelector('#case-status-dropdown-button-group');
                    if (caseStatusGroup) {
                        caseStatusGroup.value = 'Resolved';
                        caseStatusGroup.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    console.log("RESOLVED - success");
                } else {
                    console.log("Resolved button not found, retrying... (" + attempts + " left)");
                    setTimeout(function() {
                        setResolved(attempts - 1);
                    }, 1000);
                }
            }
            setTimeout(function() {
                setResolved(10);
            }, 3100);


            //Open reply
            setTimeout(function(){
                console.log("REPLY");
                try {
                    // Try multiple selector approaches
                    const replyButton = document.querySelector('[label="Reply"]') ||
                          document.querySelector('.parent_WyMkx sm_XoUib end_ccRLn') ||
                          Array.from(document.getElementsByTagName('button')).find(b => b.textContent.includes('Reply'));

                    if (replyButton) {
                        replyButton.click();
                        console.log("Reply button clicked successfully");
                    } else {
                        console.log("Reply button not found");
                    }
                } catch (error) {
                    console.error("Error clicking reply button:", error);
                }
            }, 800);

            //remove CC'd emails.
            setTimeout(function(){
                console.log("CCEMAIL");
                var removeCC = document.querySelectorAll('[aria-label="Remove tag"]')
                if(removeCC.length > 1)
                {
                    for(var x = removeCC.length-1; x > 0; x--)
                    {
                        removeCC[x].click();
                    }
                }
            },2200);
        }
        // },1500);
    }


    // ---- 3-way switch: switch to this script's responses from any other bar ----
    let crossQueueMode = false;
    let hiddenBarId = '';
    let hiddenBarLabel = '';
    const OTHER_BARS = [
        { id: 'tm-tech-bar', label: 'Tech' },
        { id: 'tm-auctions-bar', label: 'Auctions' }
    ];
    function hideOtherBars() {
        OTHER_BARS.forEach(function(other) {
            const bar = document.getElementById(other.id);
            if (bar) { hiddenBarId = other.id; hiddenBarLabel = other.label; bar.dataset.tmHiddenByOverride = '1'; bar.style.display = 'none'; }
        });
    }
    function unhideOtherBars() {
        if (hiddenBarId) {
            const bar = document.getElementById(hiddenBarId);
            if (bar && bar.dataset.tmHiddenByOverride) { bar.style.display = 'flex'; delete bar.dataset.tmHiddenByOverride; }
        }
        hiddenBarId = ''; hiddenBarLabel = '';
    }
    function switchBackFromOverride() {
        const own = document.getElementById('tm-main-bar');
        if (own) { own.remove(); }
        crossQueueMode = false;
        unhideOtherBars();
    }
    function attachSwitchToNativeBars() {
        OTHER_BARS.forEach(function(other) {
            const nativeBar = document.getElementById(other.id);
            if (!nativeBar || nativeBar.querySelector('[id^="tm-back-to-"]')) { return; }
            let tray = nativeBar.querySelector('.tm-switch-tray');
            if (!tray) {
                tray = document.createElement('div');
                tray.className = 'tm-switch-tray';
                Object.assign(tray.style, { position: 'absolute', bottom: '4px', right: '8px', zIndex: '10001', display: 'flex', gap: '6px' });
                nativeBar.appendChild(tray);
            }
            if (tray.querySelector('#tm-switch-to-support')) { return; }
            const btn = document.createElement('button');
            btn.id = 'tm-switch-to-support';
            btn.textContent = 'Switch to Support responses';
            Object.assign(btn.style, { backgroundColor: '#ff6600', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' });
            btn.addEventListener('click', () => { crossQueueMode = true; init(true); });
            tray.appendChild(btn);
        });
    }
        setInterval(attachSwitchToNativeBars, 1000);

    // ---- Case suggestion (v2.15): suggest-only, never auto-clicks ----
    // Keyword lists per button id. Phrases (with a space) score 3, single
    // words score 2 - the single words here are distinctive (fmcsa, ctc,
    // accident, domicile...), not generic filler. Generic buttons (More
    // Info, Other, Patience, App + In-Transit, App + Performance) have no
    // keywords on purpose - they are fallbacks, not something to suggest
    // from a keyword.
    const SUGGESTION_KEYWORDS = {
        basicsCompliant: ['safety score', 'basic score', 'basics', 'csa score', 'unsafe driving', 'hos compliance', 'behavioral analysis safety'],
        carb: ['carb', 'clean truck check', 'california clean truck', 'california compliance'],
        insurance: ['insurance compliance', 'certificate of insurance', 'insurance claim', 'insurance need updated', 'update my insurance'],
        rlb: ['load board visibility', 'load board access', 'load board', 'no loads', 'cannot see loads', "can't see loads", 'post a truck'],
        suspended: ['account suspended', 'suspended', 'suspension', 'reinstatement', 'reactivation', 'account closed', 'basic scores', 'basics are within', 'account was suspended', 'was suspended', 'reinstate', 'revoked', 'status says revoked', 'motus', 'operating authority', 'lost the access', 'access to our load board', 'access disappeared', 'load board access', 'manual review', 'has been revoked', 'load board not restored', 'loadboard is disabled', 'load board is disabled', 'still suspended', 'load board reactivated', 'make my account active', 'unable to book loads', 'has not updated', 'restore access', 'previously restricted', 'access was restricted', 'not restored', 'account active', 'granted access'],
        Driververification: ['driver verification', 'verification check', 'verify driver', 'selfie mis-match', 'selfie mismatch', 'driver mis-match', 'stole his identity', 'account is still not verified'],
        BGCheck: ['background check', 'background screening'],
        Domicile: ['domicile'],
        selfie: ['selfie'],
        retake: ['relay 101', 'retake 101', 'onboarding for carriers', 'onboarding course'],
        contracts: ['dedicated contract', 'closed node', 'access to contracts', 'book contracts', 'book any contract'],
        pending: ['pending verification', 'verification pending', 'identity verification', 'business identity'],
        link: ['ownership verification', 'ownership documents', 'ownership', 'link expired', 'expired link', 'resend link', 'link is not working', "link doesn't work"],
        assets: ['asset', 'added an asset', 'truck is still not verified', 'added a truck', 'not enough room', 'do not fit', 'no remaining space', 'completely full', 'cube out', 'tractor', 'add my new vehicle', 'chassis', 'add truck'],
        Solicitation: ['solicitation', 'freight opportunities'],
        bank: ['bank account', 'banking', 'direct deposit', 'routing number', 'tax details', 'update my profile'],
        appIssue: ['app not working', 'app crashing', 'app error', 'experiencing glitches', 'glitches'],
        performance: ['performance dispute', 'performance score', 'rps', 'score dropped', 'score is dropping', 'score remained', 'performance remained', 'trip completion status', 'late arrival', 'late loads', "shouldn't affect", 'company performance', 'performance impact', 'app malfunction', 'controllable', 'is not late', 'carrier controllable', 'negative performance impact', 'should not impact our performance', 'does not negatively impact', 'negatively impact our performance', 'not count against our performance'],
        performanceFinal: ['decision is final', 'both disputes', 'already submitted a dispute', 'submitted a dispute and an appeal', 'second review', 'reopen the case', 'remove the penalty', 'score should be adjusted', 'adjust my score', 'change my score', 'used both', 'both dispute options', 'roll off', 'six weeks', 'submitted an appeal', 'appeal was rejected', 'performance penalty', 'missing the points', 'score is below', 'my appeal', 'appeal has been', 'dispute options', 'dispute process', 'appeal process', 'already disputed', 'dispute was', 'appeal was', 'cannot change my', 'remove the negative impact', 'both dispute', 'already appealed', 'appeal is final'],
        accountAccess: ['cannot login', "can't log in", 'can not login', 'trouble signing in', 'unable to log in', 'verification code', 'two step verification', 'old phone number', 'update phone number', 'update the phone number', 'primary administrator', 'linked to a different', 'google account', 'account suspension', 'sign in trouble', 'cannot sign in', "can't sign in", 'trouble logging in', 'unable to sign in'],
        paymentDispute: ['payment dispute', 'missing from my invoice', 'missing payment', 'not paid', "didn't get paid", 'did not get paid', 'payment denied', 'rate per mile', 'get paid', 'compensation'],
        Multi: ['multiple cases', 'duplicate case', 'existing case', 'same issue'],
        DOTDPS: ['dot audit', 'dps audit', 'dot/dps'],
        badge: ['badge access', 'badging', 'badge'],
        middlemile: ['middle mile', 'mmpm'],
        scorecard: ['performance scorecard', 'scorecard'],
        close: ['close account verify', 'close my account'],
        loadboard: ['load board fluctuation', 'load board visibility', 'loads fluctuate', 'load availability'],
        cancel: ['permanently close', 'permanent closure', 'close this account', 'close our account', 'closure of my account', 'permanent account closure'],
        intransit: ['stuck in transit', 'in-transit', 'in transit', 'trip completion', 'report delay', 'traffic', 'delay', 'missing ts', 'missing timestamp', 'timestamp', 'time stamp', 'still showing', "doesn't close out", 'does not close out', 'long line', 'big line', 'came as unexpected', 'came up as unexpected', 'empty move', 'too much transit time', 'schedule error', 'scheduling discrepancy', 'sufficient transit time', 'eta updated', 'unloaded date', 'arrived late', 'driver arrived late', 'delay was caused by', 'delay is due to', 'heavy traffic', 'construction', 'change of time', 'traffic jam', 'weigh station', 'yard congestion', 'road conditions', 'changed the schedule', 'check in times', 'weather', 'drop off', 'no doors available', 'unable to pick up'],
        submitBol: ['submit bol', 'submit bill of lading', 'bill of lading', 'proof of delivery', 'bols for stop', 'upload the bol', 'bol for drop', 'bols for'],
        MissingBOL: ['missing bol', 'missing bill of lading', "can't find bol", 'cannot find bol', 'download bol', 'waybill', 'way bill', 'pod are missing', 'pod is missing', 'i need bol'],
        assigndrivers: ['assign drivers', 'assign driver'],
        driverassignmentissue: ['driver assignment issue', 'cannot assign driver', "can't assign driver", 'driver not assigned'],
        arc: ['accident report', 'accident'],
        lossprevention: ['loss prevention', 'stolen', 'theft'],
        siteescalation: ['site escalation', 'site issue', 'safety event', 'kingpin lock', 'parking fee', 'refusing to open the gate', 'cannot maneuver', 'wrong equipment', 'still on the train'],
        tonu: ['tonu', 'trip not operated'],
        load: ['load not showing', 'load is not showing', 'load not appearing', 'load is not appearing', 'booked load', 'load missing'],
        CallBack: ['call back', 'callback', 'request a call', 'please call', 'call back at', 'call me', 'please confirm', 'can you confirm', 'callme', 'call dispatch', 'showing rejected'],
        patience: ['still no solution', 'still waiting', 'waiting for response'],
        trailerDefect: ['trailer is missing', 'missing mudflap', 'door hinges', 'air leak', 'tire rim', 'chassis is broken', 'mechanical issue', 'trailer door', 'cubed out trailer', 'trailer has', 'missing a door', "trailer's issue", 'container is damaged', 'container damaged', 'rear lights', 'lights are not working', "lights aren't working", 'mechanical tractor'],
        uiia: ['uiia', 'intermodal', 'intermodal loads', 'intermodal certification', 'uiia certification', 'addenda', 'addendum', 'drayage', 'rail drayage', 'port drayage', 'flexivan', 'chassis addendum', 'ocean carrier', 'steamship', 'imdlcertifications', 'trailer interchange'],
        auctionSupport: ['auction support', 'relay auctions', 'auctions', 'bid on lanes', 'bidding', 'backhaul', 'backhauls', 'leading bid']
    };
    // Read the case text WITHOUT the script's own bar (its button labels
    // would match their own keywords). Reads ONLY the carrier's message
    // in the correspondence container Paragon already uses elsewhere in
    // this script (.body_RioZc) - the subject line / page title are NOT
    // read, per J.T.: they are static across issues and add noise. Fall
    // back to a copy of the page with our bars removed.
    function getCaseTextRaw() {
        var parts = [];
        var corr = document.querySelector('.body_RioZc');
        if (corr && corr.innerText) {
            parts.push(corr.innerText);
        } else {
            var clone = document.body.cloneNode(true);
            clone.querySelectorAll('#tm-main-bar, #tm-tech-bar, #tm-auctions-bar, .tm-switch-tray').forEach(function(n) { n.remove(); });
            if (clone.innerText) { parts.push(clone.innerText.slice(0, 8000)); }
        }
        return parts.join('\n');
    }
    function getCaseText() {
        return getCaseTextRaw().toLowerCase();
    }

    // ---- Carrier-only suggestion (v2.29/v3.32, per J.T.) ----
    // Score only the carrier's own message, not the whole thread: the
    // thread text in .body_RioZc also carries email headers, subject
    // lines, transfer notices, Relay's form boilerplate and your own
    // sent replies, and keywords were firing on all of that. If no
    // carrier message is found, fall back to the whole thread as before,
    // so the suggestion never has less to work with than today.
    function extractCarrierMessage(full) {
        var flat = (full || '').replace(/\s+/g, ' ');
        var cutAt = function(text) {
            var stops = ['[Company Name:', 'Attachments:', 'View translation', 'From:', 'Related Frequently Asked Questions'];
            var end = text.length;
            stops.forEach(function(s) {
                var j = text.indexOf(s);
                if (j !== -1 && j < end) { end = j; }
            });
            return text.slice(0, end).trim();
        };
        var m;
        // 1. Support form: "Describe your issue:" ... VRID / [Company Name:
        m = flat.match(/Describe your issue:\s*(.*?)\s*(?:VRID if applicable:|\[Company Name:)/i);
        if (m && m[1].trim().length >= 20) { return cutAt(m[1].trim()).slice(0, 3000); }
        // 2. Verification form: "Explain the issue here:" ...
        m = flat.match(/Explain the issue here:\s*(.*?)\s*(?:Related Frequently Asked Questions|\[Company Name:)/i);
        if (m && m[1].trim().length >= 20) { return cutAt(m[1].trim()).slice(0, 3000); }
        // 3. Tech format: the message follows the VRID / Contract ID value.
        // (In some cases the Topic label comes after the ID, with the
        // message right behind it - strip that label too, so the topic
        // field itself never scores.)
        var idx = flat.search(/VRID(?:\/Tour\/Block\/Contract ID|#):/i);
        if (idx !== -1) {
            var rest = flat.slice(idx).replace(/^VRID(?:\/Tour\/Block\/Contract ID|#):\s*/i, '');
            var tokens = rest.split(' ');
            var i = 0;
            while (i < tokens.length && /^[A-Za-z0-9\-\/]+$/.test(tokens[i]) && /\d/.test(tokens[i]) && tokens[i].length >= 5) { i++; }
            rest = tokens.slice(i).join(' ').replace(/^Topic \(What's your issue about\?\)\s*:\s*/i, '');
            var msg = cutAt(rest);
            if (msg.length >= 20) { return msg.slice(0, 3000); }
        }
        return '';
    }
    function getSuggestionText(raw) {
        raw = (raw === undefined) ? getCaseTextRaw() : raw;
        var carrier = extractCarrierMessage(raw);
        if (carrier) { return { text: carrier.toLowerCase(), carrierOnly: true }; }
        return { text: raw.toLowerCase(), carrierOnly: false };
    }
    // Combo rule v1: an app phrase plus a trip phrase suggests the matching
    // combo button (the combos are keywordless by design, so this is the only
    // way they get suggested). App signal = appIssue / navigation /
    // appissueExpBehaviour scoring 2+; trip = In-Transit or Performance
    // scoring 2+, whichever is higher (a tie keeps the normal suggestion).
    function comboSuggestion(scores) {
        var byId = {};
        scores.forEach(function(s) { byId[s.id] = s.score; });
        var appScore = Math.max(byId.appIssue || 0, byId.navigation || 0, byId.appissueExpBehaviour || 0);
        var inScore = byId.intransit || 0;
        var pfScore = byId.performance || 0;
        if (appScore < 2 || Math.max(inScore, pfScore) < 2) { return null; }
        if (inScore === pfScore) { return null; }
        return { id: inScore > pfScore ? 'appintransit' : 'appperformance', score: Math.max(inScore, pfScore), matched: 'combo-rule' };
    }
    function scoreSuggestion(text) {
        var scores = [];
        Object.keys(SUGGESTION_KEYWORDS).forEach(function(id) {
            var score = 0, matched = '';
            SUGGESTION_KEYWORDS[id].forEach(function(phrase) {
                var needle = phrase.toLowerCase();
                var idx = text.indexOf(needle);
                if (idx !== -1) {
                    score += needle.indexOf(' ') !== -1 ? 3 : 2;
                    if (!matched) { matched = phrase; }
                }
            });
            if (score > 0) { scores.push({ id: id, score: score, matched: matched }); }
        });
        scores.sort(function(a, b) { return b.score - a.score; });
        if (scores.length === 0) { return null; }
        var combo = comboSuggestion(scores);
        if (combo) { return combo; }
        var top = scores[0];
        // Clear winner only: at least 2 points and at least 2 ahead of #2.
        if (top.score < 2) { return null; }
        if (scores.length > 1 && top.score - scores[1].score < 2) { return null; }
        return top;
    }
    function clearSuggestionHighlight() {
        Object.keys(tmButtons).forEach(function(id) {
            var b = tmButtons[id];
            b.style.outline = '';
            b.style.boxShadow = '';
            if (b.dataset.tmOriginalText) { b.textContent = b.dataset.tmOriginalText; delete b.dataset.tmOriginalText; }
        });
    }
    let tmLastSuggestion = null;
    function applySuggestion(container) {
        var old = document.getElementById('tm-suggestion-line');
        if (old) { old.remove(); }
        clearSuggestionHighlight();
        var rawText = getCaseTextRaw();
        var scored = getSuggestionText(rawText);
        var text = scored.text;
        var line = document.createElement('div');
        line.id = 'tm-suggestion-line';
        Object.assign(line.style, { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#f5f3ff', border: '1px solid #a78bfa', borderRadius: '4px', marginBottom: '2px' });
        if (rawText.replace(/\s/g, '').length < 100) {
            line.textContent = 'Suggestion: case text not loaded yet - pick a button below.';
            line.style.fontWeight = 'normal';
            container.insertBefore(line, container.firstChild);
            return false;
        }
        var best = scoreSuggestion(text);
        if (!best) {
            line.textContent = 'No clear suggestion - pick a button below.';
            line.style.fontWeight = 'normal';
            container.insertBefore(line, container.firstChild);
            return false;
        }
        var btn = tmButtons[best.id];
        if (!btn) {
            line.textContent = 'No clear suggestion - pick a button below.';
            container.insertBefore(line, container.firstChild);
            return false;
        }
        best.carrierOnly = scored.carrierOnly;
        tmLastSuggestion = best;
        btn.dataset.tmOriginalText = btn.textContent;
        btn.textContent = btn.textContent + ' ★ Suggested';
        btn.style.outline = '3px solid #7c3aed';
        btn.style.boxShadow = '0 0 8px rgba(124,58,237,0.7)';
        var label = document.createElement('span');
        label.textContent = 'Suggested: ' + btn.dataset.tmOriginalText + ' — matched "' + best.matched + '"';
        line.appendChild(label);
        var useBtn = document.createElement('button');
        useBtn.textContent = 'Use it';
        Object.assign(useBtn.style, { backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' });
        useBtn.addEventListener('click', function() { btn.click(); });
        line.appendChild(useBtn);
        var dismissBtn = document.createElement('button');
        dismissBtn.textContent = 'Dismiss';
        Object.assign(dismissBtn.style, { backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' });
        dismissBtn.addEventListener('click', function() { line.remove(); clearSuggestionHighlight(); });
        line.appendChild(dismissBtn);
        container.insertBefore(line, container.firstChild);
        return true;
    }
    // Re-score when the case text arrives late (2.23): Paragon sometimes
    // fills .body_RioZc after the retry loop below has already given up,
    // which is why some cases logged a 0 score even though the text was
    // there when the logger ran later. This watcher re-runs
    // applySuggestion when the correspondence text changes, but ONLY while
    // no suggestion has been shown yet (tmLastSuggestion is still null) -
    // it never replaces a shown suggestion, and never re-shows one after
    // Dismiss (Dismiss leaves tmLastSuggestion set). It disconnects itself
    // once a suggestion exists. v2.22 watched the .body_RioZc node itself,
    // but Paragon replaces that node when the full thread loads, leaving
    // the observer on a detached node that never fires again - which is
    // why a refresh (fast, cached load) sometimes fixed a missing
    // suggestion. 2.23 watches document.body instead, a node Paragon never
    // swaps out, and adds a 5-second safety-net re-check so a suggestion
    // appears within ~5s of the text arriving even if a mutation is missed
    // entirely. Personal only - the Team script has no suggestion feature.
    function startRescoreObserver(container) {
        if (window.__tmSupportRescoreObserver) { window.__tmSupportRescoreObserver.disconnect(); }
        if (window.__tmSupportRescoreInterval) { clearInterval(window.__tmSupportRescoreInterval); }
        var lastText = '';
        var timer = null;
        var safetyChecks = 0;
        var stopWatching = function() {
            if (window.__tmSupportRescoreObserver) { window.__tmSupportRescoreObserver.disconnect(); }
            if (window.__tmSupportRescoreInterval) { clearInterval(window.__tmSupportRescoreInterval); window.__tmSupportRescoreInterval = null; }
        };
        var check = function() {
            if (tmLastSuggestion) { stopWatching(); return; }
            var corr = document.querySelector('.body_RioZc');
            var t = corr ? (corr.innerText || '') : '';
            if (t !== lastText) {
                lastText = t;
                applySuggestion(container);
            }
        };
        window.__tmSupportRescoreObserver = new MutationObserver(function() {
            if (timer) { clearTimeout(timer); }
            timer = setTimeout(check, 800);
        });
        window.__tmSupportRescoreObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
        // Safety net: re-check every 5s while no suggestion is shown, so
        // a missed mutation can never leave the bar suggestion-less. Stops
        // on its own after 10 minutes; the observer keeps watching after
        // that. Cleared together with the observer once a suggestion shows.
        window.__tmSupportRescoreInterval = setInterval(function() {
            safetyChecks++;
            if (safetyChecks > 120 || tmLastSuggestion) { stopWatching(); return; }
            check();
        }, 5000);
        // Tab-switch catch-up (2.30/3.33): background tabs throttle timers,
        // so the debounced check can sit queued on a tab opened long ago.
        // When you switch to a tab, score immediately instead of waiting
        // for the next timer tick. Registered once per page load; the
        // stored check always points at the current case's check, so a
        // same-tab re-init never leaves it calling a stale container.
        window.__tmSupportCheck = check;
        if (!window.__tmSupportVisListener) {
            window.__tmSupportVisListener = true;
            document.addEventListener('visibilitychange', function() {
                if (!document.hidden && window.__tmSupportCheck) { window.__tmSupportCheck(); }
            });
        }
    }
    function runSuggestion(container) {
        // Fresh case, fresh watcher (v2.24): tmLastSuggestion lives for the
        // whole page load, but Paragon re-runs init() when you open
        // another case in the same tab without reloading. Without this
        // reset the new case inherits the previous case's 'suggestion
        // already shown' flag and the observer + safety net shut
        // themselves off immediately, leaving only the retry loop.
        tmLastSuggestion = null;
        var attempts = 0;
        var tick = function() {
            attempts++;
            if (applySuggestion(container)) { return; }
            if (attempts < 30) { setTimeout(tick, 2000); }
        };
        setTimeout(tick, 2500);
        startRescoreObserver(container);
    }

    // ---- Case logger + export (v2.18) ----
    // Everything stays in this browser's localStorage - nothing is sent
    // anywhere. Upload the exported file to Scout yourself when you want
    // the suggestion keywords refined.
    const TM_LOG_KEY = 'tmSupportCaseLog-v1';
    const TM_LOG_MAX = 500;
    function tmReadLog() {
        try { return JSON.parse(localStorage.getItem(TM_LOG_KEY) || '[]'); } catch (e) { return []; }
    }
    function tmWriteLog(entries) {
        // Keep the NEWEST 500 (entries are oldest-first): the old slice(0, 500)
        // kept the oldest 500, so once the log filled up no new case was ever
        // recorded. Full-text rows are bigger, so on a storage-quota failure
        // retry with the newest 250 instead of losing the entry.
        try { localStorage.setItem(TM_LOG_KEY, JSON.stringify(entries.slice(-TM_LOG_MAX))); } catch (e) {
            try { localStorage.setItem(TM_LOG_KEY, JSON.stringify(entries.slice(-250))); } catch (e2) { console.warn('Case log save failed', e2); }
        }
    }
    function tmCaseId() {
        var m = location.href.match(/caseId=([^&]+)/);
        return m ? decodeURIComponent(m[1]) : location.href;
    }
    const TM_REOPEN_PHRASES = ['not solved', "wasn't solved", 'still no solution', 'still waiting', "didn't work", 'did not work', 'not resolved', 'issue persists', 'still not', 'no solution', 'problem not solved', 'still unresolved', 'still facing'];
    function tmIsReopen(text) {
        var t = (text || '').toLowerCase();
        return TM_REOPEN_PHRASES.some(function(p) { return t.indexOf(p) !== -1; });
    }
    function tmRecentlyLogged(caseId, buttonId, minutes) {
        var cutoff = Date.now() - (minutes || 10) * 60000;
        return tmReadLog().some(function(e) {
            return e.caseId === caseId && e.actualButtonId === buttonId && Date.parse(e.timestamp || 0) >= cutoff;
        });
    }
    // Non-canned auto-log (v2.20): watch Review clicks. A reply that does
    // not match any canned template is logged as a "Custom reply" row with
    // the first 500 chars of what you wrote, so Scout can see it. A canned
    // reply already logged by its button click is skipped. Queue-guarded:
    // this watcher only logs when the case is in this script's queue, so
    // it cannot write into another queue's log when you switch cases.
    function tmLogReviewClick() {
        var q = readQueueValue();
        if (['r4c-support@amazon.com', 'rcm-support@amazon.com'].indexOf(q) === -1) { return; }
        var ta = document.querySelector('textarea');
        var reply = ta ? ta.value || '' : '';
        if (reply.replace(/\s/g, '').length < 20) { return; }
        var match = tmMatchCannedReply(reply);
        if (match) {
            if (tmRecentlyLogged(tmCaseId(), match.id, 10)) { return; }
            var label = '';
            config.buttonGroups.forEach(function(g) {
                g.buttons.forEach(function(b) { if (b.id === match.id) { label = b.text; } });
            });
            tmLogCase(match.id, label || match.id);
            return;
        }
        tmLogCase('custom', 'Custom reply', { replyExcerpt: reply.replace(/\s+/g, ' ').trim().slice(0, 500), outcomeOverride: 'custom' });
    }
    function tmWatchReviewButton() {
        if (window.__tmSupportReviewWatch) { return; }
        window.__tmSupportReviewWatch = true;
        document.addEventListener('click', function(e) {
            var t = e.target;
            if (!t || !t.closest) { return; }
            var reviewBtn = t.closest('kat-button[label="Review"]') || t.closest('kat-button[data-csm-name="reply-composer-review"]');
            if (!reviewBtn) {
                var b = t.closest('button');
                if (!b || b.textContent.trim() !== 'Review') { return; }
            }
            try { tmLogReviewClick(); } catch (err) { console.warn('Review log failed', err); }
        }, true);
    }
    function tmOutcome(actualId, suggested) {
        if (!suggested) { return 'missed'; }
        return suggested.id === actualId ? 'correct' : 'wrong';
    }
    function tmLogCase(actualId, actualText, opts) {
        opts = opts || {};
        var carrier = getCaseTextRaw().replace(/\s+/g, ' ').trim();
        var suggested = tmLastSuggestion || null;
        var entry = {
            timestamp: new Date().toISOString(),
            caseId: tmCaseId(),
            queue: readQueueValue() || '',
            carrierExcerpt: carrier.slice(0, 1000),
            threadTail: carrier.slice(-1000),
            fullText: carrier.slice(0, 12000),
            carrierMessage: extractCarrierMessage(carrier).slice(0, 3000),
            scoredCarrierOnly: suggested ? !!suggested.carrierOnly : false,
            isReopen: tmIsReopen(carrier),
            replyExcerpt: opts.replyExcerpt || '',
            actualButtonId: actualId,
            actualButton: actualText,
            actualCategory: (dropdownMappings[actualText] || {}).category || '',
            actualCode: (dropdownMappings[actualText] || {}).code || '',
            suggestedButtonId: suggested ? suggested.id : '',
            suggestedMatched: suggested ? suggested.matched : '',
            suggestedScore: suggested ? suggested.score : 0,
            outcome: opts.outcomeOverride || tmOutcome(actualId, suggested)
        };
        // Reopen rows (v2.20): keep every click as its own row instead of
        // overwriting by case ID, so a reopen keeps its history. Only skip
        // an exact duplicate (same case + same button within 60 seconds).
        var log = tmReadLog().filter(function(e) {
            if (e.caseId !== entry.caseId || e.actualButtonId !== entry.actualButtonId) { return true; }
            var age = Date.now() - Date.parse(e.timestamp || 0);
            return age > 60000;
        });
        log.push(entry);
        tmWriteLog(log);
        tmUpdateReportCount();
        console.log('[Relay Script] Case logged: ' + entry.caseId + ' -> ' + actualText + ' (' + entry.outcome + ')');
        return entry;
    }
    // Match a reply you already sent against the canned templates, for
    // "Log this case" on a completed case you open later. Word-overlap
    // (Jaccard) on words of 4+ letters; needs >= 0.25 to count.
    function tmMatchCannedReply(replyText) {
        if (!replyText || replyText.length < 50) { return null; }
        var words = function(s) {
            var set = {};
            (s.toLowerCase().match(/[a-z]{4,}/g) || []).forEach(function(w) { set[w] = 1; });
            return set;
        };
        var replyWords = words(replyText);
        var replyCount = Object.keys(replyWords).length;
        var best = null;
        Object.keys(responses).forEach(function(id) {
            var tWords = words(responses[id]);
            var shared = 0;
            Object.keys(tWords).forEach(function(w) { if (replyWords[w]) { shared++; } });
            var union = replyCount + Object.keys(tWords).length - shared;
            var score = union ? shared / union : 0;
            if (!best || score > best.score) { best = { id: id, score: score }; }
        });
        return best && best.score >= 0.25 ? best : null;
    }
    function tmLogThisCase() {
        // Your reply is the last reply in the correspondence thread; the
        // reply composer textarea, if present, is the text being drafted.
        var corr = document.querySelector('.body_RioZc');
        var text = corr ? corr.innerText : '';
        var match = tmMatchCannedReply(text);
        if (!match) {
            alert('Could not match this case to a canned response. Open the case, make sure your reply is visible, and try again.');
            return;
        }
        var label = '';
        config.buttonGroups.forEach(function(g) {
            g.buttons.forEach(function(b) { if (b.id === match.id) { label = b.text; } });
        });
        tmLogCase(match.id, label || match.id);
        alert('Logged this case as: ' + (label || match.id) + ' (match ' + Math.round(match.score * 100) + '%). Total logged: ' + tmReadLog().length);
    }
    function tmDownload(filename, text, type) {
        var blob = new Blob([text], { type: type || 'text/plain' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    }
    function tmExportJSON() {
        var log = tmReadLog();
        var date = new Date().toISOString().slice(0, 10);
        tmDownload('relay-support-case-log-' + date + '.json', JSON.stringify(log, null, 2), 'application/json');
    }
    function tmExportCSV() {
        var log = tmReadLog();
        var esc = function(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; };
        var rows = [['timestamp', 'caseId', 'queue', 'actualButton', 'suggestedButtonId', 'suggestedMatched', 'suggestedScore', 'outcome', 'actualCategory', 'actualCode', 'carrierExcerpt', 'isReopen', 'threadTail', 'replyExcerpt'].map(esc).join(',')];
        log.forEach(function(e) {
            rows.push([e.timestamp, e.caseId, e.queue, e.actualButton, e.suggestedButtonId, e.suggestedMatched, e.suggestedScore, e.outcome, e.actualCategory, e.actualCode, e.carrierExcerpt.replace(/\n/g, ' '), e.isReopen, (e.threadTail || '').replace(/\n/g, ' '), (e.replyExcerpt || '').replace(/\n/g, ' ')].map(esc).join(','));
        });
        var date = new Date().toISOString().slice(0, 10);
        tmDownload('relay-support-case-log-' + date + '.csv', rows.join('\n'), 'text/csv');
    }
    function tmUpdateReportCount() {
        var el = document.getElementById('tm-report-count');
        if (el) { el.textContent = 'Logged cases: ' + tmReadLog().length; }
    }
    function buildReportFooter(container) {
        var footer = document.createElement('div');
        footer.id = 'tm-report-footer';
        Object.assign(footer.style, { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', fontSize: '12px', backgroundColor: '#f3f4f6', borderTop: '1px solid #d1d5db', borderRadius: '4px', marginTop: '2px' });
        var count = document.createElement('span');
        count.id = 'tm-report-count';
        count.textContent = 'Logged cases: ' + tmReadLog().length;
        count.style.fontWeight = 'bold';
        footer.appendChild(count);
        var badge = document.createElement('span');
        badge.textContent = 'J.T. Personal';
        Object.assign(badge.style, { backgroundColor: '#7c3aed', color: 'white', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 'bold' });
        footer.appendChild(badge);
        var mkBtn = function(label, fn, bg) {
            var b = document.createElement('button');
            b.textContent = label;
            Object.assign(b.style, { backgroundColor: bg || '#6b7280', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' });
            b.addEventListener('click', fn);
            footer.appendChild(b);
            return b;
        };
        mkBtn('Export JSON', tmExportJSON, '#0b66c3');
        mkBtn('Export CSV', tmExportCSV, '#0b66c3');
        mkBtn('Log this case', tmLogThisCase, '#2e8b57');
        mkBtn('Clear log', function() {
            if (confirm('Clear all ' + tmReadLog().length + ' logged cases? This cannot be undone. Export first if you want to keep them.')) {
                tmWriteLog([]);
                tmUpdateReportCount();
            }
        }, '#b91c1c');
        var note = document.createElement('span');
        note.textContent = 'Log stays in this browser only — upload the export to Scout to refine suggestions.';
        note.style.color = '#4b5563';
        footer.appendChild(note);
        container.appendChild(footer);
    }

    // Initialize
    const init = (isOverride) => {
        console.log('Script initialized');
        crossQueueMode = !!isOverride;
        if (!isOverride) { const ownChip = document.getElementById('tm-main-override-chip'); if (ownChip) { ownChip.remove(); } }

// Remove any bar this script built before, so a re-run never stacks bars.
// Responsive bar: shrink the bar on smaller screens so the case stays
// visible. Compact below 1600px wide or 850px tall, full size above.
// Re-checked on resize and every second, so docking / undocking the
// monitor just works.
const TM_COMPACT_MAX_WIDTH = 1600;
const TM_COMPACT_MAX_HEIGHT = 850;
function applyResponsiveBar() {
    const bar = document.getElementById('tm-main-bar') || document.getElementById('tm-tech-bar');
    if (!bar) { return; }
    if (!document.getElementById('tm-responsive-style')) {
        const st = document.createElement('style');
        st.id = 'tm-responsive-style';
        st.textContent = '#tm-main-bar.tm-compact, #tm-tech-bar.tm-compact { gap: 1px !important; padding: 2px !important; min-height: 0 !important; } #tm-main-bar.tm-compact .tm-response-btn, #tm-tech-bar.tm-compact .tm-response-btn { padding: 3px 7px !important; font-size: 11px !important; min-width: 0 !important; } #tm-main-bar.tm-compact .tm-group-label, #tm-tech-bar.tm-compact .tm-group-label { width: 100px !important; min-width: 100px !important; }';
        document.head.appendChild(st);
    }
    const compact = window.innerWidth < TM_COMPACT_MAX_WIDTH || window.innerHeight < TM_COMPACT_MAX_HEIGHT;
    const wasCompact = bar.classList.contains('tm-compact');
    bar.classList.toggle('tm-compact', compact);
    bar.style.maxHeight = compact ? '45vh' : '';
    bar.style.overflowY = compact ? 'auto' : '';
    if (compact !== wasCompact) { shiftSidebar(); }
}
const oldBar = document.getElementById('tm-main-bar');
if (oldBar) {
    oldBar.remove();
}

// Create response buttons container
const container = document.createElement('div');
container.id = 'tm-main-bar';
Object.assign(container.style, config.containerStyle);
if (crossQueueMode) {
    hideOtherBars();
    const backBtn = document.createElement('button');
    backBtn.id = hiddenBarId ? 'tm-back-to-' + hiddenBarLabel.toLowerCase() : 'tm-back-to-other';
    backBtn.textContent = hiddenBarLabel ? 'Back to ' + hiddenBarLabel + ' responses' : 'Back to responses';
    Object.assign(backBtn.style, { position: 'absolute', bottom: '4px', right: '8px', zIndex: '10001', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' });
    backBtn.addEventListener('click', switchBackFromOverride);
    container.appendChild(backBtn);
}

// Create each labeled button group
config.buttonGroups.forEach(group => {

    const row = document.createElement('div');

Object.assign(row.style, {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '3px'
});

    // Group label
    const label = document.createElement('div');
    label.textContent = group.name;
    label.className = 'tm-group-label';

Object.assign(label.style, {
    width: '145px',
    minWidth: '145px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: group.labelColor || '#333',
    textAlign: 'right',
    paddingRight: '8px'
});

    row.appendChild(label);

    // Button area
    const buttonRow = document.createElement('div');

Object.assign(buttonRow.style, {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '3px',
    flex: '1'
});

group.buttons.forEach(buttonConfig => {
    buttonRow.appendChild(createButton({
        ...buttonConfig,
        backgroundColor: group.backgroundColor,
        hoverColor: group.hoverColor
    }));
});

    row.appendChild(buttonRow);
    container.appendChild(row);
});

document.body.insertBefore(container, document.body.firstChild);

// Case suggestion (v2.15): read the case, highlight one button if there
// is a clear winner. Suggest-only - it never clicks anything itself.
runSuggestion(container);

// Case logger (v2.18): report footer with export buttons.
buildReportFooter(container);

// Non-canned auto-log (v2.20): watch Review clicks for custom replies.
tmWatchReviewButton();

// Unpin #page-sidebar (Paragon pins it at top: 71px, so it stayed still
// while the rest of the page moved) and shift it down by the bar's height,
// so the whole page moves as one. A MutationObserver keeps this applied
// for the life of the case, since Paragon can reset the sidebar later.
const shiftSidebar = () => {
    const bar = document.getElementById('tm-main-bar');
    const sidebar = document.getElementById('page-sidebar');
    if (!bar || !sidebar || bar.offsetHeight <= 0) {
        return false;
    }
    if (sidebar.dataset.tmOriginalTop === undefined) {
        const currentTop = parseInt(sidebar.style.top, 10);
        sidebar.dataset.tmOriginalTop = isNaN(currentTop) ? '71' : String(currentTop);
    }
    const originalTop = parseInt(sidebar.dataset.tmOriginalTop, 10);
    const newTop = (originalTop + bar.offsetHeight) + 'px';
    if (sidebar.style.top !== newTop) {
        sidebar.style.top = newTop;
    }
    if (sidebar.style.position !== 'absolute') {
        sidebar.style.position = 'absolute';
    }
    const grid = document.querySelector('.dvr-grid_GL0L3, [class*="dvr-grid"]');
    if (grid && grid.style.marginTop) {
        grid.style.marginTop = '';
    }
    return true;
};
shiftSidebar();
applyResponsiveBar();
if (!window.__tmResponsiveInterval) {
    window.__tmResponsiveInterval = true;
    setInterval(applyResponsiveBar, 1000);
}
if (!window.__tmMainSidebarObserver) {
    window.__tmMainSidebarObserver = new MutationObserver(function() {
        shiftSidebar();
    });
    window.__tmMainSidebarObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style'],
        childList: true,
        subtree: true
    });
}
if (!window.__tmMainSidebarResize) {
    window.__tmMainSidebarResize = true;
    window.addEventListener('resize', function() { shiftSidebar(); applyResponsiveBar(); });
}

        //Lock Case on load (old)
        // setTimeout(function() {
        // var lockButton = document.querySelectorAll('[label="Lock Case"]')[0]
        //   lockButton.click();
        // }, 500);

        //Only lock case for your queue
        setTimeout(function(){
            if (crossQueueMode) { return; }
            try
            {
                var myQueue = "r4c-support@amazon.com";//change to your queue
                var myQueueTwo = "rcm-support@amazon.com";
                var p = document.getElementsByClassName("label");
                var currentQueue = p[2].nextElementSibling;
                if(currentQueue.textContent === myQueue || currentQueue.textContent === myQueueTwo)
                {
                    setTimeout(function(){
                        AfterLock()
                    },1000);
                }
                else
                {
                    init();
                }
            }
            catch(e)
            {
                console.log(e);
            }
        },1000);

    };

    let lastUrl = location.href;
    let urlCheckInterval;

    // Function to handle URL changes
    function handleUrlChange() {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            clearTimeout(urlCheckInterval);
            urlCheckInterval = setTimeout(function() {
                waitForQueueGate(init);
            }, 1500);
        }
    }
    // Setup URL change detection
    function setupUrlChangeDetection() {
        // History API changes
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            handleUrlChange();
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            handleUrlChange();
        };

        // Navigation events
        window.addEventListener('popstate', handleUrlChange, false);
        window.addEventListener('hashchange', handleUrlChange, false);

        // DOM changes observer
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                handleUrlChange();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    // =============================================
    // AUTO-EXPAND INITIAL CORRESPONDENCE (NEW CASES ONLY)
    // =============================================
    function autoExpandInitialCorrespondence() {
        // Use MutationObserver to wait for the correspondence section to fully load
        const observer = new MutationObserver((mutations, obs) => {
            // Look for the correspondence body container
            const correspondenceBody = document.querySelector('.body_RioZc');
            if (!correspondenceBody) return; // Not loaded yet

            // Get all correspondence row headers
            const headerButtons = correspondenceBody.querySelectorAll('button[data-paragon-element-id^="correspondence-row-"][data-paragon-element-id$="-header"]');
            if (headerButtons.length === 0) return; // Rows not loaded yet

            // Only auto-expand if exactly 1 correspondence (new case)
            if (headerButtons.length === 1) {
                const firstHeader = headerButtons[0];
                const rowContainer = firstHeader.closest('[class^="row_"]');
                const expander = rowContainer ? rowContainer.querySelector('[class^="expander_"]') : null;

                // Only click if currently collapsed (no "expanded" in class list)
                if (expander && !expander.className.includes('expanded')) {
                    console.log('[Relay Script] New case detected (1 correspondence) - auto-expanding initial message');
                    firstHeader.click();
                }
            } else {
                console.log('[Relay Script] Case has ' + headerButtons.length + ' correspondences - skipping auto-expand');
            }

            // Done - disconnect the observer
            obs.disconnect();
        });

        // Observe the entire document for changes until correspondence loads
        observer.observe(document.body, { childList: true, subtree: true });

        // Safety timeout - stop observing after 15 seconds
        setTimeout(() => observer.disconnect(), 15000);
    }




    // Queue gate: only activate when the case's Queue field is this script's
    // queue. This is what lets both scripts stay enabled at the same time
    // without showing two bars.
    const allowedQueueValues = new Set([
        "r4c-support@amazon.com", // support queue
        "rcm-support@amazon.com" // second gate: RCM queue
    ]);

    function readQueueValue() {
        const labels = document.querySelectorAll('.label');
        for (const el of labels) {
            if (el.textContent.trim().replace(':', '') === 'Queue') {
                const val = el.nextElementSibling;
                if (val) {
                    return val.textContent.trim();
                }
            }
        }
        return '';
    }

    function waitForQueueGate(onPass) {
        let attempts = 0;
        const check = () => {
            const queue = readQueueValue();
            if (allowedQueueValues.has(queue)) {
                onPass();
                return;
            }
            if (queue) {
                console.log('[Main script] Queue gate: queue is not an allowed queue (r4c-support / rcm-support), not activating (switch is in the native bar).');
                return;
            }
            attempts++;
            if (attempts < 30) {
                setTimeout(check, 500);
            } else {
                console.log('[Main script] Queue gate: queue is not an allowed queue (r4c-support / rcm-support), not activating (switch is in the native bar).');
            }
        };
        check();
    }

    // Initialize everything
    function initialize() {
        setupUrlChangeDetection();
        waitForQueueGate(function() {
            init();
            autoExpandInitialCorrespondence();
        });
    }

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();

    }
    //end of init

})();
