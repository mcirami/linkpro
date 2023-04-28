<?php

namespace App\Services;

use App\Http\Traits\StatsTrait;
use Carbon\Carbon;

class StatsServices {

    use StatsTrait;

    /**
     * Get Page stats from date range entered
     *
     * @param $request
     *
     * @return array
     */
    public function getAllPageStats($request) {

        if($request->currentDay) {
            $startDate = Carbon::now()->startOfDay();
            $endDate = Carbon::now()->endOfDay();

            return $this->getPageStats($startDate, $endDate);

        } else if ($request->dateValue) {
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
     * Get Link stats from date range entered
     *
     * @param $request
     *
     * @return array
     */
    public function getAllLinkStats($request) {

        if ($request->currentDay) {
            $startDate = Carbon::now()->startOfDay();
            $endDate = Carbon::now()->endOfDay();

            $currentData = $this->getLinkStats($startDate, $endDate);
            $pastData = $this->getDeletedLinksStats($startDate, $endDate);

        } else if ($request->dateValue) {
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

    public function getAllFolderStats($request) {

        if ($request->currentDay) {
            $startDate = Carbon::now()->startOfDay();
            $endDate = Carbon::now()->endOfDay();

            $currentData = $this->getFolderStats($startDate, $endDate);
            //$pastData = $this->getDeletedLinksStats($startDate, $endDate);

        } else if ($request->dateValue) {
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

    public function getAllOfferStats($request) {

        if ($request->currentDay) {
            $startDate = Carbon::now()->startOfDay();
            $endDate = Carbon::now()->endOfDay();

            $offerData = $this->getOfferStats($startDate, $endDate);

        } else if ($request->dateValue) {
            $data = $this->getDateRange($request->dateValue);

            $offerData = $this->getOfferStats($data['startDate'], $data['endDate']);

        } else {

            $startDate = Carbon::createFromTimestamp($request->startDate)->startOfDay();
            $endDate = Carbon::createFromTimestamp($request->endDate)->endOfDay();

            $offerData = $this->getOfferStats($startDate, $endDate);
        }

        return [
            'affiliateData'      => $offerData['offerArray'],
            'totals'         => $offerData['totals']
        ];
    }

    public function getAllPublisherStats($request) {

        if ($request->currentDay) {
            $startDate = Carbon::now()->startOfDay();
            $endDate = Carbon::now()->endOfDay();

            $publisherData = $this->getAffiliateStats($startDate, $endDate);

        } else if ($request->dateValue) {

            $data = $this->getDateRange($request->dateValue);

            $publisherData = $this->getAffiliateStats($data['startDate'], $data['endDate']);

        } else {

            $startDate = Carbon::createFromTimestamp($request->startDate)->startOfDay();
            $endDate = Carbon::createFromTimestamp($request->endDate)->endOfDay();

            $publisherData = $this->getAffiliateStats($startDate, $endDate);
        }

        return [
            'affiliateData' => $publisherData['publisherStats'],
            'totals'        => $publisherData['totals']
        ];
    }
}
