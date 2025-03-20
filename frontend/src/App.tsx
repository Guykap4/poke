import './App.scss';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {pokemonService} from './services/pokemonService.ts';
import {ParsedPokemon} from '../../shared/ParsedPokemon';
import {PokemonList} from './components/PokemonList.tsx';
import {useEffect, useState} from 'react';
import {FullPokemonCard} from './components/FullPokemonCard.tsx';
import {AppHeader} from './components/AppHeader.tsx';
import {FilterValues} from '../../shared/FilterValues';
import {PokeLoader} from './components/PokeLoader.tsx';

function App() {

	const [isFrontShown, setIsFrontShown] = useState(true);
	const [chosenPokemon, setChosenPokemon] = useState<ParsedPokemon | null>(null);
	const [filterValues, setFilterValues] = useState<FilterValues>({isFavorite: false});

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
				return prevPoke ? {...prevPoke, isFavorite: !prevPoke.isFavorite} : null;
			});
		},
	});

	useEffect(() => {
		const intervalId = setInterval(() => {
			setIsFrontShown(prevState => !prevState);
		}, 10000)
		return () => {
			clearTimeout(intervalId);
		}
	}, []);

	useEffect(() => {
		queryClient.invalidateQueries({queryKey: ['pokemons']});
	}, [filterValues]);

	const setPokemonFavorite = ({isFavorite, pokeId}:Partial<ParsedPokemon>) => {
		mutation.mutate({isFavorite, pokeId});
	};

	const toggleShowFavs = () => {
		setFilterValues(prevState => ({...prevState, isFavorite: !prevState.isFavorite}));
	};


	return (
		<div className="app">
			<AppHeader isShowFavs={filterValues.isFavorite} setIsShowFavs={toggleShowFavs}/>
			{isPending && <PokeLoader/>}
			{error && <div>Something went wrong</div>}
			{pokemons &&
                <>
                    <PokemonList onClickCard={setChosenPokemon} isFrontShown={isFrontShown} pokemons={pokemons}/>
					{chosenPokemon && <FullPokemonCard setPokemonFavorite={setPokemonFavorite} pokemon={chosenPokemon}
                                               setChosenPokemon={setChosenPokemon}/>}
                </>}
		</div>
	);
}

export default App;
