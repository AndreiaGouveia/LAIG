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
        if (event.code === "KeyM") {
            this.scene.materialKeyCounter++;
        }
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    addGameSettings() {
        var group = this.gui.addFolder("game");
        group.open();
    
        group.add(this.scene.quantik, 'gameDifficulty', { Easy: '1', Hard: '2' }).name("Difficulty");
        group.add(this.scene.quantik, 'gameMode', { 'Player v Player': '1', 'Player v Bot': '2', 'Bot v Bot': '3' }).name("Mode");
        group.add(this.scene.quantik, 'startGame').name("Start");
        group.add(this.scene.quantik, 'undo').name("Undo"); 
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

                this.scene.lightValues[lightKey] = lights[lightKey][0];
                folder.add(this.scene.lightValues, lightKey);
            }

        }

    }

}