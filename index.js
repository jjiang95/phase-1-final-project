

document.addEventListener("DOMContentLoaded", () => {
    let form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let searchText = e.target.children[0].value;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`)
        .then(resp => resp.json())
        .then(json => {
            json.drinks.forEach(drink => {
                let name = document.createElement("h2");
                name.textContent = drink.strDrink;
                document.querySelector("#gallery").appendChild(name)
            })
        })
        form.reset();
    })
})

function createCard() {
    
}