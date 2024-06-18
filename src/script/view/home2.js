document.addEventListener("DOMContentLoaded", () => {
  const inputTitle = document.getElementById("title");
  const inputBody = document.getElementById("deskripsi");
  const submitForm = document.getElementById("form");
  const baseURL = "https://notes-api.dicoding.dev/v2";
  const btnSubmit = document.getElementById("btn-submit");

  const validationTitle = () => {
    const title = inputTitle.value.trim();
    const errorElement = document.getElementById("titleValidation");

    if (title == "") {
      errorElement.innerText = "Title is Required";
      return false;
    } else if (title.length <= 1 || title.length >= 30) {
      errorElement.innerText =
        "Title must be at least 2 characters long and under 30";
      return false;
    } else {
      errorElement.innerText = "";
      return true;
    }
  };

  const validationDeskripsi = () => {
    const deskripsi = inputBody.value.trim();
    const errorElement = document.getElementById("bodyValidation");

    if (deskripsi == "") {
      errorElement.innerText = "Description is Required";
      return false;
    } else if (deskripsi.length < 15) {
      errorElement.innerText = "Title must be at least 15 characters long";
      return false;
    } else {
      errorElement.innerText = "";
      return true;
    }
  };

  submitForm.addEventListener("submit", async function (event) {
    event.preventDefault(event);

    const isTitle = validationTitle();
    const isBody = validationDeskripsi();

    const note = {
      title: inputTitle.value,
      body: inputBody.value,
    };

    if (isTitle && isBody) {
      try {
        btnSubmit.classList.add("loading");
        const response = await fetch(
          "https://notes-api.dicoding.dev/v2/notes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
          }
        );
        if (!response.ok) {
          throw new Error(Error);
        }

        const responseJson = await response.json();
        const newNote = responseJson.data;

        inputTitle.value = "";
        inputBody.value = "";
        const listNotes = document.querySelector("list-notes");
        if (listNotes) {
          // cara memperbaruhi data di custom element
          const currentNotes = listNotes._notes;
          currentNotes.unshift(newNote);
          listNotes.notes = currentNotes;
        }
      } catch (error) {
        console.error("error posting data", error);
      } finally {
        btnSubmit.classList.remove("loading");
      }
      alert("Form Submited is Succesesfully");
    } else {
      inputTitle.addEventListener("blur", validationTitle);
      inputBody.addEventListener("blur", validationDeskripsi);
      alert("Please fill out the form correctly.");
    }
  });
});
