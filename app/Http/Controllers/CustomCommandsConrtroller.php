<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomCommandsConrtroller extends Controller
{
    public function setUUID() {

        $folders = Folder::get();

        foreach($folders as $folder) {

            $folder->update(['uuid' => Str::uuid()->toString()]);
        }

        dd("done");

    }
}
