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
                        <div class="profile_img_column @if (!$page->profile_img) default @endif">
                            <div class="profile_image">
                                <div class="image_wrap">
                                    <img src={{ $page->profile_img ? : asset( 'images/default-img.png' ) }} alt=""/>
                                </div>
                            </div>
                        </div>
                        <div class="profile_text">
                            {!! $page->bio ? "<h2>" . $page->title . "</h2>" : "" !!}
                            {!! $page->bio ? "<p>" . $page->bio . "</p>" : "" !!}
                        </div>
                    </div>
                    @if ( $page->is_protected && $authorized ||
                            !$page->is_protected ||
                            ( !$subscription->isEmpty() && $subscription[0]["braintree_status"] == "canceled" && $subscription[0]["ends_at"] < \Carbon\Carbon::now())
                            )
                        <div class="icons_wrap">
                            @php $count = 0; @endphp
                            @foreach($links as $link)
                                @php ++$count @endphp
                                @if ( $count < 9 || ($count > 8 && !$subscription->isEmpty() && ($subscription[0]["braintree_status"] == "active" || $subscription[0]["braintree_status"] == "pending" || $subscription[0]["ends_at"] > \Carbon\Carbon::now()) ) )
                                    <div class="icon_col">
                                        @if($link->active_status)

                                            @if ($link->email)
                                                @php $source = "mailto:" . $link->email @endphp
                                            @elseif ($link->phone)
                                                @php $source = "tel:" . $link->phone @endphp
                                            @else
                                              @php $source = $link->url @endphp
                                            @endif

                                            <a class="link_tracker" data-id="{{$link->id}}" href="{{ $source ? : '#' }}"
                                               target="_blank"
                                               rel="nofollow"
                                            >
                                                @if ( str_contains($link->icon, "custom") )
                                                    @if ( $subscription[0]["braintree_status"] == "active" || $subscription[0]["braintree_status"] == "pending" || $subscription[0]["ends_at"] > \Carbon\Carbon::now() )
                                                        @php $icon =  $link->icon @endphp
                                                    @else
                                                        @php $icon =  null @endphp
                                                    @endif
                                                @else
                                                    @php $icon =  $link->icon @endphp
                                                @endif
                                                <img src="{{ $icon ? : asset('/images/icon-placeholder-preview.png') }}" alt="" />
                                            </a>
                                            <p>{{ $link->name ? : "Link Name" }}</p>
                                        @endif
                                    </div>
                                @endif
                            @endforeach
                        </div><!-- icons_wrap -->
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
