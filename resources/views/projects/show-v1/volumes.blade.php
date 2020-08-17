<div id="projects-show-volume-list" class="panel panel-default" v-bind:class="{'panel-warning':editing}" v-bind:style="panelStyle">
    <div class="panel-heading">
        Volumes
        <span class="pull-right">
            @can('update', $project)
                <loader :active="loading"></loader>
            @endcan
            <form v-cloak v-if="hasVolumes" class="panel-filter" :class="filterInputClass">
                <span class="form-group has-feedback">
                    <input class="form-control input-sm" type="text" name="filter" placeholder="Filter volumes" v-model="filterString" v-on:keyup.esc="clearFiltering">
                    <span v-cloak v-show="hasFiltering" v-on:click="clearFiltering" title="Clear filtering" class="form-control-feedback" aria-hidden="true"><i class="fas fa-times fa-sm"></i></span>
                </span>
            </form>
            @can('update', $project)
                @if(Route::has('create-volume'))
                    <a href="{{ route('create-volume') }}?project={{ $project->id }}" class="btn btn-default btn-xs" title="Create a new volume"><span class="fa fa-plus" aria-hidden="true"></span></a>
                @endif
                <button class="btn btn-default btn-xs" title="Edit volumes" v-cloak v-on:click="toggleEditing"><span class="fa fa-pencil-alt" aria-hidden="true"></span></button>
            @endcan
        </span>
    </div>
    @can('update', $project)
        <div class="panel-body" v-if="editing" v-cloak>
            <form>
                <label>Volume to attach</label>
                <typeahead class="typeahead--block" :items="attachableVolumes" placeholder="Volume name" v-on:select="attachVolume" :clear-on-select="true"></typeahead>
                <p class="help-block">
                    Volumes can be shared between projects. Here you can attach volumes from other projects to this project. To attach a volume, you need to be admin in one of the projects, the volume is already attached to.
                </p>
            </form>
        </div>
    @endcan
    <div class="panel-body container-fluid volumes-grid">
        <div class="row">
            <div class="col-sm-6" v-for="volume in filteredVolumes" v-bind:key="volume.id" v-cloak>
                <a v-bind:href="'{{route('volume', '')}}/'+volume.id" v-bind:title="'Show volume '+volume.name">
                    <preview-thumbnail class="preview-thumbnail--projects" v-bind:id="volume.id" :thumb-uris="volume.thumbnailsUrl" @can('update', $project) v-bind:removable="editing" v-bind:remove-title="'Detach volume '+volume.name" @endcan v-on:remove="removeVolume" :icon="volume.icon">
                        <img v-bind:src="volume.thumbnailUrl" onerror="this.src='{{ asset(config('thumbnails.empty_url')) }}'">
                        <figcaption slot="caption" v-text="volume.name"></figcaption>
                    </preview-thumbnail>
                </a>
            </div>
        </div>
        <span class="text-muted" v-if="hasNoMatchingVolumes" v-cloak>No volume matches this query.</span>
        <span class="text-muted" v-if="!hasVolumes" v-cloak>This project has no volumes.</span>
    </div>
</div>