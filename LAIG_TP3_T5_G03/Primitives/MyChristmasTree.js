/**
 * MyChristmasTree class, which represents a Patch object
 */
class MyChristmasTree extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene, player) {
        super(scene);

        if(player == 0)
            this.id = 4;
        else this.id = 8;

        this.trunk = new MyCylinder(scene, "trunk", 0.04, 0.04, 0.2, 10, 10);
        this.leaf = new MyCylinder(scene, "leaf", 0, 0.15, 0.2, 10, 10);


        this.trees = new CGFappearance(scene);
        this.trees.setAmbient(1, 1, 1, 1);
        this.trunkColor = new CGFappearance(scene);
        this.trunkColor.setAmbient(1, 1, 1, 1);

        if(player == 0)
        this.creamTexture = new CGFtexture(this.scene, "../scenes/images/folha.jpg");
        else this.creamTexture = new CGFtexture(this.scene, "../scenes/images/folha2.jpg");
        
        this.trunkTexture = new CGFtexture(this.scene, "../scenes/images/tronco.jpg");

        this.trunkColor.setTexture(this.trunkTexture);

    }

    display() {

        this.scene.pushMatrix();

        this.scene.translate(0, 0.1, 0);

        this.scene.pushMatrix();
        this.trunkColor.apply();

        this.scene.rotate(Math.PI / 2, 1.0, 0.0, 0.0);

        this.trunk.display();

        this.trees.setTexture(this.creamTexture);
        this.trees.apply();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.1);
        this.leaf.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.15);
        this.scene.scale(0.8, 0.8, 0.8);
        this.leaf.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.2);
        this.scene.scale(0.7, 0.7, 0.7);
        this.leaf.display();
        this.scene.popMatrix();


        this.trees.setTexture(null);
        this.trees.apply();

        this.scene.popMatrix();

        this.scene.popMatrix();
    }


    updateTexCoords(s, t) {}
}