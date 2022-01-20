<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Services\LinkService;
use Illuminate\Http\Request;
use App\Services\FolderService;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    /**
     * @param Request $request
     * @param FolderService $folder
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, FolderService $folder) {

        $data = $folder->addNewFolder($request);

        return response()->json( ['message'=> 'Folder Added', 'id' => $data["id"], 'position' => $data["position"] ]);

    }

    /**
     * @param Request $request
     * @param Folder $folder
     * @param FolderService $folder_service
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateName(Request $request, Folder $folder, FolderService $folder_service) {

        $folder_service->updateFolderName($folder, $request);

        return response()->json(['message' => "Folder Name Updated"]);
    }

    /**
     * @param Request $request
     * @param Folder $folder
     * @param FolderService $folderService
     *
     * @return \Illuminate\Http\JsonResponse|\never
     */
    public function updateFolderStatus(Request $request, Folder $folder, FolderService $folderService) {
        if ($folder->user_id != Auth::id()) {
            return abort(403);
        }

        $message = $folderService->updateStatus($request, $folder);

        return response()->json(['message' => $message]);
    }

    /**
     * @param Request $request
     * @param Folder $folder
     * @param FolderService $folderService
     * @param LinkService $linkService
     *
     * @return \Illuminate\Http\JsonResponse|\never
     */
    public function destroy(Request $request, Folder $folder, FolderService $folderService, LinkService $linkService) {
        if ($folder->user_id != Auth::id()) {
            return abort(403);
        }

        $allRequest = $request->all();

        $folderService->deleteFolder($folder);
        $linkService->updateLinksPositions($allRequest);

        return response()->json(['message' => "Folder Deleted"]);
    }
}
