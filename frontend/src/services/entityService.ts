import {httpService} from './httpService.ts';
import {Entity} from '../types/entity';

const ENDPOINT = 'entity';

function getEntities():Promise<Entity[]> {
	return httpService.get(ENDPOINT);
}

function addEntity(entity:Entity):Promise<Entity> {
	return httpService.post(ENDPOINT, entity);
}

function editEntity(entity:Entity):Promise<Entity> {
	return httpService.put(ENDPOINT, entity);
}

function deleteEntity(id:number) {
	return httpService.delete(ENDPOINT, {id});
}

export const entityService = {
	getEntities,
	addEntity,
	editEntity,
	deleteEntity
};