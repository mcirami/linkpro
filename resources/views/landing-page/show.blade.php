@extends('layouts.page.header')

@section('content')

   <div id="links_page" class="live_page">
       <div class="container">
           <div class="creator_wrap">
               <div class="preview">
                   <section class="header">
                       <div class="top_section" style="background: {{$page["header_color"]}}">
                           <div class="container">
                               <div class="logo">
                                   <img src="{{$page["logo"]}}" alt="">
                               </div>
                               <div class="text_wrap">
                                   <p>{{$page["slogan"]}}</p>
                               </div>
                           </div>
                       </div>
                       <div class="header_image my_row"
                            style="
                                background: url({{$page["hero"]}}) no-repeat;
                                background-position: center;
                                background-size: cover;"
                       >
                           <a class="button"
                              style="
                              background: {{$page["button_color"]}};
                              color: {{$page["button_text_color"]}}"
                              href="{{$page[""]}}"
                           >
                               {{$page["button_text"]}}
                           </a>
                       </div>
                   </section>
                   <div class="sections">
                       @foreach($sections as $section)
                           <section>
                               @if ($section->type == "text")
                                   <div class="text" style="background: {{$section->bg_color}}">
                                       <div class="container">
                                           @if($section->button && $section->button_position == "above")
                                               <div class="button_wrap {{$section->button_position}}">
                                                   <a class="button {{$section->button_position}}"
                                                      style="
                                                      background: {{$page["button_color"]}};
                                                      color: {{$page["button_text_color"]}}"
                                                      href="{{$section["button_link"]}}"
                                                   >
                                                       {{$page["button_text"]}}
                                                   </a>
                                               </div>
                                           @endif
                                           <p style="color: {{$section->text_color}}">{{$section->text}}</p>
                                           @if($section->button && $section->button_position == "below")
                                               <div class="button_wrap {{$section->button_position}}">
                                                   <a class="button {{$section->button_position}}"
                                                      style="
                                                  background: {{$page["button_color"]}};
                                                  color: {{$page["button_text_color"]}}"
                                                      href="{{$section["button_link"]}}"
                                                   >
                                                       {{$page["button_text"]}}
                                                   </a>
                                               </div>
                                           @endif
                                       </div>
                                   </div>
                               @endif
                                   @if ($section->type == "image")
                                       <div class="image"
                                            style="
                                           background: url({{$section->image}}) no-repeat;
                                           background-position: center;
                                           background-size: cover;
                                           ">
                                           @if($section->button)
                                               <div class="button_wrap {{$section->button_position}}">
                                                   <a class="button"
                                                      style="
                                                      background: {{$page["button_color"]}};
                                                      color: {{$page["button_text_color"]}}"
                                                      href="{{$section["button_link"]}}"
                                                   >
                                                       {{$page["button_text"]}}
                                                   </a>
                                               </div>
                                           @endif
                                       </div>
                                   @endif
                           </section>
                       @endforeach
                   </div>
               </div>
           </div>
       </div>
   </div>

@endsection

