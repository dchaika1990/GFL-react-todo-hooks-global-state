import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import List from './components/List';
import ListItem from './components/ListItem';
import { bindActionCreators } from 'redux';

// import { setTodos, startLoad, endLoad } from './actions';
import * as actions from './actions';

const App = props => {
  const [todoList, setTodoList] = useState({
    inProgress: [],
    done: [],
  });

  const { setTodos, todos, startLoad, fetching, endLoad } = props;

  const addInputRef = useRef();
  // const todos = useTodos();

  useEffect(() => {
    (async () => {
      startLoad();
      const { in_progress, done } = await fetch('/todos.json').then(res =>
        res.json()
      );
      // setTodoList(state => ({ ...state, inProgress: in_progress, done }));
      setTodos({
        in_progress,
        done,
      });
      endLoad();
    })();

    return () => {};
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

  const { inProgress, done } = todoList;

  const loading = <p>Loading...</p>;

  const renderDoneItem = ({ name, finishedTime }) => (
    <>
      <span className='badge'>
        {new Date(finishedTime).toLocaleTimeString()}
      </span>
      {name}
    </>
  );

  const renderInProgressItem = ({ name }) => (
    <>
      {name}
      <button type='button' className='btn btn-primary'>
        Start
      </button>
      <button type='button' className='btn btn-danger'>
        Del
      </button>
    </>
  );

  return (
    <div className='container'>
      <h1>Todo React APP</h1>
      <div className='row'>
        <div className='col-xs-12'>
          <form>
            <div className='form-group'>
              <label htmlFor='addInput'>New Todo Item: </label>
              <input
                ref={addInputRef}
                id='addInput'
                type='text'
                className='form-control'
                placeholder='New todo name'
              />
            </div>
            <button type='button' className='btn btn-success pull-right'>
              Add New Item
            </button>
          </form>
        </div>
      </div>
      <hr />
      <div className='row'>
        <div className='col-xs-12 col-sm-6'>
          <h3>Todos in progress</h3>
          {fetching ? (
            loading
          ) : (
            <List>
              {todos.in_progress.map(item => {
                const { id } = item;

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
          <p>Things to do: {0}</p>
        </div>
        <div className='col-xs-12 col-sm-6'>
          <h3>Done</h3>

          {fetching ? (
            loading
          ) : (
            <List>
              {todos.done.map(({ id, ...item }) => (
                <ListItem key={id} item={item} render={renderDoneItem} />
              ))}
            </List>
          )}

          <p>Done: {0}</p>
        </div>
      </div>
    </div>
  );
};

// hoc
const withName = WrappedComponent => {
  const name = 'React';
  const hocComponent = ({ ...props }) => (
    <WrappedComponent {...props} name={name} />
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
  const { startLoad, setTodos, endLoad } = bindActionCreators(
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
