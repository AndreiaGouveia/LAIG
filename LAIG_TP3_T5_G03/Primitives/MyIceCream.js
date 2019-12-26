/**
 * MyIceCream class, which represents a Patch object
 */
class MyIceCream extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene) {
        super(scene);

        this.cone = new Cylinder2(scene, 0, 2, 10, 10, 10);
        this.iceCream = new MySphere(scene, 0, 2.5, 10, 10);
        this.iceCream1 = new MySphere(scene, 0, 2, 10, 10);
        this.iceCream2 = new MySphere(scene, 0, 1.5, 10, 10);

        
        this.ice = new CGFappearance(scene);
        this.ice.setAmbient(1, 1, 1, 1);
        this.coneColor = new CGFappearance(scene);
        this.coneColor.setAmbient(1, 1, 1, 1);

        this.creamTexture = new CGFtexture(this.scene, "../scenes/images/cream.jpg");
        this.coneTexture = new CGFtexture(this.scene, "../scenes/images/cone.jpg");

        this.ice.setTexture(this.creamTexture);
        this.coneColor.setTexture(this.coneTexture);

    }

    display() {

        this.scene.pushMatrix();
        this.ice.apply();
        this.scene.translate(0,9,0);
        this.iceCream.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,11,0);
        this.iceCream1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,13,0);
        this.iceCream2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.coneColor.apply();
        this.scene.translate(0,0,1);
        this.scene.rotate(Math.PI,1.0,0.0,0.0)
        this.cone.display();
        this.scene.popMatrix();
    }
    

    updateTexCoords(s, t) {}
}