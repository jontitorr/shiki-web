<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from './ui/button';
	import * as Dialog from './ui/dialog';

	export let src: string;
	export let alt: string;
	export let imgClass: string;

	let hovering = false;
	let canvas: HTMLCanvasElement;
	let staticSrc = '';

	function openInBrowser(url: string) {
		window.open(url, '_blank')?.focus();
	}

	function captureFrame() {
		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.src = src;
		image.onload = () => {
			if (!canvas) return;
			canvas.width = image.width;
			canvas.height = image.height;
			const ctx = canvas.getContext('2d');
			ctx?.drawImage(image, 0, 0);
			staticSrc = canvas.toDataURL('image/png');
		};
	}

	onMount(() => {
		captureFrame();
	});
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="flex h-full w-full justify-center"
			on:mouseenter={() => (hovering = true)}
			on:mouseleave={() => (hovering = false)}
		>
			<img src={hovering ? src : staticSrc} {alt} class={imgClass} loading="lazy" />
		</div>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md p-4 rounded-lg shadow-lg">
		<img {src} class="max-h-[80vh] max-w-full mx-auto block" {alt} loading="lazy" />
		<Dialog.Footer class="flex justify-end space-x-4">
			<Button on:click={() => openInBrowser(src)}>Open in Browser</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<canvas bind:this={canvas} style="display: none;" />
