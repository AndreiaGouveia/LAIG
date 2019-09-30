/**
* MyTorus class, which represents a cylinder object
*/
class MyTorus extends CGFobject {
	/**
	* @constructor
	* @param {XMLScene} scene  represents the CGFscene
	* @param {number}   base   radius of cylinder's base
	* @param {number}   top    radius of cylinder's top
	* @param {number}   height cylinder's height
	* @param {number}   slices number of circle slices
	* @param {number}   stacks number of circle slices
	*/
    constructor(scene, id, inner_raidus, outer_radius, slices, stacks) {
        super(scene);

        this.inner_raidus = inner_raidus;
        this.outer_radius = outer_radius;
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

        //Height of each stack
        var stackStep = this.height / this.stacks;

        //Difference of angle between each slice
        var slicesStep = 2 * Math.PI / this.slices;

        //Difference between the size of each slice
        var radiusStep = (this.top - this.base) / this.stacks;


        //Cycle to parse each triangle
        for (var i = 0; i <= this.slices; ++i) {

            for (var j = 0; j <= this.stacks; ++j) {

                
                var centerLine = this.inner_raidus*Math.cos(stackStep*this.loops);

                this.vertices.push(

                    //Distance from the axis to    //Angle from the axis to
                    //the point to be process      //the point to be process


                    //Coordinates of a trig circle multiplide by the size of the circle
                    centerLine * Math.cos(slicesStep * i),
                    centerLine * Math.sin(slicesStep * i),
                    this.inner_raidus * Math.sin(slicesStep*this.loops)
                );


                this.texCoords.push(
                    i * 1 / this.slices,
                    1 - (j * 1 / this.stacks)
                );

                this.normals.push(
                    Math.cos(stackStep*j) * Math.cos(slicesStep*i), 
                    Math.cos(stackStep*j) * Math.sin(slicesStep*i),
                    0
                );

            }

        }

        //Cycle to parse each rectangle
        for (var i = 0; i < this.slices; ++i) {
            for (var j = 0; j < this.stacks; ++j) {

                this.indices.push(
                    (i + 1) * (this.stacks + 1) + j, i * (this.stacks + 1) + j + 1, i * (this.stacks + 1) + j,
                    i * (this.stacks + 1) + j + 1, (i + 1) * (this.stacks + 1) + j, (i + 1) * (this.stacks + 1) + j + 1
                );
            }
        }

        this.defaultTexCoords = this.texCoords;

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    /**
    * Updates the cylinder's texCoords
    * @param {number} s represents the amount of times the texture will be repeated in the s coordinate
    * @param {number} t represents the amount of times the texture will be repeated in the t coordinate
    */
    updateTexCoords(s, t) {

        this.texCoords = this.defaultTexCoords.slice();

        for (var i = 0; i < this.texCoords.length; i += 2) {
            this.texCoords[i] /= s;
            this.texCoords[i + 1] /= t;
        }

        this.updateTexCoordsGLBuffers();
    };



};