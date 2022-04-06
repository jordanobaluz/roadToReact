import "./App.css";
import { Component } from "react";
import { render } from "@testing-library/react";

const list = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

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
      list,
      searchTerm: "",
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  //remove the item indentified by the id
  onDismiss(id) {
    // function isNotId(item) {
    //   return item.objectID !== id;
    // }
    // const updatedList = this.state.list.filter(isNotId);
    // can do the same inline using arrow function
    const updatedList = this.state.list.filter((item) => item.objectID !== id);

    //update the list in the local component state
    this.setState({ list: updatedList });
  }

  render() {
    return (
      <div className="App">
        <form>
          <input type="text" onChange={this.onSearchChange} />
        </form>
        {this.state.list
          .filter(isSearched(this.state.searchTerm))
          .map((item) => {
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
          })}
      </div>
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

export default App;
