let EOF = -1

class CalcTokenizer {
	constructor(input) {
		this.input = input
		this.c = input[0]
		this.p = 0
	}

	tokenize () {
		let tokens = []

		for (let t = this.nextToken(); t !== EOF; t = this.nextToken()) {
			tokens.push(t)
		}

		return tokens
	}

	nextToken () {
		while (this.c !== EOF) {
			if (/\s/.test(this.c)) {
				this.consume()
				continue
			} else if (['(', ')', '+', '-', '/', ',', '='].indexOf(this.c) > -1) {
				return this.symbol()
			} else if (this.c === '*') {
				this.consume()
				if (this.c === '*') {
					this.consume()
					return '**'
				} else {
					return '*'
				}
			} else if (this.c === '!') {
				this.c = '-'
				if (this.isNumber(this.input[this.p + 1])) {
					// this is a negative number
					return this.number()
				} else {
					throw 'Illegal: ' + this.c
				}
			} else if (this.isNumber(this.c)) {
				return this.number()
			} else if (this.isCharacter(this.c)) {
				return this.functionOrVariableName()
			} else {
				throw 'Illegal: ' + this.c
			}
		}

		return EOF
	}

	isCharacter (c) {
		return /^[a-z]$/.test(c)
	}

	isNumber (d) {
		return /^[0-9.]$/.test(d)
	}

	symbol () {
		let c = this.c
		this.consume()
		return c
	}

	number () {
		let result = []
		// allow negatives at the front only
		if (this.c === '-') {
			result.push('-')
			this.consume()
		}

		do {
			result.push(this.c)
			this.consume()
		} while (this.c === '.' || this.isNumber(this.c))

		let numStr = result.join('')
		if (/^.*\..*\..*$/.test(numStr)) {
			throw 'Invalid number: ' + numStr
		}
		return numStr
	}

	functionOrVariableName () {
		let result = []
		do {
			result.push(this.c)
			this.consume()
		} while (this.isCharacter(this.c))

		return result.join('')
	}

	consume () {
		this.p++
		if (this.p < this.input.length) { this.c = this.input[this.p] }
		else { this.c = EOF }
	}
}

export default CalcTokenizer