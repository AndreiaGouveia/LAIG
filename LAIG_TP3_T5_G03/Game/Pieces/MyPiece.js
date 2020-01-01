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
        this.player = player;
    }

    setAnimation(initialPositionBoard, initialX, finalX, finalZ, isLow) {


        this.animation = new KeyframeAnimation(this.scene, "pieceAnim");

        let initialPositionWithinBoard = [((initialX % 2) - 1) * 0.5 + 0.25, 0.2, (2 - Math.floor(initialX / 2)) * 0.5 - 0.25];

        let initialPosition = [];
        initialPositionBoard.forEach(function(curr, i) {
            initialPosition[i] = initialPositionWithinBoard[i] + initialPositionBoard[i];
        });

        let firstKeyFrame = new KeyframeModel(-0.1, initialPosition, [0, 0, 0], [1, 1, 1]);
        this.animation.addKeyFrame(firstKeyFrame);

        let topPosition1 = new KeyframeModel(1, [initialPosition[0], 0.5 + initialPosition[1], initialPosition[2]], [0, 0, 0], [1, 1, 1]);
        this.animation.addKeyFrame(topPosition1);

        let hight = 0.2;

        if (isLow)
            hight = 0.15;

        let finalPosition = [(finalX - 2) * 0.5 + 0.25, hight, (2 - finalZ) * 0.5 - 0.25];

        let topPosition2 = new KeyframeModel(2, [finalPosition[0], 0.5 + finalPosition[1], finalPosition[2]], [0, 0, 0], [1, 1, 1]);
        this.animation.addKeyFrame(topPosition2);

        let lastKeyFrame = new KeyframeModel(3, finalPosition, [0, 0, 0], [1, 1, 1]);
        this.animation.addKeyFrame(lastKeyFrame);

    }

    update(currTime) {

        if (this.animation != null)
            this.animation.update(currTime);
    }
}