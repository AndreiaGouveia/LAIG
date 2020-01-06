/**
 * MyPatch class, which represents a Patch object
 */
class MyPatch extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     * @param {number}   nPartsU         parts in U
     * @param {number}   nPartsV         parts in V
     * @param {number}   nPointsU        control vertexes U
     * @param {number}   nPointsV        control vertexes V
     * @param {array}    controlPoints   Array with ControlPoints (= nPoints*nPointsV)
     */
    constructor(scene, nPartsU, nPartsV, nPointsU, nPointsV, controlPoints) {
        super(scene);


        var controlVertexes = [];

        //get our control Vertexes

        for (var i = 0; i < nPointsU; i++) {

            //Points U1....UN
            var pointsU = []; //create an empty set

            for (var j = 0; j < nPointsV; j++) {

                var point = [];
                point.push(...controlPoints[i * nPointsV + j]);
                point.push(1); //because control points have w=1
                pointsU.push(point);
            }

            controlVertexes.push(pointsU);
        }

        this.nurbsSurface = new CGFnurbsSurface(nPointsU - 1, nPointsV - 1, controlVertexes);
        this.obj = new CGFnurbsObject(this.scene, nPartsU, nPartsV, this.nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)

    }

    display() {

        this.obj.display();
    }

    updateTexCoords(s, t) {}
}