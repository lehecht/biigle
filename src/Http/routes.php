<?php


$router->get('annotate/{id}', [
    'middleware' => 'auth',
    'as'   => 'annotate',
    'uses' => 'AnnotationController@index',
]);

$router->get('annotate-vue/{id}', [
    'middleware' => 'auth',
    'as'   => 'annotate-vue',
    'uses' => 'AnnotationController@showVue',
]);

$router->get('annotations/{id}', [
    'middleware' => 'auth',
    'as'   => 'show-annotation',
    'uses' => 'AnnotationController@show',
]);

$router->group([
    'middleware' => 'auth.api',
    'namespace' => 'Api',
    'prefix' => 'api/v1',
    ], function ($router) {
        $router->get('volumes/{id}/images/filter/annotations', [
            'uses' => 'VolumeImageController@hasAnnotation',
        ]);

        $router->get('volumes/{id}/images/filter/annotation-user/{id2}', [
            'uses' => 'VolumeImageController@hasAnnotationUser',
        ]);

        $router->get('volumes/{id}/annotation-labels', [
            'uses' => 'VolumeLabelController@index',
        ]);
    });
