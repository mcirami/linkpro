@extends('layouts.app')

@section('content')

    <div class="container">
        <h2 class="page_title">Course Manager</h2>
        <section id="manager" class="card edit_page">
            @if (count($offers) > 1 || $offers[0]->published)
                <div class="grid_columns top_section">
                    <h3>Landing Page</h3>
                    <div class="text_wrap flex">
                        <h3>{{$landingPage[0]["title"]}}</h3>
                        <a href="/course-manager/landing-page/{{$landingPage[0]["id"]}}">Edit</a>
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
                                <th scope="col">Active</th>
                                <th scope="col">Public</th>
                                <th scope="col">Price</th>
                                <th scope="col">Payout</th>
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
                                                <input data-offer="{{$offer->id}}" {{ $offer->active == true ? "checked" : "" }} name="active_switch" class="form-check-input" type="checkbox" role="switch" id="active_switch">
                                            </div>
                                        </td>
                                        <td>
                                            <div class="form-check form-switch">
                                                <input data-offer="{{$offer->id}}" {{$offer->public == true ? "checked" : ""}} name="public_switch" class="form-check-input" type="checkbox" role="switch" id="public_switch">
                                            </div>
                                        </td>
                                        <td>${{ $offer->price }}</td>
                                        <td>${{ $offer->price }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
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
                                <a href="/course-manager/landing-page/{{$landingPage[0]["id"]}}">(Edit Landing Page)</a>
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
                    <a class="button blue" href="{{ route('add.landing.page') }}">
                        Get Started!
                    </a>
                @endif
            @endif
        </section>
    </div>
@endsection
