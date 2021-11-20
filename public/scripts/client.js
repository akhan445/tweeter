/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/* Validate's user's tweet is not malicious */
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

/* Render's tweet on the main page */
const renderTweets = function (tweets) {
  for (const tweet of tweets) {
    const article = createTweetElement(tweet);
    $("#tweets-container").append(article);
  }
};

/* Create a new html element of user's tweet */
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

/* Makes a get request for all the tweets and then renders them onto the screen */
const loadTweets = function() {
  $.get("/tweets")
  .then(function(tweets) {
    renderTweets(tweets);
  });
}

/* jQuery main function to handle client events */
$(document).ready(function () {
  // Hide the error, load all tweets from database on load
  $("#error").hide();
  loadTweets();

  // Form submission handling
  $("form").submit(function (event) {
    event.preventDefault();
    if ($("#error").css("display") === "none") {
      $("#error").slideUp();
    }

    const text = $("#tweet-text").val();
    const error = $(this).parent().find("#error-message");

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

  // Write a new tweet section on nav
  $(".right-content").click(function() {
    // Slide up the error message if displayed and auto focus in text area
    $("body").find("#error").slideUp();
    $(".new-tweet").slideToggle("slow");
    $("#tweet-text").focus();
  });

  //back to top button scroll handling 
  $(window).scroll(function() {
    // displays when the user has scrolled at least 150 pixels
    if ($(this).scrollTop() > 150) {
      $("#back-to-top").show();
    } else {
      $("#back-to-top").hide();
    }
  });

  // Scroll to top of page on click
  $("#back-to-top").click(function() {
    $(window).scrollTop(0);
  });

});
