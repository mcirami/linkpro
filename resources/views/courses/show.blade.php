@extends('layouts.course.header')

@section('content')

    @php //dd($logo) @endphp

    <div class="creator course_creator">
        <div id="links_page" class="live_page course">
            <div class="creator_wrap my_row">
                <div class="preview">
                    <section class="header">
                        {{--<div class="top_section" style="background: {{$course["header_bg_color"] ?: "rgba(0,0,0,1)"}}">
                            <div class="container">
                                <div class="logo">
                                    <img src="{{$logo}}" alt="{{$course["title"]}}">
                                </div>
                            </div>
                        </div>--}}
                        <div class="intro_text my_row" style="background: {{$course["intro_background_color"]}}">
                            <div class="container">
                                <p style="color: {{$course["intro_text_color"]}}">{{$course["intro_text"]}}</p>
                            </div>
                        </div>

                    </section>
                    <section>
                        <div class="container">
                            <div class="sections">
                                @foreach($sections as $section)
                                    <section class="{{$section->type}}" style="background: {{$section->background_color}}">
                                        @if($section->type == "video")
                                            <h3 style="color: {{$section->text_color}}">{{$section->video_title}}</h3>
                                            <div class="video_wrapper">
                                                <iframe src="{{$section->video_link}}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowfullscreen></iframe>
                                            </div>
                                        @endif
                                            <p style="color: {{$section->text_color}}">{{$section->text}}</p>
                                    </section>
                                @endforeach
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>

@endsection
