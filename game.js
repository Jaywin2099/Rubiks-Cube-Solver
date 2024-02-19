const cube = new Cube();

cube.addMoves('R', true);

drawCube(cube.getGridCube());

//form on submit
const onSolve = e => {
	if (e) e.preventDefault();
	let path = 0;
	
	if (type.value == 'bfs') path = breadthFirstSearch(cube.faces);

	if (path) {
		cube.addMoves(path);

		INTERVAL = setInterval(() => {
			// steps
			cube.step();

			// draws cube
			drawCube(cube.getGridCube());

			// when cube is solved
			if (cube.isSolved()) onPause();
		}, tickTime.value);
	} else {
		console.log('no path');
	}
};

const onPause = () => {
	clearInterval(INTERVAL);
};

const onStep = () => {
	cube.step();
	drawCube(cube.getGridCube());
};

dataForm.addEventListener('submit', onSolve);
pauseButton.addEventListener('click', onPause);
stepButton.addEventListener('click', onStep);
