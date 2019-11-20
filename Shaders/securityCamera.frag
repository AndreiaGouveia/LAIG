#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D gradient_color;


void main() {

	/* 1.0 - vTextureCoord.y to flip the image */
	vec4 original_color = texture2D(uSampler, vec2(vTextureCoord.x, 1.0-vTextureCoord.y));

	vec4 gradient = vec4(original_color.rgb * vTextureCoord.x, 1);

	vec4 color;

	if(mod(vTextureCoord.y * 60.0, 2.0) > 1.0)
		color = vec4(gradient.rgb,1.0); /* dark */
	else
		color = vec4(gradient.rgb*2.5,1.0); /* Light */

	gl_FragColor = color;
}