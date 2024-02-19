const breadthFirstSearch = (initState, heuristic = nullHeuristic) => {
	let visited = [];
	let fringe = [];

	let nodesExpanded = 0;

	// format: [ state , path to state ]
	fringe.push([initState, []]);

	while (fringe.length > 0) {
		// gets next node
		let node = fringe.shift();
		++nodesExpanded;

		// copies faces and path
		let faces = Cube.copyFaces(node[0]),
			path = node[1]; // NOT A COPY

		// makes sure state wasnt visited
		/*
		let cont = true;
		for (let i = 0; i < visited.length; i++) {
			if (Cube.equals(visited[i], faces)) {
				cont = false;
				break;
			}
		}
		if (!cont) continue;*/

		// adds state to visited states
		visited.push(faces);

		// checks if that node is the solved state
		if (Cube.isSolved(faces)) {
			console.log('nodes expanded: ', nodesExpanded);
			return path.join(' ');
		} else {
			let successors = getSuccessors(faces, path[path.length - 1]);
			/*successors = successors.filter(el => {
				for (let visitedFace of visited) !Cube.equals(visitedFace, el);
			})*/
			
			for (let i = 0; i < successors.length; i++) {
				let newPath = [...path];
				newPath.push(successors[i][1]);
				fringe.push([successors[i][0], newPath]);
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

const nullHeuristic = state => {
	return 0;
};
