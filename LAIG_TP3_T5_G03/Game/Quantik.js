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
            moving: '6'
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
        this.init();

        this.scene.setPickEnabled(false);

    };

    init() {
        this.gameState = this.state.waiting;
        this.gameDifficulty = this.difficulty.easy;
        this.gameMode = this.mode.PvP;
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

    if(boardToConvert.length !=4)
        {
            for (var i = 0; i < boardToConvert.length; i++) {
                
                if (boardToConvert[i] == null) {
                   continue;
                }

                if (i !=0) {
                    board = board + ',';
                }
                
                board = board + boardToConvert[i].getId().toString();

                
            }
        } 
        else {
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


        if (this.gameState == this.state.waiting || this.gameState == this.state.quit || this.gameState == this.state.win)
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

    playerPick(){
        this.scene.setPickEnabled(true);
    }

    getBotPlay(){

        this.scene.setPickEnabled(false);
        var scene1 = this;

        var dif,pieceBoard;
        var botMove = null;

        if(this.gameDifficulty = this.difficulty.easy)
            dif = "random";
        else dif = "smart";

        if(this.currentPlayer == 'player1')
            pieceBoard = this.gameBoard.sideBoard1.pieces;
            else pieceBoard = this.gameBoard.sideBoard2.pieces;

        var command = "getBotMove("+ this.convertBoard(pieceBoard) + ","+this.prologBoard+",smart)";

        
        this.server.makeRequest(command, function(data) {
            botMove = data.target.response; 

            if(botMove[1]==-1)//lose
                scene1.gameState = scene1.state.quit;

            var piece;
            var i=0;
            
            for( ; i < pieceBoard.length ; i++){
                
                if(pieceBoard[i]!=null)
                if(pieceBoard[i].getId() == botMove[5]){
                    piece = pieceBoard[i];
                    break;
                }
            }
            let x = botMove[1]-1;
            let y = botMove[3]-1;
            let n_board =0;

            if(scene1.currentPlayer == 'player1')
                 n_board = 1;
            else  n_board = 2;

            let n_piece =i;
            scene1.gameMoves.addMove(piece, n_board, n_piece, x, y);

            pieceBoard[i] = null;
            scene1.changePlayer();


            scene1.prologBoard = scene1.convertBoard(scene1.boardArray);
            scene1.prologSideBoard1 = scene1.convertBoard(scene1.gameBoard.sideBoard1.pieces);
            scene1.prologSideBoard2 = scene1.convertBoard(scene1.gameBoard.sideBoard2.pieces);
            scene1.checkWin();
        });
    }

    checkWin() {
        var scene1 = this;

        var command = this.prologBoard;
        this.server.makeRequest(command, function(data) {
            if (data.target.response == 0) {
                console.log(scene1.lastPlayer + " won");
                scene1.winGame();
            }
        });
    }

    updateState() {

        if (this.gameBoard.board.isPieceBeingMoved()) {
            this.gameState = this.state.moving;

        } else {
            switch (this.gameMode) {
                case this.mode.PvP:
                    if (this.gameMode != this.state.quit)
                        this.gameState = this.state.playerTurn;
                    break;
                case this.mode.PvC:
                    if (this.gameMode != this.state.quit)
                        this.gameState = (this.currentPlayer == 'player1') ? this.state.playerTurn : this.state.botTurn;
                    if (this.gameState == this.state.playerTurn)
                        break;
                case this.mode.CvC:
                    if (this.gameMode != this.state.quit)
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
        var scene = this;
console.log("PICKED");
        if (obj instanceof MyCube) {
            this.getBotPlay();// TESTS

            /*if (this.pieceSelected != null && !this.gameBoard.board.isPieceBeingMoved()) {
                console.log("move");

                let x = Math.floor(customId / 10) - 1;
                let y = customId % 10 - 1;

                var command = "pieceRuleValidation(" + this.prologBoard + "," + (x + 1).toString() + "," + (y + 1).toString() + "," + this.pieceSelected[1].getId().toString() + ")";

                this.server.makeRequest(command, function(data) {
                    if (data.target.response == 1) {
                        scene.updateErrors("Not a valid move");
                        return;
                    }


                    let n_board = Math.floor(scene.pieceSelected[0] / 100);
                    let n_piece = scene.pieceSelected[0] % 100;
                    scene.gameMoves.addMove(scene.pieceSelected[1], n_board, n_piece, x, y);

                    scene.pieceSelected = null;
                    scene.changePlayer();


                    scene.prologBoard = scene.convertBoard(scene.boardArray);
                    scene.checkWin();
                });

            }*/


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

    undo() {

        console.log("undo");
        if (this.gameState == this.state.moving || this.gameState == this.state.playerTurn || this.gameState == this.state.botTurn) {
            if (this.gameMoves.undoMove()) {
                this.changeToLastPlayer();
                this.updateErrors("");
            }
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

        if (this.gameState == this.state.playerTurn) {

            this.gameBoard.update(currTime);
            this.time += currTime;
            this.checkTimeout();
        }

        this.gameBoard.update(currTime);
    }

};