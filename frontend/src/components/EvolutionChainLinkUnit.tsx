import {EvolutionChainLink, ParsedPokemon} from '../../../shared/ParsedPokemon';
import RightArrow from '../assets/right-arrow.svg'
import Pokeball from '../assets/Poke_Ball.webp'
import {useQueryClient} from '@tanstack/react-query';

interface Props {
	index: number
	chainLink: EvolutionChainLink[]
}

export function EvolutionChainLinkUnit({chainLink, index}:Props) {

	const queryClient = useQueryClient();
	const pokemons = queryClient.getQueryData<ParsedPokemon[]>(['pokemons'])

	const getPokemonSprite = (id: number):string => {
		if (!pokemons) return ''
		if (id > 151) return Pokeball
		for (let i = 0; i < pokemons.length; i++) {
			const currPoke = pokemons[i];
			if (currPoke.pokeId === id) {
				return currPoke.sprites.frontDefault;
			}
		}
		return Pokeball
	}

	const isNotFirstChainLink = (index:number) => {
		return index > 0
	}

	return (
		<div className={`chain-link ${chainLink.length > 2 ? 'long' : ''}`}>
			{chainLink.map(link => (
				<div key={link.name} className='link-unit'>
					{isNotFirstChainLink(index) && <div className="evo-arrow">
						<img src={RightArrow}/>
					</div>}
					<div className="link-poke">
						<img src={getPokemonSprite(link.id)}/>
						<span>{link.name}</span>
					</div>
				</div>
			))}
		</div>
	)
}