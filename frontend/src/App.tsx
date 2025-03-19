import './App.scss';
import {useEffect, useState} from 'react';
import {Entity} from './types/entity';
import {entityService} from './services/entityService.ts';
import {EntitiesList} from './components/EntitiesList.tsx';
import {EntityModal} from './components/EntityModal.tsx';

function App() {

	const [entities, setEntities] = useState<Entity[]>([]);
	const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

	useEffect(() => {
		async function fetchEntities() {
			const entities = await entityService.getEntities();
			setEntities(entities);
		}
		fetchEntities();
	}, []);

	const toggleModal = () => {
		setIsAddModalOpen((isModalOpen) => !isModalOpen)
	}

	const HandleEntity = (entity:Entity) => {
		toggleModal();
		if (!entity.id) {
			addEntity(entity)
			return
		}
		editEntity(entity)
	}

	const addEntity = async (entity:Entity) => {
		const addedEntity = await entityService.addEntity(entity);
		setEntities((prevEntities) => {
			return [...prevEntities, addedEntity]
		})
	}

	const editEntity = async (entity:Entity) => {
		const editedEntity = await entityService.editEntity(entity);
		setEntities((prevEntities) => prevEntities.map(currEntity => currEntity.id === editedEntity.id ? editedEntity : currEntity))
	}

	const removeEntity = async (id:number) => {
		await entityService.deleteEntity(id);
		setEntities(prevEntities => {
			return prevEntities.filter(entity => entity.id !== id);
		})
	}

	return (
		<div className={'app'}>
			<button onClick={toggleModal} className={'add-entity'}>
				Add Entity
			</button>
			<EntitiesList onRemoveEntity={removeEntity} entities={entities} />
			{isAddModalOpen && <EntityModal onSubmit={HandleEntity} onClose={toggleModal}/>}
		</div>
	);
}

export default App;
