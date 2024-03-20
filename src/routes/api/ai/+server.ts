import { CHARACTER_AI_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// TODO: Add custom types for this module.
import CharacterAI from 'node_characterai';
const characterAI = new CharacterAI();

const bingIntros = ['Hello, this is Bing.'];
const characterIds = new Map([
	['bing', ''],
	['nami', 'CPzWLN939JIlyNVKosDwU1Tc2yS3eylbMTqLfHxPYYs'],
	['discord mod', '8_1NyR8w1dOXmI1uWaieQcd147hecbdIK7CeEAIrdJw'],
	['makima', 'eGPYvuu9WnIzP4gHbkgwe3cTtqwfnLi5QUNip_q8Le4']
]);
let authenticated = false;

try {
	await characterAI.authenticateWithToken(CHARACTER_AI_TOKEN);
	authenticated = true;
} catch (error) {
	console.error(error);
}

export async function POST({ request }) {
	try {
		let { character, query } = await request.json();
		character = character.trim().toLowerCase();

		console.log({ authenticated, character, query });

		if (!authenticated && character !== 'bing') {
			return json({ error: 'Something went wrong. Please try again.' });
		}

		if (!character || typeof character !== 'string' || !character.trim()) {
			return json({ error: 'No character provided' });
		}

		const characterId = characterIds.get(character);

		if (characterId === undefined) {
			return json({ error: 'Character not found' });
		}

		if (!query || typeof query !== 'string' || !query.trim()) {
			return json({ error: 'No query provided' });
		}

		query = query.trim();
		console.log(`Asking ${character} about ${query}`);

		if (character === 'bing') {
			return callBing(query);
		}

		return callCharacter(characterId, query);
	} catch (error) {
		return json({ error });
	}
}

async function callBing(query: string) {
	const url = new URL('https://api.freegpt4.ddns.net');
	url.searchParams.append('text', query);

	try {
		const res = await fetch(url);
		const body = await res.text();

		if (!res.ok || !body) {
			return json({ error: 'No response from server' });
		}

		console.log({ body });

		for (const intro of bingIntros) {
			if (body.startsWith(intro)) {
				return json({ response: body.replace(intro, '') });
			}
		}

		return json({ text: body });
	} catch (error) {
		console.log({ error });
		return json({ error: 'Server error' });
	}
}

async function callCharacter(characterId: string, query: string) {
	const chat = await characterAI.createOrContinueChat(characterId);
	const res = await chat.sendAndAwaitResponse(query, true);

	console.log({ res });

	if (!res) {
		return json({ error: 'No response from server' });
	}

	return json({
		text: res.text,
		image: `https://characterai.io/i/80/static/avatars/${res.srcAvatarFileName}`
	});
}
