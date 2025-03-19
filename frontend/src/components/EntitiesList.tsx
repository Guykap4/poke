import {Entity} from '../types/entity';
import {EntityUnit} from './EntityUnit.tsx';

interface Props {
	entities: Entity[]
	onRemoveEntity: Function
}

export function EntitiesList({entities,onRemoveEntity}: Props) {

	return <div className={'entities-list-container'}>
		{entities.map(entity => <EntityUnit onRemoveEntity={onRemoveEntity} key={entity.id} entity={entity} />)}
	</div>
}