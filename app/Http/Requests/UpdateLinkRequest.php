<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLinkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'max:255|nullable',
            'url' => 'url|nullable',
            'email' => 'email|nullable',
            'phone' => 'regex:/^([0-9\s\-\+\(\)]*)$/|min:10|nullable',
        ];
    }
}
