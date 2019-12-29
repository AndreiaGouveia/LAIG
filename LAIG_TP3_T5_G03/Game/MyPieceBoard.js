/**
 * MyPieceBoard class, which represents a Patch object
 */
class MyPieceBoard extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene, player) {
        super(scene);

        this.player = player;
        this.board = new MySideBoard(this.scene, 4, 2);

        this.pieces = [
            new MyMarshmallow(this.scene, player), new MyMarshmallow(this.scene, player),
            new MyDonut(this.scene, player), new MyDonut(this.scene, player),
            new MyChristmasTree(this.scene, player), new MyChristmasTree(this.scene, player),
            new MyIceCream(this.scene, player), new MyIceCream(this.scene, player),
        ];

        this.grey = new CGFappearance(scene);
        this.grey.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.grey.setDiffuse(0.3, 0.3, 0.3, 1.0);
        this.grey.setSpecular(1, 1, 1, 1.0);
        this.grey.setShininess(10.0);

    }

    display() {

        this.scene.pushMatrix();

        this.scene.translate(0, 0.2, 0);

        for (let i = 0; i < this.pieces.length; i++) {

            if (this.pieces[i] != null) {


                this.scene.pushMatrix();

                this.scene.translate(((i % 2) - 1) * 0.5 + 0.25, 0, (2 - Math.floor(i / 2)) * 0.5 - 0.25);

                this.scene.registerForPick(this.player * 100 + i, this.pieces[i]);
                this.pieces[i].display();
                this.scene.clearPickRegistration();

                this.scene.popMatrix();

            }


        }

        this.scene.popMatrix();

        this.grey.apply();
        this.board.display();

        this.scene.pushMatrix();

        this.scene.popMatrix();
    }

    updateTexCoords(s, t) {}
}