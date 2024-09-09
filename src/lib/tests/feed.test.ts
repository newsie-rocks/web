import { describe, it, expect, beforeAll } from 'vitest';
import 'fake-indexeddb/auto';
import { FeedService, fetchFeedRaw, type Feed } from '../feed';

describe('fetchRawfeed', () => {
	it.concurrent('fetch RSS 2.0', async () => {
		let feed = await fetchFeedRaw('https://cleantechnica.com/feed/');
		expect(feed.title).toBe('CleanTechnica');
	});

	it.concurrent('fetch Atom feed', async () => {
		let feed = await fetchFeedRaw('https://jalammar.github.io/feed');
		expect(feed.title).toBe('Jay Alammar');
	});
});

describe('test FeedService', () => {
	let srv = new FeedService();

	beforeAll(async () => {
		await srv.init();
	});

	it('addFeed', async () => {
		let feed = await srv.addFeed('https://cleantechnica.com/feed/');
		expect(feed?.url).toBe('https://cleantechnica.com/feed/');

		feed = await srv.addFeed('https://jalammar.github.io/feed');
		expect(feed?.url).toBe('http://jalammar.github.io/feed.xml');
	});

	it('refreshFeeds', async () => {
		await srv.refreshFeeds();
	});

	it('removeAllFeeds', async () => {
		await srv.removeAllFeeds();
	});

	it('exportFeeds', async () => {
		const opml = await srv.exportFeeds();
		// expect(opml).toBe('<?xml version="1.0" encoding="UTF-8"?>');
	});
});
