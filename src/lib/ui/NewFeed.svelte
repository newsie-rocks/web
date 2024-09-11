<script lang="ts">
	import { FeedService } from '$lib/app/feed';

	let newFeedName = '';
	let newFeedUrl = '';

	let feedManager = new FeedService();

	function addFeed(event: MouseEvent) {
		feedManager.addFeed({ name: newFeedName, url: newFeedUrl });
	}
</script>

<div class="new-feed">
	<input type="text" bind:value={newFeedName} placeholder="Feed name" />
	<input type="text" bind:value={newFeedUrl} placeholder="Feed URL" />
	<button on:click={addFeed}>Add Feed</button>
</div>

<style>
	.new-feed {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
