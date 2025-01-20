<template>
	<h2>Donations goal reached! That's great news.</h2>

	<div class="wmde-banner-content-columns">
		<p>
			Because there's a lot to be done:
			the profound technological upheaval we're living through,
			an era of AI (artificial intelligence) as well as fake news and deception
			in the digital space, makes our technical commitment to Wikipedia more important than ever.
			As ever, this year we're investing most of our budget in the further technical development of our projects.
			That's how we ensure that we're not overcome by technical developments and are instead able to help shape them.
		</p>

		<span class="wmde-banner-mobile-only">
			<ExecutiveDirectorsImage/>
		</span>

		<p>
			All that comes at a high price in the future.
			As a fee-free and ad-free knowledge platform, Wikipedia earns no money, which makes us dependent on the reliable
			support of committed sustaining members.
			But despite how beloved Wikipedia is, the number of people who provide that support remains quite small.
		</p>

		<span class="wmde-banner-mobile-only">
			<StatsBox :number-of-people="numberOfPeople"/>
		</span>

		<p>
			That's why we're asking you to <span class="highlight">become a sustaining member and to help us grapple
				with the coming technological challenges.</span> So volunteers can always do their work under optimal
			conditions -- and so you can rely now and in the future on Wikipedia as a place of open access to knowledge
			and education.
		</p>
	</div>

</template>

<script setup lang="ts">
import ExecutiveDirectorsImage from '@banners/thank_you_2024/content/ExecutiveDirectorsImage.vue';
import StatsBox from '@banners/thank_you_2024/components/StatsBox.vue';
interface Props {
	numberOfPeople: string
}

defineProps<Props>();
</script>
