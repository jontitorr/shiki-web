<script lang="ts">
	export let files: FileList | null;
	let previews: { name: string; url: string; isMedia: boolean }[] = [];

	$: {
		if (files && files.length > 0) {
			previews.forEach((preview) => URL.revokeObjectURL(preview.url));
			previews = Array.from(files).map((file) => {
				return {
					name: file.name,
					url: URL.createObjectURL(file),
					isMedia: file['type'].split('/')[0] === 'image'
				};
			});
		}
	}
</script>

{#if previews.length > 0}
	<div />
	<div
		class="flex justify-start items-center w-full bg-gray-200 dark:bg-zinc-900 p-4 gap-4 overflow-x-auto whitespace-nowrap scroll-smooth scrollable-section rounded-tl-sm rounded-tr-sm"
	>
		{#each previews as preview}
			<div
				class="flex flex-col justify-center items-center w-[216px] h-[216px] bg-gray-200 dark:bg-zinc-950 rounded-md"
			>
				<div class="flex justify-center items-center w-[200px] h-[144px] overflow-hidden">
					{#if preview.isMedia}
						<img
							src={preview.url}
							alt="preview of {preview.name}"
							class="rounded-sm object-cover max-w-full max-h-full"
						/>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							height="96"
							viewBox="0 0 72 96"
							width="72"
						>
							<path
								d="m72 29.3v60.3c0 2.24 0 3.36-.44 4.22-.38.74-1 1.36-1.74 1.74-.86.44-1.98.44-4.22.44h-59.2c-2.24 0-3.36 0-4.22-.44-.74-.38-1.36-1-1.74-1.74-.44-.86-.44-1.98-.44-4.22v-83.2c0-2.24 0-3.36.44-4.22.38-.74 1-1.36 1.74-1.74.86-.44 1.98-.44 4.22-.44h36.3c1.96 0 2.94 0 3.86.22.5.12.98.28 1.44.5v16.88c0 2.24 0 3.36.44 4.22.38.74 1 1.36 1.74 1.74.86.44 1.98.44 4.22.44h16.88c.22.46.38.94.5 1.44.22.92.22 1.9.22 3.86z"
								fill="#d3d6fd"
							/>
							<path
								d="m68.26 20.26c1.38 1.38 2.06 2.06 2.56 2.88.18.28.32.56.46.86h-16.88c-2.24 0-3.36 0-4.22-.44-.74-.38-1.36-1-1.74-1.74-.44-.86-.44-1.98-.44-4.22v-16.880029c.3.14.58.28.86.459999.82.5 1.5 1.18 2.88 2.56z"
								fill="#939bf9"
							/>
						</svg>
					{/if}
				</div>
				<div class="w-full px-2 text-xs text-gray-600 dark:text-zinc-300">
					<div class="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
						{preview.name}
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.scrollable-section::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.scrollable-section::-webkit-scrollbar-track {
		background: #111214;
		border-radius: 4px;
	}

	.scrollable-section::-webkit-scrollbar-thumb {
		background: #060607;
		border-radius: 4px;
	}

	.scrollable-section::-webkit-scrollbar-thumb:hover {
		background: #060607;
	}
</style>
