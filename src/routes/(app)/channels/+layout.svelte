<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { token } from '$lib/auth';
	import Sidebar from '$lib/components/sidebar.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import { GatewayClient } from '$lib/gateway';
	import { fetchChannels, fetchMessages } from '$lib/gateway/api';
	import {
		channelStore,
		currentSidebarItem,
		filePreviewStore,
		messageStore
	} from '$lib/gateway/stores';
	import { cn } from '$lib/utils';
	import { HashIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { Guild, SidebarItem } from '../../../types/sidebar';

	let guilds: Guild[] = [
		{
			id: BigInt(0),
			name: 'Home',
			icon: 'https://cdn.discordapp.com/embed/avatars/0.png'
		},
		{
			id: BigInt(1),
			name: 'Global'
		}
	];
	let selectedGuild: Guild | null = null;
	let activeGuild: Guild | null = null;
	let sidebarItems: SidebarItem[] = [];
	let gatewayClient: GatewayClient | null = null;

	onMount(() => {
		(async () => {
			if (!$token) {
				return goto('/login');
			}

			const { slug } = $page.params;
			const channels =
				(await fetchChannels($token, () => Object.entries($channelStore).length > 0)) ||
				Object.values($channelStore);

			const item = channels.find((item) => item.id.toString() === slug);

			if (!item) {
				return goto('/channels');
			}

			currentSidebarItem.set({
				id: item.id,
				name: item.name,
				icon: HashIcon
			});

			$filePreviewStore[item.id.toString()] = [];
			fetchMessages(item.id, $token, (channelId) => {
				return Object.keys($messageStore).includes(channelId.toString());
			});

			gatewayClient = new GatewayClient($token);
		})();

		return () => {
			gatewayClient?.close();
			gatewayClient = null;
		};
	});

	$: {
		sidebarItems = Object.values($channelStore).map((item) => {
			return {
				id: item.id,
				name: item.name,
				icon: HashIcon,
				messages: []
			};
		});
	}

	async function onItemClick(item: SidebarItem) {
		if (!$token) {
			return goto('/login');
		}

		if ($currentSidebarItem?.id === item.id) {
			return;
		}

		currentSidebarItem.set(item);
		if (!$filePreviewStore[item.id.toString()]) {
			$filePreviewStore[item.id.toString()] = [];
		}
		// TODO: Prevent unnecessary fetches
		await fetchMessages(item.id, $token, (channelId) => {
			return Object.keys($messageStore).includes(channelId.toString());
		});
		goto(`/channels/${item.id}`);
	}
</script>

<div class="flex min-h-screen flex-row">
	<nav class="w-[72px] bg-zinc-900 overflow-y-auto flex-shrink-0">
		<div class="scroller overflow-auto h-[100vh] scrollbar-hide">
			<div class="servers">
				{#each guilds as guild}
					<div class="flex flex-row justify-center items-center mb-2 relative">
						<div class="w-[8px] h-[48px] absolute left-0 flex items-center justify-start">
							<div
								class={cn('pill transition-all', {
									active: guild === activeGuild,
									selected: guild === selectedGuild
								})}
							/>
						</div>
						<button
							class={cn(
								'w-[48px] h-[48px] rounded-[50%] overflow-hidden transition-[border-radius] duration-200 hover:rounded-[25%]',
								{
									'rounded-[25%]': guild === selectedGuild
								}
							)}
							class:selected={selectedGuild === guild}
							on:click={() => (selectedGuild = guild)}
							on:keydown={() => (selectedGuild = guild)}
							on:mouseenter={() => (activeGuild = guild)}
							on:mouseleave={() => (activeGuild = null)}
						>
							{#if guild.icon}
								<img src={guild.icon} alt={guild.name} />
							{:else}
								<div class="w-full h-full bg-blue-600 flex justify-center items-center">
									<span class="text-2xl">{guild.name[0]}</span>
								</div>
							{/if}
						</button>
					</div>
				{/each}
			</div>
		</div>
	</nav>
	<Resizable.PaneGroup
		direction="horizontal"
		class={cn('border', {
			// 'max-w-[240px]': $currentSidebarItem === null
		})}
		style="min-height:inherit"
	>
		<Resizable.Pane minSize={20} defaultSize={20} class="flex">
			<Sidebar items={sidebarItems} {onItemClick} selectedItem={$currentSidebarItem} />
		</Resizable.Pane>
		{#if $currentSidebarItem}
			<Resizable.Handle />
			<Resizable.Pane minSize={20} defaultSize={80} class="flex">
				<slot />
			</Resizable.Pane>
		{/if}
	</Resizable.PaneGroup>
</div>

<style>
	/* For Webkit-based browsers (Chrome, Safari and Opera) */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* For IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.pill {
		width: 4px;
		height: 0;
		background-color: white;
		border-radius: 0 4px 4px 0;
		transform-origin: left;
		transition: transform 0.2s, height 0.2s;
		transform: scaleX(0);
	}

	.pill.active {
		height: 20px;
		transform: scaleX(1);
	}

	.pill.selected {
		height: 40px;
		transform: scaleX(1);
	}
</style>
