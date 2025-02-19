let pokemons = [];
const poke_container = document.getElementById('poke_container');
const url = "https://pokeapi.co/api/v2/pokemon";
const pokemons_number = 800;
const search = document.getElementById("search");
const  form = document.getElementById("form");

const fetchPokemons = async () => {
    for (let i=1; i<= pokemons_number; i++){
        await getAllPokemon(i);
    }
    pokemons.forEach((pokemon) => createPokemonCard(pokemon));
};


const removePokemon = () => {
    const pokemonEls = document.getElementsByClassName('pokemon');
    let removablePokemons = [];
    for (let i = 0; i < pokemonEls.length; i++ ){
        const pokemonEl = pokemonEls[i];
        removablePokemons = [...removablePokemons, pokemonEl];
    }
    removablePokemons.forEach((remPoke) => remPoke.remove());
};


const getPokemon = async (id) => {
    const searchPokemons = pokemons.filter((poke) => poke.name.toLowerCase() === id.toLowerCase());
    removePokemon();
    searchPokemons.forEach((pokemon) => createPokemonCard(pokemon));
};


const getAllPokemon = async (id) => {
    const res = await fetch(`${url}/${id}`);
    const pokemon = await res.json();
    pokemons = [...pokemons,pokemon];
};
fetchPokemons();

function createPokemonCard(pokemon) {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');
    const poke_types = pokemon.types.map((el) => el.type.name).slice(0, 1);
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const poke_stat = pokemon.stats.map((el) => el.stat.name)
    const stats = poke_stat.slice(0, 3);
    const base_value = pokemon.stats.map((el) => el.base_stat);
    const base_stat = base_value.slice(0, 3);

    const stat = stats.map((stat) => {
        return `<li class="names">${stat}</li>`;
    }).join("");

    const base = base_stat.map((base) => {
        return `<li class="base">${base}</li>`;
    }).join("");

    const pokeInnerHTML = `<div class="img-container">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${name}"/>
    </div>
    <div class="info">
    <span class="number">#${pokemon.id.toString().padStart(3, "0")}</span>
    <h3 class="name">${name}</h3>
    <small class="type"><span>${poke_types}</span></small>
    </div>
    <div class="stats">
    <h2>Stats</h2>
    <div class="flex">
    <ul>${stat}</ul>
    <ul>${base}</ul>
    </div>
    </div>
    <button class="compare-btn">Compare</button>`;

    pokemonEl.innerHTML = pokeInnerHTML;
    poke_container.appendChild(pokemonEl);   

    const compareBtn = pokemonEl.querySelector('.compare-btn');
    compareBtn.addEventListener('click', () => handleCompare(pokemon));
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim(); 
    if (searchTerm) {
        getPokemon(searchTerm);
        search.value = "";  
    } else {
        pokemons = [];
        removePokemon();
        fetchPokemons();
    }
});

let selectedPokemon = [];
const handleCompare = (pokemon) => {
    const isSelected = selectedPokemon.find((p) => p.id === pokemon.id);
        if (isSelected) {
            selectedPokemon = selectedPokemon.filter((p) => p.id !== pokemon.id);
        } else {
        selectedPokemon.push(pokemon);
    }
    updateComparison();
};

const updateComparison = () => {
    const comparisonContainer = document.getElementById('comparison-container');
     comparisonContainer.innerHTML = '';
        if (selectedPokemon.length === 0) {
        comparisonContainer.innerHTML = '<p>No Pokémon selected for comparison.</p>';
        return;
        }

    let comparisonHTML = `<table><tr><th>Stat Name</th>`;
    selectedPokemon.forEach((pokemon) => {
        comparisonHTML += `<th>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</th>`;
    });
    comparisonHTML += `</tr>`;

    const statsNames = ['HP', 'Attack', 'Defense'];
    statsNames.forEach((statName, index) => {
        comparisonHTML += `<tr><td>${statName}</td>`;
        
        selectedPokemon.forEach((pokemon) => {
            comparisonHTML += `<td>${pokemon.stats[index].base_stat}</td>`;
        });
        comparisonHTML += `</tr>`;
    });

    comparisonHTML += `</table>`;
    comparisonContainer.innerHTML = comparisonHTML;
};