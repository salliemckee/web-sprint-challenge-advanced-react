import React from "react";
import axios from "axios";

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: { x: 2, y: 2 },
      timesMoved: 0,
      message: "",
      email: "",
      s: "s",
    };

    this.handleEmail = this.handleEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeStyle = this.removeStyle.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
  }

  handleEmail(e) {
    this.setState({ ...this.state, email: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.email.trim() === "") {
      this.setState({ ...this.state, message: "Ouch: email is required" });
    } else if (this.state.email === "foo@bar.baz") {
      this.setState({ ...this.state, message: "foo@bar.baz failure #71" });
    } else {
      axios
        .post("http://localhost:9000/api/result", {
          x: this.state.position.x,
          y: this.state.position.y,
          steps: this.state.timesMoved,
          email: this.state.email,
        })
        .then((res) => {
          this.setState({
            ...this.state,
            message: res.data.message,
            email: "",
          });
        })
        .catch((err) => {
          this.setState({
            ...this.state,
            message: "Ouch: email must be a valid email",
          });
          console.log(err);
        });
    }
  }

  grid = [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
  ];

  removeStyle() {
    this.grid.forEach((pos, index) => {
      if (JSON.stringify(pos) === JSON.stringify(this.state.position)) {
        const element = document.querySelector(
          `#grid :nth-child(${index + 1})`
        );
        element.textContent = "";
        element.classList.remove("active");
      }
    });
  }

  componentDidUpdate() {
    this.grid.forEach((pos, index) => {
      if (JSON.stringify(pos) === JSON.stringify(this.state.position)) {
        const element = document.querySelector(
          `#grid :nth-child(${index + 1})`
        );
        element.textContent = "B";
        element.classList.add("active");
      }
    });
  }

  buttonClick(e) {
    switch (e.target.id) {
      case "up":
        if (this.state.position.y === 1) {
          this.setState({ ...this.state, message: "You can't go up" });
        } else {
          this.removeStyle();
          this.setState({
            ...this.state,
            position: {
              x: this.state.position.x,
              y: this.state.position.y - 1,
            },
            message: "",
            timesMoved: this.state.timesMoved + 1,
            s: this.state.timesMoved + 1 === 1 ? "" : "s",
          });
        }
        break;
      case "down":
        if (this.state.position.y === 3) {
          this.setState({ ...this.state, message: "You can't go down" });
        } else {
          this.removeStyle();
          this.setState({
            ...this.state,
            position: {
              x: this.state.position.x,
              y: this.state.position.y + 1,
            },
            message: "",
            timesMoved: this.state.timesMoved + 1,
            s: this.state.timesMoved + 1 === 1 ? "" : "s",
          });
        }
        break;
      case "left":
        if (this.state.position.x === 1) {
          this.setState({ ...this.state, message: "You can't go left" });
        } else {
          this.removeStyle();
          this.setState({
            ...this.state,
            position: {
              x: this.state.position.x - 1,
              y: this.state.position.y,
            },
            message: "",
            timesMoved: this.state.timesMoved + 1,
            s: this.state.timesMoved + 1 === 1 ? "" : "s",
          });
        }
        break;
      case "right":
        if (this.state.position.x === 3) {
          this.setState({ ...this.state, message: "You can't go right" });
        } else {
          this.removeStyle();
          this.setState({
            ...this.state,
            position: {
              x: this.state.position.x + 1,
              y: this.state.position.y,
            },
            message: "",
            timesMoved: this.state.timesMoved + 1,
            s: this.state.timesMoved + 1 === 1 ? "" : "s",
          });
        }
        break;
      case "reset":
        this.removeStyle();
        this.setState({
          ...this.state,
          position: {
            x: 2,
            y: 2,
          },
          message: "",
          timesMoved: 0,
          email: "",
          s: "s",
        });
        break;
    }
  }

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">
            Coordinates ({this.state.position.x}, {this.state.position.y})
          </h3>
          <h3 id="steps">
            You moved {this.state.timesMoved} time{this.state.s}
          </h3>
        </div>
        <div id="grid">
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square active">B</div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.buttonClick}>
            LEFT
          </button>
          <button id="up" onClick={this.buttonClick}>
            UP
          </button>
          <button id="right" onClick={this.buttonClick}>
            RIGHT
          </button>
          <button id="down" onClick={this.buttonClick}>
            DOWN
          </button>
          <button id="reset" onClick={this.buttonClick}>
            reset
          </button>
        </div>
        <form>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.handleEmail}
          ></input>
          <input id="submit" type="submit" onClick={this.handleSubmit}></input>
        </form>
      </div>
    );
  }
}
