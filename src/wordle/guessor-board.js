import React from 'react';
import {Guess} from './board'
import Wordle from './wordle'
import WordleGuessor from './wordle-guessor'
import './board.css'

function ResultChooser(props) {
    let inputElements = [];
    for(let i=0; i <5; i++) {
        inputElements.push(
        <select className="tile"
        key={"chooser " + i}
        ref={props.refs[i]}>
            <option value="green" className="green">Green</option>
            <option value="yellow" className="yellow">Yellow</option>
            <option value="gray" className="gray">Gray</option>
        </select>);
    }
    return (
        <>
        {inputElements}
        </>
        );
}
class GuessBoard extends React.Component {
    constructor(props) {
        super(props);
        let backgrounds = []
        this.guessRefs = [];
        this.selectRefs = [];
        for (let i=0; i<5; i++) {
            this.selectRefs.push(React.createRef());
        }
        for (let i = 0; i < 6; i++) {
            this.guessRefs.push([]);
            backgrounds.push([]);
            for (let j = 0; j < 5; j++) {
                this.guessRefs[i].push(React.createRef());
                backgrounds[i].push("white");
            }
        }
        this.state = {
            guesses: Array(6).fill(""),
            backgrounds: backgrounds,
            numGuesses: 0,
            helpText: ''
        };
        this.game = new Wordle();
        this.guessor = new WordleGuessor(this.game);
        
        console.log(this.state.backgrounds);
        this.setState({});
    }

    onEnter(guessNum) {
        let inputRefs = this.guessRefs[guessNum];
        let word = '';
        inputRefs.forEach(ref => {
            word = word.concat(ref.current.value);
        });
        word = word.toLowerCase();
        console.log(word);
        if (!this.guessor.game.isWordValid(word)) {
            this.setState({helpText:"Invalid word!"});
            return;
        }
        let reportedResult = '';
        let tempBackgrounds = this.state.backgrounds;
        this.selectRefs.forEach((ref, i) => {
            tempBackgrounds[this.state.numGuesses][i] = ref.current.value;
            if (ref.current.value === "green") {
                reportedResult = reportedResult.concat('=');
            } else if (ref.current.value === "yellow") {
                reportedResult = reportedResult.concat('+');
            } else if (ref.current.value === "gray") {
                reportedResult = reportedResult.concat('-');
            } else {
                this.setState({helpText:"Please select results"});
                return;
            }
        });
        this.setState({background:tempBackgrounds});
        this.guessor.updateGameState(word, reportedResult);
        let numGuesses = this.state.numGuesses + 1;
        let newGuesses = [...this.state.guesses];
        newGuesses[guessNum] = word;
        this.setState({numGuesses:numGuesses, guesses: newGuesses});
    }

    onRestart() {
        let backgrounds = [];
        for (let i = 0; i < 6; i++) {
            backgrounds.push([]);
            for (let j = 0; j < 5; j++) {
                backgrounds[i].push("white");
                this.guessRefs[i][j].current.value='';
            }
        }
        this.setState({
            guesses: Array(6).fill(""),
            backgrounds: backgrounds,
            numGuesses: 0,
            helpText:''
        });
        this.game = new Wordle();
    }


    renderGuess(i) {
        let suggestedWord = null;
        if (i === this.state.numGuesses) {
            suggestedWord = this.guessor.generateGuess();
            console.log(suggestedWord);
        } else {
            suggestedWord = this.state.guesses[i];
        }
        return (
            <Guess inputRefs={this.guessRefs[i]}
            value={suggestedWord}
            key={"guess " + i}
            isEditable={i===this.state.numGuesses} 
            onEnter={()=>{
                if (i === this.state.numGuesses) {
                    this.onEnter(i);
                }
            }}
            background={this.state.backgrounds[i]}
            />
        );
    }

    render() {
        let rendered = [];
        for (let i = 0; i < 6; i++) {
            rendered.push(this.renderGuess(i));
        }
        return (
            <div>
                <h2>{this.state.helpText}</h2>
                <button title="Restart" onClick={() => this.onRestart()}>Restart</button>
                <div>
                    <p>Enter the result of the suggested guess here</p>
                    <ResultChooser refs={this.selectRefs}/>
                    {rendered}
                </div>
            </div>
        );
    }
}
export default GuessBoard