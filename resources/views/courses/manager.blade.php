@extends('layouts.app')

@section('content')

    <div class="container">
        <h2 class="page_title">Course Manager</h2>
        <section id="manager" class="card edit_page">
            @if (!empty($offers) && (count($offers) > 1 || $offers[0]->published))
                <div class="grid_columns top_section">
                    <h3>Landing Page</h3>
                    <div class="text_wrap flex">
                        <h3>{{$landingPage->title}}</h3>
                        <a href="/course-manager/landing-page/{{$landingPage->id}}">Edit</a>
                    </div>
                </div>
                <div class="grid_columns">
                    <div class="column">
                        <img src="{{ asset('images/course-manager-icon.png') }}" alt="">
                    </div>
                    <div class="column">
                        <table class="table table-borderless">
                            <thead>
                            <tr>
                                <th scope="col">Courses</th>
                                <th scope="col">
                                    Active
                                    <div class="icon_wrap">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 6a3.939 3.939 0 0 0-3.934 3.934h2C10.066 8.867 10.934 8 12 8s1.934.867 1.934 1.934c0 .598-.481 1.032-1.216 1.626a9.208 9.208 0 0 0-.691.599c-.998.997-1.027 2.056-1.027 2.174V15h2l-.001-.633c.001-.016.033-.386.441-.793.15-.15.339-.3.535-.458.779-.631 1.958-1.584 1.958-3.182A3.937 3.937 0 0 0 12 6zm-1 10h2v2h-2z"></path><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path></svg>
                                    </div>
                                    <div class="hover_text help">
                                        <p>Active course to make it available to be promoted across Link Pro pages.</p>
                                        <h5>NOTE:</h5>
                                        <p>Course must have a Title, Price and Icon before being Activated</p>
                                    </div>
                                </th>
                                <th scope="col">
                                    Public
                                    <div class="icon_wrap">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 6a3.939 3.939 0 0 0-3.934 3.934h2C10.066 8.867 10.934 8 12 8s1.934.867 1.934 1.934c0 .598-.481 1.032-1.216 1.626a9.208 9.208 0 0 0-.691.599c-.998.997-1.027 2.056-1.027 2.174V15h2l-.001-.633c.001-.016.033-.386.441-.793.15-.15.339-.3.535-.458.779-.631 1.958-1.584 1.958-3.182A3.937 3.937 0 0 0 12 6zm-1 10h2v2h-2z"></path><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path></svg>
                                    </div>
                                    <div class="hover_text help">
                                        <p>Making course public makes it available to any LinkPro user to add the course icon to their page and sell it as an affiliate.</p>
                                        <h5>NOTE:</h5>
                                        <p>Course must have a Title, Price and Icon before being made Public.</p>
                                    </div>
                                </th>
                                <th scope="col">Price</th>
                                <th scope="col">
                                    Payout
                                    <div class="icon_wrap">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 6a3.939 3.939 0 0 0-3.934 3.934h2C10.066 8.867 10.934 8 12 8s1.934.867 1.934 1.934c0 .598-.481 1.032-1.216 1.626a9.208 9.208 0 0 0-.691.599c-.998.997-1.027 2.056-1.027 2.174V15h2l-.001-.633c.001-.016.033-.386.441-.793.15-.15.339-.3.535-.458.779-.631 1.958-1.584 1.958-3.182A3.937 3.937 0 0 0 12 6zm-1 10h2v2h-2z"></path><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path></svg>
                                    </div>
                                    <div class="hover_text help">
                                        <p>Payout is 80% of course cost.</p>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                                @foreach($offers as $offer)
                                    <tr>
                                        <td>
                                            {{$offer->title}} <a href="/course-manager/course/{{$offer->course_id}}">Edit</a>
                                        </td>
                                        <td>
                                            <div class="form-check form-switch">
                                                <input
                                                    {{ !$offer->published ? "disabled" : "" }}
                                                    {{ $offer->active == true ? "checked" : "" }}
                                                    name="active_{{$offer->id}}"
                                                    class="form-check-input switch"
                                                    type="checkbox"
                                                    role="switch"
                                                >
                                            </div>
                                        </td>
                                        <td>
                                            <div class="form-check form-switch">
                                                <input
                                                    {{ !$offer->published ? "disabled" : "" }}
                                                    {{$offer->public == true ? "checked" : ""}}
                                                    name="public_{{$offer->id}}"
                                                    class="form-check-input switch"
                                                    type="checkbox"
                                                    role="switch"
                                                >
                                            </div>
                                        </td>
                                        <td>${{ $offer->price }}</td>
                                        <td>${{ sprintf("%0.2f", round($offer->price * .80, 2)) }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                        <div class="link_wrap my_row px-3">
                            <a class="blue" href="{{route('add.course')}}">
                                <svg fill="#000000" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" id="memory-plus"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12 17H10V12H5V10H10V5H12V10H17V12H12Z"></path></g></svg>
                                Add New Course
                            </a>
                        </div>
                    </div>
                </div>
            @else
                <h3>Become a LinkPro Course Creator to generate revenue from your social following and beyond!</h3>
                <ul>
                    <li>
                        <span class="number">1</span>
                        @if (empty($landingPage) )
                            <div class="text_wrap">
                                <h4>Create A Landing Page</h4>
                                <p>A Landing Page serves as your home page to let customers know what you're offering.</p>
                            </div>
                        @else
                            <div class="text_wrap flex">
                                <h4>Landing Page Complete</h4>
                                <span>-</span>
                                <a href="/course-manager/landing-page/{{$landingPage->id}}">(Edit Landing Page)</a>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                </svg>
                            </div>
                        @endif

                    </li>
                    <li>
                        <span class="number">2</span>
                        <div class="text_wrap @if(!empty($offers)) flex @endif">
                            @if(empty($offers))
                                <h4>Add A Course</h4>
                                <p>Create and upload your proprietary Course videos and charge for customers to access your content</p>
                            @endif
                            @if (!empty($landingPage) && empty($offers) )
                                    <a class="button blue" href="{{route('add.course')}}">Create A Course</a>
                            @endif
                            @if(!empty($offers))
                                    <h4>Course Started</h4>
                                    <span>-</span>
                                    <a href="/course-manager/course/{{$offers[0]->course_id}}">(continue and publish)</a>
                            @endif
                        </div>
                    </li>
                    <li>
                        <span class="number">3</span>
                        <div class="text_wrap">
                            <h4>Promote your Course link and get paid!</h4>
                            <p>Publish and market your Course to generate income. Recruit others to sell your Cousrse to earn shared profits!</p>
                        </div>
                    </li>
                </ul>
                @if (empty($landingPage) )
                    <a class="button blue full" href="{{ route('add.landing.page') }}">
                        Get Started!
                    </a>
                @endif
            @endif
        </section>
    </div>
@endsection
