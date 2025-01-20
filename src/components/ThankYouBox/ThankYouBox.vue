<template>
	<div class="thank-you-container">
		<span class="heart-icon"><HeartIcon/></span>
		<span class="thank-you-text">Vielen Dank, dass Sie dabei sind</span>
	</div>
</template>

<script setup lang="ts">
import HeartIcon from '@src/components/Icons/HeartIcon.vue';

</script>

<style lang="scss">
	.thank-you-container {
		height: 60px;
		line-height: 60px;
		font-weight: bold;
		background: #ebe2fc;
		color: #6b4ba1;
		border-radius: 10px;
		text-align: center;

		margin-bottom: 16px;
		margin-left: 16px;
		margin-right: 16px;

		.heart-icon {
			padding-right: 8px;
		}
	}
</style>
