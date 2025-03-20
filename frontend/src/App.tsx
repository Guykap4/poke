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
import {useDebouncedCallback} from 'use-debounce';
import {Error} from './components/Error.tsx';

function App() {

	const [isFrontShown, setIsFrontShown] = useState(true);
	const [chosenPokemon, setChosenPokemon] = useState<ParsedPokemon | null>(null);
	const [filterValues, setFilterValues] = useState<FilterValues>({isFavorite: false, name: ''});

	/**
	 * using react query client for silent query and retries
	 */
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

	/**
	 * changing sprite back and forth
	 */
	useEffect(() => {
		const intervalId = setInterval(() => {
			setIsFrontShown(prevState => !prevState);
		}, 10000)
		return () => {
			clearTimeout(intervalId);
		}
	}, []);

	useEffect(() => {
		debouncedRefetch();
	}, [filterValues]);

	const debouncedRefetch = useDebouncedCallback(() => {
		queryClient.invalidateQueries({queryKey: ['pokemons']});
	}, 500, {maxWait: 1500});

	const setPokemonFavorite = ({isFavorite, pokeId}:Partial<ParsedPokemon>) => {
		mutation.mutate({isFavorite, pokeId});
	};

	const toggleShowFavs = () => {
		setFilterValues(filterValue => ({...filterValue, isFavorite: !filterValue.isFavorite}));
	};

	const onFilterChange = (name:string, value:string) => {
		setFilterValues(filterValue => ({...filterValue, [name]: value}))
	}


	return (
		<div className="app">
			<AppHeader isShowFavs={filterValues.isFavorite} setIsShowFavs={toggleShowFavs} onFilterChange={onFilterChange}/>
			{isPending && <PokeLoader/>}
			{error && <Error/>}
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
