document.addEventListener("DOMContentLoaded", () => {
    const form1 = document.querySelector("#by-name");
    form1.addEventListener("submit", (e) => {
        e.preventDefault();
        let searchText = e.target.children[0].value;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`)
        .then(resp => resp.json())
        .then(json => {
            json.drinks.forEach(drink => createCard(drink));
        })
        form1.reset();
    })

    const form2 = document.querySelector("#by-ingredient");
    form2.addEventListener("submit", (e) => {
        e.preventDefault();
        let searchText = e.target.children[0].value;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchText}`)
        .then(resp => resp.json())
        //The 'lookup by ingredient' feature in the API only returns a name, a picture, and an ID
        //and doesn't return ingredients or instructions
        //So another fetch request is chained on to look up the cocktail by its ID via the 'lookup by ID' feature
        //to retrieve the data needed
        .then(json => {
            json.drinks.forEach(drink => {
                fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`)
                .then(resp => resp.json())
                .then(json => json.drinks.forEach(drink => createCard(drink)))
            })
        })
        form2.reset();
    })

    //Clear the DOM of all search results
    const button1 = document.querySelector("#clear-gallery");
    button1.addEventListener("click", () => {
        const gallery = document.querySelector("#gallery");
        while (gallery.firstChild) {
            gallery.removeChild(gallery.lastChild);
        } 
    }) 

    //Generate a random cocktail from the API
    const button2 = document.querySelector("#random");
    button2.addEventListener("click", () => {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
        .then(resp => resp.json())
        .then(json => {
            json.drinks.forEach(drink => createCard(drink))
        });    
    })
})

function createCard(drink) {
    const card = document.createElement("div")    
    const cardFront = document.createElement("div");    
    const cardBack = document.createElement("div")
    
    card.classList.add("card");    
    card.style.backgroundImage = `url(${drink.strDrinkThumb})`
    cardFront.classList.add("front");    
    cardBack.classList.add("back");
    
    const name = document.createElement("h1");
    name.textContent = drink.strDrink;
    const instructions = document.createElement("p");
    instructions.textContent = drink.strInstructions;
    const measurements = document.createElement("p");
    measurements.textContent = extractIngredientsIntoString(drink);

    card.append(cardFront, cardBack);
    cardFront.appendChild(name)
    cardBack.appendChild(measurements);
    cardBack.appendChild(instructions);
    document.querySelector("#gallery").prepend(card)
    
    card.addEventListener("click", () => {
        card.classList.toggle("flipCard");
    })
}

function extractIngredientsIntoString(drink) {
    //The ingredient and measurement values are always at these indices in the drink object
    //But their number varies for each recipe, so the empty values must be filtered out
    const ingredients = Object.values(drink).splice(17, 15).filter(x => x !== null || "");
    const measurements = Object.values(drink).splice(32, 15).filter(x => x !== null || "");
    const finalObject = {}
    let ingredientsString = "";
    //Fill the finalObject with keys (the ingredients) and their corresponding values (measurements)
    for (let i=0; i < ingredients.length;i++) {
        finalObject[`${ingredients[i]}`] = `${measurements[i]}`;
    }

    for (const key in finalObject) {
        //If there is no measurement available for an ingredient, the key's value is emptied so that it doesn't display
        if (finalObject[key] === "undefined") {
            finalObject[key] = "";
        }
        ingredientsString += `${finalObject[key]} ${key}, `;
    }

    //Remove comma and space at the end of the ingredients string
    return ingredientsString.substring(0, ingredientsString.length - 2)

}