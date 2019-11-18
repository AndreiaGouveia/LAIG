class MySecurityCamera extends CGFobject {

    constructor(scene) {
        super(scene);

        this.rectangle = new MyRectangle(scene, 'securityCamera', 0.5, 1, -1, -0.5);

        this.shader = new CGFshader(this.scene.gl, "Shaders/securityCamera.vert", "Shaders/securityCamera.frag");

    }

    display() {

        this.scene.setActiveShader(this.shader); // activate selected shader

        this.scene.secTexture.bind(0); // bind RTTtexture
        this.rectangle.display(); //display retangle

        this.scene.setActiveShader(this.scene.defaultShader);


    }

}