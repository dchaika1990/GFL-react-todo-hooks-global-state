import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import List from './components/list-component';
import ListItem from './components/list-item-component';
import {Badge, Button, Container, Row, Col, Form, FormGroup, Label, Input} from 'reactstrap'
import {setTodos, startLoad, endLoad, addTodo, deleteTodo, makeActive} from './actions';

const App = props => {
	const dispatch = useDispatch();
	let todos = useSelector(state => state.todos);
	let fetching = useSelector(state => state.fetching);

	useEffect(() => {
		fetch('/todos.json')
			.then(res => res.json())
			.then(list => {
				dispatch(startLoad())
				dispatch(setTodos(list))
				dispatch(endLoad())
			})
	}, [])

	const [newTodoName, setNewTodo] = useState('');
	const [searchKey, setSearchKey] = useState('');

	const filteredTodos = useMemo(() => {
		if (searchKey) {
			let filterTodos = {};
			Object.keys(todos).forEach(key => {
				let filterTodo = todos[key].filter(item => item.name.toLowerCase().includes(searchKey.toLowerCase()))
				console.log(...filterTodo)
				filterTodos[key] = []
				filterTodos[key].push(...filterTodo)
			})
			return filterTodos
		}
		return todos
	}, [todos, searchKey])

	const addTodoHandler = (e) => {
		e.preventDefault();
		dispatch(addTodo(newTodoName))
		setNewTodo('');
	}

	const loading = <p>Loading...</p>;

	const renderDoneItem = ({name, finishedTime}) => (
		<>
			<Badge color="secondary" pill>
				{new Date(finishedTime).toLocaleTimeString()}
			</Badge>
			{name}
		</>
	);

	const renderInProgressItem = ({name, isActive, nextElement, id}) => {
		return (
			<>
				{name}
				{nextElement && !isActive && (
					<>
						<Button
							type="button"
							color="primary"
							onClick={(e) => dispatch(makeActive(id))}
						>Start</Button>
					</>
				)}
				{!isActive && (
					<>
						<Button
							type="button"
							color="danger"
							onClick={() => dispatch(deleteTodo(id))}
						>Del</Button>
					</>
				)}
			</>
		)
	}

	return (
		<Container>
			<h1>Todo React APP</h1>
			<h2>Todos search</h2>
			<Row>
				<Col>
					<Input
						id='addInput'
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
					<Form onSubmit={addTodoHandler}>
						<FormGroup>
							<Label for='addInput'>New Todo Item: </Label>
							<Input
								id='addInput'
								type='text'
								className='form-control'
								placeholder='New todo name'
								value={newTodoName}
								onChange={(e)=>setNewTodo(e.target.value)}
							/>
						</FormGroup>
						<Button type='submit' color="success" className='pull-right'>
							Add New Item
						</Button>
					</Form>
				</Col>
			</Row>
			<hr/>
			<Row>
				<Col sm="6">
					<h3>Todos in progress</h3>
					{fetching ? (
						loading
					) : (
						<List>
							{filteredTodos.in_progress.map((item, index) => {
								const {id, isActive} = item;
								// if (isActive && filteredTodos.in_progress[index + 1]) filteredTodos.in_progress[index + 1].nextElement = true;
								if (isActive && todos.in_progress[index + 1]) todos.in_progress[index + 1].nextElement = true;
								return (
									<ListItem
										key={id}
										item={item}
										render={renderInProgressItem}
									/>
								);
							})}
						</List>
					)}
					<p>Things to do: {filteredTodos?.in_progress.length}</p>
				</Col>
				<Col sm="6">
					<h3>Done</h3>

					{fetching ? (
						loading
					) : (
						<List>
							{filteredTodos.done.map(({id, ...item}) => (
								<ListItem key={id} item={item} render={renderDoneItem}/>
							))}
						</List>
					)}

					<p>Done: {filteredTodos?.done.length}</p>
				</Col>
			</Row>
		</Container>
	);
};


export default App;
