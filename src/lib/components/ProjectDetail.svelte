<script>
	let { project } = $props();
</script>

<div class="bg-surface-container-lowest border-on-surface/5 relative overflow-hidden border p-8">
	<!-- Background Pattern -->
	<div class="grid-pattern pointer-events-none absolute inset-0 opacity-10"></div>

	<div class="relative z-10">
		<p
			class="font-body text-secondary border-primary mb-8 border-l-4 pl-4 text-sm leading-relaxed transition-colors"
		>
			{project.description}
		</p>

		<div class="mb-8 flex flex-wrap gap-2">
			{#each project.tech as t}
				<span
					class="font-label clip-cut-corner bg-primary border px-4 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors"
				>
					{t}
				</span>
			{/each}
		</div>

		<div class="flex items-center justify-between">
			<a
				href={project.link}
				target="_blank"
				rel="noreferrer"
				class="bg-primary text-on-primary font-headline clip-cut-corner relative inline-flex items-center gap-2 px-8 py-3 text-xs font-black tracking-widest uppercase transition-transform hover:translate-x-1"
			>
				ACCESS_REPO
			</a>

			<div class="bg-surface-container-low flex h-2 w-16 gap-1">
				<div class="bg-primary w-2/3"></div>
			</div>
		</div>
	</div>
</div>
