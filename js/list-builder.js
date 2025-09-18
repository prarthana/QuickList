/*
 * Adding new items or titles via the Enter button
 * Editing list titles
 * Managing sub-item target for nested items
*/

import { storeData } from './storage.js';

let subItemTarget = null;

//Handle enter button - saves list title or adds a new item
export function handleButtonClick(button) {

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
  } 
  else {
      // Add new list item
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

          // Append to parent
          if (subItemTarget) {
              let nestedUL = subItemTarget.querySelector("ul");
              if (!nestedUL) {
                nestedUL = document.createElement("ul");
                subItemTarget.appendChild(nestedUL);
              }
              nestedUL.appendChild(item);
              subItemTarget = null;
          } 
          else {
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

// Edit list title
export function handleTitleEdit(container, listTitle){
    const input = document.createElement("input");
    input.value = listTitle.textContent;
    input.className = "edit-title-input";
    listTitle.replaceWith(input);
    input.focus();

    const editTitle = container.querySelector(".edit-title");
        if(editTitle){
            editTitle.style.display = 'none';
        }

    let saved = false; 
    function saveTitle(){
        if (saved) return;
        saved = true;

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

// Set the target for adding a sub-item
export function setSubItemTarget(li) {
    subItemTarget = li;
}
