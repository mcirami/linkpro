<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Signifly\Shopify\Shopify;
use SocialiteProviders\Manager\Config;

class ShopifyController extends Controller
{
    public function auth($domain) {

        $clientId = config('services.shopify.client_id');
        $clientSecret = config('services.shopify.client_secret');
        $redirectUrl = config('services.shopify.redirect');
        $scopes = config('services.shopify.scopes');
        $additionalProviderConfig = ['subdomain' => "matteos-new-store"];
        $config = new Config($clientId, $clientSecret, "/auth/shopify/callback", $additionalProviderConfig);

        return Socialite::driver('shopify')->setConfig($config)->setScopes([$scopes])->redirect();

    }

    public function callback() {


        try {
            $shopifyUser = Socialite::driver('shopify')->user();
            $accessToken = $shopifyUser->accessTokenResponseBody["access_token"];
            $domain = $shopifyUser->getNickname();

            $shopify = new Shopify(
                env('SHOPIFY_API_KEY'),
                $accessToken,
                $domain,
                env('SHOPIFY_API_VERSION')
            );

            $products = $shopify->getProducts()->toArray();

            $productsArray = [];
            foreach($products as $product) {
                $productObject = [
                    "id"            => $product["id"],
                    "product_url"   => 'https://' . $domain . '/product/' . $product["handle"],
                    "title"         => $product["title"],
                    "price"         => $product["variants"][0]["price"],
                    "image_url"     => $product["image"] ? $product["image"]["src"] : null
                ];

                array_push($productsArray, $productObject);
            }

            Auth::user()->shopifyUsers()->create([
                'access_token' => $accessToken,
                'domain' => $domain,
                'products' => json_encode($productsArray)
            ]);

            return redirect()->route('dashboard', ['redirected' => "shopify"]);

        } catch (\Throwable $th) {

            Log::channel( 'cloudwatch' )->info( "--timestamp--" .
                                                Carbon::now() .
                                                "-- kind --"
                                                . "Shopify Connection" .
                                                "-- Error Message -- " .
                                                $th->getMessage()
            );

            return redirect()->route('dashboard', ['redirected' => "shopify", "connection_error" => 'Something went wrong connecting to Shopify! Please try again.']);
        }
    }

    public function getAllProducts() {

        $user = Auth::user();

        $products = $user->shopifyUsers()->get('products');

        return response()->json([
            'products' => json_decode($products)
        ]);

    }
}
