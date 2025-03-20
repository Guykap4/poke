import {HeartSVG} from './HeartSVG.tsx';

interface Props {
	isShowFavs: boolean
	setIsShowFavs: Function
	onFilterChange: Function
}

export function AppHeader({isShowFavs, setIsShowFavs, onFilterChange}:Props) {

	return (
		<div className="app-header flying">
			<span>Poke API</span>
			<div className="fav-filter">
				<span>{isShowFavs ? 'Show All' : 'Show Favorites'}</span>
				<HeartSVG isFavorite={isShowFavs} onClickHeart={() => setIsShowFavs()}/>
				<label htmlFor='name'>Name:</label>
				<input
					type="text"
					name="name"
					onChange={({target:{name,value}}) => onFilterChange(name, value)}/>
			</div>
		</div>
	)
}