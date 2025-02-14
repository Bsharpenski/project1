let pokemons = [];
const poke_container = document.getElementById('poke_container');
const url = "https://pokeapi.co/api/v2/pokemon";
const pokemons_number = 151;
const search = document.getElementById("search");
const  form = document.getElementById("form");

const fetchPokemons = async () => {
    for (let i=1; i<= pokemons_number; i++){
        await getAllPokemon(i);
    }
    pokemons.forEach((pokemon) => createPokemonCard(pokemon));
}