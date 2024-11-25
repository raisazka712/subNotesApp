
    const baseUrl = 'https://notes-api.dicoding.dev/v2';

    // Menampilkan indikator loading
    const showLoading = () => {
      const loader = document.createElement('div');
      loader.className = 'loading-indicator';
      loader.textContent = 'Loading...';
      document.body.appendChild(loader);
  };

    // Menghilangkan indikator loading
    const hideLoading = () => {
        const loader = document.querySelector('.loading-indicator');
        if (loader) loader.remove();
    };

    const showResponseMessage = (message = 'Check your internet connection') => {
        alert(message);
    };

    // getNotes
    const getNotes = async () => {
      showLoading();
      try {
          const response = await fetch(`${baseUrl}/notes`, {
              method: 'GET',
            //   headers: { Authorization: 'Bearer your-access-token' },
          });
          const result = await response.json();
          if (response.ok) {
              renderAllNotes(result.data);
          } else {
              showResponseMessage(result.message);
          }
      } catch (error) {
          showResponseMessage(error.message);
      } finally {
          hideLoading();
      }
  };

    // insertNotes (add)
    const insertNotes = async (note) => {
      showLoading();
      try {
          const response = await fetch(`${baseUrl}/notes`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer your-access-token',
              },
              body: JSON.stringify(note),
          });
          const result = await response.json();
          if (response.ok) {
              getNotes(); // Refresh notes list
              showResponseMessage('Note added successfully!');
          } else {
              showResponseMessage(result.message);
          }
      } catch (error) {
          showResponseMessage(error.message);
      } finally {
          hideLoading();
      }
  };

  // removeNotes
  const removeNotes = async (noteId) => {
      showLoading();
      try {
          const response = await fetch(`${baseUrl}/notes/${noteId}`, {
              method: 'DELETE',
              headers: { 
                Authorization: 'Bearer your-access-token',
                'X-Auth-Token': '12345',
            },
          });
          const result = await response.json();
          if (response.ok) {
              getNotes(); // Refresh notes list
              showResponseMessage('Note deleted successfully!');
          } else {
              showResponseMessage(result.message);
          }
      } catch (error) {
          showResponseMessage(error.message);
      } finally {
          hideLoading();
      }
  };

  /*
      Render functions
  */

    const renderAllNotes = (notes) => {
        const listBookElement = document.querySelector('#notesList');
        listBookElement.innerHTML = '';
        notes.forEach(note => {
            listBookElement.innerHTML += `
                <div class="note-card">
                    <h2>${note.title}</h2>
                    <p>${note.body}</p> <br />
                    <small>Created At: ${new Date(note.createdAt).toLocaleString()}</small> <br /> <br />
                    <button class="btn-delete" id="${note.id}">Delete</button>
                </div>
            `;
        });

        const buttons = document.querySelectorAll('.btn-delete');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const noteId = event.target.id;
                removeNotes(noteId);
            });
        });
    };



    /*
        Event Listeners
    */

    document.addEventListener('DOMContentLoaded', () => {
        const addNoteForm = document.querySelector('add-note-form');
        addNoteForm.addEventListener('noteAdded', (event) => {
            const { title, body } = event.detail;
            insertNotes({ title, body });
        });

        // Fetch and display notes on load
        getNotes();
    });

   
    /*
        jangan ubah kode di bawah ini ya!
    */
  
    // const renderAllNotes = (notes) => {
    //   const listBookElement = document.querySelector('#listBook');
    //   listBookElement.innerHTML = '';
  
    //   notes.forEach(note => {
    //     listnoteElement.innerHTML += `
    //       <div class="col-lg-4 col-md-6 col-sm-12" style="margin-top: 12px;">
    //         <div class="card">
    //           <div class="card-body">
    //             <h5>(${note.id}) ${note.title}</h5>
    //             <p>${note.author}</p>
    //             <button type="button" class="btn btn-danger button-delete" id="${note.id}">Hapus</button>
    //           </div>
    //         </div>
    //       </div>
    //     `;
    //   });
  
    //   const buttons = document.querySelectorAll('.button-delete');
    //   buttons.forEach(button => {
    //     button.addEventListener('click', event => {
    //       const noteId = event.target.id;
          
    //       removeNotes(noteId);
    //     });
    //   });
    // };
  
    // const showResponseMessage = (message = 'Check your internet connection') => {
    //   alert(message);
    // };
  
    // document.addEventListener('DOMContentLoaded', () => {
  
    //   const inputBookId = document.querySelector('#inputBookId');
    //   const inputBookTitle = document.querySelector('#inputBookTitle');
    //   const inputBookAuthor = document.querySelector('#inputBookAuthor');
    //   const buttonSave = document.querySelector('#buttonSave'); 
    //   const buttonUpdate = document.querySelector('#buttonUpdate');
  
    //   buttonSave.addEventListener('click', function () {
    //     const note = {
    //       id: Number.parseInt(inputBookId.value),
    //       title: inputBookTitle.value,
    //       author: inputBookAuthor.value
    //     };
        
    //     insertBook(note);
    //   });
  
    //   buttonUpdate.addEventListener('click', function () {
    //     const note = {
    //       id: Number.parseInt(inputBookId.value),
    //       title: inputBookTitle.value,
    //       author: inputBookAuthor.value
    //     };
  
    //     updateBook(note);
    //   });
    //   getBook();
    // });


  document.addEventListener('DOMContentLoaded', () => {
    getNotes();
});
  
export { getNotes, insertNotes, removeNotes };