<?php /** @noinspection MissingReturnTypeInspection */

namespace App\Http\Controllers;

use App\Models\Link;

use App\Services\TrackingServices;
use Carbon\Carbon;
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

        return response()->json(['pageStats' => $data["pageStats"], 'linkStats' => $data["linkStats"], 'deletedStats' => $data["deletedStats"]]);
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
    public function getPageStatsDropdown(Request $request, TrackingServices $tracking) {

        $data = $tracking->getPageStatsDropdown($request);

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

    /**
     * @param Request $request
     * @param TrackingServices $tracking
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLinkStatsDropdown(Request $request, TrackingServices $tracking) {

        $data = $tracking->getLinkStatsDropdown($request);

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


}
