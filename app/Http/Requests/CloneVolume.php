<?php

namespace Biigle\Http\Requests;

use Biigle\Image;
use Biigle\ImageAnnotation;
use Biigle\ImageAnnotationLabel;
use Biigle\ImageLabel;
use Biigle\Project;
use Biigle\Rules\Handle;
use Biigle\Rules\VolumeUrl;
use Biigle\Video;
use Biigle\VideoAnnotation;
use Biigle\VideoAnnotationLabel;
use Biigle\VideoLabel;
use Biigle\Volume;
use \Illuminate\Foundation\Http\FormRequest;

class CloneVolume extends FormRequest
{
    /**
     * The volume to clone.
     *
     * @var Volume
     */
    public $volume;

    /**
     * The project to update.
     *
     * @var Project
     */
    public $project;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $this->volume = Volume::findOrFail($this->route('id'));
        $this->project = Project::findOrFail($this->route('id2'));

        return $this->user()->can('update', $this->project) &&
            $this->user()->can('update', $this->volume);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'max:512',
            'file_ids' => 'array',
            'file_ids.*' => 'int|gte:0',
            'label_ids' => 'array',
            'label_ids.*' => 'int|gte:0',
            'file_label_ids' => 'array',
            'file_label_ids.*' => 'int|gte:0'
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    public function withValidator($validator)
    {
        if ($validator->fails()) {
            return;
        }

        $validator->after(function ($validator) {
            $fileIds = $this->input('file_ids', []);

            if (!empty($fileIds)) {

                $volume = $this->volume;
                $fileLabelIds = $this->input('file_label_ids', []);
                $annotationLabelIds = $this->input('label_ids', []);

                //check selected file ids
                if (!$this->filesBelongToVolume($fileIds, $volume->id, $volume->isImageVolume())) {
                    $validator->error()->add('file_ids', 'Unauthorized access to files that do not belong to the volume');
                }

                //check selected file label ids
                $fileLabelFileIds = $volume->isImageVolume() ?
                    ImageLabel::findOrFail($fileLabelIds)->pluck('image_id')->toArray() :
                    VideoLabel::findOrFail($fileLabelIds)->pluck('video_id')->toArray();
                $fileLabelFileIds = array_unique($fileLabelFileIds);

                if (!empty($fileLabelFileIds) &&
                    !$this->filesBelongToVolume($fileLabelFileIds, $volume->id, $volume->isImageVolume())) {
                    $validator->error()->add('$fileLabelFileIds',
                        'Unauthorized access to labels that do not belong to the volume');
                }

                //check selected annotation label ids
                $fileAnnotationIds = $volume->isImageVolume() ?
                    ImageAnnotationLabel::findOrFail($annotationLabelIds)->pluck('annotation_id')->toArray() :
                    VideoAnnotationLabel::findOrFail($annotationLabelIds)->pluck('annotation_id')->toArray();
                $fileAnnotationIds = array_unique($fileAnnotationIds);

                $annotationLabelFileIds = $volume->isImageVolume() ?
                    ImageAnnotation::findOrFail($fileAnnotationIds)->pluck('image_id')->toArray() :
                    VideoAnnotation::findOrFail($fileAnnotationIds)->pluck('video_id')->toArray();
                $annotationLabelFileIds = array_unique($annotationLabelFileIds);

                if (!empty($annotationLabelFileIds) &&
                    !$this->filesBelongToVolume($annotationLabelFileIds, $volume->id, $volume->isImageVolume())) {
                    $validator->error()->add('$fileLabelFileIds',
                        'Unauthorized access to annotation labels that do not belong to the volume');
                }

            }
        });
    }

    function filesBelongToVolume($fileIds, $volumeId, $isImageVolume)
    {
        $fileVolumeIds = $isImageVolume ?
            Image::findOrFail($fileIds)->pluck('volume_id') :
            Video::findOrFail($fileIds)->pluck('volume_id');
        $fileVolumeIds = array_unique($fileVolumeIds->toArray());

        if (count($fileVolumeIds) > 1 || $fileVolumeIds[0] != $volumeId) {
            return false;
        }
        return true;
    }


}
