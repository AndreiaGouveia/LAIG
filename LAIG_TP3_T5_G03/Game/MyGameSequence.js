class MyGameSequence {

    constructor(board, sideBoard1, sideBoard2) {

        this.board = board;
        this.sideBoard1 = sideBoard1;
        this.sideBoard2 = sideBoard2;

        this.moves = [];
    }

    addMove(pieceSelected, positionOfSideBoard, n_board, n_piece, initialX, finalX, finalZ) {


        console.log(n_board)
        this.board.pieces[finalZ][finalX] = pieceSelected;

        this["sideBoard" + n_board].removePiece(n_piece);

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
        this.moves.splice(i, 1);


    }
}