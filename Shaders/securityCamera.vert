attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;


uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main() {


	gl_Position =  vec4(aVertexPosition, 1.0);
	
	vTextureCoord = aTextureCoord;
}