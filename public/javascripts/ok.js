// var temp = document.querySelector("div #clock");
// var g = document.createElement("div");
// var A = document.createElement('a')
// A.setAttribute("href", "/register");
// var p = document.createElement("button")
// p.setAttribute("class", "btn btn-success")
// p.innerHTML="Click"
// A.appendChild(p)
// g.appendChild(A)
// temp.appendChild(g)

import React from 'react';
document.querySelector('input').focus()
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('clock')
);