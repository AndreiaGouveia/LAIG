/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by default)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function() {};
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        if(event.code == "KeyM") 
        this.scene.rotateMaterials():
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }


    createCamerasDropdown(graph) {


        const cameraDropdownModel = [
            ...Object.keys(graph.cameras)
        ];

        this.scene.cameraIndex = graph.defaultViewId;

        this.gui.add(this.scene, "cameraIndex", cameraDropdownModel)
            .name("View ")
            .onChange(val => this.scene.setCurrentCamera(val));
    }

    createLightsCheckboxes(graph) {
        const lights = graph.lights;

        var folder = this.gui.addFolder("Lights");
        folder.open();

        this.scene.lightValues = [];
        for (var lightKey in lights) {

            if (lights.hasOwnProperty(lightKey)) {
                this.scene.lightValues[lightKey] = true;
                folder.add(this.scene.lightValues, lightKey).onChange(val => {
                    this.scene.setLightState(lightKey, val);
                })
            }

        }

    }
}