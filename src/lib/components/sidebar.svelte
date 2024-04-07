<script lang="ts">
	import { token } from '$lib/auth';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Dialog from '$lib/components/ui/dialog';
	import { createChannel } from '$lib/gateway/api';
	import { cn } from '$lib/utils';
	import { ChevronDown, HashIcon, Plus } from 'lucide-svelte';
	import type { SidebarItem } from '../../types/sidebar';
	import ChannelItem from './channel-item.svelte';
	import { Button } from './ui/button';
	import { Input } from './ui/input';
	import { Label } from './ui/label';

	export let items: SidebarItem[];
	export let onItemClick: (item: SidebarItem) => void;
	export let selectedItem: SidebarItem | null;

	let channelName = '';
	let collapsibleOpen = true;
	let hovered = false;
	let newChannelDialogOpen = false;

	async function onCreateChannel() {
		if (!$token) {
			return;
		}

		await createChannel($token, channelName);
		newChannelDialogOpen = false;
	}
</script>

<div class="flex flex-col bg-gray-300 dark:bg-zinc-800" style="min-width: -webkit-fill-available;">
	<div
		class="flex items-center h-[48px] px-[10px]"
		style="box-shadow: 0 1px 0 hsl( 0 calc( 1 * 0%) 0.8% / 0.2), 0 1.5px 0 hsl( 240 calc( 1 * 7.7%) 2.5% / 0.05), 0 2px 0 hsl( 0 calc( 1 * 0%) 0.8% / 0.05);"
	>
		<button
			type="button"
			class="bg-zinc-900 dark:bg-zinc-900 rounded-sm text-sm h-[28px] overflow-hidden text-ellipsis whitespace-nowrap w-full text-left px-[6px] py-[1px]"
			style="color: hsl( 214 calc( 1 * 8.1%) 61.2% / 1)">Find or start a conversation</button
		>
	</div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class={cn('overflow-y-auto flex-grow overflow-x-hidden', {
			'scrollbar-hide': !hovered
		})}
		on:mouseenter={() => (hovered = true)}
	>
		<div class="flex flex-col justify-center items-center gap-2">
			<div class="w-full flex flex-row justify-between gap-2 p-1">
				<button on:click={() => (collapsibleOpen = !collapsibleOpen)}>
					<div class="flex flex-row flex-grow justify-start items-center">
						<ChevronDown
							class={cn(
								'w-4 h-4 transition-transform duration-200',
								collapsibleOpen && '-rotate-90'
							)}
						/>
						<p class="font-bold text-sm leading-4">Text Channels</p>
					</div>
				</button>
				<Dialog.Root bind:open={newChannelDialogOpen}>
					<Dialog.Trigger>
						<Plus class="w-4 h-4" />
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Create Channel</Dialog.Title>
							<Dialog.Description>in Text Channels</Dialog.Description>
						</Dialog.Header>
						<div class="flex flex-col justify-center items-start gap-2">
							<Label for="channel-name">Channel Name</Label>
							<div class="flex flex-row items-center gap-2">
								<HashIcon class="w-4 h-4" />
								<Input id="channel-name" placeholder="new-channel" bind:value={channelName} />
							</div>
						</div>
						<Dialog.Footer>
							<Button
								class="bg-indigo-500 hover:bg-indigo-600"
								variant="ghost"
								disabled={channelName.length === 0}
								on:click={onCreateChannel}
							>
								Create Channel</Button
							>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>
			<Collapsible.Root bind:open={collapsibleOpen} class="w-full">
				{#if selectedItem && !collapsibleOpen}
					<ChannelItem
						id={selectedItem.id}
						name={selectedItem.name}
						clicked
						onClick={() => {
							selectedItem && onItemClick(selectedItem);
						}}
					>
						<svelte:component this={selectedItem.icon} />
					</ChannelItem>
					<div aria-hidden="true" style="height: 2px;" />
				{/if}
				<Collapsible.Content transitionConfig={{ duration: 0 }}>
					<div class="flex flex-col justify-center gap-[2px]">
						{#each items as item}
							<ChannelItem
								id={item.id}
								name={item.name}
								clicked={selectedItem?.id === item.id}
								onClick={() => {
									onItemClick(item);
								}}
							>
								<svelte:component this={item.icon} />
							</ChannelItem>
						{/each}
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		</div>
	</div>
</div>
