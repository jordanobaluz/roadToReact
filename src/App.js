import logo from "./logo.svg";
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

class App extends Component {
  constructor(props) {
    //sets this.props in constructor
    super(props);

    this.list = {
      list: list,
    };

    this.onDismiss = this.onDismiss.bind(this);
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
        {this.state.list.map((item) => (
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
        ))}
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
