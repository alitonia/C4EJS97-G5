let repoZone = document.getElementsByClassName("repo-zone")[0];
let repoListZone = document.getElementsByClassName("repo-list")[0];
let allNoteListZone = document.getElementsByClassName("all-note-list")[0];
let recentNoteListZone = document.getElementsByClassName("recent-note-list")[0];

let detailZone = document.getElementsByClassName("detail-zone")[0];
let detailFolderZone = document.getElementsByClassName("detail-folder-zone")[0];
let detailFileZone = document.getElementsByClassName("detail-file-zone")[0];

let newFolderBtn = document.getElementById("new-folder-btn");
let newFileBtn = document.getElementById("new-file-btn");
let searchBtn = document.getElementById("search-btn");
let userBtn = document.getElementById("user-btn");

let nestedTogglers;
let folderTreeDivs;
let currentFocus;

searchBtn.addEventListener("click", function () {
    document.getElementById("search-input").classList.toggle("active");
})

function displayRepoTreeView(user) {
    if (repoZone.style.display === "none") {
        currentUser.updateAllNotes();
        currentUser.updateRecentNotes();
        updateTreeView(user);

        repoZone.style.display = "block";
        detailZone.style.width = "80vw";
        detailZone.style.float = "right";

        return;
    }
    repoZone.style.display = "none";
    detailZone.style.width = "auto";
    detailZone.style.float = "none";
}

function addNewFolder(e) {
    repoListZone.innerHTML += `
        <li>
            <div class="folder-tree" style="padding-left: 16px; overflow: hidden; height: 100%; display: flex; align-items: center;">
                <i class="fas fa-angle-right"></i> 
                <i class="fas fa-folder" style="margin-left: 10px"></i>
                <div class="form-group" style="height: 100%; margin:auto; width: 100%;">
                    <input type="text" 
                           class="form-control-plaintext border" 
                           id="new-folder-name" 
                           placeholder="Folder name" 
                           onkeyup="enterNewFolder(event)" 
                           style="height: 100%; margin-left: 5px;">
                </div>
            </div>
            <ul class="hidden file-tree-list animate__animated animate__slideInLeft"></ul>
        </li>
        `
}

function enterNewFolder(e) {
    let newFolderInput = document.getElementById("new-folder-name");
    let isDuplicate = currentUser.checkDuplicateFolder(newFolderInput.value);
    if (e.key === "Enter" && !isDuplicate) {
        let newFolder = new Folder(newFolderInput.value);
        currentUser.addFolder(newFolder);
        updateTreeView(currentUser);
    }
}

function addNewFile() {
    console.log("add new file");
}

function deleteItem() {
    console.log("delete item");
}

function displaySearchResult() {
    console.log("display search result");
}

function displayFolder() {
    console.log("display folder");
}

function fillAllNoteTree(noteList) {
    allNoteListZone.innerHTML = "";
    for (let i = 0; i < noteList.length; i++) {
        const note = noteList[i];
        allNoteListZone.innerHTML += `<li><div class="note-tree">${note.title}</div></li>
        `
    }
}

function fillRecentNoteTree(noteList) {
    recentNoteListZone.innerHTML = "";
    for (let i = 0; i < noteList.length; i++) {
        const note = noteList[i];
        recentNoteListZone.innerHTML += `<li><div class="note-tree">${note.title}</div></li>`;
    }
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
                <ul class="hidden file-tree-list animate__animated animate__slideInLeft">
        `;
        for (let j = 0; j < fileList.length; j++) {
            const file = fileList[j];
            const noteList = file.noteList;
            stringHtml += `
                    <li>
                        <div class="file-tree">
                            <i class="fas fa-angle-right"></i> 
                            <i class="fas fa-sticky-note"></i> 
                            ${file.title}
                        </div>
                        <ul class="hidden note-tree-list animate__animated animate__slideInLeft">
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

function updateTreeView(user) {
    fillAllNoteTree(user.allNoteList);
    fillRecentNoteTree(user.recentNoteList);
    fillRepoTree(user.repository);
    updateHTML();
}

function updateHTML() {
    nestedTogglers = document.getElementsByClassName("fa-angle-right");
    folderTreeDivs = document.getElementsByClassName("folder-tree");

    for (let i = 0; i < nestedTogglers.length; i++) {
        nestedTogglers[i].addEventListener("click", function () {
            this.parentElement.parentElement.querySelector(".hidden").classList.toggle("active");
            this.classList.toggle("fa-angle-down");
        });
    }

    for (let i = 0; i < folderTreeDivs.length; i++) {
        let folderTreeDiv = folderTreeDivs[i];
        const folderName = folderTreeDiv.innerText;

        if (!folderTreeDiv.parentElement.classList.contains("all-notes") && !folderTreeDiv.parentElement.classList.contains("recent-notes")) {
            folderTreeDiv.addEventListener("click", function () {
                displayFolder();
            })
        }
    }
}