//@ts-check
import Wordle from './wordle'
class WordleGuessor {
    /**
     * 
     * @param {Wordle} game 
     */
    // @ts-ignore
    constructor(game = null) {
        this.game = game;
        /** @type{string[]} */
        this.possibleWords = [];
        if (this.game !== null) {
            this.possibleWords = JSON.parse(JSON.stringify(game.wordSample));
        }
    }

    /**
     * Inputs the guess into the game
     * Used when game word is known
     * @param {string} word 
     */
    guessWord(word) {
        this.game.guessWord(word);
        this.possibleWords = this.possibleWords.filter(word => this.game.isWordPossible(word));
    }
    /**
     * Records the results of a guess when game word is unknown
     * @param {string} word 
     * @param {string} result 
     */
    updateGameState(word, result) {
        this.game.updateState(word.split(""), result.split(""));
        console.log(result);
        console.log(this.game.foundLetterPosition);
        console.log(this.game.foundLetterWrongPosition);
        console.log(this.game.wrongLetters);
        this.possibleWords = this.possibleWords.filter(word => this.game.isWordPossible(word));
        console.log(this.possibleWords);
    }

    /**
     * 
     * @param {Wordle} game 
     */
    newGame(game) {
        this.game = game;
        this.possibleWords = JSON.parse(JSON.stringify(game.wordSample));
    }

    /**
     * @returns {string} the best word according to the strategy
     */
    generateGuess() {
        if (this.game.attempts.length === 0) {
            return "raise";
        }
        let goodWords = [];
        let letterCounts = this.countLetterOccurences(this.possibleWords);
        goodWords = goodWords.concat(this.commonLettersStrategy(this.possibleWords, letterCounts).slice(0, 10));
        goodWords = goodWords.concat(this.maximizeInformationStrategy(this.game.wordSample, letterCounts).slice(0, 10));
        return this.findBestWord(goodWords);
    }

    /**
     * @param {Array<string>} words list of words to analyze, assumed to all be equal length
     * @returns {Array<Map<string, number>>} a list of length word length, where each element is the letter count for that position
     */
    countLetterOccurences(words) {
        /** @type {Array<Map<string, number>>} */
        let letterCounts = [];
        for (let i = 0; i < 5; i++) {
            letterCounts.push(new Map());
        }
        words.forEach(word => {
            for (let i = 0; i < word.length; i++) {
                if (letterCounts[i].has(word[i])) {
                    const prev = letterCounts[i].get(word[i]);
                    // @ts-ignore
                    letterCounts[i].set(word[i], prev + 1);
                } else {
                    letterCounts[i].set(word[i], 1);
                }
            }
        });
        return letterCounts;
    }

    /**
     * 
     * @param {string[]} wordsToRank 
     * @param {Map<string, number>[]} letterCounts 
     * @returns {string[]}
     */
    commonLettersStrategy(wordsToRank, letterCounts) {
        /** @type {[string, number][]} */
        let wordsWithScore = [];
        wordsToRank.forEach(word => {
            let score = 0;
            for (let i = 0; i < word.length; i++) {
                if (letterCounts[i].has(word[i])) {
                    // @ts-ignore
                    score += letterCounts[i].get(word[i]);
                }
            }
            wordsWithScore.push([word, score]);
        });
        wordsWithScore.sort((a, b) => b[1] - a[1]);
        return wordsWithScore.map(pair => pair[0]);
    }

    /**
     * @param {string[]} wordsToRank 
     * @param {Map<string, number>[]} letterCounts 
     * @returns {string[]}
     */
    maximizeInformationStrategy(wordsToRank, letterCounts) {
        /** @type{Map<string, number>} */
        let combinedCounts = new Map();
        /** @type {[string, number][]} */
        let wordsWithScore = [];
        /** @type {number} */
        let maxScore = 0;
        letterCounts.forEach(letterCount => {
            letterCount.forEach((value, key) => {
                if (!combinedCounts.has(key)) {
                    combinedCounts.set(key, value)
                } else {
                    // @ts-ignore
                    combinedCounts.set(key,combinedCounts.get(key) + value);
                }
            });
        });
        wordsToRank.forEach(word => {
            let score = 0;
            let checkedLetters = [];
            for (let i = 0; i < word.length; i++) {
                if (this.game.wrongLetters.has(word[i])) {
                    continue;
                } else if (this.game.foundLetterPosition.includes(word[i])) {
                    continue;
                }
                checkedLetters.push(word[i]);
                let firstLetters = word.slice(0, i);
                if (!firstLetters.includes(word[i])) {
                    if (combinedCounts.has(word[i])) {
                        // @ts-ignore
                        score += combinedCounts.get(word[i]);
                    }
                    if (letterCounts[i].has(word[i])) {
                        // @ts-ignore
                        score += letterCounts[i].get(word[i]);
                    }
                }
            }
            wordsWithScore.push([word,score])
        });
        wordsWithScore.sort((a, b) => b[1] - a[1]);
        return wordsWithScore.map(pair => pair[0]);
    }

    /**
     * 
     * @param {string} testWord 
     * @returns {Map<string, string[]>} map of possible result of guessing testWord to all the possible answers 
     * that would cause that result
     */
    calculateOptions(testWord) {
        let testGame = new Wordle();
        /** @type{Map<string, string[]>} */
        const options = new Map();
        this.possibleWords.forEach(possibleAnswer => {
            testGame.gameWord = possibleAnswer;
            const result = testGame.guessWord(testWord).join();
            if (options.has(result)) {
                // @ts-ignore
                options.get(result).push(possibleAnswer);
            } else {
                options.set(result, [possibleAnswer]);
            }
        });
        return options;
    }

    /**
     * 
     * @param {string[]} wordsToRank 
     */
    findBestWord(wordsToRank) {
        let bestWord = wordsToRank[0];
        let minOfMaxPossibleWords = this.possibleWords.length;
        wordsToRank.forEach(word => {
            let options = this.calculateOptions(word);
            let maxPossibleWords = 0;
            for (const answers of options.values()) {
                if (answers.length > maxPossibleWords) {
                    maxPossibleWords = answers.length;
                }
            };
            if (options.has("=,=,=,=,=")){
                maxPossibleWords -= 0.5;
            }
            if (maxPossibleWords < minOfMaxPossibleWords) {
                minOfMaxPossibleWords = maxPossibleWords;
                bestWord = word;
            }
        });
        return bestWord;
     }
}
export default WordleGuessor