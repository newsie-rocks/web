import { describe, it, expect, beforeAll } from 'vitest';
import { DbService } from './db';
import 'fake-indexeddb/auto';
import { fetchFeedRaw, type Feed } from './feed';

describe('test DbService', () => {
	let db = new DbService();

	beforeAll(async () => {
		await db.init();
	});

	it('insert, getFeedByUrl, delete', async () => {
		let feed: Feed = {
			id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
			url: 'https://cleantechnica.com/feed/',
			articles: []
		};
		await db.insertFeed(feed);

		let feedInDb = await db.getFeedByUrl('https://cleantechnica.com/feed/');
		expect(feedInDb?.id).toBe('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');

		await db.removeFeed('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
	});

	it('insert, getAllFeeds', async () => {
		let feed: Feed = {
			id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
			url: 'https://cleantechnica.com/feed/',
			articles: []
		};
		await db.insertFeed(feed);

		let feed2: Feed = {
			id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e',
			url: 'https://techcrunch.com/feed',
			articles: []
		};
		await db.insertFeed(feed2);

		let feeds = await db.getAllFeeds();
		expect(feeds.length).toBe(2);
	});
});
