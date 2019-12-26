/**
 * MyCylinder2 class, which represents a Cylinder object made with Nurbs
 */
class Cylinder2 extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene  represents the CGFscene
     * @param {number}   base   radius of cylinder's base
     * @param {number}   top    radius of cylinder's top
     * @param {number}   height cylinder's height
     * @param {number}   slices number of circle slices
     * @param {number}   stacks number of circle stacks
     */
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.controlvertexes = [ // U0
            [
                [base, 0.0, 0.0, 1.0], // V0
                [top, 0.0, height, 1.0] // V1

            ],
            // U1
            [
                [base, 4 / 3 * base, 0.0, 1.0], // V0
                [top, 4 / 3 * top, height, 1.0] // V1					 
            ],
            // U2
            [
                [-base, 4 / 3 * base, 0.0, 1.0], // V0
                [-top, 4 / 3 * top, height, 1.0] // V1
            ],
            // U3
            [
                [-base, 0.0, 0.0, 1.0], // V0
                [-top, 0.0, height, 1.0] // V1
            ]
        ];

        this.nurbsSurface = new CGFnurbsSurface(3, 1, this.controlvertexes);
        this.obj = new CGFnurbsObject(this.scene, slices, stacks, this.nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)



    }

    display() {

        this.scene.translate(0, 1, 1);
        this.scene.rotate(Math.PI / 2, 1.0, 0.0, 0.0);

        this.obj.display();
        
        this.scene.rotate(Math.PI, 0.0, 0.0, 1.0);

        this.obj.display();
    }
    updateTexCoords(s, t) {}


}