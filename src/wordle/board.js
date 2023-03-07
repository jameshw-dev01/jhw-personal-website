import React from 'react'
import Wordle from './wordle'
import './board.css'

class Guess extends React.Component {
    /**
     * @param {React.KeyboardEvent} keyEvent 
     * @param {number} i 
     */
    keyUp(keyEvent, i) {
        if (keyEvent.key === "Backspace") {
            if (this.props.inputRefs[i].current.value === ""
            && i > 0 && keyEvent) {
                this.props.inputRefs[i - 1].current.focus();
            }
        }
        else if (i < 4) {
            this.props.inputRefs[i + 1].current.focus();
        }
    }
    keyDown(keyEvent, i) {
        console.log(keyEvent);
        if (keyEvent.keyCode === 13 && i===4) {
            this.props.onEnter();
        }
    }
    render() {
        let inputElements = [];
        for (let i = 0; i < 5; i++) {
            inputElements.push(
            <input className={"tile " + this.props.background[i]}
                onKeyUp={keyEvent=> this.keyUp(keyEvent, i)} 
                maxLength={1}
                value={this.props.value[i]}
                onChange={event => this.props.onChange(event, i)}
                ref={this.props.inputRefs[i]}
                onKeyDown={keyEvent => this.keyDown(keyEvent, i)} 
                enterKeyHint={i < 4 ? "next": "done"}
                disabled={!this.props.isEditable}>
                </input>)
        }
        return (
            <div>
                {inputElements}
            </div>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        let backgrounds = []
        this.guessRefs = [];
        for (let i = 0; i < 6; i++) {
            this.guessRefs.push([]);
            backgrounds.push([]);
            for (let j = 0; j < 5; j++) {
                this.guessRefs[i].push(React.createRef());
                backgrounds[i].push("white");
            }
        }
        this.state = {
            guesses: Array.from(Array(6), () => new Array(5).fill("")),
            backgrounds: backgrounds,
            numGuesses: 0,
            helpText: '',
            game: new Wordle()
        };
        this.setState({});
    }

    onChange(event, i) {
        let newGuesses = [...this.state.guesses];
        newGuesses[this.state.numGuesses] = [...newGuesses[this.state.numGuesses]];
        newGuesses[this.state.numGuesses][i] = event.target.value;
        this.setState({guesses: newGuesses});
    }

    onEnter(guessNum) {
        let word = this.state.guesses[this.state.numGuesses].join("");
        word = word.toLowerCase();
        try {
            let ans = this.state.game.guessWord(word);
            let tempBackground = this.state.backgrounds;
            ans.forEach((result, index) => {
                if (result === '=') {
                    tempBackground[guessNum][index] = "green";
                } else if (result === '+') {
                    tempBackground[guessNum][index] = "yellow";
                } else {
                    tempBackground[guessNum][index] = "gray";
                }
            })
            let numGuesses = this.state.numGuesses;
            this.setState({numGuesses:this.state.numGuesses+1});
            this.setState({background:tempBackground});
            if (this.state.game.won) {
                this.setState({helpText:"Congratulations! "});
            } else if (numGuesses > 5) {
                this.setState({helpText:"Too bad, the word was " + this.state.game.gameWord});
            } else {
                this.setState({helpText:""})
            }
        }
        catch (error){
            console.log(error);
            this.setState({helpText:"Invalid word!"});
        }
    }

    onRestart() {
        let backgrounds = [];
        for (let i = 0; i < 6; i++) {
            backgrounds.push([]);
            for (let j = 0; j < 5; j++) {
                backgrounds[i].push("white");
            }
        }
        this.setState({
            guesses: Array.from(Array(6), () => new Array(5).fill("")),
            backgrounds: backgrounds,
            numGuesses: 0,
            helpText:'',
            game: new Wordle()
        });
    }


    renderGuess(i) {
        return (
            <Guess key={"wordleRow" + i}
            inputRefs={this.guessRefs[i]}
            isEditable={i===this.state.numGuesses} 
            onEnter={()=>{
                if (i === this.state.numGuesses) {
                    this.onEnter(i);
                }
            }}
            onChange={(event, j)=>{
                if (i === this.state.numGuesses) {
                    this.onChange(event, j);
                }}
            }
            value={this.state.guesses[i]}
            background={this.state.backgrounds[i]}
            />
        );
    }

    render() {
        let guesses = [];
        for (let i = 0; i < 6; i++) {
            guesses.push(this.renderGuess(i))
        }
        return (
            <div>
            <h2>{this.state.helpText}</h2>
            <button title="Restart" onClick={() => this.onRestart()}>Restart</button>
                {guesses}
            </div>
        );
    }
}
export {Guess, Board}