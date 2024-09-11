import { describe, it, expect, beforeAll } from 'vitest';
import { DbService } from '../app/db';
import 'fake-indexeddb/auto';
import { fetchFeedRaw, type Feed, type Folder } from '../feed';

describe('test DbService', () => {
	let db = new DbService();

	beforeAll(async () => {
		await db.init();
	});

	it('insertFeed', async () => {
		let feed: Feed = {
			id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
			url: 'https://cleantechnica.com/feed/',
			articles: []
		};
		await db.insertFeed(feed);
	});

	it('getFeedByUrl', async () => {
		let feed = await db.getFeedByUrl('https://cleantechnica.com/feed/');
		expect(feed?.id).toBe('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
	});

	it('getAllFeeds', async () => {
		let feeds = await db.getAllFeeds();
		expect(feeds.length).toBe(1);
	});

	it('deleteFeed', async () => {
		await db.deleteFeed('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
	});

	it('deleteAllFeeds', async () => {
		await db.deleteAllFeeds();
	});

	it('insertFolder', async () => {
		let folder: Folder = {
			id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
			name: 'My Folder'
		};
		await db.insertFolder(folder);
	});

	it('getAllFolders', async () => {
		let folders = await db.getAllFolders();
		expect(folders.length).toBe(1);
	});

	it('deleteFolder', async () => {
		await db.deleteFolder('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
	});
});
