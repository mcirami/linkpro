@extends('layouts.app')

@section('content')

    <div class="container">
        <h2 class="page_title">Course Creator</h2>
        <section class="card edit_page manager">
            <h3>Become a LinkPro Course Creator to generate revenue from your social following and beyond!</h3>
            <ul>
                <li>
                    <span>1</span>
                    <h4>Create A Landing Page</h4>
                    <p>A Landing Page serves as your home page to let customers know what you're offering.</p>
                </li>
                <li>
                    <span>2</span>
                    <h4>Add A Course</h4>
                    <p>Create and upload your proprietary Course videos and charge for customers to access your content</p>
                </li>
                <li>
                    <span>3</span>
                    <h4>Promote your Course link and get paid!</h4>
                    <p>Publish and market your Course to generate income. Recruit others to sell your Cousrse to earn shared profits!</p>
                </li>
            </ul>
            <a class="button blue" href="{{ route('add.landing.page') }}">
                Get Started!
            </a>
        </section>
    </div>
@endsection
