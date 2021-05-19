import React from 'react';

export default function ListItem({ item, render }) {
  const content = render(item);

  return <li className='list-group-item'>{content}</li>;
}
