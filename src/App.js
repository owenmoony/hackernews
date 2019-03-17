import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const isSearched = (searchTerm) => {
  console.log(searchTerm);
  return (item) => item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
    // this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories = (result) => {
    this.setState({ result })
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value })
  }

  onDismiss = (id) => {
    const isNotId = ((item) => {
      return item.objectID !== id;
    })
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    })
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error)
  }

  render() {
    const { result, searchTerm } = this.state

    if (!result) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          />
          {result &&
            <Table
              list={result.hits}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />}
        </div>
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
      <div className="table">
        {list.filter(isSearched(pattern)).map(item => {
          return (
            <div key={item.objectID} className="table-row">
              <span className="large-col">
                <a href={item.url}>{item.title}</a>
              </span>
              <span className="medium-col">
                {item.author}
              </span>
              <span className="medium-col">
                {item.num_comments}
              </span>
              <span className="small-col">
                {item.points}
              </span>
              <span className="small-col">
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




