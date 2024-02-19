const cube = new Cube();

drawCube(cube.getGridCube());

//form on submit
const onSolve = e => {
	if (e) e.preventDefault();
	let path = 0;
	let startTime = Date.now();

	if (type.value == 'bfs') path = breadthFirstSearch(cube.faces);

	let elapsedTime = (Date.now() - startTime) / 1000;

	solveInfo.innerHTML += elapsedTime.toString() + ' seconds to find solution';

	if (path) {
		cube.addMoves(path);

		solveInfo.innerHTML += '<br><br>path: ' + path.toUpperCase();

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

const onScramble = () => {
	cube.solve();
	cube.scramble(parseInt(scrambleDepth.value));
	drawCube(cube.getGridCube());
};

dataForm.addEventListener('submit', onSolve);
pauseButton.addEventListener('click', onPause);
stepButton.addEventListener('click', onStep);
scrambleButton.addEventListener('click', onScramble);
