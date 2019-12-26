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

        this.donut = new MyTorus(scene, "donut", 5, 10, 20, 20);

        this.color = new CGFappearance(scene);
        this.color.setAmbient(1, 1, 1, 1);
        this.donutTexture = new CGFtexture(this.scene, "scenes/images/donut1.png");
        this.color.setTexture(this.donutTexture);


    }

    display() {

        this.color.apply();

        this.scene.scale(0.01, 0.01, 0.01);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.donut.display();

    }

    updateTexCoords(s, t) {}
}