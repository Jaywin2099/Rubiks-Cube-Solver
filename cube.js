/**
 * impliments a circular array data structure
 * the zero index can be set using the setZeroIndex(int index) method
 * offset can also be specified in the get(int index, int startIndex) method.
 */
class CircularArray {
	constructor(length) {
		this.startIndex = 0;
		this.i = 0;
		this.length = length;
		this.data = [];
	}

	checkRangeError(i) {
		if (i <= -1 * this.length) {
			return i + this.length;
		} else if (i >= this.length) {
			return i - this.length;
		}
	}

	setZeroIndex(i) {
		this.startIndex = i;
	}

	offsetZeroIndex(offset) {
		this.startIndex += offset;

		if (this.startIndex >= this.length) {
			this.startIndex -= this.length;
		} else if (this.startIndex <= this.length) {
			this.startIndex += this.length;
		}
	}

	get(i, startIndex = 0) {
		return this.data[(((i + startIndex + this.startIndex) % this.length) + this.length) % this.length];
	}

	push(data) {
		return this.data.push(data);
	}
}
class Cube {
	constructor() {
		this.cube = [];

		this.MOVES = ['u', 'f', 'r', 'b', 'l', 'd'];

		// creates 6 circular arrays that prepresent each face
		for (let i = 0; i < 6; i++) this.cube.push(new CircularArray(8));

		// fills cube state with 8 pieces per face
		// (the center piece is held in each index of the cube array)
		// the index/center correspond to a different color
		for (let i = 0; i < 8 * 6; i++) {
			let face = Math.floor(i / 8);

			// objects used so that i can use abstract references
			this.cube[face].push({ color: face });
		}

		this.orientation = 0;

		// make object with descriptive names
		this.orientations = [
			{ order: [0, 1, 2, 3, 4], startIndex: [0, 0, 0, 0, 0] }, // 0 = u
			{ order: [1, 5, 2, 0, 4], startIndex: [0, 0, 6, 4, 2] }, // 1 = f
			{ order: [2, 1, 5, 3, 0], startIndex: [2, 2, 2, 6, 2] }, // 2 = r
			{ order: [3, 0, 2, 5, 4], startIndex: [4, 2, 2, 4, 6] }, // 3 = b
			{ order: [4, 0, 3, 5, 1], startIndex: [4, 6, 2, 6, 6] }, // 4 = l
			{ order: [5, 4, 3, 2, 1], startIndex: [2, 4, 4, 4, 4] } // 5 = d
		];
	}

	scramble(numMoves = 21) {
		// picks numMoves random moves and takes them
		for (let i = 0; i < numMoves; i++) {
			this.takeRandomMove();
		}
	}

	addMoves(moves) {
		this.nextMoves = moves.split(' ');
	}

	step() {
		if (this.nextMoves.length > 0) {
			this.move(this.nextMoves.shift());
		} else {
			console.log('tried to step but failed...');
		}
	}

	setOrientation(orientation) {
		this.orientation = orientation;
	}

	U() {
		let { order, startIndex } = this.orientations[this.orientation];

		// rotates the top face
		this.cube[order[0]].offsetZeroIndex(-2);
		/* literally: offsets the zero index of a circular array by two
		if you think of the elements in the array as digits 0-7, it accomplishes this:
			
			0 1 2      6 7 0
			7 . 3  =>  5 . 1
			6 5 4      4 3 2,

		which is practically the same as a clockwise face movement
		*/

		// rotates the first 3 tiles for the 4 sides' faces clockwise
		for (let i = 0; i < 3; i++) {
			let prev = -1;

			for (let j = 4; j >= 1; j--) {
				// gets the first piece in the face's top row
				let piece = this.cube[order[j]].get(i, startIndex[j]);

				// keeps its color
				let next = piece.color;

				// the piece's color is replaced with the previous piece's color
				piece.color = prev;

				prev = next; // remembers old color for next
			}

			// the last piece's color replaces the first's
			this.cube[order[4]].get(i, startIndex[4]).color = prev;
		}
	}

	Uprime() {
		let { order, startIndex } = this.orientations[this.orientation];

		// rotates the top face
		this.cube[order[0]].offsetZeroIndex(2);

		for (let i = 0; i < 3; i++) {
			let prev = -1;

			for (let j = 1; j <= 4; j++) {
				// gets the first piece in the face's top row
				let piece = this.cube[order[j]].get(i, startIndex[j]);

				// keeps its color
				let next = piece.color;

				// the piece's color is replaced with the previous piece's color
				piece.color = prev;

				prev = next; // remembers old color for next
			}

			// the last piece's color replaces the first's
			this.cube[order[1]].get(i, startIndex[1]).color = prev;
		}
	}

	getCube() {
		return this.getGridCube();
	}

	/**
	 * takes a move (u,f,r,l,d,b), orients the main cube so that the
	 * desired side is on the top, then does a U or U'
	 * @param {String} movement
	 */
	move(movement) {
		this.orientation = this.MOVES.indexOf(movement[0].toLowerCase());

		if (this.orientation > 5 || this.orientation < 0) throw RangeError('Orientation out of range.');

		movement.includes("'") ? this.Uprime() : this.U();
	}

	getGridCube() {
		let faces = [];

		// this is shit
		for (let i = 0; i < 6; i++) {
			faces.push([
				[this.cube[i].get(0).color, this.cube[i].get(1).color, this.cube[i].get(2).color],
				[this.cube[i].get(7).color, i, this.cube[i].get(3).color],
				[this.cube[i].get(6).color, this.cube[i].get(5).color, this.cube[i].get(4).color]
			]);
		}

		return faces;
	}

	isSolved() {
		for (let i = 0; i < 48; i++) {
			let face = Math.floor(i / 8);

			// checks if the color of each piece is the same as the "center" for every face
			if (this.cube[face].get(i % 8).color != face) return false;
		}

		return true;
	}

	generateRandomMove() {
		let prime = Math.random() > 0.5 ? "'" : '';
		return this.MOVES[Math.floor(Math.random() * 6)] + prime;
	}

	takeRandomMove() {
		this.move(this.generateRandomMove());
	}
}
