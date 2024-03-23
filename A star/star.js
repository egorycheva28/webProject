document.getElementById('map');
let map=[];
let start;
let end;
function GenerationMap()
{
    
}
function onClickButton()
{
    document.write('вы нажали на меня');
}
function SearchPath()
{
    
}


const cells = []; // создаём массив ячеек лабиринта

for (let x = 0; x < N; x++) { 
	cells[x] = []; 
	for (let y = 0; y < N; y++) { 
		cells[x][y] = null; 
	} 
} 

class CellA { // класс, который создается для каждой ячейки
	constructor(x, y) { 
		this.x = x; 
		this.y = y; 
		this.visited = false; 
		this.walls = { 
			top: true, 
			right: true, 
			bottom: true, 
			left: true, 
		}; 
	} 

	show() { // здесь рисуются стены у ячейки
		const x = this.x * cellSize; 
		const y = this.y * cellSize; 
    
		pen.beginPath(); 

		if (this.walls.top) { // рисуем стену наверху
			pen.moveTo(x, y); 
			pen.lineTo(x + cellSize, y); 
		} 

		if (this.walls.right) { // рисуем стену справа
			pen.moveTo(x + cellSize, y); 
			pen.lineTo(x + cellSize, y + cellSize); 
		} 

		if (this.walls.bottom) { // рисуем стену снизу
			pen.moveTo(x + cellSize, y + cellSize); 
			pen.lineTo(x, y + cellSize); 
		} 

		if (this.walls.left) { // // рисуем стену слева
			pen.moveTo(x, y + cellSize); 
			pen.lineTo(x, y); 
		} 
		pen.strokeStyle = 'green'; // далее стиль ячейки (переделаем)
		pen.lineWidth = 5; 
		pen.lineCap = "round"; 
		pen.stroke(); 
	} 
} 


function genMaze(x, y) { // генерируем лабиринт
	const currCell = cells[x][y]; // копируем текущую ячейку
	currCell.visited = true; // отмечаем посещенную ячейку

	const directions = randomize(['top', 'right', 'bottom', 'left']); 

	for (const direction of directions) { 
		const dx = 
			{ top: 0, right: 1, bottom: 0, left: -1 }[direction]; 
		const dy = 
			{ top: -1, right: 0, bottom: 1, left: 0 }[direction]; 

		const newX = x + dx; 
		const newY = y + dy; 
		// if the coordinates are inbound 
		if (newX >= 0 && newX < cols 
			&& newY >= 0 && newY < rows) { 
			const neighbour = cells[newX][newY]; 

			// removing walls 

			if (!neighbour.visited) { 
				currCell.walls[direction] = false; 
				neighbour.walls[{ 
					top: 'bottom', 
					right: 'left', 
					bottom: 'top', 
					left: 'right', 
				}[direction]] = false; 
				genMaze(newX, newY); 
			} 
		} 
	} 
	generatedMaze = 
		cells.map(row => row.map( 
			cell => ({ ...cell }))); 
	solutionPath = solveMaze(); 
} 

function setup() { // инициализация каждой ячейки лабиринта
	for (let x = 0; x < rows; x++) { 
		for (let y = 0; y < cols; y++) { 
			cells[x][y] = new CellA(x, y); 
		} 
	} 
	genMaze(0, 0); 
} 
