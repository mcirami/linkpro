<?php

namespace App\Services;

use App\Http\Traits\StatsTrait;
use Carbon\Carbon;

class StatsServices {

    use StatsTrait;

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

        $folderArray = $this->getFolderStats($startDate, $endDate);

        return [
            'pageStats' => $pageArray,
            'linkStats' => $linksArray,
            'deletedStats' => $deletedArray,
            'folderStats' => $folderArray
        ];
    }

    /**
     * Get Page stats for Current day
     *
     * @return array
     */
    public function getTodaysPageStats() {
        $startDate = Carbon::now()->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        return $this->getPageStats($startDate, $endDate);

    }

    /**
     * Get Page stats from date range entered
     *
     * @param $request
     *
     * @return array
     */
    public function getPageDateRangeStats($request) {

        if ($request->dateValue) {
            $dateValues = $this->getDateRange($request->dateValue);

            $data = $this->getPageStats($dateValues['startDate'], $dateValues['endDate']);
        } else{
            $startDate = Carbon::createFromTimestamp($request->startDate)->startOfDay();
            $endDate = Carbon::createFromTimestamp($request->endDate)->endOfDay();

            $data = $this->getPageStats($startDate, $endDate);
        }

        return $data;
    }

    /**
     * Get Link stats for Current day
     *
     * @return array
     */
    public function getTodaysLinkStats() {
        $startDate = Carbon::now()->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        return $this->getLinkStats($startDate, $endDate);

    }

    /**
     * Get Link stats from date range entered
     *
     * @param $request
     *
     * @return array
     */
    public function getLinksDateRangeStats($request) {

        if ($request->dateValue) {
            $data = $this->getDateRange($request->dateValue);

            $currentData = $this->getLinkStats($data['startDate'], $data['endDate']);
            $pastData = $this->getDeletedLinksStats($data['startDate'], $data['endDate']);

        } else {

            $startDate = Carbon::createFromTimestamp($request->startDate)->startOfDay();
            $endDate = Carbon::createFromTimestamp($request->endDate)->endOfDay();

            $currentData = $this->getLinkStats($startDate, $endDate);
            $pastData = $this->getDeletedLinksStats($startDate, $endDate);
        }



        return [
            'currentData'=> $currentData,
            'pastData' => $pastData
        ];
    }

    /**
     * Get Deleted link stats for Current day
     *
     * @return array
     */
    public function getTodaysDeletedStats() {
        $startDate = Carbon::now()->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        return $this->getDeletedLinksStats($startDate, $endDate);

    }

    /**
     * Get Deleted link stats for Current day
     *
     * @return array
     */
    public function getTodaysFolderStats() {
        $startDate = Carbon::now()->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        return $this->getFolderStats($startDate, $endDate);

    }

    public function getFolderDateRangeStats($request) {

        if ($request->dateValue) {
            $data = $this->getDateRange($request->dateValue);

            $currentData = $this->getFolderStats($data['startDate'], $data['endDate']);
            /*$pastData = $this->getDeletedLinksStats($data['startDate'], $data['endDate']);*/

        } else {

            $startDate = Carbon::createFromTimestamp($request->startDate)->startOfDay();
            $endDate = Carbon::createFromTimestamp($request->endDate)->endOfDay();

            $currentData = $this->getFolderStats($startDate, $endDate);
            /*$pastData = $this->getDeletedLinksStats($startDate, $endDate);*/
        }



        return [
            'currentData'=> $currentData,
            /*'pastData' => $pastData*/
        ];
    }
}
