class MyGraphNode {
    /**
     * @constructor
     * @param {MySceneGraph} graph graph that represents the whole scene
     * @param {string}       id    node's id
     */
    constructor(graph, id) {
        this.graph = graph;
        this.id = id;
        this.transformation = mat4.create();
        this.materials = [];
        this.texture;
        this.length_s = null;
        this.length_t = null;
        this.children = [];
        this.primitives = [];
        this.animation = null;
    };

    addChild(child) {

        this.children.push(child);
    }

    addPrimitive(primitive) {

        this.primitives.push(primitive);
    }

}