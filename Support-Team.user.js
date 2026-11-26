// ==UserScript==
// @name         Amazon Relay Responses R4C & RCM Support — Team
// @namespace    http://tampermonkey.net/
// @version      2.38
// @updateURL    https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Support-Team.user.js
// @downloadURL  https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Support-Team.user.js
// @description  Automatically inserts responses for Relay issues
// @author       Julian Woolcott & Hayden Lindsey & Sheshu Venugopal
// @match        https://paragon-na.amazon.com/hz/view-case?caseId=*
// @grant        none
// ==/UserScript==
    /*UPDATES:
    11/26/2026: Responsive bar (v2.37): the button bar now shrinks on smaller screens - below 1600px wide or 850px tall it uses tighter buttons and caps its own height at 45% of the viewport so the case stays visible. It switches back to the full layout automatically on a larger screen, re-checked on every resize and every second.
    11/25/2026: Removed 10 buttons now covered by the transfer buttons: Driver Verification, Contracts, Insurance, Assets, Site Escalation, Driver Assignment Issue, Auction Support, Suspended, Pending Verification and Verification Link (v2.36). Groups re-sorted by button count, so TRANSFERS moves up to second.
    11/25/2026: Transfer buttons now name their team and give the carrier the steps to reach it directly (v2.34, per J.T.). Trip button renamed 'Transfer to Trip Completion Dispute'.
    11/25/2026: Switch tray now re-asserts its in-flow style every second, so mixed-version installs heal within a second (v2.33, per J.T.). Plus a 10px gap above the tray and the Back button.
    11/25/2026: Switch tray and Back button are now in-flow rows at the bottom-right instead of absolutely positioned, so they can't cover the last row's buttons (v2.32, per J.T.).
    11/24/2026: SUPER ADMIN ISSUES removed (v2.31, per J.T., GitHub cleanup): the whole group is gone - all 14 responses and all 14 dropdown mappings.
    11/24/2026: Transfer destination list is a native select - the finder now matches native options and fires change on the select, so the transfer no longer stalls (v2.29, per J.T.).
    11/24/2026: The 'Another queue' radio is now found through its label's for-attribute, so the transfer no longer stalls with the panel open (v2.28, per J.T.).
    11/24/2026: Send completion is now signalled by the REVIEW YOUR REPLY preview closing, not the Send button disappearing (v2.27, per J.T.).
    11/24/2026: A TRANSFERS button click now arms the transfer - once the agent clicks Send, the script opens the Transfer panel, picks the destination and clicks Transfer Case (v2.25, per J.T.). The script never clicks Send itself.
    11/24/2026: NEW group TRANSFERS (v2.24, per J.T.): 12 buttons, one per destination queue, each inserting the transfer reply. Payment Support is NOT included (not yet transferrable).
    11/21/2026: NEW buttons 'Performance Final' and 'Account Access', same as Support Personal v2.39 (2.23, per J.T.).
    11/21/2026: EditSignature click is now wrapped in try/catch, so the 2-second signature fill still runs if the click throws (2.23, per J.T.).
    11/17/2026: Button groups re-sorted most buttons on top (2.21, per J.T.). Fixed rule from now on: groups always run most buttons first.
    11/17/2026: Super Admin row: removed 6 duplicate buttons and recolored the row orange (2.20, per J.T.).
    11/17/2026: NEW 'Super Admin Issues' row (2.19, per J.T.): 19 buttons, his texts verbatim.
    11/17/2026: Winter weather signature block added: US + Canadian notices with Relay Learning links (2.18, per J.T.).
    11/12/2026: Trailer Defect button ported from Personal, plus line-break fixes in the UIIA and Auction Support responses (2.17, per J.T.).
    11/11/2026: NEW button 'Auction Support': overview of Amazon Relay Auctions (2.16, per J.T.).
    11/11/2026: NEW button 'UIIA': intermodal certification canned message (2.15, per J.T.).
    11/10/2026: TEAM VERSION (per J.T.): the plain team build - no suggestion feature, no case logging. Do NOT install alongside the Personal Support script.
    11/04/2026: BASICs button renamed 'Safety Score Not Compliant' with the expanded FMCSA response (v2.14, per J.T.).
    11/04/2026: 3-way switch (per J.T.): Support / Tech / Auctions. Switch buttons now live in a shared bottom-right tray inside any native bar.
    11/04/2026: Second gate added (v2.12, per J.T.): rcm-support@amazon.com, so the Support bar now builds on RCM cases too.
    10/31/2026: Squished-buttons fix (v2.11, per J.T.): unhide now restores a hidden bar with display='flex', so buttons no longer look squished after switching back.
    10/31/2026: Back button location (v2.10, per J.T.): the top-left 'Back to' button is removed; the override bar gets one button at its bottom-right corner instead.
    10/31/2026: Switch button location (v2.9, per J.T.): the bottom-right chip is removed; the switch now lives ONLY inside the native bar, at its bottom-right corner.
    10/31/2026: Switch button back to bottom-right (v2.8, per J.T.'s preference): the top strip is replaced by a small fixed button at the bottom-right corner, and the switch inside the native bar is kept as well.
    10/31/2026: Switch button now also lives inside the other script's native bar, so it survives a page re-render (v2.7).
    10/31/2026: Override chip is now shown on page load on every case, no longer gated on the queue (v2.6).
    10/31/2026: Override switch is now a full-width strip at the top of the page (v2.5).
    10/31/2026: Override button clicks are now text-only — they insert the message without touching the dropdowns or Review (v2.4).
    10/31/2026: NEW override chip (v2.3): when the queue gate doesn't match, a 'Show Support responses anyway' chip builds this bar on the other queue's case.
    10/30/2026: Bar is now a sticky full-width bar at the top of the page flow, and the sidebar shifts down with it (v2.0).
    10/29/2026: Queue gate added (v1.9): the script only builds its bar when the queue is r4c-support@amazon.com.
    08/14/2026 Organized buttons into categories and color coded them.
    06/02/2025: Fixed to work properly after the Paragon sev 2.
    05/29/2025: Added 'Remove CC'd Emails' button, plus auto-height on the signature and response fields.
    */
    // Configuration object
const dropdownMappings = {
    "Safety Score Not Compliant": { category: "Performance", categoryValue: "37058498011", code: "Dispute", codeValue: "39474112881" },
    "CARB":                  { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "RLB Access / Visibility": { category: "RLB Access", categoryValue: "39778217681", code: "Load Board Visibility", codeValue: "39474112921" },
    "Background Check":      { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Domicile":              { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Selfie / Verification": { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Retake 101":            { category: "RLB Access", categoryValue: "39778217681", code: "Suspended", codeValue: "39474112901" },
    "Trailer Defect":        { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "In-Transit":            { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Submit BOL":            { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Missing BOL":           { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Assign Drivers":        { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Accident":              { category: "In-Transit Issues", categoryValue: "37058497991", code: "Accident Report", codeValue: "39474113031" },
    "Loss Prevention":       { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
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
    "Transfer to Trip Completion Dispute":        { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Transfer to Driver Verification":  { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Transfer to App & Web Portal":     { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Relay Mobile App", codeValue: "48827582041" },
    "Transfer to Contracts":            { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Contracts", codeValue: "48827581941" },
    "Transfer to Insurance":            { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Transfer to Assets":               { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Transfer to Site Escalations":     { category: "In-Transit Issues", categoryValue: "37058497991", code: "On-Site Issues (ROC)", codeValue: "39474113041" },
    "Transfer to Driver Assignment":    { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Transfer to Auctions":             { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Transfer to Safety Rewards":       { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },
    "Transfer to Suspension Appeals":   { category: "RLB Access", categoryValue: "39778217681", code: "Suspended", codeValue: "39474112901" },
    "Transfer to Account Verification": { category: "RLB Tech Issue", categoryValue: "37056877931", code: "Carrier Account", codeValue: "48827582001" },

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
        name: 'TRANSFERS',
        backgroundColor: '#0f766e',
        hoverColor: '#115e59',
        labelColor: '#0f766e',
        buttons: [
            { id: 'xferTripDisputes', text: 'Transfer to Trip Completion Dispute' },
            { id: 'xferDriverVerification', text: 'Transfer to Driver Verification' },
            { id: 'xferAppPortal', text: 'Transfer to App & Web Portal' },
            { id: 'xferContracts', text: 'Transfer to Contracts' },
            { id: 'xferInsurance', text: 'Transfer to Insurance' },
            { id: 'xferAssets', text: 'Transfer to Assets' },
            { id: 'xferSiteEscalations', text: 'Transfer to Site Escalations' },
            { id: 'xferDriverAssignment', text: 'Transfer to Driver Assignment' },
            { id: 'xferAuctions', text: 'Transfer to Auctions' },
            { id: 'xferSafetyRewards', text: 'Transfer to Safety Rewards' },
            { id: 'xferSuspensionAppeals', text: 'Transfer to Suspension Appeals' },
            { id: 'xferAccountVerification', text: 'Transfer to Account Verification' }
        ]
    },
    {
        name: 'ACCOUNT & COMPLIANCE',
        backgroundColor: '#0b66c3',
        hoverColor: '#084a8c',
        labelColor: '#0b66c3',
        buttons: [
            { id: 'basicsCompliant', text: 'Safety Score Not Compliant' },
            { id: 'carb', text: 'CARB' },
            { id: 'rlb', text: 'RLB Access / Visibility' },
            { id: 'BGCheck', text: 'Background Check' },
            { id: 'Domicile', text: 'Domicile' },
            { id: 'selfie', text: 'Selfie / Verification' },
            { id: 'retake', text: 'Retake 101' },
            { id: 'Solicitation', text: 'Solicitation' },
            { id: 'bank', text: 'Update Bank Info' },
            { id: 'uiia', text: 'UIIA' },
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
            { id: 'arc', text: 'Accident' },
            { id: 'lossprevention', text: 'Loss Prevention' },
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
        xferTripDisputes: `Dear Valued Carrier,

We are transferring your case to the Trip Completion Dispute team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Relay Trip Completion Status Dispute

Thank you for continuing to haul with Relay!`,
        xferDriverVerification: `Dear Valued Carrier,

We are transferring your case to the Driver Verification team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Relay Driver Verification Dispute

Thank you for continuing to haul with Relay!`,
        xferAppPortal: `Dear Valued Carrier,

We are transferring your case to the App & Web Portal team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Relay App & Web Portal Tech Support

Thank you for continuing to haul with Relay!`,
        xferContracts: `Dear Valued Carrier,

We are transferring your case to the Contracts team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Short-Term Contracts

Thank you for continuing to haul with Relay!`,
        xferInsurance: `Dear Valued Carrier,

We are transferring your case to the Insurance team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Insurance Compliance

Thank you for continuing to haul with Relay!`,
        xferAssets: `Dear Valued Carrier,

We are transferring your case to the Assets team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Asset Edit

Thank you for continuing to haul with Relay!`,
        xferSiteEscalations: `Dear Valued Carrier,

We are transferring your case to the Site Escalations team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Site Escalations

Thank you for continuing to haul with Relay!`,
        xferDriverAssignment: `Dear Valued Carrier,

We are transferring your case to the Driver Assignment team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Relay Driver Assignment Support

Thank you for continuing to haul with Relay!`,
        xferAuctions: `Dear Valued Carrier,

We are transferring your case to the Auctions team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Relay Actions Support

Thank you for continuing to haul with Relay!`,
        xferSafetyRewards: `Dear Valued Carrier,

We are transferring your case to the Safety Rewards team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on the "Rewards" button on the left side of the screen.

Thank you for continuing to haul with Relay!`,
        xferSuspensionAppeals: `Dear Valued Carrier,

We are transferring your case to the team that handles suspension appeals so they can review your appeal.

You don't need to do anything else. They will pick up this same case.

Thank you for continuing to haul with Relay!`,
        xferAccountVerification: `Dear Valued Carrier,

We are transferring your case to the Account Verification team so they can help you with this issue.

You don't need to do anything else. They will pick up this same case.

Thank you for continuing to haul with Relay!`,
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

Requesting a Call Back:

If you need live assistance with an active load, you can request a callback directly through the Relay app by following these steps:

Open the Relay Mobile App
Navigate to the load in question
Select "Request a call back" to connect with our live operations team

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

        lossprevention: `Dear Valued Carrier,

Thank you for reaching out. For inquiries related to Loss Prevention, please navigate to the Relay Support Center via your Relay account and create a case under the Topic: Loss Prevention. Our support team will review your case and follow up accordingly.

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

Requesting a Call Back:

If you need live assistance with an active load, you can request a callback directly through the Relay app by following these steps:

Open the Relay Mobile App
Navigate to the load in question
Select "Request a call back" to connect with our live operations team

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


      MissingBOL: `Dear Valued Carrier,

Thank you for reaching out regarding the missing Bill of Lading (BOL).

BOL documents are available for download directly through your Relay account. Please follow these steps:

Log in to your Relay account at relay.amazon.com

Navigate to the completed trip associated with the VRID.

Select the load details to locate and download the BOL.

If you are unable to locate the BOL through your Relay account, please reply to this email confirming you have attempted the steps above and we will investigate further.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

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
    // Create button element with styles
// ==== TRANSFER-ON-SEND ====
// A TRANSFERS button click arms a transfer; the transfer itself runs
// automatically right after the agent clicks Send on the review preview.
// The script NEVER clicks Send itself - the agent always reviews first.
// Discarding the reply, or clicking another button, drops the armed
// transfer. Any failed or timed-out step aborts and logs with a
// [Transfers] prefix - never retried blindly, never sent to the
// wrong queue. Send completion is the REVIEW YOUR REPLY preview
// closing - a Send button can persist on the page after the send
// (proven live Nov 24 on case 23584543611). Selectors are role +
// visible text, mirroring the
// existing Review-button finder (live inspection could not see raw HTML).
var TRANSFER_CFG = { pollMs: 250, sendWaitMs: 20000, stepWaitMs: 10000, queueWaitMs: 30000 };
    var TRANSFER_DESTINATIONS = {
        xferTripDisputes: { search: 'relay-tripstatus-disputes@amazon.com', option: 'relay-tripstatus-disputes@amazon.com' },
        xferDriverVerification: { search: 'Relay-driver-verification-checks@amazon.com', option: 'relay-driver-verification-checks' },
        xferAppPortal: { search: 'relay-feedback@amazon.com', option: 'relay-feedback@amazon.com' },
        xferContracts: { search: 'rcm-support@amazon.com', option: 'rcm-support@amazon.com' },
        xferInsurance: { search: 'nastinsuranceparagoninbox@amazon.com', option: 'nastinsuranceparagoninbox@amazon.com' },
        xferAssets: { search: 'relay-asset-verification-appeals@amazon.com', option: 'relay-asset-verification-appeals@amazon.com' },
        xferSiteEscalations: { search: 'relay-site-escalations@amazon.com', option: 'relay-site-escalations@amazon.com' },
        xferDriverAssignment: { search: 'relay-driver-assignment-support@amazon.com', option: 'relay-driver-assignment-support@amazon.com' },
        xferAuctions: { search: 'relay-auctions-suppport@amazon.com', option: 'relay-auctions-suppport@amazon.com' },
        xferSafetyRewards: { search: 'relay-safety-rewards-queue@amazon.com', option: 'relay-safety-rewards-queue@amazon.com' },
        xferSuspensionAppeals: { search: 'relay-am@amazon.com', option: 'relay-am@amazon.com' },
        xferAccountVerification: { search: 'relay-account-verification@amazon.com', option: 'relay-account-verification@amazon.com' }
    };
var pendingTransfer = null;
var transferWatchTimer = null;
var transferSendClicked = false;
var transferSawReply = false;

function xferFindKatButton(label) {
    var el = document.querySelector('kat-button[label="' + label + '"] button');
    if (el) { return el; }
    var all = document.querySelectorAll('kat-button button');
    for (var i = 0; i < all.length; i++) {
        if (all[i].textContent.trim() === label) { return all[i]; }
    }
    var btns = document.querySelectorAll('button');
    for (var j = 0; j < btns.length; j++) {
        if (btns[j].textContent.trim() === label) { return btns[j]; }
    }
    return null;
}

function xferFindRadio(name) {
    var labels = document.querySelectorAll('label');
    for (var i = 0; i < labels.length; i++) {
        if (labels[i].textContent.trim() === name) {
            var input = labels[i].querySelector('input[type="radio"]');
            if (input) { return input; }
            var forId = labels[i].getAttribute('for');
            if (forId) {
                var target = document.getElementById(forId);
                if (target) { return target; }
            }
        }
    }
    var katLabels = document.querySelectorAll('kat-label');
    for (var k = 0; k < katLabels.length; k++) {
        if ((katLabels[k].getAttribute('text') || '').trim() === name) {
            var kFor = katLabels[k].getAttribute('for');
            if (kFor) {
                var kTarget = document.getElementById(kFor);
                if (kTarget) { return kTarget; }
            }
        }
    }
    var radios = document.querySelectorAll('[role="radio"], input[type="radio"], kat-radio');
    for (var j = 0; j < radios.length; j++) {
        var r = radios[j];
        var txt = (r.getAttribute('label') || r.getAttribute('aria-label') || r.textContent || '').trim();
        if (txt === name) { return r; }
    }
    return null;
}

function xferClickRadio(name) {
    var r = xferFindRadio(name);
    if (!r) { return false; }
    var id = r.id || (r.getAttribute && r.getAttribute('id')) || '';
    if (id) {
        var lab = document.querySelector('label[for="' + id + '"]');
        if (lab) { lab.click(); }
    }
    r.click();
    return true;
}

function xferFindSearchBox() {
    var box = document.querySelector('input[placeholder="Type here to search"]');
    if (box) { return box; }
    box = document.querySelector('textarea[placeholder="Type here to search"]');
    if (box) { return box; }
    var inputs = document.querySelectorAll('input, textarea');
    for (var i = 0; i < inputs.length; i++) {
        if ((inputs[i].getAttribute('placeholder') || '') === 'Type here to search') { return inputs[i]; }
    }
    return null;
}

function xferSetSearch(text) {
    var box = xferFindSearchBox();
    if (!box) { return false; }
    try {
        var proto = box.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
        setter.call(box, text);
    } catch (e) {
        box.value = text;
    }
    box.dispatchEvent(new Event('input', { bubbles: true }));
    box.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
}

function xferFindOption(text) {
    var opts = document.querySelectorAll('[role="option"]');
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].textContent.trim() === text) { return opts[i]; }
    }
    var alts = document.querySelectorAll('kat-option, li');
    for (var j = 0; j < alts.length; j++) {
        if (alts[j].textContent.trim() === text) { return alts[j]; }
    }
    var natives = document.querySelectorAll('option');
    for (var k = 0; k < natives.length; k++) {
        var nv = natives[k].value || natives[k].getAttribute('value') || '';
        if (nv === text || natives[k].textContent.trim() === text) { return natives[k]; }
    }
    return null;
}

function xferClickOption(el) {
    if (!el) { return false; }
    el.click();
    if (el.tagName === 'OPTION') {
        el.selected = true;
        var sel = el.parentElement;
        while (sel && sel.tagName !== 'SELECT') { sel = sel.parentElement; }
        if (sel) {
            try {
                var setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
                setter.call(sel, el.value);
            } catch (e) {
                sel.value = el.value;
            }
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            sel.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    return true;
}

function xferListOptionTexts() {
    var out = [];
    var opts = document.querySelectorAll('[role="option"]');
    for (var i = 0; i < opts.length && out.length < 10; i++) {
        out.push(opts[i].textContent.trim());
    }
    var natives = document.querySelectorAll('option');
    for (var j = 0; j < natives.length && out.length < 10; j++) {
        out.push(natives[j].value || natives[j].textContent.trim());
    }
    return out.join(' | ');
}

function xferReadQueue() {
    var els = document.querySelectorAll('*');
    for (var i = 0; i < els.length; i++) {
        if (els[i].textContent.trim() === 'Queue:') {
            var row = els[i].parentElement;
            if (row) {
                var txt = row.textContent.replace('Queue:', '').trim();
                if (txt) { return txt; }
            }
        }
    }
    return null;
}

function xferFindSendButton() {
    return xferFindKatButton('Send');
}

function xferPreviewHeading() {
    var heads = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (var i = 0; i < heads.length; i++) {
        if (heads[i].textContent.trim() === 'REVIEW YOUR REPLY') { return heads[i]; }
    }
    return null;
}

function xferSendSuccessSeen() {
    var els = document.querySelectorAll('*');
    for (var i = 0; i < els.length; i++) {
        var t = els[i].textContent || '';
        if (t.indexOf('Email was sent successfully') !== -1) { return true; }
    }
    return false;
}

function xferReplyOpen() {
    return !!xferFindKatButton('Review') || !!xferPreviewHeading();
}

function xferWaitFor(check, timeoutMs, pollMs) {
    return new Promise(function(resolve) {
        var start = Date.now();
        function tick() {
            var val = null;
            try { val = check(); } catch (e) { val = null; }
            if (val) { resolve(val); return; }
            if (Date.now() - start >= timeoutMs) { resolve(null); return; }
            setTimeout(tick, pollMs);
        }
        tick();
    });
}

function armTransfer(id) {
    var dest = TRANSFER_DESTINATIONS[id];
    if (!dest) {
        console.warn('[Transfers] No destination for button ' + id);
        return;
    }
    pendingTransfer = { id: id, search: dest.search, option: dest.option };
    transferSendClicked = false;
    transferSawReply = false;
    console.log('[Transfers] Armed - transfer to ' + dest.option + ' will run after Send');
    xferStartWatch();
}

function disarmTransfer(reason) {
    if (!pendingTransfer) { return; }
    console.log('[Transfers] Disarmed (' + reason + ')');
    pendingTransfer = null;
    transferSendClicked = false;
    transferSawReply = false;
    xferStopWatch();
}

function xferStartWatch() {
    if (transferWatchTimer) { return; }
    transferWatchTimer = setInterval(xferWatchTick, TRANSFER_CFG.pollMs);
}

function xferStopWatch() {
    if (transferWatchTimer) { clearInterval(transferWatchTimer); transferWatchTimer = null; }
}

function xferWatchTick() {
    if (!pendingTransfer) { xferStopWatch(); return; }
    if (xferReplyOpen()) { transferSawReply = true; }
    var sendBtn = transferSendClicked ? null : xferFindSendButton();
    if (sendBtn && !sendBtn.__xferTracked) {
        sendBtn.__xferTracked = true;
        sendBtn.addEventListener('click', function() {
            if (!pendingTransfer) { return; }
            console.log('[Transfers] Send clicked - waiting for the reply to go out');
            transferSendClicked = true;
            xferWaitForSendDone(pendingTransfer);
        });
        console.log('[Transfers] Send button found - transfer to ' + pendingTransfer.option + ' will run after Send');
    }
    if (!transferSendClicked && transferSawReply && !xferReplyOpen()) {
        disarmTransfer('reply closed without sending');
    }
}

function xferWaitForSendDone(dest) {
    xferWaitFor(function() {
        return xferPreviewHeading() ? null : true;
    }, TRANSFER_CFG.sendWaitMs, TRANSFER_CFG.pollMs).then(function(done) {
        if (!done) {
            console.warn('[Transfers] ABORT: review preview did not close within ' + (TRANSFER_CFG.sendWaitMs / 1000) + 's - transfer NOT run. If the reply went out, transfer manually.');
            disarmTransfer('send not confirmed');
            return;
        }
        console.log('[Transfers] Reply sent - running transfer to ' + dest.option + (xferSendSuccessSeen() ? ' (success banner seen)' : ' (no success banner seen)'));
        disarmTransfer('transfer running');
        xferRunTransfer(dest).then(function(ok) {
            if (ok) {
                console.log('[Transfers] Transfer complete - case is now in ' + dest.option);
            } else {
                console.warn('[Transfers] Transfer did NOT complete - check the Queue value and transfer manually if needed');
            }
        });
    });
}

async function xferRunTransfer(dest) {
    console.log('[Transfers] Opening the Transfer panel');
    var transferBtn = xferFindKatButton('Transfer');
    if (!transferBtn) {
        console.warn('[Transfers] ABORT: Transfer button not found');
        return false;
    }
    transferBtn.click();
    var radio = await xferWaitFor(function() { return xferFindRadio('Another queue'); }, TRANSFER_CFG.stepWaitMs, TRANSFER_CFG.pollMs);
    if (!radio) {
        console.warn('[Transfers] ABORT: transfer panel did not open (no Another queue radio)');
        return false;
    }
    xferClickRadio('Another queue');
    console.log('[Transfers] Another queue selected - waiting for the search box');
    var searchBox = await xferWaitFor(function() { return xferFindSearchBox(); }, TRANSFER_CFG.stepWaitMs, TRANSFER_CFG.pollMs);
    if (!searchBox) {
        console.warn('[Transfers] ABORT: destination search box did not appear after selecting Another queue');
        return false;
    }
    if (!xferSetSearch(dest.search)) {
        console.warn('[Transfers] ABORT: destination search box not found');
        return false;
    }
    console.log('[Transfers] Searching for ' + dest.search);
    var option = await xferWaitFor(function() { return xferFindOption(dest.option); }, TRANSFER_CFG.stepWaitMs, TRANSFER_CFG.pollMs);
    if (!option) {
        console.warn('[Transfers] ABORT: no destination option matching "' + dest.option + '" (options now: ' + xferListOptionTexts() + ')');
        return false;
    }
    xferClickOption(option);
    console.log('[Transfers] Destination selected: ' + dest.option);
    var caseBtn = await xferWaitFor(function() {
        var b = xferFindKatButton('Transfer Case');
        if (!b) { return null; }
        if (b.disabled || b.hasAttribute('disabled')) { return null; }
        return b;
    }, TRANSFER_CFG.stepWaitMs, TRANSFER_CFG.pollMs);
    if (!caseBtn) {
        console.warn('[Transfers] ABORT: Transfer Case button never became enabled');
        return false;
    }
    caseBtn.click();
    console.log('[Transfers] Transfer Case clicked - waiting for the Queue to change');
    var queue = await xferWaitFor(function() {
        var q = xferReadQueue();
        if (!q) { return null; }
        return (q.indexOf(dest.option) !== -1 || q.indexOf(dest.search) !== -1) ? q : null;
    }, TRANSFER_CFG.queueWaitMs, TRANSFER_CFG.pollMs);
    if (!queue) {
        console.warn('[Transfers] Transfer Case was clicked but the Queue did not show ' + dest.option + ' within ' + (TRANSFER_CFG.queueWaitMs / 1000) + 's (Queue now: ' + xferReadQueue() + '). The transfer may still have gone through if the page reloaded - check the Queue value.');
        return false;
    }
    console.log('[Transfers] Queue is now: ' + queue);
    return true;
}
// ==== /TRANSFER-ON-SEND ====

const createButton = ({ id, text, backgroundColor, hoverColor }) => {
    const button = document.createElement('button');
    button.className = 'tm-response-btn';
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
    insertResponse(responses[id]);
    // Transfer-on-Send: arm a transfer for TRANSFERS buttons, drop any
    // armed transfer for other buttons. This runs before the override
    // return so a transfer arms even in override mode.
    if (id.indexOf('xfer') === 0) {
        armTransfer(id);
    } else {
        disarmTransfer('another button clicked');
    }
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
                nativeBar.appendChild(tray);
            }
            // Re-assert in-flow layout on every tick: an older script
            // version may have created this tray with absolute
            // positioning, which floats it over the last row's buttons.
            Object.assign(tray.style, { position: '', bottom: '', right: '', zIndex: '', display: 'flex', gap: '6px', justifyContent: 'flex-end', width: '100%', boxSizing: 'border-box', marginTop: '10px' });
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
    Object.assign(backBtn.style, { alignSelf: 'flex-end', order: '99', marginTop: '10px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' });
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
