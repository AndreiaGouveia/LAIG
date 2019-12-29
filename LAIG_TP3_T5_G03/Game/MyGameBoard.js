/**
 * MyGameBoard class, which represents a Patch object
 */
class MyGameBoard extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene) {
        super(scene);

        this.board = new MyBoard(this.scene);
        this.sideBoard1 = new MyPieceBoard(this.scene, 1);
        this.positionOfSideBoard1 = [1.75, 0, 0];
        this.sideBoard2 = new MyPieceBoard(this.scene, 2);
        this.positionOfSideBoard2 = [-1.75, 0, 0];

        this.scene.setPickEnabled(true);

        this.pieceSelected = null;
    }

    update(currTime) {

        this.board.update(currTime);
    }

    logPicking() {

        if (this.scene.pickMode == false) {

            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {

                for (var i = 0; i < this.scene.pickResults.length; i++) {
                    var obj = this.scene.pickResults[i][0];

                    if (obj) {

                        var customId = this.scene.pickResults[i][1];
                        //console.log("Picked object: " + obj + ", with pick id " + customId);

                        if (obj instanceof MyCube) {

                            if (this.pieceSelected != null) {
                                console.log("move");

                                let x = Math.floor(customId / 10) - 1;
                                let y = customId % 10 - 1;
                                this.board.pieces[y][x] = this.pieceSelected[1];

                                let n_board = Math.floor(this.pieceSelected[0] / 100);

                                this["sideBoard" + n_board].pieces[this.pieceSelected[0] % 100] = null;

                                this.pieceSelected[1].setAnimation(this["positionOfSideBoard" + n_board], this.pieceSelected[0] % 100, x, y);
                                this.pieceSelected = null;
                            }


                        } else {

                            console.log(customId)
                            this.pieceSelected = [customId, obj];
                        }
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    display() {

        this.scene.pushMatrix();

        this.scene.scale(30, 30, 30);

        this.board.display();


        this.scene.pushMatrix();
        this.scene.translate(...this.positionOfSideBoard1);
        this.sideBoard1.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(...this.positionOfSideBoard2);
        this.sideBoard2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();

        this.scene.popMatrix();

    }

    updateTexCoords(s, t) {}
}