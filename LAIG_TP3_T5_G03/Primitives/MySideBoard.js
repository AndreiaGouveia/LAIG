/**
 * MySideBoard class, which represents an auxiliary board
 */
class MySideBoard extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene, x, y) {
        super(scene);

        this.cubes = [];

        for (let i = 0; i < x; i++) {

            this.cubes.push([]);

            for (let j = 0; j < y; j++) {

                this.cubes[i].push(new MyCube(scene, 10, 10));
            }

        }

    }

    display() {

        this.scene.pushMatrix();

        this.scene.scale(1, 0.3, 1);

        this.scene.translate(-0.25 * (this.cubes[0].length - 1), 0, 0.25 * (this.cubes.length - 1));

        for (let i = 0; i < this.cubes.length; i++) {

            this.scene.pushMatrix();

            for (let j = 0; j < this.cubes[i].length; j++) {
                this.scene.pushMatrix();

                this.cubes[i][j].display();

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