$("#search-btn").click(function () {
    $("#search-input").toggleClass("active");
})

$('#newFolderWindow').on('hidden.bs.modal', function () {
    let newFolderInput = document.getElementById("new-folder-name");
    newFolderInput.value = "";
    newFolderInput.classList.remove("border-danger");
    $('.new-folder-alert-error').hide();
    $('.new-folder-alert-success').hide();
})

$('#newFileWindow').on('hidden.bs.modal', function () {
    let newFileInput = document.getElementById("new-file-name");
    newFileInput.value = "";
    newFileInput.classList.remove("border-danger");
    $('#new-file-name').hide();
    $('#add-file-btn').hide();
    $('.new-file-alert-error').hide();
    $('.new-file-alert-success').hide();
})

// $(document).ready(function() {
//     // Optimalisation: Store the references outside the event handler:
//     let repoTreeView = $('.repo-zone');

//     function checkWidth() {
//         var repoTreeViewSize = repoTreeView.width();
//         console.log(repoTreeViewSize);
//         if (repoTreeViewSize <= 200) repoTreeView.hide();
//     }
//     // Execute on load
//     checkWidth();
//     // Bind event listener
//     $(window).resize(checkWidth);
// });