<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddLinkRequest;
use App\Http\Requests\UpdateLinkRequest;
use App\Services\LinkService;
use Illuminate\Http\Request;
use App\Models\Link;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class LinkController extends Controller
{

    public function store(AddLinkRequest $request, LinkService $linkService) {

        $data = $linkService->addLink($request);

        return response()->json(['message'=> 'Icon Added', 'link_id' => $data["link"]->id, 'position' => $data["link"]->position, 'iconPath' => $data["path"]]);
    }

    public function update(UpdateLinkRequest $request, Link $link, LinkService $linkService) {

        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $path = $linkService->updateLink($request, $link);

        if (!$path) {
            $path = null;
        }

        return response()->json(['message' => 'Icon Updated', 'path' => $path]);

    }

    public function updateStatus(Request $request, Link $link, LinkService $linkService) {
        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $message = $linkService->updateLinkStatus($request, $link);

        return response()->json(['message' => $message]);

    }

    public function updatePositions(Request $request, LinkService $linkService) {

        $linksArray = $request->all();

        $linkService->updateLinksPositions($linksArray);

        return response()->json(['message' => "Links Position Updated"]);
    }

    public function destroy(Request $request, Link $link, LinkService $linkService) {
        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $linksArray = $request->all();

        $linkService->deleteLink($link);
        $linkService->updateLinksPositions($linksArray);

        return response()->json(['message' => 'Icon Has Been Deleted']);
    }
}
