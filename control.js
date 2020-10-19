let repoZone = document.getElementsByClassName("repo-zone")[0];
let repoListZone = document.getElementsByClassName("repo-list")[0];
let allNoteListZone = document.getElementsByClassName("all-note-list")[0];
let recentNoteListZone = document.getElementsByClassName("recent-note-list")[0];

let detailZone = document.getElementsByClassName("detail-zone")[0];
let detailFolderZone = document.getElementsByClassName("detail-folder-zone")[0];
let detailFileZone = document.getElementsByClassName("detail-file-zone")[0];

let folderListBtn = document.getElementById("folder-list-btn");
let newFolderBtn = document.getElementById("new-folder-btn");
let newFilallNoteListZoneeBtn = document.getElementById("new-file-btn");
let searchBtn = document.getElementById("search-btn");
let userBtn = document.getElementById("user-btn");

<<<<<<< HEAD
function displayRepository(user) {
    if (repoZone.style.display === "none") {
        let allNoteList = user.allNoteList;
        let recentNoteList = user.recentNoteList;
        let repository = user.repository;

        allNoteListZone.innerHTML = "";
        recentNoteListZone.innerHTML = "";
        
        for (let i = 0; i < allNoteList.length; i++) {
            let note = allNoteList[i];
            allNoteListZone.innerHTML += `
                <li><div class="note">${note.title}</div></li>
            `
        }
        for (let i = 0; i < recentNoteList.length; i++) {
            let note = recentNoteList[i];
            recentNoteListZone.innerHTML += `
                <li><div class="note">${note.title}</div></li>
            `
        }

=======

function displayRepository() {
    if (repoZone.style.display === "none") {
>>>>>>> fe42659bb9f75f6b9c75d0606e4d826f3985fca5
        repoZone.style.display = "block";
        detailZone.style.width = "80vw";
        detailZone.style.float = "right";
        return;
    }
    repoZone.style.display = "none";
    detailZone.style.width = "auto";
    detailZone.style.float = "none";
}

<<<<<<< HEAD
let nestedTogglers = document.getElementsByClassName("fa-angle-right");
for (let i = 0; i < nestedTogglers.length; i++) {
    nestedTogglers[i].addEventListener("click", function () {
        this.parentElement.parentElement.querySelector(".hidden").classList.toggle("active");
        this.classList.toggle("fa-angle-down");
    });
}

=======
folderListBtn.addEventListener('click', displayRepository());
>>>>>>> fe42659bb9f75f6b9c75d0606e4d826f3985fca5
