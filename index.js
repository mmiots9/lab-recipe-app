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

        // Save the loaded recipes to local storage
        localStorage.setItem('recipes', JSON.stringify(recipes));
        console.log('saved');

        // Redirect to home.html
        window.open('home.html', '_self');
    };

    reader.readAsText(file);
    console.log('ok');
}

