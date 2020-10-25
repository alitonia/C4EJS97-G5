$("#search-btn").click(function () {
    $("#search-input").toggleClass("active");
})

$('#newFolderWindow').on('hidden.bs.modal', function () {
    let newFolderInput = document.getElementById("new-folder-name");
    newFolderInput.value = "";
    newFolderInput.classList.remove("border-danger");
    $('.new-folder-alert').hide();
})

$('#newFileWindow').on('hidden.bs.modal', function () {
    let newFileInput = document.getElementById("new-file-name");
    newFileInput.value = "";
    newFileInput.classList.remove("border-danger");
    $('#new-file-name').hide();
    $('#add-file-btn').hide();
    $('.new-file-alert').hide();
})