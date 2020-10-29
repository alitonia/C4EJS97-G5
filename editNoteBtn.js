function displayFile(folder, file) {
    let noteList = file.noteList;
    $('.folder-detail').hide();
    $('.file-detail').show();
    $('.relative-link').text(`> ${folder.title} > ${file.title}`);
    noteListZone.innerHTML = "";
    noteList.forEach((note) => {
        noteListZone.innerHTML += `
            <div class="shadow note-container my-5">
                <div class="note-left-col align-items-center">
                    <img class="note-img" src="${note.img}" alt="note img">
                    <p class='note-date text-center'>${formatDate(note.createdDate)}</p>
                </div>
                <div class="note-right-col">
                    <h3 class='note-title font-weight-bold'>${note.title}</h3>       
                    <div class='note-link mt-3'>
                        <a href="${note.attachedLink}" target="_blank">Source Link</a>
                    </div>
                    <div class='note-content'>${note.content}</div>
                </div>
                <div class="note-btns">
                    <div class="fas fa-edit edit-note-btn"></div>
                    <div class="fas fa-trash delete-note-btn" data-toggle="modal" data-target="#deleteNoteConfirm"></div>
                </div>
            </div>
        `;
    })
    let deleteBtns = document.getElementsByClassName("delete-note-btn");
    for (deleteBtn of deleteBtns) {
        deleteBtn.onclick = function () {
            let noteTitle = this.parentElement.parentElement.querySelector(".note-title").innerText;
            $('#delete-note').click(function () {
                file.deleteNote(file.findNote(noteTitle));
                updateTreeView();
                displayFile(folder, file);
                $("#deleteNoteConfirm").modal("hide");
                $(".note-container")[0].scrollIntoView({ behavior: "smooth", block: "center" });
            })
        }
    }
    $('#search-btn').click(function () {
        searchFolder = folder;
        searchFile = file;
    })

    let editNoteBtns = document.getElementsByClassName('edit-note-btn');
    for (editNoteBtn of editNoteBtns){
        editNoteBtn.onclick = function(){
            let noteHTML = this.parentElement.parentElement;
            let noteTitle = noteHTML.querySelector(".note-title").innerText;
            
            editNote(noteHTML, noteTitle);
        }
    }
}




function editNote(noteHTML, noteTitle) {
    if (!document.getElementById("edit-note")) {
        let allNoteToggler = document.getElementsByClassName('fa-angle-right')[0];
        let date = new Date();
        let img = `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 100}/150/150`;
        let tokens = analyzeRelativeLink($('.relative-link').text());
        let folder = currentUser.findFolder(tokens[0]);
        let file = folder.findFile(tokens[1]);
        let note = file.findNote(noteTitle)

        if (!allNoteToggler.parentElement.parentElement.querySelector(".hidden").classList.contains("active")) {
            allNoteToggler.parentElement.parentElement.querySelector(".hidden").classList.toggle("active");
            allNoteToggler.classList.toggle("fa-angle-down");
        }

        
        let editForm = noteHTML;
        editForm.innerHTML = `
            <div class="note-left-col align-items-center">
                <img class="note-img" src="${note.img}" alt="note img">
                <p class='note-date text-center'>${formatDate(date)}</p>
            </div>
            <div class="note-right-col">
                <input class="form-control bg-light w-100" type="text" value="${note.title}" placeholder="Note Title" id="edit-note-title"> 
                <div class='note-link my-3'>
                    <input class="form-control text-primary" type="text" value="${note.attachedLink}" placeholder="Attach Your Link Here" id="edit-note-link"> 
                </div>
                <div class="form-group">
                    <textarea class="form-control" id="edit-note-content" rows="5" placeholder="Note Content" style="resize: none"> ${note.content} </textarea>
                </div>
                <div class="alert alert-danger new-note-alert-error hidden animate__animated animate__bounceIn"
                role="alert">
                </div>
            </div>
            <div class="note-btns">
                <div class="fas fa-file-export" id="save-edit-note-btn"></div>
                <div class="fas fa-trash" id="delete-edit-note-btn"></div>
            </div>           
        `;

        $('#edit-note-title').keyup(editNoteTitle(note.title));
        $('#save-edit-note-btn').click(function () {
            let editNoteTitle = $("#edit-note-title").val().trim();
            let editNoteLink = $("#edit-note-link").val();
            let editNoteContent = $("#edit-note-content").val();
            let findNote = currentUser.findNote(editNoteTitle);
            if (editNoteTitle.length !== 0 && isValidName(editNoteTitle) && (!findNote || findNote.title === note.title)) {
    
                note.title = editNoteTitle;
                note.link = editNoteLink;
                note.content = editNoteContent;

                editNote.createdDate = date;
                updateTreeView();
                displayFile(folder, file);
    
            }
        })
        $('#delete-new-note-btn').click(function () {
            updateTreeView();
            displayFile(folder, file);
            $(".note-container")[0].scrollIntoView({ behavior: "smooth", block: "center" });
        }) ///xem lai
    }
}
