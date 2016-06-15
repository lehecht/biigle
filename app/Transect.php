<?php

namespace Dias;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Exception;
use Dias\Image;
use Dias\Jobs\GenerateThumbnails;
use Illuminate\Foundation\Bus\DispatchesJobs;

/**
 * A transect is a collection of images. Transects belong to one or many
 * projects.
 */
class Transect extends Model
{

    use DispatchesJobs;

    /**
     * Validation rules for creating a new transect.
     *
     * @var array
     */
    public static $createRules = [
        'name'          => 'required|max:512',
        'media_type_id' => 'required|exists:media_types,id',
        'url'           => 'required',
        'images'        => 'required',
    ];

    /**
     * Validation rules for updating a transect.
     *
     * @var array
     */
    public static $updateRules = [
        'name'          => 'filled|max:512',
        'media_type_id' => 'filled|exists:media_types,id',
        'url'           => 'filled',
    ];

    /**
     * Validation rules for adding new images to a transect.
     *
     * @var array
     */
    public static $addImagesRules = [
        'images' => 'required',
    ];

    /**
     * The attributes hidden from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'pivot',
        'attrs',
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'attrs' => 'array',
    ];

    /**
     * Parses a comma separated list of image filenames to an array
     *
     * @param string $string
     *
     * @return array
     */
    public static function parseImagesQueryString($string)
    {
        return preg_split('/\s*,\s*/', trim($string), null, PREG_SPLIT_NO_EMPTY);
    }

    /**
     * The user that created the transect.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function creator()
    {
        return $this->belongsTo('Dias\User');
    }

    /**
     * The media type of this transect.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mediaType()
    {
        return $this->belongsTo('Dias\MediaType');
    }

    /**
     * Sets the media type of this transect.
     *
     * @param Dias\MediaType $mediaType
     * @return void
     */
    public function setMediaType($mediaType)
    {
        $this->mediaType()->associate($mediaType);
    }

    /**
     * Sets the media type of this transect to the media type with the given ID.
     *
     * @param int $id media type ID
     * @return void
     */
    public function setMediaTypeId($id)
    {
        $type = MediaType::find($id);
        if ($type === null) {
            abort(400, 'The media type "'.$id.'" does not exist!');
        }
        $this->setMediaType($type);
    }

    /**
     * The images belonging to this transect.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function images()
    {
        return $this->hasMany('Dias\Image');
    }

    /**
     * Creates the image objects to be associated with this transect.
     *
     * @param array $filenames image filenames at the location of the transect URL
     *
     * @throws Exception If there was an error creating the images (e.g. if there were
     * duplicate filenames).
     *
     * @return bool
     */
    public function createImages($filenames)
    {
        $images = [];
        foreach ($filenames as $filename) {
            $images[] = ['filename' => $filename, 'transect_id' => $this->id];
        }

        try {
            return Image::insert($images);
        } catch (QueryException $e) {
            throw new Exception('A transect must not have the same image twice!');
        }
    }

    /**
     * (Re-) generates the thumbnail images for all images belonging to this transect
     *
     * @param array $only (optional) Array of image IDs to restrict the (re-)generation
     * of thumbnails to.
     */
    public function generateThumbnails($only = [])
    {
        $this->dispatch(new GenerateThumbnails($this, $only));
    }

    /**
     * The project(s), this transect belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function projects()
    {
        return $this->belongsToMany('Dias\Project');
    }
}
