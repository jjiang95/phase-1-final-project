document.addEventListener("DOMContentLoaded", () => {
    const form1 = document.querySelector("#by-name");
    //When form1 is submitted, a fetch request is made to the API 
    //to retrieve elements from the database depending on search-text input
    form1.addEventListener("submit", (e) => {
        e.preventDefault();
        let searchText = e.target.children[0].value;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`)
        .then(resp => resp.json())
        .then(json => {
            json.drinks.forEach(drink => createCard(drink)) //Create a formatted card for each result fetched
        })
        form1.reset();
    })
    const form2 = document.querySelector("#by-ingredient");
    //Same mechanic as form1, but using a different search feature of the API
    form2.addEventListener("submit", (e) => {
        e.preventDefault();
        let searchText = e.target.children[0].value;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchText}`)
        .then(resp => resp.json())
        //The 'lookup by ingredient' feature in the API only returns a name, a picture, and an ID
        //and doesn't return ingredients or instructions
        //So I had to chain on another fetch request to look up the cocktail by that ID via the 'lookup by ID' feature
        //and retrieve the data I need
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
        document.querySelector("#gallery").innerHTML = ``;
    }) 
    //Generate a random cocktail from the API
    const button2 = document.querySelector("#random");
    button2.addEventListener("click", (e) => {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
        .then(resp => resp.json())
        .then(json => {
            json.drinks.forEach(drink => createCard(drink))
        });    
    })
})

function createCard(drink) {
    const card = document.createElement("div")
    card.classList.add("card");
    card.style.backgroundImage = `url(${drink.strDrinkThumb})`
    card.innerHTML = `
        <div class="front">
            <h1>${drink.strDrink}</h1>
        </div>
        <div class="back">
            <p>${extractIngredientsIntoString(drink)}</p>
            <br/>
            <p>${drink.strInstructions}</p>
        </div>
    `
    // let name = document.createElement("h1");
    // name.textContent = drink.strDrink;
    // let instructions = document.createElement("p");
    // instructions.textContent = drink.strInstructions;
    
    //Prepend rather than append, so that newer results always show first
    document.querySelector("#gallery").prepend(card)
    //Add content for front and back of card
    // let cardFront = document.createElement("div");
    // cardFront.classList.add("front");
    // cardFront.appendChild(name);
    // let cardBack = document.createElement("div")
    // cardBack.classList.add("back");
    // cardBack.appendChild(instructions)
    // card.append(cardFront, cardBack);
    
    //Add event listener to flip card when clicked
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
        ingredientsString += `${finalObject[key]} ${key}, `
    };
    //Remove comma and space at the end of the ingredients string
    return ingredientsString.substring(0, ingredientsString.length - 2)

}