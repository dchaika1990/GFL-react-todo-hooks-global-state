import {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Col, Input} from 'reactstrap'
import {setTodos, startLoad, endLoad} from './actions';
import AddNewComponent from "./components/add-new-todo";
import TodoInProgress from "./components/todo-in-progress-component";
import TodoDone from "./components/todo-done-component";

const App = props => {
	const dispatch = useDispatch();
	let todos = useSelector(state => state.todos);
	let fetching = useSelector(state => state.fetching);

	const [searchKey, setSearchKey] = useState('');

	useEffect(() => {
		fetch('/todos.json')
			.then(res => res.json())
			.then(list => {
				dispatch(startLoad())
				dispatch(setTodos(list))
				dispatch(endLoad())
			})
	}, [])

	const filteredTodos = useMemo(() => {
		if (searchKey) {
			let filterTodos = {};
			Object.keys(todos).forEach(key => {
				let filterTodo = todos[key].filter(item => item.name.toLowerCase().includes(searchKey.toLowerCase()))
				filterTodos[key] = []
				filterTodos[key].push(...filterTodo)
			})
			return filterTodos
		}
		return todos
	}, [todos, searchKey])

	const loading = <p>Loading...</p>;

	return (
		<Container>
			<Row>
				<Col sm={6}>
					<h2>Todo React APP</h2>
				</Col>
				<Col sm={6}>
					<Input
						type='text'
						className='form-control'
						placeholder='Search todos'
						value={searchKey}
						onChange={(e)=>setSearchKey(e.target.value)}
					/>
				</Col>
			</Row>
			<hr/>
			<h2>Todos</h2>
			<Row>
				<Col>
					<AddNewComponent />
				</Col>
			</Row>
			<hr/>
			<Row>
				<Col sm="6">
					<h3>Todos in progress</h3>
					<TodoInProgress
						fetching={fetching}
						loading={loading}
						filteredTodos={filteredTodos}
						todos={todos}
					/>
				</Col>
				<Col sm="6">
					<h3>Done</h3>
					<TodoDone
						fetching={fetching}
						loading={loading}
						filteredTodos={filteredTodos}
					/>
				</Col>
			</Row>
		</Container>
	);
};


export default App;
