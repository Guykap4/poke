import {pokemonService} from '../services/pokemonService';
import {NextFunction, Request, Response} from 'express';
import {ParsedPokemon} from '../../../shared/ParsedPokemon';
import {FilterValues} from '../../../shared/FilterValues';

/**
 * returning all pokemons, depends on filter
 * @param req
 * @param res
 * @param next
 */
async function getPokemons(req:Request, res:Response, next:NextFunction) {
	try {
		const filterValues:FilterValues = {
			isFavorite: req.query.isFavorite === 'true',
			name: `${req.query.name}` || '',
		};
		const pokemons = await pokemonService.queryPokemons(filterValues);
		res.send(pokemons);
	} catch (err) {
		next(err);
	}
}

/**
 * adding or removing favorite from a pokemon
 * @param req
 * @param res
 * @param next
 */
async function patchPokemon(req:Request, res:Response, next:NextFunction) {
	try {
		const {isFavorite, pokeId} = req.body as unknown as Partial<ParsedPokemon>;
		if (typeof isFavorite === 'undefined' || !pokeId) {
			res.send();
			return;
		}
		await pokemonService.setPokemonFavorite(isFavorite, pokeId);
		res.send();
	} catch (err) {
		next(err);
	}
}

export {
	getPokemons,
	patchPokemon,
};