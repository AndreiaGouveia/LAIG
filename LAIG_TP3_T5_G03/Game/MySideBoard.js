/**
 * MySideBoard class, which represents an auxiliary board
 */
class MySideBoard extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene    represents the CGFscene
     * @param x                   size of board in x
     * @param y                   size of board in y
     */
    constructor(scene, x, y) {
        super(scene);

        this.x = x;
        this.y = y;

        this.cube = new MyCube(scene, 10, 10);

    }

    display() {

        this.scene.pushMatrix();

        this.scene.scale(1, 0.3, 1);

        this.scene.translate(-0.25 * (this.y - 1), 0, 0.25 * (this.x - 1));

        for (let i = 0; i < this.x; i++) {

            this.scene.pushMatrix();

            for (let j = 0; j < this.y; j++) {
                this.scene.pushMatrix();

                this.cube.display();

                this.scene.popMatrix();

                this.scene.translate(0.5, 0, 0);

            }

            this.scene.popMatrix();

            this.scene.translate(0, 0, -0.5);

            if (i == 4) {
                higher = true;
            }
        }

        this.scene.popMatrix();

    }

    updateTexCoords(s, t) {}
}