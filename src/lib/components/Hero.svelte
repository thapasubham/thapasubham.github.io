<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	let nameRef: HTMLElement;
	let subRef: HTMLElement;
	let ctaRef: HTMLElement;

	let mouseX = $state(0);
	let mouseY = $state(0);
	let time = $state('');

	function updateMouse(e: MouseEvent) {
		mouseX = Math.floor(e.clientX);
		mouseY = Math.floor(e.clientY);
	}

	onMount(() => {
		const options: Intl.DateTimeFormatOptions = {
			timeZone: 'Asia/Kathmandu',
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		};
		time = new Date().toLocaleTimeString('en-US', options);
		const timer = setInterval(() => {
			time = new Date().toLocaleTimeString('en-US', options);
		}, 1000);
		const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 0.8 } });
		tl.fromTo(nameRef, { y: 100, opacity: 0 }, { y: 0, opacity: 1 })
			.fromTo(subRef, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=1.2')
			.fromTo(ctaRef, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=1');

		window.addEventListener('mousemove', updateMouse);
		return () => {
			clearInterval(timer);
			window.removeEventListener('mousemove', updateMouse);
		};
	});
</script>

<section id="hero" class="relative flex min-h-[100dvh] flex-col overflow-hidden bg-void md:block md:h-[100dvh]">
	<div
		class="pointer-events-none absolute top-20 right-4 z-0 select-none font-display text-[5rem] font-black leading-none text-void [-webkit-text-stroke:2px_rgba(255,255,255,0.3)] md:top-10 md:right-10 md:text-[10rem] mt-5"
	>
		01
	</div>


	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/80"
	></div>
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-r from-void/90 via-transparent to-transparent"
	></div>



	<div class="pointer-events-none absolute inset-0 z-10 overflow-hidden">
		<div class="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan/40 to-transparent animate-scan"></div>
	</div>

	<div class="pointer-events-none absolute inset-0 z-30 border border-white/5 m-4 md:m-8">
		<div class="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-cyan/40"></div>
		<div class="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-magenta/40"></div>
		<div class="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-gold/40"></div>
		<div class="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-violet/40"></div>
	</div>

	<div
		class="absolute top-20 left-5 z-20 max-w-[calc(100%-5.5rem)] text-left md:top-10 md:left-10 md:max-w-none"
	>
		<div class="hud-label text-cyan text-xs tracking-widest md:text-xl">{time}</div>
		<div class="hud-label text-secondary text-[7px] leading-snug md:text-[10px]">
			DEV_LOCAL_TIME // KATHMANDU, NEPAL
		</div>
	</div>

	<div
		class="relative z-10 flex flex-1 flex-col justify-center px-5 pb-28 pt-24 max-md:min-h-0 md:absolute md:bottom-16 md:left-16 md:block md:flex-none md:px-0 md:pb-0 md:pt-0 animate-float"
	>
		<div class="mb-2 ml-2 flex items-center gap-6 opacity-60 max-md:hidden">
			<span class="text-cyan text-[10px]">♦</span>
			<span class="text-magenta text-[10px]">♠</span>
			<span class="text-gold text-[10px]">▲</span>
		</div>

		<!-- Name Composition -->
		<div bind:this={nameRef} class="relative flex flex-col opacity-0">
			<div class="relative">
				<!-- 1. Outline Layer (Bottom-most) -->
				<div class="pointer-events-none absolute top-[2px] -left-[4px] md:top-1 md:-left-2 opacity-100">
					<h1
						class="hero-name font-display italic font-black leading-[0.75] tracking-tighter uppercase text-outline"
					>
						Subham
					</h1>
				</div>
				<!-- 2. Blocking Layer (Solid background color to cover outline behind text) -->
				<div class="pointer-events-none absolute inset-0">
					<h1
						class="hero-name font-display italic font-black leading-[0.75] tracking-tighter uppercase text-void"
					>
						Subham
					</h1>
				</div>
				<!-- 3. Iridescent Layer (Top-most) -->
				<h1
					class="hero-name relative font-display italic font-black leading-[0.75] tracking-tighter uppercase iridescent-gradient"
				>
					Subham
				</h1>
			</div>
			
			<!-- Middle Bar (Sharp & Solid) -->
			<div
				class="relative my-1.5 flex items-center justify-center border-y border-white/40 bg-void px-2 py-2 md:my-2 md:px-6 md:py-3"
			>
				<p
					bind:this={subRef}
					class="hud-label text-text text-center text-[9px] font-bold leading-snug tracking-[0.12em] opacity-0 italic sm:text-xs sm:tracking-[0.3em] md:text-sm md:tracking-[0.6em]"
				>
					Software Engineer // Full-Stack
				</p>
			</div>

			<div class="relative">
				<!-- 1. Outline Layer (Bottom-most) -->
				<div class="pointer-events-none absolute top-[2px] -left-[4px] md:top-1 md:-left-2 opacity-100">
					<h1
						class="hero-name font-display italic font-black leading-[0.75] tracking-tighter uppercase text-outline"
					>
						Thapa
					</h1>
				</div>
				<!-- 2. Blocking Layer (Solid background color to cover outline behind text) -->
				<div class="pointer-events-none absolute inset-0">
					<h1
						class="hero-name font-display italic font-black leading-[0.75] tracking-tighter uppercase text-void"
					>
						Thapa
					</h1>
				</div>
				<!-- 3. Iridescent Layer (Top-most) -->
				<h1
					class="hero-name relative font-display italic font-black leading-[0.75] tracking-tighter uppercase iridescent-gradient opacity-90"
				>
					Thapa
				</h1>
			</div>
		</div>

		<!-- Bottom Symbols -->
		<div class="mt-4 ml-2 flex items-center gap-6 opacity-60 max-md:hidden">
			<span class="text-magenta text-[10px]">♦</span>
			<span class="text-gold text-[10px]">♠</span>
			<span class="text-cyan text-[10px]">▲</span>
		</div>

		<div
			bind:this={ctaRef}
			class="mt-8 flex w-full max-w-sm flex-col gap-3 opacity-0 sm:mt-12 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-5"
		>
			<a
				href="#projects"
				id="hero-cta-work"
				class="hud-label border border-cyan/40 bg-cyan/10 px-8 py-3 text-center text-cyan transition-all duration-300 bloom-cyan hover:bg-cyan hover:text-void"
			>
				View Work
			</a>
			<a
				href="#contact"
				id="hero-cta-contact"
				class="text-center font-mono text-[11px] tracking-widest text-muted transition-colors duration-300 hover:text-text sm:text-left"
			>
				Get in Touch ↗
			</a>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div
		class="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
	>
		<div class="h-10 w-px animate-pulse bg-gradient-to-b from-cyan/50 to-transparent"></div>
		<span class="hud-label text-muted">Scroll</span>
	</div>
</section>
