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

        this.cone = new Cylinder2(scene, 0, 2.5, 5, 10, 10);
        this.iceCream = new MySphere(scene, 0, 2.5, 10, 10);
        this.iceCream1 = new MySphere(scene, 0, 2, 10, 10);
        this.iceCream2 = new MySphere(scene, 0, 1.5, 10, 10);

    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(0,4,0);
        this.iceCream.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,6,0);
        this.iceCream1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,8,0);
        this.iceCream2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,1);
        this.scene.rotate(Math.PI,1.0,0.0,0.0)
        this.cone.display();
        this.scene.popMatrix();
    }
    

    updateTexCoords(s, t) {}
}