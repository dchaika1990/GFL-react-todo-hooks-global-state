const initialState = {
	fetching: true,
	todos: null,
};

const replaceToDone = (todos) => {
	const doneTodoItem = todos.in_progress.filter(item => item.isActive)[0]
	doneTodoItem.finishedTime = new Date().toISOString()
	doneTodoItem.isActive = false
	delete doneTodoItem.nextElement
	todos.done.push(doneTodoItem)
}

const reducer = (state = initialState, action) => {
	let todos;
	switch (action.type) {
		case 'FETCH_TODOS_START':
			todos = {...state.todos};
			return {...state, fetching: true};
		case 'FETCH_TODOS_END':
			todos = {...state.todos};
			return {...state, fetching: false};
		case 'SET_TODOS':
			todos = {...state.todos};
			return {...state, todos: action.payload};
		case 'MAKE_ACTIVE':
			todos = {...state.todos};

			const updatedTodosInProgress = todos.in_progress.filter(item => !item.isActive).map(item => ({
				...item,
				isActive: item.id === action.payload,
				startime: item.id === action.payload && new Date().toISOString(),
				nextElement: item.id === action.payload && false,
			}));
			replaceToDone(todos)
			return {
				state, todos: {
					...todos,
					in_progress: updatedTodosInProgress
				}
			};
		case 'ADD_TODO':
			todos = {...state.todos};
			const newTodoItem = {
				id: Date.now(),
				name: action.payload,
				isActive: !todos.in_progress.length
			}
			todos.in_progress.push(newTodoItem)
			return {...state, todos: todos};
		case 'DELETE_TODO_ITEM':
			todos = {...state.todos};
			const id = action.payload;
			const newItemsInProgress = todos.in_progress.filter(item => item.id !== id);
			const newTodo = {
				in_progress: newItemsInProgress,
				done: todos.done
			}
			return {...state, todos: newTodo}
		case 'MAKE_DONE_LAST_ITEM':
			todos = {...state.todos};
			replaceToDone(todos)
			return {...state, todos: {
				in_progress: todos.in_progress.slice(1),
				done: todos.done
			}};
		default:
			return state;
	}
};

export default reducer;
