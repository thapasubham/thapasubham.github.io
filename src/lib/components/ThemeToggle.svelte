<script lang="ts">
	import { themeManager } from '$lib/theme.svelte';

	const themes = [
		{ id: 'light', label: 'LIGHT', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z' },
		{ id: 'dark', label: 'DARK', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
		{ id: 'system', label: 'SYSTEM', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
	] as const;

	function setTheme(t: typeof themes[number]['id']) {
		themeManager.theme = t;
	}
</script>

<div class="flex items-center gap-1 bg-surface-container-low p-1 border border-outline/20 clip-path-tactical">
	{#each themes as { id, label, icon } (id)}
		<button
			onclick={() => setTheme(id)}
			class="group relative flex items-center gap-2 px-3 py-1.5 transition-all
                   {themeManager.current === id 
                     ? 'bg-primary text-on-primary' 
                     : 'text-on-surface/60 hover:text-on-surface hover:bg-surface-container-high'}"
			aria-label="Set theme to {id}"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={icon} />
			</svg>
			<span class="font-label text-[10px] font-bold tracking-widest hidden lg:block">{label}</span>
			
			{#if themeManager.current === id}
				<div class="absolute -bottom-1 -left-1 w-2 h-2 border-l border-b border-white opacity-50"></div>
				<div class="absolute -top-1 -right-1 w-2 h-2 border-r border-t border-white opacity-50"></div>
			{/if}
		</button>
	{/each}
</div>

<style>
	.clip-path-tactical {
		clip-path: polygon(0 0, 95% 0, 100% 20%, 100% 100%, 5% 100%, 0 80%);
	}
</style>
