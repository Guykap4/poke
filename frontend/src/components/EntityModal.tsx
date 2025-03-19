import {Entity} from '../types/entity';
import {SubmitHandler, useForm} from 'react-hook-form';

interface Props {
	onClose:Function;
	onSubmit:Function;
	entity?: Entity
}

interface FormValues {
	title: string
	description: string
	is_done?: boolean
}

export function EntityModal({onClose, onSubmit, entity}:Props) {

	const {register, handleSubmit, formState: {errors}} = useForm<FormValues>({
		defaultValues: {...entity}
	});

	const onSubmitForm:SubmitHandler<FormValues> = (formData: FormValues) => {
		onSubmit(formData as Entity);
	}

	return (
		<div className="entity-modal">
			<button className="close-button" onClick={() => {onClose()}}>X</button>
			<form onSubmit={handleSubmit(onSubmitForm)}>
				<label>Title</label>
				<input type={'text'} {...register("title", {required: "Title is required"})} />
				{errors.title && <span>{`${errors.title.message}`}</span>}
				<label>Description</label>
				<input type={'text'} {...register("description", {required: "Description is required"})} />
				{errors.description && <span>{`${errors.description.message}`}</span>}
				<button type={'submit'}>Submit</button>
			</form>
		</div>
	);
}