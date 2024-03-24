var INTERVAL, nodesExpanded;
var dataForm = document.getElementById('dataForm');
var type = document.getElementById('type');
var heur = document.getElementById('heuristic');
var tickTime = document.getElementById('tickTime');
var pauseButton = document.getElementById('pause');
var stepButton = document.getElementById('step');
var scrambleDepth = document.getElementById('scrambleDepth');
var scrambleButton = document.getElementById('scramble');
var solveInfo = document.getElementById('solveInfo');

//initializes global elements
var stage = document.getElementById('stage');
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

//sets width and height of canvas to that of the stage
canvas.setAttribute('width', stage.clientWidth);
canvas.setAttribute('height', stage.clientHeight);

// constants
const colors = ['#fefefe', '#a3fea3', '#fea3a3', '#a3a3fe', '#ffcf93', '#fefea3'];
const WIDTH = (canvas.width * 0.8) / 12;
const CORNER = {
	x: canvas.width * 0.1,
	y: canvas.height * 0.4
};
const drawCube = grid => {
	// background
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
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
				ctx.fillStyle = colors[grid[i][y][x]];
				if (x == 1 && y == 1) {
					let circle = new Path2D();
					circle.arc(cx + WIDTH / 2, cy + WIDTH / 2, WIDTH / 2 - 1, 0, 2 * Math.PI, false);
					ctx.fill(circle);
				} else {
					ctx.fillRect(cx + 1, cy + 1, WIDTH - 2, WIDTH - 2);
				}
			}
		}
	}
};
