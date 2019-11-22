class MyPatch extends CGFobject{
	constructor(scene,npartsU, npartsV, npointsU, npointsV, controlPoints
        ) {
		super(scene);
            console.log(controlPoints);
        this.controlvertexes=[];
        
        //get our control Vertexes

        for(var i=0 ; i<npointsU ;i++ ){
            //Points U1....UN
            var pointsU = []; //create an empty set
            for(var j=0 ; j<npointsV ; j++)
            {

                var point=[];
                point.push(...controlPoints[i*npointsV+j]);
                point.push(1); //because control points have w=1
                pointsU.push(point);
            }
            this.controlvertexes.push(pointsU);
        }
        console.log("final: ");
        console.log(this.controlvertexes);
        this.nurbsSurface = new CGFnurbsSurface(npointsU-1, npointsV-1,this.controlvertexes);
		this.obj = new CGFnurbsObject(this.scene, npartsU, npartsV, this.nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		
	}

	display(){
        this.obj.display();
	}
	updateTexCoords(s, t) {}
}