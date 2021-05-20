import List from "../list-component";
import ListItem from "../list-item-component";
import {Badge} from "reactstrap";

export default function TodoDone({fetching, loading, filteredTodos}) {

	const renderDoneItem = ({name, finishedTime}) => (
		<>
			<Badge color="secondary" pill>
				{new Date(finishedTime).toLocaleTimeString()}
			</Badge>
			{name}
		</>
	);

	return (
		<>
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
		</>
	)
}