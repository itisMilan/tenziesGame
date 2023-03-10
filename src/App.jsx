//
import React from "react";
import "./App.css";
import Die from "./Die";
import { v4 as uuid } from "uuid";
import Confetti from 'react-confetti'
import Scores from "./Scores";

//

function App() {
 
  //Setup a state to store the value of the dice.
  const [dice, setDice] = React.useState(createDice());
  const [tenzies,setTenzies]=React.useState(false)
  const [scores,setScores]=React.useState(0)
  const[highscore,setHighScore]=React.useState()

  React.useEffect(()=>{
    if(tenzies){
      let storage=JSON.parse(localStorage.getItem('scores'))||[]

      storage.push(scores)
      
      let arraySort=storage.sort((a,b)=>a-b);
      let highScore=arraySort[0]
      setHighScore(highScore)
      localStorage.setItem('scores',JSON.stringify(storage))
      
      
      console.log(highScore)
    }
  },[tenzies])

  React.useEffect(()=>{
   let firstValue=dice[0].value;
   let everyValue=dice.every(die=>{
   return die.isHold && firstValue==die.value})
   console.log(everyValue)
   if(firstValue && everyValue ){
    console.log("You Won")
     setTenzies(true) 
   }
  },[dice])

  //Create the function to create an object to the dice state
  function createDice() {
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(
        {
          id: uuid(),//Creates A Unique Id
          value: Math.ceil(Math.random() * 6),
          isHold: false,
        },
      );
    }
    return arr;
  }
  function holdIt(id){
    setDice(prevDice=>{

      return prevDice.map(die=>{
        return die.id===id?{...die,isHold:!die.isHold}:die
      })
    }

    )
  }

  // console.log(dice)
  //Create the function to change the values everytime the roll button is clicked
  function diceRoll() {
    if(!tenzies){
      setScores(prevScore=>prevScore+1)

      setDice(prevDice=>{
        return prevDice.map(die=>{
          return die.isHold==true?die:{...die, id: uuid(), value: Math.ceil(Math.random() * 6)}
        })
      }
      );
    }else{
      setScores(0)
      setTenzies(false);
      setDice(createDice())
    }
  }
  console.log(scores)
  //Map through the values of the dice state and pass the value as props to the single component
  const dieElements = dice.map((die) => {
    // console.log(die);
    return <Die value={die.value} isHold={die.isHold} holdIt={()=>{holdIt(die.id)}} />;
  });

  return (
    <div className="App">
      <div className="celebration">
        {tenzies&&<Confetti/>}

    </div>
      <main className="Main">
        <div className="heading">

        <h1>Tenzies</h1>
        <p>Roll Until All Dice Are The Same. Click each die to freeze it at its current value between rolls.</p>
        </div>
        <div className="container">

        {dieElements}
        </div>

        <button className="roll" onClick={diceRoll}>
         <span >
           {tenzies?"Play Again":"ROLL"}
          </span>
        </button>
      </main>
      {tenzies&&
      <Scores Scores={scores} highScore={highscore}/>
    }
    </div>
  );
}

export default App;
