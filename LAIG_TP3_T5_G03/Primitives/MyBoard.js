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

        for (let i = 0; i < 4; i++) {

            this.cubes.push([]);
            for (let j = 0; j < 4; j++) {

                this.cubes[i].push(new MyCube(scene, 10, 10));
            }
        }

    }

    display(board) {

        this.scene.pushMatrix();

        this.scene.scale(1, 0.3, 1);

        this.scene.translate(-0.25 * (this.cubes.length - 1), 0, 0.25 * (this.cubes.length - 1));

        let higher = false;

        for (let i = 0; i < this.cubes.length; i++) {

            this.scene.pushMatrix();

            for (let j = 0; j < this.cubes[i].length; j++) {

                let n_row = j;

                this.scene.pushMatrix();
                if (higher && (n_row == 0 || n_row == 1)) {

                    this.scene.scale(1, 0.6, 1);

                } else if (!higher && (n_row == 2 || n_row == 3)) {

                    this.scene.scale(1, 0.6, 1);

                }


                if (board[i][j] == null) {

                    this.scene.registerForPick((j + 1) * 10 + i + 1, this.cubes[i][j]);
                    this.cubes[i][j].display();
                    this.scene.clearPickRegistration();
                } else {

                    this.cubes[i][j].display();
                }

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