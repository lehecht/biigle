<?php

namespace Dias\Jobs;

use File;
use Exception;
use Carbon\Carbon;
use Dias\Jobs\Job;
use Dias\Transect;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class CollectImageMetaInfo extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    /**
     * The transect for which the image meta info should be collected.
     *
     * @var Transect
     */
    private $transect;

    /**
     * Array of image IDs to restrict the collecting of meta info to.
     * If it is empty, all images of the transect will be taken.
     *
     * @var array
     */
    private $only;

    /**
     * Create a new job instance.
     *
     * @param Transect $transect The transect for which the image meta info should be collected.
     *
     * @return void
     */
    public function __construct(Transect $transect, array $only = [])
    {
        $this->transect = $transect;
        $this->only = $only;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Not supported for remote transects.
        if ($this->transect->isRemote()) {
            return;
        }

        $images = $this->transect->images()
            ->select('id', 'filename')
            ->when($this->only, function ($query) {
                return $query->whereIn('id', $this->only);
            })
            ->get();

        foreach ($images as $image) {
            $file = $this->transect->url.'/'.$image->filename;
            if (!File::exists($file)) continue;

            $exif = exif_read_data($file);
            if ($exif === false) continue;

            if ($this->hasTakenAtInfo($exif)) {
                try {
                    $image->taken_at = new Carbon($exif['DateTimeOriginal']);
                } catch (Exception $e) {
                    // date could not be parsed
                    $image->taken_at = null;
                }
            }

            if ($this->hasGpsInfo($exif)) {
                $image->lng = $this->getGps($exif['GPSLongitude'], $exif['GPSLongitudeRef']);
                $image->lat = $this->getGps($exif['GPSLatitude'], $exif['GPSLatitudeRef']);

                // It is unlikely that the position is exactly 0. More likely is a false
                // position if the camera sets 0 as "no position detected". So we assume
                // the image has no position information in this case.
                if ($image->lng === 0 && $image->lat === 0) {
                    $image->lng = null;
                    $image->lat = null;
                }
            }

            $image->save();
        }

        $this->transect->flushGeoInfoCache();
    }

    /**
     * Check if an exif array contains a creation date
     *
     * @param  array   $exif
     * @return boolean
     */
    protected function hasTakenAtInfo(array $exif)
    {
        return array_key_exists('DateTimeOriginal', $exif);
    }

    /**
     * Check if an exif array contains GPS information
     *
     * @param  array   $exif
     * @return boolean
     */
    protected function hasGpsInfo(array $exif)
    {
        return array_key_exists('GPSLatitude', $exif) &&
            array_key_exists('GPSLatitudeRef', $exif) &&
            array_key_exists('GPSLongitude', $exif) &&
            array_key_exists('GPSLongitudeRef', $exif);
    }

    /**
     * Converts a EXIF GPS coordinate to a float
     * see: http://stackoverflow.com/a/2572991/1796523
     *
     * @param  array $exifCoord Containing fractures like `"41/1"`
     * @param  string $hemi      Hemisphere, one of `N`, `S`, `E`, or `W`
     * @return float
     */
    protected function getGps($exifCoord, $hemi)
    {
        $fracs = count($exifCoord);
        $degrees = $fracs > 0 ? $this->fracToFloat($exifCoord[0]) : 0;
        $minutes = $fracs > 1 ? $this->fracToFloat($exifCoord[1]) : 0;
        $seconds = $fracs > 2 ? $this->fracToFloat($exifCoord[2]) : 0;
        $flip = ($hemi === 'W' || $hemi === 'S') ? -1 : 1;

        return $flip * ($degrees + $minutes / 60 + $seconds / 3600);
    }

    /**
     * Converts a fracture (string) like "1/2" to a float.
     *
     * @param  [type] $frac
     * @return float
     */
    protected function fracToFloat($frac)
    {
        $parts = explode('/', $frac);
        if (count($parts) <= 0) return 0;
        if (count($parts) === 1) return $parts[0];

        return floatval($parts[0]) / floatval($parts[1]);
    }
}
