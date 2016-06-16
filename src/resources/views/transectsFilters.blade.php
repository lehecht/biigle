<script data-ng-controller="AnnotationsFilterController" type="text/ng-template" id="annotationsFilterRule.html">
@{{rule.filter.name}}
</script>

<script data-ng-controller="AnnotationsUserFilterController" type="text/ng-template" id="annotationLabelByUserFilterRule.html">
@{{rule.filter.name}} <strong>@{{rule.data.firstname}} @{{rule.data.lastname}}</strong>
</script>

<script type="text/ng-template" id="annotationUserFilterTypeahead.html">
    <input class="form-control" placeholder="Select user" data-transect-annotation-user-chooser="selectData" data-transect-id="{{$transect->id}}" />
</script>

<script data-ng-controller="AnnotationsLabelFilterController" type="text/ng-template" id="annotationWithLabelFilterRule.html">
@{{rule.filter.name}} <strong>@{{rule.data.name}}</strong>
</script>

<script type="text/ng-template" id="annotationLabelFilterTypeahead.html">
    <input class="form-control" placeholder="Select label" data-transect-annotation-label-chooser="selectData" data-transect-id="{{$transect->id}}" />
</script>
