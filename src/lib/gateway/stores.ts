import { writable } from 'svelte/store';
import type { Channel, Message, SidebarItem } from '../../types/sidebar';

// API Resources
export const channelStore = writable<Record<string, Channel>>({});
export const messageStore = writable<Record<string, Message[]>>({});

// UI Resources
export const currentSidebarItem = writable<SidebarItem | null>(null);

export type FilePreview = { name: string; url: string; isMedia: boolean; file: File };
export const filePreviewStore = writable<Record<string, FilePreview[]>>({});
