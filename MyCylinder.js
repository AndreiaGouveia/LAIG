/**
 * MyCylinder class, which represents a cylinder object
 */
class MyCylinder extends CGFobject {
    /**
     * @constructor
     * @param {XMLScene} scene  represents the CGFscene
     * @param {number}   base   radius of cylinder's base
     * @param {number}   top    radius of cylinder's top
     * @param {number}   height cylinder's height
     * @param {number}   slices number of circle slices
     * @param {number}   stacks number of circle slices
     */
    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);

        this.id = id;
        this.base = base;
        this.top = top;
        this.height = height;
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
        var angleStep = 2 * Math.PI / this.slices;

        //Difference between the size of each slice
        var radiusStep = (this.top - this.base) / this.stacks;


        //Cycle to parse each triangle
        for (var i = 0; i <= this.slices; ++i) {

            for (var j = 0; j <= this.stacks; ++j) {

                this.setVerticesAndNormals(angleStep, radiusStep, stackStep, i, j);

                this.texCoords.push(
                    i * 1 / this.slices,
                    1 - (j * 1 / this.stacks)
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

    setVerticesAndNormals(angleStep, radiusStep, stackStep, i, j) {

        //First Step calculate the coordinates of a circle
        // a = cos(t)*radius    b = sin(t)*radius
        // t = angle

        //Second Step calculate the coordinates when we translate that circle
        //The circle will be moving in parallel with the plane Y^X
        //t = angleStep * i (varies depending on which step we are in)


        //Remember the base and top of the cylinder can differ in size
        //To accommodate this different the radius of the circle will be different in each step
        //The radius will be the base plus or minus (depends if the base is bigger or smaller than the top)
        //the difference accumulated on each step so far 
        //radius = radiusStep * j + this.base
        var x = (radiusStep * j + this.base) * Math.cos(angleStep * i)
        var y = (radiusStep * j + this.base) * Math.sin(angleStep * i);

        //The translate movement will take place in the Z axis and will vary with the stack
        var z = j * stackStep


        this.vertices.push(
            x,
            y,
            z
        );


        //The normal of a point in the torus will have the same coordinates of the point
        this.normals.push(
            x,
            y,
            z
        );

    }



};