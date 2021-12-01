@extends('layouts.page.header')

@section('content')

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
                        <div id="accordionParent">
                            <div class="icons_wrap">
                                <!-- icon1 -->
                                <div class="icon_col">
                                    <a href="https://shopacefamily.com/" target="_blank">
                                        <img src="{{ asset('images/icons/the_ace_family.png') }}" alt="Ace Family Store" title="Ace Family Store"/>
                                    </a>
                                    <p>Ace Family Store</p>
                                </div>
                                <!-- icon2 -->
                                <div class="icon_col">
                                    <a href="https://www.youtube.com/c/THEACEFAMILY" target="_blank">
                                        <img src="{{ asset('images/icons/YouTube.png') }}" alt="YouTube" title="YouTube"/>
                                    </a>
                                    <p>YouTube</p>
                                </div>
                                <!-- icon3 -->
                                <div class="icon_col">
                                    <a href="https://www.instagram.com/theacefamily/" target="_blank">
                                        <img src="{{ asset('images/icons/Instagram.png') }}" alt="Instagram" title="Instagram"/>
                                    </a>
                                    <p>Instagram</p>
                                </div>
                                <!--row2.1--------->
                                <div class="icon_col folder">
                                    <a class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
                                       data-target="#instagram" aria-expanded="true" aria-controls="instagram">
                                        <div class="icons_wrap">
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Austin" title="Austin" />
                                            </div>
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Catherine" title="Catherine" />
                                            </div>
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Ella" title="Ella" />
                                            </div>
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Alaia" title="Alaia" />
                                            </div>
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Steel" title="Steel" />
                                            </div>
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Ace Sea" title="Ace Sea" />
                                            </div>
                                        </div>
                                    </a>
                                    <p>Instagram</p>
                                </div>
                                {{--<div class="my_row">
                                    <div class="card">
                                        <div id="instagram" class="collapse" aria-labelledby="heading_2" data-parent="#accordionParent">
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-4 px-3 mb-2">
                                                        <div class="icon">
                                                            <a href="https://www.instagram.com/austinmcbroom/" target="_blank">
                                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Austin" title="Austin" />
                                                            </a>
                                                            <p>Austin</p>
                                                        </div>
                                                    </div>

                                                    <div class="col-4 px-3 mb-2">
                                                        <div class="icon">
                                                            <a href="https://www.instagram.com/catherinemcbroom/" target="_blank">
                                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Catherine" title="Catherine" />
                                                            </a>
                                                            <p>Catherine</p>
                                                        </div>
                                                    </div>

                                                    <div class="col-4 px-3 mb-2">
                                                        <div class="icon">
                                                            <a href="https://www.instagram.com/elle/" target="_blank">
                                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Elle" title="Elle" />
                                                            </a>
                                                            <p>Elle</p>
                                                        </div>
                                                    </div>

                                                    <div class="col-4 px-3">
                                                        <div class="icon">
                                                            <a href="https://www.instagram.com/alaiamcbroom/" target="_blank">
                                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Alaia" title="Alaia" />
                                                            </a>
                                                            <p>Alaia</p>
                                                        </div>
                                                    </div>
                                                    <div class="col-4 px-3">
                                                        <div class="icon">
                                                            <a href="https://www.instagram.com/steelmcbroom/" target="_blank">
                                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Steel" title="Steel" />
                                                            </a>
                                                            <p>Steel</p>
                                                        </div>
                                                    </div>
                                                    <div class="col-4 px-3">
                                                        <div class="icon"> <a href="https://www.instagram.com/aceseamcbroom/" target="_blank">
                                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Ace Sea" title="Ace Sea" />
                                                            </a>
                                                            <p>Ace Sea</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div><!-- my_row -->--}}
                                <div class="icon_col">
                                    <a href="mailto:jon@link.pro" target="_blank">
                                        <img src="{{ asset('images/icons/TikTok.png') }}" alt="TikTok" title="TikTok"/></a>
                                    <p>TikTok</p>
                                </div>
                                <div class="icon_col folder" id="heading_4">
                                    <a class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
                                       data-target="#catherine" aria-expanded="true" aria-controls="catherine">
                                        <!-- icon -->
                                        <div class="icons_wrap">
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Instagram" title="Instagram" />
                                            </div>
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/Twitter.png') }}" alt="Twitter" title="Twitter" />
                                            </div>
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/TikTok.png') }}" alt="TikTok" title="TikTok" />
                                            </div>
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/Facebook.png') }}" alt="Facebook" title="Facebook" />
                                            </div>
                                            <div class="icon_col">
                                                <img src="{{ asset('images/icons/Snapchat.png') }}" alt="Snapchat" title="Snapchat" />
                                            </div>
                                        </div>
                                    </a>
                                    <p>Catherine</p>
                                </div>
                                <div class="icon_col">

                                    <a href="https://sillyjuice.com/" target="_blank">
                                        <img src="{{ asset('images/icons/silly_juice.png') }}" alt="Silly Juice" title="Silly Juice"/>
                                    </a>
                                    <p>Silly Juice</p>

                                </div>
                                <div class="icon_col">
                                    <a href="https://1212gateway.com/" target="_blank">
                                        <img src="{{ asset('images/icons/1212_gateway.png') }}" alt="1212 Gateway" title="1212 Gateway"/>
                                    </a>
                                    <p>1212 Gateway</p>
                                </div>
                                <div class="icon_col">
                                    <a href="https://bananasmonkey.com/" target="_blank">
                                        <img src="{{ asset('images/icons/bananas.png') }}" alt="Bananas Monkey" title="Bananas Monkey"/>
                                    </a>
                                    <p>Bananas Monkey</p>
                                </div>
                                <div class="icon_col">
                                    <a href="https://www.google.com" target="_blank">
                                        <img src="{{ asset('images/icons/Phone.png') }}" alt="Call Us" title="Call Us"/>
                                    </a>
                                    <p>Call Us</p>
                                </div>
                                <div class="icon_col">
                                    <a href="https://1212gateway.com/" target="_blank">
                                        <img src="{{ asset('images/icons/Email.png') }}" alt="Email Us" title="Email Us"/></a>
                                    <p>Email Us</p>
                                </div>
                                <div class="icon_col">
                                    <a href="https://bananasmonkey.com/" target="_blank">
                                        <img src="{{ asset('images/icons/Messenger.png') }}" alt="Message Us" title="Message Us"/>
                                    </a>
                                    <p>Message Us</p>
                                </div>
                            </div>
                        </div>

                        {{--<div class="my_row accordion">
                            <div class="card">
                                <div id="catherine" class="collapse" aria-labelledby="heading_4" data-parent="#accordionParent">
                                    <div class="card-body">
                                        <!-- sub icons for catherine-->
                                        <div class="icon_col">
                                            <a href="https://www.instagram.com/catherinemcbroom/" target="_blank">
                                                <img src="{{ asset('images/icons/Instagram.png') }}" alt="Instagram" title="Instagram" />
                                            </a>
                                            <p>Instagram</p>
                                        </div>
                                        <div class="icon_col">
                                            <a href="https://twitter.com/CatherinePaiz" target="_blank">
                                                <img src="{{ asset('images/icons/Twitter.png') }}" alt="Twitter" title="Twitter" />
                                            </a>
                                            <p>Twitter</p>
                                        </div>

                                        <div class="icon_col">
                                            <a href="https://www.tiktok.com/@catherinemcbroom" target="_blank">
                                                <img src="{{ asset('images/icons/TikTok.png') }}" alt="TikTok" title="TikTok" /></a>
                                            <p>TikTok</p>
                                        </div>
                                        <div class="icon_col">
                                            <a href="https://www.facebook.com/search/top?q=the%20ace%20family" target="_blank">
                                                <img src="{{ asset('images/icons/Facebook.png') }}" alt="Facebook" title="Facebook" />
                                            </a>
                                            <p>Facebook</p>
                                        </div>

                                        <div class="icon_col">
                                            <a href="https://www.snapchat.com/TheRealMcBroom" target="_blank">
                                                <img src="{{ asset('images/icons/Snapchat.png') }}" alt="Snapchat" title="Snapchat" />
                                            </a>
                                            <p>Snapchat</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div><!-- row -->--}}

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
