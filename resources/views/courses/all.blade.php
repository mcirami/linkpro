@extends('layouts.course.header')

@section('content')

    @php //dd($purchasedCourses) @endphp

    <div class="creator course_creator">
        <div id="links_page" class="live_page course">
            <div class="creator_wrap my_row courses_grid">
                <div class="container">
                    <section class="section_wrap">
                        <h2>Your Courses</h2>
                        <div class="sections">
                            @foreach($purchasedCourses as $course)

                                @php
                                    $videoLink = \App\Models\CourseSection::where('course_id', $course->id)->where('type', 'video')->pluck('video_link')->first();
                                    if (strpos($videoLink, "youtube") !== false) {
										$str = explode("embed/", $videoLink);
										$videoCode = preg_replace('/\s+/', '',$str[1]);
										$imageUrl = "https://img.youtube.com/vi/" . $videoCode . "/mqdefault.jpg";
									} elseif (strpos($videoLink, "vimeo") !== false) {
                                        $str = explode("video/", $videoLink);
                                        $videoCode = preg_replace('/\s+/', '',$str[1]);
                                        $imageUrl = "https://vumbnail.com/" . $videoCode . ".jpg";
                                    } else {
										$imageUrl = asset('images/image-placeholder.jpg');
                                    }
                                @endphp

                                <div class="column">
                                    <div class="column_image">
                                        <a href="/{{$creator}}/course/{{$course->slug}}">
                                            <img src="{{ $imageUrl }}" alt="">
                                        </a>
                                    </div>
                                    <div class="column_title">
                                        <a href="/{{$creator}}/course/{{$course->slug}}">
                                            <h3>{{$course->title}}</h3>
                                        </a>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </section>
                    <section class="section_wrap">
                        <h2>Other Courses Created By <span>{{$creator}}</span></h2>
                        <div class="sections">
                            @foreach($unPurchasedCourses as $course)
                                @php
                                    $videoLink = \App\Models\CourseSection::where('course_id', $course->id)->where('type', 'video')->pluck('video_link')->first();
                                    if (strpos($videoLink, "youtube") !== false) {
										$str = explode("embed/", $videoLink);
										$videoCode = preg_replace('/\s+/', '',$str[1]);
										$imageUrl = "https://img.youtube.com/vi/" . $videoCode . "/mqdefault.jpg";
									} elseif (strpos($videoLink, "vimeo") !== false) {
                                        $str = explode("video/", $videoLink);
                                        $videoCode = preg_replace('/\s+/', '',$str[1]);
                                        $imageUrl = "https://vumbnail.com/" . $videoCode . ".jpg";
                                    } else {
										$imageUrl = asset('images/image-placeholder.jpg');
                                    }
                                @endphp
                                <div class="column">
                                    <div class="column_image">
                                        <a href="/{{$creator}}/{{$course->slug}}/checkout">
                                            <img src="{{ $imageUrl }}" alt="">
                                        </a>
                                    </div>
                                    <div class="column_title">
                                        <a href="/{{$creator}}/{{$course->slug}}/checkout">
                                            <h3>{{$course->title}}</h3>
                                        </a>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>

@endsection
