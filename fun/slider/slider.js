curr_grid = [[ 1,  2,  3,  4,  5],
			 [ 6,  7,  8,  9, 10],
			 [11, 12, 13, 14, 15],
			 [16, 17, 18, 19, 20],
			 [21, 22, 23, 24,  0]];

const NUM_ROWS = 5;
const NUM_COLS = 5;
hole_row = 4;
hole_col = 4;
const NUM_RANDOMIZE_STEPS = 200;
var game_running = false;
var start_time;
var moves;

document.addEventListener("keyup", function(event) {
	if (event.keyCode === 32) {
		event.preventDefault();
		if (game_running) {
			try_to_end_game();
		} else {
			start_game();
		}
	}
});

function render_grid() {
	for (var r = 0; r < NUM_ROWS; r++) {
		for (var c = 0; c < NUM_COLS; c++) {
			render_cell("r"+r+"c"+c, curr_grid[r][c]);
		}
	}
}

function render_cell(id, v) {
	if (v == 0) {
		document.getElementById(id).className="hole";
		document.getElementById(id).innerHTML = "";
	} else {
		document.getElementById(id).className="";
		document.getElementById(id).innerHTML = v;
	}
}

function swap(ru, cu, rv, cv) {
	temp = curr_grid[ru][cu];
	curr_grid[ru][cu] = curr_grid[rv][cv];
	curr_grid[rv][cv] = temp;
	if (hole_row == ru && hole_col == cu) {
		hole_row = rv;
		hole_col = cv;
	} else if (hole_row == rv && hole_col == cv) {
		hole_row = ru;
		hole_col = cu;
	}
	render_grid();
}

function try_to_move(r, c) {
	if (r == hole_row && c == hole_col) return;
	if (r != hole_row && c != hole_col) return;
	if (r == hole_row) {
		if (c > hole_col) {
			for (cu = hole_col; cu < c; cu++) {
				swap(r, cu, r, cu+1);
			}
		} else {
			for (cu = hole_col; cu > c; cu--) {
				swap(r, cu, r, cu-1);
			}
		}
	}
	if (c == hole_col) {
		if (r > hole_row) {
			for (ru = hole_row; ru < r; ru++) {
				swap(ru, c, ru+1, c);
			}
		} else {
			for (ru = hole_row; ru > r; ru--) {
				swap(ru, c, ru-1, c);
			}
		}
	}
	moves++;
}

function inb(r, c) {
	return r >= 0 && c >= 0 && r < NUM_ROWS && c < NUM_COLS;
}

function randomize() {
	const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]
	var e = 0;
	var d = 0;
	var steps = 0;
	while (steps < NUM_RANDOMIZE_STEPS) {
		d = Math.floor(Math.random() * 4);
		if (inb(hole_row+dirs[d][0], hole_col+dirs[d][1]) && (d + 2) % 4 != e) {
			swap(hole_row, hole_col, hole_row+dirs[d][0], hole_col+dirs[d][1]);
			e = d;
		}
		steps++;
	}
	try_to_move(hole_row, 4);
	try_to_move(4, 4);
}

function start_game() {
	if (!game_running) {
		randomize();
		start_time = Date.now();
		game_running = true;
		moves = 0;
	}
}

function restart_game() {
	game_running = false;
	start_game();
}

function try_to_end_game() {
	const NUM_TILES = NUM_ROWS * NUM_COLS;
	var target = 0;
	var corr = 0;
	for (var r = 0; r < NUM_ROWS; r++) {
		for (var c = 0; c < NUM_COLS; c++) {
			target = (target + 1) % NUM_TILES;
			if (curr_grid[r][c] == target) corr++;
		}
	}
	if (corr == NUM_TILES) {
		end_time = Date.now();
		display_time(end_time - start_time, moves);
		game_running = false;
	} else {
		display_unfin_error();
	}
}

function display_time(dur, moves) {
	document.getElementById("info").innerHTML = "You took " + dur / 1000 + " seconds and " + moves + " moves to solve the puzzle!";
}

function display_unfin_error() {
	document.getElementById("info").innerHTML = "That puzzle doesn't look solved to me!";
}
