import { describe, it, expect, beforeAll } from 'vitest';
import 'fake-indexeddb/auto';
import { FeedService, fetchFeedRaw, type Feed } from './feed';

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

	it('exportFeeds', async () => {
		const opml = await srv.exportFeeds();
		expect(opml).toBe(
			'<?xml version="1.0"?><opml version="2.0"><head><title>My RSS Feeds</title><body><outline type="rss" text="CleanTechnica" title="CleanTechnica" xmlUrl="https://cleantechnica.com/feed/"/><outline type="rss" text="Jay Alammar" title="Jay Alammar" xmlUrl="http://jalammar.github.io/feed.xml"/></body></head></opml>'
		);
	});

	it('removeFeeds', async () => {
		await srv.removeFeeds();
	});
});
