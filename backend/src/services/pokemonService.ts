import * as fs from 'node:fs';
import {ParsedPokemon} from '../../../shared/ParsedPokemon';
import {FilterValues} from '../../../shared/FilterValues';
import {externalPokemonService} from './externalPokemonService';

const POKEMON_DATA_PATH = 'src/data/pokemons.json'

/** basic query with filter for pokemons, including repopulating in case we have none
 * @param filterValues
 */

async function queryPokemons(filterValues?:FilterValues):Promise<ParsedPokemon[]> {
	let pokemons:ParsedPokemon[] = JSON.parse(fs.readFileSync(POKEMON_DATA_PATH, {encoding: 'utf8', flag: 'r'}));
	if (!pokemons || !pokemons.length) {
		pokemons = await externalPokemonService.populatePokemons();
		writePokemonsToJson(pokemons);
	}
	if (filterValues) {
		pokemons = filterPokemons(pokemons, filterValues);
	}
	return pokemons;
}

async function setPokemonFavorite(isFavorite:boolean, pokeId:number) {
	const pokemons = await queryPokemons();
	const patchedPokemons = pokemons.map(pokemon => {
		return pokemon.pokeId === pokeId ? {...pokemon, isFavorite} : pokemon;
	})
	writePokemonsToJson(patchedPokemons);
	return;
}

function filterPokemons(pokemons:ParsedPokemon[],{isFavorite,name}:FilterValues):ParsedPokemon[] {
	return pokemons.filter(poke => {
		if (isFavorite && !poke.isFavorite) return false;
		if (name && !poke.name.includes(name)) return false;
		return true;
	})
}

function writePokemonsToJson(pokemons:ParsedPokemon[]) {
	const pokemonsString = JSON.stringify(pokemons);
	fs.writeFileSync(POKEMON_DATA_PATH, pokemonsString);
}

export const pokemonService = {
	queryPokemons,
	setPokemonFavorite
}