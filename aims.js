function displayRepository() {
    let repoZone = document.getElementsByClassName("repo-zone")[0];
    let detailZone = document.getElementsByClassName("detail-zone")[0];
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

function createNewFolder() {

}

function createNewFile() {

}

