class MySecurityCamera extends CGFobject {

    constructor(scene) {
        super(scene);

        this.rectangle = new MyRectangle(scene, 'securityCamera', 0.5, 1, -1, -0.5);

        this.shader = new CGFshader(this.scene.gl, "Shaders/securityCamera.vert", "Shaders/securityCamera.frag");
        this.shader.setUniformsValues({ uSampler: 0 });
        this.shader.setUniformsValues({ gradient_color: 1 });

        this.textureExp = new CGFtexture(scene, "scenes/images/linear_gradient.png");

    }

    display() {

        this.scene.setActiveShader(this.shader); // activate selected shader


        this.scene.secTexture.bind(0); // bind RTTtexture
        this.textureExp.bind(1);
        this.rectangle.display(); //display retangle

        this.scene.setActiveShader(this.scene.defaultShader);



    }

}