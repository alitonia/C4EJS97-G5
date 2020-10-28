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

function isValidName(name){
    const validName = /^[a-zA-Z\w\s]+$/;
    return name.match(validName);
}

function analyzeRelativeLink(relatveLink) {
    let tokens = relatveLink.split("> ");
    tokens = tokens.filter((token) => {
        return token.length !== 0;
    })
    tokens[0] = tokens[0].trim();
    tokens[1] = tokens[1].trim();
    return tokens;
}

function highlight(content, searchText) {
    let searchExp = new RegExp(searchText, "ig");
    let matches = content.match(searchExp);
    if (matches) content = content.replace(matches[0], `<span class='highlight'>` + matches[0] + `</span>`)
    return content;
}