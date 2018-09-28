<template>
	<div>
		<assets-gq v-if="$store.state.userData.userType==1"></assets-gq>
		<assets-rz v-if="$store.state.userData.userType==3"></assets-rz>
	</div>
</template>
<script>
import assetsGq from './asset-gq'
import assetsRz from './asset-rz'
export default {
	components:{
		assetsGq,
		assetsRz
	}
}
</script>
