<template>
	<div class="funds-distribution-accordion">
		<div v-for="( fundsItem, idx ) in applicationOfFundsData" :key="idx" :class="[
			'funds-distribution-accordion-item',
			{ 'active' : currentActiveItems.includes( String( idx ) ) }
		]">
			<button
				class="funds-distribution-accordion-item-title"
				@click="toggleActive( String( idx ) )"
				:style="{color: fundsItem.colour}"
			>
				{{ fundsItem.title }} {{ fundsItem.percentage }}% <ChevronDownIcon class="funds-distribution-accordion-item-chevron"/>
			</button>
			<div class="funds-distribution-accordion-item-text">
				{{ fundsItem.text }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import ChevronDownIcon from '@src/components/Icons/ChevronDownIcon.vue';
import { ApplicationOfFundsItem } from '@src/domain/UseOfFunds/ApplicationOfFundsItem';

interface Props {
	applicationOfFundsData: ApplicationOfFundsItem[]
}

defineProps<Props>();

const currentActiveItems = ref<string[]>( [] );

const toggleActive = ( idx: string ): void => {
	if ( currentActiveItems.value.includes( idx ) ) {
		currentActiveItems.value.splice( currentActiveItems.value.indexOf( idx ), 1 );
	} else {
		currentActiveItems.value.push( idx );
	}
};

</script>
