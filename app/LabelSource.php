<?php

namespace Dias;

use Illuminate\Database\Eloquent\Model;

/**
 * The source (database) of a label.
 */
class LabelSource extends Model
{
    /**
     * Validation rules for finding a label from a label source
     *
     * @var array
     */
    public static $findRules = [
        'query' => 'required',
    ];

    /**
     * Don't maintain timestamps for this model.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Returns the label source adapter of this label source.
     *
     * If the name is `worms`, the adapter will be
     * `Dias\Services\LabelSourceAdapters\WormsAdapter`.
     * If the name is `ab_cd`, the adapter will be
     * `Dias\Services\LabelSourceAdapters\AbCdAdapter`.
     *
     * @return \Dias\Contracts\LabelSourceAdapterContract
     */
    public function getAdapter()
    {
        $name = studly_case($this->name);
        return app()->make("Dias\Services\LabelSourceAdapters\\{$name}Adapter");
    }
}