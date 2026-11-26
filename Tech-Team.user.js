// ==UserScript==
// @name         Amazon Relay Responses MMPM Version 2 - Grouped — Team
// @namespace    http://tampermonkey.net/
// @version      3.44
// @updateURL    https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Tech-Team.user.js
// @downloadURL  https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Tech-Team.user.js
// @description  Automatically inserts responses for Relay issues - grouped and color-coded tech queue buttons
// @author       Julian Woolcott & Hayden Lindsey & Sheshu Venugopal
// @match        https://paragon-na.amazon.com/hz/view-case?caseId=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    /*UPDATES:
    11/26/2026: Responsive bar (v3.43): the button bar now shrinks on smaller screens - below 1600px wide or 850px tall it uses tighter buttons and caps its own height at 45% of the viewport so the case stays visible. It switches back to the full layout automatically on a larger screen, re-checked on every resize and every second.
    11/25/2026: Transfer buttons now name their team and give the carrier the steps to reach it directly (v3.41, per J.T.). Trip button renamed 'Transfer to Trip Completion Dispute'.
    11/25/2026: Switch tray now re-asserts its in-flow style every second, so mixed-version installs heal within a second (v3.40, per J.T.). Plus a 10px gap above the tray and the Back button.
    11/25/2026: Switch tray and Back button are now in-flow rows at the bottom-right instead of absolutely positioned, so they can't cover the last row's buttons (v3.39, per J.T.).
    11/24/2026: SUPER ADMIN ISSUES removed (v3.38, per J.T., GitHub cleanup): the whole group is gone - all 13 responses and all 13 dropdown mappings.
    11/24/2026: Transfer destination list is a native select - the finder now matches native options and fires change on the select, so the transfer no longer stalls (v3.37, per J.T.).
    11/24/2026: The 'Another queue' radio is now found through its label's for-attribute, so the transfer no longer stalls with the panel open (v3.36, per J.T.).
    11/24/2026: Send completion is now signalled by the REVIEW YOUR REPLY preview closing, not the Send button disappearing (v3.35, per J.T.).
    11/24/2026: A TRANSFERS button click now arms the transfer - once the agent clicks Send, the script opens the Transfer panel, picks the destination and clicks Transfer Case (v3.34, per J.T.). The script never clicks Send itself.
    11/24/2026: NEW group TRANSFERS (v3.33, per J.T.): 11 buttons, one per destination queue, each inserting the transfer reply. App & Web Portal is NOT included - it is this script's own queue.
    11/21/2026: EditSignature click is now wrapped in try/catch, so the 2-second signature fill still runs if the click throws (3.32, per J.T.).
    11/17/2026: Button groups re-sorted most buttons on top (3.30, per J.T.). Fixed rule from now on: groups always run most buttons first.
    11/17/2026: Super Admin row: removed 5 duplicate buttons (3.29, per J.T.).
    11/17/2026: NEW 'Super Admin Issues' row (3.27, per J.T.): 18 buttons.
    11/17/2026: Winter weather signature block added: US + Canadian notices with Relay Learning links (3.26, per J.T.).
    11/11/2026: NEW button 'Auction Support': overview of Amazon Relay Auctions (3.23, per J.T.).
    11/11/2026: NEW button 'UIIA': intermodal certification canned message (3.22, per J.T.).
    11/11/2026: App combo buttons added (3.21, per J.T.): 'App + In-Transit' and 'App + Performance'.
    11/10/2026: Four new buttons (v3.20, per J.T.): Suspended, Submit BOL, Call Back, Badge.
    11/10/2026: TEAM VERSION (per J.T.): the plain team build - no suggestion feature, no case logging. Do NOT install alongside the Personal Tech script.
    11/04/2026: 3-way switch (per J.T.): Support / Tech / Auctions. Switch buttons now live in a shared bottom-right tray inside any native bar.
    10/31/2026: Squished-buttons fix (v3.18, per J.T.): unhide now restores a hidden bar with display='flex', so buttons no longer look squished after switching back.
    10/31/2026: Back button location (v3.17, per J.T.): the top-left 'Back to' button is removed; the override bar gets one button at its bottom-right corner instead.
    10/31/2026: Switch button location (v3.16, per J.T.): the switch now lives ONLY inside the native bar, at its bottom-right corner.
    10/31/2026: Switch button back to bottom-right (v3.15, per J.T.'s preference): the top strip is replaced by a small fixed button at the bottom-right corner, and the switch inside the native bar is kept as well.
    10/31/2026: Switch button now also lives inside the other script's native bar, so it survives a page re-render (v3.14).
    10/31/2026: Override chip is now shown on page load on every case, no longer gated on the queue (v3.13).
    10/31/2026: Override switch is now a full-width strip at the top of the page (v3.12).
    10/31/2026: Override button clicks are now text-only — they insert the message without touching the dropdowns or Review (v3.11).
    10/31/2026: NEW override chip (v3.10): when the queue gate doesn't match, a small 'Show Tech responses anyway' chip builds this bar on the other queue's case.
    10/30/2026: Sidebar unpinned (v3.7): #page-sidebar now scrolls with the page, and a MutationObserver keeps re-applying the top shift when Paragon resets it.
    10/30/2026: Sidebar shift (v3.6): the whole #page-sidebar now moves down by the bar's height, so it moves as one with the rest of the page.
    10/30/2026: Grid shift (v3.5): the left-hand .dvr-grid is now pushed down by the bar's height after the bar builds.
    10/30/2026: Sticky full-width bar (v3.4): the bar now sits in the page flow at the top, so Paragon's header, search box and Case actions shift down below it.
    10/29/2026: Queue gate added (v3.1): the script only builds its bar when the queue is relay-feedback@amazon.com.
    10/29/2026: Category/reason auto-select added on button click: category is selected, reason code follows, then Review is clicked.
    10/28/2026: Buttons organized into related groups, ordered most buttons on top, and color coded.
    10/28/2026: Ported the RAS auto-expand of the first correspondence, so the initial message opens when a case loads.
    06/02/2025: Fixed to work properly after the Paragon sev 2.
    05/29/2025: Added 'Remove CC'd Emails' button, plus auto-height on the signature and response fields.
    */
    // Configuration object - groups are color-coded differently from the first script
    const config = {
        buttonGroups: [
            {
                name: 'TRANSFERS',
                backgroundColor: '#0b66c3',
                hoverColor: '#084a8c',
                buttons: [
                    { id: 'xferTripDisputes', text: 'Transfer to Trip Completion Dispute' },
                    { id: 'xferDriverVerification', text: 'Transfer to Driver Verification' },
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
                name: 'ACCOUNT & REDIRECTS',
                backgroundColor: '#be123c',
                hoverColor: '#9f1239',
                buttons: [
                    { id: 'paymentissue', text: 'Payment Issue' },
                    { id: 'generalsupport', text: 'General Support' },
                    { id: 'performance', text: 'Performance' },
                    { id: 'insurance', text: 'Insurance' },
                    { id: 'contracts', text: 'Contracts' },
                    { id: 'assets', text: 'Assets' },
                    { id: 'suspended', text: 'Suspended' },
                    { id: 'other', text: 'Other Issue' },
                    { id: 'uiia', text: 'UIIA' },
                    { id: 'auctionSupport', text: 'Auction Support' }
                ]
            },
            {
                name: 'LOAD BOARD & DRIVERS',
                backgroundColor: '#0f766e',
                hoverColor: '#115e59',
                buttons: [
                    { id: 'RLBnoWork', text: 'RLB NoLoad' },
                    { id: 'newcarrierloadvisibility', text: 'New Carrier Loads Visibility' },
                    { id: 'assigndrivers', text: 'AssignDrivers' },
                    { id: 'driverassignmentissue', text: 'Driver Assignment Issue' },
                    { id: 'driverineligible', text: 'Driver Verification/Selfie' },
                    { id: 'badge', text: 'Badge' }
                ]
            },
            {
                name: 'APP & TECH',
                backgroundColor: '#7c3aed',
                hoverColor: '#5b21b6',
                buttons: [
                    { id: 'navigation', text: 'Nav/App Issue' },
                    { id: 'pageloading', text: 'WebPageLoading' },
                    { id: 'appissueExpBehaviour', text: 'App/GPS Issue' },
                    { id: 'appintransit', text: 'App + In-Transit' },
                    { id: 'appperformance', text: 'App + Performance' },
                    { id: 'relayassistant', text: 'Relay Assistant' }
                ]
            },
            {
                name: 'TRIPS & CHECK-IN',
                backgroundColor: '#ea580c',
                hoverColor: '#c2410c',
                buttons: [
                    { id: 'earlycheckin', text: 'Early CheckIn' },
                    { id: 'intransit', text: 'InTransit' },
                    { id: 'originarrival', text: 'Origin Arrival' },
                    { id: 'submitBol', text: 'Submit BOL' },
                    { id: 'CallBack', text: 'Call Back' }
                ]
            },
            {
                name: 'CASE FLOW',
                backgroundColor: '#a16207',
                hoverColor: '#854d0e',
                buttons: [
                    { id: 'acknowledge', text: 'WIP/SIM' },
                    { id: 'moreinfo', text: 'More Info Needed' }
                ]
            }
        ],
        buttonStyle: {
            textColor: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            margin: '0',
            fontSize: '12px'
        },
        containerStyle: {
            // Sticky, in the page flow: full width like before, but Paragon's
            // content shifts down below the bar instead of sitting behind it,
            // and the bar stays pinned at the top while scrolling.
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

    // Response templates - unchanged from MMPM Version 2
    const responses = {
        xferTripDisputes: `Dear Carrier,

We are transferring your case to the Trip Completion Dispute team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Relay Trip Completion Status Dispute

Thank you for continuing to haul with Relay!`,
        xferDriverVerification: `Dear Carrier,

We are transferring your case to the Driver Verification team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Relay Driver Verification Dispute

Thank you for continuing to haul with Relay!`,
        xferContracts: `Dear Carrier,

We are transferring your case to the Contracts team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Short-Term Contracts

Thank you for continuing to haul with Relay!`,
        xferInsurance: `Dear Carrier,

We are transferring your case to the Insurance team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Insurance Compliance

Thank you for continuing to haul with Relay!`,
        xferAssets: `Dear Carrier,

We are transferring your case to the Assets team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Asset Edit

Thank you for continuing to haul with Relay!`,
        xferSiteEscalations: `Dear Carrier,

We are transferring your case to the Site Escalations team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Site Escalations

Thank you for continuing to haul with Relay!`,
        xferDriverAssignment: `Dear Carrier,

We are transferring your case to the Driver Assignment team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Relay Driver Assignment Support

Thank you for continuing to haul with Relay!`,
        xferAuctions: `Dear Carrier,

We are transferring your case to the Auctions team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on Support Center
2. Click Create a new case
3. Select topic: Relay Actions Support

Thank you for continuing to haul with Relay!`,
        xferSafetyRewards: `Dear Carrier,

We are transferring your case to the Safety Rewards team so they can help you with this issue.

Next time, you can reach them directly:

1. Click on the "Rewards" button on the left side of the screen.

Thank you for continuing to haul with Relay!`,
        xferSuspensionAppeals: `Dear Carrier,

We are transferring your case to the team that handles suspension appeals so they can review your appeal.

You don't need to do anything else. They will pick up this same case.

Thank you for continuing to haul with Relay!`,
        xferAccountVerification: `Dear Carrier,

We are transferring your case to the Account Verification team so they can help you with this issue.

You don't need to do anything else. They will pick up this same case.

Thank you for continuing to haul with Relay!`,
        RLBnoWork: `Dear Carrier,

Thank you for reaching out. However, this queue is meant for technical support needed with issues using the Relay app/portal.
We often get carrier feedback that smaller carriers do not get a chance to book enough loads on Relay Load Board. In order to provide equal opportunity to all carriers using Relay Load Board, our algorithm tries and equalizes the loads among all carriers in a region based on the supply and demand in that region. The number of loads you see can also be based on your performance scores. Hence, based on your performance and the supply-and-demand dynamics in your region, the number of loads you can see varies. Check the filters you are using when you search. The more filters you have selected, the less loads you will be able to see. For additional details on how to utilize the load board, please reference the Relay Carrier User Guide: https://dfz3xbn3chdu5.cloudfront.net/OptimusWebPlatform/release-notes/Relay_Carrier_User_Guide.pdf

Thanks for continuing to haul with Relay!`,
        driverassignmentissue: `Dear Carrier,

Thank you for your continued patience as we work to support you on this matter. In the meantime, please try the following steps to troubleshoot.

Step 1 — Hard Refresh & Clear Browser Cache:

Before attempting to reassign the driver, please perform a hard refresh of your browser:

Windows/Chrome: Press Ctrl + Shift + R
Mac/Safari or Chrome: Press Cmd + Shift + R
After the hard refresh, clear your browser cache and cookies, then log back into the Relay portal and attempt the driver assignment again.

Step 2 — Try a Different Browser:

If the issue persists after the hard refresh, we recommend attempting the driver assignment using Google Chrome, as it is the recommended browser for the Relay portal. If you are already using Chrome, please try an Incognito/Private window to rule out any cached session data.

Step 3 — Confirm Prior Block Status:

If the driver recently completed a prior block on this same contract, please verify that the previous block shows a status of Completed in your Relay portal before attempting to assign the driver to the current block. An open or in-progress prior block may prevent the system from accepting a new assignment for the same driver.

Please attempt these steps and let us know if the issue is resolved. If the problem continues after completing all steps above, please reply to this case.

Thanks for continuing to haul with Relay!`,
        relayassistant: `Dear Carrier,

Thank you for reaching out regarding the Relay Assistant. To help you understand this tool, here are some helpful resources and course materials.

These guides will walk you through:
- How to access and navigate the Relay Assistant
- Available features and functionalities
- Best practices for using the tool
- Troubleshooting common issues

1. Relay Assistant: Trip Support for Drivers - https://relay.amazon.com/cases/sc/help/search/details?detailProps=JTdCJTIydHlwZSUyMiUzQSUyMkNPVVJTRSUyMiUyQyUyMmlkJTIyJTNBJTIyODlmMmFhZmQtNzkyZC00NDBjLTgzNmQtYjdlMjU5MzQ4MjA5JTIyJTdE

2. Relay Assistant: Trip Support - https://relay.amazon.com/cases/sc/help/search/details?detailProps=JTdCJTIydHlwZSUyMiUzQSUyMkNPVVJTRSUyMiUyQyUyMmlkJTIyJTNBJTIyNGViMjRhMGItNjg5Ni00ZDUwLThkZWUtNWM0NDUxYjkzODQxJTIyJTdE

Thanks for continuing to haul with Relay!`,
        acknowledge: `Dear Carrier,

Thank you for your continued patience. We are currently reviewing the case to determine a resolution, and your understanding is greatly appreciated.

Thanks for continuing to haul with Relay!`,
        originarrival: `Dear Carrier,

Thank you for reaching out.
Please note:
- Drivers must complete all pre-registration steps in Relay before arriving to pickup
- Required steps: Review Tour, Enable Location, Register/Select Vehicle
- Late pre-registration prevents proper mobile geofence check-in
- System only records a mobile geofence timestamp for pre-registered drivers

To minimize these issues, your driver is encouraged to complete Pre-Registration before departing for their destination
If a load does not reflect on your Performance tab, for “last 6 active weeks” or “weekly” then it is not impacting your Relay Performance Score.

Thanks for continuing to haul with Relay!`,
        insurance: `Dear Carrier,

Thank you for reaching out. However, this queue is meant for technical support needed with issues using the Relay app/portal.

For issues related to Insurance, please navigate to Relay’s Support Center, click “create a new case” and select the Topic: Insurance Compliance.

Thanks for continuing to haul with Relay!`,
        newcarrierloadvisibility: `Dear Carrier,

The Relay Load Board limits new carrier bookings in their first few weeks to help ensure carriers do not overbook themselves while learning how to utilize the Relay Load Board. Once your first few weeks of executed loads are complete, your visibility to loads on the Relay Load Board will be dependent on your Relay Performance Score. For additional questions about your Relay Performance Score, please access the Frequently Asked Questions in your Support Center.

If you have less than three executed loads in the trailing 6 weeks, or your performance grade is a C+ or below, there will be booking limits. The limit is 7 loads per week.

Thanks for continuing to haul with Relay!`,
        other: `Dear Carrier,

Thank you for reaching out. However, this queue is meant for technical support needed with issues using the Relay app/portal.

Please navigate to Relay’s Support Center and click “create a new case.” If your Topic is not listed, select "Other" for further assistance.

Thanks for continuing to haul with Relay!`,
        paymentissue: `Dear Carrier,

Please file a payment dispute through the Relay portal and follow the steps below:
Go to Relay > Payments > File a dispute > Continue to file a dispute (from dialog box) > Select number of items or loads from invoice > Proceed to dispute.
If you want to add a “Missing item”:
Go to Relay > Payments > Missing Item > Load > Enter Load Id > Add to dispute.
Once you file a dispute, please follow up with aprelay@amazon.com.

Thanks for continuing to haul with Relay!`,
        assigndrivers: `Dear Carrier,

If you want to invite yourself or drivers to manage work in the app, you can do so through the Driver Roster. Driver invitations expire after 72 hours. If an invitation has expired, please navigate to the Driver Roster, select the driver, and resend the invite. Once you register yourself or drivers you can begin assigning work using the Trips page in Relay. For additional details on setting up drivers in the Driver Roster or assigning drivers work, please reference the Relay Carrier User Guide: https://dfz3xbn3chdu5.cloudfront.net/OptimusWebPlatform/release-notes/Relay_Carrier_User_Guide.pdf

Thanks for continuing to haul with Relay!`,
        assets: `Dear Carrier,

Thank you for reaching out. However, this queue is meant for technical support needed with issues using the Relay app/portal.

For issues related to Assets, please navigate to Relay’s Support Center, click “create a new case” and select the Topic: Assets.

Thanks for continuing to haul with Relay!`,
        performance: `Dear Carrier,

Thank you for reaching out. However, this queue is meant for technical support needed with issues using the Relay app/portal.

For concerns impacting your Relay Performance Score, please submit a Performance Dispute by navigating to the Performance page and clicking the Dispute button next to the applicable Tour ID/ VRID.

If a load does not reflect on your Performance tab, for “last 6 active weeks” or “weekly” then it is not impacting your Relay Performance Score.

Thanks for continuing to haul with Relay!`,
        earlycheckin: `Dear Carrier,

Please note that this is not an application issue, these are Relay policies: you can check in on site only 30 minutes prior to the load. Please adhere to this policy.

Thanks for continuing to haul with Relay!`,
        navigation: `Dear Carrier,

Any of your cases claiming "App issue" or "Unable to navigate" need to show real-time screenshot(s) of the issue being faced.

If you're experiencing issues accessing relay applications, please ensure that your internet connection is stable and working correctly. Sometimes, network interruptions can affect access. Also, you can follow the steps below to further troubleshoot the issue:
1) Swipe/close the app completely and then restart it.
2) Restart the device
3) Ensure you have the app updated.
4) Ensure that you have a device with the proper operating system.

Please ensure you share the problem through “Give Feedback” option within the app selecting “Relay App” and sharing the issue.

Thanks for continuing to haul with Relay!`,
        moreinfo: `Dear Carrier,

Thank you for reaching out. To look into this further, please reply to this case with the following:

- Your SCAC
- The email address and role of the affected user
- The Load ID or VRID, if a load is involved
- A screenshot of the issue or error message
- The date and time the issue happened
- A short description of what you tried

You may find this optional Relay Learning Center course helpful:
- Guide to Relay Feedback: https://relay.amazon.com/learning/all-resources?filterCriteria=&openCourse=6efee27c-1057-4be5-b049-c7c3421d01c8

Thanks for continuing to haul with Relay!`,
        driverineligible: `Dear Carrier,

Thank you for reaching out. However, this queue is meant for technical support needed with issues using the Relay app/portal.

For issues related to Relay Driver Verification or Selfie Check Failures, please navigate to Relay’s Support Center, click “create a new case” and select the Topic: Relay Driver Verification Dispute.

Thanks for continuing to haul with Relay!`,
        intransit: `Dear Carrier,

For issues related to In-Transit Trips please take the following steps:

1. Go to your "Trips" and then "In Transit.".
2. Identify the Trip/VRID needing support.
3. Use the dropdown options to complete the delay report.
4. Describe the issue and follow the prompts.

For Trip Completion issues (request a timestamp)

1. Go to your "Trips" and then "In Transit.".
2. Identify the VRID and select "Request trip support" under it.
3. Select "Create a new case" in the right side panel.
4. Choose "Trip Completion Status Dispute" and provide details about the issue.

You can report a delay in Amazon Relay. Go to Trips > In Transit, and then click on the trip that is delayed. Click Report delay, and fill in the form with the new ETA and the reason for the delay.

Relay Assistant for In-Transit Trips: https://relay.amazon.com/learning?filterCriteria=Relay%20Assistant%3A%20Trip%20Support&openCourse=4eb24a0b-6896-4d50-8dee-5c4451b93841&ref=owp_nav_learning_center
Reporting Delays (LTR) for On Time Performance: https://relay.amazon.com/cases/sc/help/search?query=JTIyUmVwb3J0aW5nJTIwRGVsYXlzJTIwKExUUiklMjBmb3IlMjBPbiUyMFRpbWUlMjBQZXJmb3JtYW5jZSUyMg

Requesting a Call Back:

If you need live assistance with an active load, you can request a callback directly through the Relay app by following these steps:

Open the Relay Mobile App
Navigate to the load in question
Select "Request a call back" to connect with our live operations team

Thanks for continuing to haul with Relay!`,
        appintransit: `Dear Carrier,

Thank you for reaching out. Below you'll find guidance for resolving Relay app issues and accessing in-transit trip support.

Relay App Troubleshooting
Any of your cases claiming "App issue" or "Unable to navigate" need to show real-time screenshot(s) of the issue being faced.

If you're experiencing issues accessing relay applications, please ensure that your internet connection is stable and working correctly. Sometimes, network interruptions can affect access. Also, you can follow the steps below to further troubleshoot the issue:
1) Swipe/close the app completely and then restart it.
2) Restart the device
3) Ensure you have the app updated.
4) Ensure that you have a device with the proper operating system.

Please ensure you share the problem through "Give Feedback" option within the app selecting "Relay App" and sharing the issue.

How to Get In-Transit Trip Support:

For issues related to In-Transit Trips please take the following steps:

1. Go to your "Trips" and then "In Transit.".
2. Identify the Trip/VRID needing support.
3. Use the dropdown options to complete the delay report.
4. Describe the issue and follow the prompts.

For Trip Completion issues (request a timestamp)

1. Go to your "Trips" and then "In Transit.".
2. Identify the VRID and select "Request trip support" under it.
3. Select "Create a new case" in the right side panel.
4. Choose "Trip Completion Status Dispute" and provide details about the issue.

You can report a delay in Amazon Relay. Go to Trips > In Transit, and then click on the trip that is delayed. Click Report delay, and fill in the form with the new ETA and the reason for the delay.

Relay Assistant for In-Transit Trips: https://relay.amazon.com/learning?filterCriteria=Relay%20Assistant%3A%20Trip%20Support&openCourse=4eb24a0b-6896-4d50-8dee-5c4451b93841&ref=owp_nav_learning_center
Reporting Delays (LTR) for On Time Performance: https://relay.amazon.com/cases/sc/help/search?query=JTIyUmVwb3J0aW5nJTIwRGVsYXlzJTIwKExUUiklMjBmb3IlMjBPbiUyMFRpbWUlMjBQZXJmb3JtYW5jZSUyMg

Requesting a Call Back:

If you need live assistance with an active load, you can request a callback directly through the Relay app by following these steps:

Open the Relay Mobile App
Navigate to the load in question
Select "Request a call back" to connect with our live operations team

Thanks for continuing to haul with Relay!`,
        appperformance: `Dear Carrier,

Thank you for reaching out. Below you'll find guidance for resolving Relay app issues and submitting a performance dispute.

Relay App Troubleshooting
Any of your cases claiming "App issue" or "Unable to navigate" need to show real-time screenshot(s) of the issue being faced.

If you're experiencing issues accessing relay applications, please ensure that your internet connection is stable and working correctly. Sometimes, network interruptions can affect access. Also, you can follow the steps below to further troubleshoot the issue:
1) Swipe/close the app completely and then restart it.
2) Restart the device
3) Ensure you have the app updated.
4) Ensure that you have a device with the proper operating system.

Please ensure you share the problem through "Give Feedback" option within the app selecting "Relay App" and sharing the issue.

Performance Dispute Process
For concerns impacting your Relay Performance Score, please submit a Performance Dispute by navigating to the Performance page and clicking the Dispute button next to the applicable Tour ID/ VRID.

If a load does not reflect on your Performance tab, for "last 6 active weeks" or "weekly" then it is not impacting your Relay Performance Score.

Thanks for continuing to haul with Relay!`,
        appissueExpBehaviour: `Dear Carrier,

Ensure that the drivers are using the latest version of the app on their phone with the settings advised below.
Communicate with drivers to use the Relay Mobile app during all load execution, making sure that it is always running during the trip with the data switched-on.
Encourage your drivers to use mobile devices with Android OS version 7 and above / iOS Version 13.1 and above.
Communicate with drivers to perform the proper 4-step driver process in real time using Relay Mobile Check-In/ Check-out in our sites to ensure that the trip is executed properly. These steps must be done in real time to be considered compliant.
Drivers should not swipe away or force-close the app as that will lead to a loss of GPS data. Also, if the driver is certain that they were not doing so, inform the driver that they should keep the app in the foreground as much as possible so the app can continue to collect location data.

Thanks for continuing to haul with Relay!`,
        generalsupport: `Dear Carrier,

Thank you for reaching out. However, this queue is meant for technical support needed with issues using the Relay app/portal.

For concerns regarding your Relay Account, please review the latest e-mail your Primary Administrator account received from Relay. For additional support, navigate to the Relay Support Center, click “create a new case” and select the applicable topic.

If you're looking to update the Primary Administrator, please reach out to: relay-account-investigations@amazon.com

To unlock your account please contact customer service and explain that you cannot log in to your account and were advised to contact customer service U.S. and Canada 1-800-388-5512.

Thanks for continuing to haul with Relay!`,
        pageloading: `Dear Carrier,

Please clear the cache and cookies from your browser history and check again. You should then be able to see your Load Board working.
In the meantime, here is what worked as a temporary workaround:
1) Go to Chrome settings: chrome://settings/
2) Select privacy and security
3) Select Clear browsing data
4) Check the “Cached images and files” box and then click “Clear data”.

Thanks for continuing to haul with Relay!`,
        contracts: `Dear Carrier,

Thank you for reaching out. However, this queue is meant for technical support needed with issues using the Relay app/portal.

For issues related to Contracts, please navigate to Relay’s Support Center, click “create a new case” and select the Topic: Short-Term Contracts.

Thanks for continuing to haul with Relay!`,
        // New buttons: texts verbatim from J.T.'s sent Tech replies (identical to Support's Suspended / Submit BOL / Call Back / Badge responses). They open "Dear Valued Carrier," like his sent replies, while the rest of Tech opens "Dear Carrier,".
        suspended: `Dear Carrier,

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
        submitBol: `Dear Carrier,

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
        CallBack: `Dear Carrier,

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
        badge: `Dear Carrier,

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

        uiia: `Dear Carrier,

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


        auctionSupport: `Dear Carrier,

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
    };

    // Create and insert response
    var replyClicked = false;
    const insertResponse = (response) => {
        const textArea = document.querySelector('textarea');
        if (textArea) {
            textArea.value = response;
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            textArea.style.height = "1px";
            textArea.style.height = textArea.scrollHeight + "px";
        }
    };
    //Edit signature
    const loginID = ["sheshuv", "proskeal", "khatania", "chmnnin", "kiranmst", "kanellye", "chroscoe", "teewoma", "joswyatt", "legoodm", "isaispen", "wilsojel", "vkandu", "vaishgch", "tnadas", "jxpowers", "sulkeirh", "klakendr", "booxford", "greggorm" ]
    const initials = ["-SV", "-AP", "-AK", "-CM", "-KM", "-NK", "-RR", "-TEW", "-TW", "-LG", "-Zay", "-JW", "-VK", "VS", "TD", "JP", "KS", "LR", "-BO", "-MM" ]

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
                    var navListuserName = document.getElementsByClassName("text_hF6BH")[0].children[0].textContent.split("User: ")[1].split("Tenant: ")[0].trim()
                    var userName = loginID.indexOf(navListuserName);
                    var findInitial = initials[userName]
                    signatureBox.value = findInitial + "\r\nRelay Product Excellence\r\n\r\nUS Carriers:\r\n" + winterBlockUS + "\r\n\r\nCanadian Carriers:\r\n" + winterBlockCA;
                    signatureBox.dispatchEvent(new Event('input', {bubbles:true}));
                    signatureBox.style.height = "1px";
                    signatureBox.style.height = signatureBox.scrollHeight + "px";
                }
            }, 1000);
        }
    }
    // Category / Reason Code mappings - keyed by button text, like the main script.
    // Values are the Paragon category/reason IDs you supplied on 10/29/2026.
    const dropdownMappings = {
        "Payment Issue":             { category: "Relay-dispute-cases-bycarriers", categoryValue: "36277959401", code: "Relay-carriers-disputes-of-payment", codeValue: "46808022751" },
        "General Support":           { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Other", codeValue: "51180030591" },
        "Performance":               { category: "Relay-dispute-cases-bycarriers", categoryValue: "36277959401", code: "Relay-carriers-performance-disputes", codeValue: "46808022761" },
        "Insurance":                 { category: "Generic-queries-for-relay-carrier-support", categoryValue: "46660406411", code: "Insurance", codeValue: "51180240051" },
        "Contracts":                 { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Short-term-contract", codeValue: "51180030561" },
        "Assets":                    { category: "Generic-queries-for-relay-carrier-support", categoryValue: "46660406411", code: "Relay-other-generic-issues", codeValue: "51180240061" },
        "Other Issue":               { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Other", codeValue: "51180030591" },
        "UIIA":                      { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Other", codeValue: "51180030591" },
        "Auction Support":           { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Other", codeValue: "51180030591" },
        "Transfer to Trip Completion Dispute":        { category: "R4C-trips-issues", categoryValue: "45545173241", code: "Other", codeValue: "50947790651" },
        "Transfer to Driver Verification":  { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Driver-verification", codeValue: "51180030571" },
        "Transfer to Contracts":            { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Short-term-contract", codeValue: "51180030561" },
        "Transfer to Insurance":            { category: "Generic-queries-for-relay-carrier-support", categoryValue: "46660406411", code: "Insurance", codeValue: "51180240051" },
        "Transfer to Assets":               { category: "Generic-queries-for-relay-carrier-support", categoryValue: "46660406411", code: "Relay-other-generic-issues", codeValue: "51180240061" },
        "Transfer to Site Escalations":     { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Other", codeValue: "51180030591" },
        "Transfer to Driver Assignment":    { category: "Tech-Issues-R4D-query", categoryValue: "36277959391", code: "Relay-carrier-can't-assign-driver", codeValue: "46808022741" },
        "Transfer to Auctions":             { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Other", codeValue: "51180030591" },
        "Transfer to Safety Rewards":       { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Other", codeValue: "51180030591" },
        "Transfer to Suspension Appeals":   { category: "Loadboard-suspension-queries", categoryValue: "45546793241", code: "Loadboard-Suspension-Low-Performance-carriers", codeValue: "46809635491" },
        "Transfer to Account Verification": { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Other", codeValue: "51180030591" },
        "RLB NoLoad":                { category: "Loadboard-suspension-queries", categoryValue: "45546793241", code: "Loadboard-Suspension-Low-Performance-carriers", codeValue: "46809635491" },
        "Suspended":                 { category: "Loadboard-suspension-queries", categoryValue: "45546793241", code: "Loadboard-Suspension-Low-Performance-carriers", codeValue: "46809635491" },
        "New Carrier Loads Visibility": { category: "Loadboard-suspension-queries", categoryValue: "45546793241", code: "Loadboard-Suspension-Low-Performance-carriers", codeValue: "46809635491" },
        "AssignDrivers":             { category: "Tech-Issues-R4D-query", categoryValue: "36277959391", code: "Relay-carrier-can't-assign-driver", codeValue: "46808022741" },
        "Driver Assignment Issue":   { category: "Tech-Issues-R4D-query", categoryValue: "36277959391", code: "Relay-carrier-can't-assign-driver", codeValue: "46808022741" },
        "Driver Verification/Selfie": { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Driver-verification", codeValue: "51180030571" },
        "Badge":                     { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "Driver-verification", codeValue: "51180030571" },
        "Nav/App Issue":             { category: "Tech-Issues-R4D-query", categoryValue: "36277959391", code: "R4D-error-gps-navigation-not-working", codeValue: "46808022731" },
        "WebPageLoading":            { category: "R4C-Tech-Support-Issues", categoryValue: "45550033341", code: "Unexpected-error-R4C", codeValue: "51214336111" },
        "App/GPS Issue":             { category: "Tech-Issues-R4D-query", categoryValue: "36277959391", code: "R4D-error-gps-navigation-not-working", codeValue: "46808022731" },
        "Relay Assistant":           { category: "R4C-trips-issues", categoryValue: "45545173241", code: "Other", codeValue: "50947790651" },
        "Early CheckIn":             { category: "R4C-trips-issues", categoryValue: "45545173241", code: "Relay-carriers-checkin-issues-trips", codeValue: "50947790641" },
        "InTransit":                 { category: "R4C-trips-issues", categoryValue: "45545173241", code: "Other", codeValue: "50947790651" },
        "App + In-Transit":          { category: "R4C-trips-issues", categoryValue: "45545173241", code: "Other", codeValue: "50947790651" },
        "App + Performance":         { category: "Relay-dispute-cases-bycarriers", categoryValue: "36277959401", code: "Relay-carriers-performance-disputes", codeValue: "46808022761" },
        "Submit BOL":                { category: "R4C-trips-issues", categoryValue: "45545173241", code: "Other", codeValue: "50947790651" },
        "Call Back":                 { category: "R4C-trips-issues", categoryValue: "45545173241", code: "Other", codeValue: "50947790651" },
        "Origin Arrival":            { category: "R4C-trips-issues", categoryValue: "45545173241", code: "Relay-carriers-checkin-issues-trips", codeValue: "50947790641" },
        "WIP/SIM":                   { category: "Relay-account-category-main-category", categoryValue: "46658786461", code: "App Issue", codeValue: "51180030581" },
        "More Info Needed":          { category: "R4C-trips-issues", categoryValue: "45545173241", code: "Other", codeValue: "50947790651" }
    };

    function setDropdownValue(dropdownId, value, displayName) {
        const dropdown = document.querySelector('#' + dropdownId);
        if (!dropdown) {
            console.warn('Dropdown #' + dropdownId + ' not found');
            return false;
        }
        var trigger = dropdown.querySelector('.dropdown-trigger') ||
                      dropdown.querySelector('.header-row') ||
                      dropdown.shadowRoot?.querySelector('.dropdown-trigger');
        if (trigger) {
            trigger.click();
        }
        setTimeout(function() {
            var options = dropdown.querySelectorAll('kat-option, .option-row, li');
            var found = false;
            options.forEach(function(opt) {
                if (opt.getAttribute('value') === value || opt.textContent.trim() === displayName) {
                    opt.click();
                    found = true;
                    console.log('Clicked option: ' + displayName + ' (' + value + ')');
                }
            });
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
        setDropdownValue('resolutionCategoryFormDropdown', mapping.categoryValue, mapping.category);
        setTimeout(function() {
            setDropdownValue('resolutionReasonFormDropdown', mapping.codeValue, mapping.code);
        }, 800);
    }

    // Create button element with styles - now colored by its group
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

    const createButton = ({ id, text }, group) => {
        const button = document.createElement('button');
        button.className = 'tm-response-btn';
        const style = config.buttonStyle;

        Object.assign(button.style, {
            padding: style.padding,
            backgroundColor: group.backgroundColor,
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
        button.addEventListener('mouseover', () => { button.style.backgroundColor = group.hoverColor; });
        button.addEventListener('mouseout', () => { button.style.backgroundColor = group.backgroundColor; });
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

            // Click the "Review" button after response + dropdowns are done,
            // exactly like the main script: 2s delay, then up to 5 retries.
            setTimeout(function() {
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
            setTimeout(function() {
                console.log("RESOLVE");
                var resolveButton = document.querySelectorAll('[type="radio"]')[9];
                resolveButton.click();
                resolveButton.dispatchEvent(new Event("change", {bubbles:true}));
            }, 2100);

            //Open reply
            setTimeout(function(){
                console.log("REPLY");
                try {
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
            }, 500);

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
    }

    // ---- 3-way switch: switch to this script's responses from any other bar ----
    let crossQueueMode = false;
    let hiddenBarId = '';
    let hiddenBarLabel = '';
    const OTHER_BARS = [
        { id: 'tm-main-bar', label: 'Support' },
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
        const own = document.getElementById('tm-tech-bar');
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
            if (tray.querySelector('#tm-switch-to-tech')) { return; }
            const btn = document.createElement('button');
            btn.id = 'tm-switch-to-tech';
            btn.textContent = 'Switch to Tech responses';
            Object.assign(btn.style, { backgroundColor: '#ff6600', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' });
            btn.addEventListener('click', () => { crossQueueMode = true; init(true); });
            tray.appendChild(btn);
        });
    }
        setInterval(attachSwitchToNativeBars, 1000);

    // Initialize - grouped button rows with a color-coded label per group
    const init = (isOverride) => {
        console.log('Script initialized');
        crossQueueMode = !!isOverride;
        if (!isOverride) { const ownChip = document.getElementById('tm-tech-override-chip'); if (ownChip) { ownChip.remove(); } }

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
        const oldBar = document.getElementById('tm-tech-bar');
        if (oldBar) {
            oldBar.remove();
        }

        // Create response buttons container
        const container = document.createElement('div');
        container.id = 'tm-tech-bar';
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

        config.buttonGroups.forEach(group => {
            const groupRow = document.createElement('div');
            Object.assign(groupRow.style, {
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: '3px',
                flexWrap: 'wrap'
            });

            const label = document.createElement('div');
            Object.assign(label.style, {
                width: '145px',
                minWidth: '145px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: group.backgroundColor,
                textAlign: 'right',
                paddingRight: '8px',
                flexShrink: '0'
            });
            label.textContent = group.name;
            label.className = 'tm-group-label';
            groupRow.appendChild(label);

            const buttonsRow = document.createElement('div');
            Object.assign(buttonsRow.style, {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '3px',
                flex: '1'
            });
            group.buttons.forEach(buttonConfig => {
                buttonsRow.appendChild(createButton(buttonConfig, group));
            });
            groupRow.appendChild(buttonsRow);

            container.appendChild(groupRow);
        });

        // Insert at the top of the page so the sticky bar sits in the flow
        // and pushes Paragon's content down, instead of floating over it.
        document.body.insertBefore(container, document.body.firstChild);

        // The sidebar is pinned by Paragon at top: 71px, so even a shifted
        // top leaves it staying still while the rest of the page moves.
        // Unpin it (position: absolute, so it scrolls with the page) and
        // move it down by exactly the bar's height, so the whole page
        // moves as one. Store the original top once so re-runs never
        // stack the shift, and clear the v3.5 grid margin so the grid
        // does not shift twice. A MutationObserver keeps this applied
        // for the life of the page, since Paragon can reset the sidebar
        // long after the old 15-second poll had stopped.
        const shiftSidebar = () => {
            const bar = document.getElementById('tm-tech-bar');
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
        if (!window.__tmTechSidebarObserver) {
            window.__tmTechSidebarObserver = new MutationObserver(function() {
                shiftSidebar();
            });
            window.__tmTechSidebarObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['style'],
                childList: true,
                subtree: true
            });
        }
        if (!window.__tmTechSidebarResize) {
            window.__tmTechSidebarResize = true;
            window.addEventListener('resize', function() { shiftSidebar(); applyResponsiveBar(); });
        }

        //Only lock case for your queue
        setTimeout(function(){
            if (crossQueueMode) { return; }
            try
            {
                var myQueue = "relay-feedback@amazon.com";
                var myQueueTwo = "rcm-support@amazon.com";
                var p = document.getElementsByClassName("label");
                var currentQueue = p[2].nextElementSibling;
                if(currentQueue.textContent === myQueue || currentQueue.textContent === myQueueTwo)
                {
                    console.log(currentQueue);
                    var lockButton = document.querySelector('[label="Lock Case"]');
                    if(lockButton)
                    {
                        setTimeout(function(){
                        lockButton.click();
                        AfterLock();
                        },1000);
                    }
                    var releaseCase = document.querySelector('[label="Release Case"]');
                    if(releaseCase)
                    {
                        console.log("RELEASE CASE:");
                        console.log(releaseCase);
                        AfterLock();
                    }
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
    function setupUrlChangeDetection() {
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

        window.addEventListener('popstate', handleUrlChange, false);
        window.addEventListener('hashchange', handleUrlChange, false);

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
    // Ported from the RAS script: when a case loads with exactly one
    // correspondence, expand that first message automatically.
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
        "relay-feedback@amazon.com" // tech queue
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
                console.log('[Tech script] Queue gate: queue is not relay-feedback@amazon.com, not activating (switch is in the native bar).');
                return;
            }
            attempts++;
            if (attempts < 30) {
                setTimeout(check, 500);
            } else {
                console.log('[Tech script] Queue gate: queue is not relay-feedback@amazon.com, not activating (switch is in the native bar).');
            }
        };
        check();
    }

    function initialize() {
        setupUrlChangeDetection();
        waitForQueueGate(function() {
            init();
            autoExpandInitialCorrespondence();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
