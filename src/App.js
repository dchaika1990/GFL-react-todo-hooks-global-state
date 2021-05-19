import React, {useEffect, useRef, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import List from './components/List';
import ListItem from './components/ListItem';
import {bindActionCreators} from 'redux';
import {Badge, Button, Container, Row, Col, Form, FormGroup, Label, Input} from 'reactstrap'

// import { setTodos, startLoad, endLoad } from './actions';
import * as actions from './actions';
import {addTodo} from "./actions";


const App = props => {
	const [todoList, setTodoList] = useState({
		inProgress: [],
		done: [],
	});
	const [newTodo, setNewTodo] = useState('');

	const onValueChange = (e) => {
		setNewTodo(e.target.value)
	}

	const {setTodos, todos, startLoad, fetching, endLoad, addTodo} = props;
	const {inProgress, done} = todoList;
	const addInputRef = useRef();

	useEffect(() => {
		(async () => {
			startLoad();
			const {in_progress, done} = await fetch('/todos.json').then(res =>
				res.json()
			);
			console.log(in_progress)
			// setTodoList(state => ({ ...state, inProgress: in_progress, done }));
			setTodos({
				in_progress,
				done,
			});
			endLoad();
		})();

		return () => {
		};
	}, []);

	// useEffect(() => {
	// 	setNewTodo(state => ({
	// 		...state,
	// 		in_progress:
	// 	}))
	// 	setTodoList(state => ({
	// 		...state,
	// 		done: todos.done,
	// 	}));
	// }, [todos]);

	const loading = <p>Loading...</p>;

	const addTodoHandler = (e) => {
		e.preventDefault();
		addTodo(newTodo)
	}

	const renderDoneItem = ({name, finishedTime}) => (
		<>
			<Badge color="secondary" pill>
				{new Date(finishedTime).toLocaleTimeString()}
			</Badge>
			{name}
		</>
	);

	const renderInProgressItem = ({name, isActive, nextElement}) => {
		return (
			<>
				{name}
				{nextElement && (
					<>
						<Button type="button" color="primary">Start</Button>
					</>
				)}
				{!isActive && (
					<>
						<Button type="button" color="danger">Del</Button>
					</>
				)}
			</>
		)
	}

	return (
		<Container>
			<h1>Todo React APP</h1>
			<Row>
				<Col>
					<Form onSubmit={addTodoHandler}>
						<FormGroup>
							<Label for='addInput'>New Todo Item: </Label>
							<Input
								ref={addInputRef}
								id='addInput'
								type='text'
								className='form-control'
								placeholder='New todo name'
								onChange={onValueChange}
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
							{todos.in_progress.map((item, index) => {
								const {id, isActive} = item;

								if (isActive) todos.in_progress[index + 1].nextElement = true;

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
					<p>Things to do: {todos?.in_progress.length}</p>
				</Col>
				<Col sm="6">
					<h3>Done</h3>

					{fetching ? (
						loading
					) : (
						<List>
							{todos.done.map(({id, ...item}) => (
								<ListItem key={id} item={item} render={renderDoneItem}/>
							))}
						</List>
					)}

					<p>Done: {todos?.done.length}</p>
				</Col>
			</Row>
		</Container>
	);
};

const mapStateToProps = state => ({
	fetching: state.fetching,
	todos: state.todos,
});

const mapDispatchToProps = dispatch => {
	const {startLoad, setTodos, endLoad, addTodo} = bindActionCreators(
		actions,
		dispatch
	);

	return {
		startLoad,
		endLoad,
		addTodo: name => addTodo(name),
		setTodos: list => setTodos(list),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
