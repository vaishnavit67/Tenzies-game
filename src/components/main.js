import React from "react"
import Die from "./die"
import {useState, useRef, useEffect} from "react"
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'
export default function Main(){

    const [time, setTime] = useState(0)
    const timeRef = useRef(null)

    function generateRandomNumbers(){
        return new Array(10).fill(0).map(() => ({
            id:nanoid(),
            value:Math.ceil(Math.random()*6),
            isHeld:false
        }));
    }

    const [diceArray, setDiceArray] = useState(() => generateRandomNumbers())
    const [count, setCount] = useState(0);

    function refresh(){
        if(gameWon){
            setDiceArray(generateRandomNumbers)
            setCount(0)
            setTime(0)
        }
        else{
            setDiceArray(prev => prev.map(die => die.isHeld ? die : {...die, value:Math.ceil(Math.random()*6)}))
            setCount(prev => prev+1)
        }
    }

    function hold(id){
        setDiceArray(prev => prev.map(die => id === die.id ? {...die, isHeld: !die.isHeld} : die))
    }

    const gameWon = diceArray.every(die => die.isHeld && die.value === diceArray[0].value)

    const buttonRef = useRef(null)

    useEffect(() => {
        if(gameWon){
            buttonRef.current.focus();
            clearInterval(timeRef.current)
            timeRef.current = null
        }
        else{
            if(!timeRef.current){
                timeRef.current = setInterval(() => {
                    setTime(prev => prev + 1)
                }, 1000)
            }
        }
    }, [gameWon])

    const diceElements = diceArray.map(die => (
        <Die 
            key={die.id}
            isHeld={die.isHeld}
            num={die.value}
            handleClick={() => hold(die.id)}
        />
      ));

    return(
        <main className="main">
            {gameWon && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
            <div className="main2">
                <p className="title">Tenzies</p>
                <p className="instructions">Roll until all dice are the same.<br/>Click each die to freeze it at its<br/>current value between rolls.</p>
                <div className="meter"><p>Count : {count}</p><p>Time : {time}</p></div>
                <div className="buttons">
                    {diceElements}
                </div>
                <div className="submit-flex">
                    <button ref={buttonRef} className="submit" id="submit" onClick={refresh}>{gameWon ? "New Game" : "Roll"}</button>
                </div>
            </div>
        </main>
    )
}