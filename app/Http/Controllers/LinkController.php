<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddLinkRequest;
use App\Http\Requests\UpdateLinkRequest;
use App\Services\LinkService;
use Illuminate\Http\Request;
use App\Models\Link;
use Illuminate\Support\Facades\Auth;

class LinkController extends Controller
{

    public function store(AddLinkRequest $request, LinkService $linkService) {

        $link = $linkService->addLink($request);

        return response()->json(['message'=> 'Icon Added', 'link_id' => $link->id, 'position' => $link->position]);
    }

    public function update(UpdateLinkRequest $request, Link $link, LinkService $linkService) {

        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $linkService->updateLink($request, $link);

        return response()->json(['message' => 'Link Updated']);

    }

    public function updateStatus(Request $request, Link $link, LinkService $linkService) {
        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $message = $linkService->updateLinkStatus($request, $link);

        return response()->json(['message' => $message]);

    }

    public function updatePositions(Request $request, LinkService $linkService) {

        $linkService->updateLinksPositions($request);

        return response()->json(['message' => "Links Position Updated"]);
    }

    /*public function destroy(Request $request, Link $link) {
        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $link->delete();

        return response()->json(['message' => 'Link Has Been Deleted']);
        //return response()->json(null, 204);
    }*/
}
