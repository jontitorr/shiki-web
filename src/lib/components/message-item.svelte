<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Message } from '../../types/sidebar';
	import FakeLink from './fake-link.svelte';

	export let message: Message;
	export let isCompact: boolean = false;
	export let isUrl: boolean;

	let isHovered = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="flex flex-row gap-2 items-center p-1 hover:bg-gray-100 dark:hover:bg-zinc-900"
	on:mouseenter={() => (isHovered = true)}
	on:mouseleave={() => (isHovered = false)}
>
	{#if message.author.avatar && !isCompact}
		<img
			class="w-10 h-10 rounded-full object-cover"
			src={message.author.avatar}
			alt={message.author.username}
		/>
	{/if}
	<div class="flex-flex-col">
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
		{#if message.attachments && message.attachments.length > 0}
			<div class="grid grid-cols-3 gap-2 mt-2">
				{#each message.attachments as attachment}
					<a href={attachment.url} target="_blank">
						<img
							class="w-full h-full object-cover"
							src={attachment.url}
							alt={attachment.filename}
						/>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
