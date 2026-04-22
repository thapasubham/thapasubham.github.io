<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { browser } from '$app/environment';

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;
	let renderer: THREE.WebGLRenderer;
	let mesh: THREE.Mesh;
	let frame = 0;
	let resizeObserver: ResizeObserver;

	const mouse = new THREE.Vector2(0.5, 0.5);
	const targetMouse = new THREE.Vector2(0.5, 0.5);

	const VERTEX_SHADER = /* glsl */ `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;

	/**
	 * Soft drifting gradients + low-amplitude noise waves, nudged by pointer
	 * (normalized to this section’s bounds).
	 */
	const FRAGMENT_SHADER = /* glsl */ `
		uniform float uTime;
		uniform vec2 uResolution;
		uniform vec2 uMouse;
		uniform vec3 uSurface;
		uniform vec3 uVariant;
		uniform vec3 uAccent;
		uniform vec3 uInk;
		uniform vec3 uTeal;

		varying vec2 vUv;

		float hash21(vec2 p) {
			return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
		}

		float noise2(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			vec2 u = f * f * (3.0 - 2.0 * f);
			return mix(
				mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
				mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
				u.y
			);
		}

		void main() {
			float t = uTime;
			float aspect = uResolution.x / max(uResolution.y, 1.0);
			vec2 uv = vUv;

			vec2 m = uMouse - 0.5;
			vec2 q = vec2(uv.x * aspect, uv.y);
			q += m * 0.055;

			float wob = sin(q.x * 4.8 + t * 0.38) * sin(q.y * 3.9 - t * 0.31);
			vec2 wave = vec2(
				sin(q.y * 5.5 + t * 0.42),
				cos(q.x * 4.8 - t * 0.36)
			) * 0.014 * (0.35 + wob * 0.65);
			q += wave;

			vec2 c1 = vec2(
				aspect * (0.32 + sin(t * 0.11) * 0.07),
				0.42 + cos(t * 0.14) * 0.06
			);
			vec2 c2 = vec2(
				aspect * (0.68 + cos(t * 0.095) * 0.09),
				0.58 + sin(t * 0.12) * 0.07
			);
			vec2 c3 = vec2(
				aspect * (0.5 + sin(t * 0.08 + 1.2) * 0.05),
				0.22 + cos(t * 0.1) * 0.05
			);

			float d1 = distance(q, c1);
			float d2 = distance(q, c2);
			float d3 = distance(q, c3);

			float blob1 = exp(-d1 * 2.35);
			float blob2 = exp(-d2 * 2.0);
			float blob3 = exp(-d3 * 2.7);

			float gradY = smoothstep(0.0, 1.0, uv.y);
			// Pull away from flat surface so blending with bg-surface still reads color
			vec3 base = mix(uSurface * 0.96, uVariant, gradY * 0.5 + blob3 * 0.22);

			float accentMix = blob1 * 0.26 + blob2 * 0.2;
			vec3 wash = mix(base, uAccent, accentMix);
			wash = mix(wash, uTeal, blob2 * 0.16 + blob1 * 0.04);

			float rip = sin((q.x + q.y) * 14.0 - t * 0.75) * 0.5 + 0.5;
			float grain = noise2(q * 95.0 + t * 0.25);
			vec3 col = wash;
			col += uInk * (grain - 0.5) * 0.045;
			col = mix(col, uAccent, rip * 0.09);
			col = mix(col, uSurface, 0.08);

			float edge = 1.0 - dot(uv - 0.5, uv - 0.5) * 0.35;
			// Strong rgb above + moderate alpha keeps headings readable over the canvas
			float alpha = edge * (0.42 + blob1 * 0.14 + blob2 * 0.12 + rip * 0.06);

			gl_FragColor = vec4(col, clamp(alpha, 0.38, 0.68));
		}
	`;

	function syncSize() {
		if (!container || !renderer) return;
		const w = Math.max(1, container.clientWidth);
		const h = Math.max(1, container.clientHeight);
		renderer.setSize(w, h, false);
		const mat = mesh?.material as THREE.ShaderMaterial | undefined;
		if (mat) mat.uniforms.uResolution.value.set(w, h);
	}

	function onPointerMove(e: PointerEvent) {
		if (!container) return;
		const r = container.getBoundingClientRect();
		const w = r.width;
		const h = r.height;
		if (w <= 0 || h <= 0) return;
		const nx = (e.clientX - r.left) / w;
		const ny = (e.clientY - r.top) / h;
		if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
			targetMouse.set(nx, ny);
		} else {
			targetMouse.set(0.5, 0.5);
		}
	}

	function loop() {
		frame = requestAnimationFrame(loop);
		mouse.lerp(targetMouse, 0.07);
		const mat = mesh?.material as THREE.ShaderMaterial | undefined;
		if (mat) {
			mat.uniforms.uTime.value += 0.011;
			mat.uniforms.uMouse.value.copy(mouse);
		}
		renderer.render(scene, camera);
	}

	function init() {
		const w = Math.max(1, container.clientWidth);
		const h = Math.max(1, container.clientHeight);

		scene = new THREE.Scene();
		camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
		camera.position.set(0, 0, 1);
		camera.lookAt(0, 0, 0);

		renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'low-power',
			premultipliedAlpha: false
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		renderer.setSize(w, h, false);

		const geometry = new THREE.PlaneGeometry(2, 2);
		const material = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uResolution: { value: new THREE.Vector2(w, h) },
				uMouse: { value: mouse.clone() },
				uSurface: { value: new THREE.Color('#f9f9fb') },
				uVariant: { value: new THREE.Color('#e2e2e4') },
				uAccent: { value: new THREE.Color('#ba002c') },
				uInk: { value: new THREE.Color('#1a1c1d') },
				uTeal: { value: new THREE.Color('#006672') }
			},
			vertexShader: VERTEX_SHADER,
			fragmentShader: FRAGMENT_SHADER,
			transparent: true,
			depthWrite: false,
			depthTest: false
		});

		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
		loop();
	}

	onMount(() => {
		init();
		resizeObserver = new ResizeObserver(() => syncSize());
		resizeObserver.observe(container);
		window.addEventListener('pointermove', onPointerMove, { passive: true });
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('pointermove', onPointerMove);
			cancelAnimationFrame(frame);
			resizeObserver?.disconnect();
			renderer?.dispose();
			mesh?.geometry.dispose();
			(mesh?.material as THREE.Material | undefined)?.dispose();
		}
	});
</script>

<div
	bind:this={container}
	class="pointer-events-none absolute inset-0 z-0 min-h-[280px]"
	aria-hidden="true"
>
	<canvas bind:this={canvas} class="block h-full w-full"></canvas>
</div>
