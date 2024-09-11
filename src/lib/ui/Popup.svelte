<script>
	export let show = false;

	function closePopup() {
		show = false;
	}
</script>

{#if show}
	<button class="overlay" on:click={closePopup}></button>
	<div class="popup">
		<slot></slot>
		<button on:click={closePopup}>Close</button>
	</div>
{/if}

<style>
	.popup {
		display: block;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 1rem;
		background: white;
		border: 1px solid #ccc;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		z-index: 1000;
	}
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}
</style>
