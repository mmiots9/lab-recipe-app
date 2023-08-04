// add_recipe.js
let recipes = []; // Initialize the recipes array

// ------------- RECIPE NAME ------------------------------

// Function to check if the recipe name already exists
function recipeNameExists(recipeName) {
    return recipes.some((recipe) => recipe.name === recipeName);
}


// Function to check validity of recipe name
function isRecipeNameValid() {
    const recipeNameInput = document.getElementById('recipeName');
    const recipeName = recipeNameInput.value.trim();
    const recipeNameError = document.getElementById('recipeNameError');

    // Return false if recipe name is empty or already exists
    if (recipeNameExists(recipeName) || !recipeName) {
        recipeNameError.textContent = 'A recipe with this name already exists';
        return false;
    }

    recipeNameError.textContent = '';
    return true;
}



// ------------- APPLICATION ------------------------------

// Function to check if the application name already exists
function applicationNameExists(applicationName) {
    return recipes.some((recipe) => recipe.application === applicationName);
}


// Function to populate the application field dropdown and enable the "Save Recipe" button
function populateApplicationFieldDropdown() {
    const applicationField = document.getElementById('applicationField');
    applicationField.innerHTML = ''; // Clear the dropdown options

    // Add the "NULL" option at the beginning of the dropdown
    const nullOtption = document.createElement('option');
    nullOtption.value = 'NULL';
    nullOtption.textContent = '---';
    applicationField.appendChild(nullOtption);

    // Create a Set to store unique application values
    const uniqueApplicationsSet = new Set();
    recipes.forEach((recipe) => uniqueApplicationsSet.add(recipe.application));

    // Convert the Set to an array and sort it alphabetically
    const uniqueApplications = Array.from(uniqueApplicationsSet).sort();

    // Populate the dropdown with sorted and unique application options
    uniqueApplications.forEach((application) => {
        const option = document.createElement('option');
        option.value = application;
        option.textContent = application;
        applicationField.appendChild(option);
    });

    // Add the "Other..." option at the end of the dropdown
    const otherOption = document.createElement('option');
    otherOption.value = 'Other...';
    otherOption.textContent = 'Other...';
    applicationField.appendChild(otherOption);
}


// Function to handle the application field change
function handleApplicationFieldChange() {
    const applicationField = document.getElementById('applicationField');
    const selectedApplication = applicationField.value;
    const newApplicationInput = document.getElementById('newApplicationInput');

    // Show/hide the input field for a new application based on the selection
    if (selectedApplication === 'Other...') {
        newApplicationInput.style.display = 'inline';
        newApplicationInput.value = ''; // Clear the input field value
    } else {
        newApplicationInput.style.display = 'none';
    }
}


// Function to validate application field value
function isApplicationNameValid() {
    const applicationField = document.getElementById('applicationField');
    const selectedApplication = applicationField.value;
    const newApplicationInput = document.getElementById('newApplicationInput');
    const applicationName = newApplicationInput.value.trim();
    const applicationNameError = document.getElementById('applicationNameError');

    // Return true if application choice is not "Other..."
    if (selectedApplication != 'Other...') {
        applicationNameError.textContent = '';
        return true;
    }

    // Check if application name input is valid
    if (applicationNameExists(applicationName) || !applicationName) {
        applicationNameError.textContent = 'An application with this name already exists.';
        return false;
    }

    applicationNameError.textContent = '';
    return true;

}



// ------------- REAGENTS ------------------------------

// Function to check if the application name already exists
function reagentNameExists(reagentName, reagentId) {
    const reagentNamesEl = document.querySelectorAll(`.reagent-name-input:not([id='${reagentId}']`);
    const reagentNames = [];

    reagentNamesEl.forEach((element) => {
        reagentNames.push(element.value.toLowerCase().trim());
    })

    return reagentNames.includes(reagentName.toLowerCase().trim());
}


// Function to populate the concentration unit dropdown
function populateConcentrationUnitDropdown(selectElement, concentrationUnits) {
    concentrationUnits.forEach((unit) => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        selectElement.appendChild(option);
    });
}


// Function to add a new row for reagents
function addReagentRow() {
    const reagentsTable = document.getElementById('reagentsTable').getElementsByTagName('tbody')[0];
    const id_number = document.querySelectorAll('.reagent-name-td').length + 1

    const newRow = reagentsTable.insertRow();
    newRow.innerHTML = `
        <td class="reagent-name-td">
            <input type="text" required class="reagent-name-input" id = "reagent-name-${id_number}">
            <div class="reagent-name-error" style="color: red;"></div>
        </td>
        <td><input type="number" required></td>
        <td><select class="first-select" required></select></td>
        <td><input type="number" required></td>
        <td><select class="second-select" required></select></td>
        <td><button type="button" onclick="removeReagentRow(this)">Remove</button></td>
    `;

    // Populate select unit fields
    const concentrationUnitSelects = newRow.querySelectorAll('select');
    const firstSelect = concentrationUnitSelects[0];
    const secondSelect = concentrationUnitSelects[1];

    // Grouped options for the first and second selects
    const groupedOptions = [
        ['---', 'X', 'g/mol', 'M', 'mM', 'uM', 'nM', 'mg/mL', 'ug/mL', 'ng/mL'],        // Options for the first select
        ['---'],
        ['X'],                          // Options for the second select when X is selected
        ['M', 'mM', 'uM', 'nM'],        // Options for the second select when 'g/mol' is selected
        ['M', 'mM', 'uM', 'nM'],        // Options for the second select when 'M' is selected
        ['mM', 'uM', 'nM'],             // Options for the second select when 'mM' is selected
        ['uM', 'nM'],                   // Options for the second select when 'uM' is selected
        ['nM'],                         // Options for the second select when 'nM' is selected
        ['mg/mL', 'ug/mL', 'ng/mL'],    // Options for the second select when 'mg/mL' is selected
        ['ug/mL', 'ng/mL'],             // Options for the second select when 'ug/mL' is selected
        ['ng/mL'],                      // Options for the second select when 'ug/mL' is selected
    ];

    // Populate the first select with all the available options
    populateConcentrationUnitDropdown(firstSelect, groupedOptions[0]);

    // Add event listener to the first select to update the second select options
    firstSelect.addEventListener('change', () => {
        const selectedIndex = firstSelect.selectedIndex;
        const optionsForSecondSelect = groupedOptions[selectedIndex + 1];

        // Clear existing options
        secondSelect.innerHTML = '';

        // Populate the second select with options based on the selected index of the first select
        populateConcentrationUnitDropdown(secondSelect, optionsForSecondSelect);
    });

    // Initially, populate the second select with options based on the first select's default value
    const selectedIndex = firstSelect.selectedIndex;
    const optionsForSecondSelect = groupedOptions[selectedIndex];
    populateConcentrationUnitDropdown(secondSelect, optionsForSecondSelect);
}


// Function to remove a reagent row
function removeReagentRow(button) {
    const row = button.parentNode.parentNode;
    const reagentsTable = row.parentNode;
    reagentsTable.removeChild(row);
}


// TODO: Check name of all reagents
function handleReagentNameInput(nameInputTd) {
    const nameInput = nameInputTd.querySelector('.reagent-name-input');
    const reagentName = nameInput.value.trim();
    const reagentNameId = nameInput.id;
    const reagentNameError = nameInputTd.querySelector('.reagent-name-error');
    const saveRecipeButton = document.getElementById('saveRecipeButton');
    
    // Disable if name is empty or if name already exists
    if (!reagentName) {
        saveRecipeButton.disabled = true;
    } else if (reagentNameExists(reagentName, reagentNameId)) {
        reagentNameError.textContent = 'A reagent with this name already exists'
        saveRecipeButton.disabled = true;
    } else {
        saveRecipeButton.disabled = false;
        reagentNameError.textContent = '';
    }
}



// ------------- PROTOCOL STEP ------------------------------

// Function to add a new protocol step
function addProtocolStep() {
    const protocolStepsList = document.getElementById('protocolStepsList');

    const newStep = document.createElement('li');
    newStep.innerHTML = '<input type="text" required>';
    protocolStepsList.appendChild(newStep);
}










// Function to handle form submission and save the new recipe
function saveRecipe(event) {
    event.preventDefault();

    const recipeName = document.getElementById('recipeName').value;
    const applicationField = document.getElementById('applicationField').value;

    // Get the reagents data from the table
    const reagentsTable = document.getElementById('reagentsTable');
    const reagents = [];
    for (let i = 0; i < reagentsTable.rows.length; i++) {
        const row = reagentsTable.rows[i];
        const name = row.cells[0].querySelector('input').value;
        const stockConcentration = parseFloat(row.cells[1].querySelector('input').value);
        const stockUnit = row.cells[2].querySelector('select').value;
        const finalConcentration = parseFloat(row.cells[3].querySelector('input').value);
        const finalUnit = row.cells[4].querySelector('select').value;

        reagents.push({
            name: name,
            stockConcentration: stockConcentration,
            stockUnit: stockUnit,
            finalConcentration: finalConcentration,
            finalUnit: finalUnit,
        });
    }

    // Get the protocol steps data from the list
    const protocolStepsList = document.getElementById('protocolStepsList');
    const protocolSteps = [];
    for (let i = 0; i < protocolStepsList.children.length; i++) {
        const step = protocolStepsList.children[i].querySelector('input').value;
        protocolSteps.push(step);
    }

    // Create the new recipe object
    const newRecipe = {
        name: recipeName,
        application: applicationField,
        reagents: reagents,
        protocol: protocolSteps,
    };

    // Check if the recipe name already exists
    if (recipeNameExists(recipeName)) {
        alert('Recipe name already exists. Please choose a different name.');
        return;
    }

    // Add the new recipe to the recipes array
    recipes.push(newRecipe);

    // Save the updated recipes to local storage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Prompt the user to download the new JSON file
    const blob = new Blob([JSON.stringify(recipes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recipes.json';
    a.click();
    URL.revokeObjectURL(url);

    // Redirect back to home.html
    window.location.href = 'home.html';
}

// Load and display the recipes when the page loads
window.addEventListener('load', () => {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        recipes = JSON.parse(storedRecipes);
    }

    populateApplicationFieldDropdown();
});

// Add form submission event listener
document.getElementById('addRecipeForm').addEventListener('submit', saveRecipe);






// Load and display the recipes when the page loads
window.addEventListener('load', () => {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        recipes = JSON.parse(storedRecipes);
    }

    populateApplicationFieldDropdown();

    // Enable the "Save Recipe" button and add its event listener
    const saveRecipeButton = document.getElementById('saveRecipeButton');
    saveRecipeButton.addEventListener('click', saveRecipe);

    // Add event listener for recipe name input change
    const recipeNameInput = document.getElementById('recipeName');
    recipeNameInput.addEventListener('input', handleRecipeNameInput);

    // Call the handleRecipeNameInput function once to initialize the button state
    handleRecipeNameInput();

    // Add event listener for application field change
    const applicationField = document.getElementById('applicationField');
    applicationField.addEventListener('change', handleApplicationFieldChange);
});
