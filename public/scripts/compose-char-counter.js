$(document).ready(function() {
  $("#tweet-text").on("input", function () {
    const counterElem = $(this).parent().find(".counter");
    const newVal = 140 - $(this).val().length;

    counterElem.val(newVal);

    if (newVal < 0 && !counterElem.hasClass("text-red")) {
      counterElem.addClass("text-red");
    } else if (newVal >= 0 && counterElem.hasClass("text-red")){
      counterElem.removeClass("text-red");
    }
  })
});