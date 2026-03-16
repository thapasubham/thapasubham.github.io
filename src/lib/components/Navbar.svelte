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
	class="fixed top-0 left-0 w-full z-50 transition-all duration-300 {isScrolled
		? 'bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-4'
		: 'bg-transparent py-6'}"
>
	<div class="container-custom flex justify-between items-center">
		<a href="/" class="text-xl font-bold tracking-tighter text-white">
			DEV<span class="text-brand-primary">PORTFOLIO</span>
		</a>

		<div class="hidden md:flex gap-8 items-center">
			{#each navItems as item}
				<a href={item.href} class="nav-link text-sm font-medium">
					{item.name}
				</a>
			{/each}
			<a href="#contact" class="btn-primary text-sm py-2 px-6"> Hire Me </a>
		</div>

		<!-- Mobile menu button (would add state/logic for actual toggle) -->
		<button class="md:hidden text-zinc-400">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
		</button>
	</div>
</nav>
