<?php
namespace App\Http\Traits;


use App\Models\LinkVisit;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

trait TrackingTrait {

    public function getPageStats($startDate, $endDate) {

        $user = Auth::user();

        $pages = $user->pages()->get();
        $pageArray = [];

        foreach($pages as $page) {
            $visitCount = count($page->pageVisits()->whereBetween('created_at', [ $startDate, $endDate ])->get());
            $linkVisitCount = count(LinkVisit::whereBetween('created_at', [ $startDate, $endDate ])->where('page_id', $page->id)->get());
            $object = [
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

        $links = $user->links()->get();
        $linksArray = [];

        foreach($links as $link) {

            if ($link->name && $link->icon) {
                $visitCount = count( $link->linkVisits()->whereBetween('created_at', [ $startDate, $endDate ])->get() );
                $object     = [
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
                "iconName" => $deletedLink->name,
                "icon"     => $deletedLink->icon,
                "visits"   => $visitCount
            ];
            array_push( $deletedArray, $object );
        }

        return $deletedArray;
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

}
