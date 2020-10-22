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

class User {
    constructor(userName, password) {
        this.userName = userName;
        this.password = password;
        this.createdDate = new Date();
        this.allNoteList = [];
        this.recentNoteList = [];
        this.repository = [];
    }

    addFolder(newFolder) {
        this.repository.push(newFolder);
    }

    deleteFolder(folder) {
        this.repository = this.repository.filter((f) => {
            return f.title !== folder.title;
        })
    }

    sortByTitle() {
        this.repository.sort(compareAlphabetically)
    }

    sortByCreatedDate() {
        this.repository.sort(compareTime);
    }

    // Everytime an action of modification happens, we run these 2 methods
    updateAllNotes() {
        this.allNoteList = [];
        for (let i = 0; i < this.repository.length; i++) {
            let folder = this.repository[i];
            for (let j = 0; j < folder.fileList.length; j++) {
                let file = folder.fileList[j];
                for (let k = 0; k < file.noteList.length; k++) {
                    let note = file.noteList[k];
                    this.allNoteList.push(note)
                }
            }
        }
    }
    updateRecentNotes() {
        const LIMIT = 10;
        let sortedAllNoteList = this.allNoteList;
        sortedAllNoteList.sort(compareTime);
        this.recentNoteList = [];
        for (let i = 0; i < sortedAllNoteList.length; i++) {
            if (i < 10) {
                let note = sortedAllNoteList[i];
                this.recentNoteList.push(note);
            }
        }
    }

    checkDuplicateFolder(input) {
        for (let i = 0; i < this.repository.length; i++) {
            input = input.toLowerCase();
            let folder = this.repository[i];
            if (folder["title"].toLowerCase() === input) {
                console.log(`A folder named "${input}" has already exist`);
                break;
            }
            console.log(`There aren't folders that named "${input}"`);
        }
    }
}

class Folder {
    constructor(title) {
        this.title = title;
        this.createdDate = new Date();
        this.fileList = [];
    }

    addFile(newFile) {
        this.fileList.push(newFile);
    }

    deleteFile(file) {
        this.fileList = this.fileList.filter((f) => {
            return f.title !== file.title;
        })
    }

    sortByTitle() {
        this.fileList.sort(compareAlphabetically)
    }

    sortByCreatedDate() {
        this.fileList.sort(compareTime);
    }

    moveFile(file, newFolder) {
        newFolder.addFile(file);
        this.deleteFile(file);

    }

    printFolder() {
        // TO DO
    }

    checkDuplicateFile(input) {
        for (let i = 0; i < this.fileList.length; i++) {
            input = input.toLowerCase();
            let file = this.fileList[i];
            if (file["title"].toLowerCase() === input) {
                console.log(`A file named "${input}" has already exist`);
                break;
            }
            console.log(`There aren't any files that named "${input}"`);
        }
    }
}

class File {
    constructor(title) {
        this.title = title;
        this.createdDate = new Date();
        this.noteList = [];
    }

    addNote(newNote) {
        this.noteList.push(newNote);
    }

    deleteNote(note) {
        this.noteList = this.noteList.filter((n) => {
            return n.title !== note.title;
        })
    }

    checkDuplicateNote(input) {
        for (let i = 0; i < this.noteList.length; i++) {
            input = input.toLowerCase();
            let note = this.noteList[i];
            if (note["title"].toLowerCase() === input) {
                console.log(`A note titled "${input}" has already exist`);
                break;
            }
            console.log(`There aren't any note that titled "${input}"`);
        }
    }
}

class Note {
    constructor(title, attachedLink, content) {
        this.title = title;
        this.attachedLink = attachedLink;
        this.content = content;
        this.createdDate = new Date();
    }
}

let userAdmin = new User("admin", "123456");
let folder1 = new Folder("Folder1");
let folder2 = new Folder("Folder2");
let file1 = new File("File1");
let file2 = new File("File2");
let file3 = new File("File3");
let note1 = new Note('note1');
let note2 = new Note('note2');
let note3 = new Note('note3');
let note4 = new Note('note4');

file1.addNote(note1);
file1.addNote(note2);
file2.addNote(note3);
file3.addNote(note4);
folder1.addFile(file1);
folder2.addFile(file2);
folder2.addFile(file3);
userAdmin.addFolder(folder1);
userAdmin.addFolder(folder2);

let currentUser = userAdmin;
