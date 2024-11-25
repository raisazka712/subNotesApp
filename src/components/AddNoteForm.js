import { customValidationUsernameHandler } from './form-custom-validation.js';
import { insertNotes } from '../main.js';

class AddNoteForm extends HTMLElement {
  constructor() {
    super();
    this.handleAddNote = this.handleAddNote.bind(this);
    this.innerHTML = `
      <form id="add-note-form">
        <input 
          type="text" 
          id="note-title" 
          placeholder="Note Title"  
          required 
          minlength="6" 
          pattern="^[A-Za-z][A-Za-z0-9]*$" 
          aria-describedby="usernameValidation"
        />
        <p id="usernameValidation" class="validation-message" aria-live="polite"></p>
        <textarea id="note-body" placeholder="Note Body" required></textarea>
        <button type="submit">Add Note</button>
      </form>
    `;

    this.form = this.querySelector('#add-note-form');
    this.noteTitleInput = this.querySelector('#note-title');
    this.noteBodyInput = this.querySelector('#note-body');
    this.validationMessage = this.querySelector('#usernameValidation');

    this.form.addEventListener('submit', this.handleAddNote);
    this.noteTitleInput.addEventListener('input', this.handleValidation.bind(this));
    this.noteBodyInput.addEventListener('input', this.handleValidation.bind(this));
  }


   handleValidation(event) {
    customValidationUsernameHandler(event);
    this.validationMessage.textContent = event.target.validationMessage;
  }

  handleAddNote(event) {
    event.preventDefault();
    const title = this.noteTitleInput?.value.trim();
    const body = this.noteBodyInput?.value.trim();

    if (this.noteTitleInput.checkValidity() && title && body) {
        const note = { title, body };
        insertNotes(note);
        this.noteTitleInput.value = '';
        this.noteBodyInput.value = '';
        this.resetForm();
        this.querySelector('#note-body').value = '';
        this.validationMessage.textContent = '';
    } else {
        this.noteTitleInput.reportValidity();
        this.validationMessage.textContent = this.noteTitleInput.validationMessage;
    }
  } 

  resetForm() {
    this.noteTitleInput.value = '';
    this.noteBodyInput.value = '';
    this.validationMessage.textContent = '';
  }


  // handleAddNote(event) {
  //   event.preventDefault();
  //   const title = this.noteTitleInput.value.trim();
  //   const body = this.querySelector('#note-body').value.trim();

  //   Check if form is valid before proceeding
  //   if (this.noteTitleInput.checkValidity() && title && body) {
  //     this.dispatchEvent(new CustomEvent('noteAdded', {
  //       detail: { title, body },
  //       bubbles: true,
  //     }));
  //     Clear inputs and validation message
  //     this.noteTitleInput.value = '';
  //     this.querySelector('#note-body').value = '';
  //     this.validationMessage.textContent = '';
  //   } else {
  //     Trigger validation messages if form is invalid
  //     this.noteTitleInput.reportValidity();
  //     this.validationMessage.textContent = this.noteTitleInput.validationMessage;
  //   }
  // }
}

customElements.define('add-note-form', AddNoteForm);
