<template>
	<div class="wmde-banner-message">
		<div>
			<p class="banner-text-title">
				<strong>An alle, die Wikipedia in Deutschland nutzen:</strong>
			</p>
			<p>
				Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg! Am heutigen
				{{ currentDayName }}, den {{ currentDate }} um {{ liveDateAndTime.currentTime }} Uhr, bitten wir Sie
				bescheiden, die Unabhängigkeit von Wikipedia zu unterstützen. Heute bitten wir Sie um Ihre Unterstützung.
				Insgesamt spenden 99% nichts – sie übergehen diesen Aufruf. Wikipedia wird durch Spenden von
				durchschnittlich 22,49&nbsp;€ finanziert. Doch schon mit einer Spende von 15&nbsp;€ kann Wikipedia sich auch
				in Zukunft erfolgreich entwickeln. <AnimatedText :content="visitorsVsDonorsSentence"/> Die meisten
				Menschen spenden, weil sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert
				einer Tasse Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück.
				Vielen Dank!
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
	getCurrentDateAndTime,
	currentDayName,
	currentDate,
	visitorsVsDonorsSentence
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
