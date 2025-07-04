// Import the SweetAlert2 library
import Swal from "sweetalert2";

// Create a reusable toast configuration using SweetAlert2's mixin
const Toast = Swal.mixin({
  toast: true,                   // Enables toast-style alert
  position: "top-end",           // Display it at the top-right corner
  showConfirmButton: false,      // No confirmation button
  timer: 3000,                   // Auto-close after 3 seconds
  timerProgressBar: true,        // Show a progress bar at the bottom of the toast
  didOpen: (toast) => {
    // Pause the timer when the user hovers over the toast
    toast.onmouseenter = Swal.stopTimer;
    // Resume the timer when the user moves the mouse away
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// Fire an initial toast with success icon and no message
Toast.fire({
  icon: "success",
  title: "" // Empty title (can be removed if unnecessary)
});

// Export a function to show a success alert with a custom message
export function alertSuccess(message){
  Toast.fire({
    icon: "success",
    title: message
  });
}

// Export a function to show an error alert with a custom message
export function alertError(message){
  Toast.fire({
    icon: "error",
    title: message
  });
}
