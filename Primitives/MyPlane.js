/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class MyPlane extends CGFobject{
	constructor(scene, nrDivsU , nrDivsV) {
		super(scene);
		// nrDivs = 1 if not provided
        nrDivsU = typeof nrDivsU !== 'undefined' ? nrDivsU : 1;
        nrDivsV = typeof nrDivsV !== 'undefined' ? nrDivsV : 1;
        this.nrDivsU = nrDivsU;
        this.nrDivsV = nrDivsV;
		this.patchLength = 1.0/(nrDivsU*nrDivsV);
		this.minS = 0;
		this.maxS = 1;
		this.minT = 0;
		this.maxT = 1;
		this.q = (this.maxS - this.minS) / this.nrDivsU;
		this.w = (this.maxT - this.minT) / this.nrDivsV;
		this.initBuffers();
	}
	initBuffers() {
		// Generate vertices, normals, and texCoords
		this.vertices = [];
		this.normals = [];
		this.texCoords = [];
		var yCoord = 1;
		for (var j = 0; j <= this.nrDivsU; j++) {
			var xCoord = -1;
			for (var i = 0; i <= this.nrDivsV; i++) {
				this.vertices.push(xCoord, yCoord, 0);
				this.normals.push(0, 0, 1);
				this.texCoords.push(this.minS + i * this.q, this.minT + j * this.w);
				xCoord += this.patchLength;
			}
			yCoord -= this.patchLength;
		}
		// Generating indices
        this.indices = [];
        
        var ind = 0;
		for (var j = 0; j < this.nrDivsU ; j++) {
			for (var i = 0; i <= this.nrDivsV; i++) {
				this.indices.push(ind);
				this.indices.push(ind + this.nrDivsV + 1);
				ind++;
			}
			if (j + 1 < this.nrDivsV) {
				this.indices.push(ind + this.nrDivsV);
				this.indices.push(ind);
			}
        }
        
        this.defaultTextCoord = this.texCoords;

		this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
		this.initGLBuffers();
	}

	setFillMode() { 
		this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
	}

	setLineMode() 
	{ 
		this.primitiveType=this.scene.gl.LINES;
	};

    updateTexCoords(s, t) {

        this.texCoords = this.defaultTextCoord.slice();

        for (var i = 0; i < this.texCoords.length; i += 2) {
            this.texCoords[i] /= s;
            this.texCoords[i + 1] /= t;
        }

        this.updateTexCoordsGLBuffers();
    }
}