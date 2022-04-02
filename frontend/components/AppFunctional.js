import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AppFunctional(props) {
  const [position, setPosition] = useState({ x: 2, y: 2 });
  const [timesMoved, setTimesMoved] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const s = timesMoved !== 1 ? "s" : "";

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      setMessage("Ouch: email is required");
    } else if (email === "foo@bar.baz") {
      setMessage("foo@bar.baz failure #71");
    } else {
      axios
        .post("http://localhost:9000/api/result", {
          x: position.x,
          y: position.y,
          steps: timesMoved,
          email: email,
        })
        .then((res) => {
          setMessage(res.data.message);
          setEmail("");
        })
        .catch((err) => {
          setMessage("Ouch: email must be a valid email");
          console.log(err);
        });
    }
  };

  const grid = [
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

  const removeStyle = () => {
    grid.forEach((pos, index) => {
      if (JSON.stringify(pos) === JSON.stringify(position)) {
        const element = document.querySelector(
          `#grid :nth-child(${index + 1})`
        );
        element.textContent = "";
        element.classList.remove("active");
      }
    });
  };

  useEffect(() => {
    grid.forEach((pos, index) => {
      if (JSON.stringify(pos) === JSON.stringify(position)) {
        const element = document.querySelector(
          `#grid :nth-child(${index + 1})`
        );
        element.textContent = "B";
        element.classList.add("active");
      }
    });
  }, [position]);

  const buttonClick = (e) => {
    switch (e.target.id) {
      case "up":
        if (position.y === 1) {
          setMessage("You can't go up");
        } else {
          removeStyle();
          setMessage("");
          setPosition({ x: position.x, y: position.y - 1 });
          setTimesMoved(timesMoved + 1);
        }
        break;
      case "down":
        if (position.y === 3) {
          setMessage("You can't go down");
        } else {
          removeStyle();
          setMessage("");
          setPosition({ x: position.x, y: position.y + 1 });
          setTimesMoved(timesMoved + 1);
        }
        break;
      case "left":
        if (position.x === 1) {
          setMessage("You can't go left");
        } else {
          removeStyle();
          setMessage("");
          setPosition({ x: position.x - 1, y: position.y });
          setTimesMoved(timesMoved + 1);
        }
        break;
      case "right":
        if (position.x === 3) {
          setMessage("You can't go right");
        } else {
          removeStyle();
          setMessage("");
          setPosition({ x: position.x + 1, y: position.y });
          setTimesMoved(timesMoved + 1);
        }
        break;
      case "reset":
        removeStyle();
        setMessage("");
        setTimesMoved(0);
        setPosition({ x: 2, y: 2 });
        setEmail("");
        break;
    }
  };

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">
          Coordinates ({position.x}, {position.y})
        </h3>
        <h3 id="steps">
          You moved {timesMoved} time{s}
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
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={buttonClick}>
          LEFT
        </button>
        <button id="up" onClick={buttonClick}>
          UP
        </button>
        <button id="right" onClick={buttonClick}>
          RIGHT
        </button>
        <button id="down" onClick={buttonClick}>
          DOWN
        </button>
        <button id="reset" onClick={buttonClick}>
          reset
        </button>
      </div>
      <form>
        <input
          id="email"
          type="email"
          value={email}
          onChange={handleEmail}
          placeholder="type email"
        ></input>
        <input id="submit" type="submit" onClick={handleSubmit}></input>
      </form>
    </div>
  );
}
