import {ParsedPokemon} from '../../../shared/ParsedPokemon';
import {useEffect} from 'react';
import {EvolutionChainLinkUnit} from './EvolutionChainLinkUnit.tsx';
import {HeartSVG} from './HeartSVG.tsx';

interface Props {
	pokemon:ParsedPokemon;
	setChosenPokemon:Function;
	setPokemonFavorite:Function
}

const KEY_NAME_ESC = 'Escape';
const KEY_EVENT_TYPE = 'keydown';

export function FullPokemonCard({pokemon, setChosenPokemon, setPokemonFavorite}:Props) {

	useEffect(() => {
		document.addEventListener(KEY_EVENT_TYPE, handleEscapeKey, false);

		return () => {
			document.removeEventListener(KEY_EVENT_TYPE, handleEscapeKey, false);
		};
	}, []);

	const handleEscapeKey = (e:KeyboardEvent) => {
		if (e.key === KEY_NAME_ESC) {
			setChosenPokemon(null);
		}
	};

	const haveEvolutionLine = pokemon.evolutionDetails.length > 1;

	const onClickHeart = () => {
		setPokemonFavorite({pokeId: pokemon.pokeId, isFavorite: !pokemon.isFavorite})
	}

	return (
		<div onClick={() => setChosenPokemon(null)} className="modal-dark-bg">
			<div className="full-pokemon-card" onClick={(e) => e.stopPropagation()}>
				<HeartSVG onClickHeart={onClickHeart} isFavorite={pokemon.isFavorite}/>
				<span>{pokemon.name}</span>
				<div className="img-container">
					<img src={pokemon.sprites.frontDefault}/>
				</div>
				<span>#{pokemon.pokeId}</span>
				<div className="types">
					{pokemon.types.map(type => <span key={type} className={`type ${type}`}>{type}</span>)}
				</div>
				<div className="ability-list">
					<span>Abilities: {pokemon.abilities.map(ability =>
						<span key={ability.name}
							  className="ability">{ability.name}{ability.isHidden && ' (hidden)'}</span>)}</span>
				</div>
				{haveEvolutionLine ?
					<div className="evolution-line">
						{pokemon.evolutionDetails.map((chainLink,index) => <EvolutionChainLinkUnit key={index} index={index} chainLink={chainLink}/>)}
					</div>
					: <span>This pokemon has no evolution line</span>}
			</div>
		</div>
	);
}