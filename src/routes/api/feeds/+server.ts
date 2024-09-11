/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const feedUrl = url.searchParams.get('feedUrl');
	if (!feedUrl) {
		return new Response('Feed URL is required', { status: 400 });
	}
	try {
		const response = await fetch(feedUrl);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.text();
		return new Response(data, {
			headers: { 'Content-Type': 'application/rss+xml' }
		});
	} catch (error) {
		return new Response('Failed to fetch feed', { status: 500 });
	}
}
