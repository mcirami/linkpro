@extends('layouts.page.header')

@section('content')

    @php
        $subscription = \App\Models\Subscription::where('user_id', $page->user_id)->get();
    @endphp

    <div id="links_page">
        <div class="links_col">
            <div class="links_wrap live_page">
                <div class="inner_content live_page">
                    <div class="page_header @if (!$page->header_img) default @endif"
                         @if ($page->header_img) style="background: url({{ $page->header_img }}) no-repeat; background-size: cover;" @endif
                    >
                        @if (!$page->header_img)
                            <img src={{ asset( 'images/default-img.png' ) }} alt="" />
                        @endif
                    </div>
                    <div class="profile_content">
                        <div class="profile_image @if (!$page->profile_img) default @endif">
                            <div class="image_wrap">
                                <img src={{ $page->profile_img ? : asset( 'images/default-img.png' ) }} alt=""/>
                            </div>
                        </div>
                        <div class="profile_text">
                            <h2>{{ $page->title ? : "LinkPro" }}</h2>
                            <p>{{ $page->bio  ?  : "Add Slogan/Intro Here" }}</p>
                        </div>
                    </div>
                    @if ( $page->is_protected && $authorized ||
                            !$page->is_protected ||
                            ( $subscription[0]["braintree_status"] == "canceled" && $subscription[0]["ends_at"] < \Carbon\Carbon::now())
                            )
                        <div class="icons_wrap">
                            @foreach($links as $link)
                                <div class="icon_col">
                                    @if($link->active_status)
                                        <a href="{{ $link->url ? : 'https://link.pro' }}"
                                           target="_blank"
                                           rel="nofollow"
                                        >
                                            <img src="{{ $link->icon ? : asset('/images/icon-placeholder-preview.png') }}" alt="" />
                                        </a>
                                        <p>{{ $link->name ? : "Link Name" }}</p>
                                    @endif
                                </div>
                            @endforeach
                        </div>
                    @elseif ($page->is_protected && !$authorized)
                        <form method="post" action="{{ url('/check-page-auth/' . $page->id)  }}" >
                            @csrf
                            <h2>Page Secure</h2>
                            <p>Enter your pin to continue</p>
                            @if($errors->any())
                                <p class="alert-warning">{{ $errors->first() }}</p>
                            @endif
                            <input name="pin" type="text">
                            <button type="submit" class="button blue">Enter</button>
                        </form>
                    @endif
                </div>
            </div>
        </div>
    </div>

@endsection
