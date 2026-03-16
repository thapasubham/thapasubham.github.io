<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Developer Portfolio | Build Extraordinary Experiences</title>
	<meta name="description" content="Modern developer portfolio showcasing full-stack projects and technical skills." />
</svelte:head>

<Navbar />

<main>
	<Hero />
	<About />
	<Skills />
	<Projects />
	<Contact />
</main>

<Footer />
