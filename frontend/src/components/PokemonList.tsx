import {ParsedPokemon} from '../../../shared/ParsedPokemon';
import {PokemonCard} from './PokemonCard.tsx';

interface Props {
	pokemons: ParsedPokemon[]
	isFrontShown: boolean
	onClickCard: Function
}

export function PokemonList({pokemons, isFrontShown, onClickCard}:Props) {

	return (
		<div className='pokemon-list'>
			{pokemons.map(pokemon => <PokemonCard onClickCard={onClickCard} isFrontShown={isFrontShown} pokemon={pokemon} key={pokemon.pokeId} />)}
		</div>
	)
}