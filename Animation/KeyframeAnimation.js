class KeyframeAnimation extends Animation {

    constructor(scene, animationId) {
        super(scene, animationId);

        this.keyFrames = [];
    }

    addKeyFrame(keyFrameModel) {
        this.keyFrames.push(keyFrameModel);
    }

    apply() {

        if (!this.endOfAnimation && this.keyFrames.length != 0) {

            var newMatrix = mat4.create();

            var keyFrameToUse = null;
            var timeKeyFrame = 1000;

            for (var i = 0; i < this.keyFrames.length; i++) {

                if (this.timeElapsed > this.keyFrames[i].endInstant)
                    continue;

                //If currentFrame ends after this one, than we should use this one
                if (timeKeyFrame > this.keyFrames[i].endInstant) {
                    timeKeyFrame = this.keyFrames[i].endInstant;
                    keyFrameToUse = this.keyFrames[i];
                }

            }

            if (keyFrameToUse == null) {
                this.endOfAnimation = true;
            } else {

                this.percentageOfMovement = 1 - ((keyFrameToUse.endInstant - this.timeElapsed) / keyFrameToUse.endInstant);

                mat4.translate(newMatrix, newMatrix, keyFrameToUse.translation.map(x => x * this.percentageOfMovement));

                mat4.rotate(newMatrix, newMatrix, keyFrameToUse.rotation[0] * DEGREE_TO_RAD * this.percentageOfMovement, [1, 0, 0]); // rotation in x
                mat4.rotate(newMatrix, newMatrix, keyFrameToUse.rotation[1] * DEGREE_TO_RAD * this.percentageOfMovement, [0, 1, 0]); // rotation in y
                mat4.rotate(newMatrix, newMatrix, keyFrameToUse.rotation[2] * DEGREE_TO_RAD * this.percentageOfMovement, [0, 0, 1]); // rotation in z

                mat4.scale(newMatrix, newMatrix, keyFrameToUse.scale.map(x => x * this.percentageOfMovement));

                this.animationMatrix = newMatrix;
            }
        }

        this.scene.multMatrix(this.animationMatrix);

    }

}