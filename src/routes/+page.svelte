<script lang="ts">
	import { Settings as SettingsIcon, Plus as PlusIcon, Brain as BrainIcon } from 'lucide-svelte';
	import { FeedService, type Feed, type Post } from '$lib/app/feed';
	import Logo from '$lib/icons/Logo.svelte';
	import Popup from '$lib/ui/Popup.svelte';
	import NewFeed from '$lib/ui/NewFeedPage.svelte';
	import SettingsPage from '$lib/ui/SettingsPage.svelte';
	import { onMount } from 'svelte';

	let feeds: Feed[] = [];
	let activeFeedIndex = 0;
	$: activeFeed = feeds.length > 0 ? feeds[activeFeedIndex] : undefined;
	let activePostIndex = 0;
	$: activePost = (activeFeed?.posts || [])[activePostIndex];

	let showAIView = false;
	function toggleAIView() {
		console.log('toggle ai view');
		showAIView = !showAIView;
	}

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
		<header class="header">
			<div class="logo">
				<Logo />
			</div>
			<div class="actions">
				<!-- AI view -->
				<button on:click={toggleAIView}>
					<BrainIcon />
				</button>
				<Popup show={showAIView}>
					<NewFeed />
				</Popup>
				<!-- Add feed -->
				<button on:click={toggleAddFeedPopup}>
					<PlusIcon />
				</button>
				<Popup show={showAddFeedPopup}>
					<NewFeed />
				</Popup>
				<!-- Open settings -->
				<button on:click={() => toggleSettingsPopup()}>
					<SettingsIcon />
				</button>
				<Popup show={showSettingsPopup}>
					<SettingsPage />
				</Popup>
			</div>
		</header>
		<div class="list">
			{#each feeds as feed}
				<button on:click={() => openFeed(feed.id)} class="feed">{feed.title}</button>
			{/each}
		</div>
	</div>

	<!-- Feed posts -->
	<div class="col-2">
		<header class="header">
			<div></div>
			<div>
				<button on:click={toggleAddFeedPopup}>
					<PlusIcon />
				</button>
				<button on:click={toggleAddFeedPopup}>
					<PlusIcon />
				</button>
			</div>
		</header>
		<div class="list">
			{#each activeFeed?.posts || [] as post}
				<div class="item">
					<h2>{post.title}</h2>
					<p>{post.summary}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Post -->
	<div class="col-3">
		<header class="header">
			<div></div>
			<div>
				<button on:click={toggleAddFeedPopup}>
					<PlusIcon />
				</button>
			</div>
		</header>
		<div class="post">
			<span>
				{activePost?.content || ''}
			</span>
			<span>
				{activePost?.link || ''}
			</span>

			<iframe
				src={activePost?.link}
				width="600"
				height="400"
				frameborder="0"
				allowfullscreen
				title="Post Content"
			></iframe>
		</div>
	</div>
</main>

<style>
	.main {
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 100vh;
	}

	.header {
		height: 40px;
		border-bottom: 1px solid #373737;
		padding: 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		height: 50px;
	}

	.col-1 {
		height: 100%;
		flex: 1;
		border-right: 1px solid #373737;

		.list {
			text-align: left;

			.feed {
				display: flex;
				width: 100%;
				padding: 10px;
				background-color: inherit;
				cursor: pointer;
				border: 1px solid red;
			}
		}
	}

	.col-2 {
		height: 100%;
		flex: 1;
		border-right: 1px solid #373737;

		.list {
			.item {
				padding: 10px;
				border-bottom: 1px solid #373737;
			}
		}
	}

	.col-3 {
		height: 100%;
		flex: 1;
		border-right: 1px solid #373737;

		.post {
			padding: 10px;
		}
	}
</style>
