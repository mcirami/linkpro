<?php


namespace App\Services;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Traits\IconTrait;


class IconService {

    use IconTrait;

    public function getIcons() {
        $count = 0;
        $addSeconds = 30;

        $icons = $this->iconArray();
        foreach($icons as $icon) {
            ++$count;

            if ($count > 5) {
                if ($count % 5 == 0) {
                    $addSeconds += 30;
                    echo $addSeconds . "<br><br>";
                } else {
                    echo $addSeconds . "<br><br>";
                }
            } else {
                echo $addSeconds . "<br><br>";
            }
        }
        /*$iconArray = [];
        $endpoint = 'http://itunes.apple.com/search';
        $client = new Client();

        $term = "Facebook";
        $entity = "software";

        try {
            $response = $client->request('GET', $endpoint, ['query' => [
                'term' => $term,
                'entity' => $entity
            ]]);
        } catch(\Exception $e) {
            Log::error($e);

            throw $e;
        }

        $content = json_decode($response->getBody(), true);

        $url = $content['results'][0]['artworkUrl512'];

        $iconName = str_replace(" ", '-', $term);
        $path = 'icons/' . $iconName . ".png";
        Storage::disk('s3')->delete($path);
        $image = file_get_contents($content['results'][0]['artworkUrl512']);
        Storage::disk('s3')->put(
            $path,
            $image,
            'public'
        );
        return $url;*/

        /*$icons = $this->iconArray();
        foreach($icons as $icon) {
            $term = $icon;
            $entity = "software";

            try {
                $response = $client->request('GET', $endpoint, ['query' => [
                    'term' => $term,
                    'entity' => $entity
                ]]);
            } catch(\Exception $e) {
                Log::error($e);

                throw $e;
            }

            $content = json_decode($response->getBody(), true);
            $iconURL = $content['results'][0]['artworkUrl512'];

            array_push($iconArray, $iconURL);
        }

        return $iconArray;*/
    }


}
