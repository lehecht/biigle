!function(e){var n={};function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)t.d(o,i,function(n){return e[n]}.bind(null,i));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/",t(t.s=1)}({1:function(e,n,t){e.exports=t("8ALi")},"8ALi":function(e,n,t){t("COrZ"),t("QPUB"),t("hGip")},COrZ:function(e,n,t){"use strict";t.r(n);var o=t("yoyj"),i=t("yz7H");Array.isArray(i.d)&&i.d.push({id:"annotations",label:"annotations",help:"All images that (don't) contain annotations.",listComponent:i.a,getSequence:function(e){return o.a.queryImagesWithAnnotations({id:e})}})},QPUB:function(e,n,t){"use strict";t.r(n);var o=t("yoyj"),i=t("yz7H");Array.isArray(i.d)&&i.d.push({id:"annotationLabels",label:"annotation with label",help:"All images that (don't) contain one or more annotations with the given label.",listComponent:{mixins:[i.a],data:function(){return{name:"annotation with label"}}},selectComponent:{mixins:[i.b],components:{typeahead:i.c},data:function(){return{placeholder:"Label name"}},created:function(){o.a.queryAnnotationLabels({id:this.volumeId}).then(this.gotItems,i.f)}},getSequence:function(e,n){return o.a.queryImagesWithAnnotationLabel({id:e,label_id:n.id})}})},hGip:function(e,n,t){"use strict";t.r(n);var o=t("yoyj"),i=t("yz7H");Array.isArray(i.d)&&i.d.push({id:"annotationUser",label:"annotations from user",help:"All images that (don't) contain one or more annotations from the given user.",listComponent:{mixins:[i.a],data:function(){return{name:"annotations from user"}}},selectComponent:{mixins:[i.b],data:function(){return{placeholder:"User name",typeaheadTemplate:'<span v-text="item.name"></span><br><small v-text="item.affiliation"></small>'}},created:function(){i.e.queryUsers({id:this.volumeId}).then(this.parseUsernames,i.f).then(this.gotItems)}},getSequence:function(e,n){return o.a.queryImagesWithAnnotationFromUser({id:e,user_id:n.id})}})},yoyj:function(e,n,t){"use strict";n.a=Vue.resource("api/v1/volumes{/id}",{},{queryImagesWithAnnotations:{method:"GET",url:"api/v1/volumes{/id}/images/filter/annotations"},queryImagesWithAnnotationLabel:{method:"GET",url:"api/v1/volumes{/id}/images/filter/annotation-label{/label_id}"},queryImagesWithAnnotationFromUser:{method:"GET",url:"api/v1/volumes{/id}/images/filter/annotation-user{/user_id}"},queryAnnotationLabels:{method:"GET",url:"api/v1/volumes{/id}/annotation-labels"}})},yz7H:function(e,n,t){"use strict";t.d(n,"a",(function(){return o})),t.d(n,"b",(function(){return i})),t.d(n,"c",(function(){return r})),t.d(n,"f",(function(){return a})),t.d(n,"d",(function(){return u})),t.d(n,"e",(function(){return s}));var o=biigle.$require("volumes.components.filterListComponent"),i=biigle.$require("volumes.components.filterSelectComponent"),r=biigle.$require("labelTrees.components.labelTypeahead"),a=biigle.$require("messages").handleErrorResponse,u=biigle.$require("volumes.stores.filters"),s=biigle.$require("api.volumes")}});