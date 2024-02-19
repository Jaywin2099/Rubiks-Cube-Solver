/**
 * impliments a circular array data structure
 * the zero index can be set using the setZeroIndex(int index) method
 * offset can also be specified in the get(int index, int startIndex) method.
 */
class CircularArray {
	constructor(length) {
		this.startIndex = 0;
		this.length = length;
		this.data = [];
	}

	copy() {
		let newCircular = new CircularArray(this.length);
		newCircular.startIndex = this.startIndex;

		// clean deep copy's data
		newCircular.data = [...this.data]

		return newCircular;
	}

	setZeroIndex(i) {
		this.startIndex = i;
	}

	offsetZeroIndex(offset) {
		this.startIndex += offset;

		// bounds offset to (-length, length)
		if (this.startIndex >= this.length) {
			this.startIndex -= this.length;
		} else if (this.startIndex <= this.length) {
			this.startIndex += this.length;
		}
	}

	get(i, startIndex = 0) {
		return this.data[(((i + startIndex + this.startIndex) % this.length) + this.length) % this.length];
	}

	set(i, value, startIndex = 0) {
		this.data[(((i + startIndex + this.startIndex) % this.length) + this.length) % this.length] = value;
	}

	push(data) {
		return this.data.push(data);
	}
}
class Cube {
	static MOVES = ['u', 'f', 'r', 'b', 'l', 'd', 'u2', 'f2', 'r2', 'b2', 'l2', 'd2', "u'", "f'", "r'", "b'", "l'", "d'"];

	constructor() {
		this.faces = [];
		this.nextMoves = [];

		this.numMovesTaken = 0;

		// creates 6 circular arrays that prepresent each face
		for (let i = 0; i < 6; i++) this.faces.push(new CircularArray(8));

		// fills cube state with 8 pieces per face
		// (the center piece is held in each index of the cube array)
		// the index/center correspond to a different color
		for (let i = 0; i < 8 * 6; i++) {
			let face = Math.floor(i / 8);

			this.faces[face].push(face);
		}

		// make object with descriptive names
		this.orientations = [
			{ order: [0, 1, 2, 3, 4], startIndex: [0, 0, 0, 0, 0] }, // 0 = u
			{ order: [1, 5, 2, 0, 4], startIndex: [0, 0, 6, 4, 2] }, // 1 = f
			{ order: [2, 1, 5, 3, 0], startIndex: [2, 2, 2, 6, 2] }, // 2 = r
			{ order: [3, 0, 2, 5, 4], startIndex: [4, 0, 2, 4, 6] }, // 3 = b
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

	flush() {
		while(this.nextMoves.length > 0) {
			this.numMovesTaken++;
			this.move(this.nextMoves.shift());
		}
	}

	addMoves(moves, flush=false) {
		this.nextMoves.push(...moves.split(' '));

		if (flush) this.flush();
	}

	get length() {
		return this.nextMoves.length;
	}

	step() {
		if (this.nextMoves.length > 0) {
			this.numMovesTaken++;
			this.move(this.nextMoves.shift());
		} else {
			console.log('tried to step but failed...');
		}
	}

	U(orientation, faces = this.faces) {
		let { order, startIndex } = this.orientations[orientation];

		// rotates the top face
		faces[order[0]].offsetZeroIndex(-2);
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
				let next = faces[order[j]].get(i, startIndex[j]);

				// the piece's color is replaced with the previous piece's color
				faces[order[j]].set(i, prev, startIndex[j]);

				prev = next; // remembers old color for next
			}

			// the last piece's color replaces the first's
			faces[order[4]].set(i, prev, startIndex[4]);
		}
	}

	Uprime(orientation, faces = this.faces) {
		let { order, startIndex } = this.orientations[orientation];

		// rotates the top face
		faces[order[0]].offsetZeroIndex(2);

		for (let i = 0; i < 3; i++) {
			let prev = -1;

			for (let j = 1; j <= 4; j++) {
				// gets the first piece in the face's top row
				let next = faces[order[j]].get(i, startIndex[j]);

				// the piece's color is replaced with the previous piece's color
				faces[order[j]].set(i, prev, startIndex[j]);

				prev = next; // remembers old color for next
			}

			// the last piece's color replaces the first's
			faces[order[1]].set(i, prev, startIndex[1]);
		}
	}

	getCube() {
		return this.getGridCube();
	}

	copyFaces() {
		let faces = [];

		for (let i = 0; i < 6; i++) faces.push(this.faces[i].copy());

		return faces;
	}

	equals(faces) {
		if (this.faces[0].length !== faces[0].length) return false;

		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < this.faces[i].length; j++) {
				if (faces[i].get(j) !== this.faces[i].get(j)) return false;
			}
		}

		return true;
	}

	/**
	 * takes a move (u,f,r,l,d,b), orients the main cube so that the
	 * desired side is on the top, then does a U or U'
	 * @param {String} movement
	 *
	 * @returns {Array} return the array of colors that correspond to the cube
	 */
	move(movement, faces = this.faces) {
		let orientation = Cube.MOVES.indexOf(movement[0].toLowerCase());

		if (orientation > 5 || orientation < 0) throw RangeError('Orientation out of range.');

		if (movement.includes("'")) {
			return this.Uprime(orientation, faces);
		} else if (movement.includes('2')) {
			return this.U(orientation, this.U(orientation, faces));
		} else {
			return this.U(orientation, faces);
		}
	}

	getGridCube(cube=this.faces) {
		let faces = [];

		// this is shit
		for (let i = 0; i < 6; i++) {
			faces.push([
				[cube[i].get(0), cube[i].get(1), cube[i].get(2)],
				[cube[i].get(7), 		i, 		 cube[i].get(3)],
				[cube[i].get(6), cube[i].get(5), cube[i].get(4)]
			]);
		}

		return faces;
	}

	isSolved(faces=this.faces) {
		for (let i = 0; i < 48; i++) {
			let face = Math.floor(i / 8);

			// checks if the color of each piece is the same as the "center" for every face
			if (faces[face].get(i % 8) != face) return false;
		}

		return true;
	}

	generateRandomMove() {
		return Cube.MOVES[Math.floor(Math.random() * Cube.MOVES.length)];
	}

	takeRandomMove() {
		this.move(this.generateRandomMove());
	}
}
