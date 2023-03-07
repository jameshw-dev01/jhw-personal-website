
import React from 'react'
import {Board} from './board'
import GuessBoard from './guessor-board'
import NavBar from '../navbar'
export default class WordlePage extends React.Component {
    render() {
    return (
    <div class="gradient-background">
    <NavBar/>
    <h1 class="text-center text-primary">Wordle solver</h1>
    <p class="m-4">I was curious whether Wordle has a strategy that always allow a guess within 6 moves. 
    I created a solver that uses heuristics based on letter frequencies and showed that it is possible, given
    the limited word list of 2315 words. Wordle does accept more words, 
    but the correct answer will be drawn from that word list. My implementation is not "optimal"
    because it does not definitely minimize the average number of attempts, but it is good enough to never lose.
    In fact, it is possible that a better algorithm can guess all words in 5 guesses, since my algorithm only
    has about 10 words that take 6 guesses. </p>
    <div class="row">
        <div class="col-md-6 d-flex justify-content-center">
            <div class="text-center">
                <h3>My Wordle copy</h3>
                <Board/>
            </div>
        </div>
        <div class="col-md-6 d-flex justify-content-center">
            <div class="text-center">
                <h3>Wordle solver</h3>
                <GuessBoard/>
            </div>
        </div>
    </div>
    </div>)
    }
}