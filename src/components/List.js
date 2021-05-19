import React from 'react';

export default function List({ children }) {
  console.log(children);

  return <ul>{children}</ul>;
}
