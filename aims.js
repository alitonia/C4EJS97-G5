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
        let newNoteList = [];
        this.repository.forEach((folder) => {
            folder.fileList.forEach((file) => {
                file.noteList.forEach((note) => {
                    newNoteList.push(note);
                })
            })
        })
        this.allNoteList = newNoteList;
    }
    updateRecentNotes() {
        const LIMIT = 10;
        let sortedAllNoteList = this.allNoteList;
        sortedAllNoteList.sort(compareTime);
        this.recentNoteList = [];
        for (let i = 0; i < sortedAllNoteList.length && i < LIMIT; i++) {
            let note = sortedAllNoteList[i];
            this.recentNoteList.push(note);
        }
    }

    findFolder(input) {
        for (let i = 0; i < this.repository.length; i++) {
            input = input.toLowerCase();
            let folder = this.repository[i];
            if (folder["title"].toLowerCase() === input) {
                return folder;
            }
        }
        return null;
    }

    findNote(input) {
        for (let i = 0; i < this.repository.length; i++) {
            let folder = this.repository[i];
            for (let j = 0; j < folder.fileList.length; j++) {
                let file = folder.fileList[j];
                for (let k = 0; k < file.noteList.length; k++) {
                    let note = file.noteList[k];
                    if (note.title === input)
                        return note;
                }
            }
        }
        return null;
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

    findFile(input) {
        for (let i = 0; i < this.fileList.length; i++) {
            input = input.toLowerCase();
            let file = this.fileList[i];
            if (file["title"].toLowerCase() === input) {
                return file;
            }
        }
        return null;
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

    findNote(input) {
        return this.noteList.find((note) => {
            return note.title.toLowerCase() === input.toLowerCase();
        })
    }

    searchNote(input) {
        return this.noteList.filter((note) => {
            let title = note.title.toLowerCase();
            let content = note.content.toLowerCase();
            let date = formatDate(note["createdDate"]);
            return title.includes(input) || content.includes(input) || date.includes(input);
        })
    }
}

class Note {
    constructor(title, attachedLink, content) {
        this.title = title;
        this.attachedLink = attachedLink;
        this.content = content;
        this.createdDate = new Date();
        this.img = autoGenerateImg();
    }

    findFile(user) {
        for (let i = 0; i < user.repository.length; i++) {
            let folder = user.repository[i];
            for (let j = 0; j < folder.fileList.length; j++) {
                let file = folder.fileList[j];
                for (let k = 0; k < file.noteList.length; k++) {
                    let note = file.noteList[k];
                    if (note.title === this.title)
                        return file;
                }
            }
        }
        return null;
    }

    findFolder(user) {
        for (let i = 0; i < user.repository.length; i++) {
            let folder = user.repository[i];
            for (let j = 0; j < folder.fileList.length; j++) {
                let file = folder.fileList[j];
                for (let k = 0; k < file.noteList.length; k++) {
                    let note = file.noteList[k];
                    if (note.title === this.title)
                        return folder;
                }
            }
        }
        return null;
    }
}

let user = new User('beep', '123456');
let folder = new Folder('ahihi');
let folder2 = new Folder('nah');
let file = new File('lame');
let file2 = new File('bee');

folder.addFile(file);
folder2.addFile(file2);
user.addFolder(folder);
user.addFolder(folder2);