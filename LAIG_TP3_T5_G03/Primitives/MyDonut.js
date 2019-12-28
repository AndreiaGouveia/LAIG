/**
 * MyDonut class, which represents a Patch object
 */
class MyDonut extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene, player) {
        super(scene);

        
        if(player == 0)
            this.id = 2;
        else this.id = 7;

        this.donut = new MyTorus(scene, "donut", 0.04, 0.08, 20, 20);

        this.color = new CGFappearance(scene);
        this.color.setAmbient(1, 1, 1, 1);

        if(player == 0)
        this.donutTexture = new CGFtexture(this.scene, "scenes/images/donut.png");
            else this.donutTexture = new CGFtexture(this.scene, "scenes/images/donut2.jpg");


    }

    getId(){
        return this.id;
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