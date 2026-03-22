<script>
	const navItems = [
		{ name: 'About', href: '#about' },
		{ name: 'Skills', href: '#skills' },
		{ name: 'Projects', href: '#projects' },
		{ name: 'Contact', href: '#contact' }
	];

	let isScrolled = $state(false);

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', () => {
			isScrolled = window.scrollY > 20;
		});
	}
</script>

<nav
	class="fixed top-0 left-0 z-50 w-full transition-all duration-500 {isScrolled
		? 'bg-bg-deep/70 border-b border-white/10 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl'
		: 'bg-transparent py-6'}"
>
	<!-- Background Decorations -->

	<div class="relative z-10 mx-auto flex max-w-[1200px] items-center justify-between px-8">
		<!-- <a
			href="/"
			class="group flex items-center gap-2 text-2xl font-black tracking-tighter text-white"
		>
			<div
				class="from-brand-primary to-brand-secondary group-hover:shadow-brand-primary/50 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-sm text-white shadow-lg transition-all group-hover:scale-110"
			>
				D
			</div>
			<span>EV<span class="text-gradient">PORTFOLIO</span></span>
		</a> -->

		<div
			class="hidden items-center gap-8 rounded-full border border-white/5 bg-white/5 px-8 py-3 backdrop-blur-md md:flex"
		>
			{#each navItems as item}
				<a href={item.href} class="nav-link font-medium">
					{item.name}
				</a>
			{/each}
		</div>

		<div class="hidden md:block">
			<a
				href="#contact"
				class="btn-primary shrink-0 px-6 py-2.5 text-sm shadow-none hover:shadow-[0_0_15px_var(--color-brand-primary)]"
			>
				Get in touch
			</a>
		</div>

		<!-- Mobile menu button -->
		<button
			class="text-zinc-300 transition-colors hover:text-white md:hidden"
			aria-label="Toggle Menu"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="28"
				height="28"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line
					x1="3"
					y1="18"
					x2="21"
					y2="18"
				></line></svg
			>
		</button>
	</div>
</nav>
