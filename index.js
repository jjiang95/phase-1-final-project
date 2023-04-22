document.addEventListener("DOMContentLoaded", () => {
    // https://www.thecocktaildb.com/api/json/v1/1/search.php?s=
    let form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let searchText = e.target.children[0].value;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`)
        .then(resp => resp.json())
        .then(json => {
            json.drinks.forEach(drink => console.log(drink))
        })
    })
})