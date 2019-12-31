var DEGREE_TO_RAD = Math.PI / 180;

var EXCESSIVE_DELTA = 1000;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(1000 / 60);

        this.materialKeyCounter = 0;

        this.secObject = new MySecurityCamera(this); //create retangle object
        this.secTexture = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height); //create render-to-texture texture

        this.quantik = new Quantik(this);
    }

    update(currTime) {

        this.lastTime = this.lastTime || 0;

        //tempo que passou desde a ultima vez que esta função foi chamada
        this.delta = currTime - this.lastTime;

        this.lastTime = currTime;

        if (this.delta > EXCESSIVE_DELTA) {
            return;
        }

        var timeInSeconds = this.delta / 1000;

        if (this.quantik.gameBoard == undefined)
            return;

        this.quantik.gameBoard.update(timeInSeconds);

        if (this.animations == undefined)
            return;

        for (var key in this.animations) {
            this.animations[key].update(timeInSeconds);
        }

        this.secObject.updateTime(currTime / 150 % 1000);


    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {

        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));


        this.securityCamera = new CGFcamera(45 * DEGREE_TO_RAD, 0.1, 500, vec3.fromValues(-100, 90, -140), vec3.fromValues(-20, 0, -20));


        this.interface.setActiveCamera(this.camera);
    }

    initXMLCameras() {
        this.camera = this.graph.cameras[this.graph.defaultViewId];
        this.interface.setActiveCamera(this.camera);

        this.newCamera = this.camera;
    }

    setCurrentCamera(newCameraID) {

            this.camera = this.graph.cameras[newCameraID];
            this.newCamera = this.camera;
            this.interface.setActiveCamera(this.camera);
        }
        /**
         * Initializes the scene lights with the values read from the XML file.
         */
    initLights() {
        var i = 0;
        // Lights index.

        this.lightsMapId = [];

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break; // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lightsMapId[i] = key;

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0], light[9][1], light[9][2]);
                }

                this.lights[i].setVisible(true);

                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();


                this.lights[i].update();

                i++;
            }
        }
    }

    setLightState(lightIndex) {

        if (this.lightsMapId == undefined)
            return;

        var lightId = this.lightsMapId[lightIndex];

        if (lightId == -1)
            return;

        if (this.lightValues[lightId])
            this.lights[lightIndex].enable();
        else
            this.lights[lightIndex].disable();

        this.lights[lightIndex].update();
    }

    setDefaultAppearance() {
            this.setAmbient(0.2, 0.4, 0.8, 1.0);
            this.setDiffuse(0.2, 0.4, 0.8, 1.0);
            this.setSpecular(0.2, 0.4, 0.8, 1.0);
            this.setShininess(10.0);
        }
        /** Handler called when the graph is finally loaded. 
         * As loading is asynchronous, this may be called already after the application has started the run loop
         */
    onGraphLoaded() {

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();
        this.initXMLCameras();

        this.sceneInited = true;
    }

    display() {


        this.quantik.gameBoard.logPicking();
        this.clearPickRegistration();

        this.secTexture.attachToFrameBuffer();

        this.camera = this.securityCamera;
        this.interface.setActiveCamera(this.camera);

        this.render();

        this.secTexture.detachFromFrameBuffer();

        this.camera = this.newCamera || this.camera;
        this.interface.setActiveCamera(this.camera);

        this.render();


        this.gl.disable(this.gl.DEPTH_TEST);

        this.secObject.display();


        this.gl.enable(this.gl.DEPTH_TEST);

    }

    /**
     * Displays the scene.
     */
    render() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.setLightState(i);
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}