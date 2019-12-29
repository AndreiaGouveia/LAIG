/**
 * MyPiece class, which represents a Patch object
 */
class MyPiece extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene, player) {

        super(scene);
        this.animation = null;
        this.player = player
    }

    setAnimation(initialPositionBoard, initialX, finalX, finalZ) {


        this.animation = new KeyframeAnimation(this.scene, "pieceAnim");


        let initialPosition = [((initialX % 2) - 1) * 0.5 + 0.25, 0, (2 - Math.floor(initialX / 2)) * 0.5 - 0.25];

        let output = [];
        initialPositionBoard.forEach(function(curr, i) {
            output[i] = initialPosition[i] + initialPositionBoard[i];
        });

        console.log(output);

        let firstKeyFrame = new KeyframeModel(0, output, [0, 0, 0], [1, 1, 1]);
        this.animation.addKeyFrame(firstKeyFrame);

        let lastKeyFrame = new KeyframeModel(2, [(finalX - 2) * 0.5 + 0.25, 0, (2 - finalZ) * 0.5 - 0.25], [0, 0, 0], [1, 1, 1]);

        this.animation.addKeyFrame(lastKeyFrame);

    }

    update(currTime) {

        if (this.animation != null)
            this.animation.update(currTime);
    }
}