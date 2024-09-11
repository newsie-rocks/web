import Parser from 'rss-parser';
import { v4 as uuidv4 } from 'uuid';
import xmlBuilder from 'xmlbuilder';
import { IndexedDBService } from './db';

/**
 * A feed
 */
export interface Feed {
	id: string;
	name?: string;
	url: string;
	title?: string;
	description?: string;
	image?: {
		link?: string;
		url: string;
		title?: string;
	};
	folderId?: string;
	posts?: Post[];
}

/**
 * A feed post
 */
export interface Post {
	id: string;
	link?: string;
	guid?: string;
	title?: string;
	pubDate?: string;
	creator?: string;
	summary?: string;
	content?: string;
	isoDate?: string;
	categories?: string[];
	contentSnippet?: string;
}

/**
 * A raw feed response
 */
type RawFeed = Parser.Output<{}>;

/**
 * Feed service
 * @param url
 * @returns
 */
export class FeedService {
	private db: IndexedDBService;
	private parser: Parser;

	constructor() {
		this.db = IndexedDBService.getInstance();
		this.parser = new Parser();
	}

	async init() {
		await this.db.initDB();
	}

	/**
	 * Adds a new feed
	 */
	async addFeed(feedInput: { name: string; url: string }): Promise<Feed> {
		// console.log('Feed added:', feedInput);
		// parse feed
		// https://longform.asmartbear.com/index.xml
		const encodedUrl = encodeURIComponent(feedInput.url);
		const response = await fetch(`/api/feeds?feedUrl=${encodedUrl}`);
		const text = await response.text();
		const rawFeed = await this.parser.parseString(text);

		// create feed object
		let feed = {
			id: uuidv4(),
			url: rawFeed.feedUrl || '__',
			title: rawFeed.title,
			description: rawFeed.description,
			image: rawFeed.image
				? {
						link: rawFeed.image.link,
						url: rawFeed.image.url,
						title: rawFeed.image.title
					}
				: undefined,
			posts: rawFeed.items.map((item) => {
				const id = uuidv4();
				return {
					id,
					link: item.link,
					guid: item.guid,
					title: item.title,
					pubDate: item.pubDate,
					creator: item.creator,
					summary: item.summary,
					content: item.content,
					isoDate: item.isoDate,
					categories: item.categories,
					contentSnippet: item.contentSnippet
				};
			})
		};
		// console.log(feed);

		// add to indexedDB
		let dbFeed = await this.getFeedByUrl(feed.url);
		if (!!dbFeed) {
			throw new Error('Feed already exists');
		}
		return new Promise((resolve, reject) => {
			let trx = this.db.getDB().transaction('feeds', 'readwrite');
			let store = trx.objectStore('feeds');
			let request = store.add(feed);
			request.onsuccess = () => {
				resolve(feed);
			};
			request.onerror = (e) => {
				console.error(e);
				reject(new Error('Error inserting feed'));
			};
		});
	}

	/**
	 * Checks if a feed with the given URL exists
	 * @param url The URL of the feed to check
	 * @returns A promise that resolves to true if the feed exists, false otherwise
	 */
	async getFeedByUrl(url: string): Promise<Feed> {
		return new Promise((resolve, reject) => {
			let trx = this.db.getDB().transaction('feeds', 'readonly');
			let store = trx.objectStore('feeds');
			let index = store.index('url'); // Assuming 'link' is indexed
			let request = index.get(url);
			request.onsuccess = () => {
				resolve(request.result);
			};
			request.onerror = (e) => {
				console.error(e);
				reject(new Error('Error checking feed existence'));
			};
		});
	}

	/**
	 * Retrieves all feeds from the IndexedDB
	 * @returns A promise that resolves to an array of all feeds
	 */
	async getAllFeeds(): Promise<Feed[]> {
		return new Promise((resolve, reject) => {
			let trx = this.db.getDB().transaction('feeds', 'readonly');
			let store = trx.objectStore('feeds');
			let request = store.openCursor();
			let feeds: Feed[] = [];

			request.onsuccess = (event) => {
				let cursor = event.target.result;
				if (cursor) {
					feeds.push(cursor.value);
					cursor.continue();
				} else {
					resolve(feeds);
				}
			};

			request.onerror = (e) => {
				console.error(e);
				reject(new Error('Error retrieving feeds'));
			};
		});
	}

	/**
	 * Removes all the feeds
	 */
	async removeAllFeeds(): Promise<void> {
		return new Promise((resolve, reject) => {
			let trx = this.db.getDB().transaction('feeds', 'readwrite');
			let store = trx.objectStore('feeds');
			let request = store.clear();
			request.onsuccess = () => {
				resolve();
			};
			request.onerror = (e) => {
				console.error(e);
				reject(new Error('Error clearing feeds'));
			};
		});
	}
}
