import React from 'react';
import uniqueId from 'lodash/uniqueId';
import './Application.css';

const Application = () => {
  const [badThings, setBadThings] = React.useState([]);

  const addBadThing = ({ badThing }) => {
    setBadThings([{ id: uniqueId(), value: badThing }, ...badThings]);
  };

  return (
    <main>
      <h1>Bad Things I've Done</h1>
      <NewBadThing onSubmit={addBadThing} />
      {badThings.map(thing => (
        <p key={thing.id}>{thing.value}</p>
      ))}
    </main>
  );
};

const NewBadThing = ({ onSubmit }) => {
  const [badThing, setBadThing] = React.useState('');

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit({ badThing });
    setBadThing('');
  };

  const handleChange = event => {
    setBadThing(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={badThing} onChange={handleChange} />
      <input type="submit" />
    </form>
  );
};

export default Application;
