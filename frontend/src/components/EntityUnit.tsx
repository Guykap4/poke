import {Entity} from '../types/entity';

interface Props {
	entity: Entity
	onRemoveEntity: Function
}

export function EntityUnit({entity,onRemoveEntity}: Props) {
	return (
		<div className={'entity'}>
			<button onClick={() => onRemoveEntity(entity.id)} className="delete-button">X</button>
			<span>title: {entity.title}</span>
			<span>description: {entity.description}</span>
			<span>isDone: {entity.is_done? 'V' : 'X'}</span>
			<span>id: {entity.id}</span>
		</div>
	)
}