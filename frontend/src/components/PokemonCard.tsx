import {ParsedPokemon} from '../../../shared/ParsedPokemon';
import {HeartSVG} from './HeartSVG.tsx';

interface Props {
	pokemon:ParsedPokemon
	isFrontShown: boolean
	onClickCard: Function
}

export function PokemonCard({pokemon, isFrontShown, onClickCard}:Props) {

	return (
		<div className='pokemon-card' onClick={() => onClickCard(pokemon)}>
			<HeartSVG isFavorite={pokemon.isFavorite}/>
			<img src={isFrontShown ? pokemon.sprites.frontDefault : pokemon.sprites.backDefault}/>
			<span>#{pokemon.pokeId}</span>
			<span>{pokemon.name}</span>
		</div>
	)
}