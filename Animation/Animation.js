class Animation {

    constructor(scene, animationId, animationSpan) {
        this.scene = scene;
        this.animationId = animationId;
        this.animationSpan = animationSpan;

        this.timeElapsed = 0;
        this.endOfAnimation = false;

        this.animationMatrix = mat4.create();

    }

    update(currTime) {

        this.timeElapsed += currTime;

        if (this.timeElapsed > this.animationSpan)
            this.endOfAnimation = true;
    }

    apply() {

        this.scene.multMatrix(this.currentMatrix);

    }


}