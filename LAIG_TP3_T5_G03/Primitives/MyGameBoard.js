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

        this.pieces = [
            [new MyMarshmallow(this.scene), null, new MyMarshmallow(this.scene), null],
            [new MyDonut(this.scene), null, null, null],
            [null, null, null, null],
            [null, null, null, null],
        ];

        this.auxiliary = [new MyMarshmallow(this.scene), new MyMarshmallow(this.scene)];

        this.grey = new CGFappearance(scene);
        this.grey.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.grey.setDiffuse(0.3, 0.3, 0.3, 1.0);
        this.grey.setSpecular(1, 1, 1, 1.0);
        this.grey.setShininess(10.0);

        this.scene.setPickEnabled(true);

    }

    logPicking() {

        if (this.scene.pickMode == false) {

            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {

                for (var i = 0; i < this.scene.pickResults.length; i++) {
                    var obj = this.scene.pickResults[i][0];

                    if (obj) {
                        console.log(obj)
                        var customId = this.scene.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    display() {

        this.scene.pushMatrix();

        this.scene.scale(15, 15, 15);

        this.scene.pushMatrix();

        this.scene.translate(0, 0.2, 0);

        for (let i = 0; i < this.pieces.length; i++) {
            for (let j = 0; j < this.pieces[i].length; j++) {

                if (this.pieces[i][j] != null) {


                    this.scene.pushMatrix();

                    this.scene.translate((j - 2) * 0.5 + 0.25, 0, (2 - i) * 0.5 - 0.25);
                    this.pieces[i][j].display();

                    this.scene.popMatrix();

                }

            }

        }

        this.scene.popMatrix();

        this.grey.apply();
        this.board.display(this.pieces);

        this.scene.pushMatrix();

        this.scene.translate(-1.2, 0.25, -1.2);

        for (let i = 0; i < this.auxiliary.length; i++) {

            this.auxiliary[i].display();

            this.scene.translate(0, 0, 0.3);

        }

        this.scene.popMatrix();

        this.scene.popMatrix();

    }

    updateTexCoords(s, t) {}
}