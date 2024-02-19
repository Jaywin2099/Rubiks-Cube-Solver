const WIDTH = (canvas.width * 0.6) / 12;
const CORNER = {
	x: canvas.width * 0.05,
	y: canvas.height * 0.4
};

const cube = new Cube();
let circle;

const drawCube = () => {
	let grid = cube.getGridCube();

	// background
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//ctx.strokeStyle = 'black';
	//ctx.lineWidth = 2;

	for (let i = 0; i < 6; i++) {
		for (let y = 0; y < 3; y++) {
			let cy = CORNER.y + y * WIDTH;
			let xOffset = 0;

			if (i == 0) {
				cy -= 3 * WIDTH;
				xOffset = 3 * WIDTH;
			} else if (i == 5) {
				cy += 3 * WIDTH;
				xOffset = -12 * WIDTH;
			} else if (i == 4) {
				xOffset = -12 * WIDTH;
			}

			for (let x = 0; x < 3; x++) {
				cx = CORNER.x + x * WIDTH + i * WIDTH * 3 + xOffset;

				ctx.fillStyle = 'black';
				ctx.fillRect(cx, cy, WIDTH, WIDTH);

				// draws rect
				//ctx.strokeRect(cx, cy, WIDTH, WIDTH);
				ctx.fillStyle = colors[grid[i][y][x]];
				if (x == 1 && y == 1) {
					circle = new Path2D();
					circle.arc(cx + WIDTH / 2, cy + WIDTH / 2, WIDTH / 2 - 1, 0, 2 * Math.PI, false);
					ctx.fill(circle);
				} else {
					ctx.fillRect(cx + 1, cy + 1, WIDTH - 2, WIDTH - 2);
				}
			}
		}
	}
};

let numMoves = 0;

//form on submit
const onSolve = e => {
	if (e) e.preventDefault();

	INTERVAL = setInterval(() => {
		cube.addMoves(cube.generateRandomMove());

		cube.step();

		drawCube();
	}, tickTime.value);
};

const onPause = () => {
	clearInterval(INTERVAL);
}

const onStep = () => {
	cube.step();
	drawCube();
}


dataForm.addEventListener('submit', onSolve);
pauseButton.addEventListener('click', onPause);
stepButton.addEventListener('click', onStep);
drawCube();
