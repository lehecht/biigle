<span class="dropdown dropdown-simple">
    <button type="button" class="btn btn-default">
        Version: <strong>{{$version->name}}</strong>
        <span class="caret"></span>
    </button>
    <ul class="dropdown-menu">
        <li><a href="{{route('label-trees', $masterTree->id)}}" title="Show latest version">latest</a></li>
        @foreach($masterTree->versions->sortByDesc('id') as $v)
            <?php if ($version->id === $v->id) continue; ?>
            <li><a href="{{route('label-tree-versions', [$masterTree->id, $v->id])}}" title="Show version {{$v->name}}">{{$v->name}}</a></li>
        @endforeach
    </ul>
</span>
