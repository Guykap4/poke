export interface ParsedPokemon {
	name: string
	types: string[]
	abilities: Ability[]
	sprites: Sprites
	evolutionDetails: EvolutionChainLink[][]
	isFavorite: boolean
	pokeId: number
}

interface Ability {
	isHidden: boolean
	name: string
}

interface Sprites {
	backDefault: string
	frontDefault: string
}

export interface EvolutionChainLink {
	id: number
	name: string
}