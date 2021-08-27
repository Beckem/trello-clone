import React from 'react'
import BoardBar from 'components/BoardBar/BoardBar';
import BoardContent from 'components/BoardContent/BoardContent';
import './App.scss';
import AppBar from './components/AppBar/AppBar';

function App() {
  return (
    <div className="trello-container">
      <AppBar/>
      <BoardBar/>
      <BoardContent/>
    </div>
  );
}

export default App;
