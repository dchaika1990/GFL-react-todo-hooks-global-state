export default function ListItem({ item, render }) {
  const content = render(item);
  const {isActive} = item;
  return <li className={`list-group-item ${isActive ? 'activeItem' : ''}`}>{content}</li>;
}
