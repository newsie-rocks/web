<script lang="ts">
	import { Settings, Plus } from 'lucide-svelte';
	import { FeedService, type Feed, type Post } from '$lib/app/feed';
	import Logo from '$lib/icons/Logo.svelte';
	import Popup from '$lib/ui/Popup.svelte';
	import NewFeed from '$lib/ui/NewFeed.svelte';
	import SettingsPage from '$lib/ui/Settings.svelte';
	import { onMount } from 'svelte';

	let feeds: Feed[] = [];
	let activeFeedIndex = 0;
	$: activeFeed = feeds.length > 0 ? feeds[activeFeedIndex] : undefined;
	let activePostIndex = 0;
	$: activePost = (activeFeed?.posts || [])[activePostIndex];

	let showAddFeedPopup = false;

	function toggleAddFeedPopup() {
		showAddFeedPopup = !showAddFeedPopup;
	}

	let showSettingsPopup = false;

	function toggleSettingsPopup() {
		showSettingsPopup = !showSettingsPopup;
	}

	let feedService = new FeedService();

	function openFeed(id: string) {
		console.log('open feed');
	}

	// Call the async initializer when the component mounts
	onMount(async () => {
		await feedService.init();
		feeds = await feedService.getAllFeeds();
		console.log(feeds);
		console.log(feeds);
		console.log(activePost);
	});
</script>

<main class="main">
	<div class="col-1">
		<div class="header">
			<div class="logo">
				<Logo />
			</div>
			<div class="actions">
				<!-- Add feed -->
				<button on:click={toggleAddFeedPopup}>
					<Plus></Plus>
				</button>
				<Popup show={showAddFeedPopup}>
					<NewFeed />
				</Popup>
				<!-- Open settings -->
				<button on:click={() => toggleSettingsPopup()}>
					<Settings />
				</button>
				<Popup show={showSettingsPopup}>
					<SettingsPage />
				</Popup>
			</div>
		</div>
		<div class="list">
			{#each feeds as feed}
				<button on:click={() => openFeed(feed.id)} class="feed">{feed.title}</button>
			{/each}
		</div>
	</div>

	<!-- Feed posts -->
	<div class="col-2">
		{#each activeFeed?.posts || [] as post}
			<div>
				<h2>{post.title}</h2>
				<p>{post.summary}</p>
			</div>
		{/each}
	</div>

	<!-- Post -->
	<div class="col-3">
		{activePost?.content || ''}
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
