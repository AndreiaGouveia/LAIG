class KeyframeAnimation extends Animation {

    constructor(scene, animationId) {
        super(scene, animationId);

        this.stage = 0;

        this.keyFrames = [];
    }

    addKeyFrame(keyFrameModel) {
        this.keyFrames.push(keyFrameModel);

        this.keyFrames.sort(function(a, b) {
            return a.endOfAnimation < b.endOfAnimation;
        });
    }

    apply() {

        if (!this.endOfAnimation && this.keyFrames.length != 0) {


            var newMatrix = mat4.create();

            if (this.timeElapsed > this.keyFrames[this.stage].endInstant) {
                this.stage++;
            }

            if (this.stage == this.keyFrames.length) {
                this.endOfAnimation = true;
                this.stage--;
                this.timeElapsed > this.keyFrames[this.stage].endInstant;
            }
            var currentTransformation = this.keyFrames[this.stage];

            var formerTransformation;

            if (this.stage == 0)
                formerTransformation = new KeyframeModel(0, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
            else
                formerTransformation = this.keyFrames[this.stage - 1];

            //Percentage Of Time from the former Transformation and the Current Transformation
            var percentageTime = (this.timeElapsed - formerTransformation.endInstant) / (currentTransformation.endInstant - formerTransformation.endInstant);

            //TRANSFORMATIONS
            var translateX = this.lerp(formerTransformation.translation[0], currentTransformation.translation[0], percentageTime);
            var translateY = this.lerp(formerTransformation.translation[1], currentTransformation.translation[1], percentageTime);
            var translateZ = this.lerp(formerTransformation.translation[2], currentTransformation.translation[2], percentageTime);

            mat4.translate(newMatrix, newMatrix, [translateX, translateY, translateZ]);

            var rotateX = this.lerp(formerTransformation.rotation[0], currentTransformation.rotation[0], percentageTime) * DEGREE_TO_RAD;
            mat4.rotate(newMatrix, newMatrix, rotateX, [1, 0, 0]); // rotation in x

            var rotateY = this.lerp(formerTransformation.rotation[1], currentTransformation.rotation[1], percentageTime) * DEGREE_TO_RAD;
            mat4.rotate(newMatrix, newMatrix, rotateY, [0, 1, 0]); // rotation in Y

            var rotateZ = this.lerp(formerTransformation.rotation[2], currentTransformation.rotation[2], percentageTime) * DEGREE_TO_RAD;
            mat4.rotate(newMatrix, newMatrix, rotateZ, [0, 0, 1]); // rotation in Z


            var scaleX = this.lerp(formerTransformation.scale[0], currentTransformation.scale[0], percentageTime);
            var scaleY = this.lerp(formerTransformation.scale[1], currentTransformation.scale[1], percentageTime);
            var scaleZ = this.lerp(formerTransformation.scale[2], currentTransformation.scale[2], percentageTime);

            mat4.scale(newMatrix, newMatrix, [scaleX, scaleY, scaleZ]);

            //END TRANSFORMATION

            this.animationMatrix = newMatrix;
        }


        this.scene.multMatrix(this.animationMatrix);

    }

    lerp(v0, v1, t) {

        return v0 + t * (v1 - v0);

    }

}