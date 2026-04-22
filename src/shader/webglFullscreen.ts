/** Fullscreen clip-space quad (two triangles). */
export const FULLSCREEN_QUAD = new Float32Array([
	-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1
]);

export function compileShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
	const shader = gl.createShader(type);
	if (!shader) throw new Error('WebGL: createShader failed');
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const log = gl.getShaderInfoLog(shader) ?? '(no log)';
		gl.deleteShader(shader);
		throw new Error(`Shader compile failed:\n${log}`);
	}
	return shader;
}

export function linkProgram(
	gl: WebGLRenderingContext,
	vertexSource: string,
	fragmentSource: string
): WebGLProgram {
	const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
	const program = gl.createProgram();
	if (!program) throw new Error('WebGL: createProgram failed');
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	gl.deleteShader(vs);
	gl.deleteShader(fs);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const log = gl.getProgramInfoLog(program) ?? '(no log)';
		gl.deleteProgram(program);
		throw new Error(`Program link failed:\n${log}`);
	}
	return program;
}

/** Binds interleaved vec2 positions; returns buffer handle for `deleteBuffer` on teardown. */
export function bindFullscreenQuad(
	gl: WebGLRenderingContext,
	program: WebGLProgram,
	attribName: string
): WebGLBuffer {
	const loc = gl.getAttribLocation(program, attribName);
	if (loc < 0) throw new Error(`WebGL: missing attribute "${attribName}"`);

	const buffer = gl.createBuffer();
	if (!buffer) throw new Error('WebGL: createBuffer failed');

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_QUAD, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(loc);
	gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
	return buffer;
}
