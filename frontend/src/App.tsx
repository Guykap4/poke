import './App.scss';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {pokemonService} from './services/pokemonService.ts';
import {ParsedPokemon} from '../../shared/ParsedPokemon';
import {PokemonList} from './components/PokemonList.tsx';
import {useEffect, useState} from 'react';
import {FullPokemonCard} from './components/FullPokemonCard.tsx';
import {AppHeader} from './components/AppHeader.tsx';
import {FilterValues} from '../../shared/FilterValues';

function App() {

	const queryClient = useQueryClient();
	const {isPending, error, data: pokemons} = useQuery({
		queryKey: ['pokemons'],
		queryFn: () =>
			pokemonService.getPokemons(filterValues),
	});

	const mutation = useMutation({
		mutationFn: pokemonService.setPokemonFavorite,
		onSuccess: async () => {
			await queryClient.invalidateQueries({queryKey: ['pokemons']});
			setChosenPokemon(prevPoke => {
				return prevPoke ? {...prevPoke, isFavorite: !prevPoke.isFavorite} : null
			})
		},
	});

	const setPokemonFavorite = ({isFavorite, pokeId}:Partial<ParsedPokemon>) => {
		mutation.mutate({isFavorite, pokeId})
	}

	const [isFrontShown, setIsFrontShown] = useState(true);
	const [chosenPokemon, setChosenPokemon] = useState<ParsedPokemon | null>(null);
	const [filterValues, setFilterValues] = useState<FilterValues>({isFavorite: false});

	const toggleShowFavs = () => {
		setFilterValues(prevState => ({...prevState, isFavorite: !prevState.isFavorite}));
	}

	useEffect(() => {
		// const intervalId = setInterval(() => {
		// 	setIsFrontShown(prevState => !prevState);
		// }, 10000)
		// return () => {
		// 	clearTimeout(intervalId);
		// }
	}, []);

	useEffect(() => {
		queryClient.invalidateQueries({queryKey: ['pokemons']})
	}, [filterValues]);


	if (isPending) return <div>...loading</div>;
	if (error) return <div>ERROR</div>;

	return (
		<div className="app">
			<AppHeader isShowFavs={filterValues.isFavorite} setIsShowFavs={toggleShowFavs} />
			<PokemonList onClickCard={setChosenPokemon} isFrontShown={isFrontShown} pokemons={pokemons}/>
			{chosenPokemon && <FullPokemonCard setPokemonFavorite={setPokemonFavorite} pokemon={chosenPokemon} setChosenPokemon={setChosenPokemon}/>}
		</div>
	);
}

export default App;
