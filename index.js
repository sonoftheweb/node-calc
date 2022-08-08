import readline from 'node:readline'
import CalcTokenizer from './CalcTokenizer.js'
import CalcParser from './CalcParser.js'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let token = []

rl.setPrompt('> ')
rl.prompt()

rl.on('line',  (input) => {
	try {
		if (input === 'c') {
			token = []
		} else {
			token = [...token, ...new CalcTokenizer(input.trim()).tokenize()]
		}

		console.log(token);

		if (token.includes('=')) {
			if (token[token.length - 1] === '=') {
				token.splice(token.length - 1, 1);
			}
			token = [new CalcParser(token).evaluate(token)]
			console.log("> ", token[0])
		} else {
			if (!token.length) {
				console.log(0)
			} else {
				console.log(token[token.length - 1]);
			}
		}
	} catch (e) {
		console.log("Error: ", e)
	}
	rl.prompt()
}).on('SIGINT', function () {
	rl.close()
}).on('close', function () {
	process.exit(0);
});