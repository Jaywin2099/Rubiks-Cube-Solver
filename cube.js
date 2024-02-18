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
		if (i <= -1 * this.length || i >= this.length) throw RangeError('index out of range');
	}

	setZeroIndex(i) {
		this.checkRangeError(i);

		this.startIndex = i;
	}

	offsetZeroIndex(offset) {
		this.checkRangeError(this.startIndex + offset);

		this.startIndex += offset;
	}

	get(i, startIndex = 0) {
		this.checkRangeError(i);

		return this.data[(((i + startIndex + this.startIndex) % this.length) + this.length) % this.length];
	}

	push(data) {
		return this.data.push(data);
	}
}

class Cube {
	constructor() {
		this.cube = [];

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
			{ order: [0,1,2,3,4,5], startIndex: [0,0,0,0,0,NaN] }, // 0 = up
			{ order: [], startIndex: [] }, // 1 = front
			{ order: [], startIndex: [] }, // 2 = right
			{ order: [], startIndex: [] }, // 3 = back
			{ order: [], startIndex: [] }, // 4 = left
			{ order: [], startIndex: [] } // 5 = down
		];
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

		
		/*
		for (let i = 1; i <= 4; i++) {
			let face = order[i];
			let topRow = new CircularArray(12);

			// gets the top row colors
			for (let j = 0; j < 3; j++) {
				topRow.push(this.cube[ face ].get( j, startIndex[i] ).color);
			}
		}*/

		// rotates the first 3 tiles for the 4 sides' faces clockwise
		for (let i = 0; i < 3; i++) {
			let prev = -1;
			
			for (let j = 4; j >= 1; j--) {
				// gets the first piece in the face's top row
				let piece = this.cube[ order[j] ].get( i, startIndex[j] );

				// keeps its color
				let next = piece.color;

				// the piece's color is replaced with the previous piece's color
				piece.color = prev;

				prev = next; // remembers old color for next
			}

			// the last piece's color replaces the first's
			this.cube[ order[4] ].get( i, startIndex[4] ).color = prev;
		}
	}

	Uprime() {


		for (let i = 0; i < 3; i++) {
			let prev = -1;
			
			for (let j = 1; j <= 4; j++) {
				// gets the first piece in the face's top row
				let piece = this.cube[ order[j] ].get( i, startIndex[j] );

				// keeps its color
				let next = piece.color;

				// the piece's color is replaced with the previous piece's color
				piece.color = prev;

				prev = next; // remembers old color for next
			}

			// the last piece's color replaces the first's
			this.cube[ order[1] ].get( i, startIndex[1] ).color = prev;
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
		switch (movement.lower()) {
			case 'u':
				break;

			case 'f':
				break;

			case 'r':
				break;

			case 'l':
				break;

			case 'b':
				break;

			case 'd':
				break;
		}
	}

	turnSide(side) {
		let cube = this.orientCube(side);

		this.U(cube);

		// idea: maybe use circular arrays of rows and columns and faces, and change the index of the start to simulate a turn.
		//

		this.cube = cube;
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
}

let test = new Cube();

console.log(test.isSolved());

console.log(test.getCube());

test.U()

console.log(test.getCube());