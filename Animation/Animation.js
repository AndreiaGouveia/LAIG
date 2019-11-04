class Animation {

    constructor(scene, animationId) {
        this.scene = scene;
        this.animationId = animationId;

        this.timeElapsed = 0;

        this.animationMatrix = mat4.create();

    }

    update(currTime) {

        this.timeElapsed += currTime;
    }

    apply() {

        return this.animationMatrix;

    }


}