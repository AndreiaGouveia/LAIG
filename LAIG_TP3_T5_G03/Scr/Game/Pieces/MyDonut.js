/**
 * MyDonut class, which represents a Donut object
 */
class MyDonut extends MyPiece {

    /**
     * @constructor
     * @param {XMLScene} scene   represents the CGFscene
     * @param player             player that owns the Board 
     */
    constructor(scene, player) {
        super(scene, player);

        this.donut = new MyTorus(scene, "donut", 0.04, 0.08, 20, 20);

        this.color = new CGFappearance(scene);
        this.color.setAmbient(1, 1, 1, 1);
        this.player = player

        if (player == 1)
            this.donutTexture = new CGFtexture(this.scene, "scenes/images/donut.png");
        else
            this.donutTexture = new CGFtexture(this.scene, "scenes/images/donut2.jpg");


    }

    getId() {
        if (this.player == 1) {
            return 3;
        }

        return 8;
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