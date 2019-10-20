var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBAL_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.textures = [];

        this.idRoot = null; // The id of the root element.

        this.cameras = [];
        this.defaultViewId = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
        this.scene.interface.createCamerasDropdown(this);
        this.scene.interface.createLightsCheckboxes(this);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBAL_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1; // if axis_length doesn't exist, assumes that length is 1

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {

        // Reads views children and node names
        var children = viewsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Initializes views
        this.views = [];

        // Checks if there's at least one of the views (perspective or ortho)
        if (viewsNode.getElementsByTagName('perspective').length == 0 && viewsNode.getElementsByTagName('ortho').length == 0)
            return "at least one view must be defined (either <perspective> or <ortho>) on the <views> block";

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName == "perspective") {

                this.parseViewPerspective(children[i], children[i].nodeName);

                continue;

            }

            if (children[i].nodeName == "ortho") {

                this.parseViewOrtho(children[i], children[i].nodeName);

                continue;

            }
        }

        // Reads default view
        var defaultView = this.reader.getString(viewsNode, "default");

        // Finds and sets default view
        if (this.views[defaultView] == null)
            return "The Default Id given in the <views> block is not from a valid view.";

        this.defaultViewId = defaultView;

        this.log("Parsed views");

        return null;
    }

    parseViewOrtho(perspectiveNode, viewID) {

        // Reads perspective node children and node names
        var perspectiveChildren = perspectiveNode.children;
        var perspectiveNodeNames = [];

        for (var j = 0; j < perspectiveChildren.length; j++)
            perspectiveNodeNames.push(perspectiveChildren[j].nodeName);

        // Reads id, near far, left, righ, top, bottom
        var perpectiveID = this.reader.getString(perspectiveNode, 'id');
        var near = this.reader.getFloat(perspectiveNode, 'near');
        var far = this.reader.getFloat(perspectiveNode, 'far');
        var left = this.reader.getFloat(perspectiveNode, 'left');
        var right = this.reader.getFloat(perspectiveNode, 'right');
        var top = this.reader.getFloat(perspectiveNode, 'top');
        var bottom = this.reader.getFloat(perspectiveNode, 'bottom');

        // Validates id, near, far, angle
        if (perpectiveID == null || near == null || far == null || left == null || right == null || top == null || bottom == null)
            return "unable to parse id, near, far, left, right, top, bottom components (null) on the <perspective> node " + viewID + " from the <views> block";
        else if (isNaN(near) || isNaN(far) || isNaN(left) || isNaN(right) || isNaN(top) || isNaN(bottom))
            return "unable to parse near, far, left right, top, bottom components (NaN) on the <perspective> node " + viewID + " from the <views> block";

        // Checks if id is unique
        if (this.views[perpectiveID] != null)
            return "id '" + perpectiveID + "' on the <perspective> node " + viewID + " from the <views> block is not unique";

        // Sets id, near, far, angle
        this.views[perpectiveID] = [];
        this.views[perpectiveID].type = "perspective"
        this.views[perpectiveID].near = near;
        this.views[perpectiveID].far = far;
        this.views[perpectiveID].left = left;
        this.views[perpectiveID].right = right;
        this.views[perpectiveID].top = top;
        this.views[perpectiveID].bottom = bottom;

        // Gets indexes of each element (from & too)
        var fromIndex = perspectiveNodeNames.indexOf('from');
        var toIndex = perspectiveNodeNames.indexOf('to');
        var upIndex = perspectiveNodeNames.indexOf('up');

        //=======================================================================================================
        //FROM BLOCK
        if (fromIndex == -1)
            return "tag <from> is not present on the <perpective> node " + perpectiveID + " from the <materials> block";

        var returnValueFrom = this.parseFromToUpView(perspectiveChildren[fromIndex], perpectiveID);

        if (returnValueFrom instanceof String)
            return returnValueFrom;


        this.views[perpectiveID].from = returnValueFrom;

        //=======================================================================================================
        //TO BLOCK
        if (toIndex == -1)
            return "tag <To> is not present on the <perpective> node " + perpectiveID + " from the <materials> block";

        var returnValueTo = this.parseFromToUpView(perspectiveChildren[toIndex], perpectiveID);

        if (returnValueTo instanceof String)
            return returnValueTo;


        this.views[perpectiveID].to = returnValueTo;

        //=======================================================================================================
        //UP BLOCK
        var returnValueUp;

        if (upIndex == -1)
            returnValueUp = { x: 0, y: 1, z: 0 };
        else {
            returnValueUp = this.parseFromToUpView(perspectiveChildren[upIndex], perpectiveID);

            if (returnValueUp instanceof String)
                return returnValueUp;
        }

        this.views[perpectiveID].up = returnValueUp;


        this.cameras[perpectiveID] = new CGFcameraOrtho(
            left, right, bottom, top,
            near, far,
            vec3.fromValues(...Object.values(returnValueFrom)),
            vec3.fromValues(...Object.values(returnValueTo)),
            vec3.fromValues(...Object.values(returnValueUp))
        );

        return null;

    }

    parseViewPerspective(perspectiveNode, viewID) {

        // Reads perspective node children and node names
        var perspectiveChildren = perspectiveNode.children;
        var perspectiveNodeNames = [];

        for (var j = 0; j < perspectiveChildren.length; j++)
            perspectiveNodeNames.push(perspectiveChildren[j].nodeName);

        // Reads id, near far, angle
        var perpectiveID = this.reader.getString(perspectiveNode, 'id');
        var near = this.reader.getFloat(perspectiveNode, 'near');
        var far = this.reader.getFloat(perspectiveNode, 'far');
        var angle = this.reader.getFloat(perspectiveNode, 'angle');

        // Validates id, near, far, angle
        if (perpectiveID == null || near == null || far == null || angle == null)
            return "unable to parse id, near, far, angle components (null) on the <perspective> node " + viewID + " from the <views> block";
        else if (isNaN(near) || isNaN(far) || isNaN(angle))
            return "unable to parse near, far, angle components (NaN) on the <perspective> node " + viewID + " from the <views> block";

        // Checks if id is unique
        if (this.views[perpectiveID] != null)
            return "id '" + perpectiveID + "' on the <perspective> node " + viewID + " from the <views> block is not unique";

        // Sets id, near, far, angle
        this.views[perpectiveID] = [];
        this.views[perpectiveID].type = "perspective"
        this.views[perpectiveID].near = near;
        this.views[perpectiveID].far = far;
        this.views[perpectiveID].angle = angle * DEGREE_TO_RAD;

        // Creates from and to variables
        this.views[perpectiveID].to = []

        // Gets indexes of each element (from & too)
        var fromIndex = perspectiveNodeNames.indexOf('from');
        var toIndex = perspectiveNodeNames.indexOf('to');

        //=======================================================================================================
        //FROM BLOCK
        if (fromIndex == -1)
            return "tag <from> is not present on the <perpective> node " + perpectiveID + " from the <materials> block";

        var returnValueFrom = this.parseFromToUpView(perspectiveChildren[fromIndex], perpectiveID);

        if (returnValueFrom instanceof String)
            return returnValueFrom;

        this.views[perpectiveID].from = returnValueFrom;

        //=======================================================================================================
        //TO BLOCK
        if (toIndex == -1)
            return "tag <To> is not present on the <perpective> node " + perpectiveID + " To the <materials> block";

        var returnValueTo = this.parseFromToUpView(perspectiveChildren[toIndex], perpectiveID);

        if (returnValueTo instanceof String)
            return returnValueTo;

        this.views[perpectiveID].to = returnValueTo;


        this.cameras[perpectiveID] = new CGFcamera(
            angle, near,
            far, vec3.fromValues(...Object.values(returnValueFrom)),
            vec3.fromValues(...Object.values(returnValueTo))
        );

        return null;

    }

    getErrorForView(x, y, z, viewID) {

        // Validates x, y, z values
        if (x == null || y == null || z == null)
            return "unable to parse x, y, z components (null) on tag <from> from the node " + viewID + " from the <views> block";
        else if (isNaN(x) || isNaN(y) || isNaN(z))
            return "unable to parse x, y, z components (NaN) on tag <from> from the node " + viewID + " from the <views> block";

        return null;
    }


    parseFromToUpView(fromNode, viewID) {

        //gets x , y , x coordinates
        var x = this.reader.getFloat(fromNode, 'x');
        var y = this.reader.getFloat(fromNode, 'y');
        var z = this.reader.getFloat(fromNode, 'z');

        var error = this.getErrorForView(x, y, z, viewID);
        if (error != null)
            return error;

        return { x, y, z };
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseGlobals(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color", "typeAttenuation"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || false;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else if (attributeTypes[j] == "color")
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                    else
                        var aux = this.parseAttenuation(grandChildren[attributeIndex], attributeNames[j] + " parseAttenuation for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                } else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                } else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parse the attenuation components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseAttenuation(node, messageError) {
        var attenuation = [];

        // constant
        var constant = this.reader.getFloat(node, 'constant');
        if (!(constant != null && !isNaN(constant) && constant >= 0 && constant <= 1))
            return "Unable to parse constant component of the " + messageError;

        // linear
        var linear = this.reader.getFloat(node, 'linear');
        if (!(linear != null && !isNaN(linear) && linear >= 0 && linear <= 1))
            return "Unable to parse linear component of the " + messageError;

        // quadratic
        var quadratic = this.reader.getFloat(node, 'quadratic');
        if (!(quadratic != null && !isNaN(quadratic) && quadratic >= 0 && quadratic <= 1))
            return "unable to parse quadratic component of the " + messageError;

        attenuation.push(...[constant, linear, quadratic]);

        return attenuation;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL

        var children = texturesNode.children;

        for (var i = 0; i < children.length; i++) {

            var id = this.reader.getString(children[i], 'id');

            if (typeof this.textures[id] != 'undefined') //ver se a textura ja existe
            {
                this.onXMLError("texture: already exists a texture with such id" + id + ".")
            }

            var returnValueTexture = this.parseEachTexture(children[i], id, "texture with ID" + id);

            if (returnValueTexture != null)
                return returnValueTexture;
        }

        return null;
    }

    parseEachTexture(texturesNode, id, messageError) {
            //reads file

            var file = this.reader.getString(texturesNode, 'file');

            if (file == null) //checks if reading was succesfull
            {
                return "Not found file " + file + " of " + messageError;
            }

            this.textures[id] = new CGFtexture(this.scene, file); //creates new texture
            this.log("Parsed texture");

            return null;

        }
        /**
         * Parses the <materials> node.
         * @param {materials block element} materialsNode
         */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material " + i;

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            var returnValueTexture;
            if ((returnValueTexture = this.parseEachMaterial(children[i], materialID)) != null)
                return returnValueTexture;
        }

        this.log("Parsed materials");
        return null;
    }

    parseEachMaterial(materialsNode, materialID) {

        // Reads material children and node names
        var materialChildren = materialsNode.children;
        var materialNodeNames = [];

        var material = new CGFappearance(this.scene);

        for (var j = 0; j < materialChildren.length; j++)
            materialNodeNames.push(materialChildren[j].nodeName);

        //reads shininess
        var shininess = this.reader.getFloat(materialsNode, 'shininess');

        if (shininess == null)
            return "unable to parse shininess (null) of the material" + materialID;

        if (isNaN(shininess))
            return "unable to parse shininess (NaN) of the material" + materialID;

        material.setShininess(shininess);


        // Gets indexes of emission, ambient, diffuse, specular
        var emissionIndex = materialNodeNames.indexOf("emission");
        var ambientIndex = materialNodeNames.indexOf("ambient");
        var diffuseIndex = materialNodeNames.indexOf("diffuse");
        var specularIndex = materialNodeNames.indexOf("specular");


        //Emission
        if (emissionIndex == -1)
            return "unable to parse emission tag (missing) of the the material " + materialID;

        var emission = this.parseColor(materialChildren[emissionIndex], "emission tag of material " + materialID);

        if (!Array.isArray(emission))
            return emission;

        material.setEmission(...emission);

        //=================================================================================================================
        //Ambient
        if (ambientIndex == -1)
            return "unable to parse ambient tag (missing) of the material " + materialID;

        var ambient = this.parseColor(materialChildren[ambientIndex], "ambient tag of material " + materialID);

        if (!Array.isArray(ambient))
            return ambient;

        material.setAmbient(...ambient);

        //=================================================================================================================
        //diffuse
        if (diffuseIndex == -1)
            return "unable to parse diffuse tag (missing) of the material " + materialID;

        var diffuse = this.parseColor(materialChildren[diffuseIndex], "diffuse tag of material " + materialID);

        if (!Array.isArray(diffuse))
            return diffuse;

        material.setDiffuse(...diffuse);

        //=================================================================================================================
        //specular
        if (specularIndex == -1)
            return "unable to parse specular tag (missing) of the material " + materialID;

        var specular = this.parseColor(materialChildren[specularIndex], "specular tag of material " + materialID);

        if (!Array.isArray(specular))
            return specular;

        material.setSpecular(...specular);

        this.materials[materialID] = material;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var scaleCoordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if (!Array.isArray(scaleCoordinates))
                            return scaleCoordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, scaleCoordinates);
                        break;
                    case 'rotate':
                        var rotationAxis, angle, rotation;

                        rotationAxis = this.reader.getString(grandChildren[j], 'axis');
                        angle = this.reader.getFloat(grandChildren[j], 'angle');

                        if (rotationAxis == 'x') rotation = [1, 0, 0];
                        else if (rotationAxis == 'y') rotation = [0, 1, 0];
                        else if (rotationAxis == 'z') rotation = [0, 0, 1];

                        mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, rotation);
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return grandChildren[0].nodeName + " of " + primitiveID + " is not a valid primitive type. Valid primitive types: rectangle, triangle, cylinder, sphere or torus.";
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                this.parseRectangle(primitiveId, grandChildren);
            } else if (primitiveType == 'triangle') {

                var error;
                if ((error = this.parseTriangle(primitiveId, grandChildren)) != null)
                    return error;
            } else if (primitiveType == 'cylinder') {

                var error;
                if ((error = this.parseCylinder(primitiveId, grandChildren)) != null)
                    return error;

            } else if (primitiveType == 'sphere') {

                var error;
                if ((error = this.parseSphere(primitiveId, grandChildren)) != null)
                    return error;
            } else if (primitiveType == 'torus') {

                var error;
                if ((error = this.parseTorus(primitiveId, grandChildren)) != null)
                    return error;
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    parseRectangle(primitiveId, grandChildren) {
        // x1
        var x1 = this.reader.getFloat(grandChildren[0], 'x1');
        if (!(x1 != null && !isNaN(x1)))
            return "unable to parse x1 of the primitive coordinates of " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], 'y1');
        if (!(y1 != null && !isNaN(y1)))
            return "unable to parse y1 of the primitive coordinates of " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], 'x2');
        if (!(x2 != null && !isNaN(x2) && x2 > x1))
            return "unable to parse x2 of the primitive coordinates of " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], 'y2');
        if (!(y2 != null && !isNaN(y2) && y2 > y1))
            return "unable to parse y2 of the primitive coordinates of " + primitiveId;

        var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

        this.primitives[primitiveId] = rect;

    }

    parseTriangle(primitiveId, grandChildren) {

        // x1
        var x1 = this.reader.getFloat(grandChildren[0], 'x1');
        if (x1 == null || isNaN(x1))
            return "unable to parse x1 of the primitive coordinates of " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], 'y1');
        if (y1 == null || isNaN(y1))
            return "unable to parse y1 of the primitive coordinates of " + primitiveId;

        // z1
        var z1 = this.reader.getFloat(grandChildren[0], 'z1');
        if (z1 == null || isNaN(z1))
            return "unable to parse z1 of the primitive coordinates of " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], 'x2');
        if (x2 == null || isNaN(x2))
            return "unable to parse x2 of the primitive coordinates of " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], 'y2');
        if (y2 == null || isNaN(y2))
            return "unable to parse y2 of the primitive coordinates of " + primitiveId;

        // z2
        var z2 = this.reader.getFloat(grandChildren[0], 'z2');
        if (z2 == null && isNaN(z2))
            return "unable to parse y1 of the primitive coordinates of " + primitiveId;

        // x3
        var x3 = this.reader.getFloat(grandChildren[0], 'x3');
        if (x3 == null || isNaN(x3))
            return "unable to parse x3 of the primitive coordinates of " + primitiveId;

        // y3
        var y3 = this.reader.getFloat(grandChildren[0], 'y3');
        if (y3 == null || isNaN(y3))
            return "unable to parse y3 of the primitive coordinates of " + primitiveId;

        // z3
        var z3 = this.reader.getFloat(grandChildren[0], 'z3');
        if (z3 == null || isNaN(z3))
            return "unable to parse y1 of the primitive coordinates of " + primitiveId;

        var tria = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);

        this.primitives[primitiveId] = tria;

    }

    parseCylinder(primitiveId, grandChildren) {

        // base
        var base = this.reader.getFloat(grandChildren[0], 'base');
        if (base == null || isNaN(base))
            return "unable to parse base of the primitive coordinates of " + primitiveId;

        // top
        var top = this.reader.getFloat(grandChildren[0], 'top');
        if (top == null || isNaN(top))
            return "unable to parse top of the primitive coordinates of " + primitiveId;

        // height
        var height = this.reader.getFloat(grandChildren[0], 'height');
        if (height == null && isNaN(height))
            return "unable to parse height of the primitive coordinates of " + primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (slices == null || isNaN(slices))
            return "unable to parse slices of the primitive coordinates of " + primitiveId;

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (stacks == null && isNaN(stacks))
            return "unable to parse stacks of the primitive coordinates of " + primitiveId;

        var cyl = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

        this.primitives[primitiveId] = cyl;
    }

    parseSphere(primitiveId, grandChildren) {

        // radius
        var radius = this.reader.getFloat(grandChildren[0], 'radius');
        if (radius == null || isNaN(radius))
            return "unable to parse radius of the primitive coordinates of " + primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (slices == null || isNaN(slices))
            return "unable to parse slices of the primitive coordinates of " + primitiveId;

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (stacks == null && isNaN(stacks))
            return "unable to parse stacks of the primitive coordinates of " + primitiveId;

        var sph = new MySphere(this.scene, primitiveId, radius, slices, stacks);

        this.primitives[primitiveId] = sph;
    }

    parseTorus(primitiveId, grandChildren) {

        // inner_radius
        var inner_radius = this.reader.getFloat(grandChildren[0], 'inner');
        if (inner_radius == null || isNaN(inner_radius))
            return "unable to parse inner_radius of the primitive coordinates of " + primitiveId;

        // outer_radius
        var outer_radius = this.reader.getFloat(grandChildren[0], 'outer');
        if (outer_radius == null || isNaN(outer_radius))
            return "unable to parse outer_radius of the primitive coordinates of " + primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (slices == null && isNaN(slices))
            return "unable to parse slices of the primitive coordinates of " + primitiveId;

        // loops
        var loops = this.reader.getFloat(grandChildren[0], 'loops');
        if (loops == null && isNaN(loops))
            return "unable to parse loops of the primitive coordinates of " + primitiveId;

        var sph = new MyTorus(this.scene, primitiveId, inner_radius, outer_radius, slices, loops);

        this.primitives[primitiveId] = sph;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";


            this.components[componentID] = new MyGraphNode(this, componentID);

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            //===============================================================================================
            //Parse the transformation within component
            var transformationIndex = nodeNames.indexOf("transformation");
            if (transformationIndex == -1)
                return "cannot find transformations tag.";

            var returnValueTransformation = this.parseComponentTransformation(grandChildren[transformationIndex], componentID);

            if (returnValueTransformation != null)
                return returnValueTransformation;


            //===============================================================================================
            //Parse the materials within component
            var materialsIndex = nodeNames.indexOf("materials");
            if (materialsIndex == -1)
                return "cannot find materials tag.";

            var returnValueMaterial = this.parseComponentMaterial(grandChildren[materialsIndex], componentID);

            if (returnValueMaterial != null)
                return returnValueMaterial;

            //===============================================================================================
            //Parse the texture within component
            var textureIndex = nodeNames.indexOf("texture");
            if (textureIndex == -1)
                return "cannot find texture tag.";

            var returnValueTextures = this.parseComponentTexture(grandChildren[textureIndex], componentID);

            if (returnValueTextures != null)
                return returnValueTextures;

            //===============================================================================================
            //Parse the children within component
            var childrenIndex = nodeNames.indexOf("children");
            if (childrenIndex == -1)
                return "cannot find children tag.";

            var returnValueChildren = this.parseComponentChildren(grandChildren[childrenIndex], componentID);

            if (returnValueChildren != null)
                return returnValueChildren;

        }
    }

    parseComponentTransformation(componentsNode, componentID) {

        //Components is empty
        if (componentsNode.children.length == 0)
            return;

        // Reads transformation children and node names
        var transformationChildren = componentsNode.children;
        var transformationNodeNames = [];
        for (var j = 0; j < transformationChildren.length; j++)
            transformationNodeNames.push(transformationChildren[j].nodeName);

        // Create variables
        var transformationMatrix = mat4.create();
        mat4.identity(transformationMatrix);

        // Reads transformation
        for (var j = 0; j < transformationChildren.length; j++) {

            //Not explicited defined
            if (transformationNodeNames[j] == "transformationref") {

                // Reads id
                var transformationID = this.reader.getString(componentsNode.children[j], 'id');
                // Validates id
                if (transformationID == null)
                    return "cannot get transformationref ID on component " + componentID;

                // Checks if id exists
                if (this.transformations[transformationID] == null)
                    return "cannot find transformation " + transformationID + " on component " + componentID;

                mat4.multiply(transformationMatrix, transformationMatrix, this.transformations[transformationID])

                continue;
            }

            if (transformationNodeNames[j] == "translate") {

                var translateCoord = this.parseCoordinates3D(transformationChildren[j], "translate of component " + componentID)

                if (!Array.isArray(translateCoord))
                    return translateCoord;

                mat4.translate(transformationMatrix, transformationMatrix, translateCoord);

                continue;
            }

            if (transformationNodeNames[j] == "rotate") {
                // Reads axis, angle
                var axis = this.reader.getString(transformationChildren[j], 'axis');
                var angle = this.reader.getFloat(transformationChildren[j], 'angle');

                // Validates axis and angle
                if (isNaN(angle))
                    return "unable to parse angle component (NaN) on tag <rotate> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";

                if (angle == null || axis == null)
                    return "unable to parse axis and angle components (null) on tag <rotate> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";

                if (axis != "x" && axis != "y" && axis != "z")
                    return "unable to parse axis component (not valid - should be x, y or z) on tag <rotate> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";

                // Adds rotation
                if (axis == 'x')
                    mat4.rotateX(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD);
                else if (axis == 'y')
                    mat4.rotateY(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD);
                else if (axis == 'z')
                    mat4.rotateZ(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD);

                continue;
            }

            if (transformationNodeNames[j] == "scale") {
                var scaleCoord = this.parseCoordinates3D(transformationChildren[j], "scale of component " + componentID)

                if (!Array.isArray(scaleCoord))
                    return scaleCoord;

                // Adds scaling
                mat4.scale(transformationMatrix, transformationMatrix, scaleCoord);

                continue;
            }

            return transformationNodeNames[j] + "is an invalid transformation type of component " + componentID;
        }

        this.components[componentID].transformation = transformationMatrix;
    }

    parseComponentMaterial(componentsNode, componentID) {

        if (componentsNode.children.length == 0)
            return "at least one material must be defined on the component " + componentID;

        // Reads materials children and node names
        var materialsChildren = componentsNode.children;
        var materialsNodeNames = [];

        for (var j = 0; j < materialsChildren.length; j++)
            materialsNodeNames.push(materialsChildren[j].nodeName);


        for (var j = 0; j < materialsChildren.length; j++) {

            //If the tag is not material: ERROR!
            if (materialsNodeNames[j] != "material")
                return materialsNodeNames[j] + " is not valid on materials of component " + componentID;

            // Reads id
            var materialID = this.reader.getString(componentsNode.children[j], 'id');

            // Validates id
            if (materialID == null)
                return "id of material is not valid (null) on materials of component " + componentID;

            // Checks if id exists
            if (materialID == "inherit") {
                this.components[componentID].materials[materialID] = materialID;
                continue;
            }

            if (this.materials[materialID] == null)
                return materialID + "is not a valid id of material (null) on materials of component " + componentID;

            this.components[componentID].materials[materialID] = this.materials[materialID];

        }
    }

    parseComponentTexture(componentsNode, componentID) {

        var textureID = this.reader.getString(componentsNode, 'id');
        var length_s = this.reader.getFloat(componentsNode, 'length_s', false);
        var length_t = this.reader.getFloat(componentsNode, 'length_t', false);

        // Validates id, length_s, length_t
        if (textureID == null)
            return "id of texture is not valid (null) of component " + componentID;

        if (textureID == "inherit" || textureID == "none") {
            if (length_s != null || length_t != null) {
                return "id '" + textureID + ": cannot instantiate the attributes a lenght_s and lenght_t with texture inherit/none of component " + componentID;
            } else {
                this.components[componentID].texture = textureID;
                return null;
            }
        }

        if (this.textures[textureID] == null)
            return textureID + " is not valid on materials of component " + componentID;

        if (length_t == null || length_s == null) {
            return "missing lenght_t or/and lenght_s on texture " + textureID + "on component " + componentID;
        }

        //setting length_s and length_t 
        if (length_s != null) {
            if (isNaN(length_s))
                return "lenght_s is not a number in texture " + textureID + " of component " + componentID;

            if (length_s <= 0)
                return "lenght_s is cannot be negative or 0 in texture " + textureID + " of component " + componentID;

            this.components[componentID].length_s = length_s;
        }

        if (length_t != null) {
            if (isNaN(length_t))
                return "length_t is not a number in texture " + textureID + " of component " + componentID;

            if (length_t <= 0)
                return "length_t is cannot be negative or 0 in texture " + textureID + " of component " + componentID;

            this.components[componentID].length_t = length_t;
        }


        this.components[componentID].texture = this.textures[textureID];

    }

    parseComponentChildren(componentsNode, componentID) {

        //Components is empty
        if (componentsNode.children.length <= 0)
            return "Should be at least one children on tag <children> on the component " + componentID;

        // Reads transformation children and node names
        var childrenChildren = componentsNode.children;
        var childrenNodeNames = [];
        for (var j = 0; j < childrenChildren.length; j++)
            childrenNodeNames.push(childrenChildren[j].nodeName);

        for (var j = 0; j < childrenChildren.length; j++) {

            if (childrenChildren[j].nodeName == "componentref") {
                // Reads id
                var childrenID = this.reader.getString(childrenChildren[j], 'id');

                // Validates id
                if (childrenID == null)
                    return "id of component is not valid (null) on component " + componentID;

                this.components[componentID].addChild(childrenID);

                continue;
            }

            if (childrenChildren[j].nodeName == "primitiveref") {
                // Reads id
                var primitiveID = this.reader.getString(childrenChildren[j], 'id');

                // Validates id
                if (primitiveID == null)
                    return "id of primitive is not valid (null) on component " + componentID;

                // Checks if id exists
                if (this.primitives[primitiveID] == null)
                    return "id '" + primitiveID + "' is not a valid primitive reference on component " + componentID;

                this.components[componentID].addPrimitive(this.primitives[primitiveID]);

                continue;

            }

            return "invalid children tag " + childrenChildren[j].nodeName + " on component " + componentID;
        }

        return null;

    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "Unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "Unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "Unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        this.displayComponent(this.components[this.idRoot], this.components[this.idRoot].materials[0], this.components[this.idRoot].texture);

    }

    displayComponent(component, parentMaterial, parentTexture, parentS, parentT) {

        this.scene.pushMatrix();

        //TRANSFORMATION
        this.scene.multMatrix(component.transformation);

        var currentMaterial;
        var currentTexture;
        var allMaterials = [];
        var materialIndex = this.scene.materialKeyCounter;
        var i = 0;
        var currentS;
        var currentT;


        //==========================================================================
        //MATERIAL

        // Stores all component's materials in order
        for (var key in component.materials) {
            allMaterials[i] = component.materials[key];
            i++;
        }

        // Checks if it's going to use component or parent material
        if (allMaterials[materialIndex % i] == "inherit")
            currentMaterial = parentMaterial;
        else
            currentMaterial = allMaterials[materialIndex % i];

        //==========================================================================
        //TEXTURE

        //Checks if it's going to use component, parent texture or even none
        if (component.texture == "inherit")
            currentTexture = parentTexture;
        else if (component.texture == "none")
            currentTexture = "none";
        else
            currentTexture = component.texture;

        // Checks if it's going to use component or parent texture lengths

        currentS = component.length_s;
        currentT = component.length_t;

        if (component.texture == "inherit") {

            if (component.length_s == null)
                currentS = parentS;

            if (component.length_t == null)
                currentT = parentT;
        }

        //SETTING THE CORRECT TEXTURE
        if (currentTexture != "none")
            currentMaterial.setTexture(currentTexture);
        else
            currentMaterial.setTexture(null);

        currentMaterial.setTextureWrap('REPEAT', 'REPEAT');
        currentMaterial.apply();

        //==========================================================================
        //DISPLAYING PRIMITIVES
        for (var key in component.primitives) {

            if (currentTexture != "none")
                component.primitives[key].updateTexCoords(currentS, currentT);

            component.primitives[key].display();
        }

        //==========================================================================
        //Recursively calls displayComponent for all component's children
        for (var i = 0; i < component.children.length; i++)
            this.displayComponent(this.components[component.children[i]], currentMaterial, currentTexture, currentS, currentT);

        this.scene.popMatrix();

    }
}