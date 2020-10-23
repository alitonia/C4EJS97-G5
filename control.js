let repoZone = document.getElementsByClassName("repo-zone")[0];
let repoListZone = document.getElementsByClassName("repo-list")[0];
let allNoteListZone = document.getElementsByClassName("all-note-list")[0];
let recentNoteListZone = document.getElementsByClassName("recent-note-list")[0];

let detailZone = document.getElementsByClassName("detail-zone")[0];
let relLinkZone = document.getElementsByClassName("relative-link")[0];
let fileListZone = document.getElementsByClassName("file-list")[0];
let noteListZone = document.getElementsByClassName("note-list")[0];

let newFolderBtn = document.getElementById("new-folder-btn");
let newFileBtn = document.getElementById("new-file-btn");
let searchBtn = document.getElementById("search-btn");
let userBtn = document.getElementById("user-btn");

let nestedTogglers;
let folderTreeDivs;
let noteTreeDivs;
let isAddingNewItem = false;
let currentFocus = null;

searchBtn.addEventListener("click", function () {
    document.getElementById("search-input").classList.toggle("active");
})

function displayRepoTreeView(user) {
    if (repoZone.style.display === "none") {
        currentUser.updateAllNotes();
        currentUser.updateRecentNotes();
        updateTreeView(user);

        repoZone.style.display = "block";
        relLinkZone.style.width = "80vw";
        detailZone.style.width = "80vw";
        detailZone.style.float = "right";

        return;
    }
    repoZone.style.display = "none";
    relLinkZone.style.width = "auto";
    detailZone.style.width = "auto";
    detailZone.style.float = "none";
}

function addNewFolder() {
    repoListZone.innerHTML += `
        <li>
            <div class="folder-tree" style="padding-left: 16px; display: flex; align-items: center;">
                <i class="fas fa-angle-right"></i> 
                <i class="fas fa-folder" style="margin-left: 10px"></i>
                <div class="form-group mx-1" style="width: 100%; margin: auto;">
                    <input type="text" 
                           class="form-control" 
                           id="new-folder-name" 
                           placeholder="Folder name" 
                           onkeyup="enterNewFolder(event)">
                </div>
            </div>
            <ul class="hidden file-tree-list animate__animated animate__slideInLeft"></ul>
        </li>
    `
}

function enterNewFolder(e) {
    let newFolderInput = document.getElementById("new-folder-name");
    const newFolderTitle = newFolderInput.value;
    let findFolder = currentUser.findFolder(newFolderTitle);

    if (findFolder) newFolderInput.classList.add("border-danger");
    else newFolderInput.classList.remove("border-danger");

    if (e.key === "Enter" && !findFolder) {
        let newFolder = new Folder(newFolderTitle);
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

function displayFolder(folder) {
    let fileList = folder.fileList;
    fileListZone.innerHTML = "";
    relLinkZone.innerText = folder.title;
    for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        fileListZone.innerHTML += `
            <div class="file">
                <img class="img-thumbnail" src="img\\file.png" alt="File">
                <p>${file.title}</p>
            </div>
        `
    }
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
    noteTreeDivs = document.getElementsByClassName('note-tree');

    for (let i = 0; i < nestedTogglers.length; i++) {
        nestedTogglers[i].addEventListener("click", function () {
            this.parentElement.parentElement.querySelector(".hidden").classList.toggle("active");
            this.classList.toggle("fa-angle-down");
        });
    }

    for (let i = 0; i < folderTreeDivs.length; i++) {
        let folderTreeDiv = folderTreeDivs[i];
        const folderName = folderTreeDiv.innerText.trim();
        if (!folderTreeDiv.parentElement.classList.contains("all-notes") && !folderTreeDiv.parentElement.classList.contains("recent-notes")) {
            folderTreeDiv.addEventListener("dblclick", function () {
                let folder = currentUser.findFolder(folderName);
                displayFolder(folder);
            })
            folderTreeDiv.addEventListener("click", function () {
                currentFocus = this;
            })
        }
    }

    for (let i = 0; i < noteTreeDivs.length; i++) {
        let noteTreeDiv = noteTreeDivs[i];
        noteTreeDiv.addEventListener("click", function () {
            currentFocus = this;
        })
    }
}