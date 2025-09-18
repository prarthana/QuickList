/*
  QuickList App
  Author: Prarthana Mahipala
  Copyright (c) 2025 Prarthana Mahipala. All rights reserved.
*/
/****************************************
 * SECTION 1: Core List Builder */
function createList(title) {
  // Remove empty message if it exists
  const emptyMsg = document.querySelector(".empty-message");
  if (emptyMsg) emptyMsg.remove();

    //Container div
    let container = document.createElement("div");
    container.classList.add("list-container");
    container.originalParentMap = new Map();
    

    //Delete list 
    const deleteList = document.createElement("button");
    deleteList.textContent = "\u00D7";
    deleteList.className = "delete-list"
    deleteList.onclick = () => {
        container.remove();
        storeData();
    }
    container.appendChild(deleteList);

    //Input section 
    const inputSection = document.createElement("section");
    inputSection.classList.add("add-new");
    container.appendChild(inputSection);

    const input = document.createElement("input");
    input.type = "text";
    input.className = "new-item";
    input.placeholder = "Enter list title...";

    const button = document.createElement("button");
    button.textContent = "\u27A4";
    button.className = "add"
    button.onclick = () => handleButtonClick(button);

    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    

    //List title
    const listTitle = document.createElement("h1");
    listTitle.className = "title";
    if (title) {
        listTitle.textContent = title;
        input.placeholder = "Enter an item...";
    }
    

    //Edit title button
    const editTitle = document.createElement("button");
    editTitle.className = "edit-title";
    editTitle.textContent = " ";
    editTitle.style.display = title ? "inline-block" : "none";

    editTitle.addEventListener("click", () => {
        const currentTitle = container.querySelector(".title");
        if (currentTitle) {
            handleTitleEdit(container, currentTitle);
        }
    });
    inputSection.appendChild(titleContainer);
    titleContainer.appendChild(listTitle);
    titleContainer.appendChild(editTitle);
    inputSection.appendChild(input);
    inputSection.appendChild(button);


    //Item list section
    const itemListSection = document.createElement("section");
    const itemList = document.createElement("ul");
    itemList.classList.add("item-list");
    itemListSection.appendChild(itemList);

    //Completed items section
    const completedSection = document.createElement("section");
    const completed = document.createElement("ul");
    completed.classList.add("completed-items");
    completedSection.appendChild(completed);

    container.appendChild(itemListSection);
    container.appendChild(completedSection);

    document.querySelector(".container").appendChild(container);
    return container;
}

/*****************************************************************
 Section 2 : Item handling */

//Button toggle
let subItemTarget = null;

function handleButtonClick(button) {

    const listContainer = button.closest(".list-container");
    const newItem = listContainer.querySelector(".new-item");
    const value = newItem.value.trim();
    const title = listContainer.querySelector(".title").textContent;

    if (!title) {
        if (value) {
            const title = listContainer.querySelector(".title");
            title.textContent = value;

            const editTitle = listContainer.querySelector(".edit-title");
            editTitle.style.display = "inline-block";

            
            newItem.value = "";
            newItem.placeholder = "Enter an item...";
            storeData();
        } 
        else {
            alert("Please enter a title for your list.");
        }
        storeData();
  } else {
    const itemList = listContainer.querySelector(".item-list");

    if (value) {
      let item = document.createElement("li");
      item.dataset.id = Date.now().toString() + Math.random();

      if (subItemTarget) {
        item.dataset.parentId = subItemTarget.dataset.id;
      } else {
        item.dataset.parentId = null;
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checkbox"
      item.appendChild(checkbox);

      const textSpan = document.createElement("span");
      textSpan.className = "text";
      textSpan.textContent = newItem.value;
      item.appendChild(textSpan);

      const del = document.createElement("span");
      del.className = "delete";
      del.title = "Delete";
      del.textContent = "\u00D7";
      item.appendChild(del);

      if (!subItemTarget) {
        const addSub = document.createElement("span");
        addSub.className = "add-sub";
        addSub.title = "Add sub item";
        addSub.textContent = "\u002B";
        item.appendChild(addSub);
      }

      if (subItemTarget) {
          let nestedUL = subItemTarget.querySelector("ul");
          if (!nestedUL) {
            nestedUL = document.createElement("ul");
            subItemTarget.appendChild(nestedUL);
          }
          nestedUL.appendChild(item);
          subItemTarget = null;
      } else {
         itemList.appendChild(item);
      }

      newItem.value = "";
      storeData();
    } 
    else {
      alert("Please type something to add as an item.");
    }
  }
}

/*****************************************************************
 Section 3 : Title handling */

function handleTitleEdit(container, listTitle){
        const input = document.createElement("input");
        input.value = listTitle.textContent;
        input.className = "edit-title-input";
        listTitle.replaceWith(input);
        input.focus();

        const editTitle = container.querySelector(".edit-title");
        if(editTitle){
            editTitle.style.display = 'none';
        }

        function saveTitle(){
            const newTitle = document.createElement("h1");
            newTitle.className = "title";
            newTitle.textContent = input.value.trim() || "Untitled List";
            input.replaceWith(newTitle);
            
            if(editTitle){
                editTitle.style.display = "inline-block";
                editTitle.onclick = ()=> handleTitleEdit(container, newTitle);
            }
            storeData();
        }

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
               e.preventDefault();
                saveTitle();
            }
        });

        input.addEventListener("blur", () => {
  saveTitle();
});
        
    }

document.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const listContainer = li.closest(".list-container");
    if (!listContainer) return;

    const completed = listContainer.querySelector(".completed-items");
    const itemList = listContainer.querySelector(".item-list");

    //delete item
    if (e.target.classList.contains("delete")) {
        e.target.closest("li").remove();
        storeData();
    }

    //checkbox
    if (e.target.matches('input[type="checkbox"]')) {
        const li = e.target.closest("li");
        const listContainer = e.target.closest(".list-container");
        if (!listContainer) return; 
  
        if (!listContainer.originalParentMap) {
            listContainer.originalParentMap = new Map();
        }

        const itemList = listContainer.querySelector(".item-list");
        const completed = listContainer.querySelector(".completed-items");

        if (e.target.checked) {
            listContainer.originalParentMap.set(li, {
                parent: li.parentElement,
                nextSibling: li.nextSibling,
            });
            completed.appendChild(li);
        } 
        else {
            const original = listContainer.originalParentMap.get(li);

            if (original) {
                if (original.nextSibling) {
                    original.parent.insertBefore(li, original.nextSibling);
                } 
                else {
                    original.parent.appendChild(li);
                }
                listContainer.originalParentMap.delete(li);
            } 
            else {
              //Restore using parentId after reload
              const parentId = li.dataset.parentId;
              if (parentId && listContainer.querySelector(`[data-id="${parentId}"]`)) {
                  let parentLI = listContainer.querySelector(`[data-id="${parentId}"]`);
                  let nestedUL = parentLI.querySelector("ul");
                  if (!nestedUL) {
                      nestedUL = document.createElement("ul");
                      parentLI.appendChild(nestedUL);
                  }
                  nestedUL.appendChild(li);
              } 
              else {
                  itemList.appendChild(li);
              }
            }
        }

  storeData();
}
    //Add sub item
    if (e.target.classList.contains("add-sub")) {
        subItemTarget = e.target.closest("li");
        const newItem = listContainer.querySelector(".new-item");
        newItem.focus();
        storeData();
    }
});

/*****************************************************************
 Section 4 : Theme selection */
// Apply saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    document.body.className = "";
    document.body.classList.add("theme-" + savedTheme);
  }
});

// Handle theme change
document.querySelectorAll(".theme-option").forEach(option => {
  option.addEventListener("click", () => {
    const theme = option.dataset.theme;

    // Clear old theme classes
    document.body.className = "";
    document.body.classList.add("theme-" + theme);

    // Save the selected theme
    localStorage.setItem("selectedTheme", theme);

    
  });
});



/*****************************************************************
 Section 5 : Store and retrieve data */

function storeData() {
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

    localStorage.setItem("lists", JSON.stringify(allLists));
}

function retrieveData() {
    const saved = JSON.parse(localStorage.getItem("lists")) || [];

    const container = document.querySelector(".container");


    if (saved.length === 0) {
        container.innerHTML = "<div class='empty-message'>You haven’t created any lists yet. Start by adding one now.</div>";
        return;
    }

    saved.forEach((list) => {
        /*const existing = Array.from(document.querySelectorAll(".list-container"))
          .find(listContainer => listContainer.querySelector(".title").textContent === list.title);

        const container = existing || createList(list.title);*/
        const container = createList(list.title);

        // ✅ Restore the unique id
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

        // Place li elements in proper parent or completed section
        list.items.forEach((item) => {
          const li = idMap[item.id];
          if (item.checked) {
            container.querySelector(".completed-items").appendChild(li);
          } else if (item.parentId && idMap[item.parentId]) {
            let parentLi = idMap[item.parentId];
            let nestedUL = parentLi.querySelector("ul");
            if (!nestedUL) nestedUL = document.createElement("ul");
            parentLi.appendChild(nestedUL);
            nestedUL.appendChild(li);
          } else {
            container.querySelector(".item-list").appendChild(li);
          }
        });
    });
}


window.addEventListener("DOMContentLoaded", retrieveData);
