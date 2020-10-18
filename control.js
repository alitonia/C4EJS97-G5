let repoZone = document.getElementsByClassName("repo-zone")[0];
let detailZone = document.getElementsByClassName("detail-zone")[0];

let folderListBtn = document.getElementById("folder-list-btn");
let newFolderBtn = document.getElementById("new-folder-btn");
let newFileBtn = document.getElementById("new-file-btn");
let searchBtn = document.getElementById("search-btn");
let userBtn = document.getElementById("user-btn");

folderListBtn.addEventListener('click', displayRepository);