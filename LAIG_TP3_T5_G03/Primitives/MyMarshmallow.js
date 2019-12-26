/**
 * MyMarshmallow class, which represents a Patch object
 */
class MyMarshmallow extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene) {
        super(scene);

        this.marshmallow = new MyCylinder(scene, "marshmallow", 0.25, 0.25, 0.25, 20, 20);
        this.marshmallow.updateTexCoords(0.25, 1);

        this.top = new MyCircle(this.scene, 20);

        this.color = new CGFappearance(scene);
        this.color.setAmbient(1, 1, 1, 1);
        this.donutTexture = new CGFtexture(this.scene, "scenes/images/marshmallow.jpg");


    }

    display() {

        this.color.setTexture(this.donutTexture);
        this.color.setTextureWrap('REPEAT', 'REPEAT');
        this.color.apply();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.8, 0.8, 0.8);
        this.scene.translate(0, 0, -0.1);
        this.marshmallow.display();


        this.scene.pushMatrix();

        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.25, 0.25, 0.25);
        this.top.display();

        this.scene.popMatrix();


        this.scene.pushMatrix();


        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.25, 0.25, 0.25);
        this.top.display();

        this.scene.popMatrix();

        this.scene.popMatrix();

        this.color.setTexture(null);
        this.color.apply();

    }

    updateTexCoords(s, t) {}
}