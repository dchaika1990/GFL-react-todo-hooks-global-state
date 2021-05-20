import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {addTodo} from "../../actions";
import {useDispatch} from "react-redux";

export default function AddNewComponent({newTodoName, setNewTodo}) {
	let dispatch = useDispatch();

	return (
		<Form>
			<FormGroup>
				<Label for='addInput'>New Todo Item: </Label>
				<Input
					id='addInput'
					type='text'
					className='form-control'
					placeholder='New todo name'
					value={newTodoName}
					onChange={(e) => setNewTodo(e.target.value)}
				/>
			</FormGroup>
			<Button
				type='button'
				color="success"
				className='pull-right'
				onClick={() => {
					dispatch(addTodo(newTodoName));
					setNewTodo('');
				}
			}>
				Add New Item
			</Button>
		</Form>
	)
}