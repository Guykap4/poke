import axios from 'axios';
import {PokeAPI} from 'pokeapi-types';
import {EvolutionChainLink, ParsedPokemon} from '../../../shared/ParsedPokemon';

const POKEMONS_API = 'https://pokeapi.co/api/v2/pokemon/?limit=151';


/**
 * getting all relevant data from number of APIs
 */
async function populatePokemons():Promise<ParsedPokemon[]> {
	const basePokemons:PokeAPI.NamedAPIResource[] = await axios.get(POKEMONS_API).then(res => res.data.results);
	const pokemonsPromises = basePokemons.map(({url}) => {
		return axios.get(url);
	})
	const pokemons:PokeAPI.Pokemon[] = await Promise.all(pokemonsPromises).then(prms => prms.map(results => results.data))

	const evolutionLines = await getPokemonsEvolutionLine(pokemons);
	const preparedPokemons:ParsedPokemon[] = pokemons.map(parsePokemon);
	const parsedPokemons = linkPokemonsToEvos(preparedPokemons, evolutionLines);


	return parsedPokemons
}

/**
 * return a parsed pokemon to work with
 * @param pokemon
 */
function parsePokemon(pokemon:PokeAPI.Pokemon):ParsedPokemon {
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

async function getPokemonsEvolutionLine(pokemons:PokeAPI.Pokemon[]) {
	const PokeSpeciePrms = pokemons.map(poke => axios.get(poke.species.url));
	const species:PokeAPI.PokemonSpecies[] = await Promise.all(PokeSpeciePrms).then(prms => prms.map(results => results.data));
	const evolutionLinesPrms = species.map(specie => axios.get(specie.evolution_chain.url))
	const evolutionLines:PokeAPI.EvolutionChain[] = await Promise.all(evolutionLinesPrms).then(prms => prms.map(results => results.data));
	const parsedEvos = evolutionLines.map(evoChain => {
		return pushChainLink([evoChain.chain], [])
	})
	return parsedEvos
}

/**
 * recursively adding all the evolution stages, including multi line evolutions
 * @param chain
 * @param currChain
 */
function pushChainLink(chain:PokeAPI.ChainLink[], currChain:EvolutionChainLink[][] = []) {
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

function getCurrentPoke(chainLink:PokeAPI.ChainLink):EvolutionChainLink {
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

export const externalPokemonService = {
	populatePokemons
}