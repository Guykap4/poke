export interface ParsedPokemon {
	name: string
	abilities: Ability[]
	sprites: Sprites
	evolutionDetails: []
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