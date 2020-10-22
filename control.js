let repoZone = document.getElementsByClassName("repo-zone")[0];
let repoListZone = document.getElementsByClassName("repo-list")[0];
let allNoteListZone = document.getElementsByClassName("all-note-list")[0];
let recentNoteListZone = document.getElementsByClassName("recent-note-list")[0];

let detailZone = document.getElementsByClassName("detail-zone")[0];
let detailFolderZone = document.getElementsByClassName("detail-folder-zone")[0];
let detailFileZone = document.getElementsByClassName("detail-file-zone")[0];

let folderListBtn = document.getElementById("folder-list-btn");
let newFolderBtn = document.getElementById("new-folder-btn");
let newFileBtn = document.getElementById("new-file-btn");
let searchBtn = document.getElementById("search-btn");
let userBtn = document.getElementById("user-btn");

let nestedTogglers;
let folderDivs;

let treeChosen = false;
let currentFocus;

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

function displayFolder() {

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
    folderDivs = document.getElementsByClassName("folder-tree");

    for (let i = 0; i < nestedTogglers.length; i++) {
        nestedTogglers[i].addEventListener("click", function () {
            this.parentElement.parentElement.querySelector(".hidden").classList.toggle("active");
            this.classList.toggle("fa-angle-down");
        });
    }

    for (let i = 0; i < folderDivs.length; i++) {
        let folderDiv = folderDivs[i];
        folderDiv.addEventListener("click", function () {
            
        })
    }
}

