/*
 * Handles all event interactions in the app:
 * Item actions - delete, checkbox toggle, add sub-item.
 * Restores item position when unchecked.
 * Maintains the selected theme on load and change.
*/

import { storeData } from "./storage.js";
import { setSubItemTarget } from './list-builder.js';

export function handleEvents(){
    document.addEventListener("click", (e) => {
        const li = e.target.closest("li");
        if (!li) return;
        const listContainer = li.closest(".list-container");
        if (!listContainer) return;
    
        const completed = listContainer.querySelector(".completed-items");
        const itemList = listContainer.querySelector(".item-list");
    
        //Delete item
        if (e.target.classList.contains("delete")) {
            e.target.closest("li").remove();
            storeData();
        }
    
        //Checkbox toggle
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
                // Restore item position when unchecked
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
            setSubItemTarget(e.target.closest("li"));
            const newItem = listContainer.querySelector(".new-item");
            newItem.focus();
            storeData();
        }
    });
    
}

// Apply saved theme on page load
export function applySavedTheme() {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
        document.body.className = "";
        document.body.classList.add("theme-" + savedTheme);
    }
}
    
// Handle theme change
export function handleThemeSelection() {
    document.querySelectorAll(".theme-option").forEach(option => {
        option.addEventListener("click", () => {
        const theme = option.dataset.theme;

        document.body.className = "";
        document.body.classList.add("theme-" + theme);

        localStorage.setItem("selectedTheme", theme);        
      });
    });
}
