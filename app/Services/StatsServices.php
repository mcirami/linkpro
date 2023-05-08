<?php

namespace App\Services;

use App\Http\Traits\StatsTrait;
use App\Http\Traits\DateTrait;
use App\Models\Folder;
use App\Models\FolderClick;
use App\Models\Link;
use App\Models\LinkVisit;
use App\Models\Offer;
use App\Models\OfferClick;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StatsServices {

    use StatsTrait, DateTrait;

    /**
     * Get Page stats from date range entered
     *
     * @param $request
     *
     * @return array
     */
    public function getAllPageStats($request) {

        $dates = $this->getDateValues($request);

        return $this->getPageStats($dates["startDate"], $dates["endDate"]);

    }

    /**
     * Get Link stats from date range entered
     *
     * @param $request
     *
     * @return array
     */
    public function getAllLinkStats($request) {

        $dates = $this->getDateValues($request);

        $currentData = $this->getLinkStats($dates["startDate"], $dates["endDate"]);
        $pastData = $this->getDeletedLinksStats($dates["startDate"], $dates["endDate"]);

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
    /*public function getTodaysDeletedStats() {
        $startDate = Carbon::now()->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        return $this->getDeletedLinksStats($startDate, $endDate);

    }*/

    public function getAllFolderStats($request) {

        $dates = $this->getDateValues($request);

        $currentData = $this->getFolderStats($dates["startDate"], $dates["endDate"]);
        //$pastData = $this->getDeletedLinksStats($dates["startDate"], $dates["endDate"]);

        return [
            'currentData'=> $currentData,
            /*'pastData' => $pastData*/
        ];
    }

    public function getAllOfferStats($request) {

        $dates = $this->getDateValues($request);

        $offerData = $this->getOfferStatsByDate($dates["startDate"], $dates["endDate"]);

        return [
            'affiliateData'      => $offerData['offerArray'],
            'totals'         => $offerData['totals']
        ];
    }

    private function getOfferStatsByDate($startDate, $endDate) {

        $authUserID = Auth::user()->id;
        $offers = Offer::where('published', true)->get();

        $offerArray = array();
        $totalsArray = array();

        foreach ($offers as $offer) {

            if ($offer->user_id != $authUserID) {

                $object = $this->getPublisherOfferStats($authUserID, $startDate, $endDate, $offer);

                if (!empty($object)) {
                    $totalsArray = $this->sumTotals( $totalsArray, $object, null );
                    array_push( $offerArray, $object );
                }

            } else {

                $object = $this->getCreatorOfferStats($authUserID, $startDate, $endDate, $offer);

                if (!empty($object)) {
                    $totalsArray = $this->sumTotals( $totalsArray, $object, null );
                    array_push($offerArray, $object );
                }
            }
        }

        return [
            'offerArray'    => $offerArray,
            'totals'        => $totalsArray
        ];
    }

    private function getCreatorOfferStats($authUserID, $startDate, $endDate, $offer) {

        $object = [];

        $offerClicks = $offer
            ->OfferClicks()
            ->whereBetween('offer_clicks.created_at', [ $startDate, $endDate ])
            ->leftJoin('users', 'users.id', '=', 'offer_clicks.referral_id')
            ->leftJoin('purchases', 'purchases.offer_click_id', '=', 'offer_clicks.id')
            ->select('users.username', 'offer_clicks.is_unique', 'offer_clicks.referral_id', 'purchases.purchase_amount')
            ->get();

        if (count($offerClicks) > 0) {

            $payout = $this->calculatePayout($offerClicks, $offer->price, $authUserID);
            $conversionCount = $this->countConversions($offerClicks->toArray());

            $userStats = $this->groupStatsByUser($offerClicks, $authUserID);

            $count = $offerClicks->countBy(function ($click) {
                return $click['is_unique'];
            })->toArray();

            $object = [
                'icon'              => $offer->icon,
                'rawCount'          => array_key_exists(0, $count) ? $count[0] : 0,
                'uniqueCount'       => array_key_exists(1, $count) ? $count[1] : 0,
                'conversionCount'   => $conversionCount,
                'payout'            => $payout,
                'userStats'         => $userStats,
            ];
        }

        return $object;
    }
    private function getPublisherOfferStats($authUserID, $startDate, $endDate, $offer) {


        $object = [];
        $offerClicks = $offer
            ->OfferClicks()
            ->where( 'referral_id', '=', $authUserID )
            ->whereBetween('offer_clicks.created_at', [ $startDate, $endDate ])
            ->leftJoin('users', 'users.id', '=', 'offer_clicks.referral_id')
            ->leftJoin('purchases', 'purchases.offer_click_id', '=', 'offer_clicks.id')
            ->select('users.username', 'offer_clicks.is_unique', 'offer_clicks.referral_id', 'purchases.purchase_amount')
            ->get();

        if (count($offerClicks) > 0) {
            $payout = $this->calculatePayout($offerClicks, $offer->price, $offer->user_id);
            $conversionCount = $this->countConversions($offerClicks->toArray());

            $count = $offerClicks->countBy(function ($click) {
                return $click['is_unique'];
            })->toArray();

            $object = [
                'icon'              => $offer->icon,
                'rawCount'          => array_key_exists(0, $count) ? $count[0] : 0,
                'uniqueCount'       => array_key_exists(1, $count) ? $count[1] : 0,
                'conversionCount'   => $conversionCount,
                'payout'            => $payout,
            ];
        }

        return $object;
    }

    public function getAllPublisherStats($request) {

        $dates = $this->getDateValues($request);

        $publisherData = $this->getPubStatsByDate($dates["startDate"], $dates["endDate"]);

        return [
            'affiliateData' => $publisherData['publisherStats'],
            'totals'        => $publisherData['totals'],
        ];
    }

    private function getPubStatsByDate($startDate, $endDate) {

        $authUserID = Auth::user()->id;
        $totalsArray = array();
        $publisherStats = array();

        $clicks = OfferClick::whereBetween('offer_clicks.created_at', [ $startDate, $endDate ])
                            ->where('offer_clicks.referral_id', '=', $authUserID)
                            ->orWhere(function ($query) use($authUserID, $startDate, $endDate) {
                                $query->join('offers','offer_clicks.offer_id', '=', 'offers.id')
                                      ->where('offers.user_id', '=', $authUserID)
                                      ->whereBetween('offer_clicks.created_at', [ $startDate, $endDate ]);
                            })
                            ->leftJoin('offers', 'offer_clicks.offer_id', '=', 'offers.id')
                            ->leftJoin('users', 'users.id', '=', 'offer_clicks.referral_id')
                            ->leftJoin('purchases', 'purchases.offer_click_id', '=', 'offer_clicks.id')
                            ->select('users.username', 'offer_clicks.is_unique', 'offers.user_id', 'offer_clicks.referral_id', 'purchases.purchase_amount')
                            ->get();


        if (count($clicks) > 0) {
            $publisherStats = $this->groupStatsByUser( $clicks );
            $totalsArray    = $this->sumTotals( $totalsArray, null, $publisherStats );
        }

        return [
            'publisherStats'    => $publisherStats,
            'totals'            => $totalsArray,
        ];
    }

    private function getPageStats($startDate, $endDate) {

        $user = Auth::user();

        $pages = $user->pages()->get();
        $pageArray = [];

        foreach($pages as $page) {
            $visitCount = count($page->pageVisits()->whereBetween('created_at', [ $startDate, $endDate ])->get());
            $linkVisitCount = count(
                LinkVisit::whereBetween('created_at', [ $startDate, $endDate ])->where('page_id', $page->id)->get()
            );
            $object = [
                "id"            => $page->id,
                "pageName"      => $page->name,
                "visits"        => $visitCount,
                "linkVisits"    => $linkVisitCount
            ];
            array_push($pageArray, $object);
        }

        return $pageArray;
    }

    private function getLinkStats($startDate, $endDate) {
        $user = Auth::user();

        $links = $user->links()->where('folder_id', null)->get();
        $linksArray = [];

        foreach($links as $link) {

            if ($link->name && $link->icon) {
                $visitCount = count(
                    $link->linkVisits()->whereBetween('created_at', [ $startDate, $endDate ])->get()
                );
                $object     = [
                    "id"        => $link->id,
                    "iconName"  => $link->name,
                    "icon"      => $link->icon,
                    "visits"    => $visitCount
                ];
                array_push( $linksArray, $object );
            };
        }

        return $linksArray;
    }

    private function getDeletedLinksStats($startDate, $endDate) {
        $deletedArray = [];

        $deletedLinks = DB::table('deleted_links')->where('user_id', '=', Auth::id())->get();
        foreach ($deletedLinks as $deletedLink) {
            $visitCount = count(
                LinkVisit::whereBetween('created_at', [ $startDate, $endDate ])->where('link_id', $deletedLink->link_id)->get()
            );
            $object     = [
                "id"        => $deletedLink->id,
                "iconName"  => $deletedLink->name,
                "icon"      => $deletedLink->icon,
                "visits"    => $visitCount
            ];
            array_push( $deletedArray, $object );
        }

        return $deletedArray;
    }
    private function getFolderStats($startDate, $endDate) {

        $folderArray = [];

        $folders = Folder::where('user_id', '=', Auth::id())->get();

        foreach ($folders as $folder) {
            $folderClickCount = count(
                FolderClick::whereBetween('created_at', [ $startDate, $endDate ])->where('folder_uuid', $folder->uuid)->get()
            );

            $folderLinkIDs = json_decode($folder->link_ids);

            $linksArray = [];

            if ($folderLinkIDs) {

                foreach ( $folderLinkIDs as $linkID ) {

                    $link       = Link::where( 'id', $linkID )->get();
                    $visitCount = count(
                        LinkVisit::whereBetween( 'created_at', [ $startDate, $endDate ] )->where( 'link_id', $linkID )->get()
                    );

                    $linkObject = [
                        "id"       => $link[0]->id,
                        "iconName" => $link[0]->name,
                        "icon"     => $link[0]->icon,
                        "visits"   => $visitCount
                    ];

                    array_push( $linksArray, $linkObject );
                }
            }

            $object     = [
                "id"            => $folder->uuid,
                "name"          => $folder->folder_name ? : "N/A",
                "clickCount"    => $folderClickCount,
                "links"         => $linksArray
            ];

            array_push( $folderArray, $object );
        }

        return $folderArray;
    }
}
