/**
 * @module db
 *
 * Local DB management
 */

/**
 * DB name
 */
const APP_DB = 'app-db';

/**
 * A feed in DB
 */
export interface DbFeed {
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
	// those are the articles ids
	articles: string[];
}

/**
 * A feed article in DB
 */
export interface DbArticle {
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
 * A feed folder type in DB
 */
export interface DbFolder {
	id: string;
	name?: string;
}

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
				if (!db.objectStoreNames.contains('folders')) {
					let store = db.createObjectStore('folders', { keyPath: 'id' });
				}
				if (!db.objectStoreNames.contains('articles')) {
					let store = db.createObjectStore('articles', { keyPath: 'id' });
				}
				if (!db.objectStoreNames.contains('users')) {
					let store = db.createObjectStore('users', { keyPath: 'id' });
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

	/**
	 * Removes a feed by ID
	 */
	async deleteFeed(id: string): Promise<void> {
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
	 * Removes all feeds
	 */
	async deleteAllFeeds(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}

			let trx = this.db.transaction('feeds', 'readwrite');
			let store = trx.objectStore('feeds');
			let request = store.clear();
			request.onsuccess = () => {
				resolve();
			};
			request.onerror = () => {
				reject(new Error('Error removing feeds'));
			};
		});
	}

	/**
	 * Inserts a folder
	 */
	async insertFolder(folder: Folder): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}

			let trx = this.db.transaction('folders', 'readwrite');
			let store = trx.objectStore('folders');
			let request = store.add(folder);
			request.onsuccess = () => {
				resolve();
			};
			request.onerror = () => {
				reject(new Error('Error inserting folder'));
			};
		});
	}

	/**
	 * Updates a folder
	 */
	async updateFolder(folder: Folder): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}

			let trx = this.db.transaction('folders', 'readwrite');
			let store = trx.objectStore('folders');
			let request = store.put(folder);
			request.onsuccess = () => {
				resolve();
			};
			request.onerror = () => {
				reject(new Error('Error updating folder'));
			};
		});
	}

	/**
	 * Gets all folders
	 */
	async getAllFolders(): Promise<Folder[]> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}
			let trx = this.db.transaction('folders', 'readonly');
			let store = trx.objectStore('folders');

			let folders: Folder[] = [];
			let request = store.openCursor();
			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
				if (cursor) {
					folders.push(cursor.value);
					cursor.continue();
				} else {
					resolve(folders);
				}
			};
			request.onerror = () => {
				reject(new Error('Error getting all folders'));
			};
		});
	}

	/**
	 * Deletes a folder
	 */
	async deleteFolder(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}

			let trx = this.db.transaction('folders', 'readwrite');
			let store = trx.objectStore('folders');
			let request = store.delete(id);
			request.onsuccess = () => {
				resolve();
			};
			request.onerror = () => {
				reject(new Error('Error removing folder'));
			};
		});
	}

	/**
	 * Inserts articles
	 */
	async insertArticles(articles: Article[]): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}

			let trx = this.db.transaction('articles', 'readwrite');
			let store = trx.objectStore('articles');
			articles.forEach((article) => {
				store.add(article);
			});
			trx.oncomplete = () => {
				resolve();
			};
			trx.onerror = () => {
				reject(new Error('Error inserting articles'));
			};
		});
	}

	/**
	 * Updates articles
	 */
	async updateArticles(articles: Article[]): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				throw new Error('Database not initialized');
			}

			let trx = this.db.transaction('articles', 'readwrite');
			let store = trx.objectStore('articles');
			articles.forEach((article) => {
				store.put(article);
			});
			trx.oncomplete = () => {
				resolve();
			};
			trx.onerror = () => {
				reject(new Error('Error updating articles'));
			};
		});
	}
}
