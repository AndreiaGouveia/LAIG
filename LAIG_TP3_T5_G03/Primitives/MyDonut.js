/**
 * MyDonut class, which represents a Patch object
 */
class MyDonut extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene) {
        super(scene);

        this.donut = new CGFOBJModel(this.scene, '../models/donut.obj');

        this.brown = new CGFappearance(scene);
        this.brown.setAmbient(60 / 255, 30 / 255, 10 / 255, 1.0);


    }

    display() {

        this.brown.apply();

        this.scene.scale(0.01, 0.01, 0.01);
        this.donut.display();

    }

    updateTexCoords(s, t) {}
}