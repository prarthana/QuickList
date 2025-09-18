/*
  QuickList App
  Author: Prarthana Mahipala
  Copyright (c) 2025 Prarthana Mahipala. All rights reserved.
  -----------------------------------------
  Main entry point:
  - Initializes stored lists
  - Applies saved theme
  - Sets up global event handlers
  - Handles the "New List" button
*/

import { createList } from './ui.js';
import { initStorage, storeData } from './storage.js';
import { handleEvents, applySavedTheme, handleThemeSelection } from './events.js';

window.addEventListener('DOMContentLoaded', () => {

    //Apply previously selected theme (if any)
    applySavedTheme();

    //Load saved lists from localStorage
    initStorage(createList);

    //Setup event delegation for list items and checkboxes
    handleEvents();

    //Setup theme selection buttons
    handleThemeSelection();

    //Set up New List button
    document.getElementById("btn-new-list")
        .addEventListener("click", () => {
            createList();
            storeData(); 
        });
});

