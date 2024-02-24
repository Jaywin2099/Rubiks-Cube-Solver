const breadthFirstSearch = (initState, heuristic = nullHeuristic) => {
	let fringe = new MinHeap();
	let nodesExpanded = 0;

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
	lastMove = typeof lastMove == 'undefined' ? '-' : lastMove[0];
	let moves = Cube.MOVES.filter(e => !e.includes(lastMove));
	let successors = [];

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
	let notConnected = 8 * 3; // 8 corners, three connections per corner

	// gets number of connections and subtracts from total
	notConnected -= Cube.getNumConnected(state);

	return notConnected / 4;
};
