/**
 * MyGameBoard class, which represents a Patch object
 */
class MyGameBoard extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene) {
        super(scene);

        this.board = new MyBoard(this.scene);

        this.pieces = [
            [new MyMarshmallow(this.scene), new MyMarshmallow(this.scene), new MyDonut(this.scene), new MyDonut(this.scene)],
            [null, null, null, null],
            [null, new MyChristmasTree(this.scene), new MyDonut(this.scene), new MyMarshmallow(this.scene)],
            [new MyIceCream(this.scene), null, null, null],
        ];

        this.grey = new CGFappearance(scene);
        this.grey.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.grey.setDiffuse(0.3, 0.3, 0.3, 1.0);
        this.grey.setSpecular(1, 1, 1, 1.0);
        this.grey.setShininess(10.0);

    }

    display() {

        this.grey.apply();

        this.scene.pushMatrix();

        this.scene.scale(15, 15, 15);

        this.board.display();

        this.scene.pushMatrix();

        this.scene.translate(0, 0.2, 0);

        for (let i = 0; i < this.pieces.length; i++) {
            for (let j = 0; j < this.pieces[i].length; j++) {

                if (this.pieces[i][j] != null) {

                    this.scene.pushMatrix();

                    this.scene.translate((i - 2) * 0.5 + 0.25, 0, (j - 2) * 0.5 + 0.25);
                    this.pieces[i][j].display();

                    this.scene.popMatrix();
                }
            }

        }

        this.scene.popMatrix();

        this.scene.popMatrix();

    }

    updateTexCoords(s, t) {}
}