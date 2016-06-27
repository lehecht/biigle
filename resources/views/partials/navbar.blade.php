@inject('modules', 'Dias\Services\Modules')
<nav class="navbar navbar-default navbar-static-top">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand logo" href="{{ route('home') }}">
                <span class="logo__biigle">BIIGLE</span><sup class="logo__dias">DIAS</sup>
            </a>
        </div>
        @hasSection('navbar')
            <div class="navbar-left">
                @yield('navbar')
            </div>
        @endif
        <div class="navbar-right">
            <ul class="nav navbar-nav">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-menu-hamburger"></i> <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li class="dropdown-header">
                            Signed in as <strong>{{ auth()->user()->firstname }} {{ auth()->user()->lastname }}</strong>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <a href="{{ route('home') }}" title="Dashboard">Dashboard</a>
                        </li>
                        @foreach ($modules->getMixins('navbarMenuItem') as $module => $nestedMixins)
                            @include($module.'::navbarMenuItem')
                        @endforeach
                        @if (auth()->user()->isAdmin)
                            <li>
                                <a href="{{ route('admin') }}" title="Admin area">Admin area</a>
                            </li>
                        @endif
                        <li>
                            <a href="{{ route('manual') }}" title="{{ trans('dias.titles.manual') }}">{{ trans('dias.titles.manual') }}</a>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <a href="{{ route('settings') }}" title="{{ trans('dias.titles.settings') }}">{{ trans('dias.titles.settings') }}</a>
                        </li>
                        <li>
                            <a href="{{ url('auth/logout') }}" title="{{ trans('dias.titles.logout') }}">{{ trans('dias.titles.logout') }}</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
