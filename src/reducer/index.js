const initialState = {
  fetching: true,
  todos: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TODOS_START':
      return { ...state, fetching: true };
    case 'FETCH_TODOS_END':
      return { ...state, fetching: false };
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'MAKE_ACTIVE':
      // const updatedTodos = state.todos.map(item => ({
      //   ...item,
      //   status: item.id === action.payload,
      // }));
      const { todos } = state;

      const itemIdx = todos.findIndex(item => item.id === action.payload);

      if (itemIdx === -1) return state;

      const updatedTodos = todos.slice();
      const item = { ...todos[itemIdx] };

      item.startTime = new Date().toUTCString();

      updatedTodos.splice(itemIdx, 1, item);

      return { state, todos: updatedTodos };
    case 'DELETE_TODO_ITEM':
      // const id = action.payload;
      // const { todos } = state;
      // const itemIdx = todos.findIndex(item => item.id === id);

      // if (itemIdx === -1) return state;

      // const newItems = [
      //   ...todos.slice(0, itemIdx),
      //   ...todos.slice(itemIdx + 1),
      // ];

      // const newItems = todos.filter(item => item.id !== id);
      // const newItems = todos.slice();
      // newItems.splice(itemIdx, 1);

      return { ...state };
    default:
      return state;
  }
};

export default reducer;
