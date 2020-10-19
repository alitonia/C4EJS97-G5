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
        // TO DO
    }

    sortByCreatedDate(){
        // TO DO
    }

    // Everytime an action of modification happens, we run these 2 methods
    updateAllNotes() {
        // TO DO
    }
    
    updateRecentNotes() {
        // TO DO
    }

    printRepository() {
        // TO DO
    }
}

class Folder {
    constructor(title) {
        this.title = title;
        this.createdDate = new Date();
        this.fileList = [];
    }

    getFolder() {
        console.log(`Folder: ${this.title}`);
        console.log(`Created: ${this.createdDate}`);
    }

    addFile(newFile) {
        this.fileList.push(newFile);
    }

    deleteFile(file){
        this.fileList = this.fileList.filter((f) => {
            return f.title !== file.title;
        })
    }

    sortByTitle(){
        // TO DO
    }

    sortByCreatedDate(){
        // TO DO
    }

    moveFile(file, newFolder){
        // TO DO
    }

    printFolder() {
        // TO DO
    }
}

class File {
    constructor(title) {
        this.title = title;
        this.createdDate = new Date();
        this.noteList = [];
    }

    getFile() {
        console.log(`File: ${this.title}`);
        console.log(`Created: ${this.createdDate}`);
    }

    addNote(newNote) {
        this.noteList.push(newNote);
    }

    deleteNote(note){
        this.noteList = this.noteList.filter((n) => {
            return n.title !== note.title;
        })
    }

    printFile() {
        // TO DO
    }
}

class Note {
    constructor(title, attachedLink, content) {
        this.title = title;
        this.attachedLink = attachedLink;
        this.content = content;
        this.createdDate = new Date();
    }

    getNote() {
        console.log(`Note: ${this.title}`);
        console.log(`Attached Link: ${this.attachedLink}`);
        console.log(`Created: ${this.createdDate}`);
        console.log("");
    }

    printNote() {
        // TO DO
    }
}

let name = "admin";
let pw = "123456";
let name2 = "long";
let pw2 = "21122000"
let userAdmin = new User(name, pw);
let folder1 = new Folder("folder1");
let folder2 = new Folder("folder2");
let file1 = new File("file1");
let note1 = new Note('note1');
let note2 = new Note('note2');

file1.addNote(note1);
file1.addNote(note2);
folder1.addFile(file1);
userAdmin.addFolder(folder1);
userAdmin.addFolder(folder2);