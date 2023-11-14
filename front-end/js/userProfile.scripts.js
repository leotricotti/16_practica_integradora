//Variables globales
const userProfile = [JSON.parse(localStorage.getItem("user"))];
const userProfileForm = document.getElementById("user-profile-form");
const addDocumentsForm = document.getElementById("add-documents-form");
const token = localStorage.getItem("token");
const PORT = localStorage.getItem("port");
const localPort = localStorage.getItem("localPort");

// Función que captura la información del usuario y la almacena en el local storage
const getUser = async () => {
  const newRole = "premium";
  try {
    const response = await fetch(`http://localhost:${PORT}/api/users/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log(result);

    if (result.length > 0 || result.data) {
      localStorage.setItem("user", JSON.stringify(result.data));
    }

    const documents = result.data.documents.length;

    if (documents > 0 && result.data.role === "user") {
      updateUserRole(newRole);
    }

    renderUserProfile();

    return result;
  } catch (error) {
    console.log(error);
  }
};

// Función que personaliza la imagen de usuario
const addUserProfileImage = async (userProfileImage) => {
  const userId = userProfile[0].email;
  const formData = new FormData();
  formData.append("userProfileImage", userProfileImage);

  const response = await fetch(
    `http://localhost:${PORT}/api/users/${userId}/documents`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (result.message === "Documento agregado con éxito") {
    Swal.fire({
      icon: "success",
      title: "¡Imagen de perfil actualizada!",

      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        getUser();
      }
    });
  }
  return result;
};

// Funcion que crea el titulo de acuerdo al nombre del documento
const updatedDocumentLabel = (documentName) => {
  if (documentName === "userIdDocument") {
    return "Documento de identidad";
  } else if (documentName === "userAddressDocument") {
    return "Comprobante de domicilio";
  } else {
    return "Comprobante de pago";
  }
};

// Función que compruba si el usuario subió una imagen de perfil
const checkUserProfileImage = () => {
  const userImage = userProfile[0].documents.filter(
    (document) => document.name === "userProfileImage"
  );

  if (userImage.length > 0) {
    const referenceParts = userImage[0].reference.split("/");
    const finalReference =
      "/profiles/" + referenceParts[referenceParts.length - 1];
    return `<img class="rounded-circle mt-5" width="150px" height="150px" style="object-fit: contain" src="http://localhost:${PORT}${finalReference}" />`;
  } else {
    return `<img class="rounded-circle mt-5" width="150px" src="../img/user.jpg" />`;
  }
};

// Función que renderiza el perfil del usuario
async function renderUserProfile() {
  let html = "";

  html += `
    ${userProfile.map((user) => {
      return `
        <div class="row">
          <div class="col-md-3 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5">
              <div class="position-relative">
                ${checkUserProfileImage()}
                <button
                  type="button"
                  class="btn position-absolute"
                  style="
                    background-color: #eee;
                    border-radius: 50%;
                    bottom: 10px;
                    right: 20px;
                  "
                  id="user-profile-image"
                >
                  <input type="file" class="form-control d-none" />
                  <i class="fas fa-camera"></i>
                </button>
              </div>
              <span class="font-weight-bold">${user.first_name} ${
        user.last_name
      }</span>
              <span class="text-black-50">${user.email}</span>
              <span> </span>
            </div>
          </div>
          <div class="col-md-5 border-right">
            <div class="p-3 py-5">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="text-right">Perfil</h4>
              </div>
              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="labels" for='first_name'>Nombre</label>
                  <input type="text" class="form-control" value=${
                    user.first_name
                  } id='first_name' autocomplete="off" required/>
                </div>
                <div class="col-md-6">
                  <label class="labels" for="last_name">Apellido</label>
                  <input type="text" class="form-control" value=${
                    user.last_name
                  } id="last_name" autocomplete="off" required/>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-md-12">
                  <label class="labels" for="phone_number">Teléfono</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ingrese su telefono"
                    id="phone_number"
                    value="${user.phone_number}" 
                    required
                    autocomplete="off"
                  />
                </div>
                <div class="col-md-12 mt-3">
                  <label class="labels" for="home_address">Dirección de envío</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ingrese su dirección"
                    value="${user.home_address}"
                    id="home_address"
                    required
                    autocomplete="off"
                  />
                </div>
                <div class="col-md-12 mt-3">
                  <label class="labels" for="zip_code">Código Postal</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ingrese su código postal"
                    value="${user.zip_code}"
                    id="zip_code"
                    required
                    autocomplete="off"
                  />
                </div>
                <div class="col-md-12 mt-3">
                  <label class="labels" for="state">Provincia</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ingrese su provincia"
                    value="${user.state}"
                    id="state"
                    required
                    autocomplete="off"
                  />
                </div>
                <div class="col-md-12 mt-3">
                  <label class="labels" for="city">Ciudad</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ingrese su ciudad"
                    value="${user.city}"
                    id="city"
                    required
                    autocomplete="off"
                  />
                </div>
                <div class="mt-5 text-center">
                  <button
                    type="submit"
                    id="signup-button"
                    class="btn btn-secondary profile-button"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4" id="user-profile-form">
            <div class="p-3 py-5">
              <div class="d-flex justify-content-between align-items-center experience">
              <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="text-right">Archivos</h4>
              </div>
              ${
                user.documents && user.documents.length > 0
                  ? user.documents
                      .map((document) => {
                        return `  
                        <div class="d-flex flex-column">
                        <p class="labels mb-2 text-decoration-underline">${updatedDocumentLabel(
                          document.name
                        )}</p>
                        <span class="labels mb-2 text-success">&#x2022; Documeto cargado 
                        con éxito</span>
                        </div>
                        `;
                      })
                      .join("")
                  : `<label class="labels mb-2 text-decoration-underline">Documento de identidad</label>
                  <input class="form-control disable" type="file" id="user-identification" required />
                  <br />
                  <label class="labels mb-2 text-decoration-underline">Comprobante de domicilio</label>
                  <input class="form-control" type="file" id="user-address-document" required autocomplete="off"/>
                  <br />
                  <label class="labels mb-2 text-decoration-underline">Comprobante de pago</label>
                  <input class="form-control" type="file" id="user-count-document" required autocomplete="off"/>`
              }
              </div>
            </div>
          </div>
        </div>
      `;
    })}
  `;
  userProfileForm.innerHTML = html;

  // Agrega el evento de click después de renderizar el HTML
  const button = document.getElementById("user-profile-image");
  button.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Solo acepta archivos de imagen
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      addUserProfileImage(file);
    });

    fileInput.click();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getUser();
  renderUserProfile();
  showSpinner(userProfile);
});

// Función que completa el perfil del usuario
userProfileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const phone_number = document.getElementById("phone_number").value;
  const home_address = document.getElementById("home_address").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const zip_code = document.getElementById("zip_code").value;
  const userIdDocument = document.getElementById("user-identification")
    .files[0];
  const userAddressDocument = document.getElementById("user-address-document")
    .files[0];
  const userCountDocument = document.getElementById("user-count-document")
    .files[0];

  const userData = {
    first_name,
    last_name,
    phone_number,
    home_address,
    city,
    state,
    zip_code,
  };

  Swal.fire({
    icon: "question",
    title: "¿Confirma los cambios?",
    text: "Si desea puede modificar sus datos más tarde.",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#3085d6",
    showClass: {
      popup: "animate__animated animate__zoomIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      sendProfileData(userData);
      sendDocumentsData(userIdDocument, userAddressDocument, userCountDocument);

      Swal.fire({
        icon: "success",
        title: "¡Datos guardados correctamente!",
        showConfirmButton: false,
        timer: 1500,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      }).then(() => {
        getUser();
        updateRole("premium");
      });
    }
  });
});

// Función que envía los datos del perfil del usuario al servidor
async function sendProfileData(data) {
  const response = await fetch(
    `http://localhost:${PORT}/api/users/userProfile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: data,
        uid: userId,
      }),
    }
  );

  const result = await response.json();

  return result;
}

// Función que envía los documentos del usuario al servidor
const sendDocumentsData = async (
  userIdDocument,
  userAddressDocument,
  userCountDocument
) => {
  const userId = userProfile[0].email;
  const formData = new FormData();
  formData.append("userIdDocument", userIdDocument);
  formData.append("userAddressDocument", userAddressDocument);
  formData.append("userCountDocument", userCountDocument);

  const response = await fetch(
    `http://localhost:${PORT}/api/users/${userId}/documents`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  return result;
};
