// ==UserScript==
// @name         Amazon Relay Responses RFA Auctions Support — Team
// @namespace    http://tampermonkey.net/
// @version      1.3
// @updateURL    https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Auctions-Team.user.js
// @downloadURL  https://raw.githubusercontent.com/powersjohnt-dotcom/relay-tampermonkey/main/Auctions-Team.user.js
// @description  Automatically inserts responses for Relay Auctions Support issues
// @author       Sheshu Venugopal
// @match        https://paragon-na.amazon.com/hz/view-case?caseId=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration object
    const config = {
        buttonConfigs: [
            { id: 'canada', text: 'Canada' },
            { id: 'deniedBid', text: 'Denied Bid' },
            { id: 'renewal', text: 'Renewal/Extend' },
            { id: 'updateAssets', text: 'Update Assets' },
            { id: 'cancellations', text: 'Cancellations' },
            { id: 'untendered', text: 'Untendered' },
            { id: 'performance', text: 'Performance' },
            { id: 'payment', text: 'Payment' },
            { id: 'suspended', text: 'Suspended' },
            { id: 'cancellationFollowup', text: 'Cancel Follow-up' },
            { id: 'tenderedFollowup', text: 'Tendered Follow-up' },
            { id: 'awardedContract', text: 'Awarded Contract' },
            { id: 'moreinfo', text: 'More Info' }
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
        canada: `Dear Carrier,

Thank you for reaching out.

This queue supports US-based operations. For all Canada-related inquiries, please reach out to rpm-canada@amazon.com for further assistance.

Thank you for your continued partnership with Relay.

For additional support, please visit the Relay Support Center at: https://relay.amazon.ca/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.ca/cases/sc/learning`,

        deniedBid: `Dear Carrier,

Those contracts are currently undergoing adjustments and are not designated for public auction at this time. While they may still appear in the system, they are not active listings. Please feel free to continue placing bids on other available opportunities.`,

        renewal: `Dear Carrier,

If your company is eligible, you'll receive an email with an offer to renew an existing dedicated lane or domicile-based contracts. Renewal offers are based on performance during the contract. They're sent three weeks before the contract expires, and you'll have one day to accept or reject the offer.`,

        updateAssets: `Dear Carrier,

Add any equipment you plan to use for Amazon loads that's not already listed in your Assets page.
You'll get an email if you need to provide additional documentation about any of your listed assets.

This course will cover asset import and verification, as well as gate rejections from unverified equipment:
Managing Assets with Amazon Relay: https://relay.amazon.com/cases/sc/help/search/details?detailProps=JTdCJTIydHlwZSUyMiUzQSUyMkNPVVJTRSUyMiUyQyUyMmlkJTIyJTNBJTIyMzI1YmIyZTItNTJhYS00MGU1LWIyMzMtOGNhNTA3NWI4M2Q4JTIyJTdE

For issues related to Assets, please navigate to Relay Support Center and create a case under the Topic: Asset Edit.`,

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

If you believe your performance score was impacted unfairly, you may submit performance disputes for individual VRIDs by navigating to the Performance page and clicking the Dispute button next to the applicable Tour ID/ VRID. You must submit within 14 days of load completion and provide objective proof as to why the issue was not carrier-controllable.

The performance dispute team will review and decide whether or not to approve that the issue was not carrier controllable. Carriers may appeal a performance dispute one time if they don't agree with the initial result by replying on the same case.

For additional training on Performance Disputes:
https://relay.amazon.com/cases/sc/help/search/details?detailProps=JTdCJTIydHlwZSUyMiUzQSUyMkNPVVJTRSUyMiUyQyUyMmlkJTIyJTNBJTIyZjI0YzMwNTYtOWJkMi00ZmUxLThkOGMtMWM2MmFiYjUxNmE2JTIyJTdE

If you have any additional details or questions in the meantime, please reply to this case or visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay.`,

        payment: `Dear Carrier,

Please file a payment dispute through the Relay portal and follow below steps:

Go to Relay > Payments > File a dispute > Continue to file a dispute (from dialog box) > Select number of items or loads from invoice > Proceed to dispute.

If you want to add the "Missing item":
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

(insert contract)

These changes should reflect in your account shortly. If you do not see the update within 24 hours, please reply to this case and we will investigate further.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay.`,

        tenderedFollowup: `Dear Carrier,

Thank you for your patience and we apologize for the delayed response.

Your contracts have been TENDERED:

(insert contract)

These changes should reflect in your account shortly. If you do not see the update within 24 hours, please reply to this case and we will investigate further.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

Thanks for continuing to haul with Relay.`,

        awardedContract: `Dear Carrier,

Thank you for reaching out regarding contract(s): (insert contract)

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

Could you please share any screenshot(s) and more details of the issue faced so that we can investigate further.

Thank you for your continued partnership with Relay.

For additional support, please visit the Relay Support Center at: https://relay.amazon.com/cases/sc/help

For additional resources, please visit the Relay Learning Center at: https://relay.amazon.com/cases/sc/learning`
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
            signatureButton.click();
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
                Object.assign(tray.style, { position: 'absolute', bottom: '4px', right: '8px', zIndex: '10001', display: 'flex', gap: '6px' });
                nativeBar.appendChild(tray);
            }
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
            Object.assign(backBtn.style, { position: 'absolute', bottom: '4px', right: '8px', zIndex: '10001', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' });
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
