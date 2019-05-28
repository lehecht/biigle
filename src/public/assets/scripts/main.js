biigle.$viewModel("projects-dashboard-main",function(e){new Vue({el:e,components:{previewThumbnail:biigle.$require("projects.components.previewThumbnail")}})}),biigle.$viewModel("projects-label-trees",function(e){var i=biigle.$require("messages.store"),t=biigle.$require("projects.project"),r=biigle.$require("api.projects");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],components:{typeahead:biigle.$require("core.components.typeahead"),loader:biigle.$require("core.components.loader")},data:{labelTrees:biigle.$require("projects.labelTrees"),availableLabelTrees:[],typeaheadTemplate:'<span v-text="item.name"></span><br><small v-text="item.description"></small>'},computed:{classObject:function(){return{"panel-warning":this.editing}},hasNoLabelTrees:function(){return 0===this.labelTrees.length},labelTreeIds:function(){return this.labelTrees.map(function(e){return e.id})},attachableLabelTrees:function(){var e=this;return this.availableLabelTrees.filter(function(i){return-1===e.labelTreeIds.indexOf(i.id)})}},methods:{fetchAvailableLabelTrees:function(){r.queryAvailableLabelTrees({id:t.id}).then(this.availableLabelTreesFetched,i.handleErrorResponse)},availableLabelTreesFetched:function(e){Vue.set(this,"availableLabelTrees",e.data)},attachTree:function(e){if(e){this.startLoading();var s=this;r.attachLabelTree({id:t.id},{id:e.id}).then(function(){s.treeAttached(e)},i.handleErrorResponse).finally(this.finishLoading)}},treeAttached:function(e){for(var i=this.availableLabelTrees.length-1;i>=0;i--)this.availableLabelTrees[i].id===e.id&&this.availableLabelTrees.splice(i,1);this.labelTrees.push(e)},removeTree:function(e){this.startLoading();var s=this;r.detachLabelTree({id:t.id,label_tree_id:e.id}).then(function(){s.treeRemoved(e)},i.handleErrorResponse).finally(this.finishLoading)},treeRemoved:function(e){for(var i=this.labelTrees.length-1;i>=0;i--)this.labelTrees[i].id===e.id&&this.labelTrees.splice(i,1);this.availableLabelTrees.push(e)}},created:function(){this.$once("editing.start",this.fetchAvailableLabelTrees)}})}),biigle.$viewModel("projects-members",function(e){var i=biigle.$require("messages.store"),t=biigle.$require("projects.project"),r=biigle.$require("api.projects");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader")],data:{members:biigle.$require("projects.members"),roles:biigle.$require("projects.roles"),defaultRole:biigle.$require("projects.defaultRoleId"),userId:biigle.$require("projects.userId")},components:{membersPanel:biigle.$require("core.components.membersPanel")},computed:{},methods:{attachMember:function(e){this.startLoading();var s=this;r.addUser({id:t.id,user_id:e.id},{project_role_id:e.role_id}).then(function(){s.memberAttached(e)},i.handleErrorResponse).finally(this.finishLoading)},memberAttached:function(e){this.members.push(e)},updateMember:function(e,s){this.startLoading();var o=this;r.updateUser({id:t.id,user_id:e.id},{project_role_id:s.role_id}).then(function(){o.memberUpdated(e,s)},i.handleErrorResponse).finally(this.finishLoading)},memberUpdated:function(e,i){e.role_id=i.role_id},removeMember:function(e){this.startLoading();var s=this;r.removeUser({id:t.id,user_id:e.id}).then(function(){s.memberRemoved(e)},i.handleErrorResponse).finally(this.finishLoading)},memberRemoved:function(e){for(var i=this.members.length-1;i>=0;i--)this.members[i].id===e.id&&this.members.splice(i,1)}}})}),biigle.$viewModel("projects-title",function(e){var i=biigle.$require("messages.store"),t=biigle.$require("projects.project"),r=biigle.$require("api.projects");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],data:{project:t,name:t.name,description:t.description},computed:{hasDescription:function(){return!!this.description.length},isChanged:function(){return this.name!==this.project.name||this.description!==this.project.description}},methods:{discardChanges:function(){this.name=this.project.name,this.description=this.project.description,this.finishEditing()},leaveProject:function(){confirm('Do you really want to revoke your membership of project "'+this.project.name+'"?')&&(this.startLoading(),r.removeUser({id:this.project.id,user_id:biigle.$require("projects.userId")}).then(this.projectLeft,i.handleErrorResponse).finally(this.finishLoading))},projectLeft:function(){i.success("You left the project. Redirecting..."),setTimeout(function(){location.href=biigle.$require("projects.redirectUrl")},2e3)},deleteProject:function(){confirm("Do you really want to delete the project "+this.project.name+"?")&&(this.startLoading(),r.delete({id:this.project.id}).then(this.projectDeleted,this.maybeForceDeleteProject).finally(this.finishLoading))},maybeForceDeleteProject:function(e){if(400===e.status){confirm("Deleting this project will delete one or more volumes with all annotations! Do you want to continue?")&&(this.startLoading(),r.delete({id:this.project.id},{force:!0}).then(this.projectDeleted,i.handleErrorResponse).finally(this.finishLoading))}else i.handleErrorResponse(e)},projectDeleted:function(){i.success("The project was deleted. Redirecting..."),setTimeout(function(){location.href=biigle.$require("projects.redirectUrl")},2e3)},saveChanges:function(){this.startLoading(),r.update({id:this.project.id},{name:this.name,description:this.description}).then(this.changesSaved,i.handleErrorResponse).finally(this.finishLoading)},changesSaved:function(){this.project.name=this.name,this.project.description=this.description,this.finishEditing()}}})}),biigle.$viewModel("projects-show-volume-list",function(e){var i=biigle.$require("api.projects"),t=biigle.$require("api.attachableVolumes"),r=biigle.$require("messages.store");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],data:{project:biigle.$require("projects.project"),volumes:biigle.$require("projects.volumes"),attachableVolumes:[]},components:{previewThumbnail:biigle.$require("projects.components.previewThumbnail"),typeahead:biigle.$require("core.components.typeahead")},methods:{removeVolume:function(e){var t=this;this.startLoading(),i.detachVolume({id:this.project.id,volume_id:e}).then(function(){t.volumeRemoved(e)},function(i){400===i.status?confirm("The volume you are about to remove belongs only to this project and will be deleted. Are you sure you want to delete this volume?")&&t.forceRemoveVolume(e):r.handleErrorResponse(i)}).finally(this.finishLoading)},forceRemoveVolume:function(e){var t=this;this.startLoading(),i.detachVolume({id:this.project.id,volume_id:e},{force:!0}).then(function(){t.volumeRemoved(e)},r.handleErrorResponse).finally(this.finishLoading)},volumeRemoved:function(e){for(var i=this.volumes.length-1;i>=0;i--)this.volumes[i].id===e&&(this.attachableVolumes.unshift(this.volumes[i]),this.volumes.splice(i,1))},hasVolume:function(e){for(var i=this.volumes.length-1;i>=0;i--)if(this.volumes[i].id===e)return!0;return!1},attachVolume:function(e){if(e&&!this.hasVolume(e.id)){var t=this;this.startLoading(),i.attachVolume({id:this.project.id,volume_id:e.id},{}).then(function(){t.volumeAttached(e)},r.handleErrorResponse).finally(this.finishLoading)}},volumeAttached:function(e){this.volumes.unshift(e);for(var i=this.attachableVolumes.length-1;i>=0;i--)this.attachableVolumes[i].id===e.id&&this.attachableVolumes.splice(i,1)},fetchAttachableVolumes:function(){t.get({id:this.project.id}).then(this.attachableVolumesFetched,r.handleErrorResponse)},attachableVolumesFetched:function(e){this.attachableVolumes=e.data}},created:function(){this.$once("editing.start",this.fetchAttachableVolumes)}})}),biigle.$declare("api.attachableVolumes",Vue.resource("api/v1/projects{/id}/attachable-volumes")),biigle.$declare("api.volumeSample",Vue.resource("api/v1/volumes{/id}/sample{/number}")),biigle.$component("projects.components.previewThumbnail",{template:'<figure class="preview-thumbnail" @mousemove="updateIndex($event)" @mouseenter="updateHovered" ><i v-if="icon" class="preview-thumbnail__icon fas fa-lg":class="iconClass" ></i><span v-if="removable" class="preview-thumbnail__close close" @click.prevent="remove" :title="removeTitle" >&times;</span><div class="preview-thumbnail__fallback"><slot></slot></div><div class="preview-thumbnail__images" v-if="showPreview"><img v-for="(uri, i) in uris" v-show="thumbShown(i)" @error="failed(i)" :src="uri" ></div><slot name="caption"></slot><span v-show="someLoaded" class="preview-thumbnail__progress" :style="{width: progress}" ></span></figure>',props:{id:{type:Number,required:!0},thumbUris:{required:!0},removable:{type:Boolean,default:!1},removeTitle:{type:String,default:"Remove this volume"},icon:{type:String}},data:function(){return{index:0,uris:[],hovered:!1}},computed:{progress:function(){return 100*this.index/(this.uris.length-1)+"%"},showFallback:function(){return!1===this.uris[this.index]},showPreview:function(){return this.hovered&&this.someLoaded},someLoaded:function(){return this.uris.reduce(function(e,i){return e||!1!==i},!1)},iconClass:function(){return this.icon?"fa-"+this.icon:""}},methods:{thumbShown:function(e){return this.index===e&&!this.failed[e]},updateIndex:function(e){var i=this.$el.getBoundingClientRect();this.index=Math.max(0,Math.floor(this.uris.length*(e.clientX-i.left)/i.width))},remove:function(){this.$emit("remove",this.id)},failed:function(e){this.uris.splice(e,1,!1)},updateHovered:function(){this.hovered=!0}},created:function(){Array.isArray(this.thumbUris)?this.uris=this.thumbUris.slice():this.uris=this.thumbUris.split(",")}});