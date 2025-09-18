/*
 * Handles saving and loading list data with localStorage.
 * - storeData(): saves current lists and their items.
 * - retrieveData(): rebuilds lists from saved data.
 * - initStorage(): initializes data on app load.
*/

// Save all current lists to localStorage
export function storeData() {
    const allLists = [];
    document.querySelectorAll(".list-container").forEach((container) => {
        if (!container.dataset.id) {
            container.dataset.id = Date.now().toString() + Math.random();
        }

        const listData = {
             id: container.dataset.id,
            title: container.querySelector(".title").textContent,
            items: [],
        };

        container.querySelectorAll("ul li").forEach((li) => {
            listData.items.push({
                id: li.dataset.id,
                text: li.querySelector(".text").textContent,
                checked: li.querySelector('input[type="checkbox"]').checked,
                parentId: li.dataset.parentId || null,
            });
        });
        allLists.push(listData);
    });

    if (allLists.length === 0) {
        localStorage.removeItem("lists");
    } 
    else {
        localStorage.setItem("lists", JSON.stringify(allLists));
    }
}

// Restore lists from localStorage
export function retrieveData(createList) {
    const saved = JSON.parse(localStorage.getItem("lists")) || [];
    const container = document.querySelector(".container");
    container.innerHTML = "";

    if (saved.length === 0) {
        container.innerHTML = "<div class='empty-message'>You haven’t created any lists yet. Start by adding one now.</div>";
        return;
    }

    // Rebuild each saved list
    saved.forEach((list) => {
        const container = createList(list.title);
        container.dataset.id = list.id;
        const idMap = {};
        list.items.forEach((item) => {
            const li = document.createElement("li");
            li.dataset.id = item.id;
            li.dataset.parentId = item.parentId;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = item.checked;
            li.appendChild(checkbox);

            const textSpan = document.createElement("span");
            textSpan.className = "text";
            textSpan.textContent = item.text;
            li.appendChild(textSpan);

            const del = document.createElement("span");
            del.className = "delete";
            del.title = "Delete";
            del.textContent = "\u00D7";
            li.appendChild(del);

            if(item.parentId === "null"){  
                const addSub = document.createElement("span");
                addSub.className = "add-sub";
                addSub.title = "Add sub item";
                addSub.textContent = "\u002B";
                li.appendChild(addSub);
            }
            idMap[item.id] = li;
        });

        // Place items in correct section (active, nested, or completed)
        list.items.forEach((item) => {
            const li = idMap[item.id];
          
            if (item.checked) {
                container.querySelector(".completed-items").appendChild(li);
            } 
            else if (item.parentId && idMap[item.parentId]) {
                let parentLi = idMap[item.parentId];
                let nestedUL = parentLi.querySelector("ul");

                if (!nestedUL) {nestedUL = document.createElement("ul");}

                parentLi.appendChild(nestedUL);
                nestedUL.appendChild(li);
          } 
          else {
            container.querySelector(".item-list").appendChild(li);
          }
        });
    });
}

// Initialize storage on app load
export function initStorage(createList) {
    retrieveData(createList);
}