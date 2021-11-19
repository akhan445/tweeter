/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const renderTweets = function (tweets) {
  for (const tweet of tweets) {
    const article = createTweetElement(tweet);
    $("#tweets-container").append(article);
  }
};

const createTweetElement = function (tweetObj) {
  const $tweet =
    `<article class="tweet">
      <header>
        <div class="user-info">
          <img src=${escape(tweetObj.user.avatars)}>
          <div>${escape(tweetObj.user.name)}</div>
          </div>
        <div class="handle">${escape(tweetObj.user.handle)}</div>
      </header>
      <div class="tweet-body">${escape(tweetObj.content.text)}</div>
      <footer>
        <div>${escape(timeago.format(tweetObj.created_at))}</div>
        <div>
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>`;

  return $tweet;
};

const loadTweets = function() {
  $.get("/tweets")
  .then(function(tweets) {
    renderTweets(tweets);
  });
}

$(document).ready(function () {
  $("#error").hide();
  loadTweets();

  $("form").submit(function (event) {
    event.preventDefault();
    $("#error").slideUp();

    const text = $("#tweet-text").val();
    const error = $(this).parent().find("#error-message");
    console.log(error)

    if (text.trim() === "") {
      error.text("Error: Empty Strings are not allowed.");
      $("#error").slideDown();
    } 
    else if (text.length > 140) {
      error.text("Whoops! Looks live you went over the 140 character limit. Make is shorter!");
      $("#error").slideDown();
    } 
    else {
      $("#error").slideUp();
      const url = $(this).attr("action");
      const data = $(this).serialize();
      $.post(url, data, function() {
        $("#tweet-text").val(""); // clear the value after request
        $(".counter").val(140); //reset counter
        loadTweets(); // then load upon sucess
      })
    }
  });

  $(".right-content").click(function() {
    $(".new-tweet").slideToggle("slow");
  })

});
