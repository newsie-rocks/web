<script lang="ts">
	import { Settings, Plus } from 'lucide-svelte';
	import Logo from '../lib/icons/Logo.svelte';

	interface Feed {
		id: number;
		name: string;
		url: string;
	}

	interface Post {
		id: number;
		date: Date;
		title: string;
		summary: string;
		content: string | undefined;
	}

	interface ActiveFeed extends Feed {
		id: number;
		name: string;
		url: string;
		posts: Post[];
	}

	let feeds: Feed[] = [
		{ id: 1, name: 'Feed 1', url: 'https://example.com/feed' },
		{ id: 2, name: 'Feed 2', url: 'https://example.com/feed' }
	];

	let activeFeed: ActiveFeed = {
		id: 1,
		name: 'Feed 1',
		url: 'https://example.com/feed',
		posts: [
			{ id: 1, date: new Date(), title: 'Post 1', summary: 'Summary 1', content: 'Content 1' },
			{ id: 2, date: new Date(), title: 'Post 2', summary: 'Summary 2', content: 'Content 2' }
		]
	};

	let activePost: Post = {
		id: 1,
		date: new Date(),
		title: 'Post 1',
		summary: 'Summary 1',
		content: 'Article 1'
	};

	function addFeed() {
		console.log('feed added');
	}

	function openSettings() {
		console.log('open settings');
	}

	function openFeed(id: number) {
		console.log('open feed');
	}
</script>

<main class="main">
	<div class="col-1">
		<div class="header">
			<div class="logo">
				<Logo />
			</div>
			<div class="actions">
				<button on:click={addFeed}>
					<Plus></Plus>
				</button>
				<button on:click={openSettings}>
					<Settings></Settings>
				</button>
			</div>
		</div>
		<div class="list">
			{#each feeds as feed}
				<button on:click={() => openFeed(feed.id)} class="feed">{feed.name}</button>
			{/each}
		</div>
	</div>
	<div class="col-2">
		{#each activeFeed.posts as post}
			<div>
				<h2>{post.title}</h2>
				<p>{post.summary}</p>
			</div>
		{/each}
	</div>
	<div class="col-3">
		{activePost.content}
	</div>
</main>

<style>
	.main {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 100vh;
	}

	.col-1 {
		height: 100%;
		flex: 1;
		border-right: 1px solid #373737;

		.header {
			height: 100px;
			border-bottom: 1px solid #373737;
			padding: 20px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.logo {
				height: 50px;
			}
		}

		.list {
			padding: 10px;
			color: red;

			.feed {
				display: block;
				width: 100%;
				padding: 10px;
			}
		}
	}

	.col-2 {
		height: 100%;
		flex: 1;
		border-right: 1px solid #373737;
	}

	.col-3 {
		height: 100%;
		flex: 1;
		border-right: 1px solid #373737;
	}
</style>
