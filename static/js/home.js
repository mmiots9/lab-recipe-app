let recipes = [];
let filteredRecipes = [];
let shownRecipes = []; 


// ------------- LOAD ------------------------------

// Load and display recipes when the page loads
window.addEventListener('load', () => {

    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        recipes = JSON.parse(storedRecipes);
        recipes = recipes.sort(compareRecipeNames);
        filteredRecipes = recipes;
        shownRecipes = filteredRecipes;
        displayRecipes(filteredRecipes);
        showApplications();
    }
});


// Function to compare recipes based on their names (case-insensitive)
function compareRecipeNames(recipeA, recipeB) {
    const nameA = recipeA.name.toLowerCase();
    const nameB = recipeB.name.toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
}


// function to diplay recipes as list
function displayRecipes(recipesToShow) {
    const recipesTable = document.getElementById('recipes-table').getElementsByTagName('tbody')[0];
    recipesTable.innerHTML = '';

    // Update shown recipes
    shownRecipes = recipesToShow

    recipesToShow.forEach((recipe, index) => {
        const newRow = recipesTable.insertRow();
        newRow.className = 'recipe-row';
        newRow.innerHTML = `
        <td class="recipe-name">
            ${recipe.name}
        </td>
        <td class="recipe-application">
            ${recipe.application}
        </td>
        <td class="recipe-date-added">
            ${recipe.date_added}
        </td>
        <td class="recipe-date-modified">
            ${recipe.date_modified}
        </td>
        <td class="recipe-actions">
            <button class="recipe-btn" onclick="selectRecipe(${index})">Calc</button>
        </td>
        `
        recipesTable.appendChild(newRow);
    });

    // TODO: if empty, show message

}



// ------------- SELECT ------------------------------

// function to store selected recipe in local storage and move to recipe.html
function selectRecipe(index) {
    localStorage.setItem('selectedRecipe', JSON.stringify(shownRecipes[index]));
    window.location.href = 'recipe.html';
}



// ------------- SEARCH ------------------------------

// function to filter solutions based on matching
function searchSolutions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const matchingRecipes = (filteredRecipes).filter((recipe) =>
        recipe.name.toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    displayRecipes(matchingRecipes);
}


// Add an event listener to the search bar input
document.getElementById('searchInput').addEventListener('input', () => {
    searchSolutions(); // Pass a dummy element to filterByApplication
});



// ------------- FILTER ON APPLICATION ------------------------------

// function to show possible application values
function showApplications() {
    // Update the application filter checkboxes
    const applicationFilter = document.getElementById('application-filter-ul');

    applicationFilter.innerHTML = '';
    const applications = Array.from(new Set(recipes.map((recipe) => recipe.application))).sort();

    // Add an "All" checkbox
    const allCheckboxLi = document.createElement('li');
    const allCheckboxLabel = document.createElement('label');
    allCheckboxLabel.className = 'application-label';
    allCheckboxLabel.innerHTML = `<input type="checkbox" name="applications" value="" onclick="showAllApplication()" checked> All`;
    allCheckboxLi.appendChild(allCheckboxLabel);
    applicationFilter.appendChild(allCheckboxLi);
    
    applications.forEach((application) => {
        const checkboxLi = document.createElement('li');
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'application-label';
        checkboxLabel.innerHTML = `<input type="checkbox" name="applications" value="${application}" onclick="filterByApplication(this)"> ${application}`;

        checkboxLi.appendChild(checkboxLabel);
        applicationFilter.appendChild(checkboxLi);
    });

}


// function to filter recipes based on application
function filterByApplication() {
    const checkboxes = document.querySelectorAll('input[name="applications"]');
    const allCheckbox = document.querySelector('input[name="applications"][value=""]');

    const selectedApplications = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked && checkbox !== allCheckbox)
        .map((checkbox) => checkbox.value);

    if (selectedApplications.length > 0) {
        filteredRecipes = recipes.filter((recipe) => selectedApplications.includes(recipe.application));
        allCheckbox.checked = false; // Uncheck the "All" checkbox if specific applications are selected
        searchSolutions()
    } else {
        showAllApplication()
    }
}


// function to show all application
function showAllApplication() {
    const checkboxes = document.querySelectorAll('input[name="applications"]');
    const allCheckbox = document.querySelector('input[name="applications"][value=""]');
    
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    allCheckbox.checked = true; // Check the "All" checkbox if no specific applications are selected
    filteredRecipes = recipes; // Reset to all recipes when no filtering is applied

    searchSolutions()

}
