/*
 * Builds and manages the list UI: containers, titles, inputs, buttons, and sections for active/completed items. 
 *  Handles list deletion, empty state messages, and links UI actions.
*/

import { handleButtonClick, handleTitleEdit } from './list-builder.js';
import { storeData } from "./storage.js";

export function createList(title) {
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
    deleteList.className = "delete-list";
    deleteList.onclick = () => {
        container.remove();
        if (document.querySelectorAll(".list-container").length === 0) {
            document.querySelector(".container").innerHTML = "<div class='empty-message'>You haven’t created any lists yet. Start by adding one now.</div>";
        }
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
