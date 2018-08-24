jQuery(document).ready(function () {
    var  filterContainer = jQuery('.grid');
    filterContainer.masonry({
    itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
    });
    filterContainer.masonry();

  $("#subscribeBtn").click(function() {

    var email = $("#subsribe").val();

    console.log(`mail sent from ${email}`);

    $.ajax({
      type: 'POST',
      url: 'mail.php',
      data: {
        action: 'send_email',
        email: email,
      },
      success: function (data) {
        console.log(data)
      },
      error: function (data) {
        console.log(data)
      }
    });
  });

});







