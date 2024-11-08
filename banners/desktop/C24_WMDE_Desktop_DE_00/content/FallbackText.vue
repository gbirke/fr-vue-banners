<template>
	<div class="wmde-banner-message">
		<div>
			<p>
				<InfoIcon fill="#990a00"/> <strong>An alle, die Wikipedia in Deutschland nutzen</strong>
			</p>
			<p>
				{{ campaignDaySentence }} <AnimatedText :content="visitorsVsDonorsSentence"/> Wenn Wikipedia Ihnen in
				diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt hat, dann geben Sie etwas zurück. Danke!
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import AnimatedText from '@src/components/AnimatedText/AnimatedText.vue';
import InfoIcon from '@src/components/Icons/InfoIcon.vue';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

const {
	campaignDaySentence,
	visitorsVsDonorsSentence
}: DynamicContent = inject( 'dynamicCampaignText' );

</script>
