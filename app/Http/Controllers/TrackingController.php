<?php /** @noinspection MissingReturnTypeInspection */

namespace App\Http\Controllers;

use App\Models\Link;
use App\Models\Folder;
use App\Services\TrackingServices;
use Illuminate\Http\Request;

class TrackingController extends Controller
{

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function show() {

        return view('stats.show');
    }

    /**
     * Get page stats for today
     *
     * @param TrackingServices $tracking
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPageStats(TrackingServices $tracking) {

        $data = $tracking->getTodaysPageStats();

        return response()->json([
            'pageStats' => $data,
        ]);
    }

    /**
     * @param Request $request
     * @param TrackingServices $tracking
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPageStatsRange(Request $request, TrackingServices $tracking) {

        $data = $tracking->getPageDateRangeStats($request);

        return response()->json(['data' => $data]);
    }

    /**
     * Get page stats for today
     *
     * @param TrackingServices $tracking
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLinkStats(TrackingServices $tracking) {

        $data = $tracking->getTodaysLinkStats();

        return response()->json([
            'linkStats' => $data,
        ]);
    }

    /**
     * @param Request $request
     * @param TrackingServices $tracking
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLinkStatsRange(Request $request, TrackingServices $tracking) {

        $data = $tracking->getLinksDateRangeStats($request);

        return response()->json(['data' => $data]);
    }

    /**
     * Get deleted link stats for today
     *
     * @param TrackingServices $tracking
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDeletedStats(TrackingServices $tracking) {

        $data = $tracking->getTodaysDeletedStats();

        return response()->json([
            'deletedStats' => $data,
        ]);
    }

    /**
     * Get folder stats for today
     *
     * @param TrackingServices $tracking
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFolderStats(TrackingServices $tracking) {

        $data = $tracking->getTodaysFolderStats();

        return response()->json([
            'folderStats' => $data,
        ]);
    }

    public function getFolderStatsRange(Request $request, TrackingServices $tracking) {

        $data = $tracking->getFolderDateRangeStats($request);

        return response()->json(['data' => $data]);
    }


    /**
     * @param Link $link
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeLinkVisit(Link $link) {

        $link->linkVisits()->create([
            'page_id' => $link->page_id
        ]);

        return response()->json(['message' => "Success!"]);
    }

    public function storeFolderClick(Folder $folder) {

        $folder->folderClicks()->create([
            'page_id' => $folder->page_id
        ]);

        return response()->json(['message' => "Success!"]);
    }

}
