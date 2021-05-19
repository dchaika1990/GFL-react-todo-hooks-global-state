import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import List from './components/List';
import ListItem from './components/ListItem';
import {bindActionCreators} from 'redux';
import {Badge, Button, Container, Row, Col, Form, FormGroup, Label, Input} from 'reactstrap'

// import { setTodos, startLoad, endLoad } from './actions';
import * as actions from './actions';

const App = props => {
	const [todoList, setTodoList] = useState({
		inProgress: [],
		done: [],
	});

	const {setTodos, todos, startLoad, fetching, endLoad} = props;

	const addInputRef = useRef();
	// const todos = useTodos();

	useEffect(() => {
		(async () => {
			startLoad();
			const {in_progress, done} = await fetch('/todos.json').then(res =>
				res.json()
			);
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
	//   setTodoList(state => ({
	//     ...state,
	//     inProgress: todos.in_progress,
	//   }));

	//   setTodoList(state => ({
	//     ...state,
	//     done: todos.done,
	//   }));
	// }, [todos]);

	const {inProgress, done} = todoList;

	const loading = <p>Loading...</p>;

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
					<Form>
						<FormGroup>
							<Label for='addInput'>New Todo Item: </Label>
							<Input
								ref={addInputRef}
								id='addInput'
								type='text'
								className='form-control'
								placeholder='New todo name'
							/>
						</FormGroup>
						<Button type='button' color="success" className='pull-right'>
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
					<p>Things to do: {todos ? todos.in_progress.length : 0}</p>
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

					<p>Done: {todos ? todos.done.length : 0}</p>
				</Col>
			</Row>
		</Container>
	);
};

// hoc
const withName = WrappedComponent => {
	const name = 'React';
	const hocComponent = ({...props}) => (
		<WrappedComponent {...props} name={name}/>
	);

	return hocComponent;
};

// custom hook
const useTodos = () => {
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		(async () => {
			const list = await fetch('/todos.json').then(res => res.json());

			setTodos(list);
		})();
	}, []);

	return todos;
};

const mapStateToProps = state => ({
	fetching: state.fetching,
	todos: state.todos,
});

// const mapDispatchToProps = dispatch => ({
//   startLoad: () => dispatch(startLoad()),
//   setTodos: list => dispatch(setTodos(list)),
//   endLoad: () => {
//     dispatch(endLoad());
//   },
// });

const mapDispatchToProps = dispatch => {
	const {startLoad, setTodos, endLoad} = bindActionCreators(
		actions,
		dispatch
	);

	return {
		startLoad,
		endLoad,
		setTodos: list => setTodos(list),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
