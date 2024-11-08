<template>
	<div class="wmde-banner-message">
		<div>
			<p>
				<InfoIcon fill="#990a00"/> <strong>An alle, die Wikipedia in Deutschland nutzen</strong>
			</p>
			<p>
				{{ campaignDaySentence }} Millionen Menschen nutzen Wikipedia, aber 99&nbsp;% spenden nicht – sie
				übergehen diesen Aufruf. Wenn Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee
				geschenkt hat, dann geben Sie etwas zurück. Danke!
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import InfoIcon from '@src/components/Icons/InfoIcon.vue';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

const {
	campaignDaySentence
}: DynamicContent = inject( 'dynamicCampaignText' );

</script>
