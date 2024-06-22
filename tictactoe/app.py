from flask import Flask, render_template, jsonify, request

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/move', methods=['POST'])
def move():
    data = request.json
    board = data['board']
    player = data['player']
    best_move = find_best_move(board)
    return jsonify({'move': best_move})


def find_best_move(board):
    best_score = float('-inf')
    best_move = -1
    for i in range(len(board)):
        if board[i] == '':
            board[i] = 'O'
            score = minimax(board, 0, False)
            board[i] = ''
            if score > best_score:
                best_score = score
                best_move = i
    return best_move


def minimax(board, depth, is_maximizing):
    winner = check_winner(board)
    if winner != None:
        return evaluate(winner)

    if is_maximizing:
        best_score = float('-inf')
        for i in range(len(board)):
            if board[i] == '':
                board[i] = 'O'
                score = minimax(board, depth + 1, False)
                board[i] = ''
                best_score = max(score, best_score)
        return best_score
    else:
        best_score = float('inf')
        for i in range(len(board)):
            if board[i] == '':
                board[i] = 'X'
                score = minimax(board, depth + 1, True)
                board[i] = ''
                best_score = min(score, best_score)
        return best_score


def check_winner(board):
    winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    for combination in winning_combinations:
        a, b, c = combination
        if board[a] == board[b] == board[c] and board[a] != '':
            return board[a]
    if '' not in board:
        return 'Draw'
    return None


def evaluate(winner):
    if winner == 'O':
        return 1
    elif winner == 'X':
        return -1
    else:
        return 0


if __name__ == '__main__':
    app.run(debug=True)
