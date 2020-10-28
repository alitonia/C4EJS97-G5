$('#folder-tree-list-btn').click(toggleTreeView);

$("#search-btn").click(function () {
    $("#search-input").toggleClass("active");
})

$('#newFolderWindow').on('hidden.bs.modal', function () {
    $('#new-folder-name').val('').removeClass("border-danger");
    $('.new-folder-alert-error').hide();
    $('.new-folder-alert-success').hide();
})

$('#newFileWindow').on('hidden.bs.modal', function () {
    $('#new-file-name').val('').removeClass("border-danger");
    $('#new-file-name').hide();
    $('#add-file-btn').hide();
    $('.new-file-alert-error').hide();
    $('.new-file-alert-success').hide();
})

$('.web-name').click(function () {
    $('.folder-detail').hide();
    $('.file-detail').hide();
    $('.relative-link').text('');
    openTreeView();
})

$('#new-folder-name').keyup(function(e){
    let newFolderTitle = $('#new-folder-name').val().trim();
    let findFolder = currentUser.findFolder(newFolderTitle);
    if (findFolder) {
        $('#new-folder-name').addClass("border-danger");
        $('.new-folder-alert-error').text(`A folder ${newFolderTitle} already exists!`);
        $('.new-folder-alert-error').show();
    }
    else if (newFolderTitle.length === 0) {
        $('#new-folder-name').addClass("border-danger");
        $('.new-folder-alert-error').text(`A folder name must be provided!`);
        $('.new-folder-alert-error').show();
    }
    else if (!isValidName(newFolderTitle)) {
        $('#new-folder-name').addClass("border-danger");
        $('.new-folder-alert-error').text(`Folder name must contain only characters, numeric digits, underscore!`);
        $('.new-folder-alert-error').show();
    }
    else {
        $('#new-folder-name').removeClass("border-danger");
        $('.new-folder-alert-error').hide();
        if (e.key === "Enter") $("#add-folder-btn").click();
    }
})

$('#new-file-name').keyup(function(e){
    let folderTitle = $('#folder-select').val();
    let newFileTitle = $('#new-file-name').val().trim();
    let findFolder = currentUser.findFolder(folderTitle);
    let findFile = findFolder.findFile(newFileTitle);
    if (findFile) {
        $('#new-file-name').addClass("border-danger");
        $('.new-file-alert-error').text(`A file ${newFileTitle} already exists!`);
        $('.new-file-alert-error').show();
    }
    else if (newFileTitle.length === 0) {
        $('#new-file-name').addClass("border-danger");
        $('.new-file-alert-error').text(`A file name must be provided!`);
        $('.new-file-alert-error').show();
    }
    else if (!isValidName(newFileTitle)) {
        $('#new-file-name').addClass("border-danger");
        $('.new-file-alert-error').text(`File name must contain only characters, numeric digits, underscore!`);
        $('.new-file-alert-error').show();
    }
    else {
        $('#new-file-name').removeClass("border-danger");
        $('.new-file-alert-error').hide();
        if (e.key === "Enter") $("#add-file-btn").click();
    }
})

function toggleTreeView(){
    if (!$('.repo-zone').is(":visible")) openTreeView();
    else hideTreeView();
}

function openTreeView(){
    updateTreeView();
    $('.repo-zone').show();
    $('.relative-link').css('width', '85vw');
    $('.detail-zone').css({
        "width": "85vw",
        "float": "right"
    })
}

function hideTreeView(){
    $('.repo-zone').hide();
    $('.relative-link').css('width', '100vw');
    $('.detail-zone').css({
        "width": "100vw",
        "float": "none"
    })
}

function fillFolderOption() {
    let stringHtml = `<option value="">Choose Folder...</option>`;
    currentUser.repository.forEach((folder) => {
        stringHtml += `<option value="${folder.title}">${folder.title}</option>`
    })
    $('#folder-select').html(stringHtml).change(function () {
        if ($('#folder-select').val() !== "") {
            $('#new-file-name').show();
            $('#add-file-btn').show();
        }
        else {
            $('#new-file-name').hide();
            $('#add-file-btn').hide();
        }
    })
}