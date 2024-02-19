const depthFirstSearch = (cube, heuristic = nullHeuristic) => {
	let visited = [];
	let fringe = [];

	// format: [ state , path to state ]
	fringe.push([cube.copyFaces(), []]);

	while (fringe.length > 0) {
		// gets next node
		let node = fringe.shift();

		// copies faces and path
		let faces = node[0].copyFaces(),
			path = [...node[1]];

		if (visited.includes(faces)) continue;
		visited.push(faces);

		// checks if that node is the solved state
		if (cube.isSolved(faces)) {
			return nextMove[1];
		} else {
			let successors = getSuccessors(cube, faces, path[path.length - 1]);

			console.log(successors);

			for (let move of successors) {
				console.log(move[1]);

				// not searching anything because there's only 1 cube.

				if (!visited.includes(move[0])) {
					path.push(move[1]);
					fringe.push([move[0], path]);
				}
			}
		}
	}
};

const getSuccessors = (cube, faces, lastMove) => {
	lastMove = typeof lastMove == 'undefined' ? 'z' : lastMove[0];
	let moves = Cube.MOVES.filter(e => !e.includes(lastMove));
	
	let successors = [];

	for (let i of moves) {
		successors.push([cube.move(i, faces), i]);
	}

	return successors;
};

const nullHeuristic = state => {
	return 0;
};
