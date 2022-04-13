import "./App.css";
import React, { Component } from "react";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";

// const list = [
//   {
//     title: "React",
//     url: "https://reactjs.org/",
//     author: "Jordan Walke",
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: "Redux",
//     url: "https://redux.js.org/",
//     author: "Dan Abramov, Andrew Clark",
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];

//search the term for author or title
function isSearched(searchTerm) {
  return function (item) {
    return (
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
}

class App extends Component {
  constructor(props) {
    //sets this.props in constructor
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  //concatenate the old and new list of hits from the local stante and new result object
  setSearchTopStories(result) {
    const { hits, page } = result;

    //when 0, it's a new search request from componentDidMount or onSearchSubmit, the hits are empty. But when click the more button fetch paginated data the page isn't 0
    const oldHits = page !== 0 ? this.state.result.hits : [];

    //merge old and new hits from the recent API request
    const updateHits = [...oldHits, hits];

    this.setState({ result: { hits: updateHits, page } });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`
    )
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((error) => error);
  }

  //called after the render to fetch data from hacker news api
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  //update the local state with a search term
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  //fetches results from api when executing a search
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  //remove the item indentified by the id
  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id;
    const updateHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updateHits },
    });
  }

  render() {
    //destructured for the filter and map
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;

    //same as if(result ===null)
    if (!result) {
      return null;
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        {result ? (
          <Table list={result.hits} onDismiss={this.onDismiss} />
        ) : null}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

//button component for search
const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" value={value} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
);

class Table extends Component {
  render() {
    const { list, onDismiss } = this.props;
    return (
      <div className="table">
        {list.map((item) => (
          <div key={item.objectID} className="table-row">
            <span style={{ width: "30%" }}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: "30%" }}>{item.author}</span>
            <span style={{ width: "10%" }}>{item.num_comments}</span>
            <span style={{ width: "10%" }}>{item.points}</span>
            <span style={{ width: "20%" }}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline">
                Dismiss
              </Button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}

class Button extends Component {
  render() {
    const { onClick, className = "", children } = this.props;

    return (
      <button onClick={onClick} className={className} type="button">
        {children}
      </button>
    );
  }
}
// function App() {
//   return (
//     <div className="App">
//       {list.map((item) => {
//         return (
//           <div key={item.objectID}>
//             <span>
//               <a href={item.url}>{item.title}</a>
//             </span>
//             <span>{item.author}</span>
//             <span>{item.num_comments}</span>
//             <span>{item.points}</span>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

/* <form>
<input
  type="text"
  value={searchTerm}
  onChange={this.onSearchChange}
/>
</form>
{list.filter(isSearched(searchTerm)).map((item) => {
// //define wrapping function outside the method, to pass only the defined function to the handler
// const onHandleDismiss = () => this.onDismiss(item.objectID);
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
        onClick={() => this.onDismiss(item.objectID)}
        type="button">
        Dismiss
      </button>
    </span>
  </div>
);
})} */

// onDismiss(id) {
//   // function isNotId(item) {
//   //   return item.objectID !== id;
//   // }
//   // const updatedList = this.state.list.filter(isNotId);
//   // can do the same inline using arrow function
//   const updatedList = this.state.list.filter((item) => item.objectID !== id);

//   //update the list in the local component state
//   this.setState({ list: updatedList });
// }

// const Search = (props) => {
//   const { value, onChange, children } = props;
//   return (
//     <form>
//       {children} <input type="text" value={value} onChange={onChange} />
//     </form>
//   );
// };

// class Search extends Component {
//   render() {
//     const { value, onChange, children } = this.props;
//     return (
//       <form>
//         {children}
//         <input type="text" value={value} onChange={onChange} />
//       </form>
//     );
//   }
// }

export default App;
