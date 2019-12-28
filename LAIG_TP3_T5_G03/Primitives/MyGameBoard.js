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
        this.sideBoard2 = new MyPieceBoard(this.scene, 2);

        this.scene.setPickEnabled(true);

        this.pieceSelected = null;

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

                                this.auxiliary.splice(this.pieceSelected[0], 1);
                                this.pieceSelected = null;
                            }


                        } else {

                            this.pieceSelected = [customId % 100, obj];
                        }
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    display() {

        this.scene.pushMatrix();

        this.scene.scale(15, 15, 15);

        this.board.display();


        this.scene.pushMatrix();
        this.scene.translate(1.75, 0, 0);
        this.sideBoard1.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(-1.75, 0, 0);
        this.sideBoard2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();

        /*this.scene.translate(-1.2, 0.25, -1.2);

        for (let i = 0; i < this.auxiliary.length; i++) {

            this.scene.registerForPick(100 + i, this.auxiliary[i]);
            this.auxiliary[i].display();
            this.scene.clearPickRegistration();

            this.scene.translate(0, 0, 0.3);

        }

        this.scene.popMatrix();*/

        this.scene.popMatrix();

    }

    updateTexCoords(s, t) {}
}