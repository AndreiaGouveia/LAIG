/**
 * MyMarshmallow class, which represents a Patch object
 */
class MyMarshmallow extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene, player) {
        super(scene);
        
        if(player == 0)
            this.id = 4;
        else this.id = 9;

        this.marshmallow = new MyCylinder(scene, "marshmallow", 0.1, 0.1, 0.15, 20, 20);
        this.marshmallow.updateTexCoords(0.25, 1);

        this.top = new MyCircle(this.scene, 20);

        this.color = new CGFappearance(scene);
        this.color.setAmbient(1, 1, 1, 1);

        if(player == 0)
        this.donutTexture = new CGFtexture(this.scene, "scenes/images/marshmallow.jpg");
            else this.donutTexture = new CGFtexture(this.scene, "scenes/images/marsh.jpg");


    }

    getId(){
        return this.id;
    }

    display() {

        this.color.setTexture(this.donutTexture);
        this.color.setTextureWrap('REPEAT', 'REPEAT');
        this.color.apply();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.marshmallow.display();


        this.scene.pushMatrix();

        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 0.1);
        this.top.display();

        this.scene.popMatrix();


        this.scene.pushMatrix();


        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 0.1);
        this.scene.translate(0, 1.5, 0);
        this.top.display();

        this.scene.popMatrix();

        this.scene.popMatrix();

        this.color.setTexture(null);
        this.color.apply();

    }

    updateTexCoords(s, t) {}
}