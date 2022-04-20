import React, { Component } from "react";
import "./App.css";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const largeColumn = {
  width: "40%",
};

const midColumn = {
  width: "30%",
};

const smallColumn = {
  width: "10%",
};

class App extends Component {
  constructor(props) {
    //sets this.props in constructor
    super(props);

    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  //concatenate the old and new list of hits from the local stante and new result object
  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    //when 0, it's a new search request from componentDidMount or onSearchSubmit, the hits are empty. But when click the more button fetch paginated data the page isn't 0
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    //merge old and new hits from the recent API request
    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
      isLoading: false,
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((error) => this.setState({ error }));
  }

  //called after the render to fetch data from hacker news api
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  //update the local state with a search term
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  //fetches results from api when executing a search
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  //remove the item indentified by the id
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
    });
  }

  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

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
        {error ? (
          <div className="interactions">
            <p>Something went wrong</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <ButtonWithLoading
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

//button component for search
//refactored to a class to use the lifecycle method dont has in functional stateless component
class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const { value, onChange, onSubmit, children } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={(el) => (this.input = el)}
        />
        <button type="submit">{children}</button>
      </form>
    );
  }
}
// const Search = ({ value, onChange, onSubmit, children }) => {
//   let input;
// (
//   <form onSubmit={onSubmit}>
//     <input type="text" value={value} onChange={onChange} ref={el => this.input = el} />
//     <button type="submit">{children}</button>
//   </form>
// );

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map((item) => (
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
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

const Button = ({ onClick, className = "", children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

//loading component to indicator a search request submits
const Loading = () => <div>Loading...</div>;

const withLoading =
  (Component) =>
  ({ isLoading, ...rest }) =>
    isLoading ? <Loading /> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

export default App;

export { Button, Search, Table };
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

// class Table extends Component {
//   render() {
//     const { list, onDismiss } = this.props;
//     return (
//       <div className="table">
//         {list.map((item) => (
//           <div key={item.objectID} className="table-row">
//             <span style={{ width: "30%" }}>
//               <a href={item.url}>{item.title}</a>
//             </span>
//             <span style={{ width: "30%" }}>{item.author}</span>
//             <span style={{ width: "10%" }}>{item.num_comments}</span>
//             <span style={{ width: "10%" }}>{item.points}</span>
//             <span style={{ width: "20%" }}>
//               <Button
//                 onClick={() => onDismiss(item.objectID)}
//                 className="button-inline">
//                 Dismiss
//               </Button>
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   }
// }

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
// function isSearched(searchTerm) {
//   return function (item) {
//     return (
//       item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };
// }
