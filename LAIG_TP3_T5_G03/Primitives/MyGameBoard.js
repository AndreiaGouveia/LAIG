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

        this.board = new CGFOBJModel(this.scene, '../models/board.obj');

        this.pieces = [
            [new MyDonut(this.scene), null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
        ];

        this.grey = new CGFappearance(scene);
        this.grey.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.grey.setDiffuse(0.3, 0.3, 0.3, 1.0);
        this.grey.setSpecular(1, 1, 1, 1.0);
        this.grey.setShininess(10.0);

    }

    display() {

        this.grey.apply();

        this.board.display();

        for (let i = 0; i < this.pieces.length; i++) {
            for (let j = 0; j < this.pieces[i].length; j++) {

                if (this.pieces[i][j] == null)
                    continue;

                this.pieces[i][j].display();
            }

        }

    }

    updateTexCoords(s, t) {}
}