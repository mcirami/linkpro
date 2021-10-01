<div id="popup_choose_level">
    <a class="close_popup" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
    </a>
    <div class="box">
        <div class="content_wrap">
            <h3>Downgrade Your Plan</h3>
            <div class="text_wrap form_wrap">
                <form action="{{ route('subscribe.change.plan') }}" method="post" id="popup_pro_level_form">
                    @csrf
                    <input class="level" name="level" type="hidden" value="pro">
                    <button class='button blue'>
                        Pro
                    </button>
                </form>
                <form action="{{ route('subscribe.cancel') }}" method="post" id="popup_cancel_form">
                    @csrf
                    <input class="plan" name="plan" type="hidden" value="">
                    <button class='button green'>
                        Free
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
