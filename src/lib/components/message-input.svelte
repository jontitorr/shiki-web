<script lang="ts">
	import type { FilePreview } from '$lib/gateway/stores';
	import { cn } from '$lib/utils';
	import { Plus } from 'lucide-svelte';
	import ImagePreview from './image-preview.svelte';
	import { Label } from './ui/label';

	export let onSubmit: (text: string) => void;
	export let placeholder: string;
	export let files: FilePreview[];
	export let onAddFiles: (files: FilePreview[]) => void;

	let inputText = '';
	let textareaRows = 1;
	let previewEnabled = false;

	function onFilesChanged(e: Event) {
		const target = e.target as HTMLInputElement;
		onAddFiles(
			Array.from(target.files ?? []).map((file) => {
				return {
					name: file.name,
					url: URL.createObjectURL(file),
					isMedia: file['type'].split('/')[0] === 'image'
				};
			})
		);
	}

	$: {
		previewEnabled = (files?.length ?? 0) > 0;
		textareaRows = Math.min(inputText.split('\n').length, 10);
	}
</script>

<div class="flex flex-col w-full">
	<ImagePreview previews={files} />
	<div
		class={cn(
			'flex flex-row',
			previewEnabled && 'border-t-[1px] border-gray-300 dark:border-zinc-700'
		)}
	>
		<div
			class={cn(
				'flex flex-row justify-center items-center w-[48px] bg-gray-200 dark:bg-zinc-900 rounded-tl-md rounded-bl-md',
				previewEnabled && 'rounded-tl-none rounded-tr-none'
			)}
		>
			<Label for="files">
				<div
					class="flex justify-center items-center rounded-full bg-gray-100 dark:bg-zinc-500 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-400"
				>
					<Plus color="black" class="w-5 h-5" />
				</div>
			</Label>
			<input multiple id="files" type="file" class="hidden" on:change={onFilesChanged} />
		</div>
		<textarea
			class={cn(
				'w-full px-4 py-2 text-sm bg-gray-200 dark:bg-zinc-900 rounded-tr-md rounded-br-md focus:outline-none text-black dark:text-white resize-none',
				previewEnabled && 'rounded-tl-none rounded-tr-none'
			)}
			rows={textareaRows}
			bind:value={inputText}
			{placeholder}
			on:keydown={(e) => {
				const text = inputText.trim();

				if (e.key === 'Enter') {
					if (e.shiftKey) {
						return;
					}

					if (!text) {
						e.preventDefault();
						return;
					}
				}

				if (e.key !== 'Enter' || e.shiftKey || !text) {
					return;
				}

				e.preventDefault();
				onSubmit(text);
				inputText = '';
			}}
		/>
	</div>
</div>
