class ListNotes extends HTMLElement {
  static baseURL = "https://notes-api.dicoding.dev/v2";
  baseURLl = "https://notes-api.dicoding.dev/v2";
  _notes = [];
  constructor() {
    super();
    this._style = document.createElement("style");
  }

  showLoading() {
    const getLoading = this.querySelector("#containerLoading");
    getLoading.classList.add("fetchLoading");
  }

  hideLoading() {
    const getLoading = this.querySelector("#containerLoading");

    getLoading.classList.remove("fetchLoading");
  }

  async connectedCallback() {
    this.getNotesFromLocalStorage();
    this.fetchData();
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this._notes));
  }

  getNotesFromLocalStorage() {
    const notesData = localStorage.getItem("notes");
    if (notesData) {
      this._notes = JSON.parse(notesData);
      this.render();
    } else {
      this.fetchData();
      console.log(this._notes);
    }
  }

  async archiveData(note_Id) {
    try {
      this.showLoading();
      const response = await fetch(`${ListNotes.baseURL}/notes/archived}`);
      if (!response.status) {
        throw new Error("ck erro bro ");
      }
      const responseJson = await response.json();

      console.log("Archive success:", responseJson);

      this._notes = this._notes.map((note) =>
        note.id === note_Id ? { ...note, archived: true } : note
      );
      this.saveNotes();
      this.render();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  async deleteData(note_Id) {
    try {
      this.showLoading();
      const response = await fetch(`${ListNotes.baseURL}/notes/${note_Id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.status) {
        throw new Error("ck erro bro ");
      }
      const responseJson = await response.json();
      console.log("sukses:", responseJson);
      this._notes = this._notes.filter((note) => note.id !== note_Id);
      this.saveNotes();
      this.render();
    } catch (error) {
      console.error(error);
    } finally {
      this.hideLoading;
    }
  }

  async fetchData(note_Id) {
    try {
      this.showLoading();
      const response = await fetch(`${ListNotes.baseURL}/notes`);
      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      this._notes = this._notes.map((note) =>
        note.id === note_Id ? { ...note, archived: false } : note
      );
      this.saveNotes();
      this.render();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.hideLoading();
    }
  }

  set notes(data) {
    this._notes = data;
    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
    :host{
      display:block;
    }
            .container-header h2 {
  text-align: center;
  margin-bottom: 1rem;
}
  .container-header #notes{
  margin-bottom:2rem}
            .card-wrapper{
              display: grid;
              grid-template-column:1fr;
              gap:1rem;
            }
            .cardNotes {
                border-radius: 4px;
                overflow: hidden;
                box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
                color:black;
                background-color:#E8EDFF;
                display:grid;
                padding:1rem;
                 
                grid-template-columns:1fr 1fr 0.5fr;
                grid-template-areas:
                'title title button'
                'body body button '
                'data date button';
                
                gap:0.5rem

              }

            .cardTitle {
              grid-area: title;
                font-size:1.5rem;
            }
            .cardBody {
              grid-area:body;
                font-size:1rem;
                
            }
            .button{
              grid-area:button;
              justify-self: end;
              display:flex; 
              flex-direction:row;
            }
            
            .cardDate{
             
              grid-area:date;
              font-size:0.8rem;
              color:gray;
              justify-self: start;
            }


  .containerLoading {
            
  display: none;
  top: 50%;
  left: 50%;
  width:400px;
  z-index: 888;
  position: fixed;
  transform: translate(-50%, -50%);
  background-color: rgba(126, 113, 113, 0.4);
  backdrop-filter: blur(100px);
  padding: 10px;
  height: 150px;
  color: black;
  border-radius: 5px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  opacity: 0.8;
  transition: opacity 0.5s;
}

.isFetchLoading {
  display:flex;
  height:100%;
  width:100%;
  justify-content: center;
  align-items: center;
  
}

.fetchLoading {
  display: block;
}

            @media only screen and (max-width: 508px){
              .cardTitle {
                  font-size:1rem;
              }
              .cardBody {
                  font-size:0.8rem;
                  
              }
              .cardDate {
                font-size:0.6rem;
                
            }
                
            }
        `;
  }
  render() {
    this._updateStyle();
    let notesHTML = "";
    let archiveHTML = "";
    this._notes.map((note) => {
      const noteHTML = `
      <div class="cardContainer">
          <div class="cardNotes">
              <div class="cardTitle">
                  <h3>${note.title}</h3>
              </div>
              <div class="cardBody">
                  <p>${note.body}</p>
              </div>
              <div class="cardDate">
                  <p>${note.createdAt}</p>
              </div>
              <div class="button">
                <button class="${
                  note.archived === false ? "archive-button" : "fe-button"
                }" data-id="${note.id}"></button>
                <button class="delete-button" data-id="${note.id}"></button>
              </div>
          
          </div>
      </div>
      `;
      if (note.archived === true) {
        archiveHTML += noteHTML;
      } else {
        notesHTML += noteHTML;
      }
    });
    this.innerHTML = `
            ${this._style.outerHTML}
            <div class="container-header">
                <h2>Catatan</h2>
                <div class="container-list" id="notes">
                  <div class="card-wrapper">
                    ${notesHTML}
                  </div>
                </div>
            </div>
            <div class="container-header">
                <h2>Catatan yang disimpan</h2>
                <div class="container-list" id="archive-notes">
                  <div class="card-wrapper">
                    ${archiveHTML}
                  </div>
                </div>
            </div>
            <div class="containerLoading"  id="containerLoading">
      <div class="isFetchLoading">
        <p>Mohon ditunggu sejenak....</p>
      </div>
    </div>
        `;
    this.querySelectorAll(".fe-button").forEach((buttons) => {
      buttons.addEventListener("click", () => {
        const noteId = buttons.getAttribute("data-id");
        this.fetchData(noteId);
      });
    });
    this.querySelectorAll(".archive-button").forEach((buttons) => {
      buttons.addEventListener("click", () => {
        const noteId = buttons.getAttribute("data-id");
        this.archiveData(noteId);
      });
    });
    this.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", () => {
        const noteId = button.getAttribute("data-id");
        this.deleteData(noteId);
      });
    });
    this.saveNotes();
    // this._notes.archived === true
    //   ? (archiveNotes.innerHTML = notesHTML)
    //   : (notosisArchive.innerHTML = notesHTML);
  }
}

customElements.define("list-notes", ListNotes);
