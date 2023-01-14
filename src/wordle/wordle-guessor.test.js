//@ts-check
import wordleWords from './words.json'
import Wordle from './wordle'
import WordleGuessor from './wordle-guessor'
let words = wordleWords["words"];
describe("All words can be guessed", () => 
{
    let guessor = new WordleGuessor();
    for (let i=0; i<words.length; i++) {
        test("test " + words[i], () => {
            let game = new Wordle(words);
            game.gameWord = words[i];
            //console.log("testing ", words[i]);
            guessor.newGame(game);
            while (!game.won && game.attempts.length < 10) {
                let guess = guessor.generateGuess();
                guessor.guessWord(guess);
            }
            if (game.attempts.length > 6) {
                expect(game.attempts).toBeFalsy();
            }
            expect(game.attempts.length).toBeLessThanOrEqual(6);
        });
    }

    test("test letter counts", () => {
        let testWords = ["raise", "arose"]
        let result = guessor.countLetterOccurences(testWords);
        console.log(result);
        expect(result[0].get("r")).toBe(1);
        expect(result[3].get("s")).toBe(2);
        expect(result[4].get("e")).toBe(2);
    });

    test("test best word", () => {
        let testWords = ['aback', 'adapt', 'adult', 'album', 'alpha', 'awful']
        let game = new Wordle(testWords);
        game.gameWord = "wrote";
        guessor.newGame(game);
        let result = guessor.findBestWord(testWords);
        expect(guessor.calculateOptions("aback")).toBeTruthy();
        expect(result).toBeTruthy();
    });
});

test("test willy", () => {
    let game = new Wordle(words);
    let guessor = new WordleGuessor();
    game.gameWord = "willy";
    guessor.newGame(game);
    guessor.guessWord("raise");
    guessor.guessWord("minty");
    let letters = guessor.countLetterOccurences(guessor.possibleWords);
    let result = guessor.maximizeInformationStrategy(game.wordSample, letters);
});