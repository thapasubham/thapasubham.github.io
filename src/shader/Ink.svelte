<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { bindFullscreenQuad, linkProgram } from './webglFullscreen';

	let canvas: HTMLCanvasElement;

	let gl: WebGLRenderingContext;
	let program: WebGLProgram;
	let positionBuffer: WebGLBuffer;
	let uTime: WebGLUniformLocation | null;
	let uResolution: WebGLUniformLocation | null;
	let frame = 0;

	const started = performance.now();

	const VERTEX_SHADER = /* glsl */ `
		attribute vec2 aPosition;
		void main() {
			gl_Position = vec4(aPosition, 0.0, 1.0);
		}
	`;

	/** Value noise + short flow advection → ink-like smear. */
	const FRAGMENT_SHADER = /* glsl */ `
		precision highp float;

		uniform float uTime;
		uniform vec2 uResolution;

		float hash(vec2 p) {
			return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
		}

		float noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			vec2 u = f * f * (3.0 - 2.0 * f);
			float a = hash(i);
			float b = hash(i + vec2(1.0, 0.0));
			float c = hash(i + vec2(0.0, 1.0));
			float d = hash(i + vec2(1.0, 1.0));
			return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
		}

		vec2 flow(vec2 p) {
			float e = 0.0015;
			float n0 = noise(p);
			float nx = noise(p + vec2(e, 0.0));
			float ny = noise(p + vec2(0.0, e));
			vec2 g = vec2(nx - n0, ny - n0);
			return length(g) > 1e-5 ? normalize(g) : vec2(0.0);
		}

		void main() {
			vec2 uv = gl_FragCoord.xy / uResolution.xy;
			uv -= 0.5;
			uv.x *= uResolution.x / uResolution.y;

			float t = uTime * 0.2;
			vec2 p = uv * 3.0;

			for (int i = 0; i < 5; i++) {
				p += flow(p + t) * 0.1;
			}

			float n = noise(p);
			float ink = smoothstep(0.32, 0.68, n);

			vec3 base = vec3(0.04, 0.045, 0.055);
			vec3 deep = vec3(0.729, 0.0, 0.173);
			vec3 glow = vec3(0.0, 0.4, 0.45);

			vec3 col = mix(base, deep, ink);
			col += glow * pow(ink, 3.0) * 0.15;
			col += 0.06 * pow(ink, 2.0);

			gl_FragColor = vec4(col, 1.0);
		}
	`;

	function resize() {
		if (!canvas || !gl) return;
		const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
		canvas.width = Math.floor(window.innerWidth * dpr);
		canvas.height = Math.floor(window.innerHeight * dpr);
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight}px`;
		gl.viewport(0, 0, canvas.width, canvas.height);
	}

	function render() {
		frame = requestAnimationFrame(render);
		if (!gl || !program) return;
		const t = (performance.now() - started) / 1000;
		gl.useProgram(program);
		gl.uniform1f(uTime, t);
		gl.uniform2f(uResolution, canvas.width, canvas.height);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	onMount(() => {
		const ctx = canvas.getContext('webgl', { alpha: true, antialias: true });
		if (!ctx) return;
		gl = ctx;

		program = linkProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
		gl.useProgram(program);
		positionBuffer = bindFullscreenQuad(gl, program, 'aPosition');

		uTime = gl.getUniformLocation(program, 'uTime');
		uResolution = gl.getUniformLocation(program, 'uResolution');

		resize();
		window.addEventListener('resize', resize);
		render();
	});

	onDestroy(() => {
		if (!browser) return;
		window.removeEventListener('resize', resize);
		cancelAnimationFrame(frame);
		if (gl && positionBuffer) gl.deleteBuffer(positionBuffer);
		if (gl && program) gl.deleteProgram(program);
	});
</script>

<canvas bind:this={canvas} class="ink-canvas" aria-hidden="true"></canvas>

<style>
	.ink-canvas {
		position: fixed;
		inset: 0;
		z-index: -1;
		display: block;
		pointer-events: none;
		opacity: 0.85;
	}
</style>
