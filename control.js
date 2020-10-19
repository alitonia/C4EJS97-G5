let repoZone = document.getElementsByClassName("repo-zone")[0];
let detailZone = document.getElementsByClassName("detail-zone")[0];

let folderListBtn = document.getElementById("folder-list-btn");
let newFolderBtn = document.getElementById("new-folder-btn");
let newFileBtn = document.getElementById("new-file-btn");
let searchBtn = document.getElementById("search-btn");
let userBtn = document.getElementById("user-btn");


function displayRepository() {
    if (repoZone.style.display === "none") {
        repoZone.style.display = "block";
        detailZone.style.width = "80vw";
        detailZone.style.float = "right";
        return;
    }
    repoZone.style.display = "none";
    detailZone.style.width = "auto";
    detailZone.style.float = "none";
}

folderListBtn.addEventListener('click', displayRepository());