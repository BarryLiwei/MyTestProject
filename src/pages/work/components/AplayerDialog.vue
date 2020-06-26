<template>
	<div id="aplayerdialog">
		<el-dialog title="播放录音" :visible.sync="dialogTableVisible"  :before-close="handleClose" width="780px">
	        <VueAplayer v-if="startHidden"   autoplay :music="{ title: aplayData.customer_name+'('+aplayData.call_type+')', artist:'录音播放' , src: aplayData.voice_file}"/>
	    </el-dialog>
       
    </div>
</template>
<script>
   import VueAplayer from 'vue-aplayer'
	export default{
		props:["aplayData"],
		data(){
			return {
				dialogTableVisible:true,
				music:{},
				startHidden:false,
				base64Data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAYAAACO98lFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODBBOUJBRUZDNUFEMTFFNkFFNzFCQ0JCM0ExNzJFRDIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODBBOUJBRjBDNUFEMTFFNkFFNzFCQ0JCM0ExNzJFRDIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MEE5QkFFREM1QUQxMUU2QUU3MUJDQkIzQTE3MkVEMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MEE5QkFFRUM1QUQxMUU2QUU3MUJDQkIzQTE3MkVEMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnoI9aQAAAWfSURBVHja3FxpUiIxFA6I+wKl/vGX3EBuIHMCvYHeYJwbcAS9gd4ATzBwAzzBOL+sslzAfXfydSVd4ZHQ2ws086pSXcNId/K9761JU/j+/hY+5eLioi4vGDU5KnJsR3zlTI5zOTpytHDd2Njo+pxjgRsEuWgsdFeNHabbtuVoynHsAxA2EOTioekDOfaEXzlRYLRyA4Ja/KGL5oVCQczOzopSqSSmp6dFsVgUMzMzA3/39fUlPj4+guv7+7t4e3sLRgQ7GhxgpAZB0f7QpnksfGFhQczNzVkXnEReXl7C4ZjrqRz7WcwkFQgSANj7sRxl83NoenFxUczPz7PbABjy+voq7u/vxefnJ/3vHkxRAnE8EhAkAND+T/OzqakpsbKyEmh+FPL8/Cx6vZ6NGScKjK4XEBT9m9T2l5aWxPLyshi1gBkPDw/i8fHRFmLrSYCIBYICAA5oy6R+uVwOruMUOM+bmxvKip4CosMCgg0A2DzoD0+fBwErAASiShoghoJgAwCODwDkUbrdbuAvCBDVKNOIUmXTBKBSqeQWAD0/EpkQvVpKmclBUFFg23SAPkLfCIDYUvlMMnNQRc9v0wfg5pMkV1dX1Ef8kmZxGAsERR04k00dBVZXV3PjBJM4y8vLSzNqwD/UJBDnccyhoQFA+oswOGkABAuTc4byiH+IZoJkQVVe/uh/wwkiGvjQEoolU1Bg+QD77u6OJlQ/aNFVsrCgrw7gTncxIWKrXmsPOPSnpyfTLBqqyTPIBMqCtbW1zBWgmdVBI67FU+GuRQA8nu9iQ9HGAiyeCwBUfdfX17EBgKBKvL29DZIfDgG7AKwhBwOO0WiJhV/iskcUOVnMhwsIYmI7ivl9TNjVvQEgxkFDNEEsFV4qIMAmDjYQ2bWBEAgHAPD+XBqEgE2WRkrikEnWtk9BqDtok9oRcXexOdhAQNjSNUVRNUpDU+DoD5BKjkVgXlkFDV8idc2EuhmnswqiQFbq2gTMiug+xzIJssYQhJoZGvOgMZeg0ZpVyBprGoQqJxNoOswpHAwj+cIgCOQPUkeGPINAFF3WIGxygpAkM8yDIEKwl215L7stfq/GPmMONo289zBJIPi6NzsIloQk9/f2AgLactyit/g9RJgOQPjLGYLgGH205HBPDqdL14iNGdz1nBMERxMjc2zn2vQleUxPm8M5d4yHxrj2KXTHm0vIGjsahHDDMmuBQuMxBxC4B+fON1ljCEKLs0AxBb0JdHuzAMB98IMwIVh7UW1d93S5yp32wpbTNGp87H1azj11zBDZ8tkQSapRLN7H6RdS5p/pLTkNQtN3PyDJlr6v7X+ytmOaLDW1SSBM+gDCRwKVRMBwYgrNPhDUSY7wQ45WOZUk+w8+nk8atW1zd9q6AxXjNGnsxAQawG5SkoUBMLTswUiOJg3mQBLBRh9Lya407GRPZ2nr6+upQhAAxIO5Ig1yDjhWjDSZKM4pGCCABfVhIFRFyq15LByU40y4XIBgTnGjDeZETHFga75IignYyZF5gyhtgq7YcMXwDYAGG+aF50WZCuZOAGjbDoS7TqqEyROOz7oehoeAaqNYvA0MPNulJMwZYJFiaT9WP0FFil1zoWRvP/wc2vD95swwwbNd2/5QHnWGtvNKzqaKosyR6V1NILQJjBMAEwho3GSrjiyGnLpOrg3tLMkv4SBD24zdOqV2nDAfm0DjWkmWU61nLjOwRgcqtmO98Mo+t9qyiGVuzmN7sUFwATEhEvuAd2TTTjnKuqLVfwdALBAIEO0JAOBMmUAn7hdYXv/JkaR6KYz1RbAx078xLAxmNgeLeaDsrpq5xJi1X0sLQGomEFYMfTnUo4z/5VAHGKN4TRiaP8zVa8KOvMLXC+PNqMQnFyBYQKmL5D8d0FUJWvDzARP30wEJAaoafYyxyT8BBgCWimDPreim9gAAAABJRU5ErkJggg=='
			}
		},
		components:{
			VueAplayer
		},
		mounted(){
			 this.showFn()
		},
		methods:{
			handleClose(){
				this.dialogTableVisible=false
				this.$emit("sendAplayer")
     
				this.startHidden = false
			},
			 showFn(){
				console.log(this.aplayData.voice_file)
			 	let that = this
				setTimeout(function(){
					that.startHidden = true
				     that.setPhoto();
				},300);
			},
			setPhoto(){
				this.$nextTick(function () {
					let style = document.getElementsByClassName('aplayer-pic')[0].style;
					let url =  this.aplayData.customer_avatar || this.base64Data;
					//style.setProperty('background-image', 'url('+ url +')');
					style.backgroundImage =   'url('+ url +')';
				})
			}
		}
	}
</script>
<style>
.aplayer-pic{
	
} 

</style>