import {httpService} from './httpService.ts';
import {ParsedPokemon} from '../../../shared/ParsedPokemon';
import {FilterValues} from '../../../shared/FilterValues';

const ENDPOINT = 'pokemon';

function getPokemons(filterValues:FilterValues):Promise<ParsedPokemon[]> {
	return httpService.get(ENDPOINT, filterValues);
}

function setPokemonFavorite({pokeId, isFavorite}:Partial<ParsedPokemon>) {
	return httpService.patch(ENDPOINT, {pokeId, isFavorite})
}

export const pokemonService = {
	getPokemons,
	setPokemonFavorite
};