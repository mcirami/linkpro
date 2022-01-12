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
     * @param TrackingServices $tracking
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats(TrackingServices $tracking) {

        $data = $tracking->getAllStats();

        return response()->json([
            'pageStats' => $data["pageStats"],
            'linkStats' => $data["linkStats"],
            'deletedStats' => $data["deletedStats"],
            'folderStats' => $data['folderStats']
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
     * @param Request $request
     * @param TrackingServices $tracking
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLinkStatsRange(Request $request, TrackingServices $tracking) {

        $data = $tracking->getLinksDateRangeStats($request);

        return response()->json(['data' => $data]);
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
