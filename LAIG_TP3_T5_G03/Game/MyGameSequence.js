class MyGameSequence {

    constructor(gameBoard) {

        this.board = gameBoard.board;
        this.sideBoard1 = gameBoard.sideBoard1;
        this.positionOfSideBoard1 = gameBoard.positionOfSideBoard1;
        this.sideBoard2 = gameBoard.sideBoard2;
        this.positionOfSideBoard2 = gameBoard.positionOfSideBoard2;

        this.moves = [];
    }

    addMove(pieceSelected, n_board, n_piece, finalX, finalZ) {

        this.board.pieces[finalZ][finalX] = pieceSelected;

        this["sideBoard" + n_board].removePiece(n_piece);

        let positionOfSideBoard = this["positionOfSideBoard" + n_board];
        pieceSelected.setAnimation(positionOfSideBoard, n_piece, finalX, finalZ, this.board.isPieceLow(finalX, finalZ));

        this.moves.push(new MyGameMove(pieceSelected, this["sideBoard" + n_board].getPiece(n_piece), this.board.getPiece(finalX, finalX)));

        pieceSelected = null;
    }

    undoMove() {

        let i = this.moves.length - 1;

        if (i < 0)
            return;

        this.moves[i].destiny = this.moves[i].piece;
        this.moves[i].origin = null;
        this.moves[i].piece.animation = null;
        this.moves.pop();


    }
}