/**
 * MyGameBoard class, which represents the Main Board of the Game
 */
class MyGameBoard extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene) {
        super(scene);

        this.board = new MyBoard(this.scene);
        this.sideBoard1 = new MyPieceBoard(this.scene, 1);
        this.positionOfSideBoard1 = [-1.75, 0, 0];
        this.sideBoard2 = new MyPieceBoard(this.scene, 2);
        this.positionOfSideBoard2 = [1.75, 0, 0];
    }

    update(currTime) {

        this.board.update(currTime);
    }

    reset() {

        this.board.reset();
        this.sideBoard1.reset();
        this.sideBoard2.reset();
    }

    display() {

        this.scene.pushMatrix();

        this.scene.scale(30, 30, 30);

        this.board.display();


        this.scene.pushMatrix();
        this.scene.translate(...this.positionOfSideBoard1);
        this.sideBoard1.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(...this.positionOfSideBoard2);
        this.sideBoard2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();

        this.scene.popMatrix();

    }
}