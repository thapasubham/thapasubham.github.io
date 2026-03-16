<script>
	const skills = [
		{ name: 'Frontend', items: ['SvelteKit', 'React', 'TypeScript', 'Tailwind CSS'] },
		{ name: 'Backend', items: ['Node.js', 'Pyhton', 'PostgreSQL', 'Redis'] },
		{ name: 'Tools', items: ['Git', 'Docker', 'AWS', 'Figma'] }
	];
</script>

<section id="skills" class="py-24 bg-zinc-900/30">
	<div class="container-custom">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold mb-4">Technical Prowess</h2>
			<p class="text-zinc-400 max-w-2xl mx-auto">
				My toolkit is constantly evolving, focused on performance, accessibility, and modern best practices.
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8">
			{#each skills as category}
				<div class="glass-card">
					<h3 class="text-xl font-bold mb-6 pb-4 border-b border-white/5">
						{category.name}
					</h3>
					<div class="flex flex-wrap gap-3">
						{#each category.items as skill}
							<span class="px-4 py-2 bg-zinc-800/50 rounded-lg text-sm text-zinc-300 border border-white/5 hover:border-brand-primary/30 transition-colors">
								{skill}
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
