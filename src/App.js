// Styles
import "./index.css";
// Assets
import { wordsArray } from "./assets/words";
// Hooks
import { useState, useEffect, useRef } from "react";

function App() {
  useEffect(() => {
    document.addEventListener("keydown", compareKey);
    return () => document.removeEventListener("keydown", compareKey)
  });

  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [collide, setCollide] = useState(false)
  const [score, setScore] = useState(0)
  const [life, setLife] = useState(3)
  const [start, setStart] = useState(false)
  const [speed, setSpeed] = useState(10)

  const borderRef = useRef()
  const wordRef = useRef()

  useEffect(() => {
    if (text.length === 0 || collide) {
      setText(wordsArray[index])
      setIndex(index + 1)
      setCollide(false)

      if (text.length === 0 && index >= 1) {
        setScore(score + 1)
        if (speed >= 4) {
          setSpeed(speed - (score / 10))
        }
      }
      else if (collide && life) {
        setLife(life - 1)
      }
    }

    if (wordRef.current) {
      wordRef.current.style.animation = `animate-text ${speed}s linear`
    }
  })

  useEffect(() => {
    const interval = setInterval(collisionDetect, 100)
    return () => clearInterval(interval)
  }, [])

  function compareKey(e) {
    if (text.length) {
      if (String.fromCharCode(e.which) === text[0].toUpperCase()) {
        setText(text.substring(1, text.length))
      }
    }
  }

  function collisionDetect() {
    if (borderRef.current && wordRef.current) {
      let rect1 = borderRef.current.getBoundingClientRect()
      let rect2 = wordRef.current.getBoundingClientRect()

      if (rect1.left > rect2.left) {
        setCollide(true)
      } else {
        setCollide(false)
      }
    }
  }

  function onStart() {
    setStart(true)
    setScore(0)
    setLife(3)
    setSpeed(10)
    if (index > 1) {
      setIndex(1)
      setText(wordsArray[0])
    }
  }

  return (
    <>
      <div className="container" ref={borderRef}>
        {start && life ?
          <><div key={index} className="scroll-text" ref={wordRef}>
            <h1>{text}</h1>
          </div>
            <div className="game-bar">
              <h3>Score: {score}</h3>
              <div className="game-life">
                <h3>Life:</h3>
                {life ? Array(life).fill(0).map((v, index) => <span key={index} className="game-life-dot"></span>) :
                  ''}
              </div>
            </div></> :
          <button className="btn" onClick={onStart}>Start</button>}
      </div>
    </>
  );
}

export default App;
