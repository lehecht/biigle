<?php

namespace Biigle\Tests\Http\Controllers\Views;

use TestCase;
use Biigle\Role;
use Biigle\Image;
use Biigle\Volume;
use Biigle\Tests\UserTest;
use Biigle\Tests\VolumeTest;
use Biigle\Tests\ProjectTest;
use Illuminate\Support\Facades\View;
use Biigle\Tests\AnnotationLabelTest;
use Biigle\Http\Controllers\Views\DashboardController;

class DashboardControllerTest extends TestCase
{
    public function testDashboard()
    {
        $this->get('/')->assertRedirect('login');
        $user = UserTest::create();
        $this->actingAs($user)->get('/')->assertSee('Signed in as');
    }

    public function testLandingPage()
    {
        View::getFinder()->addLocation(__DIR__.'/templates');
        $this->get('/')->assertSee('Landing Page');
        $user = UserTest::create();
        $this->actingAs($user)->get('/')
            ->assertSee('Signed in as')
            ->assertDontSee('Landing Page');
    }

    public function testVolumeActivityItems()
    {
        $controller = new DashboardController;
        $user = UserTest::create();

        $items = $controller->volumesActivityItems($user, 1);
        $this->assertEmpty($items);

        $v = VolumeTest::create(['creator_id' => $user->id]);
        VolumeTest::create(['creator_id' => $user->id]);
        VolumeTest::create(['creator_id' => $user->id]);
        $items = $controller->volumesActivityItems($user, 1);
        $this->assertCount(1, $items);
        $this->assertArrayHasKey('item', $items[0]);
        $this->assertArrayHasKey('created_at', $items[0]);
        $this->assertArrayHasKey('include', $items[0]);
        $this->assertInstanceOf(Volume::class, $items[0]['item']);

        $items = $controller->volumesActivityItems($user, 3);
        $this->assertCount(3, $items);

        $v->created_at = $v->created_at->subDay();
        $v->save();
        $items = $controller->volumesActivityItems($user, 3, $v->created_at);
        $this->assertCount(2, $items);
    }

    public function testAnnotationsActivityItems()
    {
        $controller = new DashboardController;
        $user = UserTest::create();

        $items = $controller->annotationsActivityItems($user, 1);
        $this->assertEmpty($items);

        $a = AnnotationLabelTest::create(['user_id' => $user->id]);
        AnnotationLabelTest::create(['user_id' => $user->id]);
        AnnotationLabelTest::create(['user_id' => $user->id]);
        $items = $controller->annotationsActivityItems($user, 1);
        $this->assertCount(1, $items);
        $this->assertArrayHasKey('item', $items[0]);
        $this->assertArrayHasKey('created_at', $items[0]);
        $this->assertArrayHasKey('include', $items[0]);
        $this->assertInstanceOf(Image::class, $items[0]['item']);

        $items = $controller->annotationsActivityItems($user, 3);
        $this->assertCount(3, $items);

        $a->created_at = $a->created_at->subDay();
        $a->save();
        $items = $controller->annotationsActivityItems($user, 3, $a->created_at);
        $this->assertCount(2, $items);

        AnnotationLabelTest::create([
            'user_id' => $user->id,
            'annotation_id' => $a->annotation_id,
        ]);

        $items = $controller->annotationsActivityItems($user, 3);
        $this->assertCount(3, $items);
    }
}
