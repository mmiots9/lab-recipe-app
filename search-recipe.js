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
    const recipesUl = document.getElementById('recipes-ul');
    recipesUl.innerHTML = '';

    // Update shown recipes
    shownRecipes = recipesToShow

    recipesToShow.forEach((recipe, index) => {
        const recipeLi = document.createElement('li');
        recipeLi.innerHTML = `
        <li>
            <button onclick="selectRecipe(${index})">${recipe.name}</button>
        </li>`;
        recipesUl.appendChild(recipeLi);
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
    const applicationFilter = document.getElementById('applicationFilter');
    applicationFilter.innerHTML = '';
    const applications = Array.from(new Set(recipes.map((recipe) => recipe.application)));
    
    applications.forEach((application) => {
        const checkboxLabel = document.createElement('label');
        checkboxLabel.innerHTML = `<input type="checkbox" name="applications" value="${application}" onclick="filterByApplication(this)"> ${application}`;
        applicationFilter.appendChild(checkboxLabel);
    });

    // Add an "All" checkbox
    const allCheckboxLabel = document.createElement('label');
    allCheckboxLabel.innerHTML = `<input type="checkbox" name="applications" value="" onclick="showAllApplication()" checked> All`;
    applicationFilter.appendChild(allCheckboxLabel);
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
