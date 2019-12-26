/**
 * MyGameBoard class, which represents a Patch object
 */
class MyBoard extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene) {
        super(scene);

        this.cubes = [];

        for (let i = 0; i < 16; i++) {

            this.cubes[i] = new MyCube(scene, 10, 10);
        }

    }

    display() {

        this.scene.pushMatrix();

        this.scene.translate(-0.25 * (this.cubes.length / 4 - 1), 0, 0.25 * (this.cubes.length / 4 - 1));

        let higher = false;

        for (let i = 0; i < this.cubes.length; i += 4) {

            this.scene.pushMatrix();

            for (let j = i; j < i + 4; j++) {

                let n_row = j - i;

                this.scene.pushMatrix();
                if (higher && (n_row == 0 || n_row == 1)) {

                    this.scene.scale(1, 0.6, 1);

                } else if (!higher && (n_row == 2 || n_row == 3)) {

                    this.scene.scale(1, 0.6, 1);

                }

                this.cubes[j].display();

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