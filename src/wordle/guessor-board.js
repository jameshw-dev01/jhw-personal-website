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
        let game = new Wordle();
        let guessor = new WordleGuessor(game);
        let guesses = Array.from(Array(6), () => new Array(5).fill(""));
        const newGuess = guessor.generateGuess();
        guesses[0] = newGuess.split("");
        this.state = {
            guesses: guesses,
            backgrounds: backgrounds,
            numGuesses: 0,
            helpText: '',
            game: game,
            guessor: guessor
        };
    }

    onEnter() {
        let word = this.state.guesses[this.state.numGuesses].join("");
        word = word.toLowerCase();
        if (!this.state.guessor.game.isWordValid(word)) {
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
        this.state.guessor.updateGameState(word, reportedResult);
        const newGuess = this.state.guessor.generateGuess();
        let newGuesses = [...this.state.guesses];
        newGuesses[this.state.numGuesses+1] = newGuess.split("");
        this.setState({numGuesses:this.state.numGuesses+1, guesses: newGuesses});
    }

    onChange(event, i) {
        let newGuesses = [...this.state.guesses];
        newGuesses[this.state.numGuesses] = [...newGuesses[this.state.numGuesses]];
        newGuesses[this.state.numGuesses][i] = event.target.value;
        this.setState({guesses: newGuesses});
    }

    onRestart() {
        let backgrounds = [];
        for (let i = 0; i < 6; i++) {
            backgrounds.push([]);
            for (let j = 0; j < 5; j++) {
                backgrounds[i].push("white");
            }
        }
        let newGame = new Wordle();
        let newGuesses = Array.from(Array(6), () => new Array(5).fill(""))
        const newGuess = this.state.guessor.generateGuess();
        newGuesses[0] = newGuess.split("");
        this.setState({
            guesses:  newGuesses,
            backgrounds: backgrounds,
            numGuesses: 0,
            helpText:'',
            game: newGame,
            guessor: new WordleGuessor(newGame)
        });
        
        this.setState({guesses: newGuesses});
    }


    renderGuess(i) {
        return (
            <Guess inputRefs={this.guessRefs[i]}
            value={this.state.guesses[i]}
            key={"guess " + i}
            isEditable={i===this.state.numGuesses}
            onEnter={()=>{
                if (i === this.state.numGuesses) {
                    this.onEnter();
                }
            }}
            onChange={(event, j)=>{
                if (i === this.state.numGuesses) {
                    this.onChange(event, j);
                }}
            }
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
                    <p>Enter the result of the suggested guess, or your own word, here</p>
                    <ResultChooser refs={this.selectRefs}/>
                    {rendered}
                </div>
            </div>
        );
    }
}
export default GuessBoard