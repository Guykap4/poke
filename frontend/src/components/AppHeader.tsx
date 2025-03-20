import {HeartSVG} from './HeartSVG.tsx';

interface Props {
	isShowFavs: boolean
	setIsShowFavs: Function
}

export function AppHeader({isShowFavs, setIsShowFavs}:Props) {

	return (
		<div className="app-header">
			<span>Poke API</span>
			<div className="fav-filter">
				<span>{isShowFavs ? 'Show All' : 'Show Favorites'}</span>
				<HeartSVG isFavorite={isShowFavs} onClickHeart={() => setIsShowFavs()}/>
			</div>
		</div>
	)
}