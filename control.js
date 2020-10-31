var searchFolder, searchFile;

let folderListZone = document.getElementsByClassName("folder-list")[0];
let fileListZone = document.getElementsByClassName("file-list")[0];
let noteListZone = document.getElementsByClassName("note-list")[0];

function addNewFolder() {
    let newFolderTitle = $('#new-folder-name').val().trim();
    let findFolder = currentUser.findFolder(newFolderTitle);
    if (!findFolder && newFolderTitle.length !== 0 && isValidName(newFolderTitle)) {
        let newFolder = new Folder(newFolderTitle);
        currentUser.addFolder(newFolder);
        $('.new-folder-alert-success').text(`A new folder ${newFolderTitle} is added successfully!`);
        $('.new-folder-alert-success').show();
        setTimeout(function () {
            updateTreeView();
            displayRepository(currentUser);
            $('#newFolderWindow').modal('hide');
        }, 1000);
    }
}

function addNewFile() {
    let folderTitle = $('#folder-select').val();
    let newFileTitle = $('#new-file-name').val().trim();
    let findFolder = currentUser.findFolder(folderTitle);
    let findFile = findFolder.findFile(newFileTitle);
    if (!findFile && newFileTitle.length !== 0 && isValidName(newFileTitle)) {
        let newFile = new File(newFileTitle);
        findFolder.addFile(newFile);
        $('.new-file-alert-success').text(`A new file ${newFileTitle} is added to folder ${findFolder.title} successfully!`);
        $('.new-file-alert-success').show();
        setTimeout(function () {
            updateTreeView();
            displayFolder(findFolder);
            $('#newFileWindow').modal('hide');
        }, 1000);
    }
}

function addNewNote() {
    if (!document.getElementById("new-note")) {
        if (!isTreeViewDisplayed) openTreeView();
        let allNoteToggler = document.getElementsByClassName('fa-angle-right')[0];
        let date = new Date();
        let img = autoGenerateImg();
        let folder = currentUser.findFolder(filterRelLink($('.relative-link .folder-link').text()))
        let file = folder.findFile(filterRelLink($('.relative-link .file-link').text()));
        if (!allNoteToggler.parentElement.parentElement.querySelector(".hidden").classList.contains("active")) {
            allNoteToggler.parentElement.parentElement.querySelector(".hidden").classList.toggle("active");
            allNoteToggler.classList.toggle("fa-angle-down");
        }
        noteListZone.innerHTML += `
            <div class="note-container my-5" id="new-note">
                <div class="note-left-col align-items-center">
                    <img class="note-img" src="${img}" alt="note img">
                    <p class='note-date text-center'>${formatDate(date)}</p>
                </div>
                <div class="note-right-col">
                    <input class="form-control bg-light w-100" type="text" placeholder="Note Title" id="new-note-title"> 
                    <div class='note-link my-3'>
                        <input class="form-control text-primary" type="text" placeholder="Attach Your Link Here" id="new-note-link"> 
                    </div>
                    <div class="form-group">
                        <textarea class="form-control" id="new-note-content" rows="5" placeholder="Note Content" style="resize: none"></textarea>
                    </div>
                    <div class="alert alert-danger new-note-alert-error hidden animate__animated animate__bounceIn"
                    role="alert">
                    </div>
                </div>
                <div class="note-btns">
                    <div class="fas fa-file-export" id="save-new-note-btn"></div>
                    <div class="fas fa-trash" id="delete-new-note-btn"></div>
                </div>
            </div>
        `;
        $("#new-note")[0].scrollIntoView({ behavior: "smooth", block: "center" });
        $('#new-note-title').keyup(enterNoteTitle);
        $('#save-new-note-btn').click(function () {
            let newNoteTitle = $("#new-note-title").val().trim();
            let newNoteLink = $("#new-note-link").val();
            let newNoteContent = $("#new-note-content").val();
            let findNote = currentUser.findNote(newNoteTitle);
            if (newNoteTitle.length !== 0 && isValidName(newNoteTitle) && !findNote) {
                let newNote = new Note(newNoteTitle, newNoteLink, newNoteContent);
                newNote.createdDate = date;
                newNote.img = img;
                file.addNote(newNote);
                updateTreeView();
                displayFile(folder, file);
                $(".note-container")[0].scrollIntoView({ behavior: "smooth", block: "center" });
            }
        })
        $('#delete-new-note-btn').click(function () {
            updateTreeView();
            displayFile(folder, file);
        })
    }
}

function displayRepository(user) {
    $('.repo-detail').show();
    $('.file-detail').hide();
    $('.folder-detail').hide();
    $('.folder-list').html('');
    $('.relative-link').html(`<div class="repo-link">&gt; Repository</div>`)
    let folderList = user.repository;
    folderList.forEach((folder) => {
        folderListZone.innerHTML += `
            <div class="folder">
                <div class="folder-inside">
                    <img class="img-thumbnail" src="img\\folder.png" alt="Folder">
                    <p style="user-select: none">${folder.title}</p>
                </div> 
            </div>
        `
    })
    let folderDivs = document.getElementsByClassName("folder-inside");
    for (let i = 0; i < folderDivs.length; i++) {
        let folderDiv = folderDivs[i];
        folderDiv.ondblclick = () => {
            displayFolder(folderList[i]);
        }
        folderDiv.oncontextmenu = (e) => {
            let repoZoneWidth = 0;
            if (isTreeViewDisplayed) repoZoneWidth = $('.repo-zone').width();
            let top = e.pageY - 50;
            let left = e.pageX - repoZoneWidth;
            $(".repo-detail #folder-context-menu").css({ display: "block", top: top, left: left }).addClass("show");
            $('#delete-folder-btn').click(() => {
                user.deleteFolder(folderList[i]);
                updateTreeView();
                displayRepository(user);
                $('#deleteFolderConfirm').modal('hide');
            })
            $('#rename-folder').click(() => {
                folderDiv.innerHTML = `
                    <img class="img-thumbnail" src="img\\folder.png" alt="Folder">
                    <input class="form-control bg-light" type="text" placeholder="New Name" id="new-folder-title">
                `
                $('#new-folder-title').keyup(function (e) {
                    let newFolderTitle = $('#new-folder-title').val().trim();
                    let findFolder = user.findFolder(newFolderTitle);
                    if (findFolder || newFolderTitle.length === 0 || !isValidName(newFolderTitle)) $('#new-folder-title').addClass("border-danger");
                    else {
                        $('#new-folder-title').removeClass("border-danger");
                        if (e.key === "Enter") {
                            folderList[i].title = newFolderTitle;
                            updateTreeView();
                            displayRepository(user);
                        }
                    }
                })
            })
            return false;
        }
    }
}

function displayFolder(folder) {
    $('.repo-detail').hide();
    $('.file-detail').hide();
    $('.folder-detail').show();
    $('.file-list').html('');
    $('.relative-link').html(`
        <div class="repo-link">&gt; Repository</div>
        <div class="folder-link">&gt; ${folder.title}</div>
    `)
    $('.repo-link').click(() => displayRepository(currentUser));
    let fileList = folder.fileList;
    fileList.forEach((file) => {
        fileListZone.innerHTML += `
            <div class="file">
                <div class="file-inside">
                    <img class="img-thumbnail" src="img\\file.png" alt="File">
                    <p style="user-select: none">${file.title}</p>
                </div> 
            </div>
        `
    })
    let fileDivs = document.getElementsByClassName("file-inside");
    for (let i = 0; i < fileDivs.length; i++) {
        let fileDiv = fileDivs[i];
        fileDiv.ondblclick = () => {
            displayFile(folder, fileList[i]);
        }
        fileDiv.oncontextmenu = (e) => {
            let repoZoneWidth = 0;
            if (isTreeViewDisplayed) repoZoneWidth = $('.repo-zone').width();
            let top = e.pageY - 50;
            let left = e.pageX - repoZoneWidth;
            $(".folder-detail #context-menu").css({ display: "block", top: top, left: left }).addClass("show");
            $('#delete-file-btn').click(() => {
                folder.deleteFile(fileList[i]);
                updateTreeView();
                displayFolder(folder);
                $('#deleteFileConfirm').modal('hide');
            })
            $('#rename-file').click(() => {
                fileDiv.innerHTML = `
                    <img class="img-thumbnail" src="img\\file.png" alt="File">
                    <input class="form-control bg-light" type="text" placeholder="New Name" id="new-file-title">
                `
                $('#new-file-title').keyup(function (e) {
                    let newFileTitle = $('#new-file-title').val().trim();
                    let findFile = folder.findFile(newFileTitle);
                    if (findFile || newFileTitle.length === 0 || !isValidName(newFileTitle)) $('#new-file-title').addClass("border-danger");
                    else {
                        $('#new-file-title').removeClass("border-danger");
                        if (e.key === "Enter") {
                            fileList[i].title = newFileTitle;
                            updateTreeView();
                            displayFolder(folder);
                        }
                    }
                })
            })
            return false;
        }
    }
}

function displayFile(folder, file) {
    let noteList = file.noteList;
    $('.repo-detail').hide();
    $('.folder-detail').hide();
    $('.file-detail').show();
    $('.relative-link').html(`
        <div class="repo-link">&gt; Repository</div>
        <div class="folder-link">&gt; ${folder.title}</div> &nbsp;
        <div class="file-link">&gt; ${file.title}</div>
    `);
    $('.repo-link').click(() => displayRepository(currentUser));
    $('.folder-link').click(() => displayFolder(folder));
    noteListZone.innerHTML = "";
    noteList.forEach((note) => {
        noteListZone.innerHTML += `
            <div class="shadow note-container my-5">
                <div class="note-left-col align-items-center">
                    <img class="note-img" src="${note.img}" alt="note img">
                    <p class='note-date text-center'>${formatDate(note.createdDate)}</p>
                </div>
                <div class="note-right-col">
                    <h3 class='note-title font-weight-bold'>${note.title}</h3>       
                    <div class='note-link mt-3'>
                        <a href="${note.attachedLink}" target="_blank">Source Link</a>
                    </div>
                    <div class='note-content'>${note.content}</div>
                </div>
                <div class="note-btns">
                    <div class="fas fa-edit edit-note-btn"></div>
                    <div class="fas fa-trash delete-note-btn" data-toggle="modal" data-target="#deleteNoteConfirm"></div>
                </div>
            </div>
        `;
    })
    let deleteBtns = document.getElementsByClassName("delete-note-btn");
    let editBtns = document.getElementsByClassName("edit-note-btn");
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].onclick = function () {
            $('#delete-note').click(function () {
                file.deleteNote(noteList[i]);
                updateTreeView();
                displayFile(folder, file);
                $("#deleteNoteConfirm").modal("hide");
            })
        }
    }
    for (let i = 0; i < editBtns.length; i++) {
        editBtns[i].onclick = function () {
            let noteContainer = editBtns[i].parentElement.parentElement;
            let note = noteList[i];
            let modifyDate = new Date();
            noteContainer.innerHTML = `
                <div class="note-left-col align-items-center">
                    <img class="note-img" src="${note.img}" alt="note img">
                    <p class='note-date text-center'>${formatDate(modifyDate)}</p>
                </div>
                <div class="note-right-col">
                    <input class="form-control bg-light w-100" type="text" placeholder="Note Title" id="new-note-title" value="${note.title}"> 
                    <div class='note-link my-3'>
                        <input class="form-control text-primary" type="text" placeholder="Attach Your Link Here" id="new-note-link" value="${note.attachedLink}"> 
                    </div>
                    <div class="form-group">
                        <textarea class="form-control" id="new-note-content" rows="5" placeholder="Note Content" style="resize: none">${note.content}</textarea>
                    </div>
                    <div class="alert alert-danger new-note-alert-error hidden animate__animated animate__bounceIn" role="alert"></div></div>
                <div class="note-btns">
                    <div class="fas fa-file-export" id="save-new-note-btn"></div>
                    <div class="fas fa-trash" id="delete-new-note-btn"></div>
                </div>
            `
            $('#new-note-title').keyup(enterNoteTitle);
            $('#save-new-note-btn').click(function () {
                let newNoteTitle = $("#new-note-title").val().trim();
                let newNoteLink = $("#new-note-link").val();
                let newNoteContent = $("#new-note-content").val();
                let findNote = currentUser.findNote(newNoteTitle);
                if (newNoteTitle.length !== 0 && isValidName(newNoteTitle) && (!findNote || newNoteTitle === note.title)) {
                    note.title = newNoteTitle;
                    note.attachedLink = newNoteLink;
                    note.content = newNoteContent;
                    note.createdDate = modifyDate;
                    updateTreeView();
                    displayFile(folder, file);
                    $(".note-container")[i].scrollIntoView({ behavior: "smooth", block: "center" });
                }
            })
            $('#delete-new-note-btn').click(function () {
                file.deleteNote(noteList[i]);
                updateTreeView();
                displayFile(folder, file);
            })
        }
    }
    $('#search-btn').click(function () {
        searchFolder = folder;
        searchFile = file;
    })
}

function displaySearchResult(folder, file) {
    let searchInput = $("#key-search").val().trim().toLowerCase();
    $('.repo-detail').hide();
    $('.folder-detail').hide();
    $('.file-detail').show();
    let noteSearchList = file.searchNote(searchInput);
    noteListZone.innerHTML = "";
    for (let i = 0; i < noteSearchList.length; i++) {
        let note = noteSearchList[i];
        let noteContent = highlight(note.content, searchInput);
        let noteTitle = highlight(note.title, searchInput);
        let noteCreatedDate = highlight(formatDate(note.createdDate), searchInput);
        noteListZone.innerHTML += `
        <div class="note-container my-5">
            <div class="note-left-col align-items-center">
                <img class="note-img" src="${note.img}" alt="note img">
                <p class='note-date text-center'>${noteCreatedDate}</p>
            </div>
            <div class="note-right-col">
                <h3 class='note-title font-weight-bold'>${noteTitle}</h3>       
                <div class='note-link mt-3'>
                    <a href="${note.attachedLink}" target="_blank">Source Link</a>
                </div>
                <div class='note-content'>${noteContent}</div>
            </div>
            <div class="note-btns">
                    <div class="fas fa-edit edit-note-btn"></div>
                    <div class="fas fa-trash delete-note-btn" data-toggle="modal" data-target="#deleteNoteConfirm"></div>
            </div>
        </div>
        `;
    }
    let deleteBtns = document.getElementsByClassName("delete-note-btn");
    let editBtns = document.getElementsByClassName("edit-note-btn");
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].onclick = function () {
            $('#delete-note').click(function () {
                file.deleteNote(noteSearchList[i]);
                updateTreeView();
                displaySearchResult(folder, file);
                $("#deleteNoteConfirm").modal("hide");
            })
        }
    }
    for (let i = 0; i < editBtns.length; i++) {
        editBtns[i].onclick = function () {
            let noteContainer = editBtns[i].parentElement.parentElement;
            let note = noteList[i];
            let modifyDate = new Date();
            noteContainer.innerHTML = `
                <div class="note-left-col align-items-center">
                    <img class="note-img" src="${note.img}" alt="note img">
                    <p class='note-date text-center'>${formatDate(modifyDate)}</p>
                </div>
                <div class="note-right-col">
                    <input class="form-control bg-light w-100" type="text" placeholder="Note Title" id="new-note-title" value="${note.title}"> 
                    <div class='note-link my-3'>
                        <input class="form-control text-primary" type="text" placeholder="Attach Your Link Here" id="new-note-link" value="${note.attachedLink}"> 
                    </div>
                    <div class="form-group">
                        <textarea class="form-control" id="new-note-content" rows="5" placeholder="Note Content" style="resize: none">${note.content}</textarea>
                    </div>
                    <div class="alert alert-danger new-note-alert-error hidden animate__animated animate__bounceIn" role="alert"></div></div>
                <div class="note-btns">
                    <div class="fas fa-file-export" id="save-new-note-btn"></div>
                    <div class="fas fa-trash" id="delete-new-note-btn"></div>
                </div>
            `
            $('#new-note-title').keyup(enterNoteTitle);
            $('#save-new-note-btn').click(function () {
                let newNoteTitle = $("#new-note-title").val().trim();
                let newNoteLink = $("#new-note-link").val();
                let newNoteContent = $("#new-note-content").val();
                let findNote = currentUser.findNote(newNoteTitle);
                if (newNoteTitle.length !== 0 && isValidName(newNoteTitle) && (!findNote || newNoteTitle === note.title)) {
                    note.title = newNoteTitle;
                    note.attachedLink = newNoteLink;
                    note.content = newNoteContent;
                    note.createdDate = modifyDate;
                    updateTreeView();
                    displaySearchResult(folder, file);
                    $(".note-container")[i].scrollIntoView({ behavior: "smooth", block: "center" });
                }
            })
            $('#delete-new-note-btn').click(function () {
                file.deleteNote(noteList[i]);
                updateTreeView();
                displaySearchResult(folder, file);
            })
        }
    }
}

function fillAllNoteTree(noteList) {
    let stringHtml = "";
    stringHtml += `
        <div class="folder-tree">
            <i class="fas fa-angle-right"></i>
            <i class="fas fa-globe-asia"></i>
            All notes
        </div>
        <ul class="hidden all-note-list animate__animated animate__slideInLeft">
    `
    noteList.forEach((note) => {
        stringHtml += `<li><div class="note-tree">${note.title}</div></li>`
    })
    stringHtml += `</ul>`;
    $('.all-notes').html(stringHtml);
}

function fillRecentNoteTree(noteList) {
    let stringHtml = "";
    stringHtml += `
        <div class="folder-tree">
            <i class="fas fa-angle-right"></i>
            <i class="fas fa-globe-asia"></i>
            Recent notes
        </div>
        <ul class="hidden recent-note-list animate__animated animate__slideInLeft">
    `
    noteList.forEach((note) => {
        stringHtml += `<li><div class="note-tree">${note.title}</div></li>`
    })
    stringHtml += `</ul>`;
    $('.recent-notes').html(stringHtml);
}

function fillRepoTree(repository) {
    let stringHtml = "";
    repository.forEach((folder) => {
        stringHtml += `
            <li>
                <div class="folder-tree">
                    <i class="fas fa-angle-right"></i> 
                    <i class="fas fa-folder"></i>
                    ${folder.title}                  
                </div>
                <ul class="hidden file-tree-list animate__animated animate__slideInLeft">
        `;
        folder.fileList.forEach((file) => {
            stringHtml += `
                    <li>
                        <div class="file-tree">
                            <i class="fas fa-sticky-note"></i> 
                            ${file.title}
                        </div>
                        <ul class="hidden note-tree-list animate__animated animate__slideInLeft">
            `;
            file.noteList.forEach((note) => {
                stringHtml += `<li><div class="note-tree">${note.title}</div></li>`
            })
            stringHtml += `</ul></li>`;
        })
        stringHtml += `</ul></li>`;
    })
    $('.repo-list').html(stringHtml);
}

function updateTreeView() {
    currentUser.updateAllNotes();
    currentUser.updateRecentNotes();
    fillAllNoteTree(currentUser.allNoteList);
    fillRecentNoteTree(currentUser.recentNoteList);
    fillRepoTree(currentUser.repository);
    updateCurrentUserJSON();
    updateHTML();
}

function updateHTML() {
    let nestedTogglers = document.getElementsByClassName("fa-angle-right");
    let folderTreeDivs = document.getElementsByClassName("folder-tree");
    let fileTreeDivs = document.getElementsByClassName("file-tree");
    let noteTreeDivs = document.getElementsByClassName('note-tree');

    for (nestedToggler of nestedTogglers) {
        nestedToggler.onclick = function () {
            this.parentElement.parentElement.querySelector(".hidden").classList.toggle("active");
            this.classList.toggle("fa-angle-down");
        }
    }

    for (folderTreeDiv of folderTreeDivs) {
        let folderName = folderTreeDiv.innerText.trim();
        folderTreeDiv.ondblclick = function () {
            let folder = currentUser.findFolder(folderName);
            if (folder) {
                $('.folder-detail').show();
                $('.file-detail').hide();
                displayFolder(folder);
            }
            if (!this.parentElement.querySelector(".hidden").classList.contains('active')) {
                this.parentElement.querySelector(".hidden").classList.toggle("active");
                this.querySelector(".fa-angle-right").classList.toggle("fa-angle-down");
            }
        }
    }

    for (fileTreeDiv of fileTreeDivs) {
        let folderTreeDiv = fileTreeDiv.parentElement.parentElement.parentElement.querySelector(".folder-tree");
        let fileName = fileTreeDiv.innerText.trim();
        let folderName = folderTreeDiv.innerText.trim();
        fileTreeDiv.setAttribute("title", `\\${folderName}`)
        fileTreeDiv.ondblclick = function () {
            let folder = currentUser.findFolder(folderName);
            let file = folder.findFile(fileName);
            displayFile(folder, file);
            this.parentElement.querySelector(".hidden").classList.toggle("active");
        }
    }

    for (noteTreeDiv of noteTreeDivs) {
        let noteTitle = noteTreeDiv.innerText;
        let note = currentUser.findNote(noteTitle);
        let file = note.findFile(currentUser);
        let folder = note.findFolder(currentUser);
        noteTreeDiv.setAttribute("title", `\\${folder.title}\\${file.title}`)
        noteTreeDiv.onclick = function () {
            displayFile(folder, file);
            let noteDivs = document.getElementsByClassName('note-container');
            let findNoteDiv = Array(...noteDivs).find(function (noteDiv) {
                let noteTitleDiv = noteDiv.querySelector(".note-title");
                return noteTitleDiv.innerText.trim() === noteTitle;
            })
            findNoteDiv.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
}

function findFolderTreeDiv(folderTitle) {
    let folderTreeDivs = document.getElementsByClassName("folder-tree");
    folderTreeDivs = new Array(...folderTreeDivs);
    return folderTreeDivs.find((folderTreeDiv) => {
        return folderTreeDiv.innerText.trim() === folderTitle;
    })
}

function findFileTreeDiv(folderTitle, fileTitle) {
    let folderTreeDiv = findFolderTreeDiv(folderTitle);
    let fileTreeDivs = folderTreeDiv.parentElement.getElementsByClassName("file-tree");
    fileTreeDivs = new Array(...fileTreeDivs);
    return fileTreeDivs.find((fileTreeDiv) => {
        return fileTreeDiv.innerText.trim() === fileTitle;
    })
}

function logOut() {
    usersJSON = usersJSON.filter((user) => {
        return user.userName !== currentUser.userName;
    })
    usersJSON.push(JSON.parse(JSON.stringify(currentUser)));
    localStorage.setItem('users', JSON.stringify(usersJSON));
    localStorage.removeItem('currentUser');
    window.location = "index.html";
}

function initUserPage(user) {
    displayRepository(user);
    $('#user-name').text(`Welcome, ${user.userName}!`);
}

var currentUser;
var usersJSON = JSON.parse(localStorage.getItem('users'));
var currentUserJSON = localStorage.getItem('currentUser');

if (currentUserJSON) {
    currentUserJSON = JSON.parse(currentUserJSON);
    currentUser = User.prototype.parse(currentUserJSON);
    initUserPage(currentUser);
}

function updateCurrentUserJSON() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}