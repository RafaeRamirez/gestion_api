// Import custom alert functions
import { alertError, alertSuccess } from "./alerts";

// API URL for appointments
const endpointAppointments = "http://localhost:3000/appointments";

// Form elements
const $namePet = document.getElementById("name_pet");
const $namePerson = document.getElementById("name_person");
const $namePhone = document.getElementById("phone_person");
const $nameDate = document.getElementById("date_cite");
const $nameTime = document.getElementById("time_cite");
const $description = document.getElementById("description");
const $form = document.getElementById("form");
const $appointmentsContainer = document.getElementById("appointments-container");

// Variable to store the ID of the appointment being edited
let editingId = null;

// === Get form data and return it as an object ===
function obtenerDatosFormulario() {
  return {
    namePet: $namePet.value.trim(),
    nameOwner: $namePerson.value.trim(),
    phone: $namePhone.value.trim(),
    date: $nameDate.value,
    time: $nameTime.value,
    description: $description.value.trim(),
  };
}

// === Validate that all fields are filled ===
function validarFormulario(data) {
  return (
    data.namePet &&
    data.nameOwner &&
    data.phone &&
    data.date &&
    data.time &&
    data.description
  );
}

// === Load appointments from the API and display them ===
async function cargarCitas() {
  $appointmentsContainer.innerHTML = "<p>Loading appointments...</p>";
  try {
    const response = await fetch(endpointAppointments);
    const data = await response.json();
    $appointmentsContainer.innerHTML = "";
    data.forEach(agregarCitaAlDOM);
  } catch (error) {
    console.error("Error al cargar citas:", error);
    alertError("Se produjo un error al cargar las citas.");
  }
}

// === Create and display appointment in the DOM ===
function agregarCitaAlDOM(cita) {
  const article = document.createElement("article");
  article.classList.add("card", "card_cite");
  article.setAttribute("data-id", cita.id);

  article.innerHTML = `
    <div class="card-body">
      <h5 class="card-title fs-3 fw-bold""fw-bold">Nombre del Paciente:</span><span>${cita.namePet}</h5>
      <div class="d-flex gap-2"><span class="fw-bold">Nombre del acudiente:</span><span>${cita.nameOwner}</span></div>
      <div class="d-flex gap-2"><span class="fw-bold">Telefono:</span><span>${cita.phone}</span></div>
      <div class="d-flex gap-2"><span class="fw-bold">Fecha:</span><span>${cita.date}</span></div>
      <div class="d-flex gap-2"><span class="fw-bold">Hora:</span><span>${cita.time}</span></div>
      <div class="d-flex gap-2"><span class="fw-bold">Síntomas:</span><span>${cita.description}</span></div>
      <div class="d-flex mt-3 gap-2">
        <button class="btn btn-primary edit">Editar</button>
        <button class="btn btn-danger delete">Eliminar</button>
      </div>
    </div>
  `;

  $appointmentsContainer.appendChild(article);

  // Delete button
  const btnDelete = article.querySelector(".delete");
  btnDelete.addEventListener("click", () => {
    if (confirm("¿Está seguro de que desea eliminar esta cita?")) {
      eliminarCita(cita.id, article);
    }
  });

  // Edit button
  const btnEdit = article.querySelector(".edit");
  btnEdit.addEventListener("click", () => {
    editarCita(cita);
  });
}

// === Delete appointment from the API and the DOM ===
async function eliminarCita(id, article) {
  try {
    const response = await fetch(`${endpointAppointments}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      article.remove();
      alertSuccess("Cita eliminada exitosamente.");
    } else {
      throw new Error("No se pudo eliminar la cita.");
    }
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    alertError("Se produjo un error al eliminar la cita.");
  }
}

// === Load appointment data into the form for editing ===
function editarCita(cita) {
  $namePet.value = cita.namePet;
  $namePerson.value = cita.nameOwner;
  $namePhone.value = cita.phone;
  $nameDate.value = cita.date;
  $nameTime.value = cita.time;
  $description.value = cita.description;
  editingId = cita.id;
  $namePet.focus();
}

// === Create new appointment and send it to the API ===
async function crearCita(data) {
  try {
    const response = await fetch(endpointAppointments, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resultado = await response.json();

    if (response.ok) {
      alertSuccess("Cita creada exitosamente.");
      $form.reset();
      $namePet.focus();
      agregarCitaAlDOM(resultado);
    } else {
      throw new Error("Error al crear la cita.");
    }
  } catch (error) {
    console.error("Error al crear cita:", error);
    alertError("Se produjo un error al crear la cita.");
  }
}

// === Update an existing appointment in the API ===
async function actualizarCita(data) {
  try {
    const response = await fetch(`${endpointAppointments}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alertSuccess("Cita actualizada exitosamente.");
      $form.reset();
      editingId = null;
      $namePet.focus();
      cargarCitas();
    } else {
      throw new Error("No se pudo actualizar la cita.");
    }
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    alertError("Se produjo un error al actualizar la cita.");
  }
}

// === Event when submitting the form ===
$form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = obtenerDatosFormulario();

  if (!validarFormulario(formData)) {
    alertError("Todos los campos son obligatorios.");
    return;
  }

  if (editingId) {
    actualizarCita(formData);
  } else {
    crearCita(formData);
  }
});

// === Load appointments on page load ===
cargarCitas();
