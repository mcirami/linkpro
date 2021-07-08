@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 card">
                <div class="card-body">
                    <h2>Edit Page Appearance</h2>
                    <form action="/dashboard/appearance" method="POST">
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <div class="form-group">
                                    <label for="background">Background</label>
                                    <input type="text" id="background" name="background" class="form-control{{ $errors->first('background') ? ' is-invalid' : '' }}" value="{{ $user->background }}">
                                    @if($errors->first('background'))
                                        <div class="invalid-feedback">{{ $errors->first('background') }}</div>
                                    @endif
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="form-group">
                                    <label for="text_color">Text Color</label>
                                    <input type="text" id="text_color" name="text_color" class="form-control{{ $errors->first('text_color') ? ' is-invalid' : '' }}"  value="{{ $user->text_color }}">
                                    @if($errors->first('text_color'))
                                        <div class="invalid-feedback">{{ $errors->first('text_color') }}</div>
                                    @endif
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    @csrf
                                    <button type="submit" class="btn btn-primary{{ session('success') ? ' is-valid' : '' }}">Save Settings</button>
                                    @if(session('success'))
                                        <div class="valid-feedback">
                                            {{ session('success') }}
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
