<template>
	<div class="wmde-banner-message">
		<div>
			<p class="banner-text-title">
				<strong>Hi,</strong>
			</p>
			<p>
				vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg! Am heutigen
				{{ currentDayName }}, den {{ liveDateAndTime.currentDate }}, um {{ liveDateAndTime.currentTime }} bitten
				wir Sie bescheiden, die Unabhängigkeit von
				Wikipedia zu unterstützen. Insgesamt spenden 99% nichts - sie übergehen diesen Aufruf. Die
				durchschnittliche Spende beträgt 22,25&nbsp;€, doch bereits 10&nbsp;€ helfen uns weiter. {{ campaignDaySentence }}
				<AnimatedText :content="visitorsVsDonorsSentence"/> Die meisten Menschen spenden, weil sie Wikipedia nützlich finden. Hat
				Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt? Dann entscheiden Sie sich,
				eine der seltenen Ausnahmen zu sein, und geben Sie etwas zurück. Vielen Dank!
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject, watch } from 'vue';
import AnimatedText from '@src/components/AnimatedText/AnimatedText.vue';
import { useLiveDateAndTime } from '@src/components/composables/useLiveDateAndTime';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

interface Props {
	playLiveText: boolean;
}

const props = defineProps<Props>();

const {
	currentDayName,
	getCurrentDateAndTime,
	visitorsVsDonorsSentence,
	campaignDaySentence
}: DynamicContent = inject( 'dynamicCampaignText' );

const { liveDateAndTime, startTimer, stopTimer } = useLiveDateAndTime( getCurrentDateAndTime );

watch( () => props.playLiveText, ( shouldPlay: boolean ) => {
	if ( shouldPlay ) {
		startTimer();
	} else {
		stopTimer();
	}
} );

</script>
