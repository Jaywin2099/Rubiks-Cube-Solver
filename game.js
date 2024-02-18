const WIDTH = (canvas.width * 0.6) / 12;
const CORNER = {
	x: canvas.width * 0.05,
	y: canvas.height * 0.4
};

console.log(CORNER);

let cube = new Cube();

const drawCube = () => {
	// background
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;

	for (let i = 0; i < 6; i++) {
		for (let y = 0; y < 3; y++) {
			let cy = CORNER.y + y * WIDTH;
			let tx = 0;

			if (i == 2) {
				cy += -3 * WIDTH;
				tx = -3 * WIDTH;
			} else if (i == 4) {
				cy += 3 * WIDTH;
				tx = -9 * WIDTH;
			} else if (i == 5) {
				tx = -9 * WIDTH;
			}

			for (let x = 0; x < 3; x++) {
				let cx = CORNER.x + x * WIDTH + 3 * i * WIDTH + tx;
				ctx.strokeRect(cx, cy, WIDTH, WIDTH);

				ctx.fillStyle = colors[i];
				ctx.fillRect(cx + 1, cy + 1, WIDTH - 2, WIDTH - 2);
			}
		}
	}
};

drawCube();
