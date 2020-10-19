function compareTime(a,b){
    return b.createdDate - a.createdDate;
}



class User {
    constructor(userName, password) {
        this.userName = userName;
        this.password = password;
        this.createdDate = new Date();
        this.allNoteList = [];
        this.recentNoteList = [];
        this.repository = [];
    }

    getUser() {
        console.log(`User Name: ${this.userName}`);
        console.log(`Password: ${this.password}`);
        console.log(`Created Time: ${this.createdDate}`);
    }

    addFolder(newFolder) {
        this.repository.push(newFolder);
    }

    deleteFolder(folder){
        this.repository = this.repository.filter((f) => {
            return f.title !== folder.title;
        })
    }

    sortByTitle(){
        function compare(a, b) {
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();
            let comparison = 0;
            if (titleA > titleB) {
              comparison = 1;
            } else if (titleA < titleB) {
              comparison = -1;
            }
            return comparison;
          }
        return this.repository.sort(compare)
    }

    sortByCreatedDate(){
        return this.repository.sort(compareTime);
    }

    printRepository() {
        console.log(this.repository);
    }

    updateAllNotes() {
        this.allNoteList = [];
        for (let i = 0; i < this.repository.length; i++) {
            let folder = repository[i];
            for (let j = 0; j < folder.length; j++) {
                let file = array[j];
                for (let k = 0; k < file.length; k++) {
                    let note = array[k];
                    this.allNoteList.push(note)                   
                }               
            }        
        }
    }
}

const user1 = new User('admin','123456');
user1.addFolder(
    {title: 'moo',
    createdDate: new Date(2017,11,25)});
user1.addFolder(
    {title: 'folder1',
    createdDate: new Date(2018, 11,25)});
user1.addFolder(
    {title: 'min',
    createdDate: new Date(2016,12, 10)});
user1.addFolder(
    {title:'folder2',
    createdDate: new Date(2016, 1, 10)});



console.log(user1);
console.log(user1.repository[0].createdDate);

//console.log(user1.sortByCreatedDate());

console.log(user1.sortByTitle());

user1.printRepository()


