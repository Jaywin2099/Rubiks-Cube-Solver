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
		newCircular.data = [...this.data];

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

	// make object with descriptive names
	static orientations = [
		{ order: [0, 1, 2, 3, 4], startIndex: [0, 0, 0, 0, 0] }, // 0 = u
		{ order: [1, 5, 2, 0, 4], startIndex: [0, 0, 6, 4, 2] }, // 1 = f
		{ order: [2, 1, 5, 3, 0], startIndex: [2, 2, 2, 6, 2] }, // 2 = r
		{ order: [3, 0, 2, 5, 4], startIndex: [4, 0, 2, 4, 6] }, // 3 = b
		{ order: [4, 0, 3, 5, 1], startIndex: [4, 6, 2, 6, 6] }, // 4 = l
		{ order: [5, 4, 3, 2, 1], startIndex: [2, 4, 4, 4, 4] }, // 5 = d
		{ order: [2, 5, 3, 0, 1], startIndex: [0, 2, 6, 2, 2] }, // wgr corner
		{ order: [3, 4, 0, 2, 5], startIndex: [6, 6, 0, 2, 6] } // rby corner
	];

	constructor() {
		this.nextMoves = [];
		this.numMovesTaken = 0;
		this.solve();
	}

	static getNumConnected(faces) {
		let connected = 0;

		// loops through each corner
		for (let { order, startIndex } of this.orientations) {
			// compares the three corner colors to the 3 connected edges
			let top = faces[order[0]].get(startIndex[0]),
				back = faces[order[3]].get(startIndex[3] + 2),
				left = faces[order[4]].get(startIndex[4]);

			if (top == faces[order[0]].get(startIndex[0] + 1) && back == faces[order[3]].get(startIndex[3] + 1)) ++connected;

			if (top == faces[order[0]].get(startIndex[0] - 1) && left == faces[order[4]].get(startIndex[4] + 1)) ++connected;

			if (back == faces[order[3]].get(startIndex[3] + 3) && left == faces[order[4]].get(startIndex[4] - 1)) ++connected;
		}

		return connected;
	}

	getNumConnected() {
		return Cube.getNumConnected(this.faces);
	}

	scramble(numMoves = 21) {
		let moves = [];

		// picks numMoves random moves and takes them
		for (let i = 0; i < numMoves; i++) {
			let move;
			do {
				move = this.generateRandomMove();
			}
			while (moves.length > 0 && move[0].toUpperCase() == moves[moves.length - 1][0])

			moves.push(move.toUpperCase());
			this.move(move);
		}

		return moves.join(', ');
	}

	solve() {
		this.faces = [];

		// creates 6 circular arrays that prepresent each face
		for (let i = 0; i < 6; i++) this.faces.push(new CircularArray(8));

		// fills cube state with 8 pieces per face
		// (the center piece is held in each index of the cube array)
		// the index/center correspond to a different color
		for (let i = 0; i < 8 * 6; i++) {
			let face = Math.floor(i / 8);

			this.faces[face].push(face);
		}
	}

	flush() {
		while (this.nextMoves.length > 0) {
			this.numMovesTaken++;
			this.move(this.nextMoves.shift());
		}
	}

	clear() {
		this.numMovesTaken = 0;
		this.nextMoves = [];
	}

	addMoves(moves, flush = false) {
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

	static U(orientation, faces) {
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

		return faces;
	}

	static Uprime(orientation, faces) {
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

		return faces;
	}

	static copyFaces(faces) {
		let newFaces = [];

		for (let i = 0; i < 6; i++) newFaces.push(faces[i].copy());

		return newFaces;
	}

	copyFaces() {
		return Cube.copyFaces(this.faces);
	}

	/**
	 * takes a move (u,f,r,l,d,b), orients the main cube so that the
	 * desired side is on the top, then does a U or U'
	 */
	static move(movement, faces, returnCopy = true) {
		// deep copy's faces before movement
		if (returnCopy) faces = Cube.copyFaces(faces);

		let orientation = Cube.MOVES.indexOf(movement[0].toLowerCase());

		if (orientation > 5 || orientation < 0) throw RangeError('Orientation out of range.');

		// moves either 90, -90, or 180 degrees depending on move
		if (movement.includes("'")) {
			return Cube.Uprime(orientation, faces);
		} else if (movement.includes('2')) {
			return Cube.U(orientation, this.U(orientation, faces));
		} else {
			return Cube.U(orientation, faces);
		}
	}

	move(movement) {
		return Cube.move(movement, this.faces, false);
	}

	getGridCube() {
		let faces = [];

		// this is sheeeeeit
		for (let i = 0; i < 6; i++) {
			faces.push([
				[this.faces[i].get(0), this.faces[i].get(1), this.faces[i].get(2)],
				[this.faces[i].get(7), i, this.faces[i].get(3)],
				[this.faces[i].get(6), this.faces[i].get(5), this.faces[i].get(4)]
			]);
		}

		return faces;
	}

	/**
	 * since the index of the face is the center, this alg checks if the color of each piece is the same as the index for every face
	 *
	 * @returns a boolean as soon as it encounters a piece that isn't the same as the "center". it performs well with less solved cubes.
	 */
	static isSolved(faces) {
		for (let face = 0; face < 6; ++face) for (let i = 0; i < 8; ++i) if (faces[face].get(i) != face) return false;

		return true;
	}

	isSolved() {
		return Cube.isSolved(this.faces);
	}

	generateRandomMove() {
		return Cube.MOVES[Math.floor(Math.random() * Cube.MOVES.length)];
	}

	static equals(faces1, faces2) {
		// makes sure they are valid cubes
		if (faces1[0].length != faces2[0].length) return false;

		// compares each face for each cube
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < faces1[i].length; j++) {
				if (faces1[i].get(j) != faces2[i].get(j)) return false;
			}
		}

		return true;
	}

	static estimateMovesToSolveCorners(faces) {
		let totalNumMoves = 0;

		// loops through each corner
		// since no corner is further than 2 moves away from being solved,
		// all im doing is checking the number of stickers on a corner
		// that don't match their center. that number directly correlates to 
		// the number of moves needed to solve the corner.
		// (also keep in mind that if two stickers match their centers, then the corner is already solved)
		for (let { order, startIndex } of this.orientations) {
			let numMoves = 2;

			// checks if each sticker matches their respective centers
			if (faces[order[0]].get(startIndex[0]) == order[0])
				--numMoves;

			if (faces[order[3]].get(startIndex[3] + 2) == order[3])
				--numMoves;

			if (numMoves > 0 && faces[order[4]].get(startIndex[4]) == order[4])
				--numMoves;

			// adds to total
			totalNumMoves += numMoves
		}

		return totalNumMoves;
	}
}
