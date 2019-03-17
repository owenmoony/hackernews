import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories = (result) => {
    console.log('result', result)
    const {hits, page} = result;
    const oldHits = page !== 0
      ? this.state.result.hits
      : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ]
    this.setState({result: 
      { hits: updatedHits, page }
    });
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {


    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error); 
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }
  
  onSearchSubmit(event) {
    console.log('search submit')
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }
  
  onDismiss(id) {
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
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm)
  }

  render() {
    const { result, searchTerm } = this.state
    const page = (result && result.page) || 0;
    if (!result) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >Search</Search>
          {result &&
            <Table
              list={result.hits}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />}
            <div className="interactions">
              <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
                More
              </Button>
            </div>
        </div>
      </div>
    );
  }
}

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

class Table extends Component {
  render() {
    const { list, onDismiss } = this.props;
    return (
      <div className="table">
        {list.map(item => {
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
                <Button
                  onClick={() => onDismiss(item.objectID)}
                  type="button">
                  Dismiss
              </Button>
              </span>
            </div>
          )
        }
        )}
      </div>
    );
  }
}

const Button = ({
  onClick,
  className = '',
  children,
}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

export default App;
