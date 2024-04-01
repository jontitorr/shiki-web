import { PUBLIC_BACKEND_URL } from '$env/static/public';
import {
	channelStore,
	filePreviewStore,
	messageStore,
	type FilePreview
} from '$lib/gateway/stores';
import JSONbig from 'json-bigint';
import {
	deserializeChannel,
	deserializeMessage,
	type Channel,
	type Message
} from '../../types/sidebar';

export const addFiles = async (channelId: bigint, files: FilePreview[]) => {
	filePreviewStore.update((store) => {
		store[channelId.toString()]
			.filter((x) => !files.includes(x))
			.forEach((x) => URL.revokeObjectURL(x.url));
		store[channelId.toString()] = files;
		return store;
	});
};

export const createChannel = async (token: string, name: string): Promise<Channel | null> => {
	try {
		const res = await fetch(`${PUBLIC_BACKEND_URL}/api/channels`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name })
		});

		const data = JSONbig.parse(await res.text());

		channelStore.update((store) => {
			store[data.id.toString()] = data;
			return store;
		});

		return data;
	} catch (error) {
		console.error(`Could not create channel: ${error}`);
		return null;
	}
};

export const fetchChannels = async (
	token: string,
	fetchedBefore: () => boolean
): Promise<Channel[]> => {
	if (fetchedBefore()) {
		return [];
	}

	try {
		const res = await fetch(`${PUBLIC_BACKEND_URL}/api/channels`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const data = JSONbig.parse(await res.text());
		const channels = data.map((item: unknown) => {
			return deserializeChannel(item);
		});

		console.log(`Fetched ${channels.length} channels`);

		channelStore.update((store) => {
			channels.forEach((channel: Channel) => {
				store[channel.id.toString()] = channel;
			});

			return store;
		});

		return channels;
	} catch (error) {
		console.error(`Could not fetch channels: ${error}`);
		return [];
	}
};

export const fetchMessages = async (
	channelId: bigint,
	token: string,
	fetchedBefore: (channelId: bigint) => boolean
): Promise<Message[]> => {
	if (fetchedBefore(channelId)) {
		return [];
	}

	try {
		const res = await fetch(`${PUBLIC_BACKEND_URL}/api/channels/${channelId}/messages`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const data = JSONbig.parse(await res.text());
		const messages = data.map((item: unknown) => {
			return deserializeMessage(item);
		});

		console.log(`Fetched ${messages.length} messages for channel ${channelId}`);

		messageStore.update((store) => {
			store[channelId.toString()] = messages;
			return store;
		});

		return messages;
	} catch (error) {
		console.error(`Could not fetch messages: ${error}`);
		return [];
	}
};

export const sendMessage = async (channelId: bigint, content: string, token: string) => {
	try {
		await fetch(`${PUBLIC_BACKEND_URL}/api/channels/${channelId}/messages`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content })
		});
	} catch (error) {
		console.error(`Could not send message: ${error}`);
	}
};
