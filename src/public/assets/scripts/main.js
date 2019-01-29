biigle.$viewModel("create-video-form",function(t){new Vue({el:t,mixins:[biigle.$require("core.mixins.loader")]})}),biigle.$viewModel("video-container",function(t){var e=biigle.$require("videos.id"),n=biigle.$require("videos.src"),i=biigle.$require("videos.shapes"),o=biigle.$require("videos.api.videoAnnotations"),a=biigle.$require("messages.store");new Vue({el:t,mixins:[biigle.$require("core.mixins.loader")],components:{videoScreen:biigle.$require("videos.components.videoScreen"),videoTimeline:biigle.$require("videos.components.videoTimeline"),sidebar:biigle.$require("core.components.sidebar"),sidebarTab:biigle.$require("core.components.sidebarTab"),labelTrees:biigle.$require("labelTrees.components.labelTrees")},data:{video:document.createElement("video"),labelTrees:biigle.$require("videos.labelTrees"),selectedLabel:null,bookmarks:[],annotations:[]},computed:{shapes:function(){var t={};return Object.keys(i).forEach(function(e){t[i[e]]=e}),t},selectedAnnotations:function(){return this.annotations.filter(function(t){return!1!==t.selected})}},methods:{prepareAnnotation:function(t){return t.selected=!1,t.shape=i[t.shape_id],t},setAnnotations:function(t){this.annotations=t.body.map(this.prepareAnnotation)},addCreatedAnnotation:function(t){this.annotations.push(this.prepareAnnotation(t.body))},seek:function(t){this.video.currentTime=t},selectAnnotation:function(t,e){this.selectAnnotations([t],[e])},selectAnnotations:function(t,e){this.deselectAnnotations(),t.forEach(function(t,n){t.selected=e[n]}),e&&e.length>0&&this.seek(e[0])},deselectAnnotations:function(){this.annotations.forEach(function(t){t.selected=!1})},createBookmark:function(t){this.bookmarks.reduce(function(e,n){return e||n.time===t},!1)||this.bookmarks.push({time:t})},createAnnotation:function(t){var n=Object.assign(t,{shape_id:this.shapes[t.shape],label_id:this.selectedLabel?this.selectedLabel.id:0});delete n.shape,o.save({id:e},n).then(this.addCreatedAnnotation,a.handleResponseError)},handleSelectedLabel:function(t){this.selectedLabel=t},handleDeselectedLabel:function(){this.selectedLabel=null},deleteSelectedAnnotations:function(){confirm("Are you sure that you want to delete all selected annotations?")&&this.selectedAnnotations.forEach(function(t){o.delete({id:t.id}).then(this.deletedAnnotation(t)).catch(a.handleResponseError)},this)},deletedAnnotation:function(t){return function(){var e=this.annotations.indexOf(t);-1!==e&&this.annotations.splice(e,1)}.bind(this)}},created:function(){this.video.muted=!0,this.video.addEventListener("error",function(){a.danger("Error while loading video file.")}),this.startLoading();var t=this,n=new Vue.Promise(function(e,n){t.video.addEventListener("loadeddata",e),t.video.addEventListener("error",n)}),i=o.query({id:e});i.then(this.setAnnotations,a.handleResponseError),Vue.Promise.all([n,i]).then(this.finishLoading)},mounted:function(){this.video.src=n}})}),biigle.$declare("videos.api.videoAnnotations",Vue.resource("api/v1/video-annotations{/id}",{},{query:{method:"GET",url:"api/v1/videos{/id}/annotations"},save:{method:"POST",url:"api/v1/videos{/id}/annotations"}})),biigle.$component("videos.components.annotationClip",{template:'<div class="annotation-clip" v-show="duration > 0" :style="style" :class="classObj" @click.stop="select($event)"><keyframe v-for="(frame, i) in keyframes" :frame="frame" @select="selectFrame(i)"></keyframe></div>',components:{keyframe:{template:'<span class="annotation-keyframe" :style="style" :class="classObj" @click.stop="emitSelect"></span>',props:{frame:{type:Object,required:!0}},computed:{offset:function(){return(this.frame.time-this.$parent.startFrame)/this.$parent.clipDuration},style:function(){return{left:100*this.offset+"%","background-color":"#"+this.$parent.color}},classObj:function(){return{"annotation-keyframe--selected":this.frame.selected}}},methods:{emitSelect:function(){this.$emit("select")}}}},props:{annotation:{type:Object,required:!0},labelId:{type:String,required:!0},duration:{type:Number,required:!0}},data:function(){return{}},computed:{startFrame:function(){return this.annotation.frames[0]},endFrame:function(){return this.annotation.frames[this.annotation.frames.length-1]},offset:function(){return this.startFrame/this.duration},clipDuration:function(){return this.endFrame-this.startFrame},width:function(){return this.clipDuration/this.duration},color:function(){for(var t=parseInt(this.labelId),e=this.annotation.labels.length-1;e>=0;e--)if(this.annotation.labels[e].label_id===t)return this.annotation.labels[e].label.color;return"000000"},style:function(){return{left:100*this.offset+"%",width:100*this.width+"%","background-color":"#"+this.color+"66"}},keyframes:function(){var t=this.annotation.selected;return this.annotation.frames.map(function(e){return{time:e,selected:t===e}})},selected:function(){return!1!==this.annotation.selected},classObj:function(){return{"annotation-clip--selected":this.selected}}},methods:{emitSelect:function(t){this.$emit("select",this.annotation,t)},selectFrame:function(t){this.emitSelect(this.annotation.frames[t])},select:function(t){this.emitSelect(this.startFrame+(t.clientX-t.target.getBoundingClientRect().left)/t.target.clientWidth*this.clipDuration)}},mounted:function(){}}),biigle.$component("videos.components.annotationTrack",{template:'<div class="annotation-track"><div class="annotation-lane" v-for="lane in lanes"><annotation-clip v-for="annotation in lane" :annotation="annotation" :label-id="labelId" :duration="duration" @select="emitSelect"></annotation-clip></div></div>',components:{annotationClip:biigle.$require("videos.components.annotationClip")},props:{annotations:{type:Array,required:!0},labelId:{type:String,required:!0},duration:{type:Number,required:!0}},data:function(){return{}},computed:{lanes:function(){var t=[[]],e=[[]];return this.annotations.forEach(function(n){var i=[n.frames[0],n.frames[n.frames.length-1]],o=0,a=!1;t:for(;!a;){if(e[o]){for(var r=t[o].length-1;r>=0;r--)if(this.rangesCollide(t[o][r],i)){o+=1;continue t}}else t[o]=[],e[o]=[];t[o].push(i),e[o].push(n),a=!0}},this),e}},methods:{emitSelect:function(t,e){this.$emit("select",t,e)},rangesCollide:function(t,e){return t[0]>=e[0]&&t[0]<e[1]||t[1]>e[0]&&t[1]<=e[1]||e[0]>=t[0]&&e[0]<t[1]||e[1]>t[0]&&e[1]<=t[1]||t[0]===e[0]&&t[1]===e[1]}},watch:{lanes:{immediate:!0,handler:function(t){this.$emit("update",this.labelId,t.length)}}}}),biigle.$component("videos.components.annotationTracks",{template:'<div class="annotation-tracks" @click="emitDeselect" @scroll.stop="handleScroll"><annotation-track v-for="(annotations, labelId) in tracks" :annotations="annotations" :labelId="labelId" :duration="duration" @select="emitSelect" @update="emitUpdate"></annotation-track></div>',components:{annotationTrack:biigle.$require("videos.components.annotationTrack")},props:{annotations:{type:Array,default:function(){return[]}},duration:{type:Number,required:!0}},data:function(){return{}},computed:{tracks:function(){var t={};return this.annotations.forEach(function(e){e.labels.forEach(function(n){t.hasOwnProperty(n.label_id)||(t[n.label_id]=[]),t[n.label_id].push(e)})}),t}},methods:{emitSelect:function(t,e){this.$emit("select",t,e)},emitDeselect:function(){this.$emit("deselect")},emitUpdate:function(t,e){this.$emit("update",t,e)},handleScroll:function(){this.$emit("scroll-y",this.$el.scrollTop)}}}),biigle.$component("videos.components.currentTimeIndicator",{template:'<span class="time-indicator" :style="style"></span>',props:{duration:{type:Number,required:!0},currentTime:{type:Number,required:!0}},data:function(){return{parentWidth:0}},computed:{style:function(){if(this.duration>0){return"transform: translateX("+this.parentWidth*this.currentTime/this.duration+"px);"}}},methods:{updateParentWidth:function(){this.parentWidth=this.$el.parentElement.clientWidth}},mounted:function(){this.updateParentWidth()}}),biigle.$component("videos.components.scrollStrip",{template:'<div class="scroll-strip"><video-progress :bookmarks="bookmarks" :duration="duration" @seek="emitSeek"></video-progress><annotation-tracks :annotations="annotations" :duration="duration" @select="emitSelect" @deselect="emitDeselect" @update="emitUpdateTracks" @scroll-y="emitScrollY"></annotation-tracks><span class="time-indicator" :style="indicatorStyle"></span></div>',components:{videoProgress:biigle.$require("videos.components.videoProgress"),annotationTracks:biigle.$require("videos.components.annotationTracks")},props:{annotations:{type:Array,required:function(){return[]}},bookmarks:{type:Array,required:function(){return[]}},duration:{type:Number,required:!0},currentTime:{type:Number,required:!0}},data:function(){return{elementWidth:0}},computed:{currentTimeOffset:function(){return this.duration>0?Math.round(this.elementWidth*this.currentTime/this.duration):0},indicatorStyle:function(){return"transform: translateX("+this.currentTimeOffset+"px);"}},methods:{updateElementWidth:function(){this.elementWidth=this.$el.clientWidth},emitSeek:function(t){this.$emit("seek",t)},emitSelect:function(t,e){this.$emit("select",t,e)},emitDeselect:function(){this.$emit("deselect")},emitUpdateTracks:function(t,e){this.$emit("update-tracks",t,e)},emitScrollY:function(t){this.$emit("scroll-y",t)}},created:function(){window.addEventListener("resize",this.updateElementWidth);var t=this;biigle.$require("events").$on("sidebar.toggle",function(){t.$nextTick(t.updateElementWidth)}),biigle.$require("keyboard").on(" ",function(t){t.preventDefault()})},mounted:function(){this.updateElementWidth()}}),biigle.$component("videos.components.trackHeaders",{template:'<div class="track-headers"><div class="track-header" v-for="track in tracks"><div class="label-name" v-text="track.label.label.name"></div><div class="lane-dummy" v-for="lane in track.lanes"></div></div></div>',props:{labels:{type:Object,required:!0},laneCounts:{type:Object,default:function(){return{}}},scrollTop:{type:Number,default:0}},data:function(){return{}},computed:{tracks:function(){return Object.keys(this.laneCounts).map(function(t){return{label:this.labels[t],lanes:Array.apply(null,{length:this.laneCounts[t]})}},this)}},methods:{},watch:{scrollTop:function(t){this.$el.scrollTop=t}}}),biigle.$component("videos.components.videoProgress",{template:'<div class="video-progress" @click="emitSeek"><bookmark v-for="mark in bookmarks" :bookmark="mark" @select="emitSelectBookmark"></bookmark></div>',props:{duration:{type:Number,required:!0},bookmarks:{type:Array,default:function(){return[]}}},components:{bookmark:{template:'<span class="bookmark" :style="style" @click.stop="emitSelect"></span>',props:{bookmark:{type:Object,required:!0}},computed:{style:function(){return"left: "+100*this.bookmark.time/this.$parent.duration+"%"}},methods:{emitSelect:function(){this.$emit("select",this.bookmark)}}}},data:function(){return{}},computed:{},methods:{emitSeek:function(t){this.$emit("seek",(t.clientX-t.target.getBoundingClientRect().left)/t.target.clientWidth*this.duration)},emitSelectBookmark:function(t){this.$emit("seek",t.time)}},mounted:function(){}}),biigle.$component("videos.components.videoScreen",{mixins:[biigle.$require("videos.components.videoScreen.videoPlayback"),biigle.$require("videos.components.videoScreen.annotationPlayback")],template:'<div class="video-screen"><div class="controls"><div class="btn-group"><control-button v-if="playing" icon="fa-pause" title="Pause 𝗦𝗽𝗮𝗰𝗲𝗯𝗮𝗿" v-on:click="pause"></control-button><control-button v-else icon="fa-play" title="Play 𝗦𝗽𝗮𝗰𝗲𝗯𝗮𝗿" v-on:click="play"></control-button></div><div v-if="canAdd" class="btn-group"><control-button icon="icon-point" title="Start a point annotation 𝗔" v-on:click="drawPoint" :disabled="hasNoSelectedLabel" :hover="false" :open="isDrawingPoint" :active="isDrawingPoint"><control-button icon="fa-check" title="Finish the point annotation" v-on:click="finishDrawAnnotation"></control-button></control-button><control-button icon="icon-rectangle" title="Start a rectangle annotation 𝗦" v-on:click="drawRectangle" :disabled="hasNoSelectedLabel" :hover="false" :open="isDrawingRectangle" :active="isDrawingRectangle"><control-button icon="fa-check" title="Finish the rectangle annotation" v-on:click="finishDrawAnnotation"></control-button></control-button><control-button icon="icon-circle" title="Start a circle annotation 𝗗" v-on:click="drawCircle" :disabled="hasNoSelectedLabel" :hover="false" :open="isDrawingCircle" :active="isDrawingCircle"><control-button icon="fa-check" title="Finish the circle annotation" v-on:click="finishDrawAnnotation"></control-button></control-button><control-button icon="icon-linestring" title="Start a line annotation 𝗙" v-on:click="drawLineString" :disabled="hasNoSelectedLabel" :hover="false" :open="isDrawingLineString" :active="isDrawingLineString"><control-button icon="fa-check" title="Finish the line annotation" v-on:click="finishDrawAnnotation"></control-button></control-button><control-button icon="icon-polygon" title="Start a polygon annotation 𝗚" v-on:click="drawPolygon" :disabled="hasNoSelectedLabel" :hover="false" :open="isDrawingPolygon" :active="isDrawingPolygon"><control-button icon="fa-check" title="Finish the polygon annotation" v-on:click="finishDrawAnnotation"></control-button></control-button></div><div v-if="canDelete || canAdd" class="btn-group"><control-button v-if="canDelete" icon="fa-trash" title="Delete selected annotations 𝗗𝗲𝗹𝗲𝘁𝗲" v-on:click="emitDelete" :disabled="!hasSelectedAnnotations"></control-button><control-button v-if="canAdd" icon="fa-bookmark" title="Create a bookmark 𝗕" v-on:click="emitCreateBookmark"></control-button></div></div></div>',components:{controlButton:biigle.$require("annotations.components.controlButton")},props:{annotations:{type:Array,default:function(){return[]}},canAdd:{type:Boolean,default:!1},canModify:{type:Boolean,default:!1},canDelete:{type:Boolean,default:!1},listenerSet:{type:String,default:"default"},selectedAnnotations:{type:Array,default:function(){return[]}},selectedLabel:{type:Object},video:{type:HTMLVideoElement,required:!0}},data:function(){return{pendingAnnotation:{},interactionMode:"default"}},computed:{hasSelectedLabel:function(){return!!this.selectedLabel},hasNoSelectedLabel:function(){return!this.selectedLabel},hasSelectedAnnotations:function(){return this.selectedAnnotations.length>0},isDrawing:function(){return this.interactionMode.startsWith("draw")},isDrawingPoint:function(){return"drawPoint"===this.interactionMode},isDrawingRectangle:function(){return"drawRectangle"===this.interactionMode},isDrawingCircle:function(){return"drawCircle"===this.interactionMode},isDrawingLineString:function(){return"drawLineString"===this.interactionMode},isDrawingPolygon:function(){return"drawPolygon"===this.interactionMode}},methods:{createMap:function(){var t=new ol.Map({renderer:"canvas",controls:[new ol.control.Zoom,new ol.control.ZoomToExtent({tipLabel:"Zoom to show whole video",label:""})],interactions:ol.interaction.defaults({altShiftDragRotate:!1,doubleClickZoom:!1,keyboard:!1,shiftDragZoom:!1,pinchRotate:!1,pinchZoom:!1})}),e=biigle.$require("annotations.ol.ZoomToNativeControl");return t.addControl(new e({label:""})),t},initLayersAndInteractions:function(t){var e=biigle.$require("annotations.stores.styles");this.annotationFeatures=new ol.Collection,this.annotationSource=new ol.source.Vector({features:this.annotationFeatures}),this.annotationLayer=new ol.layer.Vector({source:this.annotationSource,updateWhileAnimating:!0,updateWhileInteracting:!0,style:e.features}),this.pendingAnnotationSource=new ol.source.Vector,this.pendingAnnotationLayer=new ol.layer.Vector({opacity:.5,source:this.pendingAnnotationSource,updateWhileAnimating:!0,updateWhileInteracting:!0,style:e.editing}),this.selectInteraction=new ol.interaction.Select({condition:ol.events.condition.click,style:e.highlight,layers:[this.annotationLayer],multi:!0}),this.selectedFeatures=this.selectInteraction.getFeatures(),this.selectInteraction.on("select",this.handleFeatureSelect),this.annotationLayer.setMap(t),this.pendingAnnotationLayer.setMap(t),t.addInteraction(this.selectInteraction)},emitCreateBookmark:function(){this.$emit("create-bookmark",this.video.currentTime)},draw:function(t){this["isDrawing"+t]?this.resetInteractionMode():this.canAdd&&(this.interactionMode="draw"+t)},drawPoint:function(){this.draw("Point")},drawRectangle:function(){this.draw("Rectangle")},drawCircle:function(){this.draw("Circle")},drawLineString:function(){this.draw("LineString")},drawPolygon:function(){this.draw("Polygon")},maybeUpdateDrawInteractionMode:function(t){if(this.resetPendingAnnotation(),this.drawInteraction&&(this.map.removeInteraction(this.drawInteraction),this.drawInteraction=void 0),this.isDrawing&&this.hasSelectedLabel){var e=t.slice(4);this.pause(),this.drawInteraction=new ol.interaction.Draw({source:this.pendingAnnotationSource,type:e,style:biigle.$require("annotations.stores.styles").editing}),this.drawInteraction.on("drawend",this.extendPendingAnnotation),this.map.addInteraction(this.drawInteraction),this.pendingAnnotation.shape=e}},resetInteractionMode:function(){this.interactionMode="default"},finishDrawAnnotation:function(){this.$emit("create-annotation",this.pendingAnnotation),this.resetInteractionMode()},resetPendingAnnotation:function(){this.pendingAnnotationSource.clear(),this.pendingAnnotation={shape:"",frames:[],points:[]}},extendPendingAnnotation:function(t){var e=this.pendingAnnotation.frames[this.pendingAnnotation.frames.length-1];void 0===e||e<this.video.currentTime?(this.pendingAnnotation.frames.push(this.video.currentTime),this.pendingAnnotation.points.push(this.getPointsFromGeometry(t.feature.getGeometry()))):this.pendingAnnotationSource.once("addfeature",function(t){this.removeFeature(t.feature)})},handleFeatureSelect:function(t){this.$emit("select",t.selected.map(function(t){return t.get("annotation")}),t.selected.map(function(){return this.video.currentTime},this))},emitDelete:function(){this.canDelete&&this.hasSelectedAnnotations&&this.$emit("delete")}},watch:{selectedAnnotations:function(t){var e=this.annotationSource,n=this.selectedFeatures;if(e&&n){var i;n.clear(),t.forEach(function(t){(i=e.getFeatureById(t.id))&&n.push(i)})}}},created:function(){this.$once("map-ready",this.initLayersAndInteractions),this.map=this.createMap(),this.$emit("map-created",this.map);var t=biigle.$require("keyboard");this.canAdd&&(t.on("a",this.drawPoint,0,this.listenerSet),t.on("s",this.drawRectangle,0,this.listenerSet),t.on("d",this.drawCircle,0,this.listenerSet),t.on("f",this.drawLineString,0,this.listenerSet),t.on("g",this.drawPolygon,0,this.listenerSet),this.$watch("interactionMode",this.maybeUpdateDrawInteractionMode),t.on("b",this.emitCreateBookmark)),this.canDelete&&t.on("Delete",this.emitDelete);var e=this;biigle.$require("events").$on("sidebar.toggle",function(){e.$nextTick(function(){e.map.updateSize()})})},mounted:function(){this.map.setTarget(this.$el)}}),biigle.$component("videos.components.videoTimeline",{template:'<div class="video-timeline"><div class="static-strip"><div class="current-time" v-text="currentTimeString"></div><track-headers ref="trackheaders" :labels="labelMap" :lane-counts="laneCounts" :scroll-top="scrollTop"></track-headers></div><scroll-strip :annotations="annotations" :duration="duration" :current-time="currentTime" :bookmarks="bookmarks" @seek="emitSeek" @select="emitSelect" @deselect="emitDeselect" @update-tracks="handleUpdatedTracks" @scroll-y="handleScrollY"></scroll-strip></div>',components:{trackHeaders:biigle.$require("videos.components.trackHeaders"),scrollStrip:biigle.$require("videos.components.scrollStrip")},props:{annotations:{type:Array,default:function(){return[]}},video:{type:HTMLVideoElement,required:!0},bookmarks:{type:Array,default:function(){return[]}}},data:function(){return{animationFrameId:null,refreshRate:30,refreshLastTime:Date.now(),currentTime:0,currentTimeDate:new Date(0),currentTimeString:"00:00:00.000",duration:0,laneCounts:{},scrollTop:0}},computed:{labelMap:function(){var t={};return this.annotations.forEach(function(e){e.labels.forEach(function(e){t.hasOwnProperty(e.label_id)||(t[e.label_id]=e)})}),t}},methods:{startUpdateLoop:function(){var t=Date.now();t-this.refreshLastTime>=this.refreshRate&&(this.updateCurrentTime(),this.refreshLastTime=t),this.animationFrameId=window.requestAnimationFrame(this.startUpdateLoop)},stopUpdateLoop:function(){this.updateCurrentTime(),window.cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null},updateCurrentTime:function(){this.currentTime=this.video.currentTime,this.currentTimeDate.setTime(1e3*this.currentTime),this.currentTimeString=this.currentTimeDate.toISOString().split("T")[1].slice(0,-1)},setDuration:function(){this.duration=this.video.duration},emitSeek:function(t){this.$emit("seek",t)},emitSelect:function(t,e){this.$emit("select",t,e)},emitDeselect:function(){this.$emit("deselect")},handleUpdatedTracks:function(t,e){Vue.set(this.laneCounts,t,e)},handleScrollY:function(t){this.scrollTop=t}},watch:{},created:function(){this.video.addEventListener("play",this.startUpdateLoop),this.video.addEventListener("pause",this.stopUpdateLoop),this.video.addEventListener("loadedmetadata",this.setDuration),this.video.addEventListener("seeked",this.updateCurrentTime)},mounted:function(){}}),biigle.$component("videos.components.videoScreen.annotationPlayback",function(){return{data:function(){return{renderedAnnotationMap:{}}},computed:{annotationLength:function(){return this.annotations.length},annotationsPreparedToRender:function(){return this.annotations.map(function(t){return{id:t.id,start:t.frames[0],end:t.frames[t.frames.length-1],self:t}}).sort(function(t,e){return t.start-e.start})}},methods:{refreshAnnotations:function(t){var e=this.annotationSource,n=this.selectedFeatures,i=this.annotationsPreparedToRender,o=this.renderedAnnotationMap,a={};this.renderedAnnotationMap=a;for(var r,s=[],c=!1,l=0,d=i.length;l<d;l++)if(!(i[l].end<=t&&i[l].start!==t)){if(i[l].start>t)break;r=i[l],c=!0,o.hasOwnProperty(r.id)?(a[r.id]=o[r.id],delete o[r.id]):s.push(r.self)}c?Object.values(o).forEach(function(t){e.removeFeature(t),n.remove(t)}):(e.clear(),n.clear());var u=s.map(this.createFeature);u.forEach(function(t){a[t.getId()]=t,!1!==t.get("annotation").selected&&n.push(t)}),u.length>0&&e.addFeatures(u),Object.values(a).forEach(function(e){this.updateGeometry(e,t)},this)},createFeature:function(t){var e=new ol.Feature(this.getGeometryFromPoints(t.shape,t.points[0]));return e.setId(t.id),e.set("annotation",t),t.labels&&t.labels.length>0&&e.set("color",t.labels[0].label.color),e},updateGeometry:function(t,e){var n=t.get("annotation"),i=n.frames;if(!(i.length<=1)){var o;for(o=i.length-1;o>=0&&!(i[o]<=e);o--);var a=n.points,r=(e-i[o])/(i[o+1]-i[o]);t.setGeometry(this.getGeometryFromPoints(n.shape,this.interpolatePoints(n.shape,a[o],a[o+1],r)))}},interpolatePoints:function(t,e,n,i){switch(t){case"Rectangle":case"Ellipse":return this.interpolationPointsToRectangle(this.interpolatePoints("Point",this.rectangleToInterpolationPoints(e),this.rectangleToInterpolationPoints(n),i));case"LineString":case"Polygon":return this.interpolatePolymorph(this.pointsToSvgPath(e),this.pointsToSvgPath(n),i);default:return e.map(function(t,e){return t+(n[e]-t)*i})}},pointsToSvgPath:function(t){return t=t.slice(),t.unshift("M"),t.splice(3,0,"L"),t.join(" ")},interpolatePolymorph:function(t,e,n){return polymorph.interpolate([t,e])(n).replace(/[MCL\s]+/g," ").trim().split(" ").map(function(t){return parseInt(t,10)})},rectangleToInterpolationPoints:function(t){var e=[t[2]-t[0],t[3]-t[1]],n=[t[6]-t[0],t[7]-t[1]],i=Math.sqrt(n[0]*n[0]+n[1]*n[1]),o=Math.sqrt(e[0]*e[0]+e[1]*e[1]),a=[(t[0]+t[2]+t[4]+t[6])/4,(t[1]+t[3]+t[5]+t[7])/4],r=Math.sqrt(e[0]*e[0]+e[1]*e[1]),s=[e[0]/r,e[1]/r];return[a[0],a[1],s[0],s[1],i,o]},interpolationPointsToRectangle:function(t){var e=[t[0],t[1]],n=[t[2],t[3]],i=[-n[1],n[0]],o=t[4],a=t[5];return[e[0]-a/2*n[0]-o/2*i[0],e[1]-a/2*n[1]-o/2*i[1],e[0]+a/2*n[0]-o/2*i[0],e[1]+a/2*n[1]-o/2*i[1],e[0]+a/2*n[0]+o/2*i[0],e[1]+a/2*n[1]+o/2*i[1],e[0]-a/2*n[0]+o/2*i[0],e[1]-a/2*n[1]+o/2*i[1]]},getGeometryFromPoints:function(t,e){switch(e=this.convertPointsFromDbToOl(e),t){case"Point":return new ol.geom.Point(e[0]);case"Rectangle":return new ol.geom.Rectangle([e]);case"Polygon":return new ol.geom.Polygon([e]);case"LineString":return new ol.geom.LineString(e);case"Circle":return new ol.geom.Circle(e[0],e[1][0]);case"Ellipse":return new ol.geom.Ellipse([e]);default:return void console.error("Unknown annotation shape: "+t)}},getPointsFromGeometry:function(t){var e;switch(t.getType()){case"Circle":e=[t.getCenter(),[t.getRadius()]];break;case"Polygon":case"Rectangle":case"Ellipse":e=t.getCoordinates()[0];break;case"Point":e=[t.getCoordinates()];break;default:e=t.getCoordinates()}return this.convertPointsFromOlToDb(e)},invertPointsYAxis:function(t){for(var e=this.videoCanvas.height,n=1;n<t.length;n+=2)t[n]=e-t[n];return t},convertPointsFromOlToDb:function(t){return this.invertPointsYAxis(Array.prototype.concat.apply([],t))},convertPointsFromDbToOl:function(t){t=this.invertPointsYAxis(t.slice());for(var e=[],n=0;n<t.length;n+=2)e.push([t[n],t[n+1]||0]);return e}},watch:{},created:function(){this.$on("refresh",this.refreshAnnotations),this.$once("map-ready",function(){this.$watch("annotationLength",function(){this.refreshAnnotations(this.video.currentTime)})})}}}),biigle.$component("videos.components.videoScreen.videoPlayback",function(){return{data:function(){return{playing:!1,animationFrameId:null,refreshRate:30,refreshLastTime:Date.now()}},computed:{},methods:{initVideoLayer:function(t){var e=t[0];this.videoCanvas.width=this.video.videoWidth,this.videoCanvas.height=this.video.videoHeight;var n=[0,0,this.videoCanvas.width,this.videoCanvas.height],i=new ol.proj.Projection({code:"biigle-image",units:"pixels",extent:n});this.videoLayer=new ol.layer.Image({map:e,source:new ol.source.Canvas({canvas:this.videoCanvas,projection:i,canvasExtent:n,canvasSize:[n[0],n[1]]})}),e.setView(new ol.View({projection:i,minResolution:.25,extent:n})),e.getView().fit(n)},renderVideo:function(){this.videoCanvasCtx.drawImage(this.video,0,0,this.video.videoWidth,this.video.videoHeight),this.videoLayer.changed();var t=Date.now();t-this.refreshLastTime>=this.refreshRate&&(this.$emit("refresh",this.video.currentTime),this.refreshLastTime=t)},startRenderLoop:function(){this.renderVideo(),this.animationFrameId=window.requestAnimationFrame(this.startRenderLoop)},stopRenderLoop:function(){window.cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null},setPlaying:function(){this.playing=!0},setPaused:function(){this.playing=!1},togglePlaying:function(){this.playing?this.pause():this.play()},play:function(){this.video.play()},pause:function(){this.video.pause()},emitMapReady:function(){this.$emit("map-ready",this.map)}},watch:{playing:function(t){t&&!this.animationFrameId?this.startRenderLoop():t||this.stopRenderLoop()}},created:function(){this.videoCanvas=document.createElement("canvas"),this.videoCanvasCtx=this.videoCanvas.getContext("2d"),this.video.addEventListener("play",this.setPlaying),this.video.addEventListener("pause",this.setPaused),this.video.addEventListener("seeked",this.renderVideo),this.video.addEventListener("loadeddata",this.renderVideo);var t=this,e=new Vue.Promise(function(e,n){t.$once("map-created",e)}),n=new Vue.Promise(function(e,n){t.video.addEventListener("loadedmetadata",e),t.video.addEventListener("error",n)});Vue.Promise.all([e,n]).then(this.initVideoLayer).then(this.emitMapReady),biigle.$require("keyboard").on(" ",this.togglePlaying)}}});