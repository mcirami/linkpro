@extends('layouts.links')

@section('content')

    <div id="links_page">
        <div class="links_col">
            <div class="links_wrap live_page">
                <div class="inner_content live_page">
                    <div class="page_header" style="background: url({{ $page->header_img }}) no-repeat; background-size: cover;"></div>
                    <div class="profile_content">
                        <div class="profile_image">
                            <img src="{{ $page->profile_img }}" alt=""/>
                        </div>
                        <div class="profile_text">
                            <h2>{{ $page->title }}</h2>
                            <p>{{ $page->bio }}</p>
                        </div>
                    </div>
                    @if ($page->is_protected && !$authorized)
                        <form method="post" action="{{ url('/check-page-auth/' . $page->id)  }}" >
                            @csrf
                            <h2>Page Secure</h2>
                            <p>Enter your pin to continue</p>
                            <input name="pin" type="text">
                            <button type="submit">Enter</button>
                        </form>
                    @elseif ($page->is_protected && $authorized || !$page->is_protected)
                        <div class="icons_wrap">
                            @foreach($links as $link)
                                <div class="icon_col">
                                    <a href="{{ $link->url }}"
                                       target="_blank"
                                       rel="nofollow"
                                    >
                                        <img src="{{ $link->icon }}" alt="" />
                                    </a>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>

        </div>
    </div>

@endsection
