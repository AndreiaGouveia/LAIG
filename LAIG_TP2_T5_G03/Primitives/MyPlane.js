/**
 * MyPlane class, which represents a Plane object with nrDivs divisions along both axis, with center at (0,0)
 */
class MyPlane extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene    represents the CGFscene
     * @param {number}   nrDivsU  divisions in U          
     * @param {number}   nrDivsV  divisions in V          
     */
    constructor(scene, nrDivsU, nrDivsV) {
        super(scene);

        // nrDivs = 1 if not provided
        this.nrDivsU = nrDivsU;
        this.nrDivsV = nrDivsV;

        this.init();
    }

    init() {

        var controlVertexes = [ // U = 0
            [ // V = 0..1;
                [-0.25, 0.0, 0.25, 1],
                [-0.25, 0.0, -0.25, 1]

            ],
            // U = 1
            [ // V = 0..1
                [0.25, 0.0, 0.25, 1],
                [0.25, 0.0, -0.25, 1]
            ]
        ];


        var nurbsSurface = new CGFnurbsSurface(1, 1, controlVertexes);

        // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
        this.obj = new CGFnurbsObject(this.scene, this.nrDivsU, this.nrDivsV, nurbsSurface);
    }

    display() {

        this.obj.display();
    }

    updateTexCoords(s, t) {}
}