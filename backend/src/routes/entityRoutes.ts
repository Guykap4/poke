import { Router } from 'express';
import {deleteEntity, getEntities, postEntity} from '../controllers/entityController';

const router = Router();

// router.put('/')
router.post('/', postEntity)
router.get('/', getEntities);
router.delete('/', deleteEntity)

export const entityRoutes = router;