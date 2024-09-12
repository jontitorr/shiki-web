<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { siteConfig } from '../../config/site';
	const discordHopInMp4 = '/videos/Discord_Website_Refresh_Hop-In-transcode.mp4';
	const discordWebsiteSameRoomMp4 = '/videos/Discord_Website_Refresh_Same Room_EN-transcode.mp4';
	const discordHopInWebm = discordHopInMp4.replace('mp4', 'webm');
	const discordWebsiteSameRoomWebm = discordWebsiteSameRoomMp4.replace('mp4', 'webm');

	let platformStr = '';
	let isDesktop = true;

	onMount(() => {
		const userAgent = navigator.userAgent;

		if (!userAgent) {
			platformStr = '';
			isDesktop = true;
		} else if (userAgent.includes('Win')) {
			platformStr = 'for Windows';
			isDesktop = true;
		} else if (userAgent.includes('like Mac')) {
			platformStr = 'from App Store';
			isDesktop = false;
		} else if (userAgent.includes('Mac')) {
			platformStr = 'for Mac';
			isDesktop = true;
		} else if (userAgent.includes('Android')) {
			platformStr = 'on Google Play';
			isDesktop = false;
		} else if (userAgent.includes('Linux')) {
			platformStr = 'for Linux';
			isDesktop = true;
		}
	});
</script>

<section class="container grid items-center gap-6 pb-8 pt-6 md:py-10">
	<div class="flex flex-col items-center gap-2">
		<h1 class="text-3xl font-extrabold uppercase leading-tight tracking-tighter md:text-4xl">
			Imagine a place...
		</h1>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			...where you can belong to a school club, a gaming group, or a worldwide art community. Where
			just you and a handful of friends can spend time together. A place that makes it easy to talk
			every day and hang out more often.
		</p>
	</div>
	<div class="flex justify-center gap-4">
		<a href={siteConfig.links.docs} target="_blank" rel="noreferrer" class={buttonVariants()}>
			Download {platformStr}
		</a>
		{#if isDesktop}
			<a
				href={siteConfig.links.github}
				target="_blank"
				rel="noreferrer"
				class={buttonVariants({ variant: 'outline' })}
			>
				Open {siteConfig.name} in your browser
			</a>
		{/if}
	</div>
	<div class="flex flex-col items-center gap-8 md:flex-row md:justify-center">
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			width={500}
			height={500}
			class="max-h-[400px] rounded-2xl object-cover"
			playsinline
			autoplay
			muted
			loop
			><source src={discordWebsiteSameRoomMp4} /><source src={discordWebsiteSameRoomWebm} /></video
		>
		<div
			class="flex max-w-[500px] flex-col items-center justify-center space-y-4 text-center md:items-end md:text-right"
		>
			<h2 class="md:text2xl font-bold leading-[1.1] sm:text-xl">
				Stream like you re in the same room
			</h2>
			<p class="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
				High quality and low latency streaming makes it feel like you're hanging out on the couch
				with friends while playing a game, watching shows, looking at photos, or idk doing homework
				or something.
			</p>
		</div>
	</div>
	<div class="flex flex-col-reverse items-center gap-8 md:flex-row md:justify-center">
		<div
			class="flex max-w-[500px] flex-col items-center justify-center space-y-4 text-center md:items-end md:text-right"
		>
			<h2 class="md:text2xl font-bold leading-[1.1] sm:text-xl">Where hanging out is easy</h2>
			<p class="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
				Grab a seat in a voice channel when you’re free. Friends in your server can see you’re
				around and instantly pop in to talk without having to call.
			</p>
		</div>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			width={500}
			height={500}
			class="max-h-[400px] rounded-2xl object-cover"
			playsinline
			autoplay
			muted
			loop><source src={discordHopInMp4} /><source src={discordHopInWebm} /></video
		>
	</div>
</section>
