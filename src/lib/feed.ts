import { todo } from './util';
import Parser from 'rss-parser';
import { v4 as uuidv4 } from 'uuid';
import { DbService } from './db';
import xmlBuilder from 'xmlbuilder';

/**
 * A raw feed response
 */
export type FeedRaw = Parser.Output<{}>;

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
	articles: string[];
}

/**
 * A feed article
 */
export interface Article {
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
 * A feed folder type
 */
export interface Folder {
	id: string;
	name?: string;
}

/**
 * Fetches a raw feed
 */
export async function fetchFeedRaw(url: string): Promise<FeedRaw> {
	let parser = new Parser();
	let feed = await parser.parseURL(url);
	return feed;
}

/**
 * A class to manage feeds
 */
export class FeedService {
	/**
	 * DB service
	 */
	private db: DbService = new DbService();

	/**
	 * Initializes the feed service
	 */
	async init(): Promise<void> {
		await this.db.init();
	}

	/**
	 * Fetches a feed
	 *
	 * NOTE: the feed ID is set to a dummy value
	 */
	private async fetchFeed(url: string): Promise<Feed> {
		let rawFeed = await fetchFeedRaw(url);
		let feed = {
			id: '__DUMMY__',
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
			articles: rawFeed.items.map((item) => {
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
		return feed;
	}

	/**
	 * Adds a new feed to the service
	 */
	async addFeed(url: string, opts?: { name?: string; folderId?: string }): Promise<Feed> {
		// first, we check if the feed already exists in the DB
		let feedInDb = await this.db.getFeedByUrl(url);
		if (feedInDb) {
			return feedInDb;
		}

		// else, we fetch and insert the feed in DB
		let feed = await this.fetchFeed(url);
		feed.id = uuidv4();
		feed.name = opts?.name || undefined;
		feed.folderId = opts?.folderId || undefined;

		await this.db.insertFeed(feed);
		return feed;
	}

	/**
	 * Removes a feed by ID
	 */
	async removeFeed(feedId: string): Promise<void> {
		await this.db.deleteFeed(feedId);
	}

	/**
	 * Removes all feeds
	 */
	async removeAllFeeds(): Promise<void> {
		await this.db.deleteAllFeeds();
	}

	/**
	 * Refreshes all the feeds
	 */
	async refreshFeeds(): Promise<void> {
		const feeds = await this.db.getAllFeeds();
		const refreshes = [];
		for (const feed of feeds) {
			const refresh = this.fetchFeed(feed.url);
			refreshes.push(refresh);
		}
		await Promise.all(refreshes);
	}

	/**
	 * Exports all feeds to OPML format
	 */
	async exportFeeds(): Promise<string> {
		const feeds = await this.db.getAllFeeds();

		let opml = xmlBuilder
			.create('opml', { version: '1.0' })
			.att('version', '2.0')
			.ele('head')
			.ele('title', 'My RSS Feeds')
			.up()
			.ele('body');

		for (const feed of feeds) {
			opml = opml
				.element('outline', {
					type: 'rss',
					text: feed.title,
					title: feed.title,
					xmlUrl: feed.url
				})
				.up();
		}

		return opml.end({ pretty: false });
	}

	/**
	 * Import an OPML file
	 */
	async importFeeds(opml: string): Promise<void> {
		todo('importFeeds');
	}

	/**
	 * Marks an article as read
	 */
	async markArticleAsRead(articleId: string): Promise<void> {
		todo('markArticleAsRead');
	}

	/**
	 * Marks an article as unread
	 */
	async markArticleAsUnread(articleId: string): Promise<void> {
		todo('markArticleAsUnread');
	}
}
