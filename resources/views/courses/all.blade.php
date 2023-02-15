@extends('layouts.course.header')

@section('content')

    @php //dd($logo) @endphp

    <div class="creator course_creator">
        <div id="links_page" class="live_page course">
            <div class="creator_wrap my_row courses_grid">
                <div class="preview">
                    <section class="content_wrap">
                        <div class="container">
                            <div class="section_wrap">
                                <h2>Your Courses</h2>
                                <div class="sections">
                                    @foreach($purchasedCourses as $course)
                                        <div class="column">
                                            <div class="column_title">
                                                <a href="/{{$creator}}/course/{{$course->slug}}">
                                                    <h3>{{$course->title}}</h3>
                                                </a>
                                            </div>
                                            <div class="column_image">
                                                <a href="/{{$creator}}/course/{{$course->slug}}">
                                                    <img src="{{ asset('images/image-placeholder.jpg') }}" alt="">
                                                </a>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                            <div class="section_wrap">
                                <h2>Other Courses Created By <span>{{$creator}}</span></h2>
                                <div class="sections">
                                    @foreach($unPurchasedCourses as $course)
                                        <div class="column">
                                            <div class="column_title">
                                                <a href="/{{$creator}}/{{$course->slug}}/checkout">
                                                    <h3>{{$course->title}}</h3>
                                                </a>
                                            </div>
                                            <div class="column_image">
                                                <a href="/{{$creator}}/{{$course->slug}}/checkout">
                                                    <img src="{{ asset('images/image-placeholder.jpg') }}" alt="">
                                                </a>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>

@endsection
