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

function toggleTreeView() {
    if (repoZone.style.display === "none") openTreeView();
    else hideTreeView();
}

function openTreeView() {
    currentUser.updateAllNotes();
    currentUser.updateRecentNotes();
    updateTreeView(currentUser);
    repoZone.style.display = "block";
    relLinkZone.style.width = "80vw";
    detailZone.style.width = "80vw";
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
    else if (!isValidName(newFolderTitle)){
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
    let newFolderTitle = newFolderInput.value;
    let findFolder = currentUser.findFolder(newFolderTitle);
    if (!findFolder && newFolderTitle.length !== 0) {
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
    for (let i = 0; i < currentUser.repository.length; i++) {
        let folder = currentUser.repository[i];
        folderSelect.innerHTML += `<option value="${folder.title}">${folder.title}</option>`
    }
    folderSelect.addEventListener("change", function () {
        if (folderSelect.value !== "") {
            $('#new-file-name').show();
            $('#add-file-btn').show();
        }
        else {
            $('#new-file-name').hide();
            $('#add-file-btn').hide();
        }
    })
}

function enterNewFile(e) {
    let folderSelect = document.getElementById("folder-select");
    let newFileInput = document.getElementById("new-file-name");
    let folderTitle = folderSelect.value;
    let newFileTitle = newFileInput.value;
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
    let newFileTitle = newFileInput.value;
    let findFolder = currentUser.findFolder(folderTitle);
    let findFile = findFolder.findFile(newFileTitle);
    if (!findFile && !newFileTitle.length !== 0) {
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

function deleteItem() {
    console.log("delete item");
}

function displaySearchResult() {
    console.log("display search result");
}

function displayFolder(folder) {
    let fileList = folder.fileList;
    folderDetailZone.style.display = "block";
    fileDetailZone.style.display = "none";
    relLinkZone.innerText = `> ${folder.title}`;
    fileListZone.innerHTML = "";
    for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        fileListZone.innerHTML += `
            <div class="file">
                <div class="file-inside">
                    <img class="img-thumbnail" src="img\\file.png" alt="File">
                    <p>${file.title}</p>
                </div> 
            </div>
        `
    }
    fileDivs = document.getElementsByClassName("file");
    for (let j = 0; j < fileDivs.length; j++) {
        let fileDiv = fileDivs[j];
        fileDiv.addEventListener("dblclick", function () {
            displayFile(folder, fileList[j]);
        })
    }
}


function displayFile(folder, file) {
    let noteList = file.noteList;
    folderDetailZone.style.display = "none";
    fileDetailZone.style.display = "block";
    relLinkZone.innerText = `> ${folder.title} > ${file.title}`
    noteListZone.innerHTML = "";
    for (let i = 0; i < noteList.length; i++) {
        let note = noteList[i];
        noteListZone.innerHTML += `
        <div class="note-container my-5">
            <div class="note-left-col align-items-center">
                <img class="note-img" src="img/note-img-1.jpg" alt="note img">
                <p class='note-date text-center'>${formatDate(note.createdDate)}</p>
            </div>
            <div class="note-right-col">
                <h3 class='note-title font-weight-bold'>${note.title}</h3>       
                <div class='note-link mt-3'>
                    <a href="${note.attachedLink}" target="_blank">Link</a>
                </div>
                <div class='note-content'>${note.content}</div>
            </div>
        </div>
        `;
    }
    searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", function () {
        searchFolder = folder;
        searchFile = file;
        displaySearchResult(folder, file);
    })
}

function displaySearchResult() {
    folder = searchFolder;
    file = searchFile;
    let searchInput = document.getElementById("key-search").value;
    searchInput = searchInput.trim().toLowerCase();
    console.log(searchInput);
    folderDetailZone.style.display = "none";
    fileDetailZone.style.display = "block";

    let noteSearchList = file.searchNote(searchInput);
    noteListZone.innerHTML = "";
    for (let i = 0; i < noteSearchList.length; i++) {
        let note = noteSearchList[i];
        console.log(note.content);
        let noteContent = highlightContent(note.content, searchInput);
        let noteTitle = highlightTitle(note.title, searchInput);


        noteListZone.innerHTML += `
        <div class="note-container my-5">
            <div class="note-left-col align-items-center">
                <img class="note-img" src="img/note-img-1.jpg" alt="note img">
                <p class='note-date text-center'>${formatDate(note.createdDate)}</p>
            </div>
            <div class="note-right-col">
                <h3 class='note-title font-weight-bold'>${noteTitle}</h3>       
                <div class='note-link mt-3'>
                    <a href="${note.attachedLink}" target="_blank">Link</a>
                </div>
                <div class='note-content'>${noteContent}</div>
            </div>
        </div>
        `;
    }
}

function highlightContent(content, searchText){
    let searchExp =  new RegExp(searchText, "ig");
    let matches = content.match(searchExp);
    if (matches){
        content = content.replace(matches[0], `<span class='highlight'>` + matches[0] + `</span>`)
    }
    return content;
}

function highlightTitle(title, searchText){
    let searchExp =  new RegExp(searchText, "ig");
    let matches = title.match(searchExp);
    if (matches){
        title = title.replace(matches[0], `<span class='highlight'>` + matches[0] + `</span>`)
    }
    return title;
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

    for (let i = 0; i < noteList.length; i++) {
        const note = noteList[i];
        stringHtml += `<li><div class="note-tree">${note.title}</div></li>`
    }

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

    for (let i = 0; i < noteList.length; i++) {
        const note = noteList[i];
        stringHtml += `<li><div class="note-tree">${note.title}</div></li>`
    }

    stringHtml += `</ul>`;
    recentNoteZone.innerHTML = stringHtml;
}

function fillRepoTree(repository) {
    let stringHtml = "";
    for (let i = 0; i < repository.length; i++) {
        const folder = repository[i];
        const fileList = folder.fileList;
        stringHtml += `
            <li>
                <div class="folder-tree">
                    <i class="fas fa-angle-right"></i> 
                    <i class="fas fa-folder"></i>
                    ${folder.title}                  
                </div>
                <ul class="hidden file-tree-list">
        `;
        for (let j = 0; j < fileList.length; j++) {
            const file = fileList[j];
            const noteList = file.noteList;
            stringHtml += `
                    <li>
                        <div class="file-tree">
                            <i class="fas fa-sticky-note"></i> 
                            ${file.title}
                        </div>
                        <ul class="hidden note-tree-list">
            `;

            for (let k = 0; k < noteList.length; k++) {
                const note = noteList[k];
                stringHtml += `<li><div class="note-tree">${note.title}</div></li>`
            }

            stringHtml += `
                        </ul>
                    </li>
            `;
        }
        stringHtml += `
                </ul>
            </li>
        `;
    }
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

    for (let i = 0; i < nestedTogglers.length; i++) {
        let nestedToggler = nestedTogglers[i];
        nestedToggler.addEventListener("click", function () {
            this.parentElement.parentElement.querySelector(".hidden").classList.toggle("active");
            this.classList.toggle("fa-angle-down");
        });
    }

    for (let i = 0; i < folderTreeDivs.length; i++) {
        let folderTreeDiv = folderTreeDivs[i];
        const folderName = folderTreeDiv.innerText.trim();
        folderTreeDiv.addEventListener("dblclick", function () {
            let folder = currentUser.findFolder(folderName);
            if (folder) {
                folderDetailZone.style.display = "block";
                fileDetailZone.style.display = "none";
                displayFolder(folder);
            }
            this.parentElement.querySelector(".hidden").classList.toggle("active");
            this.querySelector(".fa-angle-right").classList.toggle("fa-angle-down");
        })
    }

    for (let i = 0; i < fileTreeDivs.length; i++) {
        let fileTreeDiv = fileTreeDivs[i];
        let folderTreeDiv = fileTreeDiv.parentElement.parentElement.parentElement.querySelector(".folder-tree");
        const fileName = fileTreeDiv.innerText.trim();
        const folderName = folderTreeDiv.innerText.trim();

        fileTreeDiv.addEventListener("dblclick", function () {
            let folder = currentUser.findFolder(folderName);
            let file = folder.findFile(fileName);
            displayFile(folder, file);
            this.parentElement.querySelector(".hidden").classList.toggle("active");
        })
    }

    for (let i = 0 ; i < noteTreeDivs.length ; i++){
        let noteTreeDiv = noteTreeDivs[i];
        let noteTitle = noteTreeDiv.innerText;
        noteTreeDiv.addEventListener("click", function(){
            let noteDivs = document.getElementsByClassName('note-container');
            let findNoteDiv = Array(...noteDivs).find(function(noteDiv){
                let noteTitleDiv = noteDiv.querySelector(".note-title");
                return noteTitleDiv.innerText.trim() === noteTitle;
            })
            if (findNoteDiv) findNoteDiv.scrollIntoView({behavior: "smooth", block: "center"});
        })
    }
}

function findFolderTreeDiv(folderTitle) {
    let folderTreeDivs = document.getElementsByClassName("folder-tree");
    folderTreeDivs = new Array(...folderTreeDivs);
    return folderTreeDivs.find(function (folderTreeDiv) {
        return folderTreeDiv.innerText.trim() === folderTitle;
    })
}

function findFileTreeDiv(folderTitle, fileTitle) {
    let folderTreeDiv = findFolderTreeDiv(folderTitle);
    let fileTreeDivs = folderTreeDiv.parentElement.getElementsByClassName("file-tree");
    fileTreeDivs = new Array(...fileTreeDivs);
    return fileTreeDivs.find(function (fileTreeDiv) {
        return fileTreeDiv.innerText.trim() === fileTitle;
    })
}