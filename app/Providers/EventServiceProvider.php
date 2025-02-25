<?php

namespace Biigle\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        \Biigle\Events\ImagesDeleted::class => [
            \Biigle\Listeners\CleanupImageThumbnails::class,
        ],
        \Biigle\Events\TiledImagesDeleted::class => [
            \Biigle\Listeners\CleanupImageTiles::class,
        ],
        \Biigle\Events\VideosDeleted::class => [
            \Biigle\Listeners\CleanupVideoThumbnails::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        \Biigle\Project::observe(new \Biigle\Observers\ProjectObserver);
        \Biigle\Volume::observe(new \Biigle\Observers\VolumeObserver);
        \Biigle\Image::observe(new \Biigle\Observers\ImageObserver);
        \Biigle\Video::observe(new \Biigle\Observers\VideoObserver);
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return false;
    }
}
