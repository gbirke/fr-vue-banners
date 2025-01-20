<template>
	<!-- eslint-disable max-len -->
	<ul class="wmde-banner-stats">
		<li>
			<span class="wmde-banner-stats-icon">
				<svg width="60" height="52" viewBox="0 0 60 52" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M10.8436 25.7747C14.0272 25.7747 16.608 23.1389 16.608 19.8874C16.608 16.6359 14.0272 14 10.8436 14C7.65993 14 5.0791 16.6359 5.0791 19.8874C5.0791 23.1389 7.65993 25.7747 10.8436 25.7747Z" style="fill: var( --stats-people-color );"/>
					<path d="M1 39.0131C1 33.4597 5.40775 28.958 10.8451 28.958C16.2825 28.958 20.6903 33.4597 20.6903 39.0131" stroke-width="2" stroke-miterlimit="10" style="stroke: var( --stats-people-color );"/>
					<path d="M30.0947 39C33.4084 39 36.0947 36.3137 36.0947 33C36.0947 29.6863 33.4084 27 30.0947 27C26.781 27 24.0947 29.6863 24.0947 33C24.0947 36.3137 26.781 39 30.0947 39Z" style="fill: var( --stats-people-color );"/>
					<path d="M20.0947 52C20.0947 46.4771 24.5718 42 30.0947 42C35.6176 42 40.0947 46.4771 40.0947 52" stroke-width="2" stroke-miterlimit="10" style="stroke: var( --stats-people-color );"/>
					<path d="M30.0584 11.7747C33.242 11.7747 35.8228 9.13887 35.8228 5.88737C35.8228 2.63586 33.242 0 30.0584 0C26.8748 0 24.2939 2.63586 24.2939 5.88737C24.2939 9.13887 26.8748 11.7747 30.0584 11.7747Z" style="fill: var( --stats-people-color );"/>
					<path d="M48.8445 25.7747C52.0281 25.7747 54.609 23.1389 54.609 19.8874C54.609 16.6359 52.0281 14 48.8445 14C45.6609 14 43.0801 16.6359 43.0801 19.8874C43.0801 23.1389 45.6609 25.7747 48.8445 25.7747Z" style="fill: var( --stats-people-color );"/>
					<path d="M39 39.015C39 33.4617 43.4078 28.96 48.8451 28.96C54.2825 28.96 58.6903 33.4617 58.6903 39.015" stroke-width="2" stroke-miterlimit="10" style="stroke: var( --stats-people-color );"/>
					<path d="M20 25.0551C20 19.5017 24.4078 15 29.8451 15C35.2825 15 39.6903 19.5017 39.6903 25.0551" stroke-width="2" stroke-miterlimit="10" style="stroke: var( --stats-people-color );"/>
				</svg>
			</span>
			<span>
				<strong>{{ numberOfPeople }}</strong><br/>
				<span v-html="$translate( 'stats-people-text' )"/>
			</span>
		</li>
		<li>
			<span class="wmde-banner-stats-icon">
				<svg width="62" height="40" viewBox="0 0 62 40" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="8" y="29" width="13" height="11" style="fill: var( --stats-average-column-color );"/>
					<rect x="26" y="15" width="13" height="25" style="fill: var( --stats-average-column-color );"/>
					<rect x="44" width="13" height="40" style="fill: var( --stats-average-column-color );"/>
					<line x1="-8.74228e-08" y1="21" x2="62" y2="21" stroke-width="2" stroke-dasharray="4 4" style="stroke: var( --stats-average-line-color );"/>
				</svg>
			</span>
			<span>
				<strong v-html="$translate( 'stats-average-amount' )"/><br/>
				<span v-html="$translate( 'stats-average-text' )"/>
			</span>
		</li>
		<li>
			<span class="wmde-banner-stats-icon">
				<svg width="60" height="56" viewBox="0 0 60 56" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="14.2373" cy="18.9829" r="14.2373" style="fill: var( --stats-contribution-background-color );"/>
					<circle cx="14.2373" cy="14.2373" r="13.2373" stroke-width="2" style="fill: var( --stats-contribution-background-color ); stroke: var( --stats-contribution-line-color );"/>
					<circle cx="45.5596" cy="41.7627" r="14.2373" style="fill: var( --stats-contribution-background-color );"/>
					<circle cx="45.5596" cy="37.0171" r="13.2373" stroke-width="2" style="fill: var( --stats-contribution-background-color ); stroke: var( --stats-contribution-line-color );"/>
					<path d="M40.8135 36.2578L46.5084 31.3223V43.6612" stroke-width="2" style="stroke: var( --stats-contribution-line-color );"/>
					<path d="M8.54248 13.2881L14.712 7.59326V21.8306" stroke-width="2" style="stroke: var( --stats-contribution-line-color );"/>
				</svg>
			</span>
			<span>
				<strong v-html="$translate( 'stats-contribution-amount' )"/><br/>
				<span v-html="$translate( 'stats-contribution-text' )"/>
			</span>
		</li>
	</ul>
</template>

<script setup lang="ts">
interface Props {
	numberOfPeople: string
}

defineProps<Props>();
</script>
