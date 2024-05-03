/**
 * @module db
 *
 * Local DB management
 */

import { type Feed } from './feed';

/**
 * DB name
 */
const APP_DB = 'app-db';

/**
 * DB service
 */
export class DbService {
	/**
	 * Private DB handle
	 */
	private db: IDBDatabase | null = null;

	/**
	 * Instantiate the DB service
	 * @throws {Error} - Throws an error if IndexedDB is not supported, or if the DB cannot be opened
	 */
	async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (indexedDB === undefined) {
				throw new Error('IndexedDB is not supported');
			}

			const request = indexedDB.open(APP_DB);
			request.onerror = () => {
				reject(new Error('Error opening database'));
			};
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};
			request.onupgradeneeded = (event) => {
				// Here you can create object stores, indexes etc.
				let db = request.result;
				if (!db.objectStoreNames.contains('feeds')) {
					let store = db.createObjectStore('feeds', { keyPath: 'id' });
					store.createIndex('url', 'url', { unique: true });
				}
			};
		});
	}

	/**
	 * Adds a feed to the DB
	 * @param url feed URL
	 */
	async insertFeed(feed: Feed): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}

			let trx = this.db.transaction('feeds', 'readwrite');
			let store = trx.objectStore('feeds');
			let request = store.add(feed);
			request.onsuccess = () => {
				resolve();
			};
			request.onerror = () => {
				reject(new Error('Error inserting feed'));
			};
		});
	}

	/**
	 * Retrieves a specific feed by url
	 * @param url feed URL
	 * @returns Promise that resolves with the feed object if found, or null if not found
	 */
	async getFeedByUrl(url: string): Promise<Feed | null> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}
			let trx = this.db.transaction('feeds', 'readonly');
			let store = trx.objectStore('feeds');

			let index = store.index('url');
			let request = index.get(url);
			request.onsuccess = () => {
				resolve(request.result);
			};
			request.onerror = () => {
				reject(new Error('Error getting feed'));
			};
		});
	}

	/**
	 * Removes a feed by ID
	 */
	async removeFeed(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}
			let trx = this.db.transaction('feeds', 'readwrite');
			let store = trx.objectStore('feeds');

			let request = store.delete(id);
			request.onsuccess = () => {
				resolve();
			};
			request.onerror = () => {
				reject(new Error('Error removing feed'));
			};
		});
	}

	/**
	 * Get all the feeds
	 */
	async getAllFeeds(): Promise<Feed[]> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}
			let trx = this.db.transaction('feeds', 'readonly');
			let store = trx.objectStore('feeds');

			let feeds: Feed[] = [];
			let request = store.openCursor();
			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
				if (cursor) {
					feeds.push(cursor.value);
					cursor.continue();
				} else {
					resolve(feeds);
				}
			};
			request.onerror = () => {
				reject(new Error('Error getting all feeds'));
			};
		});
	}
}
