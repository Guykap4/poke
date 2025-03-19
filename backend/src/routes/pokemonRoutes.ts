import { Router } from 'express';
import {getPokemons} from '../controllers/pokemonController';

const router = Router();

router.get('/', getPokemons);

export const pokemonRoutes = router;