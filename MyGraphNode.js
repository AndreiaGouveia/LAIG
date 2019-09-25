class MyGraphNode {
    /**
    * @constructor
    * @param {MySceneGraph} graph graph that represents the whole scene
    * @param {string}       id    node's id
    */
    constructor(graph, id)
    {
      this.graph = graph;
      this.id = id;
      this.transformation;
      this.materials = [];
      this.texture;
      this.length_s = 1;
      this.length_t = 1;
      this.children = [];
      this.primitives = [];
    };
}