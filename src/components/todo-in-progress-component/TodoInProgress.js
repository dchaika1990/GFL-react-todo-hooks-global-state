import List from "../list-component";
import ListItem from "../list-item-component";
import {Button} from "reactstrap";
import {deleteTodo, makeActive} from "../../actions";
import {useDispatch} from "react-redux";

export default function TodoInProgress({fetching, loading, filteredTodos, todos}) {
	const dispatch = useDispatch();
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
		<>
			{fetching ? (
				loading
			) : (
				<List>
					{filteredTodos.in_progress.map((item, index) => {
						const {id, isActive} = item;
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
		</>
	)
}