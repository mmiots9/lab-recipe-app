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

function calculateConcentrationConversionFactor(stockConcentration) {
    if (stockConcentration.endsWith('X')) {
        const factor = parseFloat(stockConcentration);
        return 1 / factor;
    }
    return 1;
}

function populateRecipeDetailsPage() {
    const recipeDetailsDiv = document.getElementById('recipeDetails');
    recipeDetailsDiv.innerHTML = '';

    const selectedRecipe = JSON.parse(localStorage.getItem('selectedRecipe'));

    if (!selectedRecipe) {
        recipeDetailsDiv.innerHTML = 'No recipe selected.';
        return;
    }

    recipeDetailsDiv.innerHTML = `<h3>${selectedRecipe.name}</h3>`;
    recipeDetailsDiv.innerHTML += `<p>Application: ${selectedRecipe.application}</p>`;

    const protocolSteps = selectedRecipe.protocol;
    if (protocolSteps && protocolSteps.length > 0) {
        recipeDetailsDiv.innerHTML += '<h4>Protocol:</h4>';
        const protocolList = document.createElement('ol');
        protocolSteps.forEach((step) => {
            const stepItem = document.createElement('li');
            stepItem.textContent = step;
            protocolList.appendChild(stepItem);
        });
        recipeDetailsDiv.appendChild(protocolList);
    }

    if (selectedRecipe.reagents && selectedRecipe.reagents.length > 0) {
        recipeDetailsDiv.innerHTML += '<h4>Reagents:</h4>';
        selectedRecipe.reagents.forEach((reagent) => {
            const reagentDiv = document.createElement('div');
            reagentDiv.innerHTML = `
        <strong>${reagent.name}</strong><br>
        Stock Concentration: <span>${reagent.stockConcentration.value}</span> ${reagent.stockConcentration.unit}<br>
        Final Concentration: <span>${reagent.finalConcentration.value}</span> ${reagent.finalConcentration.unit}<br>
        Quantity to Take: <span id="${reagent.name}-quantity"></span>
      `;
            recipeDetailsDiv.appendChild(reagentDiv);
        });
    }
}

function calculateReagentQuantities() {
    const finalVolume = parseFloat(document.getElementById('finalVolume').value) / 1000; // Convert mL to L
    let unitToTake = '';

    const selectedRecipe = JSON.parse(localStorage.getItem('selectedRecipe'));
    selectedRecipe.reagents.forEach((reagent) => {
        let quantityToTake;

        const stockConcentrationValue = parseFloat(reagent.stockConcentration.value);
        const stockConcentrationUnit = reagent.stockConcentration.unit;
        const finalConcentrationValue = parseFloat(reagent.finalConcentration.value);
        const finalConcentrationUnit = reagent.finalConcentration.unit;


        if (stockConcentrationUnit === 'g/mol') { // if g/mol to M
            // Calculate quantity for powder reagent
            const molecularWeight = stockConcentrationValue;

            // Calculate total mol to use
            const molToUse = finalConcentrationValue * finalVolume / concentrationUnitsMol[finalConcentrationUnit];

            // Calculate total mg to use
            quantityToTake = (molecularWeight * molToUse * 1000); // In mg
            unitToTake = 'mg'

        } else if (concentrationUnitsMol.hasOwnProperty(stockConcentrationUnit)) { // if M to M
            // Convert stockConcentrationValue to M
            stockM = stockConcentrationValue / concentrationUnitsMol[stockConcentrationUnit];

            // Convert finalConcentrationValue to M
            finalM = finalConcentrationValue / concentrationUnitsMol[finalConcentrationUnit];

            // Calculate final volume
            quantityToTake = finalM * finalVolume / stockM; // in L
            unitToTake = 'L'

            // Convert to mL if < 1
            if (quantityToTake < 1) {
                quantityToTake = quantityToTake * 1000;
                unitToTake = 'mL';

                // Convert to uL if < 1
                if (quantityToTake < 1) {
                    quantityToTake = quantityToTake * 1000;
                    unitToTake = 'uL';
                }
            }

        } else if (stockConcentrationUnit === 'X') { // if X
            quantityToTake = finalConcentrationValue * finalVolume / stockConcentrationValue;
            unitToTake = 'L'

            // Convert to mL if < 1
            if (quantityToTake < 1) {
                quantityToTake = quantityToTake * 1000;
                unitToTake = 'mL';

                // Convert to uL if < 1
                if (quantityToTake < 1) {
                    quantityToTake = quantityToTake * 1000;
                    unitToTake = 'uL';
                }
            }

        } else { // if g/l to g/l
            // Split units
            const stockUnits = stockConcentrationUnit.split('/');
            const finalUnits = finalConcentrationUnit.split('/');

            // Convert stock and final to g/l
            const stockGL = stockConcentrationValue * concentrationUnitsGrams[stockUnits[0]] / concentrationUnitsL[stockUnits[1]];
            const finalGL = finalConcentrationValue * concentrationUnitsGrams[finalUnits[0]] / concentrationUnitsL[finalUnits[1]];

            // Calculate quantity to take
            quantityToTake = finalGL * finalVolume / stockGL
            unitToTake = 'L'

            // Convert to mL if < 1
            if (quantityToTake < 1) {
                quantityToTake = quantityToTake * 1000;
                unitToTake = 'mL';

                // Convert to uL if < 1
                if (quantityToTake < 1) {
                    quantityToTake = quantityToTake * 1000;
                    unitToTake = 'uL';
                }
            }

        }

        // Update the reagent quantity to take with the correct unit
        const quantityUnit = stockConcentrationUnit === 'g/mol' ? 'mg' : 'mL';
        document.getElementById(`${reagent.name}-quantity`).textContent = `${quantityToTake.toFixed(2)} ${unitToTake}`;
    });
}


document.getElementById('finalVolume').addEventListener('input', calculateReagentQuantities);

window.addEventListener('load', populateRecipeDetailsPage);
