/**
 * IndexedDB service
 */
export class IndexedDBService {
	private static instance: IndexedDBService;
	private db: IDBDatabase;

	private constructor() {}

	static getInstance(): IndexedDBService {
		if (!IndexedDBService.instance) {
			IndexedDBService.instance = new IndexedDBService();
		}
		return IndexedDBService.instance;
	}

	async initDB(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open('app-db', 1);

			request.onerror = () => {
				reject(new Error('Error opening database'));
			};

			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = request.result;
				if (!db.objectStoreNames.contains('feeds')) {
					const store = db.createObjectStore('feeds', { keyPath: 'id' });
					store.createIndex('url', 'url', { unique: true });
				}
			};
		});
	}

	getDB(): IDBDatabase {
		if (!this.db) {
			throw new Error('Database not initialized');
		}
		return this.db;
	}
}
