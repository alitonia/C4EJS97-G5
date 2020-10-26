function compareAlphabetically(a, b) {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    let comparison = 0;
    if (titleA > titleB) {
        comparison = 1;
    } else if (titleA < titleB) {
        comparison = -1;
    }
    return comparison;
};

function compareTime(a, b) {
    return a.createdDate - b.createdDate;
}

function formatDate(date){
    return `${date.getHours()}:${date.getMinutes()} <br> ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
} 