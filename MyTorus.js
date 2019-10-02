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
     * @param {number}   loops number of circle slices
     */
    constructor(scene, id, inner_radius, outer_radius, slices, loops) {

        super(scene);

        this.inner_radius = inner_radius;
        this.outer_radius = outer_radius;
        this.slices = slices;
        this.loops = loops;

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


        let sliceAngle = 2 * Math.PI / this.slices;
        let loopAngle = 2 * Math.PI / this.loops;

        for (let i = 0; i <= this.slices; ++i) {

            for (let j = 0; j <= this.loops; ++j) {

                this.setVerticesAndNormals(sliceAngle, loopAngle, i, j);

                this.texCoords.push(
                    i * 1 / this.slices,
                    j * 1 / this.loops
                );

            }

        }

        for (let i = 0; i < this.slices; ++i) {
            for (let j = 0; j < this.loops; ++j) {
                this.indices.push(
                    (i + 1) * (this.loops + 1) + j, i * (this.loops + 1) + j + 1, i * (this.loops + 1) + j,
                    i * (this.loops + 1) + j + 1, (i + 1) * (this.loops + 1) + j, (i + 1) * (this.loops + 1) + j + 1
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

    setVerticesAndNormals(sliceAngle, loopAngle, i, j) {

        //First Step calculate the coordinates of a circle
        // a = cos(t)*radius    b = sin(t)*radius
        // t = angle

        //Second Step calculate the coordinates when we rotate that circle
        //The circle will be moving in parallel with the plane Y^Z
        //t = loopAngle * j
        //radius = innerRadius

        var circleCoordinatesInA = this.inner_radius * Math.cos(loopAngle * j);
        var circleCoordinatesInB = this.inner_radius * Math.sin(loopAngle * j);

        //The rotation will be made around the z axis. So we will apply the formula of the coordinates of a circle to x and y
        //We will add the outer_radius to the movement of the circle so that we have a hole in the middle

        //Now we apply the rotation
        var rotationCoordinatesInX = (circleCoordinatesInA + this.outer_radius) * Math.cos(sliceAngle * i); //This is the coordinate 'a' in the circle
        var rotationCoordinatesInY = (circleCoordinatesInA + this.outer_radius) * Math.sin(sliceAngle * i); //This is the coordinate 'b' in the circle
        var rotationCoordinatesInZ = circleCoordinatesInB; //Remember: the rotation is made around the z axis so it doesn't affect its coordinates!

        this.vertices.push(
            rotationCoordinatesInX,
            rotationCoordinatesInY,
            rotationCoordinatesInZ
        );


        //The normal of a point in the torus will have the same coordinates of the point
        this.normals.push(
            rotationCoordinatesInX,
            rotationCoordinatesInY,
            rotationCoordinatesInZ
        );

        //Any More Doubts? Check this tutorial: https://lindenreid.wordpress.com/2017/11/06/procedural-torus-tutorial/

    }



};