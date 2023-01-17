<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class OfferService {

    public function updateOfferIcon($request, $userID, $offer) {

        $imgName = $userID . '-' . time() . '.' . $request->ext;
        $path = 'offer-images/' . $userID . '/' . $imgName;

        Storage::disk('s3')->delete($path);

        Storage::disk('s3')->copy(
            $request->icon,
            str_replace($request->icon, $path, $request->icon)
        );

        $amazonPath = Storage::disk('s3')->url($path);

        $offer->update(['icon' => $amazonPath]);

        return $amazonPath;
    }

    public function updateOfferData($offer, $request) {

        $keys = collect($request->all())->keys();

        $value = $request[$keys[0]];

        $offer->update([
            $keys[0] => $request[$keys[0]]
        ]);

        if ($keys[0] == "public") {
            if ($value == 1) {
                $message = "Offer is now public";
            } else {
                $message = "Offer is now private";
            }
        } elseif ($keys[0] === "active") {
            if ($value == 1) {
                $message = "Offer is now active";
            } else {
                $message = "Offer has been deactivated";
            }
        } else {
            $message = $keys[0] .  " Updated";
        }

        return $message;
    }

    public function publishOffer($offer) {

        if ($offer->icon !== null && $offer->price !== null) {
            $offer->update([
                "published" => true,
            ]);
            return true;
        } else {
            return false;
        }
    }
}
