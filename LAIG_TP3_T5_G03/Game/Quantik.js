/**
 * Represents the Quantik game
 */
class Quantik extends CGFobject {
    /**
     * [constructor description]
     * @param {XMLScene} scene	 represents the CGFscene
     */
    constructor(scene) {
        super(scene);

        this.mode = {
            PvP: '1',
            PvC: '2',
            CvC: '3'
        };
        this.state = {
            playerTurn: '1',
            botTurn: '2',
            waiting: '3',
            quit: '4'
        };
        this.difficulty = {
            easy: '1',
            hard: '2'
        };

        this.server = new Server();
        this.gameState = this.state.waiting;
        this.gameDifficulty = this.difficulty.easy;
        this.gameMode = this.mode.PvP;
        this.gameBoard = new MyGameBoard(scene);
        this.boardArray = this.gameBoard.board.pieces;
        this.player1Pieces = this.gameBoard.sideBoard1.pieces;
        this.player2Pieces = this.gameBoard.sideBoard1.pieces;

        this.currentPlayer = 'player1';

        this.pieceSelected = null;
        this.gameMoves = new MyGameSequence(this.gameBoard);

        this.time = 0;
        this.timeout = 30;

        this.scene.setPickEnabled(true);

    };

    /**
     * displays the game
     */
    display() {
        this.updateHTML();
        this.updateState();
        this.checkState();
        this.gameBoard.display();
    };

    /**
     * checks what needs to happen wether it's the player's or bot's turn
     */
    checkState() {
        switch (this.gameState) {
            case this.state.playerTurn:
                //this.playerPick();
                break;
            case this.state.botTurn:
                //this.getBotMove();
                break;
        }
    };

    changePlayer() {

        this.currentPlayer = (this.currentPlayer == 'player1') ? 'player2' : 'player1';

    }

    /**
     * initializes everything needed to start a new game
     */
    startGame() {
        var quantik = this;
      console.log("lol");
        this.server.makeRequest('start', function(data) {
            quantik.scene.setPickEnabled(true);
            quantik.init();
            quantik.currentPlayer = 'player1';
            quantik.updateState();
        });
    }

    quitGame() {
        this.gameState = this.state.quit;
        this.scene.setPickEnabled(false);
    }

    updateState() {

        if (this.gameBoard.board.isPieceBeingMoved()) {
            this.gameState = this.state.moving;
        }

        if (!this.gameBoard.board.isPieceBeingMoved()) {

            switch (this.gameMode) {
                case this.mode.PvP:
                    this.gameState = this.state.playerTurn;
                    this.scene.setPickEnabled(true);
                    break;
                case this.mode.PvC:
                    this.gameState = (this.currentPlayer == 'player1') ? this.state.playerTurn : this.state.botTurn;
                    if (this.gameState == this.state.playerTurn)
                        this.scene.setPickEnabled(true);
                    break;
                case this.mode.CvC:
                    this.gameState = this.state.botTurn;
                    break;
            }
        }
    }

    picking() {

        if (this.scene.pickMode == false) {

            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {

                for (var i = 0; i < this.scene.pickResults.length; i++) {
                    var obj = this.scene.pickResults[i][0];

                    if (obj) {

                        var customId = this.scene.pickResults[i][1];
                        this.onObjectSelected(customId, obj);
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    onObjectSelected(customId, obj) {

        if (obj instanceof MyCube) {

            if (this.pieceSelected != null && !this.gameBoard.board.isPieceBeingMoved()) {
                console.log("move");

                let x = Math.floor(customId / 10) - 1;
                let y = customId % 10 - 1;

                let n_board = Math.floor(this.pieceSelected[0] / 100);
                let n_piece = this.pieceSelected[0] % 100;

                this.gameMoves.addMove(this.pieceSelected[1], n_board, n_piece, x, y);

                this.pieceSelected = null;

                this.changePlayer();
            }


        } else if (obj instanceof MyPiece) {


            if (obj.getPlayer() != this.currentPlayer) {
                this.updateErrors("Not your piece!");
                return;
            }

            this.pieceSelected = [customId, obj];
            this.updateErrors("");
        }

    }

    undo() {

        console.log("undo");
        this.gameMoves.undoMove();
    }

    updateErrors(error) {
        document.getElementById("error").innerText = error;
    }

    updateHTML() {

        if (this.gameState == this.state.botTurn || this.gameState == this.state.playerTurn) {

            document.getElementById("player").innerText = (this.currentPlayer == 'player1') ? "Player 1's turn" : "Player 2's turn\n";
        } else
            document.getElementById("player").innerText = "";

        switch (this.gameState) {
            case this.state.waiting:
                document.getElementById("information").innerText = "Start a game";
                break;
            case this.state.quit:
                document.getElementById("information").innerText = "You've exited the game";
                break;
            case this.state.moving:
                document.getElementById("information").innerText = "Moving piece";
                break;
            case this.state.playerTurn:
                document.getElementById("information").innerText = "Please select your movement";
                break;
            case this.state.botTurn:
                document.getElementById("information").innerText = "Moving piece";
                break;
            default:
                document.getElementById("information").innerText = "";
                break;
        }
    }


};