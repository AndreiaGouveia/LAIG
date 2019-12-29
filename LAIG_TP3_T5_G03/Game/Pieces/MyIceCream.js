/**
 * MyIceCream class, which represents a Patch object
 */
class MyIceCream extends MyPiece {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene, player) {
        super(scene, player);

        this.cone = new MyCylinder(scene, "cone", 0, 0.07, 0.2, 10, 10);
        this.iceCream = new MySphere(scene, 'ice cream', 0.07, 10, 10);

        this.ice = new CGFappearance(scene);
        this.ice.setAmbient(1, 1, 1, 1);
        this.coneColor = new CGFappearance(scene);
        this.coneColor.setAmbient(1, 1, 1, 1);

        if (player == 1)
            this.creamTexture = new CGFtexture(this.scene, "../scenes/images/cream.jpg");
        else
            this.creamTexture = new CGFtexture(this.scene, "../scenes/images/mint.jpg");

        this.coneTexture = new CGFtexture(this.scene, "../scenes/images/cone.jpg");

        this.ice.setTexture(this.creamTexture);
        this.coneColor.setTexture(this.coneTexture);

    }

    display() {

        this.scene.pushMatrix();

        this.scene.rotate(-Math.PI / 2, 1.0, 0.0, 0.0)
        this.scene.translate(0, 0, -0.05);

        this.coneColor.apply();

        this.scene.pushMatrix();
        this.cone.display();
        this.scene.popMatrix();

        this.ice.apply();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.2);
        this.iceCream.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.25);
        this.scene.scale(0.8, 0.8, 0.8);
        this.iceCream.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.3);
        this.scene.scale(0.6, 0.6, 0.6);
        this.iceCream.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }


    updateTexCoords(s, t) {}
}