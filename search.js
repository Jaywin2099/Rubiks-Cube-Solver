const breadthFirstSearch = (initState, heuristic = nullHeuristic) => {
	let fringe = new MinHeap();
	nodesExpanded = 0;
	//let visited = [];

	// format: [ state , path to state ]
	fringe.push([heuristic(initState), initState, []]);

	while (fringe.length > 0) {
		// gets next node
		let node = fringe.shift();
		++nodesExpanded;

		// copies faces and path
		let faces = Cube.copyFaces(node[1]),
			path = node[2];

		// checks if that node is the solved state
		if (Cube.isSolved(faces)) {
			solveInfo.innerHTML = 'nodes expanded: ' + nodesExpanded.toString() + '<br>';

			return path.join(' ');
		} else {
			let successors = getSuccessors(faces, path[path.length - 1]);

			for (let i = 0; i < successors.length; i++) {
				let newPath = [...path];
				newPath.push(successors[i][1]);

				fringe.push([heuristic(successors[i][0]) + newPath.length, successors[i][0], newPath]);
			}
		}
	}
};

const getSuccessors = (faces, lastMove) => {
	let moves;

	// checks if there is a last movement
	if (typeof lastMove != 'undefined') {
		// removes the opposite of the move just made from possible next movements
		moves = Cube.MOVES.filter(e => !e.includes(lastMove[0]));
	} else {
		moves = Cube.MOVES;
	}

	let successors = [];

	// gets successor states
	for (let i = 0; i < moves.length; i++) {
		// Cube.move returns a copy of the state after acting on the move
		successors.push([Cube.move(moves[i], faces), moves[i]]);
	}

	return successors;
};

const randomHeuristic = state => {
	return Math.floor(Math.random() * 4);
};

const nullHeuristic = state => {
	return 0;
};

const notConnectedHeuristic = state => {
	// gets number of connections and subtracts from total
	return 4 - Cube.getNumConnected(state) / 6;
};

const manhattanDistanceHeuristic = state => {
	// calculates the manhattan distance of every piece
	// from its solved position, and divides by 4? 8?
	// to keep the heuristic admissible.
};

const numCornerMovesHeuristic = state => {
	return Cube.estimateMovesToSolveCorners(state) / 4;
};

window['notConnectedHeuristic'] = notConnectedHeuristic;
window['numCornerMovesHeuristic'] = numCornerMovesHeuristic;
window['nullHeuristic'] = nullHeuristic;
