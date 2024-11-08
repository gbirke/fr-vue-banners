<template>
	<div class="banner-actions">
		<a
			class="banner-actions-title"
			data-tooltip="Preview in local environment"
			:href="campaign.previewUrlDev.replace('{{banner}}', bannerPageName)"
			target="_blank"
			title="Preview in local environment"
		>
			{{ bannerPageName }}
		</a>
		<div class="banner-actions-links">
			<a
				class="banner-actions-icon"
				data-tooltip="Preview in dark mode"
				:href="campaign.previewUrlDevDark.replace('{{banner}}', bannerPageName)"
				target="_blank"
				title="Preview in dark mode"
			>
				<IconDarkMode/>
			</a>
			<a
				class="banner-actions-icon"
				data-tooltip="Preview in Production"
				:href="campaign.previewUrlProd.replace('{{banner}}', bannerPageName)"
				target="_blank"
				title="Preview in prod environment"
			>
				<IconPreview />
			</a>
			<a
				class="banner-actions-icon"
				data-tooltip="Build Banner"
				href="#"
				title="Build Banner"
				@click.prevent="onCompileBanner"
			>
				<LoadingSpinner :loading="isCompiling"/>
				<IconBuild />
			</a>
			<a
				class="banner-actions-icon banner-actions-icon-copy"
				:class="{ 'uncompiled': !isCompiled, 'was-copied': wasCopied }"
				href="#"
				title="Copy Banner Code"
				:data-tooltip="bannerCopyTooltip"
				@click.prevent="onCopyBannerToClipBoard"
			>
				<CopyingAnimation :is-copying="isCopying" />
				<IconCopy  />
			</a>
			<a
				class="banner-actions-icon"
				target="_blank"
				:href="editLink"
				:title="props.isWPDE ? 'Edit WPDE Banner Settings' : 'Edit Banner Settings on CentralNotice'"
				:data-tooltip="props.isWPDE ? 'Edit WPDE Banner Settings' : 'Edit Banner Settings on CentralNotice'"
			>
				<IconEdit  />
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import LoadingSpinner from './BuildingAnimation.vue';
import CopyingAnimation from './CopyingAnimation.vue';
import IconBuild from './IconBuild.vue';
import IconCopy from './IconCopy.vue';
import IconDarkMode from './IconDarkMode.vue';
import IconEdit from './IconEdit.vue';
import IconPreview from './IconPreview.vue';
import type { Banner, Campaign } from '../../webpack/campaign_config_types';
import { relevantTime } from '../relevant_time';
import { CompileInfo } from '../util';

interface Props {
	banner: Banner;
	campaign: Campaign;
	isWPDE: boolean;
	compileInfo?: CompileInfo;
}

const props = defineProps<Props>();

const bannerPageName = ref( props.banner.pageName );

const CENTRAL_NOTICE_EDIT_URL = 'https://meta.wikimedia.org/wiki/Special:CentralNoticeBanners/edit/{{banner}}';
const WPDE_GITHUB_REPO = 'https://github.com/wmde/wikipedia.de-banners/blob/master/campaigns.yml';

const editLink: string = props.isWPDE ? WPDE_GITHUB_REPO : CENTRAL_NOTICE_EDIT_URL.replace( '{{banner}}', bannerPageName.value );

const isCompiled: Ref<boolean> = computed( () => props.compileInfo !== undefined );

const bannerCopyTooltip: Ref<string> = computed( () => {
	if ( props.compileInfo ) {
		const compiledSizeInKb = Math.round( Number( props.compileInfo.size ) / 1024 );
		return `Copy ${ compiledSizeInKb } KB Banner Code, compiled ${ relevantTime( props.compileInfo.date.toString() ) }`;
	}
	return 'Banner not compiled';
} );

const isCompiling: Ref<boolean> = ref( false );
const isCopying: Ref<boolean> = ref( false );
const wasCopied: Ref<boolean> = ref( false );

function onCompileBanner( e: Event ): void {
	e.preventDefault();
	isCompiling.value = true;
	fetch( `/compile-banner/${ bannerPageName.value }` ).then( async response => {
		const result = await response.json();
		isCompiling.value = false;
		if ( result.err ) {
			alert( result.err );
		}
		console.log( `Compiled in ${ result.stats.compileTime }` );
	} );
}

function onCopyBannerToClipBoard( e: Event ): void {
	e.preventDefault();
	if ( !isCompiled.value ) {
		return;
	}
	const bannerFileName = `/compiled-banners/${ bannerPageName.value }.js.wikitext`;
	isCopying.value = true;
	wasCopied.value = false;
	fetch( bannerFileName ).then( async response => {
		setTimeout( () => {
			isCopying.value = false;
		}, 2000 );

		if ( !response.ok ) {
			if ( response.status === 404 ) {
				alert( `${ bannerPageName.value }.js.wikitext not found, maybe you need to compile first?` );
			} else {
				alert( response.statusText );
			}
			return;
		}

		const bannerCode = await response.text();
		if ( navigator.clipboard ) {
			try {
				await navigator.clipboard.writeText( bannerCode );
				wasCopied.value = true;
				setTimeout( () => {
					wasCopied.value = false;
				}, 2000 );
				return;
			} catch ( error ) {
				alert( 'Failed to copy banner code using navigator.clipboard: ' + error );
			}
		}
	} );
}

</script>
