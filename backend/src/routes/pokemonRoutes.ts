import { Router } from 'express';
import {getPokemons, patchPokemon} from '../controllers/pokemonController';

const router = Router();

router.get('/', getPokemons);
router.patch('/', patchPokemon)

export const pokemonRoutes = router;