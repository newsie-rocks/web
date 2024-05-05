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
	url: string;
	title?: string;
	description?: string;
	image?: {
		link?: string;
		url: string;
		title?: string;
	};
	articles: Article[];
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
	 * Instantiate the feed service
	 */
	async init(): Promise<void> {
		await this.db.init();
	}

	/**
	 * Fetches a feed
	 */
	private async fetchFeed(url: string, id: string): Promise<Feed> {
		let rawFeed = await fetchFeedRaw(url);
		let feed = {
			id: id,
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
	async addFeed(url: string): Promise<Feed> {
		// first, we check if the feed already exists in the DB
		let feedInDb = await this.db.getFeedByUrl(url);
		if (feedInDb) {
			return feedInDb;
		}

		// else, we fetch and insert the feed in DB
		let id = uuidv4();
		let feed = await this.fetchFeed(url, id);

		await this.db.insertFeed(feed);
		return feed;
	}

	/**
	 * Removes a feed by ID
	 */
	async removeFeed(id: string): Promise<void> {
		await this.db.removeFeed(id);
	}

	/**
	 * Removes all feeds
	 */
	async removeFeeds(): Promise<void> {
		await this.db.removeFeeds();
	}

	/**
	 * Refreshes all the feeds
	 */
	async refreshFeeds(): Promise<void> {
		const feeds = await this.db.getAllFeeds();
		const refreshes = [];
		for (const feed of feeds) {
			const refresh = this.fetchFeed(feed.url, feed.id);
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
