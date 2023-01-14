let fs = require('fs');

let text = fs.readFileSync("src/wordle/wordle-answers-alphabetical.txt").toString('utf-8');
let words = text.split('\n');
let json = {"words": words}
fs.writeFileSync('src/wordle/words.json', JSON.stringify(json));