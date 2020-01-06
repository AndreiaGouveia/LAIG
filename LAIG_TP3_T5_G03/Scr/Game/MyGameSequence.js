/**
 * MyGameSequence class, which represents a the sequences of moves in a Game
 */
class MyGameSequence {

    /**
     * @constructor
     * @param {MyBoard} scene  represents the Board of a Game
     */
    constructor(gameBoard) {

        this.board = gameBoard.board;
        this.sideBoard1 = gameBoard.sideBoard1;
        this.positionOfSideBoard1 = gameBoard.positionOfSideBoard1;
        this.sideBoard2 = gameBoard.sideBoard2;
        this.positionOfSideBoard2 = gameBoard.positionOfSideBoard2;

        this.moves = [];
    }

    addMove(pieceSelected, n_board, n_piece, finalX, finalZ) {

        this.board.addPiece(finalX, finalZ, pieceSelected);

        this["sideBoard" + n_board].removePiece(n_piece);

        let positionOfSideBoard = this["positionOfSideBoard" + n_board];
        pieceSelected.setAnimation(positionOfSideBoard, n_piece, finalX, finalZ, this.board.isPieceLow(finalX, finalZ));

        this.moves.push(new MyGameMove(pieceSelected, n_board, n_piece, finalX, finalZ));
    }

    undoMove() {

        let i = this.moves.length - 1;

        if (i < 0)
            return false;

        let move = this.moves[i];
        this.board.setPiece(move.destinyX, move.destinyY, null);
        this["sideBoard" + move.n_board].setPiece(move.n_piece_origin, move.piece);
        this.moves[i].piece.animation = null;
        this.moves.pop();

        return true;

    }

    undoEverything() {
        while (true) {
            if (!this.undoMove())
                break;
        }
    }
}