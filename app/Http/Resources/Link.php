<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Link extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        //return parent::toArray($request);

        return [
            'id'        => $this->id,
            'user_id'   => $this->user_id,
            'page_id'   => $this->page_id,
            'name'      => $this->name,
            'link'      => $this->link,
            'link_icon' => $this->link_icon,
            'sub_links' => $this->sub_links,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
