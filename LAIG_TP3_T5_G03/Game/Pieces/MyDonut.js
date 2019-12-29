/**
 * MyDonut class, which represents a Patch object
 */
class MyDonut extends MyPiece {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene, player) {
        super(scene, player);

        this.donut = new MyTorus(scene, "donut", 0.04, 0.08, 20, 20);

        this.color = new CGFappearance(scene);
        this.color.setAmbient(1, 1, 1, 1);

        if (player == 1)
            this.donutTexture = new CGFtexture(this.scene, "scenes/images/donut.png");
        else
            this.donutTexture = new CGFtexture(this.scene, "scenes/images/donut2.jpg");


    }


    display() {

        this.color.setTexture(this.donutTexture);
        this.color.apply();

        this.scene.pushMatrix();

        this.scene.translate(0, -0.01, 0);

        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.donut.display();

        this.scene.popMatrix();

        this.color.setTexture(null);
        this.color.apply();

    }

    updateTexCoords(s, t) {}
}