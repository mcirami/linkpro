<?php

namespace App\Http\Controllers;

use App\Services\IconService;

class IconController extends Controller
{
    public function getIcons(IconService $iconService) {

        $icons = $iconService->getIcons();

        dd($icons);

    }
}
