// add_recipe.js
let recipes = []; // Initialize the recipes array
const recipeToEdit = JSON.parse(localStorage.getItem('selectedRecipe'));
let temp_recipes = []; //

const concentrationUnitsMol = {
    M: 1,
    mM: 0.001,
    uM: 0.000001,
    nM: 0.000000001,
};

const concentrationUnitsGrams = {
    g: 1,
    mg: 0.001,
    ug: 0.000001,
    ng: 0.000000001,
};

const concentrationUnitsL = {
    L: 1,
    mL: 0.001,
    uL: 0.000001,
};


// ------------- LOAD RECIPES ------------------------------

// function that returns filtered recipes 
function removeRecipeByName(recipeName) {
    
    // Function to check if a recipe's name is not equal to the provided name
    function isNotRecipe(recipe) {
        return recipe.name !== recipeName;
    }

    // Use the filter method to create a new array without the recipe with the provided name
    return recipes.filter(isNotRecipe);
}

// Load and display the recipes when the page loads
window.addEventListener('load', () => {
    const storedRecipes = localStorage.getItem('recipes');
    
    if (storedRecipes) {
        recipes = JSON.parse(storedRecipes);
        temp_recipes = removeRecipeByName(recipeToEdit.name);
    }

    populateApplicationFieldDropdown();

    populatePage()

    // 

    // // Enable the "Save Recipe" button and add its event listener
    // const saveRecipeButton = document.getElementById('saveRecipeButton');
    // saveRecipeButton.addEventListener('click', saveRecipe);

    // Add event listener for application field change
    const applicationField = document.getElementById('applicationField');
    applicationField.addEventListener('change', handleApplicationFieldChange);
});



// ------------- FILL RECIPE ------------------------------

// function that populate page 
function populatePage() {

    // Insert name
    const recipeNameInput = document.getElementById('recipeName');
    recipeNameInput.value = recipeToEdit.name;

    // Insert application
    const applicationField = document.getElementById('applicationField');
    applicationField.value = recipeToEdit.application;

    // Insert reagents
    recipeToEdit.reagents.forEach((reagent) => { 

        // Create new row
        newRow = addReagentRow()

        // Get variables
        const reagentName = newRow.querySelector('.reagent-name-input');
        const stockConcentrationValue = newRow.querySelector('.stock-concentration-value');
        const stockConcentrationUnit = newRow.querySelector('.stock-concentration-unit');
        const finalConcentrationValue = newRow.querySelector('.final-concentration-value');
        const finalConcentrationUnit = newRow.querySelector('.final-concentration-unit');

        // Fill values
        reagentName.value = reagent.name;
        stockConcentrationValue.value = reagent.stockConcentration.value;
        stockConcentrationUnit.value = reagent.stockConcentration.unit;
        finalConcentrationValue.value = reagent.finalConcentration.value;
        finalConcentrationUnit.value = reagent.finalConcentration.unit;

    });

    // Insert steps
    recipeToEdit.protocol.forEach((step) => {

        // Create new step
        newStep = addProtocolStep()

        // Get variables
        const stepInput = newStep.querySelector('.protocol-step-input')

        // Fill step
        stepInput.value = step

    })

}



// ------------- RECIPE NAME ------------------------------

// Function to check if the recipe name already exists
function recipeNameExists(recipeName) {
    return temp_recipes.some((recipe) => recipe.name === recipeName);
}


// Function to check validity of recipe name
function isRecipeNameValid() {
    const recipeNameInput = document.getElementById('recipeName');
    const recipeName = recipeNameInput.value.trim();
    const recipeNameError = document.getElementById('recipeNameError');

    // Return false if recipe name is empty or already exists
    if (recipeNameExists(recipeName)) {
        recipeNameError.textContent = 'A recipe with this name already exists';
        return false;
    }

    if (!recipeName) {
        recipeNameError.textContent = 'Recipe name cannot be empty';
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

    if (selectedApplication === 'NULL') {
        applicationNameError.textContent = 'Please select a valid application'
        return false;
    }

    // Return true if application choice is not "Other..."
    if (selectedApplication != 'Other...') {
        applicationNameError.textContent = '';
        return true;
    }

    // Check if application name input is valid
    if (applicationNameExists(applicationName)) {
        applicationNameError.textContent = 'An application with this name already exists.';
        return false;
    }

    if (!applicationName) {
        applicationNameError.textContent = 'Application name cannot be empty.';
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
    newRow.className = 'reagent-row';
    newRow.innerHTML = `
        <td class="reagent-name-td">
            <input type="text" required class="reagent-name-input" id = "reagent-name-${id_number}">
            <div class="reagent-name-error" style="color: red;"></div>
        </td>
        <td>
            <input type="number" step="0.0001" required class="concentration stock-concentration-value">
            <div class="stock-concentration-error" style="color: red;"></div>
        </td>
        <td>
            <select class="stock-concentration-unit" required></select>
            <div class="stock-concentration-unit-error" style="color: red;"></div>
        </td>
        <td>
            <input type="number" step="0.0001" required class="concentration final-concentration-value">
            <div class="final-concentration-error" style="color: red;"></div>
        </td>
        <td><select class="final-concentration-unit" required></select></td>
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

    return newRow
}


// Function to remove a reagent row
function removeReagentRow(button) {
    const row = button.parentNode.parentNode;
    const reagentsTable = row.parentNode;
    reagentsTable.removeChild(row);
}


// Function to check if name of all reagents are valid
function areReagentNamesValid() {
    const reagentNamesInputs = document.querySelectorAll('.reagent-name-input');
    const reagentNamesArray = Array.from(reagentNamesInputs).map((inputElement) => inputElement.value);
    const reagentErrorElement = document.getElementById('reagentsError1');

    // If empty, return
    if (reagentNamesInputs.length === 0) {
        reagentErrorElement.textContent = 'Please insert reagents';
        return false;
    } else {
        reagentErrorElement.textContent = '';
    }

    // Check for empty values
    const emptyValueIndices = reagentNamesArray.reduce((acc, name, index) => {
        if (name === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    emptyValueIndices.forEach((index) => {
        const errorElement = reagentNamesInputs[index].parentNode.querySelector('.reagent-name-error');
        errorElement.textContent = 'A reagent name cannot be empty';
    });

    // Check for duplicated names
    const duplicates = reagentNamesArray.reduce((acc, name, index) => {
        if (reagentNamesArray.indexOf(name) !== index) {
            acc.push(index);
        }
        return acc;
    }, []);

    duplicates.forEach((index) => {
        const errorElement = reagentNamesInputs[index].parentNode.querySelector('.reagent-name-error');
        errorElement.textContent = 'A reagent with this name already exists.';
    });

    if (emptyValueIndices.length > 0 || duplicates.length > 0) {
        return false;
    }

    // Reset error messages
    const reagentNamesErrors = document.querySelectorAll('.reagent-name-error');
    reagentNamesErrors.forEach((errorElement) => {
        errorElement.textContent = '';
    })
    return true;

}


// Function to check if all values for concentration are inserted and valid
function areConcentrationValuesValid() {
    let areValid = true;
    const finalVolume = 1; // set final volume to check if the solution is ok
    let testVolume = 0; // set test starting volume

    const reagentErrorElement = document.getElementById('reagentsError');

    // For each row, 
    const reagentRows = document.querySelectorAll('.reagent-row');

    reagentRows.forEach((row) => {
        const stockConcentrationInput = row.querySelector('.stock-concentration-value');
        const finalConcentrationInput = row.querySelector('.final-concentration-value');
        const stockConcentrationValue = parseFloat(stockConcentrationInput.value);
        const finalConcentrationValue = parseFloat(finalConcentrationInput.value);
        const stockConcentrationUnit = row.querySelector('.stock-concentration-unit').value;
        const finalConcentrationUnit = row.querySelector('.final-concentration-unit').value;
        const stockConcentrationErrorElement = row.querySelector('.stock-concentration-error');
        const finalConcentrationErrorElement = row.querySelector('.final-concentration-error');
        const stockConcentrationUnitErrorElement = row.querySelector('.stock-concentration-unit-error');
        

        // check if are valid values (> 0 and not empty). 
        if (stockConcentrationValue <= 0) {
            stockConcentrationErrorElement.textContent = 'Concentration values must be > 0';
            areValid = false;
        } else if (isNaN(stockConcentrationValue)) {
            stockConcentrationErrorElement.textContent = 'Concentration value cannot be empty';
            areValid = false;
        } else {
            stockConcentrationErrorElement.textContent = '';
        }

        if (finalConcentrationValue <= 0) {
            finalConcentrationErrorElement.textContent = 'Concentration values must be > 0';
            areValid = false;
        } else if (isNaN(finalConcentrationValue)) {
            finalConcentrationErrorElement.textContent = 'Concentration value cannot be empty';
            areValid = false;
        } else {
            finalConcentrationErrorElement.textContent = '';
        }

        // check if stock concentration unit is not ---
        if (stockConcentrationUnit === '---') {
            stockConcentrationUnitErrorElement.textContent = 'Please select the stock concentration unit';
            areValid = false;
            return
        } else {
            stockConcentrationUnitErrorElement.textContent = '';
        }

        // return if any of the previous condition is met, to avoid doing calculations on non-valid values
        if (stockConcentrationValue <= 0 || isNaN(stockConcentrationValue) || 
        finalConcentrationValue <= 0 || isNaN(finalConcentrationValue)) {
            return
        }

        // Check if final concentration is < stock concentration
        if (stockConcentrationUnit === 'g/mol') {
            return
        } else if (concentrationUnitsMol.hasOwnProperty(stockConcentrationUnit)) { // if M to M

            // Convert stockConcentrationValue to M
            stockM = stockConcentrationValue * concentrationUnitsMol[stockConcentrationUnit];

            // Convert finalConcentrationValue to M
            finalM = finalConcentrationValue * concentrationUnitsMol[finalConcentrationUnit];

            // Check if finalM > stockM
            if (finalM > stockM) {
                finalConcentrationErrorElement.textContent = 'Final concentration cannot be greater than stock';
                areValid = false;
            } else {
                finalConcentrationErrorElement.textContent = '';
            }

            // Calculate final volume
            testVolume += finalM * finalVolume / stockM; // in L

        } else if (stockConcentrationUnit === 'X') { // if X

            // Check if finalValue is greater than stockVale
            if (finalConcentrationValue >= stockConcentrationValue) {
                finalConcentrationErrorElement.textContent = 'Final concentration cannot be greater than/equal to stock';
                areValid = false;
            } else {
                finalConcentrationErrorElement.textContent = '';
            }

            testVolume += finalConcentrationValue * finalVolume / stockConcentrationValue;

        } else { // if g/l to g/l
            // Split units
            const stockUnits = stockConcentrationUnit.split('/');
            const finalUnits = finalConcentrationUnit.split('/');

            // Convert stock and final to g/L
            const stockGL = stockConcentrationValue / (1 / concentrationUnitsGrams[stockUnits[0]]) / concentrationUnitsL[stockUnits[1]];
            const finalGL = finalConcentrationValue / (1 / concentrationUnitsGrams[finalUnits[0]]) / concentrationUnitsL[finalUnits[1]];

            // Check if finalValue is greater than stockVale
            if (finalGL >= stockGL) {
                finalConcentrationErrorElement.textContent = 'Final concentration cannot be greater than/equal to stock';
                areValid = false;
            } else {
                finalConcentrationErrorElement.textContent = '';
            }

            // Calculate quantity to take
            testVolume += finalGL * finalVolume / stockGL
            
        }

    })

    // check if testVolume is > finalVolume
    if (testVolume > finalVolume) {
        reagentErrorElement.textContent = 'The sum of all the reagents is higher than the possible final volume'
        areValid = false;
    } else {
        reagentErrorElement.textContent = ''
    }
    return areValid;
}



// ------------- PROTOCOL STEP ------------------------------

// Function to add a new protocol step
function addProtocolStep() {
    const protocolStepsList = document.getElementById('protocolStepsList');

    const newStep = document.createElement('li');
    newStep.className = 'protocol-step-li';
    newStep.innerHTML = `
    <input class="protocol-step-input" type="text" required>
    <td><button type="button" onclick="removeStep(this)">Remove</button></td>
    <div class="protocol-step-error" style="color: red;"></div>
    `;
    protocolStepsList.appendChild(newStep);

    return newStep
}


// Function to remove a protol step
function removeStep(button) {
    const step = button.parentNode;
    const steplist = step.parentNode;
    steplist.removeChild(step);
}


function areProtocolStepsValid() {
    let areValid = true;
    const protocolSteps = document.querySelectorAll('.protocol-step-li');
    const protocoltErrorElement = document.getElementById('protocolError');

    // If empty, return
    if (protocolSteps.length === 0) {
        protocoltErrorElement.textContent = 'Please insert steps.';
        return false;
    } else {
        protocoltErrorElement.textContent = '';
    }

    protocolSteps.forEach((step) => {
        const stepInput = step.querySelector('.protocol-step-input');
        const stepErrorElement = step.querySelector('.protocol-step-error');

        if (stepInput.value === '') {
            stepErrorElement.textContent = 'Please fill the step input field or delete it.';
            areValid = false;
        } else {
            stepErrorElement.textContent = '';
        }
    });

    return areValid
}



// ------------- SAVE ------------------------------

// function that returns whether all checks are valid
function checkAllValid() {
    // Call each validation function and store the results in separate variables
    const isRecipeNameValidResult = isRecipeNameValid();
    const isApplicationNameValidResult = isApplicationNameValid();
    const areReagentNamesValidResult = areReagentNamesValid();
    const areConcentrationValuesValidResult = areConcentrationValuesValid();
    const areProtocolStepsValidResult = areProtocolStepsValid(); 

    // Combine the results using logical AND (&&) to ensure all of them are evaluated
    return (
        isRecipeNameValidResult &&
        isApplicationNameValidResult &&
        areReagentNamesValidResult &&
        areConcentrationValuesValidResult &&
        areProtocolStepsValidResult 
    );
}


// Function to handle form submission and save the new recipe
function saveRecipe(event) {
    event.preventDefault();

    // Stop if not all checks are valid
    if (!checkAllValid()) {return}

    // Get name and application field
    const recipeName = document.getElementById('recipeName').value;
    let applicationField = document.getElementById('applicationField').value;

    // Check if Application field is "Other..." and store real value 
    if (applicationField === "Other...") {
        applicationField = document.getElementById('newApplicationInput').value;
    }

    // Get the reagents data from the table
    const reagentsTable = document.getElementById('reagentsTable');
    const reagents = [];
    for (let i = 1; i < reagentsTable.rows.length; i++) {
        const row = reagentsTable.rows[i];
        const name = row.querySelector('.reagent-name-input').value;
        const stockConcentration = parseFloat(row.querySelector('.stock-concentration-value').value);
        const stockUnit = row.querySelector('.stock-concentration-unit').value;
        const finalConcentration = parseFloat(row.querySelector('.final-concentration-value').value);
        const finalUnit = row.querySelector('.final-concentration-value').value;

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

    // Get current date
    const date = new Date();
    let currentDay= String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth()+1).padStart(2,"0");
    let currentYear = date.getFullYear();
    let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

    // Create the new recipe object
    const newRecipe = {
        name: recipeName,
        application: applicationField,
        reagents: reagents,
        protocol: protocolSteps,
        date_added: currentDate,
        date_modified: currentDate,
    };

    // Add the new recipe to the recipes array
    temp_recipes.push(newRecipe);

    // Save the updated recipes to local storage
    localStorage.setItem('recipes', JSON.stringify(temp_recipes));

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
});

// Add form submission event listener
document.getElementById('addRecipeForm').addEventListener('submit', saveRecipe);



