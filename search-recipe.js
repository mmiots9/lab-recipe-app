let recipes = [];
let filteredRecipes = recipes.slice(); // Initialize with all recipes initially

function resetRecipes() {
    recipes = [];
}

function loadRecipes(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const contents = e.target.result;
        recipes = JSON.parse(contents);
        filteredRecipes = recipes.slice();
        displayRecipes();
        // Save the loaded recipes to local storage
        localStorage.setItem('recipes', JSON.stringify(recipes));
    };

    reader.readAsText(file);
}

function searchSolutions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    console.log('searchTerm');
    console.log(searchTerm);
    console.log('filteredRecipes');
    console.log(filteredRecipes);
    const matchingRecipes = (filteredRecipes || []).filter((recipe) =>
        recipe.name.toLowerCase().includes((searchTerm || '').toLowerCase())
    );
    console.log('matchingRecipes');
    console.log(matchingRecipes);
    displayRecipes(matchingRecipes);
}

function displayRecipes(recipesToShow) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';

    const recipesToDisplay = recipesToShow || recipes; // If recipesToShow is not provided, display all recipes

    recipesToDisplay.forEach((recipe, index) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.innerHTML = `<button onclick="selectRecipe(${index})">${recipe.name}</button>`;
        recipesDiv.appendChild(recipeDiv);
    });

}

function loadApplications() {
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
    allCheckboxLabel.innerHTML = `<input type="checkbox" name="applications" value="" onclick="filterByApplication(this)" checked> All`;
    applicationFilter.appendChild(allCheckboxLabel);
}

function filterByApplication(el) {
    const checkboxes = document.querySelectorAll('input[name="applications"]');
    const allCheckbox = document.querySelector('input[name="applications"][value=""]');

    const selectedApplications = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked && checkbox !== allCheckbox)
        .map((checkbox) => checkbox.value);

    if (selectedApplications.length > 0 && el.value !== "") {
        filteredRecipes = recipes.filter((recipe) => selectedApplications.includes(recipe.application));
        allCheckbox.checked = false; // Uncheck the "All" checkbox if specific applications are selected
    } else {
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
        allCheckbox.checked = true; // Check the "All" checkbox if no specific applications are selected
        filteredRecipes = recipes.slice(); // Reset to all recipes when no filtering is applied
    }

    displayRecipes(filteredRecipes)
}

function selectRecipe(index) {
    localStorage.setItem('selectedRecipe', JSON.stringify(recipes[index]));
    window.location.href = 'recipe.html';
}

// Add an event listener to the search bar input
document.getElementById('searchInput').addEventListener('input', () => {
    searchSolutions(); // Pass a dummy element to filterByApplication
});

//document.getElementById('loadRecipesButton').addEventListener('change', loadRecipes);

// Load and display recipes when the page loads
window.addEventListener('load', () => {

    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        recipes = JSON.parse(storedRecipes);
        loadApplications();
    }
});
