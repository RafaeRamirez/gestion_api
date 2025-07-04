import { alertError, alertSuccess } from "./alerts";
const endpointAppointments = "http://localhost:3000/appointments";

const $namePet = document.getElementById("name_pet");
const $namePerson = document.getElementById("name_person");
const $namePhone = document.getElementById("phone_person");
const $nameDate = document.getElementById("date_cite");
const $nameTime = document.getElementById("time_cite");
const $description = document.getElementById("description");
const $form = document.getElementById("form");
const $appointmentsContainer = document.getElementById("appointments-container");

let editingId = null;

// Obtener datos del formulario
function getFormData() {
  return {
    namePet: $namePet.value.trim(),
    nameOwner: $namePerson.value.trim(),
    phone: $namePhone.value.trim(),
    date: $nameDate.value,
    time: $nameTime.value,
    description: $description.value.trim(),
  };
}

// Validar formulario
function validateForm(data) {
  return (
    data.namePet &&
    data.nameOwner &&
    data.phone &&
    data.date &&
    data.time &&
    data.description
  );
}

// Cargar citas desde API
async function loadAppointments() {
  $appointmentsContainer.innerHTML = "<p>Cargando citas...</p>";
  try {
    const response = await fetch(endpointAppointments);
    const data = await response.json();
    $appointmentsContainer.innerHTML = "";
    data.forEach(addAppointmentToDOM);
  } catch (error) {
    console.error("Error al cargar citas:", error);
    alertError("Hubo un error al cargar las citas.");
  }
}

// Añadir cita al DOM
function addAppointmentToDOM(appointment) {
  const article = document.createElement("article");
  article.classList.add("card", "card_cite");
  article.setAttribute("data-id", appointment.id);

  article.innerHTML = `
    <div class="card-body">
      <h5 class="card-title fs-3 fw-bold">${appointment.namePet}</h5>
      <div class="d-flex gap-2"><span class="fw-bold">Propietario:</span><span>${appointment.nameOwner}</span></div>
      <div class="d-flex gap-2"><span class="fw-bold">Teléfono:</span><span>${appointment.phone}</span></div>
      <div class="d-flex gap-2"><span class="fw-bold">Fecha:</span><span>${appointment.date}</span></div>
      <div class="d-flex gap-2"><span class="fw-bold">Hora:</span><span>${appointment.time}</span></div>
      <div class="d-flex gap-2"><span class="fw-bold">Síntomas:</span><span>${appointment.description}</span></div>
      <div class="d-flex mt-3 gap-2">
        <button class="btn btn-primary edit">Editar</button>
        <button class="btn btn-danger delete">Eliminar</button>
      </div>
    </div>
  `;

  $appointmentsContainer.appendChild(article);

  const btnDelete = article.querySelector(".delete");
  btnDelete.addEventListener("click", () => {
    if (confirm("¿Estás seguro de eliminar esta cita?")) {
      deleteAppointment(appointment.id, article);
    }
  });

  const btnEdit = article.querySelector(".edit");
  btnEdit.addEventListener("click", () => {
    editAppointment(appointment);
  });
}

// Eliminar cita
async function deleteAppointment(id, article) {
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
    alertError("Hubo un error al eliminar la cita.");
  }
}

// Cargar datos en formulario para editar
function editAppointment(appointment) {
  $namePet.value = appointment.namePet;
  $namePerson.value = appointment.nameOwner;
  $namePhone.value = appointment.phone;
  $nameDate.value = appointment.date;
  $nameTime.value = appointment.time;
  $description.value = appointment.description;
  editingId = appointment.id;
  $namePet.focus();
}

// Crear nueva cita
async function createAppointment(data) {
  try {
    const response = await fetch(endpointAppointments, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      alertSuccess("Cita creada exitosamente.");
      $form.reset();
      $namePet.focus();
      addAppointmentToDOM(result);
    } else {
      throw new Error("No se pudo crear la cita.");
    }
  } catch (error) {
    console.error("Error al crear cita:", error);
    alertError("Hubo un error al crear la cita.");
  }
}

// Actualizar cita existente
async function updateAppointment(data) {
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
      loadAppointments();
    } else {
      throw new Error("No se pudo actualizar la cita.");
    }
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    alertError("Hubo un error al actualizar la cita.");
  }
}

// Manejador del formulario
$form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = getFormData();

  if (!validateForm(formData)) {
    alertError("Todos los campos son obligatorios.");
    return;
  }

  if (editingId) {
    updateAppointment(formData);
  } else {
    createAppointment(formData);
  }
});

// Cargar citas al iniciar
loadAppointments();
