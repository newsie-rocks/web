import { describe, it, expect, beforeAll } from 'vitest';
import 'fake-indexeddb/auto';
import { FeedService, fetchFeedRaw, type Feed } from './feed';

describe('fetch feed', () => {
	it('fetch RSS 2.0', async () => {
		let feed = await fetchFeedRaw('https://cleantechnica.com/feed/');
		expect(feed.title).toBe('CleanTechnica');
	});

	it('fetch Atom feed', async () => {
		let feed = await fetchFeedRaw('https://jalammar.github.io/feed');
		expect(feed.title).toBe('Jay Alammar');
	});
});

describe('test FeedService', () => {
	let srv = new FeedService();

	beforeAll(async () => {
		await srv.init();
	});

	it('addFeed, removeFeed', async () => {
		const feed = await srv.addFeed('https://cleantechnica.com/feed/');
		expect(feed?.url).toBe('https://cleantechnica.com/feed/');

		await srv.removeFeed(feed.id);
	});

	it('addFeed, refreshFeeds', async () => {
		const feed = await srv.addFeed('https://cleantechnica.com/feed/');
		const feed2 = await srv.addFeed('https://jalammar.github.io/feed');
		await srv.refreshFeeds();
	});
});
