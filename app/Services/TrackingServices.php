<?php

namespace App\Services;

use Carbon\Carbon;
use App\Http\Traits\TrackingTrait;

class TrackingServices {

    use TrackingTrait;

    /**
     * Get Page, Link, and Deleted Links stats for Current day
     *
     * @return array
     */
    public function getAllStats() {

        $startDate = Carbon::now()->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $pageArray = $this->getPageStats($startDate, $endDate);

        $linksArray = $this->getLinkStats($startDate, $endDate);

        $deletedArray = $this->getDeletedLinksStats($startDate, $endDate);

        return [
            'pageStats' => $pageArray,
            'linkStats' => $linksArray,
            'deletedStats' => $deletedArray
        ];
    }

    /**
     * Get Page stats from date range entered
     *
     * @param $request
     *
     * @return array
     */
    public function getPageDateRangeStats($request) {

        $startDate = Carbon::createFromTimestamp($request->startDate)->startOfDay();
        $endDate = Carbon::createFromTimestamp($request->endDate)->endOfDay();

        return $this->getPageStats($startDate, $endDate);
    }

    /**
     * Get Page stats from value in dropdown
     *
     * @param $request
     *
     * @return array
     */
    public function getPageStatsDropdown($request) {


        $data = $this->getDateRange($request->dateValue);

        $pageArray = $this->getPageStats($data['startDate'], $data['endDate']);

        return $pageArray;

    }

    /**
     * Get Link stats from date range entered
     *
     * @param $request
     *
     * @return array
     */
    public function getLinksDateRangeStats($request) {

        $startDate = Carbon::createFromTimestamp($request->startDate)->startOfDay();
        $endDate = Carbon::createFromTimestamp($request->endDate)->endOfDay();

        $currentData = $this->getLinkStats($startDate, $endDate);

        $pastData = $this->getDeletedLinksStats($startDate, $endDate);

        return [
            'currentData'=> $currentData,
            'pastData' => $pastData
        ];
    }

    public function getLinkStatsDropdown($request) {

        $data = $this->getDateRange($request->dateValue);

        $linksArray = $this->getLinkStats($data['startDate'], $data['endDate']);
        $deletedArray = $this->getDeletedLinksStats($data['startDate'], $data['endDate']);

        return [
            'linkStats' => $linksArray,
            'deletedStats' => $deletedArray
        ];
    }
}
