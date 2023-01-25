<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Offer;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use App\Http\Traits\SubscriptionTrait;
use Illuminate\Support\Facades\Auth;


class PurchaseController extends Controller
{
    use SubscriptionTrait;

    private $gateway;

    /**
     * @param $gateway
     */
    public function __construct() {
        $this->gateway = $this->createGateway();

        return $this->gateway;
    }


    public function show(Course $course) {

        $token = $this->gateway->ClientToken()->generate();
        $offer = $course->Offer()->first();

        return view('purchase.show')->with(['token' => $token, 'offer' => $offer, 'courseTitle' => $course->title]);
    }

    public function store(Request $request, PurchaseService $purchaseService) {

        $offer = Offer::findOrFail($request->offer);

        $data = $purchaseService->purchase($offer, $request, $this->gateway);

        if ($data["success"]) {
            return back()->with( ['success' => $data["message"]] );
        } else {
            return back()->withErrors($data["message"]);
        }

    }
}
