#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float timeFactor;

float dist(vec2 p0, vec2 pf){return sqrt((pf.x-p0.x)*(pf.x-p0.x)+(pf.y-p0.y)*(pf.y-p0.y));}

void main() {

	/* 1.0 - vTextureCoord.y to flip the image */
	vec4 original_color = texture2D(uSampler, vec2(vTextureCoord.x, 1.0-vTextureCoord.y));

	vec4 color;
	float speed = 0.8;

	if(mod(vTextureCoord.y * 30.0 + timeFactor*speed, 5.0) > 1.0)
		color = vec4(original_color.rgb*5.0, 1.0); 
	else
		color = vec4(2, 2, 2, 1.0); /* Light */

	float d = dist(vTextureCoord.xy,vec2(0.5, 0.5))*2.0;
	vec4 gradient = mix(vec4(1.0, 1.0, 1.0, 1.0), vec4(0.2, 0.2, 0.2, 1.0), d);

/*0 is black*/
	gl_FragColor = color*gradient;
}