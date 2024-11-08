<template>
	<div class="wmde-banner-minimised-message">
		<InfoIcon fill="#990a00"/>
		<p class="wmde-banner-minimised-title">
			{{ liveDateAndTime.currentDate }}, {{ liveDateAndTime.currentTime }} - An alle, die Wikipedia in Deutschland
			nutzen. Die Zeit wird knapp!
		</p>
		<p>Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt? Dann geben Sie jetzt etwas zurück.</p>
	</div>
</template>
<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
import { useLiveDateAndTime } from '@src/components/composables/useLiveDateAndTime';
import InfoIcon from '@src/components/Icons/InfoIcon.vue';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

const {
	getCurrentDateAndTime
} = inject<DynamicContent>( 'dynamicCampaignText' );

const { liveDateAndTime, startTimer, stopTimer } = useLiveDateAndTime( getCurrentDateAndTime );
onMounted( startTimer );
onUnmounted( stopTimer );

</script>
