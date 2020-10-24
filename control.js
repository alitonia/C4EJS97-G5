let repoZone = document.getElementsByClassName("repo-zone")[0];
let repoListZone = document.getElementsByClassName("repo-list")[0];
let allNoteZone = document.getElementsByClassName("all-notes")[0];
let recentNoteZone = document.getElementsByClassName("recent-notes")[0];

let detailZone = document.getElementsByClassName("detail-zone")[0];
let relLinkZone = document.getElementsByClassName("relative-link")[0];
let folderDetailZone = document.getElementsByClassName("folder-detail")[0];
let fileDetailZone = document.getElementsByClassName("file-detail")[0];
let fileListZone = document.getElementsByClassName("file-list")[0];
let noteListZone = document.getElementsByClassName("note-list")[0];

let newFolderBtn = document.getElementById("new-folder-btn");
let newFileBtn = document.getElementById("new-file-btn");
let searchBtn = document.getElementById("search-btn");
let userBtn = document.getElementById("user-btn");

let nestedTogglers;

let folderTreeDivs;
let fileTreeDivs;
let noteTreeDivs;

let fileDivs;

let currentFolderDiv = null;

let isTreeViewDisplayed = false;

function displayRepoTreeView(user) {
    if (repoZone.style.display === "none") {
        currentUser.updateAllNotes();
        currentUser.updateRecentNotes();
        updateTreeView(user);

        repoZone.style.display = "block";
        relLinkZone.style.width = "80vw";
        detailZone.style.width = "80vw";
        detailZone.style.float = "right";

        isTreeViewDisplayed = true;
        return;
    }
    repoZone.style.display = "none";
    relLinkZone.style.width = "auto";
    detailZone.style.width = "auto";
    detailZone.style.float = "none";
    isTreeViewDisplayed = false;
}

function addNewFolder() {
    if (!document.getElementById("new-folder-name")) {
        if (!isTreeViewDisplayed) displayRepoTreeView(currentUser);
        repoListZone.innerHTML += `
            <li>
                <div class="folder-tree" style="padding-left: 16px; display: flex; align-items: center;">
                    <i class="fas fa-angle-right"></i> 
                    <i class="fas fa-folder" style="margin-left: 10px"></i>
                    <div class="form-group mx-1" style="width: 100%; margin: auto;">
                        <input type="text" 
                            class="form-control" 
                            id="new-folder-name" autofocus
                            placeholder="Folder name" 
                            onkeyup="enterNewFolder(event)">
                    </div>
                </div>
                <ul class="hidden file-tree-list"></ul>
            </li>
        `
        let newFolderInput = document.getElementById("new-folder-name");
        newFolderInput.addEventListener("focusout", updateTreeView);
    }
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
        document.getElementById("new-folder-name").removeEventListener("focusout", updateTreeView);
        updateTreeView(currentUser);
    }
}

function addNewFile() {
    console.log("add new file");
    // if (currentFolderDiv) {
    //     if (!document.getElementById("new-file-name")) {
    //         let fileListDiv = currentFolderDiv.parentElement.querySelector(".file-tree-list");
    //         fileListDiv.innerHTML += `
    //             <li>
    //                 <div class="file-tree" style="padding-left: 40px; display: flex; align-items: center;">
    //                     <i class="fas fa-angle-right"></i> 
    //                     <i class="fas fa-sticky-note" style="margin-left: 10px"></i>
    //                     <div class="form-group mx-1" style="width: 100%; margin: auto;">
    //                         <input type="text" 
    //                             class="form-control" 
    //                             id="new-file-name" autofocus
    //                             placeholder="File name" 
    //                             onkeyup="enterNewFile(event)">
    //                     </div>
    //                 </div>
    //                 <ul class="hidden file-tree-list"></ul>
    //             </li>
    //         `
    //         let input = document.getElementById('new-file-name');
    //         input.addEventListener("focusout", function () {
    //             updateTreeView(currentUser);
    //         })
    //     }
    // }
    // else alert("Select a folder first");
}

// function enterNewFile(e) {
//     let newFileInput = document.getElementById("new-file-name");
//     const newFileTitle = newFileInput.value;
//     let findFolder = currentUser.findFolder(currentFolderDiv.innerText.trim());
//     let findFile = findFolder.findFile(newFileTitle);

//     if (findFile) newFileInput.classList.add("border-danger");
//     else newFileInput.classList.remove("border-danger");

//     if (e.key === "Enter" && !findFile) {
//         let newFile = new File(newFileTitle);
//         findFolder.addFile(newFile);
//         updateTreeView(currentUser);
//         displayFolder(findFolder);
//     }
// }

function deleteItem() {
    console.log("delete item");
}

function displaySearchResult() {
    console.log("display search result");
}

function displayFolder(folder) {
    let fileList = folder.fileList;
    relLinkZone.innerText = `> ${folder.title}`;
    fileListZone.innerHTML = "";
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

function displayFile(folder, file) {
    relLinkZone.innerText = `> ${folder.title} > ${file.title}`
    console.log(`display ${file.title} in ${folder.title}`);
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
                            <i class="fas fa-angle-right"></i> 
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
    fileDivs = document.getElementsByClassName('file');

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
                currentFolderDiv = this;
                folderDetailZone.style.display = "block";
                fileDetailZone.style.display = "none";
                displayFolder(folder);
                fileDivs = document.getElementsByClassName('file');
                for (let j = 0; j < fileDivs.length; j++) {
                    let fileDiv = fileDivs[j];
                    let file = fileDiv.innerText;
                    fileDiv.addEventListener("dblclick", function () {
                        displayFile(folder, file)
                    })
                }
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
            folderDetailZone.style.display = "none";
            fileDetailZone.style.display = "block";
            displayFile(folder, file);
            this.parentElement.querySelector(".hidden").classList.toggle("active");
            this.querySelector(".fa-angle-right").classList.toggle("fa-angle-down");
        })
    }

    // for (let i = 0; i < noteTreeDivs.length; i++) {
    //     let noteTreeDiv = noteTreeDivs[i];
    // }
}