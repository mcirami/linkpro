<?php
namespace App\Http\Traits;


use App\Models\Folder;
use App\Models\FolderClick;
use App\Models\Link;
use App\Models\LinkVisit;
use App\Models\OfferClick;
use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

trait StatsTrait {

    public function getPageStats($startDate, $endDate) {

        $user = Auth::user();

        $pages = $user->pages()->get();
        $pageArray = [];

        foreach($pages as $page) {
            $visitCount = count($page->pageVisits()->whereBetween('created_at', [ $startDate, $endDate ])->get());
            $linkVisitCount = count(LinkVisit::whereBetween('created_at', [ $startDate, $endDate ])->where('page_id', $page->id)->get());
            $object = [
                "id" => $page->id,
                "pageName" => $page->name,
                "visits" => $visitCount,
                "linkVisits" => $linkVisitCount
            ];
            array_push($pageArray, $object);
        }

        return $pageArray;
    }

    public function getLinkStats($startDate, $endDate) {
        $user = Auth::user();

        $links = $user->links()->where('folder_id', null)->get();
        $linksArray = [];

        foreach($links as $link) {

            if ($link->name && $link->icon) {
                $visitCount = count( $link->linkVisits()->whereBetween('created_at', [ $startDate, $endDate ])->get() );
                $object     = [
                    "id" => $link->id,
                    "iconName" => $link->name,
                    "icon"     => $link->icon,
                    "visits"   => $visitCount
                ];
                array_push( $linksArray, $object );
            };
        }

        return $linksArray;
    }

    public function getDeletedLinksStats($startDate, $endDate) {
        $deletedArray = [];

        $deletedLinks = DB::table('deleted_links')->where('user_id', '=', Auth::id())->get();
        foreach ($deletedLinks as $deletedLink) {
            $visitCount = count(LinkVisit::whereBetween('created_at', [ $startDate, $endDate ])->where('link_id', $deletedLink->link_id)->get());
            $object     = [
                "id" => $deletedLink->id,
                "iconName" => $deletedLink->name,
                "icon"     => $deletedLink->icon,
                "visits"   => $visitCount
            ];
            array_push( $deletedArray, $object );
        }

        return $deletedArray;
    }
    public function getFolderStats($startDate, $endDate) {

        $folderArray = [];

        $folders = Folder::where('user_id', '=', Auth::id())->get();

        foreach ($folders as $folder) {
            $folderClickCount = count(FolderClick::whereBetween('created_at', [ $startDate, $endDate ])->where('folder_uuid', $folder->uuid)->get());

            $folderLinkIDs = json_decode($folder->link_ids);

            $linksArray = [];

            if ($folderLinkIDs) {

                foreach ( $folderLinkIDs as $linkID ) {

                    $link       = Link::where( 'id', $linkID )->get();
                    $visitCount = count( LinkVisit::whereBetween( 'created_at',
                        [ $startDate, $endDate ] )->where( 'link_id', $linkID )->get() );

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
                "id" => $folder->uuid,
                "name" => $folder->folder_name ? : "N/A",
                "clickCount"   => $folderClickCount,
                "links"     => $linksArray
            ];

            array_push( $folderArray, $object );
        }

        return $folderArray;
    }

    public function getDateRange($value) {

        switch ($value) {

            case 1:
                $startDate = Carbon::now()->startOfDay();
                $endDate = Carbon::now();
                break;
            case 2:
                $startDate = Carbon::now()->subDays(1)->startOfDay();
                $endDate = Carbon::now()->subDays(1)->endOfDay();
                break;
            case 3:
                $startDate = Carbon::now()->startOfWeek()->startOfDay();
                $endDate = Carbon::now();
                break;
            case 4:
                $startDate = Carbon::now()->startOfMonth()->startOfDay();
                $endDate = Carbon::now();
                break;
            case 5:
                $startDate = Carbon::now()->startOfYear()->startOfDay();
                $endDate = Carbon::now();
                break;
            case 6:
                $startDate = Carbon::now()->startOfWeek()->subDays(7)->startOfDay();
                $endDate = Carbon::now()->startOfWeek()->subDays(1)->endOfDay();
                break;
            case 7:
                $startDate = Carbon::now()->startOfMonth()->subDays(1)->startOfMonth()->startOfDay();
                $endDate = Carbon::now()->startOfMonth()->subDays(1)->endOfMonth()->endOfDay();
                break;
            default:
                break;
        }

        return [
            'startDate' => $startDate,
            'endDate' => $endDate
        ];
    }

    public function getMyDates() {

        if (isset($_GET['startDate']) && isset($_GET['endDate'])) {

            $startDate = Carbon::createFromTimestamp($_GET['startDate'])->startOfDay();
            $endDate = Carbon::createFromTimestamp($_GET['endDate'])->endOfDay();

        } else if (isset($_GET['dateValue'])) {

            $getData = $this->getDateRange($_GET['dateValue']);

            $startDate = $getData['startDate'];
            $endDate = $getData['endDate'];

        } else if (isset($_GET['clear'])) {

            $startDate = null;
            $endDate = null;

        } else {
            $getData = $this->getDateRange(1);

            $startDate = $getData['startDate'];
            $endDate = $getData['endDate'];
        }

        return [
            'startDate' => $startDate,
            'endDate' => $endDate
        ];
    }

    public function getOfferStats($startDate, $endDate) {
        $user = Auth::user();

        $offers = $user->Offers()->where('published', true)->get();

        $offerArray = array();
        foreach ($offers as $offer) {
            $rawCount = $offer->OfferClicks()->where('is_unique', false)->whereBetween('created_at', [ $startDate, $endDate ])->count();
            $uniqueCount = $offer->OfferClicks()->where('is_unique', true)->whereBetween('created_at', [ $startDate, $endDate ])->count();
            $conversions = $offer->OfferClicks()->whereHas('purchases', function (
                \Illuminate\Database\Eloquent\Builder $query) use($startDate, $endDate) {
                $query->whereBetween('created_at', [ $startDate, $endDate ]);
            })->count();
            $object = [
                'icon'          => $offer->icon,
                'rawClicks'     => $rawCount,
                'uniqueClicks'  => $uniqueCount,
                'conversions'   => $conversions,
                'payout'        => $offer->price
            ];
            array_push($offerArray, $object );
        }

        return $offerArray;

    }
}
