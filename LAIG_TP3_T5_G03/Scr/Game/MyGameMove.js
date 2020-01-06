/**
 * MyGameMove class, which represents a Move in the Game
 */
class MyGameMove {

    /**
     * @constructor
     * @param piece           Piece Moved
     * @param n_board         The number of the board of the player
     * @param n_piece_origin  The number of piece in the players board
     * @param destinyX        X Coordinate in the Game Board
     * @param destinyY        Y Coordinate in the Game Board
     */
    constructor(piece, n_board, n_piece_origin, destinyX, destinyY) {

        this.piece = piece;
        this.n_board = n_board;
        this.n_piece_origin = n_piece_origin;
        this.destinyX = destinyX;
        this.destinyY = destinyY;
    }
}