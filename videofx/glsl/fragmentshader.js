var fragmentshader = [
	"#ifdef GL_ES",
	"precision highp float;",
	"#endif",
	
	"uniform sampler2D video;",
	"uniform vec2 resolution;",
	"uniform float time;",
	
	"uniform bool invert;",
	
	"uniform bool sat;",
	"uniform float satStrength;",
	
	"uniform bool noise;",
	"uniform float noiseStrength;",
	
	"uniform bool lines;",
	"uniform float lineStrength;",
	"uniform float lineSize;",
	"uniform float lineTilt;",
	
	"varying vec2 vUv;",
	
	simplexnoise,
	
	"void main(void)",
	"{",
		"vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;",
	
		"vec3 col = texture2D(video, vUv).xyz;",
		
		"if(invert)",
		"{",
			"col = 1.0-col;",
		"}",
	
		"if(sat)",
		"{",
			"float c = (col.x + col.y + col.z) / 3.0;",
			"col = col*satStrength+c*(1.0-satStrength);",
		"}",
	
		"if(noise)",
		"{",
			"col += (snoise((p+sin(time))*5000.0)-0.5)*noiseStrength;",
			
		"}",
		
		"if(lines)",
		"{",
			"col += sin(p.x*lineSize*(1.0-lineTilt)+p.y*lineSize*lineTilt)*lineStrength;",
		"}",
		"gl_FragColor = vec4(col,1.0);",
	"}",
].join('\n');