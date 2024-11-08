<template>
	<div class="wmde-banner-message">
		<div>
			<p>
				<strong>
					<InfoIcon fill="#990a00"/>
					{{ liveDateAndTime.currentDate }}, {{ liveDateAndTime.currentTime }}: &#8220;Wikipedia is not for
					sale.&#8221; - A personal appeal from Wikipedia founder Jimmy Wales.
				</strong>
			</p>
			<p>
				Please don't ignore this 1-minute read. This {{ currentDayName }}, {{ currentDate }}, I ask you to
				reflect on the number of times you visited Wikipedia in the past year, the value you got from it,
				and whether you're able to give €5 back. If you can, please join the 1% of readers who
				give. <AnimatedText content="If everyone reading this right now gave just €5, we'd hit our goal in a couple of hours."/>
			</p>

			<p>
				It's hard to know what to trust online these days. Disinformation and scammers are everywhere.
				Wikipedia is different. It's not perfect, but it's not here to make a profit or to push a particular
				perspective. It's written by everyone, together. Wikipedia is something we all share, like a library
				or a public park. We are passionate about our model because we want everyone to have equal access to
				quality information - something that is becoming harder and harder to find online.
			</p>

			<p>
				If Wikipedia has given you €5 worth of knowledge this year, please give back. There are no small
				contributions: every edit counts, every donation counts. Thank you.
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

const { currentDayName, currentDate, getCurrentDateAndTime }: DynamicContent = inject( 'dynamicCampaignText' );
const { liveDateAndTime, startTimer, stopTimer } = useLiveDateAndTime( getCurrentDateAndTime );
onMounted( startTimer );
onUnmounted( stopTimer );

</script>
