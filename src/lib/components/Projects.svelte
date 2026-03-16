<script>
	const projects = [
		{
			title: 'E-Commerce Platform',
			description: 'A full-featured specialized marketplace with real-time analytics.',
			tech: ['SvelteKit', 'PostgreSQL', 'Tailwind'],
			link: '#'
		},
		{
			title: 'AI Analytics Dashboard',
			description: 'Deep learning visualization tool for complex data sets.',
			tech: ['React', 'Python', 'FastAPI'],
			link: '#'
		},
		{
			title: 'SaaS Design System',
			description: 'Comprehensive UI framework for enterprise applications.',
			tech: ['TypeScript', 'CSS', 'Figma'],
			link: '#'
		}
	];
</script>

<section id="projects" class="py-24">
	<div class="container-custom">
		<div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
			<div>
				<h2 class="text-3xl md:text-4xl font-bold mb-4">Selected Work</h2>
				<p class="text-zinc-400 max-w-xl">
					A collection of projects that push the boundaries of technology and design.
				</p>
			</div>
			<a href="#projects" class="text-brand-primary font-medium hover:underline flex items-center gap-2">
				View archived projects
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
			</a>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each projects as project}
				<div class="glass-card group flex flex-col h-full">
					<div class="aspect-video bg-zinc-800 rounded-xl mb-6 overflow-hidden relative">
						<div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div>
                        <div class="absolute inset-x-0 bottom-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                            <a href={project.link} class="w-full btn-primary text-center block text-sm py-2">View Case Study</a>
                        </div>
					</div>
					<h3 class="text-xl font-bold mb-3">{project.title}</h3>
					<p class="text-zinc-500 text-sm mb-6 flex-grow">
						{project.description}
					</p>
					<div class="flex flex-wrap gap-2 pt-4 border-t border-white/5">
						{#each project.tech as t}
							<span class="text-[10px] uppercase tracking-widest font-bold text-zinc-600">{t}</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
