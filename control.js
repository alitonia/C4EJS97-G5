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
            $('#newFolderWindow').modal('hide');
            updateTreeView();
            displayFolder(newFolder);
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
            $('#newFileWindow').modal('hide');
            updateTreeView();
            displayFile(findFolder, newFile);
        }, 1000);
    }
}

function addNewNote() {
    if (!document.getElementById("new-note")) {
        let date = new Date();
        let img = `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 100}/150/150`;
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
        let newNoteTitle = $("#new-note-title").val().trim();
        let newNoteLink = $("#new-note-link").val();
        let newNoteContent = $("#new-note-content").val();
        let tokens = analyzeRelativeLink($('.relative-link').text());
        let folder = currentUser.findFolder(tokens[0]);
        let file = folder.findFile(tokens[1]);
        $("#new-note")[0].scrollIntoView({ behavior: "smooth", block: "center" });
        $('#save-new-note-btn').click(function () {
            if (newNoteTitle.length !== 0 && isValidName(newNoteTitle)) {
                let newNote = new Note(newNoteTitle, newNoteLink, newNoteContent, img);
                newNote.createdDate = date;
                file.addNote(newNote);
                updateTreeView();
                displayFile(folder, file);
                $(".note-container")[0].scrollIntoView({ behavior: "smooth", block: "center" });
            }
        })
        $('#delete-new-note-btn').click(function () {
            updateTreeView();
            displayFile(folder, file);
            $(".note-container")[0].scrollIntoView({ behavior: "smooth", block: "center" });
        })
    }
}

function displayFolder(folder) {
    $('.folder-detail').show();
    $('.file-detail').hide();
    $('.relative-link').text(`> ${folder.title}`);
    $('.file-list').html('');
    let fileList = folder.fileList;
    folder.fileList.forEach((file) => {
        fileListZone.innerHTML += `
            <div class="file">
                <div class="file-inside">
                    <img class="img-thumbnail" src="img\\file.png" alt="File">
                    <p>${file.title}</p>
                </div> 
            </div>
        `
    })
    fileDivs = document.getElementsByClassName("file");
    for (let i = 0; i < fileDivs.length; i++) {
        fileDivs[i].ondblclick = () => {
            displayFile(folder, fileList[i]);
        }
    }
}

function displayFile(folder, file) {
    let noteList = file.noteList;
    $('.folder-detail').hide();
    $('.file-detail').show();
    $('.relative-link').text(`> ${folder.title} > ${file.title}`);
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
    for (deleteBtn of deleteBtns) {
        deleteBtn.onclick = function () {
            let noteTitle = this.parentElement.parentElement.querySelector(".note-title").innerText;
            $('#delete-note').click(function () {
                file.deleteNote(currentUser.findNote(noteTitle));
                updateTreeView();
                displayFile(folder, file);
                $("#deleteNoteConfirm").modal("hide");
                $(".note-container")[0].scrollIntoView({ behavior: "smooth", block: "center" });
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
            this.parentElement.querySelector(".hidden").classList.toggle("active");
            this.querySelector(".fa-angle-right").classList.toggle("fa-angle-down");
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