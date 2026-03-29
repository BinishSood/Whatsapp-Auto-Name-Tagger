# WA Batch Tagger

![Version](https://img.shields.io/badge/version-1.3_Stable-blue.svg)
![Platform](https://img.shields.io/badge/platform-Chrome_|_Firefox-green.svg)
![Privacy](https://img.shields.io/badge/privacy-100%25_Local-success.svg)

WA Batch Tagger is a lightweight, privacy-first browser extension that allows users to create custom aliases to batch-tag multiple people in WhatsApp Web groups instantly. 

Instead of manually typing `@Name` repeatedly for a group of friends or family, you can type a single trigger word (e.g., `@team `), and the extension will automatically expand it, query the DOM, and fire the necessary events to tag everyone in the list.

## Installation

### For Google Chrome, Edge, and Brave (Unpacked Zip)

1. Go to the [Releases](https://github.com/BinishSood/Whatsapp-Auto-Name-Tagger/releases) page and download the `WA-Batch-Tagger.zip` file.
2. Unzip the folder to a permanent location on your computer.
3. Open your browser and navigate to `chrome://extensions/`.
4. Turn on **Developer mode** (usually a toggle in the top right corner).
5. Click the **Load unpacked** button in the top left.
6. Select the unzipped folder. The extension is now installed!

### For Firefox Desktop

To install and run the extension in Firefox (Temporary/Unsigned):
1. Go to the [Releases](https://github.com/BinishSood/Whatsapp-Auto-Name-Tagger/releases) page and download the source code or `WA-Batch-Tagger.xpi`.
2. Open Firefox and navigate to `about:debugging`.
3. Click **This Firefox** on the left-hand sidebar.
4. Click **Load Temporary Add-on...**
5. Select the `manifest-firefox.json` file from your project folder (or the `.xpi` file). 
6. The extension is now active! *(Note: Temporary add-ons are removed when Firefox restarts).*

### For Safari users

1. as much as i love apple, i aint payin 99 a year for this bruh

## 🛠️ How to Use

1. Click the extension icon in your browser toolbar to open the configuration popup.
2. Enter a **Trigger Alias** (e.g., `@family`).
3. Enter the **Names** exactly as they appear in your WhatsApp group, separated by commas (e.g., `Dad, Mom, Bob`).
4. Click **Save Alias**.
5. Open a WhatsApp Web group chat.
6. **Triggering the Macro:** Type your alias followed by a **space** (e.g., `@family `). The space character is required to "commit" the alias and trigger the automatic tagging.
7. The macro will take over and batch-tag the contacts!

## ⚙️ Technical Architecture

* **Privacy by Design:** Operates entirely locally. No backend servers, no analytics, no network requests. Aliases are saved strictly to local hard drive storage via the `storage` API.
* **React Engine Bypass:** Circumvents WhatsApp's Virtual DOM protections using `document.execCommand` injections to emulate physical keyboard buffer inputs.
* **Prefix Collision Safety:** Implements "Space-Commit" debouncing logic. Typing `@test` will not prematurely trigger if attempting to type `@test1`. 
* **Synthetic Event Emulation:** Generates and dispatches full-cycle hardware mouse events (`mousedown`, `mouseup`, `click`) directly to rendered UI components.

## 👨‍💻 Author

**Binish Sood**

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).