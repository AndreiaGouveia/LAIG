/**
 * Cylinder2
 * @constructor
 */
class Cylinder2 extends CGFobject {
	constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        
        this.controlvertexes = 
		[	// U0
            [				 
                [ base, 0.0, 0.0, 1.0 ],        // V0
                [ top, 0.0, height, 1.0 ]       // V1
                
            ],
            // U1
            [
                [ base, 4/3*base, 0.0, 1.0 ],   // V0
                [ top, 4/3*top, height, 1.0 ]	// V1					 
            ],
            // U2
            [			
                [-base, 4/3*base, 0.0, 1.0 ],   // V0
				[-top, 4/3*top, height, 1.0 ]   // V1
            ],
            // U3
            [			
                [-base, 0.0, 0.0, 1.0 ],        // V0
                [-top, 0.0, height, 1.0 ]       // V1
            ]
        ];

        this.nurbsSurface = new CGFnurbsSurface(3, 1,this.controlvertexes);
		this.obj = new CGFnurbsObject(this.scene, slices, stacks, this.nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		
        

    }

    display(){
        this.scene.translate(0,1,1);
        this.scene.rotate(Math.PI/2,1.0,0.0,0.0);
        this.obj.display();
        this.scene.translate(0,0,1);
        this.scene.rotate(Math.PI,1.0,0.0,0.0);
        this.obj.display();
    }
    updateTexCoords(s, t) {}


}