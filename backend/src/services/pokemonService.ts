import * as fs from 'node:fs';
import axios from 'axios';
import {ChainLink, EvolutionChain, NamedAPIResource, Pokemon, PokemonSpecies} from 'pokeapi-types';
import {EvolutionChainLink, ParsedPokemon} from '../../../shared/ParsedPokemon';
import {FilterValues} from '../../../shared/FilterValues';

const POKEMON_DATA_PATH = 'src/data/pokemons.json'
const POKEMONS_API = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

async function queryPokemons(filterValues?:FilterValues):Promise<ParsedPokemon[]> {
	let pokemons:ParsedPokemon[] = JSON.parse(fs.readFileSync(POKEMON_DATA_PATH, {encoding: 'utf8', flag: 'r'}));
	if (!pokemons || !pokemons.length) {
		await populatePokemons();
	}
	if (filterValues?.isFavorite) {
		pokemons = pokemons.filter(poke => poke.isFavorite)
	}
	return pokemons
}

async function setPokemonFavorite(isFavorite:boolean, pokeId:number) {
	const pokemons = await queryPokemons();
	const patchedPokemons = pokemons.map(pokemon => {
		return pokemon.pokeId === pokeId ? {...pokemon, isFavorite} : pokemon;
	})
	writePokemonsToJson(patchedPokemons);
	return;
}

async function populatePokemons() {
	const basePokemons:NamedAPIResource[] = await axios.get(POKEMONS_API).then(res => res.data.results);
	const pokemonsPromises = basePokemons.map(({url}) => {
		return axios.get(url);
	})
	const pokemons:Pokemon[] = await Promise.all(pokemonsPromises).then(prms => prms.map(results => results.data))

	const evolutionLines = await getPokemonsEvolutionLine(pokemons);
	const preparedPokemons:ParsedPokemon[] = pokemons.map(parsePokemon);
	const parsedPokemons = linkPokemonsToEvos(preparedPokemons, evolutionLines);


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
		types: pokemon.types.map(typeInfo => typeInfo.type.name)
	}
}

async function getPokemonsEvolutionLine(pokemons:Pokemon[]) {
	const PokeSpeciePrms = pokemons.map(poke => axios.get(poke.species.url));
	const species:PokemonSpecies[] = await Promise.all(PokeSpeciePrms).then(prms => prms.map(results => results.data));
	const evolutionLinesPrms = species.map(specie => axios.get(specie.evolution_chain.url))
	const evolutionLines:EvolutionChain[] = await Promise.all(evolutionLinesPrms).then(prms => prms.map(results => results.data));
	const parsedEvos = evolutionLines.map(evoChain => {
		return pushChainLink([evoChain.chain], [])
	})
	return parsedEvos
}

function pushChainLink(chain:ChainLink[], currChain:EvolutionChainLink[][] = []) {
	const currLink:EvolutionChainLink[] = chain.map(chainLink => {
		const currPoke = getCurrentPoke(chainLink)
		if (chainLink.evolves_to.length) {
			pushChainLink(chainLink.evolves_to, currChain)
		}
		return currPoke
	})
	currChain.unshift(currLink);
	return currChain;
}

function extractPokeIdFromUrl(url:string) {
	const urlSegments = url.split('/')
	return urlSegments[urlSegments.length - 2];
}

function getCurrentPoke(chainLink:ChainLink):EvolutionChainLink {
	return {
		id: parseInt(extractPokeIdFromUrl(chainLink.species.url)),
		name: chainLink.species.name
	}
}

function linkPokemonsToEvos(pokemons:ParsedPokemon[], evos:EvolutionChainLink[][][]):ParsedPokemon[] {
	return pokemons.map((poke, index) => {
		return {
			...poke,
			evolutionDetails: evos[index]
		}
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