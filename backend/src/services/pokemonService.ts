import * as fs from 'node:fs';
import axios from 'axios';
import {NamedAPIResource, Pokemon} from 'pokeapi-types';
import {ParsedPokemon} from '../../../shared/ParsedPokemon';

const POKEMON_DATA_PATH = 'src/data/pokemons.json'
const POKEMONS_API = 'https://pokeapi.co/api/v2/pokemon/?limit=3';

async function queryPokemons():Promise<string> {
	const pokemons = fs.readFileSync(POKEMON_DATA_PATH);
	console.log(pokemons);
	await populatePokemons();
	return 'HI!'
}

async function populatePokemons() {
	const basePokemons:NamedAPIResource[] = await axios.get(POKEMONS_API).then(res => res.data.results);
	const pokemonsPromises = basePokemons.map(({url}) => {
		return axios.get(url);
	})
	const pokemons:Pokemon[] = await Promise.all(pokemonsPromises).then(prms => prms.map(results => results.data))
	const parsedPokemons:ParsedPokemon[] = pokemons.map(parsePokemon);

	console.log(parsedPokemons);
	writePokemonsToJson(parsedPokemons);
}

function parsePokemon(pokemon:Pokemon):ParsedPokemon {
	return {
		name: pokemon.name,
		abilities: pokemon.abilities.map(abilityData => ({name: abilityData.ability.name, isHidden:abilityData.is_hidden})),
		sprites: {
			backDefault: pokemon.sprites.back_default,
			frontDefault: pokemon.sprites.front_default
		},
		evolutionDetails:[],
		pokeId: pokemon.id,
		isFavorite: false,
	}
}

function fillPokemonEvolutionLine(pokemon:ParsedPokemon) {

}

function writePokemonsToJson(pokemons:ParsedPokemon[]) {
	const pokemonsString = JSON.stringify(pokemons);
	fs.writeFileSync(POKEMON_DATA_PATH, pokemonsString);
}

export const pokemonService = {
	queryPokemons
}