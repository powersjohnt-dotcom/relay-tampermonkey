// ==UserScript==
// @name         Amazon Relay Responses RFA Auctions Support — Team
// @namespace    http://tampermonkey.net/
// @version      1.8
// @updateURL    https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Auctions-Team.user.js
// @downloadURL  https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Auctions-Team.user.js
// @description  Automatically inserts responses for Relay Auctions Support issues
// @author       Sheshu Venugopal
// @match        https://paragon-na.amazon.com/hz/view-case?caseId=*
// @grant        none
// ==/UserScript==

    /*UPDATES:
    11/25/2026: Switch tray self-heals + gap above switches (v1.7, per J.T.): the v1.6 in-flow fix did not land because the tray in each bar is created by the OTHER two scripts, and its style was only set at creation - so an older script could leave an absolute tray behind. The in-flow style is now re-asserted on every 1-second tick, clearing any absolute positioning, so mixed-version installs heal within a second. Plus a 10px gap above the tray and the Back button, so the switches sit visibly clear of the bottom row. All three updates must be installed and the page reloaded. Support-Team v2.33 and Tech-Team v3.40 carry the same fix. Personal is untouched. v1.6 is untouched as the fallback.
    11/25/2026: Switch tray + Back button no longer overlay (v1.6, per J.T.): the bottom-right switch tray and the Back button were absolutely positioned over the bar, so they could cover the last row's buttons. Both are now in-flow flex rows at the bottom-right - the tray right-aligns its buttons, the Back button uses order 99 so it still renders last. Same spot on screen, nothing can sit on top of a button now. Support-Team v2.32 and Tech-Team v3.39 carry the same fix. Personal is untouched. v1.5 is untouched as the fallback.
    11/24/2026: Updated RFA responses (v1.5, per J.T.): 8 new buttons from the team's updated responses (App Issue, Wrong Driver Type, In-Transit, Contract ID, Overlapping, (Missing/Wrong) Trailer, Cancelled Loads, Load Board WIP) and 8 updated texts - Awarded Contract and Renewal rewritten (Renewal is now the short review-request form, not the renewal-offer explainer), Payment/Performance/Update Assets gain the queue preamble, More Information asks for Contract IDs and links to .ca, the follow-ups gain the contract bullet. Button labels follow the team's file (More Info is now More Information, Cancellations is now Cancellations/Rejections). One team typo fixed ("extension request of contact" to "of contract"). Also the Nov 21 Error 1 signature fix (try/catch around the signature click, fill scheduled regardless) - Auctions never got it. Personal v1.7 carries the same buttons/responses plus suggestion keywords for the new buttons. v1.4 is untouched as the fallback.
    11/17/2026: Winter weather signature block (1.3, per J.T.): US + Canadian notices with Relay Learning links, added to the signature.
    11/10/2026: TEAM VERSION (per J.T.): this is the plain team build - the v1.2 code exactly as it was, with NO suggestion feature and NO case logging or data collection of any kind. @name is now "... — Team" and the file is named Auctions-Team-v1.2.user.js so it cannot be confused with J.T.'s personal build (Auctions-JT-Personal-v1.5.user.js, which has the suggestion + logging). The code below is byte-identical to v1.2 apart from this label: anyone already running v1.2 does NOT need to reinstall. Do NOT install this alongside the Personal Auctions script - they would build two bars on the same queue.
    11/04/2026: Full 3-way switch (v1.2, per J.T.): Auctions now joins the Support/Tech switch system — same sticky full-width bar, same bottom-right switch tray and back button, same override rules (text-only, skip lock-case). Bar chrome unified; buttons, responses and signature unchanged. Dropdown mappings unchanged — that work is still to come.
    11/04/2026: Queue gate (v1.1, per J.T.): same gate as the Support/Tech
    scripts — the bar now only builds when the case Queue is
    relay-auctions-suppport@amazon.com (spelling as shown on the case,
    with the triple-p "suppport"). Polls up to 15 seconds; otherwise it
    stays silent, so it can stay enabled alongside the other scripts
    without showing on their queues. Also stops the old lock-check from
    re-calling init() on a non-matching queue, which could duplicate
    the bar.
    */

(function() {
    'use strict';

    // Configuration object
    const config = {
        buttonConfigs: [
            { id: 'appIssue', text: 'App Issue' },
            { id: 'canada', text: 'Canada' },
            { id: 'deniedBid', text: 'Denied Bid' },
            { id: 'renewal', text: 'Renewal/Extend' },
            { id: 'updateAssets', text: 'Update Assets' },
            { id: 'wrongDriverType', text: 'Wrong Driver Type' },
            { id: 'cancellations', text: 'Cancellations/Rejections' },
            { id: 'untendered', text: 'Untendered Contracts' },
            { id: 'performance', text: 'Performance' },
            { id: 'payment', text: 'Payment' },
            { id: 'suspended', text: 'Suspended' },
            { id: 'cancellationFollowup', text: 'Cancel Follow-up' },
            { id: 'tenderedFollowup', text: 'Tendered Follow-up' },
            { id: 'awardedContract', text: 'Awarded Contract' },
            { id: 'moreinfo', text: 'More Information' },
            { id: 'inTransit', text: 'In-Transit' },
            { id: 'contractId', text: 'Contract ID' },
            { id: 'overlapping', text: 'Overlapping' },
            { id: 'missingWrongTrailer', text: '(Missing/Wrong) Trailer' },
            { id: 'cancelledLoads', text: 'Cancelled Loads' },
            { id: 'loadBoardWip', text: 'Load Board WIP' }
        ],
        buttonStyle: {
            backgroundColor: '#1a8a8a',
            hoverColor: '#136b6b',
            textColor: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            margin: '0',
            fontSize: '12px'
        },
        containerStyle: {
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
        appIssue: `Dear Carrier,

Thank you for reaching out. This queue is designated for Relay Auctions support, which handles requests such as contract cancellations, missing VRIDs from awarded contracts, right-sizing contracts, incorrect configuration reports, and contract extensions.

Please follow the below steps if you are facing issues with the app:

1. Swipe/close the app completely and then restart it
2. Restart the device
3. Ensure you have the app updated.
4. Ensure that you have a device with the proper operative system:
a. If Android, must have at least Android 7 or higher version. The latest is Android OS 11.
b. If iPhone, must have at least iOS 9 or higher version. The latest is iOS 14.
If possible, please ensure you share the problem through “Give Feedback” option within the app
selecting “Relay App” and sharing the issue.

If you continue to have issues with the app or website, please navigate to Relay Support Center and create a case under the Topic: Relay App & Web Portal Tech Support.`,

        canada: `Dear Carrier,

Thank you for reaching out.

This queue supports US-based operations. For all Canada-related inquiries, please reach out to rpm-canada@amazon.com for further assistance.

Thank you for your continued partnership with Relay.

For additional support, please visit the Relay Support Center at: https://relay.amazon.ca/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.ca/cases/sc/learning`,

        deniedBid: `Dear Carrier,
Those contracts are currently undergoing adjustments and are not designated for public auction at this time. While they may still appear in the system, they are not active listings. Please feel free to continue placing bids on other available opportunities.`,

        renewal: `Dear Carrier,

Thank you for reaching out regarding your extension request of contract: (insert contract).

We have received your request and are currently reviewing it. Our team is working to process this as quickly as possible, and we will follow up with a resolution shortly.

If you have any additional details or questions in the meantime, please reply to this case or visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay.`,

        updateAssets: `Dear Carrier,

Thank you for reaching out. This queue is designated for Relay Auctions support, which handles requests such as contract cancellations, missing VRIDs from awarded contracts, right-sizing contracts, incorrect configuration reports, and contract extensions.


Add any equipment you plan to use for Amazon loads that’s not already listed in your Assets page.
You’ll get an email if you need to provide additional documentation about any of your listed assets.
This course will cover asset import and verification, as well as gate rejections from unverified equipment:
Managing Assets with Amazon Relay:
https://relay.amazon.com/cases/sc/help/search/details?detailProps=JTdCJTIydHlwZSUyMiUzQSUyMkNPVVJTRSUyMiUyQyUyMmlkJTIyJTNBJTIyMzI1YmIyZTItNTJhYS00MGU1LWIyMzMtOGNhNTA3NWI4M2Q4JTIyJTdE
For issues  related to Assets, please navigate to Relay Support Center and create a case  under the Topic: Asset Edit.`,

        wrongDriverType: `Dear Carrier,

Thank you for reaching out regarding your wrong driver type request for contract(s) (insert contract).

We have received your request and are currently reviewing it. Our team is working to process this as quickly as possible, and we will follow up with a resolution shortly.

If you have any additional details or questions in the meantime, please reply to this case or visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay.`,

        cancellations: `Dear Carrier,

Thank you for reaching out regarding your cancellation request for contract(s) (insert contract).

We have received your request and are currently reviewing it. Our team is working to process this as quickly as possible, and we will follow up with a resolution shortly.

If you have any additional details or questions in the meantime, please reply to this case or visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay.`,

        untendered: `Dear Carrier,

Thank you for reaching out regarding your untendered contract: (insert contract).

We have received your request and are currently reviewing it. Our team is working to process this as quickly as possible, and we will follow up with a resolution shortly.

If you have any additional details or questions in the meantime, please reply to this case or visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay.`,

        performance: `Dear Carrier,

Thank you for reaching out. This queue is designated for Relay Auctions support, which handles requests such as contract cancellations, missing VRIDs from awarded contracts, right-sizing contracts, incorrect configuration reports, and contract extensions.

If you believe your performance score was impacted unfairly, you may submit performance disputes for individual VRIDs by navigating to the Performance page and clicking the Dispute button next to the applicable Tour ID/ VRID. You must submit within 14 days of load completion and provide objective proof as to why the issue was not carrier-controllable.
The performance dispute team will review and decide whether or not to approve that the issue was not carrier controllable. Carriers may appeal a performance dispute one time if they don’t agree with the initial result by replying on the same case.

For additional training on Performance Disputes :
https://relay.amazon.com/cases/sc/help/search/details?detailProps=JTdCJTIydHlwZSUyMiUzQSUyMkNPVVJTRSUyMiUyQyUyMmlkJTIyJTNBJTIyZjI0YzMwNTYtOWJkMi00ZmUxLThkOGMtMWM2MmFiYjUxNmE2JTIyJTdE
If you have any additional details or questions in the meantime, please reply to this case or visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay.`,

        payment: `Dear Carrier,

Thank you for reaching out. This queue is designated for Relay Auctions support, which handles requests such as contract cancellations, missing VRIDs from awarded contracts, right-sizing contracts, incorrect configuration reports, and contract extensions.

Please file a payment dispute through the Relay portal and follow below steps:
Go to Relay > Payments > File a dispute > Continue to file a dispute (from dialog box) > Select number of items or loads from invoice > Proceed to dispute.
If you want to add the “Missing item”
Go to Relay > Payments > Missing Item > Load > Enter Load Id > Add to dispute.
Once you file a dispute, please follow-up with prelay@amazon.com.
If you have any additional details or questions in the meantime, please reply to this case or visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay.`,

        suspended: `Dear Carrier,

Relay Auction Support is not responsible for assisting with suspended account issues and will not have answers to your questions regarding your suspended account.

You will need to reach out directly to relay-am@amazon.com for further assistance as our department cannot restore any suspended account.
If you have any additional details or questions in the meantime, please reply to this case or visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay.`,

        cancellationFollowup: `Dear Carrier,

Thank you for your patience and we apologize for the delayed response.

Your contracts have been CANCELLED:

- (insert contract)

These changes should reflect in your account shortly. If you do not see the update within 24 hours, please reply to this case and we will investigate further.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay`,

        tenderedFollowup: `Dear Carrier,

Thank you for your patience and we apologize for the delayed response.

Your contracts have been TENDERED:

- (insert contract)

These changes should reflect in your account shortly. If you do not see the update within 24 hours, please reply to this case and we will investigate further.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay`,

        awardedContract: `Dear Carrier,

We'd like to help clarify the contract confirmation process for awarded auctions:

How awarded contracts are confirmed:

Email notification — Once your company is awarded a contract, your Primary Admin receives an email with the contract details.
Contracts page — The awarded contract will appear on your "Contracts" page under "Upcoming Contracts" in your Relay account.
Acceptance window — Once you receive the notification email, your company has 3 hours to accept or reject the contract. If no action is taken within 3 hours, the contract is automatically rejected.
Contract activation — Once accepted, the contract status changes to ACTIVE and loads will begin tendering per the contract schedule.

Regarding your specific contracts:

If you were awarded these contracts but do not see them on your Contracts page, it's possible that:

- The 3-hour acceptance window may have passed without action, resulting in automatic rejection
- There may be a system delay in contract assignment

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay.`,

        moreinfo: `Dear Carrier,

Thanks for reaching out.

Could you please share any screenshot(s), Contract IDs, and more details of the issue faced so that we can investigate further.

Thank you for your continued partnership with Relay.

For additional support, please visit the Relay Support Center at: https://relay.amazon.ca/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.ca/cases/sc/learning`,

        inTransit: `Dear Valued Carrier,

Thank you for reaching out. This queue is designated for Relay Auctions support, which handles requests such as contract cancellations, missing VRIDs from awarded contracts, right-sizing contracts, incorrect configuration reports, and contract extensions.

For issues related to In-Transit Trips please take the following steps:

1. Go to your "Trips" and then "In Transit.".
2. Identify the Trip/VRID needing support.
3. Use the dropdown options to complete the delay report.
4. Describe the issue and follow the prompts.

For Trip Completion issues (request a timestamp)

1. Go to your "Trips" and then "In Transit.".
2. Identify the VRID and select "Request trip support" under it..
3. Select "Create a new case" in the right side panel..
4. Choose "Trip Completion Status Dispute" and provide details about the issue..

You can report a delay in Amazon Relay. Go to Trips > In Transit, and then click on the trip that is delayed. Click Report delay, and fill in the form with the new ETA and the reason for the delay.

Relay Assistant for In-Transit Trips: https://relay.amazon.com/learning?filterCriteria=Relay%20Assistant%3A%20Trip%20Support&openCourse=4eb24a0b-6896-4d50-8dee-5c4451b93841&ref=owp_nav_learning_center
For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Requesting a Call Back:

If you need live assistance with an active load, you can request a callback directly through the Relay app by following these steps:

Open the Relay Mobile App
Navigate to the load in question
Select "Request a call back" to connect with our live operations team

Thanks for continuing to haul with Relay!`,

        contractId: `Dear Carrier,

We'd like to look into this for you. To help us investigate and locate the contracts in question, could you please provide the following:

Please provide CONTRACT ID(s)

This information will allow us to verify the award status and determine why the contracts may not be appearing in your Relay account.

Thanks for continuing to haul with Relay!

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning`,

        overlapping: `Dear Valued Carrier,

We understand your concern about multiple loads being assigned on the same day. To clarify how contract load frequency works:

Contracts state "up to X loads per week." This means loads may be distributed in any combination throughout the week — for example, all loads could be assigned on the same day, or spread across multiple days.
As the contract holder, your company is expected to be able to cover the load volume you signed up for, regardless of how the loads are distributed within the week.
If you are unable to cover the assigned loads, we recommend the following:

Reject the VRID(s) you cannot fulfill as soon as possible so they can be re-tendered.
Request a contract cancellation if the overall volume or scheduling no longer works for your operation. You can submit that request through this queue.
We appreciate your proactive communication. Please let us know if you would like to proceed with a contract cancellation or if you have any additional questions.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning

Thanks for continuing to haul with Relay!`,

        missingWrongTrailer: `Dear Carrier,

We understand the frustration caused by consecutive cancellations, especially when your trailers are being provided on time. We are looking into the cancellations and will work to determine the root cause.

Regarding Your (Missing/Wrong) Trailer Escalation

Please email the following team directly so they can investigate and locate your equipment:

Email: 3p-priority-empty-trailers@amazon.com

This team handles third-party trailer misuse and missing equipment cases and will be able to assist with tracking down your trailer.

Additionally, if you experience any future instances where the site attaches an Amazon (AZNG) trailer instead of using your trailer pool, you can contact the same team using this adjusted subject format:

Subject Line Format: 3P1W[(SCAC)][(SITE)](Missing/Wrong) Trailer Attached
Thanks for continuing to haul with Relay.`,

        cancelledLoads: `Dear Carrier,

We understand this can be frustrating, especially with an active contract in place. Load cancellations on dedicated contracts are driven by network need — meaning that volume on a given lane may fluctuate from week to week based on demand at the origin and destination sites. While your contract remains active through January, the number of loads tendered each week may vary depending on current network requirements.

Here is what you can expect going forward:

- Loads will continue to be tendered as network demand requires. Some weeks may have higher volume than others.
- Your contract status is not affected by these cancellations — your lane and equipment assignment remain in place.
- If volume consistently does not meet expectations, we recommend reaching out so we can review the lane activity with the planning team.
We appreciate your flexibility and commitment to hauling on this lane. If you have additional questions or concerns, please do not hesitate to reply to this case.

Thanks for continuing to haul with Relay.`,

        loadBoardWip: `Hello,

Thank you for your patience while we worked on the recent technical issue that affected the Relay Load Board.

The issue is now resolved, and the Load Board should be working normally again. Any auctions affected by the disruption have been reposted, so your company can view and bid on available loads as usual.

If your team is still having trouble with the Load Board, we recommend these steps:

- Refresh your browser or sign out of Relay and sign back in.
- Clear your browser cache, or try a different browser.
- If the issue continues, open a case through the Relay Support Center: relay.amazon.com/cases/sc/help
We're sorry for any inconvenience this caused, and we appreciate your understanding.

Thanks for continuing to haul with Relay,

The Amazon Relay team`
    };


    // Create and insert response
    const insertResponse = (response) => {
        const textArea = document.querySelector('textarea');
        if (textArea) {
            textArea.value = response;
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            textArea.style.height = "1px";
            setTimeout(function(){
                textArea.style.height = textArea.scrollHeight + "px";
            }, 500);
        }
    };

    // Edit signature
    const loginID = ["sheshuv", "proskeal", "jxpowers", "chmnnin", "kiranmst", "kanellye", "chroscoe", "teewoma", "joswyatt", "legoodm", "isaispen", "wilsojel", "vkandu", "vaishgch", "tnadas", "booxford"]
    const initials = ["-SV", "-AP", "-JP", "-CM", "-KM", "-NK", "-RR", "-TEW", "-TW", "-LG", "-Zay", "-JW", "-VK", "-VS", "-TD", "-BO"]

    // Winter weather signature (11/17/2026, per J.T.): both notices in every signature - the case data has no reliable US/Canada signal, so each carrier reads their own section. Plain-text signature box, so links sit in parentheses next to the words (email clients make them clickable).
    const winterBlockUS = 'Attention Carriers — With winter weather approaching, preparation for challenging driving conditions is essential. We have several resources on Relay Learning Center, including Winter Weather Driving (https://relay.amazon.com/learning/all-resources?filterCriteria=winter) training, mechanical maintenance trainings found under the "Maintenance Category" (https://relay.amazon.com/learning/home) and The 90-Second Garage series (https://relay.amazon.com/learning/all-resources?filterCriteria=90-second), which has been expanded to include quick tips on vehicle inspections and basic mechanical fixes. Be sure to take advantage of available Deals and Discounts (https://relay.amazon.com/rewards/value-added-service) to maintain a healthy fleet and perform thorough pre-trip and post-trip vehicle inspections. Stay safe this season!';
    const winterBlockCA = 'Attention Carriers — With winter weather approaching, preparation for challenging driving conditions is essential. We have several resources on Relay Learning Centre, including Winter Weather Driving (https://relay.amazon.ca/learning/all-resources?filterCriteria=winter) training, mechanical maintenance trainings found under the "Maintenance Category" (https://relay.amazon.ca/learning/all-resources?filterCriteria=maintenance) and the 90-Second Garage (https://relay.amazon.ca/learning/all-resources?filterCriteria=garage) series, which has been expanded to include quick tips on vehicle inspections and basic mechanical fixes. Be sure to perform thorough pre-trip and post-trip vehicle inspections. Stay safe this season!';
    function EditSignature() {
        console.log("Edit Signature 2");
        var signatureButton = document.querySelectorAll('[class="email-button py-0 selected"]')[0];
        if (!signatureButton.textContent.includes("Discard")) {
            try {
                signatureButton.click();
            } catch (e) {
                console.log('[Auctions script] EditSignature: signature toggle click failed, filling signature anyway. Error: ' + (e && e.message ? e.message : e));
            }
            setTimeout(function() {
                var signatureBox = document.getElementsByClassName("shadow-none")[1];
                if (signatureBox) {
                    var navListuserName = document.getElementsByClassName("text_hF6BH")[0].children[0].textContent.split("User: ")[1].split("Tenant: ")[0].trim();
                    var userName = loginID.indexOf(navListuserName);
                    var findInitial = initials[userName];
                    signatureBox.value = findInitial + "\r\nRelay Auctions Support (RFA)" + "\r\n\r\nUS Carriers:\r\n" + winterBlockUS + "\r\n\r\nCanadian Carriers:\r\n" + winterBlockCA;
                    signatureBox.dispatchEvent(new Event('input', { bubbles: true }));
                    signatureBox.style.height = "1px";
                    signatureBox.style.height = signatureBox.scrollHeight + "px";
                }
            }, 1000);
        }
    }

    // Create button element with styles
    const createButton = ({ id, text }) => {
        const button = document.createElement('button');
        const style = config.buttonStyle;

        Object.assign(button.style, {
            padding: style.padding,
            backgroundColor: style.backgroundColor,
            color: style.textColor,
            border: 'none',
            borderRadius: style.borderRadius,
            cursor: 'pointer',
            margin: style.margin,
            fontSize: style.fontSize
        });

        button.textContent = text;
        button.addEventListener('mouseover', () => {
            if (!button.classList.contains('rfa-active')) {
                button.style.backgroundColor = style.hoverColor;
            }
        });
        button.addEventListener('mouseout', () => {
            if (!button.classList.contains('rfa-active')) {
                button.style.backgroundColor = style.backgroundColor;
            }
        });
        button.addEventListener('click', () => {
            // Remove active state from all buttons
            document.querySelectorAll('.rfa-btn').forEach(btn => {
                btn.classList.remove('rfa-active');
                btn.style.outline = 'none';
                btn.style.backgroundColor = style.backgroundColor;
                btn.style.boxShadow = 'none';
            });
            // Set active state on clicked button
            button.classList.add('rfa-active');
            button.style.outline = '3px solid #ffffff';
            button.style.boxShadow = '0 0 0 5px #0d5e5e';
            button.style.backgroundColor = style.hoverColor;
            insertResponse(responses[id]);
        });

        button.classList.add('rfa-btn');
        return button;
    };

    function AfterLock() {
        console.log("AfterLock");
        var lockButton = document.querySelector('[label="Lock Case"]');
        var releaseButton = document.querySelector('[label="Release Case"]');

        if (!releaseButton) {
            lockButton.click();
            console.log("Failed");
            setTimeout(function(){
                AfterLock();
            }, 1000);
        } else {
            console.log("Passed");

            // Change signature
            setTimeout(function(){
                console.log("Edit Signature 1");
                EditSignature();
            }, 2000);

            // Set to resolve
            setTimeout(function() {
                console.log("RESOLVE");
                var resolveButton = document.querySelectorAll('[type="radio"]')[9];
                resolveButton.click();
                resolveButton.dispatchEvent(new Event("change", { bubbles: true }));
            }, 2100);

            // Open reply
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

            // Remove CC'd emails
            setTimeout(function(){
                console.log("CCEMAIL");
                var removeCC = document.querySelectorAll('[aria-label="Remove tag"]');
                if (removeCC.length > 1) {
                    for (var x = removeCC.length - 1; x > 0; x--) {
                        removeCC[x].click();
                    }
                }
            }, 2200);
        }
    }

    // ---- 3-way switch: switch to this script's responses from any other bar ----
    let crossQueueMode = false;
    let hiddenBarId = '';
    let hiddenBarLabel = '';
    const OTHER_BARS = [
        { id: 'tm-main-bar', label: 'Support' },
        { id: 'tm-tech-bar', label: 'Tech' }
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
        const own = document.getElementById('tm-auctions-bar');
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
            if (tray.querySelector('#tm-switch-to-auctions')) { return; }
            const btn = document.createElement('button');
            btn.id = 'tm-switch-to-auctions';
            btn.textContent = 'Switch to Auctions responses';
            Object.assign(btn.style, { backgroundColor: '#ff6600', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' });
            btn.addEventListener('click', () => { crossQueueMode = true; init(true); });
            tray.appendChild(btn);
        });
    }
    setInterval(attachSwitchToNativeBars, 1000);

    // Initialize
    const init = (isOverride) => {
        crossQueueMode = !!isOverride;
        if (document.getElementById('tm-auctions-bar')) { return; }
        console.log('RFA Auctions Script initialized');

        // Create response buttons container
        const container = document.createElement('div');
        container.id = 'tm-auctions-bar';
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

        // Single group row, same layout as Support/Tech: label + wrapped buttons
        const groupRow = document.createElement('div');
        Object.assign(groupRow.style, { display: 'flex', alignItems: 'center', width: '100%', gap: '3px', flexWrap: 'wrap' });
        const label = document.createElement('div');
        Object.assign(label.style, { width: '145px', minWidth: '145px', fontSize: '11px', fontWeight: 'bold', color: '#1a8a8a', textAlign: 'right', paddingRight: '8px', flexShrink: '0' });
        label.textContent = 'AUCTIONS';
        groupRow.appendChild(label);
        const buttonsRow = document.createElement('div');
        Object.assign(buttonsRow.style, { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3px', flex: '1' });
        config.buttonConfigs.forEach(buttonConfig => {
            buttonsRow.appendChild(createButton(buttonConfig));
        });
        groupRow.appendChild(buttonsRow);
        container.appendChild(groupRow);

        document.body.insertBefore(container, document.body.firstChild);

        // Sidebar shift, same as Support/Tech: unpin and move down by bar height
        const shiftSidebar = () => {
            const bar = document.getElementById('tm-auctions-bar');
            const sidebar = document.getElementById('page-sidebar');
            if (!bar || !sidebar || bar.offsetHeight <= 0) { return false; }
            if (sidebar.dataset.tmOriginalTop === undefined) {
                const currentTop = parseInt(sidebar.style.top, 10);
                sidebar.dataset.tmOriginalTop = isNaN(currentTop) ? '71' : String(currentTop);
            }
            const originalTop = parseInt(sidebar.dataset.tmOriginalTop, 10);
            const newTop = (originalTop + bar.offsetHeight) + 'px';
            if (sidebar.style.top !== newTop) { sidebar.style.top = newTop; }
            if (sidebar.style.position !== 'absolute') { sidebar.style.position = 'absolute'; }
            const grid = document.querySelector('.dvr-grid_GL0L3, [class*="dvr-grid"]');
            if (grid && grid.style.marginTop) { grid.style.marginTop = ''; }
            return true;
        };
        shiftSidebar();
        if (!window.__tmAuctionsSidebarObserver) {
            window.__tmAuctionsSidebarObserver = new MutationObserver(function() { shiftSidebar(); });
            window.__tmAuctionsSidebarObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'], childList: true, subtree: true });
        }
        if (!window.__tmAuctionsSidebarResize) {
            window.__tmAuctionsSidebarResize = true;
            window.addEventListener('resize', shiftSidebar);
        }

        // Only lock case for RFA queue
        setTimeout(function(){
            if (crossQueueMode) { return; }
            try {
                var myQueue = "relay-auctions-suppport@amazon.com";
                var p = document.getElementsByClassName("label");
                var currentQueue = p[2].nextElementSibling;
                if (currentQueue.textContent === myQueue) {
                    setTimeout(function(){
                        AfterLock();
                    }, 1000);
                }
                // else: gate already verified the queue, so do nothing
                // here — the old else-branch re-called init() and could
                // duplicate the bar on a non-matching queue.
            } catch(e) {
                console.log(e);
            }
        }, 1000);
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
                const oldBar = document.getElementById('tm-auctions-bar');
                if (oldBar) { oldBar.remove(); }
                waitForQueueGate(init);
            }, 1500);
        }
    }

    // Setup URL change detection
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

    // Queue gate: only activate when the case's Queue field is this
    // script's queue — same pattern as the Support/Tech scripts, so all
    // three can stay enabled at the same time without showing two bars.
    const allowedQueueValues = new Set([
        "relay-auctions-suppport@amazon.com" // auctions queue (spelling as on the case)
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
                console.log('[Auctions script] Queue gate: queue is not relay-auctions-suppport@amazon.com, not activating.');
                return;
            }
            attempts++;
            if (attempts < 30) {
                setTimeout(check, 500);
            } else {
                console.log('[Auctions script] Queue gate: queue is not relay-auctions-suppport@amazon.com, not activating.');
            }
        };
        check();
    }

    // Initialize everything
    function initialize() {
        setupUrlChangeDetection();
        waitForQueueGate(init);
    }

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
