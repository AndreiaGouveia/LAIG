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

        this.green = new CGFappearance(scene);
        this.green.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.green.setDiffuse(0.3, 0.3, 0.3, 1.0);
        this.green.setSpecular(1, 1, 1, 1.0);
        this.green.setShininess(10.0);

    }

    display() {

        this.green.apply();

        this.board.display();

    }

    updateTexCoords(s, t) {}
}