<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Attachment, Message } from '../../types/sidebar';
	import FakeLink from './fake-link.svelte';
	import Image from './image.svelte';

	export let message: Message;
	export let isCompact: boolean = false;
	export let isUrl: boolean;

	let isHovered = false;
	let layoutInfo: {
		attachments: Attachment[];
	}[] = [];

	if (message.attachments?.length) {
		let remainingAttachments = message.attachments;

		while (remainingAttachments.length > 0) {
			let numImages;

			if (remainingAttachments.length <= 3) {
				numImages = remainingAttachments.length;
			} else {
				numImages = Math.min(3, Math.ceil(Math.sqrt(remainingAttachments.length)));
			}

			layoutInfo.push({
				attachments: remainingAttachments.slice(0, numImages)
			});

			remainingAttachments = remainingAttachments.slice(numImages);
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="flex flex-row gap-2 items-center p-1 hover:bg-gray-100 dark:hover:bg-zinc-900"
	on:mouseenter={() => (isHovered = true)}
	on:mouseleave={() => (isHovered = false)}
>
	{#if !isCompact}
		<img
			class="w-10 h-10 rounded-full object-cover"
			src={message.author.avatar ?? 'https://cdn.discordapp.com/embed/avatars/0.png'}
			alt={message.author.username}
		/>
	{/if}
	<div class="flex flex-col gap-1">
		{#if !isCompact}
			<div class="flex flex-row gap-2">
				<p class="font-bold">{message.author.username}</p>
				<p class="text-gray-400 text-[12px]">{new Date(message.createdAt).toLocaleString()}</p>
			</div>
			{#if isUrl}
				<FakeLink href={message.content} />
			{:else}
				<p>{message.content}</p>
			{/if}
		{:else}
			<div class="flex flex-row items-center gap-2">
				<p class={cn('text-[10px] opacity-0', isHovered && 'opacity-100')}>
					{new Date(message.createdAt).toLocaleTimeString([], {
						hour: 'numeric',
						minute: '2-digit'
					})}
				</p>
				{#if isUrl}
					<FakeLink href={message.content} />
				{:else}
					<p>{message.content}</p>
				{/if}
			</div>
		{/if}
		<div
			class={cn(
				'flex gap-2',
				message.attachments?.length ?? 0 % 2 === 0 ? 'flex-col' : 'flex-row',
				{
					'ml-12': isCompact
				}
			)}
		>
			{#each layoutInfo as layout}
				{#if layout.attachments.length == 1}
					<Image
						src={layout.attachments[0].url}
						alt={layout.attachments[0].filename}
						imgClass="object-cover max-h-[350px]"
					/>
				{:else}
					<div
						class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] auto-rows-auto gap-2 h-full"
					>
						{#each layout.attachments as attachment}
							<Image
								src={attachment.url}
								alt={attachment.filename}
								imgClass="object-cover max-h-[350px]"
							/>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
