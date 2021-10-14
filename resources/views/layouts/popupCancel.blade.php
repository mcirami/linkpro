<div id="confirm_cancel_popup" class="change_plan_message">
    <div class="my_row form_page plans">
        <div class="card">
            <h3 class="popup_title">Confirm</h3>
            <div class="card-body">
                <form action="{{route('subscribe.cancel')}}" method="post">
                    @csrf
                    <input class="plan" name="plan" type="hidden" value="{{ $subscription->braintree_id }}">
                    @if ($subscription->name == "corporate")
                        @php $pages = $user->pages()->get() @endphp
                        <h3>By downgrading your account to Free your subscription will be cancelled. You will lose access to password protect your links, you will be limited to 1 unique link, your icons will be limited to 9 and you will no longer be able to use custom icons..</h3>
                        @if( count($pages) > 1 )
                            <p>You currently have {{count($pages)}} links.</p>
                            <label for="defaultPage">Select which link you would like to keep active:</label>
                            <select name="defaultPage">
                                @foreach($pages as $page)
                                    <option value="{{ $page->id }}">{{ $page->name }}</option>
                                @endforeach
                            </select>
                        @endif
                    @else
                        <h3>By downgrading your account to Free your subscription will be cancelled, your icons will be limited to 9 and you will no longer be able to use custom icons.</h3>
                    @endif
                    <p>Do you want to continue?</p>
                    <div class="button_row">
                        <button type="submit" class='button green'>
                            Yes
                        </button>
                        <a class="close_popup button transparent gray" href="#">No</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
