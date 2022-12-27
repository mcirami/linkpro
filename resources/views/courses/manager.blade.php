@extends('layouts.app')

@section('content')

    <div class="container">
        <h2 class="page_title">Course Creator</h2>
        <section id="manager" class="card edit_page">
            <h3>Become a LinkPro Course Creator to generate revenue from your social following and beyond!</h3>
            <ul>
                <li>
                    <span>1</span>
                    @if (empty($landingPage) )
                    <div class="text_wrap">
                        <h4>Create A Landing Page</h4>
                        <p>A Landing Page serves as your home page to let customers know what you're offering.</p>
                    </div>
                    @else
                        <div class="text_wrap flex">
                            <h4>Landing Page Complete</h4>
                            <a href="@php echo "/course-manager/landing-page/" . $landingPage[0]["id"] @endphp">(Edit Landing Page)</a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                        </div>
	                @endif

                </li>
                <li>
                    <span>2</span>
                    <div class="text_wrap">
                        <h4>Add A Course</h4>
                        <p>Create and upload your proprietary Course videos and charge for customers to access your content</p>
                        @if (!empty($landingPage) )
                            <a class="button blue" href="">Create A Course</a>
                        @endif
                    </div>
                </li>
                <li>
                    <span>3</span>
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
        </section>
    </div>
@endsection
