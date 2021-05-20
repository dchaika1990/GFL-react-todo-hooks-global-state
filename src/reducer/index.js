const initialState = {
	fetching: true,
	todos: null,
};

const reducer = (state = initialState, action) => {
	let {todos} = state;
	switch (action.type) {
		case 'FETCH_TODOS_START':
			return {...state, fetching: true};
		case 'FETCH_TODOS_END':
			return {...state, fetching: false};
		case 'SET_TODOS':
			return {...state, todos: action.payload};
		case 'MAKE_ACTIVE':
			const updatedTodosInProgress = state.todos.in_progress.filter(item => !item.isActive).map(item => ({
				...item,
				isActive: item.id === action.payload,
				startime: item.id === action.payload && new Date().toISOString(),
				nextElement: item.id === action.payload && false,
			}));

			const doneTodoItem = state.todos.in_progress.filter(item => item.isActive)
			doneTodoItem[0].finishedTime = new Date().toISOString()
			doneTodoItem[0].isActive = false
			delete doneTodoItem[0].nextElement
			state.todos.done.push(doneTodoItem[0])

			return {
				state, todos: {
					...todos,
					in_progress: updatedTodosInProgress
				}
			};
		case 'ADD_TODO':
			const newTodoItem = {
				id: Date.now(),
				name: action.payload,
				isActive: false
			}
			todos.in_progress.push(newTodoItem)

			return {...state, todos: todos};
		case 'DELETE_TODO_ITEM':
			const id = action.payload;
			const newItemsInProgress = todos.in_progress.filter(item => item.id !== id);
			const newTodo = {
				in_progress: newItemsInProgress,
				done: todos.done
			}

			return {...state, todos: newTodo}
		default:
			return state;
	}
};

export default reducer;
