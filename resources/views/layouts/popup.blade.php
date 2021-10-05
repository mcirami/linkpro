<div id="confirm_popup">
    <div class="box">
        <div class="content_wrap">
            <h3 class="popup_title">Confirm</h3>
            <div class="text_wrap">
                <p>Are you sure you want to <span id="text_type"></span> your plan?</p>
                <form action="" method="post" id="popup_form">
                    @csrf
                    <input class="level" name="level" type="hidden" value="">
                    <input class="plan" name="plan" type="hidden" value="">
                    <button type="submit" class="button green">Yes</button>
                    <a class="close_popup button red" href="#">No</a>
                </form>
            </div>
        </div>
    </div>
</div>
