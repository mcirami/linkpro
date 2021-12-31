<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;
use App\Services\FolderService;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    public function store(Request $request, FolderService $folder) {

        $data = $folder->addNewFolder($request);

        return response()->json( ['message'=> 'Folder Added', 'id' => $data["id"], 'position' => $data["position"] ]);

    }

    public function getFolderLinks(Folder $folder, FolderService $folderService, ) {

        $links = $folderService->getLinks($folder);

        return response()->json( ['links' => $links]);
    }

    public function updateFolderStatus(Request $request, Folder $folder, FolderService $folderService) {
        if ($folder->user_id != Auth::id()) {
            return abort(403);
        }

        $message = $folderService->updateStatus($request, $folder);

        return response()->json(['message' => $message]);
    }
}
