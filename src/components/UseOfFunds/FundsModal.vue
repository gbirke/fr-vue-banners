<template>
	<div :class="[ 'banner-modal funds-modal', { 'is-visible': isFundsModalVisible } ]">
		<div class="banner-modal-background" @click="$emit( 'hideFundsModal', { source: UseOfFundsCloseSources.close } )"></div>
		<div class="banner-modal-container">
			<div class="banner-modal-close">
				<button class="banner-modal-close-link" @click="$emit( 'hideFundsModal', { source: UseOfFundsCloseSources.close } )">
					<IconClose/>
				</button>
			</div>
			<div class="banner-modal-content">
				<FundsContent :content="content" @hide-funds-modal="$emit( 'hideFundsModal', { source: UseOfFundsCloseSources.callToAction } )">
					<template #infographic>
						<slot name="infographic"/>
					</template>
				</FundsContent>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import FundsContent from '@src/components/UseOfFunds/FundsContent.vue';
import IconClose from '@src/components/UseOfFunds/Icons/IconClose.vue';
import { UseOfFundsCloseSources } from '@src/components/UseOfFunds/UseOfFundsCloseSources';
import { UseOfFundsContent } from '@src/domain/UseOfFunds/UseOfFundsContent';

interface Props {
	isFundsModalVisible: boolean,
	content: UseOfFundsContent,
}

defineProps<Props>();
defineEmits( [ 'hideFundsModal' ] );

</script>
