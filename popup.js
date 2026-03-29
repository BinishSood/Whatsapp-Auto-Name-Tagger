document.addEventListener('DOMContentLoaded', loadAliases);
//dom is basically the tree structure of the webpage, this event listener is saying hey when the webpage is loaded, run the loadAliases function

document.getElementById('saveBtn').addEventListener('click', () => {
    //basically => is a callback function, it is like a function only, but it is async and it is used to avoid blocking the main thread.
    //here it is saying hey when the save button is clicked, run this function that saves the alias and names to storage.
    const alias = document.getElementById('aliasInput').value.trim();
    const namesString = document.getElementById('namesInput').value;

    if (!alias || !namesString) {
        alert("Please fill in both the alias and the names!");
        return;
    }

    const namesArray = namesString.split(',').map(name => name.trim()).filter(name => name !== '');

    chrome.storage.local.set({ [alias]: namesArray }, () => {
        const status = document.getElementById('status');
        status.style.display = 'block';
        setTimeout(() => { status.style.display = 'none'; }, 2000);
        //shows alias saved for 2 seconds
        
        document.getElementById('aliasInput').value = '';
        document.getElementById('namesInput').value = '';
        loadAliases();
        //after saving the alias, it clears the input fields and reloads the alias list to show the new alias.
    });
});

function loadAliases() {
    //null is for getting all the keys in storage, and data is the object that contains all the key value pairs in storage.
    chrome.storage.local.get(null, (data) => {
        const listContainer = document.getElementById('aliasList');
        listContainer.innerHTML = ''; 

        const keys = Object.keys(data);

        if (keys.length === 0) {
            listContainer.innerHTML = '<div class="empty-msg">No aliases saved yet.</div>';
            return;
        }

        keys.forEach(key => {
            const namesArray = data[key];
            const namesDisplay = namesArray.join(', ');
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'alias-item';

            itemDiv.innerHTML = `
                <span class="alias-name">${key}</span>
                <div class="alias-names">${namesDisplay}</div>
                <div class="action-btns">
                    <button class="edit-btn">Edit</button>
                    <button class="del-btn">Delete</button>
                </div>
            `;

            itemDiv.querySelector('.edit-btn').addEventListener('click', () => {
                document.getElementById('aliasInput').value = key;
                document.getElementById('namesInput').value = namesArray.join(', ');
            });

            itemDiv.querySelector('.del-btn').addEventListener('click', () => {
                if (confirm(`Delete "${key}"?`)) {
                    chrome.storage.local.remove(key, () => { loadAliases(); });
                }
            });

            listContainer.appendChild(itemDiv);
            // Append the created item to the list container ie updating the dom
        });
    });
}