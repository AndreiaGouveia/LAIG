/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class MyPlane extends CGFobject{
	constructor(scene, nrDivsU , nrDivsV) {
		super(scene);
		// nrDivs = 1 if not provided
        this.nrDivsU = nrDivsU;
		this.nrDivsV = nrDivsV;
		this.init();
	}
	init() {
			 this.controlvertexes=
			[	// U = 0
				[ // V = 0..1;
					 [-0.25, 0.0, 0.25, 1 ],
					 [-0.25, 0.0, -0.25, 1 ]
					
				],
				// U = 1
				[ // V = 0..1
					 [ 0.25, 0.0, 0.25, 1 ],
					 [ 0.25,  0.0, -0.25, 1 ]							 
				]
			]
		;
			console.log(this.controlvertexes);
		this.nurbsSurface = new CGFnurbsSurface(1, 1,this.controlvertexes);
		this.obj = new CGFnurbsObject(this.scene, this.nrDivsU, this.nrDivsV, this.nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		
	}

	display(){
		this.obj.display();
	}
	updateTexCoords(s, t) {}
}