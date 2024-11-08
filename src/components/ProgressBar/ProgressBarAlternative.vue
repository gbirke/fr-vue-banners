<template>
	<div class="wmde-banner-progress-bar" :class="{
		'wmde-banner-progress-bar--late-progress': progressBarContent.isLateProgress
	}" :style="{ '--wmde-banner-progress-bar-width': progressBarContent.percentageTowardsTarget + '%' }">
		<div class="wmde-banner-progress-bar-text">
			<div class="wmde-banner-progress-bar-text-left">
				{{ leftText }}
			</div>
			<div class="wmde-banner-progress-bar-text-right">
				{{ rightText }}
			</div>
		</div>
		<div class="wmde-banner-progress-bar-wrapper">
			<div class="wmde-banner-progress-bar-fill-wrapper">
				<div class="wmde-banner-progress-bar-fill">
				<span class="wmde-banner-progress-bar-fill-text">
						{{ progressBarContent.amountDonated }}
					</span>
				</div>
			</div>
			<div class="wmde-banner-progress-bar-target">
				{{ progressBarContent.donationTargetAmount }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

interface Props {
	amountToShowOnRight: 'TARGET'|'MISSING'
}

const props = defineProps<Props>();

const { daysLeftSentence, progressBarContent } = inject<DynamicContent>( 'dynamicCampaignText' );

const leftText = progressBarContent.isLateProgress ? daysLeftSentence : progressBarContent.amountDonated;
const rightText = props.amountToShowOnRight === 'TARGET' ? progressBarContent.donationTarget : progressBarContent.amountNeeded;
</script>
