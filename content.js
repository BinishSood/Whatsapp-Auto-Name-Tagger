console.log("WA Tagger: V1.3 Stable Release Loaded (Space-Commit Logic Active)");

const CHAT_BOX_SELECTOR = 'div[contenteditable="true"][data-tab="10"]';
//input text box selector
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//if we simply call normal sleep, browser will freeze. what this does it sleeps the specific function in which sleep is being called,
//not the entire browser. promise says that dw it will resolve after ms milliseconds. we indicate time is up by calling resolve function after ms time.

let savedAliases = {};
let isExecuting = false; // Flag to prevent overlapping macro executions

// 1. Sync with Chrome Storage
chrome.storage.local.get(null, (data) => {
    savedAliases = data;
});

// 2. Real-time update listener
chrome.storage.onChanged.addListener((changes) => {
    for (let [key, { newValue }] of Object.entries(changes)) {
        if (newValue) {
            savedAliases[key] = newValue; 
        } else {
            delete savedAliases[key];     
        }
    }
});

// 3. System-level text injection
function insertText(text) {
    document.execCommand('insertText', false, text);
}

// 4. Scans the DOM for the mention popup and clicks the match
async function fastClickMentionInDOM(targetName, maxWaitMs = 1500) {
    return new Promise((resolve) => {
        let elapsedTime = 0;
        const pollInterval = 25; // Check every 25ms for the mention popup to appear with the target name

        const checkDOM = setInterval(() => { //sets a timer that runs the function inside every 25ms until we clear it by calling clearInterval(checkDOM)
            const spans = Array.from(document.querySelectorAll('span'));
            const match = spans.find(span => span.innerText && span.innerText.trim() === targetName);
            //searches the entire dom
            
            if (match) {
                clearInterval(checkDOM);
                const mousedownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
                const mouseupEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
                const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                
                match.dispatchEvent(mousedownEvent);
                match.dispatchEvent(mouseupEvent);
                match.dispatchEvent(clickEvent);
                //doing this so wa doesnt think its a bot and block the clicking
                
                if (match.parentElement) match.parentElement.click();
                resolve(true); 
            }

            elapsedTime += pollInterval;
            if (elapsedTime >= maxWaitMs) {
                clearInterval(checkDOM);
                resolve(false); 
            }
        }, pollInterval);
    });
}

// 5. The Core Macro Engine
async function executeTaggingMacro(inputBox, triggerWord, namesList) {
    if (isExecuting) return;
    isExecuting = true;

    try {
        inputBox.focus(); //focus on the input box so that the text we insert goes there
        // Since the user already typed a space to commit, we don't need to insert an extra one
        await sleep(100); 

        for (const rawName of namesList) {
            const cleanName = rawName.replace(/@/g, '').trim(); 
            const searchName = cleanName.split(' ')[0]; 

            insertText('@');
            await sleep(150); 

            insertText(searchName);
            
            const foundAndClicked = await fastClickMentionInDOM(cleanName);

            if (!foundAndClicked) {
                insertText(" ");
            }

            await sleep(150); 
        }
    } catch (error) {
        console.error("Macro Crashed!", error);
    } finally {
        isExecuting = false;
    }
}

// 6. The Watcher (Listens for your trigger + Space)
const observer = new MutationObserver(() => {
    const inputBox = document.querySelector(CHAT_BOX_SELECTOR);

    if (inputBox && !inputBox.dataset.taggerAttached) {
        inputBox.dataset.taggerAttached = 'true';
        //injects our code only once per input box
        inputBox.addEventListener('input', () => {
            if (isExecuting) return; 

            // Get raw text but keep the trailing space
            const rawText = inputBox.innerText.replace(/[\u200B-\u200D\uFEFF]/g, '');
            // The regex removes zero-width characters that WhatsApp might insert, which can interfere with our trigger detection.
            
            // FIX: Wait for a Space or Newline before checking the dictionary
            if (!rawText.match(/[\s\u00A0]$/)) return;

            const currentText = rawText.trimEnd();
            const allTriggers = Object.keys(savedAliases);
            const matchedTrigger = allTriggers.find(alias => currentText.endsWith(alias));
            
            if (matchedTrigger) {
                const namesToTag = savedAliases[matchedTrigger];
                executeTaggingMacro(inputBox, matchedTrigger, namesToTag);
            }
        });
    }
});

observer.observe(document.body, { childList: true, subtree: true });// Start observing