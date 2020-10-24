$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$("#search-btn").click(function () {
    $("#search-input").toggleClass("active");
})