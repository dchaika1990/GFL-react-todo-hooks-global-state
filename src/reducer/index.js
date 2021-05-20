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
			const itemIdx = todos.findIndex(item => item.id === action.payload);

			if (itemIdx === -1) return state;

			const updatedTodos = todos.slice();
			const item = {...todos[itemIdx]};
			item.isActive = true;
			item.startTime = new Date().toUTCString();
			updatedTodos.splice(itemIdx, 1, item);

			return {state, todos: updatedTodos};
		case 'ADD_TODO':
			const newTodoItem = {
				id: Date.now(),
				name: action.payload,
				isActive: false
			}
			todos.in_progress.push(newTodoItem)
			console.log({...state, todos: todos})
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
