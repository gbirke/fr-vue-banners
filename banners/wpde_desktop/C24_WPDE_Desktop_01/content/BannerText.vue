<template>
	<div class="wmde-banner-message">
		<div>
			<p>
                <InfoIcon fill="#990a00"/> An diesem {{ currentDayName }}, den {{ liveDateAndTime.currentDate }}, um
				{{ liveDateAndTime.currentTime }} sind Sie gefragt:
			</p>
			<p>
				{{ campaignDaySentence }} Wikipedia wird durch Spenden von durchschnittlich 22,49&nbsp;€ finanziert, aber 99&nbsp;% der
				Lesenden spenden nicht. <strong>Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser
				Spendenziel bereits heute erreicht.</strong> Menschen spenden aus einem einfachen Grund – weil
				Wikipedia nützlich ist. Schon der Preis einer Tasse Kaffee würde genügen.
				<AnimatedText :content="visitorsVsDonorsSentence"/> Wenn Wikipedia eine kommerzielle Seite sein
				würde, wäre das ein riesiger Verlust für die Welt. Sicher könnten wir mit
				Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders. Wir könnten ihr nicht
				vertrauen. Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun. Wenn Sie
				Wikipedia nützlich finden, nehmen Sie sich an diesem {{ currentDayName }} bitte eine Minute Zeit und geben
				Wikipedia mit Ihrer Spende etwas zurück. <em>Vielen Dank!</em>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
import AnimatedText from '@src/components/AnimatedText/AnimatedText.vue';
import { useLiveDateAndTime } from '@src/components/composables/useLiveDateAndTime';
import InfoIcon from '@src/components/Icons/InfoIcon.vue';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

const {
	currentDayName,
	getCurrentDateAndTime,
	campaignDaySentence,
	visitorsVsDonorsSentence
}: DynamicContent = inject( 'dynamicCampaignText' );

const { liveDateAndTime, startTimer, stopTimer } = useLiveDateAndTime( getCurrentDateAndTime );
onMounted( startTimer );
onUnmounted( stopTimer );

</script>
