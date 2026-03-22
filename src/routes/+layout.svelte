<script>
	import { onMount } from 'svelte';
	import '../app.css';
	let { children } = $props();

	let activeSection = $state('');

	onMount(() => {
		const handleScroll = () => {
			const sections = document.querySelectorAll('[id]');
			let current = '';

			for (const section of sections) {
				const rect = section.getBoundingClientRect();
				const id = section.getAttribute('id');
				if (id && ['about', 'contact'].includes(id) && rect.top <= window.innerHeight / 2) {
					current = id;
				}
			}

			if (window.scrollY < 100) {
				current = ''; // Portal
			} else if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 50) {
				current = 'contact'; // fallback
			}

			activeSection = current;
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div
	class="font-body bg-surface text-on-surface selection:bg-primary selection:text-on-primary flex min-h-screen flex-col antialiased"
>
	<!-- NAVIGATION SHELL (TopAppBar) -->

	<!-- SIDENAV (SideNavBar) -->
	<aside
		class="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col border-r border-[#ba002c]/20 bg-[#f3f3f5] py-8 pt-24 lg:flex"
	>
		<div class="mb-12 px-6">
			<div class="font-headline text-lg font-black text-[#1a1c1d]">SYSTEM_STATUS</div>
			<div class="text-primary font-label text-[10px] tracking-[0.2em] uppercase">
				ONLINE // VER_2.0.4
			</div>
		</div>
		<nav class="flex-1 space-y-2">
			<a
				href="/"
				class="clip-path-tactical mx-4 block flex items-center gap-4 p-4 transition-all {activeSection ===
				''
					? 'cursor-default bg-[#ba002c] text-white'
					: 'cursor-pointer border-[#ba002c] text-[#1a1c1d] opacity-50 hover:border-l-4 hover:bg-[#e2e2e4] hover:opacity-100'}"
			>
				<span class="font-label text-sm font-bold tracking-widest uppercase">Portal</span>
			</a>
			<a
				href="/#about"
				class="clip-path-tactical mx-4 block flex items-center gap-4 p-4 transition-all {activeSection ===
				'about'
					? 'cursor-default bg-[#ba002c] text-white'
					: 'cursor-pointer border-[#ba002c] text-[#1a1c1d] opacity-50 hover:border-l-4 hover:bg-[#e2e2e4] hover:opacity-100'}"
			>
				<span class="font-label text-sm font-bold tracking-widest uppercase">Dossier</span>
			</a>
			<a
				href="/#contact"
				class="clip-path-tactical mx-4 block flex items-center gap-4 p-4 transition-all {activeSection ===
				'contact'
					? 'cursor-default bg-[#ba002c] text-white'
					: 'cursor-pointer border-[#ba002c] text-[#1a1c1d] opacity-50 hover:border-l-4 hover:bg-[#e2e2e4] hover:opacity-100'}"
			>
				<span class="font-label text-sm font-bold tracking-widest uppercase">Interface</span>
			</a>
		</nav>
		<div class="mt-auto px-4 pb-8">
			<p
				class="bg-primary text-on-primary font-headline clip-path-button hover:bg-on-surface inline-block w-full py-3 text-center text-xs tracking-widest transition-colors"
			>
				DOWNLOAD_CV
			</p>
		</div>
	</aside>

	<main class="relative min-h-screen overflow-hidden pt-24 lg:ml-64">
		<!-- Coordinate Grid Background -->
		{@render children()}
	</main>
</div>
