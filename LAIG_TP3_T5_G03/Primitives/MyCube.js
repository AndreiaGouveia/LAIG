/**
 * MyGameBoard class, which represents a Patch object
 */
class MyCube extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene) {
        super(scene);

        this.plane = new MyPlane(scene, 10, 10);

    }

    display() {

        this.scene.pushMatrix();

        this.scene.translate(0, 0.5, 0);

        this.plane.display();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.25, 0.25);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.25, -0.25);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.25, -0.25, 0);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.plane.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(-0.25, -0.25, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.plane.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

    }

    updateTexCoords(s, t) {}
}