import {dbService} from './dbService';
import {Entity} from '../types/entity';

const DB_NAME = 'entity';

async function queryEntities():Promise<Entity[]> {
	return dbService
		.select('*')
		.from(DB_NAME);
}

async function queryEntity(id: number):Promise<Entity[]> {
	return dbService
		.select('*')
		.from(DB_NAME)
		.where({id});
}

async function postEntity(entity: Entity):Promise<Entity[]> {
	return dbService
		.insert(entity)
		.into(DB_NAME)
		.then((returnedArray:number[]) => {
			return queryEntity(returnedArray[0]);
		})
}

async function deleteEntity(id:number) {
	return dbService
		.from(DB_NAME)
		.delete()
		.where({id})
}

export const entityService = {
	queryEntities,
	queryEntity,
	postEntity,
	deleteEntity
}