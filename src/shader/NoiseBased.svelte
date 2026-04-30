<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { bindFullscreenQuad, linkProgram } from './webglFullscreen';
	import * as THREE from 'three';

	/** When true, fills `window` (layout backdrop). When false, fills parent `relative` box (e.g. #projects). */
	let { fullscreen = false }: { fullscreen?: boolean } = $props();

	let wrap: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	let gl: WebGLRenderingContext;
	let program: WebGLProgram;
	let positionBuffer: WebGLBuffer;
	let uTime: WebGLUniformLocation | null;
	let uResolution: WebGLUniformLocation | null;
	let uMouseMovement: WebGLUniformLocation | null;
	let uSurface: WebGLUniformLocation | null;
	let uVariant: WebGLUniformLocation | null;
	let uAccent: WebGLUniformLocation | null;
	let uTeal: WebGLUniformLocation | null;
	let uNoiseSeed: WebGLUniformLocation | null;
	let uNoisePhase: WebGLUniformLocation | null;
	let frame = 0;
	let resizeObserver: ResizeObserver | undefined;
	let mouseMovement = new THREE.Vector2(0.5, 0.5);
	let targetMouse = new THREE.Vector2(0.5, 0.5);
	const started = performance.now();

	/** Matches `app.css` @theme — same palette as ThreeBackground / ProjectsSectionShader */
	const PALETTE = {
		surface: [249 / 255, 249 / 255, 251 / 255] as [number, number, number],
		variant: [226 / 255, 226 / 255, 228 / 255] as [number, number, number],
		accent: [186 / 255, 0 / 255, 44 / 255] as [number, number, number],
		teal: [0 / 255, 102 / 255, 114 / 255] as [number, number, number]
	};

	const VERTEX_SHADER = /* glsl */ `
		attribute vec2 aPosition;
		void main() {
			gl_Position = vec4(aPosition, 0.0, 1.0);
		}
	`;

	/** Animated Voronoi / cellular field — tactical surface + accent ridges. */
	const FRAGMENT_SHADER = /* glsl */ `
		precision highp float;

		uniform float uTime;
		uniform vec2 uResolution;
		uniform vec2 uMouseMovement;
		uniform vec3 uSurface;
		uniform vec3 uVariant;
		uniform vec3 uAccent;
		uniform vec3 uTeal;
		// New random values each mount → different Voronoi sites / phase every visit
		uniform vec2 uNoiseSeed;
		uniform float uNoisePhase;

		vec2 random2(vec2 p) {
			return fract(
				sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453123
			);
		}

		vec2 random2B(vec2 p) {
			return fract(
				sin(vec2(dot(p, vec2(419.2, 78.233)), dot(p, vec2(191.7, 237.1)))) * 31415.92653
			);
		}

		float cellular(vec2 uv) {
			vec2 i = floor(uv);
			vec2 f = fract(uv);
			float minDist = 1.0;

			for (int y = -1; y <= 1; y++) {
				for (int x = -1; x <= 1; x++) {
					vec2 neighbor = vec2(float(x), float(y));
					vec2 point = random2(i + neighbor + uNoiseSeed);
					point = 0.5 + 0.5 * sin(uTime * 0.14 + 6.2831853 * point + uNoisePhase);
					vec2 diff = neighbor + point - f;
					minDist = min(minDist, length(diff));
				}
			}
			return minDist;
		}

		/** Second Voronoi field — different seeds + slightly slower feature motion */
		float cellularOverlay(vec2 uv) {
			vec2 i = floor(uv);
			vec2 f = fract(uv);
			float minDist = 1.0;

			for (int y = -1; y <= 1; y++) {
				for (int x = -1; x <= 1; x++) {
					vec2 neighbor = vec2(float(x), float(y));
					vec2 point = random2B(i + neighbor + uNoiseSeed * vec2(-1.73, 2.41) + vec2(31.1, 7.9));
					point = 0.5 + 0.5 * sin(uTime * 0.1 + 6.2831853 * point + uNoisePhase * 0.71);
					vec2 diff = neighbor + point - f;
					minDist = min(minDist, length(diff));
				}
			}
			return minDist;
		}

		void main() {
			vec2 uv = gl_FragCoord.xy / uResolution.xy;
			uv -= 0.25;
			uv.x *= uResolution.x / uResolution.y;

			vec2 m = uMouseMovement - 0.5;
			uv += m * 0.48;
			// Subtle domain shift per session (keeps scale readable)
			vec2 domainSkew = uNoiseSeed.yx * vec2(0.0024, 0.002);
			uv += domainSkew;

			float tSlow = uTime * 0.0065;
			float c1 = cellular(uv * 3.0 + vec2(tSlow, tSlow * 0.55) + m * 0.35);
			float c2 = cellular(uv * 6.0 + vec2(-tSlow * 0.62, tSlow * 0.42) + m * 0.35);
			float ridge = smoothstep(0.12, 0.55, c1) - smoothstep(0.18, 0.62, c2);

			// Finer overlay Voronoi (uncorrelated lattice, own drift)
			vec2 uvOver = uv * 8.75 + vec2(tSlow * 0.38, -tSlow * 0.71) - m * 0.28;
			float c3 = cellularOverlay(uvOver);
			float ridgeOver = smoothstep(0.1, 0.46, c3) - smoothstep(0.15, 0.58, c3);
			ridgeOver = max(ridgeOver, 0.0);

			// Pointer drives accent ↔ teal (and a touch of angle for variety)
			float mr = length(m);
			float angleTint = atan(m.y + 1e-5, m.x + 1e-5) * 0.159154943; // / TWO_PI → ~[-0.25,0.25]
			float tintBlend = clamp(0.1 + m.x * 0.35 + m.y * 0.22 + angleTint, 0.0, 1.0);
			vec3 ridgeTint = mix(uAccent, uTeal, tintBlend);

			vec3 baseWash = mix(uSurface, uVariant, 0.28 + ridge * 0.15 + ridgeOver * 0.08);
			baseWash = mix(baseWash, ridgeTint, mr * 0.06 * (0.25 + ridge * 0.35));

			vec3 col = mix(baseWash, ridgeTint, ridge * 0.52);
			col = mix(col, mix(uVariant, uTeal, 0.55), ridgeOver * 0.22);
			col += uAccent * pow(max(ridge, 0.0), 2.0) * (0.11 + mr * 0.06);
			col += uTeal * pow(max(ridgeOver, 0.0), 2.0) * 0.09;
			col = mix(col, uSurface, 0.08);

			// Stay below paper-white (theme surface is already ~0.98; hard cap prevents 1,1,1)
			const vec3 COLOR_CEIL = vec3(0.97, 0.97, 0.98);
			col = min(col, COLOR_CEIL);

			gl_FragColor = vec4(col, 0.9);
		}
	`;

	function resize() {
		if (!canvas || !gl) return;
		const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
		let cssW: number;
		let cssH: number;
		if (fullscreen) {
			cssW = window.innerWidth;
			cssH = window.innerHeight;
		} else if (wrap) {
			cssW = Math.max(1, wrap.clientWidth);
			cssH = Math.max(1, wrap.clientHeight);
		} else {
			return;
		}
		const w = Math.floor(cssW * dpr);
		const h = Math.floor(cssH * dpr);
		canvas.width = w;
		canvas.height = h;
		canvas.style.width = `${cssW}px`;
		canvas.style.height = `${cssH}px`;
		gl.viewport(0, 0, w, h);
	}

	function render() {
		frame = requestAnimationFrame(render);
		if (!gl || !program) return;
		const t = (performance.now() - started) / 1000;
		mouseMovement.lerp(targetMouse, 0.1);
		gl.useProgram(program);
		gl.uniform1f(uTime, t);
		gl.uniform2fv(uMouseMovement, mouseMovement);

		gl.uniform2f(uResolution, canvas.width, canvas.height);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
	function onWindowPointerMove(event: PointerEvent) {
		targetMouse.x = event.clientX / window.innerWidth;
		targetMouse.y = 1.0 - event.clientY / window.innerHeight;
	}
	onMount(() => {
		const ctx = canvas.getContext('webgl', { alpha: true, antialias: true });
		if (!ctx) return;
		gl = ctx;

		program = linkProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
		gl.useProgram(program);
		positionBuffer = bindFullscreenQuad(gl, program, 'aPosition');
		window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
		uTime = gl.getUniformLocation(program, 'uTime');
		uResolution = gl.getUniformLocation(program, 'uResolution');
		uMouseMovement = gl.getUniformLocation(program, 'uMouseMovement');
		uSurface = gl.getUniformLocation(program, 'uSurface');
		uVariant = gl.getUniformLocation(program, 'uVariant');
		uAccent = gl.getUniformLocation(program, 'uAccent');
		uTeal = gl.getUniformLocation(program, 'uTeal');
		uNoiseSeed = gl.getUniformLocation(program, 'uNoiseSeed');
		uNoisePhase = gl.getUniformLocation(program, 'uNoisePhase');
		gl.uniform3fv(uSurface, PALETTE.surface);
		gl.uniform3fv(uVariant, PALETTE.variant);
		gl.uniform3fv(uAccent, PALETTE.accent);
		gl.uniform3fv(uTeal, PALETTE.teal);
		gl.uniform2f(uNoiseSeed, Math.random() * 1000 - 500, Math.random() * 1000 - 500);
		gl.uniform1f(uNoisePhase, Math.random() * Math.PI * 2);
		resize();
		if (fullscreen) {
			window.addEventListener('resize', resize);
		} else {
			resizeObserver = new ResizeObserver(() => resize());
			resizeObserver.observe(wrap);
		}
		render();
	});

	onDestroy(() => {
		if (!browser) return;
		window.removeEventListener('pointermove', onWindowPointerMove);
		if (fullscreen) window.removeEventListener('resize', resize);
		resizeObserver?.disconnect();
		cancelAnimationFrame(frame);
		if (gl && positionBuffer) gl.deleteBuffer(positionBuffer);
		if (gl && program) gl.deleteProgram(program);
	});
</script>

<div
	bind:this={wrap}
	class={fullscreen ? 'noise-fullscreen' : 'noise-contained'}
	aria-hidden="true"
>
	<canvas bind:this={canvas} class="noise-canvas"></canvas>
</div>

<style>
	.noise-contained {
		position: absolute;
		inset: 0;
		z-index: 0;
		min-height: 280px;
		pointer-events: auto;
	}

	.noise-fullscreen {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
	}

	.noise-canvas {
		display: block;
		width: 100%;
		height: 100%;
		pointer-events: auto;
		opacity: 0.55;
	}
</style>
