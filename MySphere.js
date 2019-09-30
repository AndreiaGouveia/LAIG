/**
* MyCylinder class, which represents a cylinder object
*/
class MySphere extends CGFobject {
	/**
	* @constructor
	* @param {XMLScene} scene  represents the CGFscene
	* @param {number}   base   radius of cylinder's base
	* @param {number}   top    radius of cylinder's top
	* @param {number}   height cylinder's height
	* @param {number}   slices number of circle slices
	* @param {number}   stacks number of circle slices
	*/
    constructor(scene, id, radius, slices, stacks) {
        super(scene);

        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        this.defaultTexCoords =[];

        this.initBuffers();
    };

	/**
	* Creates vertices, indices, normals and texCoords
	*/
    initBuffers() {

        // loop through stacks.
        for (var i = -this.stacks/2; i <= this.stacks/2; ++i) {

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

                this.vertices.push(this.radius * x,  this.radius * y, this.radius * z);
                this.normals.push(x, y, z);
                
                //0.5 to look more natural
                this.texCoords.push(U, V);
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