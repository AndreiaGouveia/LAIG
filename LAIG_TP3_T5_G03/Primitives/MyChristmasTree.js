/**
 * MyChristmasTree class, which represents a Patch object
 */
class MyChristmasTree extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene) {
        super(scene);

        this.trunk = new Cylinder2(scene, 2, 2, 10, 10, 10);
        this.leaf = new Cylinder2(scene, 0, 5, 5, 10, 10);
        this.leaf1 = new Cylinder2(scene, 0, 5, 5, 10, 10);
        this.leaf2 = new Cylinder2(scene, 0, 5, 5, 10, 10);

        
        this.ice = new CGFappearance(scene);
        this.ice.setAmbient(1, 1, 1, 1);
        this.trunkColor = new CGFappearance(scene);
        this.trunkColor.setAmbient(1, 1, 1, 1);

        this.creamTexture = new CGFtexture(this.scene, "../scenes/images/folha.jpg");
        this.trunkTexture = new CGFtexture(this.scene, "../scenes/images/tronco.jpg");

        this.ice.setTexture(this.creamTexture);
        this.trunkColor.setTexture(this.trunkTexture);

    }

    display() {

        this.scene.pushMatrix();
        this.ice.apply();
        this.scene.translate(0,11,-2);
        this.scene.scale(1.5,1.5,1.5);
        this.leaf.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,15,-2);
        this.scene.scale(1.4,1.4,1.4);
        this.leaf1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,18,-2);
        this.scene.scale(1.2,1.2,1.2);
        this.leaf2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.trunkColor.apply();
        this.scene.translate(0,-5,0);
        this.scene.rotate(Math.PI,1.0,0.0,0.0)
        this.scene.scale(1,1.5,1);
        this.trunk.display();
        this.scene.popMatrix();
    }
    

    updateTexCoords(s, t) {}
}