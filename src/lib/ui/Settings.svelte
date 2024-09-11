<script lang="ts">
	import { SettingManager } from '$lib/app/setting';

	let setting1 = '';
	let setting2 = '';

	let feedManager = new SettingManager();

	function save(event: MouseEvent) {
		throw new Error('Not implemented');
	}
</script>

<div class="settings">
	<input type="text" bind:value={setting1} placeholder="Feed name" />
	<input type="text" bind:value={setting2} placeholder="Feed URL" />
	<button on:click={save}>Save</button>
</div>

<style>
	.settings {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
