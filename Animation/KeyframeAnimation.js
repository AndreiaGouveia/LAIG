class KeyframeAnimation extends Animation {

    constructor(scene, animationId, animationSpan) {
        super(scene, animationId, animationSpan);

        this.keyFrames = [];
    }

    addKeyFrame(keyFrameModel) {
        this.keyFrames.add(keyFrameModel);
    }

    apply() {

        var newMatrix = mat4.create();

        var keyFrameToUse;
        var timeKeyFrame = 1000;

        for (var i = 0; i < this.keyFrames.length; i++) {

            if (timeKeyFrame > this.keyFrames[i].endInstant) {
                timeKeyFrame = this.keyFrames[i].endInstant;
                keyFrameToUse = this.keyFrames[i];
            }

        }

        this.percentageOfMovement = 1 - ((this.endInstant - this.timeElapsed) / this.endInstant);

        mat4.translate(newMatrix, newMatrix, keyFrameToUse.translation);
        mat4.rotate(newMatrix, newMatrix, keyFrameToUse.rotation[0], [1, 0, 0]); // rotation in x
        mat4.rotate(newMatrix, newMatrix, keyFrameToUse.rotation[1], [0, 1, 0]); // rotation in y
        mat4.rotate(newMatrix, newMatrix, keyFrameToUse.rotation[2], [0, 0, 1]); // rotation in z

        mat4.scale(newMatrix, newMatrix, keyFrameToUse.scale);

        super.apply();

    }

}