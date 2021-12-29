<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FolderService;

class FolderController extends Controller
{
    public function store(Request $request, FolderService $folder) {

        $data = $folder->addNewFolder($request);

        return response()->json( ['message'=> 'Folder Added', 'id' => $data["id"], 'position' => $data["position"] ]);

    }
}
