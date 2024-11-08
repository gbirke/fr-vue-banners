<template>
	<div class="wmde-banner-stats-box">
		<div class="wmde-banner-stats-box-row">
			<div class="wmde-banner-stats-box-icon">
				<PeopleIcon/>
			</div>
			<div class="wmde-banner-stats-box-text">
				<strong v-html="$translate( 'stats-people-amount' )"/><br/>
				<span v-html="$translate( 'stats-people-text' )"/>
			</div>
		</div>
		<div class="wmde-banner-stats-box-row">
			<div class="wmde-banner-stats-box-icon">
				<HandIcon/>
			</div>
			<div class="wmde-banner-stats-box-text">
				<strong v-html="$translate( 'stats-average-amount' )"/><br/>
				<span v-html="$translate( 'stats-average-text' )"/>
			</div>
		</div>
		<div class="wmde-banner-stats-box-row">
			<div class="wmde-banner-stats-box-icon">
				<MoneyIcon/>
			</div>
			<div class="wmde-banner-stats-box-text">
				<strong v-html="$translate( 'stats-contribution-amount' )"/><br/>
				<span v-html="$translate( 'stats-contribution-text' )"/>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import HandIcon from '../components/icons/HandIcon.vue';
import MoneyIcon from '../components/icons/MoneyIcon.vue';
import PeopleIcon from '../components/icons/PeopleIcon.vue';
</script>
