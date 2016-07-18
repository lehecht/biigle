<?php

namespace Dias\Http\Controllers\Api;

use Dias\LabelSource;

class LabelSourceController extends Controller
{
    /**
     * Find labels from a label source
     *
     * @api {get} label-sources/:id/find Find labels from external sources
     * @apiGroup Label Trees
     * @apiName FondLabelTreesLabelSources
     * @apiDescription Returns an array with one object for each matching label. The label
     * objects may contain arbitrary data, depending on the label source.
     *
     * @apiParam {Number} id The label source ID
     *
     * @return \Illuminate\Http\Response
     */
    public function find($id)
    {
        $source = LabelSource::findOrFail($id);
        $this->validate($this->request, LabelSource::$findRules);

        return $source->getAdapter()->find($this->request->input('query'));
    }
}