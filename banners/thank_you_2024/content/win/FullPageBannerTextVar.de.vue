<template>
	<h2>Spendenziel erreicht! Das ist eine gute Nachricht.</h2>

	<div class="wmde-banner-content-columns">
		<p>
			Denn es gibt viel zu tun:
			Der tiefgreifende technologische Umbruch,
			den wir in Zeiten Künstlicher Intelligenz sowie Fakenews und Manipulation im digitalen Raum erleben,
			macht unser technisches Engagement für Wikipedia wichtiger denn je.
			Auch in diesem Jahr investieren wir den größten Teil unseres Budgets in die technische Weiterentwicklung unserer Projekte.
			Damit stellen wir sicher, dass wir von der technischen Entwicklung nicht überrollt werden, sondern sie mitgestalten.
		</p>

		<span class="wmde-banner-mobile-only">
			<ExecutiveDirectorsImage/>
		</span>

		<p>
			Das alles ist auch in Zukunft mit hohen Kosten verbunden.
			Da Wikipedia als gebühren- und werbefreie Wissensplattform kein Geld verdient,
			sind wir auf verlässliche Unterstützung durch engagierte Fördermitglieder angewiesen.
			Es sind allerdings, trotz der Beliebtheit von Wikipedia, immer noch recht wenige Menschen, die dies leisten.
		</p>

		<span class="wmde-banner-mobile-only">
			<StatsBox :number-of-people="numberOfPeople"/>
		</span>

		<p>
			Daher unsere Bitte: <span class="highlight">Werden Sie Fördermitglied und helfen Sie uns,
				die kommenden technologischen Herausforderungen zu meistern.</span> Damit die Freiwilligen stets unter
			besten Bedingungen arbeiten können – und Sie sich auch in Zukunft auf Wikipedia als Ort des freien Zugangs
			zu Wissen und Bildung verlassen können.
		</p>

		<p>
			<strong>Vielen Dank für alles, was Sie für Wikipedia tun!</strong>
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
