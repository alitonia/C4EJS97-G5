let repoZone = document.getElementsByClassName("repo-zone")[0];
let detailZone = document.getElementsByClassName("detail-zone")[0];

let folderListBtn = document.getElementById("folder-list-btn");
let newFolderBtn = document.getElementById("new-folder-btn");
let newFileBtn = document.getElementById("new-file-btn");
let searchBtn = document.getElementById("search-btn");
let userBtn = document.getElementById("user-btn");

folderListBtn.addEventListener('click', displayRepository);

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

let toggler = document.getElementsByClassName("fa-angle-right");
for (let i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
        this.parentElement.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("fa-angle-down");
    });
}