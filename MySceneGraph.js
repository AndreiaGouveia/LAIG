var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
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

        this.idRoot = null;                    // The id of the root element.

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
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
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

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        this.onXMLMinorError("To do: Parse views and create cameras.");

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

        this.default = defaultView;

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

        var returnValueFrom = this.parseFromToUpView(this.views[perpectiveID].from, perspectiveChildren[fromIndex], perpectiveID);

        if (returnValueFrom != null)
            return returnValueFrom;

        //=======================================================================================================
        //TO BLOCK
        if (toIndex == -1)
            return "tag <To> is not present on the <perpective> node " + perpectiveID + " from the <materials> block";

        var returnValueTo = this.parseFromToUpView(this.views[perpectiveID].to, perspectiveChildren[toIndex], perpectiveID);

        if (returnValueTo != null)
            return returnValueTo;

        //=======================================================================================================
        //UP BLOCK
        if (upIndex == -1)
            return "tag <Up> is not present on the <perpective> node " + perpectiveID + " from the <materials> block";

        var returnValueUp = this.parseFromToUpView(this.views[perpectiveID].up, perspectiveChildren[upIndex], perpectiveID);

        if (returnValueUp != null)
            return returnValueUp;

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

        var returnValueFrom = this.parseFromToUpView(this.views[perpectiveID].from, perspectiveChildren[fromIndex], perpectiveID);

        if (returnValueFrom != null)
            return returnValueFrom;

        //=======================================================================================================
        //TO BLOCK
        if (toIndex == -1)
            return "tag <To> is not present on the <perpective> node " + perpectiveID + " To the <materials> block";

        var returnValueTo = this.parseFromToUpView(this.views[perpectiveID].to, perspectiveChildren[toIndex], perpectiveID);

        if (returnValueTo != null)
            return returnValueTo;

    }

    getErrorForView(x, y, z, viewID) {

        // Validates x, y, z values
        if (x == null || y == null || z == null)
            return "unable to parse x, y, z components (null) on tag <from> from the node " + viewID + " from the <views> block";
        else if (isNaN(x) || isNaN(y) || isNaN(z))
            return "unable to parse x, y, z components (NaN) on tag <from> from the node " + viewID + " from the <views> block";

        return null;
    }


    parseFromToUpView(addingTo, fromNode, viewID) {

        var x = this.reader.getFloat(fromNode, 'x');
        var y = this.reader.getFloat(fromNode, 'y');
        var z = this.reader.getFloat(fromNode, 'z');

        var error = this.getErrorForView(x, y, z, viewID);
        if (error != null)
            return error;

        addingTo = [];
        addingTo.x = x;
        addingTo.y = y;
        addingTo.z = z;

        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

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
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
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

            enableLight = aux || 1;

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
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
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
                }
                else
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
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL


        var children = texturesNode.children;
        this.log(children.length);

        for (var i = 0; i < children.length; i++) {

            var id = this.reader.getString(children[i], 'id');

            if (typeof this.textures[id] != 'undefined')//ver se a textura ja existe
            {
                this.onXMLError("texture: already exists a texture with sucj id" + id + ".")
            }

            this.parseEachTexture(children[i], id);
        }

        return null;
    }

    parseEachTexture(texturesNode, id) {
        //reads file

        var file = this.reader.getString(texturesNode, 'file');
        this.log("id " + id);

        if (file == null)//checks if reading was succesfull
        {
            return "unable to parse id and file components (null) on the <texture> " + id + " from the <texture> block";
        }

        this.textures[id] = new CGFtexture(this.scene, file); //creates new texture
        this.log("Parsed texture");

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
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            this.parseEachMaterial(children[i], materialID);
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
            return "unable to parse id and shininess components (null) on the <material> " + materialID + " from the <materials> block";

        if (isNaN(shininess))
            return "unable to parse shininess component (NaN) on the <material> node " + materialID + " from the <materials> block";

        material.setShininess(shininess);


        // Gets indexes of emission, ambient, diffuse, specular
        var emissionIndex = materialNodeNames.indexOf("emission");
        var ambientIndex = materialNodeNames.indexOf("ambient");
        var diffuseIndex = materialNodeNames.indexOf("diffuse");
        var specularIndex = materialNodeNames.indexOf("specular");


        //Emission
        if (emissionIndex == -1)
            return "tag <emission> is not present on the <material> node " + materialID + " from the <materials> block";

        var emissionReturnValue = this.parseMaterialEmission(materialChildren[emissionIndex], materialID, material);

        if (emissionReturnValue != null)
            return "tag <emission>: " + emissionReturnValue;

        //=================================================================================================================
        //Ambient
        if (ambientIndex == -1)
            return "tag <ambient> is not present on the <material> node " + materialID + " from the <materials> block";

        var ambientReturnValue = this.parseMaterialAmbient(materialChildren[ambientIndex], materialID, material);

        if (ambientReturnValue != null)
            return "tag <ambient>: " + ambientReturnValue;

        //=================================================================================================================
        //diffuse
        if (diffuseIndex == -1)
            return "tag <diffuse> is not present on the <material> node " + materialID + " from the <materials> block";

        var diffuseReturnValue = this.parseMaterialDiffuse(materialChildren[diffuseIndex], materialID, material);

        if (diffuseReturnValue != null)
            return "tag <diffuse>: " + diffuseReturnValue;

        //=================================================================================================================
        //specular
        if (specularIndex == -1)
            return "tag <specular> is not present on the <material> node " + materialID + " from the <materials> block";

        var specularReturnValue = this.parseMaterialSpecular(materialChildren[specularIndex], materialID, material);

        if (specularReturnValue != null)
            return "tag <specular>: " + specularReturnValue;



        this.materials[materialID] = material;
    }

    getErrorForMaterial(r, g, b, a, materialID) {

        // Validates r, g, b, a
        if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b, a component (NaN) on tag <emission> from the <material> node " + materialID + " from the <materials> block";

        if (r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b, a component (null) on tag <emission> from the <material> node " + materialID + " from the <materials> block";

        if (r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <emission> from the <material> node " + materialID + " from the <materials> block";

    }

    parseMaterialEmission(emissionNode, materialID, material) {

        // Reads r, g, b, a
        var r = this.reader.getFloat(emissionNode, 'r');
        var g = this.reader.getFloat(emissionNode, 'g');
        var b = this.reader.getFloat(emissionNode, 'b');
        var a = this.reader.getFloat(emissionNode, 'a');

        var error = this.getErrorForMaterial(r, g, b, a, materialID);
        if (error != null)
            return error;

        // Sets r, g, b, a
        material.setEmission(r, g, b, a);
    }

    parseMaterialAmbient(ambientNode, materialID, material) {

        // Reads r, g, b, a
        var r = this.reader.getFloat(ambientNode, 'r');
        var g = this.reader.getFloat(ambientNode, 'g');
        var b = this.reader.getFloat(ambientNode, 'b');
        var a = this.reader.getFloat(ambientNode, 'a');

        var error = this.getErrorForMaterial(r, g, b, a, materialID);
        if (error != null)
            return error;

        // Sets r, g, b, a
        material.setAmbient(r, g, b, a);
    }

    parseMaterialDiffuse(diffuseNode, materialID, material) {

        // Reads r, g, b, a
        var r = this.reader.getFloat(diffuseNode, 'r');
        var g = this.reader.getFloat(diffuseNode, 'g');
        var b = this.reader.getFloat(diffuseNode, 'b');
        var a = this.reader.getFloat(diffuseNode, 'a');

        var error = this.getErrorForMaterial(r, g, b, a, materialID);
        if (error != null)
            return error;

        // Sets r, g, b, a
        material.setDiffuse(r, g, b, a);
    }

    parseMaterialSpecular(specularNode, materialID, material) {

        // Reads r, g, b, a
        var r = this.reader.getFloat(specularNode, 'r');
        var g = this.reader.getFloat(specularNode, 'g');
        var b = this.reader.getFloat(specularNode, 'b');
        var a = this.reader.getFloat(specularNode, 'a');

        var error = this.getErrorForMaterial(r, g, b, a, materialID);
        if (error != null)
            return error;

        // Sets r, g, b, a
        material.setSpecular(r, g, b, a);
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
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                this.parseRectangle(primitiveId, grandChildren);
            }
            else if (primitiveType == 'triangle') {

                var error;
                if( (error = this.parseTriangle(primitiveId, grandChildren)) != null)
                    return error;
            }
            else if (primitiveType == 'cylinder'){

                var error;
                if( (error = this.parseCylinder(primitiveId, grandChildren)) != null)
                    return error;

            }
            else {
                console.warn("To do: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    parseRectangle(primitiveId, grandChildren) {
        // x1
        var x1 = this.reader.getFloat(grandChildren[0], 'x1');
        if (!(x1 != null && !isNaN(x1)))
            return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], 'y1');
        if (!(y1 != null && !isNaN(y1)))
            return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], 'x2');
        if (!(x2 != null && !isNaN(x2) && x2 > x1))
            return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], 'y2');
        if (!(y2 != null && !isNaN(y2) && y2 > y1))
            return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

        var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

        this.primitives[primitiveId] = rect;

    }

    parseTriangle(primitiveId, grandChildren) {

        // x1
        var x1 = this.reader.getFloat(grandChildren[0], 'x1');
        if (x1 == null || isNaN(x1))
            return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], 'y1');
        if (y1 == null || isNaN(y1))
            return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

        // z1
        var z1 = this.reader.getFloat(grandChildren[0], 'z1');
        if (z1 == null || isNaN(z1))
            return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], 'x2');
        if (x2 == null || isNaN(x2))
            return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], 'y2');
        if (y2 == null || isNaN(y2))
            return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

        // z2
        var z2 = this.reader.getFloat(grandChildren[0], 'z2');
        if (z2 == null && isNaN(z2))
            return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

        // x3
        var x3 = this.reader.getFloat(grandChildren[0], 'x3');
        if (x3 == null || isNaN(x3))
            return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

        // y3
        var y3 = this.reader.getFloat(grandChildren[0], 'y3');
        if (y3 == null || isNaN(y3))
            return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

        // z3
        var z3 = this.reader.getFloat(grandChildren[0], 'z3');
        if (z3 == null || isNaN(z3))
            return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

        var tria = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);

        this.primitives[primitiveId] = tria;

    }

    parseCylinder(primitiveId, grandChildren) {

        // base
        var base = this.reader.getFloat(grandChildren[0], 'base');
        if (base == null || isNaN(base))
            return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

        // top
        var top = this.reader.getFloat(grandChildren[0], 'top');
        if (top == null || isNaN(top))
            return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

        // height
        var height = this.reader.getFloat(grandChildren[0], 'height');
        if (height == null && isNaN(height))
            return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (slices == null || isNaN(slices))
            return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (stacks == null && isNaN(stacks))
            return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

        var cyl = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

        this.primitives[primitiveId] = cyl;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
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
                return "unknown tag";

            var returnValueTransformation = this.parseComponentTransformation(grandChildren[transformationIndex], componentID);

            if (returnValueTransformation != null)
                return returnValueTransformation;


            //===============================================================================================
            //Parse the materials within component
            var materialsIndex = nodeNames.indexOf("materials");
            if (materialsIndex == -1)
                return "unknown tag";

            var returnValueMaterial = this.parseComponentMaterial(grandChildren[materialsIndex], componentID);

            if (returnValueMaterial != null)
                return returnValueMaterial;

            //===============================================================================================
            //Parse the texture within component
            var textureIndex = nodeNames.indexOf("texture");
            if (textureIndex == -1)
                return "unknown tag";

            var returnValueTextures = this.parseComponentTexture(grandChildren[textureIndex], componentID);

            if (returnValueTextures != null)
                return returnValueTextures;

            //===============================================================================================
            //Parse the children within component
            var childrenIndex = nodeNames.indexOf("children");
            if (childrenIndex == -1)
                return "unknown tag";

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
                    return "unable to parse id component (null) on tag <transformationref> on tag <transformations> on the <component> node with index " + i + " from the <components> block";

                // Checks if id exists
                if (this.transformations[transformationID] == null)
                    return "id '" + transformationID + "' is not a valid transformation reference on tag <transformation> on the <component> node with index " + i + " from the <components> block";

                mat4.multiply(transformationMatrix, transformationMatrix, this.transformations[transformationID])

                continue;
            }

            if (transformationNodeNames[j] == "translate") {
                // Reads x, y, z
                var x = this.reader.getFloat(transformationChildren[j], 'x');
                var y = this.reader.getFloat(transformationChildren[j], 'y');
                var z = this.reader.getFloat(transformationChildren[j], 'z');

                // Validates x, y, z
                if (isNaN(x) || isNaN(y) || isNaN(z))
                    return "unable to parse x, y, z components (NaN) on tag <translate> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";

                if (x == null || y == null || z == null)
                    return "unable to parse x, y, z components (null) on tag <translate> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";

                // Adds translation
                mat4.translate(transformationMatrix, transformationMatrix, [x, y, z]);

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
                // Reads x, y, z
                var x = this.reader.getFloat(transformationChildren[j], 'x');
                var y = this.reader.getFloat(transformationChildren[j], 'y');
                var z = this.reader.getFloat(transformationChildren[j], 'z');

                // Validates x, y, z
                if (isNaN(x) || isNaN(y) || isNaN(z))
                    return "unable to parse x, y, z components (NaN) on tag <scale> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";

                if (x == null || y == null || z == null)
                    return "unable to parse x, y, z components (null) on tag <scale> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";

                // Adds scaling
                mat4.scale(transformationMatrix, transformationMatrix, [x, y, z]);

                continue;
            }

            this.onXMLMinorError("tag <" + transformationChildren[j].nodeName + "> with index " + j + " on tag <transformation> on the <component> node");
        }

        this.components[componentID].transformation = transformationMatrix;
    }

    parseComponentMaterial(componentsNode, componentID) {

        if (componentsNode.children.length == 0)
            return "at least one <material> must be defined on tag <materials> on the <component> node with index ";

        // Reads materials children and node names
        var materialsChildren = componentsNode.children;
        var materialsNodeNames = [];

        for (var j = 0; j < materialsChildren.length; j++)
            materialsNodeNames.push(materialsChildren[j].nodeName);



        for (var j = 0; j < materialsChildren.length; j++) {

            //If the tag is not material: ERROR!
            if (materialsNodeNames[j] != "material")
                this.onXMLMinorError("tag <" + materialsNodeNames[j] + "> is not valid on tag <material> with index " + j + " on tag <materials> on the <component> node with index ");

            // Reads id
            var materialID = this.reader.getString(componentsNode.children[j], 'id');

            // Validates id
            if (materialID == null)
                return "unable to parse id component (null) on tag <material> with index " + j + " on tag <materials> on the <component> node with index ";

            // Checks if id exists
            if (materialID == "inherit") {
                this.components[componentID].materials[materialID] = materialID;
                continue;
            }

            if (this.materials[materialID] == null)
                return "id '" + materialID + "' is not a valid transformation reference on tag <material> with index " + j + " on tag <materials> on the <component> node with index ";

            this.components[componentID].materials[materialID] = this.materials[materialID];

        }
    }

    parseComponentTexture(componentsNode, componentID) {

        var textureID = this.reader.getString(componentsNode, 'id');
        var length_s = this.reader.getFloat(componentsNode, 'length_s', false);
        var length_t = this.reader.getFloat(componentsNode, 'length_t', false);

        // Validates id, length_s, length_t
        if (textureID == null)
            return "unable to parse id component (null) on tag <texture> on the <component> node " + componentID + " from the <components> block";

        if (length_s != null) {
            if (isNaN(length_s))
                return "unable to length_s components (NaN) on tag <texture> on the <component> node " + componentID + " from the <components> block";

            if (length_s <= 0)
                return "unable to length_s components (out of 0-inf. range) on tag <texture> on the <component> node " + componentID + " from the <components> block";
        }

        if (length_t != null) {
            if (isNaN(length_t))
                return "unable to length_t components (NaN) on tag <texture> on the <component> node " + componentID + " from the <components> block";

            if (length_t <= 0)
                return "unable to length_t components (out of 0-inf. range) on tag <texture> on the <component> node " + componentID + " from the <components> block";
        }

        // Checks if id exists
        if (textureID == "inherit" || textureID == "none") {
            this.components[componentID].texture = textureID;
            return null;
        }

        if (this.textures[textureID] == null)
            return "id '" + textureID + "' is not a valid transformation reference on tag <texture> on the <component> node " + componentID + " from the <components> block";

        this.components[componentID].texture = this.textures[textureID];

        // Sets length_s, length_t
        if (length_s != null) {
            this.components[componentID].length_s = length_s;
        }

        if (length_t != null) {
            this.components[componentID].length_t = length_t;
        }
    }

    parseComponentChildren(componentsNode, componentID) {

        //Components is empty
        if (componentsNode.children.length <= 0)
            return "Should be at least one children on tag <children> on the <component> node " + componentID + " from the <components> block";

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
                    return "unable to parse id component (null) on tag <componentref> with index " + j + " on tag <children> on the <component> node " + componentID + " from the <components> block";

                this.components[componentID].addChild(childrenID);

                continue;
            }

            if (childrenChildren[j].nodeName == "primitiveref") {
                // Reads id
                var primitiveID = this.reader.getString(childrenChildren[j], 'id');

                // Validates id
                if (primitiveID == null)
                    return "unable to parse id component (null) on tag <primitiveref> with index " + j + " on tag <children> on the <component> node " + componentID + " from the <components> block";

                // Checks if id exists
                if (this.primitives[primitiveID] == null)
                    return "id '" + primitiveID + "' is not a valid primitive reference on tag <primitiveref> with index " + j + " on tag <children> on the <component> node " + componentID + " from the <components> block";

                this.components[componentID].addPrimitive(this.primitives[primitiveID]);

                continue;

            }

            return "invalid tag " + childrenChildren[j].nodeName + " on tag <children> on the <component> node " + componentID + " from the <components> block";
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
            return "unable to parse w-coordinate of the " + messageError;

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
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

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

        /*
                this.scene.multMatrix(this.components[this.idRoot].transformation);
                
                this.primitives['demoTriangle'].updateTexCoords(3, 3);
        
                this.components[this.idRoot].materials['demoMaterial'].apply();
        
                this.components[this.idRoot].texture.bind();
        
                //To test the parsing/creation of the primitives, call the display function directly
                this.components[this.idRoot].primitives[0].display();
                //this.primitives['demoTriangle'].display();*/


        this.displayComponent(this.components[this.idRoot], this.components[this.idRoot].materials[0], this.components[this.idRoot].texture);

    }

    displayComponent(component, parentMaterial, parentTexture, parentS, parentT) {

        this.scene.pushMatrix();

        //TRANSFORMATION
        this.scene.multMatrix(component.transformation);

        var currentMaterial;
        var currentTexture;
        var allMaterials = [];
        var materialIndex = 0; //TO DO: In the future change this acoordingly to the user pressing de M key
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