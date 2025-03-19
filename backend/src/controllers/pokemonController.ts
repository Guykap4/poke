import {pokemonService} from '../services/pokemonService';
import {Request, Response} from 'express';

async function getPokemons(_req: Request, res: Response) {
	try {
		const pokemons = await pokemonService.queryPokemons();
		res.send(pokemons)
	} catch (e) {
		console.log(e);
	}
}

export {
	getPokemons,
}