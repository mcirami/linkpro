<div id="confirm_popup">
    <div class="box">
        <div class="content_wrap">
            <h3>Confirm</h3>
            <p>Are you sure you want to <span>cancel</span> your subscription</p>
            <form action="" method="post" id="popup_form">
                @csrf
                <input class="plan_name" name="plan_name" type="hidden" value="">
                <button type="submit">Yes</button>
                <a class="close_popup" href="#">No</a>
            </form>
        </div>
    </div>
</div>
