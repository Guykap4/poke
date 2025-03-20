import {pokemonService} from '../services/pokemonService';
import {Request, Response} from 'express';
import {ParsedPokemon} from '../../../shared/ParsedPokemon';
import {FilterValues} from '../../../shared/FilterValues';

async function getPokemons(req: Request, res: Response) {
	try {
		const filterValues:FilterValues = {
			isFavorite: req.query.isFavorite === 'true'
		}
		const pokemons = await pokemonService.queryPokemons(filterValues);
		res.send(pokemons)
	} catch (e) {
		console.log(e);
	}
}

async function patchPokemon(req: Request, res: Response) {
	try {
		const {isFavorite, pokeId} = req.body as unknown as Partial<ParsedPokemon>;
		if (typeof isFavorite === 'undefined' || !pokeId) {
			res.send();
			return;
		}
		await pokemonService.setPokemonFavorite(isFavorite, pokeId);
		res.send()
	} catch (e) {
		res.status(500);
		res.send();
	}
}

export {
	getPokemons,
	patchPokemon
}