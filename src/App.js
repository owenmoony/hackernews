import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'http://reactjs.org/',
    author: 'Jodan',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'http://redux.js.org/',
    author: 'Dan',
    num_comments: 2,
    points: 3,
    objectID: 1,
  }
]

const isSearched = (searchTerm) => {
  console.log(searchTerm);
  return (item) => item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      list,
      searchTerm: '',
    };
    // this.onDismiss = this.onDismiss.bind(this);
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value })
  }

  onDismiss = (id) => {
    const isNotId = ((item) => {
      console.log('item', item.objectID, id);
      return item.objectID != id;
    })
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList })
  }

  render() {
    const helloWorld = "Welcome to the App";
    const { list, searchTerm } = this.state

    return (
      <div className='App'>
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        />
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const { value, onChange } = this.props;
    return (
      <form>
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>
    );
  }
}

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;
    return (
      <div>
        {list.filter(isSearched(pattern)).map(item => {
          return (
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <button
                  onClick={() => onDismiss(item.objectID)}
                  type="button">
                  Dismiss
              </button>
              </span>
            </div>
          )
        }
        )}
      </div>
    );
  }
}


export default App;




