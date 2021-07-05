@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12 card">
            <div class="card-body">
                <h2>Create a new link</h2>
                <form action="/dashboard/links/new" method="POST">
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <div class="form-group">
                                <label for="name">Link Name</label>
                                <input type="text" id="name" name="name" class="form-control{{ $errors->first('name') ? ' is-invalid' : '' }}" value="{{ old('name') }}">
                                @if($errors->first('name'))
                                    <div class="invalid-feedback">{{ $errors->first('name') }}</div>
                                @endif
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="form-group">
                                <label for="link">Link Url</label>
                                <input type="text" id="link" name="link" class="form-control{{ $errors->first('link') ? ' is-invalid' : '' }}" value="{{ old('link') }}">
                                @if($errors->first('link'))
                                    <div class="invalid-feedback">{{ $errors->first('link') }}</div>
                                @endif
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                @csrf
                                <button type="submit" class="btn btn-primary">Save Link</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection