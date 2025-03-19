import {entityService} from '../services/entityService';
import {Request, Response} from 'express';
import {Entity} from '../types/entity';

async function getEntities(_req: Request, res: Response) {
	try {
		const entities = await entityService.queryEntities()
		res.send(entities)
	} catch (e) {
		console.log(e);
	}
}

async function postEntity(req: Request, res: Response) {
	try {
		const postedEntity:Entity[] = await entityService.postEntity(req.body);
		res.send(postedEntity[0]);
	} catch (e) {
		console.log(e);
	}
}

async function deleteEntity(req: Request, res: Response) {
	try {
		await entityService.deleteEntity(Number(req.body.id));
		res.send();
	} catch (e) {
		console.log(e);
	}
}

export {
	getEntities,
	postEntity,
	deleteEntity
}