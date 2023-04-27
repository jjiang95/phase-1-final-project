document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    //When form is submitted, a fetch request is made to the API 
    //to retrieve elements from the database depending on search-text input
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let searchText = e.target.children[0].value;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`)
        .then(resp => resp.json())
        .then(json => {
            json.drinks.forEach(drink => createCard(drink)) //Create a formatted card for each result fetched
        })
        // form.reset();
    })
    const button1 = document.querySelector("#clear-gallery");
    button1.addEventListener("click", () => {
        document.querySelector("#gallery").innerHTML = ``;
    }) 
    
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
