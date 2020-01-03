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
            quit: '4',
            won: '5',
            moving: '6',
            waitingForBot: '7',
            movie: '8',
            pause: '9',
        };
        this.difficulty = {
            easy: '1',
            hard: '2'
        };

        this.gamesWon_player1 = 0;
        this.gamesWon_player2 = 0;

        this.server = new Server();
        this.gameBoard = new MyGameBoard(this.scene);
        this.gameMoves = new MyGameSequence(this.gameBoard);
        this.gameMode = this.mode.PvP;
        this.init();

        this.scene.setPickEnabled(false);

    };

    init() {
        this.gameState = this.state.waiting;
        this.gameDifficulty = this.difficulty.easy;
        this.boardArray = this.gameBoard.board.pieces;
        this.player1Pieces = this.convertBoard(this.gameBoard.sideBoard1.pieces);
        this.player2Pieces = this.convertBoard(this.gameBoard.sideBoard1.pieces);
        this.prologBoard = this.convertBoard(this.boardArray);
        this.currentPlayer = 'player1';
        this.lastPlayer = 'player2';

        this.pieceSelected = null;

        this.time = 0;
        this.timeout = 30;
    }

    convertBoard(boardToConvert) {

        var board = "[";

        if (boardToConvert.length != 4) {
            for (var i = 0; i < boardToConvert.length; i++) {

                if (boardToConvert[i] == null) {
                    continue;
                }

                if (i != 0) {
                    board = board + ',';
                }

                board = board + boardToConvert[i].getId().toString();


            }
        } else {
            for (var i = 0; i < boardToConvert.length; i++) {
                var row = "[";
                var boardRow = boardToConvert[i];
                for (var j = 0; j < boardRow.length; j++) {
                    if (boardRow[j] == null) {
                        row = row + "0";
                    } else row = row + boardRow[j].getId().toString();

                    if (j < 3) {
                        row = row + ',';
                    }
                }

                row = row + "]";

                if (i < 3) {
                    row = row + ',';
                }
                board = board + row;
            }
        }

        board = board + "]";

        return board;
    }

    /**
     * displays the game
     */
    display() {
        this.updateHTML();
        this.checkState();
        this.gameBoard.display();
    };

    /**
     * checks what needs to happen wether it's the player's or bot's turn
     */
    checkState() {


        if (this.gameState == this.state.waiting || this.gameState == this.state.quit || this.gameState == this.state.win ||
            this.gameState == this.state.pause)
            return;

        this.updateState();

        switch (this.gameState) {
            case this.state.playerTurn:
                this.playerPick();
                break;
            case this.state.botTurn:
                this.getBotPlay();
                break;
        }
    };

    changePlayer() {

        this.lastPlayer = (this.currentPlayer == 'player1') ? 'player1' : 'player2';
        this.currentPlayer = (this.currentPlayer == 'player1') ? 'player2' : 'player1';
        this.time = 0;
        this.updateErrors("");

    }

    changeToLastPlayer() {
        this.currentPlayer = (this.lastPlayer == 'player1') ? 'player1' : 'player2';
        this.lastPlayer = (this.lastPlayer == 'player1') ? 'player2' : 'player1';
        this.time = 0;
        this.updateErrors("");
    }

    changeJustCurrentPlayer() {
        this.currentPlayer = (this.currentPlayer == 'player1') ? 'player2' : 'player1';
        this.time = 0;
    }

    /**
     * initializes everything needed to start a new game
     */
    startGame() {

        var quantik = this;
        this.updateErrors("Connecting...");

        this.server.makeRequest('start', function(data) {
            quantik.gameMoves.undoEverything();
            quantik.init();

            quantik.updateState();
            quantik.updateErrors("");
        });
    }

    quitGame() {
        this.gameState = this.state.quit;
        this.scene.setPickEnabled(false);
    }

    winGame() {

        this.gameState = this.state.win;
        this.scene.setPickEnabled(false);
        this["gamesWon_" + this.lastPlayer]++;
        this.updateScore();
    }

    playerPick() {
        this.scene.setPickEnabled(true);
    }

    makeBotMove(botMove, pieceBoard) {

        if (botMove[1] == -1) //lose
        {
            this.gameState = this.state.win;
            return;
        }

        let x = botMove[1] - 1;
        let y = botMove[3] - 1;
        let n_board = 0;

        if (this.currentPlayer == 'player1')
            n_board = 1;
        else
            n_board = 2;

        var piece;
        var i = 0;

        for (; i < pieceBoard.length; i++) {

            if (pieceBoard[i] != null)
                if (pieceBoard[i].getId() == botMove[5]) {
                    piece = pieceBoard[i];
                    break;
                }
        }
        let n_piece = i;
        this.gameMoves.addMove(piece, n_board, n_piece, x, y);
        this.changePlayer();


        this.prologBoard = this.convertBoard(this.boardArray);
        this.prologSideBoard1 = this.convertBoard(this.gameBoard.sideBoard1.pieces);
        this.prologSideBoard2 = this.convertBoard(this.gameBoard.sideBoard2.pieces);
        this.checkWin();
    }

    makePersonMove(response, x, y) {

        if (response == 1) {
            this.updateErrors("Not a valid move");
            return;
        }


        let n_board = Math.floor(this.pieceSelected[0] / 100);
        let n_piece = this.pieceSelected[0] % 100;
        this.gameMoves.addMove(this.pieceSelected[1], n_board, n_piece, x, y);

        this.pieceSelected = null;
        this.changePlayer();


        this.prologBoard = this.convertBoard(this.boardArray);
        this.checkWin();

    }

    getBotPlay() {

        this.scene.setPickEnabled(false);
        var quantik = this;

        var dif, pieceBoard;
        var botMove = null;

        if (this.gameDifficulty = this.difficulty.easy)
            dif = "random";
        else
            dif = "smart";

        if (this.currentPlayer == 'player1')
            pieceBoard = this.gameBoard.sideBoard1.pieces;
        else
            pieceBoard = this.gameBoard.sideBoard2.pieces;

        var command = "getBotMove(" + this.convertBoard(pieceBoard) + "," + this.prologBoard + ",smart)";

        this.server.makeRequest(command, function(data) {
            botMove = data.target.response;
            quantik.gameState = quantik.state.moving;

            quantik.makeBotMove(botMove, pieceBoard);


        });

        this.gameState = this.state.waitingForBot;

    }

    makeMovie() {

        if (this.gameState == this.state.playerTurn || this.gameState == this.state.botTurn) {
            this.gameState = this.state.movie;
            this.movieMoves = this.gameMoves.moves.slice();
            this.gameMoves.undoEverything();
        }
    }

    nextMove() {



        if (this.movieMoves.length == 0) {
            this.gameState = this.state.moving
            return; //todo put other state after movie
        }

        let move = this.movieMoves[0];
        this.gameMoves.addMove(move.piece, move.n_board, move.n_piece_origin, move.destinyX, move.destinyY);
        this.movieMoves.shift();

    }

    pauseORContinue() {


        if (this.gameState == this.state.waiting || this.gameState == this.state.quit || this.gameState == this.state.won)
            return;

        if (this.isPaused()) {
            this.gameState = this.state.moving;
        } else {
            this.gameState = this.state.pause;
        }

    }

    isPaused() {

        return (this.gameState == this.state.pause || this.gameState == this.state.waiting || this.gameState == this.state.quit || this.gameState == this.state.won);
    }

    checkWin() {
        var quantik = this;

        var command = this.prologBoard;
        this.server.makeRequest(command, function(data) {
            if (data.target.response == 0) {
                console.log(quantik.lastPlayer + " won");
                quantik.winGame();
            }

        });
    }

    updateState() {

        if (this.gameState == this.state.waitingForBot)
            return;

        if (this.gameState == this.state.movie) {
            if (!this.gameBoard.board.isPieceBeingMoved())
                this.nextMove();

            return;
        }

        if (this.gameBoard.board.isPieceBeingMoved()) {
            this.gameState = this.state.moving;

        } else {

            switch (this.gameMode) {
                case this.mode.PvP:
                    this.gameState = this.state.playerTurn;
                    break;
                case this.mode.PvC:
                    this.gameState = (this.currentPlayer == 'player1') ? this.state.playerTurn : this.state.botTurn;
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

                if (this.gameState != this.state.waiting) {
                    for (var i = 0; i < this.scene.pickResults.length; i++) {
                        var obj = this.scene.pickResults[i][0];

                        if (obj) {

                            var customId = this.scene.pickResults[i][1];
                            this.onObjectSelected(customId, obj);
                        }
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    onObjectSelected(customId, obj) {
        var quantik = this;

        if (obj instanceof MyCube) {

            if (this.pieceSelected != null && !this.gameBoard.board.isPieceBeingMoved()) {
                console.log("move");

                let x = Math.floor(customId / 10) - 1;
                let y = customId % 10 - 1;

                var command = "pieceRuleValidation(" + this.prologBoard + "," + (x + 1).toString() + "," + (y + 1).toString() + "," + this.pieceSelected[1].getId().toString() + ")";

                this.server.makeRequest(command, function(data) {
                    let response = data.target.response;

                    quantik.makePersonMove(response, x, y);
                });

            }


        } else if (obj instanceof MyPiece) {


            if (obj.getPlayer() != this.currentPlayer) {
                this.updateErrors("Not your piece!");
                this.pieceSelected = null;
                return;
            }

            this.pieceSelected = [customId, obj];
            this.updateErrors("");
        }

    }

    undoOneMode() {
        if (this.gameMoves.undoMove()) {
            this.changeToLastPlayer();
            this.updateErrors("");
        }
    }

    undo() {

        console.log("undo");
        if (this.gameState == this.state.moving || this.gameState == this.state.playerTurn || this.gameState == this.state.botTurn) {
            if (this.gameMode == this.mode.PvC && this.currentPlayer == 'player1') {

                this.undoOneMode();
            }

            this.undoOneMode();
        }
    }

    updateErrors(error) {
        document.getElementById("error").innerText = error;
    }

    updateScore() {
        document.getElementById("score").innerText = this.gamesWon_player1 + " wins : " + this.gamesWon_player2 + " wins";

    }

    updateHTML() {

        if (this.gameState == this.state.botTurn || this.gameState == this.state.playerTurn) {

            document.getElementById("time").innerText = Math.floor(this.time) + " seconds ";
            document.getElementById("player").innerText = this.currentPlayer + "'s turn";
            this.updateScore();

        } else {

            document.getElementById("time").innerText = "";
            document.getElementById("player").innerText = "";
        }

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
            case this.state.win:
                document.getElementById("information").innerText = this.lastPlayer + " Won!";
                break;
            case this.state.waitingForBot:
                document.getElementById("information").innerText = "Bot is thinking!";
                break;
            case this.state.movie:
                document.getElementById("information").innerText = "Enjoy your movie!";
                break;
            case this.state.pause:
                document.getElementById("information").innerText = "Game Paused";
                break;
            default:
                document.getElementById("information").innerText = "";
                break;

        }
    }

    checkTimeout() {

        if (this.time > this.timeout) {

            this.updateErrors(this.currentPlayer + " lost his turn!");
            this.changeJustCurrentPlayer();
        }
    }

    update(currTime) {

        if (this.gameState == this.state.quit || this.gameState == this.state.waiting || this.gameState == this.state.pause) {
            return;
        }

        if (this.gameState == this.state.playerTurn) {

            this.gameBoard.update(currTime);
            this.time += currTime;
            this.checkTimeout();
        }

        this.gameBoard.update(currTime);
    }

};