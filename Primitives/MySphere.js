/**
 * MySphere class, which represents a Sphere object
 */
class MySphere extends CGFobject {
    /**
     * @constructor
     * @param {XMLScene} scene  represents the CGFscene
     * @param {number}   id     represents the Id of the Sphere
     * @param {number}   radius radius of Sphere
     * @param {number}   slices number of Sphere slices
     * @param {number}   stacks number of Sphere stacks
     */
    constructor(scene, id, radius, slices, stacks) {
        super(scene);

        this.id = id;
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        this.defaultTexCoords = [];

        this.initBuffers();
    };

    /**
     * Creates vertices, indices, normals and texCoords
     */
    initBuffers() {

        // loop through stacks.
        for (var i = -this.stacks / 2; i <= this.stacks / 2; ++i) {

            var V = i / this.stacks;
            var phi = V * Math.PI;

            // loop through the slices.
            for (var j = 0; j <= this.slices; ++j) {

                var U = j / this.slices;
                var theta = U * Math.PI * 2;

                // use spherical coordinates to calculate the positions.
                var x = Math.cos(phi) * Math.cos(theta);
                var y = Math.cos(phi) * Math.sin(theta);
                var z = Math.sin(phi);

                var length = Math.sqrt(x * x + y * y + z * z);
                this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
                this.normals.push(x / length, y / length, z / length);

                this.texCoords.push(1 - U, 1 - (V + 1 / 2));
            }
        }

        // Calc The Index Positions
        var i;
        for (i = 0; i < this.slices * this.stacks + this.slices; ++i) {
            this.indices.push(i);
            this.indices.push(i + this.slices + 1);
            this.indices.push(i + this.slices);

            this.indices.push(i + this.slices + 1);
            this.indices.push(i);
            this.indices.push(i + 1);
        }

        this.defaultTexCoords = this.texCoords;

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    updateTexCoords(s, t) {

        this.texCoords = this.defaultTexCoords.slice();

        for (var i = 0; i < this.texCoords.length; i += 2) {
            this.texCoords[i] /= s;
            this.texCoords[i + 1] /= t;
        }

        this.updateTexCoordsGLBuffers();

    }


};