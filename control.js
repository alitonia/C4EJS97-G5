let repoZone = document.getElementsByClassName("repo-zone")[0];
let repoListZone = document.getElementsByClassName("repo-list")[0];
let allNoteZone = document.getElementsByClassName("all-notes")[0];
let recentNoteZone = document.getElementsByClassName("recent-notes")[0];

let detailZone = document.getElementsByClassName("detail-zone")[0];
let relLinkZone = document.getElementsByClassName("relative-link")[0];
let repoDetailZone = document.getElementsByClassName("repo-detail")[0];
let folderDetailZone = document.getElementsByClassName("folder-detail")[0];
let fileDetailZone = document.getElementsByClassName("file-detail")[0];
let folderListZone = document.getElementsByClassName("folder-list")[0];
let fileListZone = document.getElementsByClassName("file-list")[0];
let noteListZone = document.getElementsByClassName("note-list")[0];

let nestedTogglers;
let folderTreeDivs;
let fileTreeDivs;
let noteTreeDivs;
let fileDivs;

let isTreeViewDisplayed = false;
let newNoteCount = 0;

function toggleTreeView() {
    if (repoZone.style.display === "none") openTreeView();
    else hideTreeView();
}

function openTreeView() {
    currentUser.updateAllNotes();
    currentUser.updateRecentNotes();
    updateTreeView();
    repoZone.style.display = "block";
    relLinkZone.style.width = "85vw";
    detailZone.style.width = "85vw";
    detailZone.style.float = "right";
    isTreeViewDisplayed = true;
}

function hideTreeView() {
    repoZone.style.display = "none";
    relLinkZone.style.width = "100vw";
    detailZone.style.width = "100vw";
    detailZone.style.float = "none";
    isTreeViewDisplayed = false;
}

function enterNewFolder(e) {
    let newFolderInput = document.getElementById("new-folder-name");
    let newFolderTitle = newFolderInput.value.trim();
    let findFolder = currentUser.findFolder(newFolderTitle);

    if (findFolder) {
        newFolderInput.classList.add("border-danger");
        $('.new-folder-alert-error').text(`A folder ${newFolderTitle} already exists!`);
        $('.new-folder-alert-error').show();
    }
    else if (newFolderTitle.length === 0) {
        newFolderInput.classList.add("border-danger");
        $('.new-folder-alert-error').text(`A folder name must be provided!`);
        $('.new-folder-alert-error').show();
    }
    else if (!isValidName(newFolderTitle)) {
        newFolderInput.classList.add("border-danger");
        $('.new-folder-alert-error').text(`Folder name must contain only characters, numeric digits, underscore!`);
        $('.new-folder-alert-error').show();
    }
    else {
        newFolderInput.classList.remove("border-danger");
        $('.new-folder-alert-error').hide();
        if (e.key === "Enter") document.getElementById("add-folder-btn").click();
    }
}

function addNewFolder() {
    let newFolderInput = document.getElementById("new-folder-name");
    let newFolderTitle = newFolderInput.value.trim();
    let findFolder = currentUser.findFolder(newFolderTitle);
    if (!findFolder && newFolderTitle.length !== 0 && isValidName(newFolderTitle)) {
        let newFolder = new Folder(newFolderTitle);
        currentUser.addFolder(newFolder);
        newFolderInput.value = "";
        updateTreeView();
        $('.new-folder-alert-success').text(`A new folder ${newFolderTitle} is added successfully!`);
        $('.new-folder-alert-success').show();
        setTimeout(function () {
            $('#newFolderWindow').modal('hide');
        }, 1500);
        displayFolder(newFolder);
    }
}

function fillFolderOption() {
    let folderSelect = document.getElementById("folder-select");
    folderSelect.innerHTML = `<option value="">Choose Folder...</option>`;
    currentUser.repository.forEach((folder) => {
        folderSelect.innerHTML += `<option value="${folder.title}">${folder.title}</option>`
    })
    folderSelect.onchange = function () {
        if (folderSelect.value !== "") {
            $('#new-file-name').show();
            $('#add-file-btn').show();
        }
        else {
            $('#new-file-name').hide();
            $('#add-file-btn').hide();
        }
    };
}

function enterNewFile(e) {
    let folderSelect = document.getElementById("folder-select");
    let newFileInput = document.getElementById("new-file-name");
    let folderTitle = folderSelect.value;
    let newFileTitle = newFileInput.value.trim();
    let findFolder = currentUser.findFolder(folderTitle);
    let findFile = findFolder.findFile(newFileTitle);

    if (findFile) {
        newFileInput.classList.add("border-danger");
        $('.new-file-alert-error').text(`A file ${newFileTitle} already exists!`);
        $('.new-file-alert-error').show();
    }
    else if (newFileTitle.length === 0) {
        newFileInput.classList.add("border-danger");
        $('.new-file-alert-error').text(`A file name must be provided!`);
        $('.new-file-alert-error').show();
    }
    else if (!isValidName(newFileTitle)) {
        newFileInput.classList.add("border-danger");
        $('.new-file-alert-error').text(`File name must contain only characters, numeric digits, underscore!`);
        $('.new-file-alert-error').show();
    }
    else {
        newFileInput.classList.remove("border-danger");
        $('.new-file-alert-error').hide();
        if (e.key === "Enter") document.getElementById("add-file-btn").click();
    }
}

function addNewFile() {
    let folderSelect = document.getElementById("folder-select");
    let newFileInput = document.getElementById("new-file-name");
    let folderTitle = folderSelect.value;
    let newFileTitle = newFileInput.value.trim();
    let findFolder = currentUser.findFolder(folderTitle);
    let findFile = findFolder.findFile(newFileTitle);
    if (!findFile && newFileTitle.length !== 0 && isValidName(newFileTitle)) {
        let newFile = new File(newFileTitle);
        findFolder.addFile(newFile);
        newFileInput.value = "";
        updateTreeView();
        $('.new-file-alert-success').text(`A new file ${newFileTitle} is added to folder ${findFolder.title} successfully!`);
        $('.new-file-alert-success').show();
        setTimeout(function () {
            $('#newFileWindow').modal('hide');
        }, 1500);
        displayFile(findFolder, newFile);
    }
}

function addNewNote() {
    if (!document.getElementById("new-note")) {
        var date = new Date();
        noteListZone.innerHTML += `
            <div class="note-container my-5" id="new-note">
                <div class="note-left-col align-items-center">
                    <img class="note-img" src="https://picsum.photos/id/${Math.floor(Math.random() * 100)}/150/150" alt="note img">
                    <p class='note-date text-center'>${formatDate(date)}</p>
                </div>
                <div class="note-right-col">
                    <input class="form-control bg-light w-100" type="text" placeholder="Note Title" onkeyup="enterNewNote(event)" id="new-note-title"> 
                    <div class='note-link my-3'>
                        <input class="form-control text-info" type="text" placeholder="Attached Link" id="new-note-link"> 
                    </div>
                    <div class="form-group">
                        <textarea class="form-control" id="new-note-content" rows="6" placeholder="Content" style="resize: none"></textarea>
                    </div>
                    <div class="alert alert-danger new-note-alert-error hidden animate__animated animate__bounceIn"
                    role="alert">
                    </div>
                </div>
                <div class="note-btns">
                    <div class="fas fa-save" id="save-new-note-btn"></div>
                    <div class="fas fa-trash" id="delete-new-note-btn"></div>
                </div>
            </div>
            `;
        document.getElementById("new-note").scrollIntoView({ behavior: "smooth", block: "center" });
        let saveBtn = document.getElementById("save-new-note-btn");
        let deleteBtn = document.getElementById("delete-new-note-btn");
        let tokens = analyzeRelativeLink(relLinkZone.innerText);
        let folder = currentUser.findFolder(tokens[0]);
        let file = folder.findFile(tokens[1]);
        saveBtn.onclick = function () {
            let newNoteTitle = document.getElementById("new-note-title").value.trim();
            let newNoteLink = document.getElementById("new-note-link").value;
            let newNoteContent = document.getElementById("new-note-content").value;
            if (newNoteTitle.length !== 0) {
                let newNote = new Note(newNoteTitle, newNoteLink, newNoteContent);
                newNote.createdDate = date;
                file.addNote(newNote);
                currentUser.updateAllNotes();
                currentUser.updateRecentNotes();
                updateTreeView();
                displayFile(folder, file);
                document.getElementsByClassName("note-container")[0].scrollIntoView({ behavior: "smooth", block: "center" });
            }
            else alert("dit me may");
        }
        deleteBtn.onclick = function () {
            displayFile(folder, file);
            currentUser.updateAllNotes();
            currentUser.updateRecentNotes();
            updateTreeView();
            document.getElementsByClassName("note-container")[0].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
}

function enterNewNote(e) {
    let noteTitleInput = document.getElementById("new-note-title");
    let tokens = analyzeRelativeLink(relLinkZone.innerText);
    let folder = currentUser.findFolder(tokens[0]);
    let file = folder.findFile(tokens[1]);
    let newNoteTitle = noteTitleInput.value.trim();
    let findNote = file.findNote(newNoteTitle);
    if (findNote) {
        noteTitleInput.classList.add("border-danger");
        $('.new-note-alert-error').text(`A note ${newNoteTitle} already exists!`);
        $('.new-note-alert-error').show();
    }
    else if (newNoteTitle.length === 0) {
        noteTitleInput.classList.add("border-danger");
        $('.new-note-alert-error').text(`A note name must be provided!`);
        $('.new-note-alert-error').show();
    }
    else if (!isValidName(newNoteTitle)) {
        noteTitleInput.classList.add("border-danger");
        $('.new-note-alert-error').text(`Note name must contain only characters, numeric digits, underscore!`);
        $('.new-note-alert-error').show();
    }
    else {
        noteTitleInput.classList.remove("border-danger");
        $('.new-note-alert-error').hide();
    }
}

function displayFolder(folder) {
    let fileList = folder.fileList;
    folderDetailZone.style.display = "block";
    fileDetailZone.style.display = "none";
    relLinkZone.innerText = `> ${folder.title}`;
    fileListZone.innerHTML = "";
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
    folderDetailZone.style.display = "none";
    fileDetailZone.style.display = "block";
    relLinkZone.innerText = `> ${folder.title} > ${file.title}`
    noteListZone.innerHTML = "";
    noteList.forEach((note) => {
        noteListZone.innerHTML += `
        <div class="note-container my-5">
            <div class="note-left-col align-items-center">
                <img class="note-img" src="https://picsum.photos/id/${Math.floor(Math.random() * 100)}/150/150" alt="note img">
                <p class='note-date text-center'>${formatDate(note.createdDate)}</p>
            </div>
            <div class="note-right-col">
                <h3 class='note-title font-weight-bold'>${note.title}</h3>       
                <div class='note-link mt-3'>
                    <a href="${note.attachedLink}" target="_blank">Link</a>
                </div>
                <div class='note-content'>${note.content}</div>
            </div>
            <div class="note-btns">
                <div class="fas fa-edit edit-note-btn"></div>
                <div class="fas fa-trash delete-note-btn" data-toggle="modal"
                data-target="#deleteNoteConfirm"></div>
            </div>
        </div>
        `;
    })
    let deleteBtns = document.getElementsByClassName("delete-note-btn");
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].onclick = function () {
            let deleteConfirmBtn = document.getElementsByClassName("delete-note")[0];
            let noteTitle = this.parentElement.parentElement.querySelector(".note-title").innerText;
            deleteConfirmBtn.onclick = function () {
                file.deleteNote(currentUser.findNote(noteTitle));
                currentUser.updateAllNotes();
                currentUser.updateRecentNotes();
                updateTreeView();
                displayFile(folder, file);
                $("#deleteNoteConfirm").modal("hide");
                document.getElementsByClassName("note-container")[0].scrollIntoView({ behavior: "smooth", block: "center" });
            }
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
        <ul class="hidden all-note-list">
    `
    noteList.forEach((note) => {
        stringHtml += `<li><div class="note-tree">${note.title}</div></li>`
    })
    stringHtml += `</ul>`;
    allNoteZone.innerHTML = stringHtml;
}

function fillRecentNoteTree(noteList) {
    let stringHtml = "";
    stringHtml += `
        <div class="folder-tree">
            <i class="fas fa-angle-right"></i>
            <i class="fas fa-globe-asia"></i>
            Recent notes
        </div>
        <ul class="hidden recent-note-list">
    `
    noteList.forEach((note) => {
        stringHtml += `<li><div class="note-tree">${note.title}</div></li>`
    })
    stringHtml += `</ul>`;
    recentNoteZone.innerHTML = stringHtml;
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
                <ul class="hidden file-tree-list">
        `;
        folder.fileList.forEach((file) => {
            stringHtml += `
                    <li>
                        <div class="file-tree">
                            <i class="fas fa-sticky-note"></i> 
                            ${file.title}
                        </div>
                        <ul class="hidden note-tree-list">
            `;
            file.noteList.forEach((note) => {
                stringHtml += `<li><div class="note-tree">${note.title}</div></li>`
            })
            stringHtml += `</ul></li>`;
        })
        stringHtml += `</ul></li>`;
    })
    repoListZone.innerHTML = stringHtml;
}

function updateTreeView() {
    fillAllNoteTree(currentUser.allNoteList);
    fillRecentNoteTree(currentUser.recentNoteList);
    fillRepoTree(currentUser.repository);
    updateHTML();
}

function updateHTML() {
    nestedTogglers = document.getElementsByClassName("fa-angle-right");
    folderTreeDivs = document.getElementsByClassName("folder-tree");
    fileTreeDivs = document.getElementsByClassName("file-tree");
    noteTreeDivs = document.getElementsByClassName('note-tree');

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
                folderDetailZone.style.display = "block";
                fileDetailZone.style.display = "none";
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

function analyzeRelativeLink(relatveLink) {
    let tokens = relatveLink.split("> ");
    tokens = tokens.filter((token) => {
        return token.length !== 0;
    })
    tokens[0] = tokens[0].trim();
    tokens[1] = tokens[1].trim();
    return tokens;
}