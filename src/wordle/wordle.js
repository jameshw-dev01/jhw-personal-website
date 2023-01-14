//@ts-check
import wordleWords from './words.json'
class Wordle {
    /**@param {Array<string>} words */
    constructor(words = null) {
        if (words == null) {
            words = wordleWords["words"];
        }
        let rand = Math.floor(Math.random() * words.length)
        this.gameWord = words[rand];
        this.wordSample = words;
        /** @type {Set<String>} */
        this.wordSet = new Set();
        words.forEach(word => this.wordSet.add(word))
        this.won = false;
        this.attempts = [];
        /** @type {Array<string>} */
        this.foundLetterPosition = [null, null, null, null, null];
        /** @type {Set<string>} */
        this.foundLetterWrongPosition = new Set();
        /** 
         * @type {Set<string>} 
         * Note that wordle can return grey tiles if a guess has
         * 2 letters but only 1 letter in the word. In this case
         * the letter is not added to the set.
        */
        this.wrongLetters = new Set();
    }

    /** 
     * @param {string} word
     * @returns {boolean} */
    isWordValid(word) {
        return this.wordSet.has(word);
    }

    /** 
     * @param {string} word
     * @returns {boolean} */
    isWordPossible(word) {
        for (let i = 0; i < word.length; i++) {
            if (this.wrongLetters.has(word[i])) {
                return false;
            }
        }
        for (let i = 0; i < word.length; i++) {
            if (this.foundLetterPosition[i] !== null && word[i] !== this.foundLetterPosition[i]) {
                return false;
            }
            if (this.foundLetterWrongPosition.has(JSON.stringify([word[i], i]))) {
                return false;
            }
        }
        let letters = new Set(word.split(''));
        for (let letterPos of this.foundLetterWrongPosition) {
            if (!letters.has(JSON.parse(letterPos)[0])) {
                return false;
            }
        }
        return true;
    }

    /** @param {string} word 
     * @returns {Array<string>}
    */
    guessWord(word) {
        if (!this.isWordValid(word)) {
            throw new Error("Not in word list")
        }
        this.attempts.push(word);
        let result = ['-', '-', '-', '-', '-'];
        for (let i = 0; i < 5; i++) {
            let char = word[i];
            if (char === this.gameWord[i]) {
                this.foundLetterPosition[i] = char
                result[i] = '=';
            } 
            else if (this.gameWord.includes(char)) {
                // Only sets if less or equal number of letters
                this.foundLetterWrongPosition.add(JSON.stringify([char, i]));
                
                if (word.slice(0, i).split("").filter(value => value === char).length
                <= this.gameWord.split("").filter(value => value === char).length) {
                    result[i] = '+';
                }
            } 
            else {
                this.wrongLetters.add(char);
            }
        }
        if (result.every(char => char === '=')) {
            this.won = true;
        }
        return result;
    }

    /**
     * @param {Array<string>} guessed
     * @param {Array<string>} result
     */
    updateState(guessed, result) {
        this.attempts.push(guessed);
        result.forEach((resultAtI, i) => {
            let guessedChar = guessed[i];
            if (resultAtI === '=') {
                this.foundLetterPosition[i] = guessedChar;
            } else if (resultAtI === '+') {
                this.foundLetterWrongPosition.add(JSON.stringify([guessedChar, i]));
            } else {
                // wordle gives negative for repeated letters, which must be filtered
                let knownLetters = new Set();
                this.foundLetterWrongPosition.forEach(pair => {
                    knownLetters.add(JSON.parse(pair)[0]);
                });
                if (!knownLetters.has(guessedChar) 
                && !this.foundLetterPosition.includes(guessedChar)) {
                    this.wrongLetters.add(guessedChar);
                }
            }
        });
    }
}
export default Wordle