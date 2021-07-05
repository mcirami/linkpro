require('./bootstrap');

$('.user-link').click(function(e) {

    let linkId = $(this).data('link-id');
    let linkUrl = $(this).attr('href');
    // store the visit async without interrupting the link opening
    axios.post('/visit/' + linkId, {
       link: linkUrl
    })
        .then(response => console.log('response: ', response))
        .catch(error => console.error('error: ', error));

})
