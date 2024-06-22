document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const restartButton = document.getElementById('restart');
    const winnerMessage = document.getElementById('winner-message');
    const winnerText = document.getElementById('winner-text');
    let board = ['', '', '', '', '', '', '', '', ''];
    let player = 'X';
    let gameActive = true;

    // Handle cell click
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = cell.getAttribute('data-index');
            if (board[index] === '' && gameActive) {
                cell.textContent = player;
                board[index] = player;
                checkWinner();
                player = player === 'X' ? 'O' : 'X';
                if (player === 'O' && gameActive) {
                    setTimeout(makeComputerMove, 250);  // Add delay before AI makes a move
                }
            }
        });
    });

    // Handle reset button click
    resetButton.addEventListener('click', resetGame);
    restartButton.addEventListener('click', resetGame);

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
        });
        player = 'X';
        gameActive = true;
        winnerMessage.classList.add('hidden');
        resetButton.classList.remove('hidden');
    }

    function makeComputerMove() {
        fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ board: board, player: 'O' }),
        })
            .then(response => response.json())
            .then(data => {
                const move = data.move;
                if (move !== -1) {
                    board[move] = 'O';
                    cells[move].textContent = 'O';
                    checkWinner();
                    player = 'X';
                }
            });
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameActive = false;
                displayWinner(board[a]);
                return;
            }
        }
        if (!board.includes('')) {
            displayWinner('Draw');
        }
    }

    function displayWinner(winner) {
        if (winner === 'Draw') {
            winnerText.textContent = 'It\'s a draw!';
        } else {
            winnerText.textContent = `Player ${winner} wins!`;
        }
        winnerMessage.classList.remove('hidden');
        resetButton.classList.add('hidden');
    }
});
