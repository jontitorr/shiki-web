<script lang="ts">
	import type { FilePreview } from '$lib/gateway/stores';
	import { isUrl } from '$lib/utils';
	import type { Message, SidebarItem } from '../../types/sidebar';
	import MessageInput from './message-input.svelte';
	import MessageItem from './message-item.svelte';

	export let item: SidebarItem;
	export let files: FilePreview[];
	export let messages: Message[];
	export let compactList: boolean[];
	export let onAddFiles: (files: FilePreview[]) => void;
	export let onSendMessage: (text: string) => void;

	let messageList: HTMLElement;

	const scrollToBottom = async (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'instant' });
	};

	const onSubmit = (text: string) => {
		onSendMessage(text);
		scrollToBottom(messageList);
	};
</script>

<div class="flex flex-col overflow-hidden flex-grow h-[100vh]">
	<section class="flex flex-col justify-center min-h-[48px] p-2">
		<div class="flex flex-row gap-2">
			<svelte:component this={item.icon} />
			{item.name}
		</div>
	</section>
	<section class="overflow-y-auto scrollable-section" bind:this={messageList}>
		<ul class="p-2">
			{#each messages as message, i}
				<li class="text-sm text-gray-600 dark:text-zinc-300">
					<MessageItem {message} isCompact={compactList[i]} isUrl={isUrl(message.content)} />
				</li>
			{/each}
		</ul>
	</section>
	<section class="p-4 w-full">
		<MessageInput {onSubmit} placeholder={`Message #${item.name}`} {files} {onAddFiles} />
	</section>
</div>

<style>
	.scrollable-section::-webkit-scrollbar {
		width: 8px;
	}

	.scrollable-section::-webkit-scrollbar-track {
		background: #060607;
		border-radius: 4px;
	}

	.scrollable-section::-webkit-scrollbar-thumb {
		background: #111214;
		border-radius: 4px;
	}

	.scrollable-section::-webkit-scrollbar-thumb:hover {
		background: #111214;
	}
</style>
