let selectedSeats = 0;
let totalPrice = 0;
let remainingSeats = 40;
let couponApplied = false;

// Function to create and append buttons to the container
function createButtonsWithLabel(label, totalButtons = 4) {
  const container = document.getElementById("seat-div");
  const tableBody = document.getElementById("seat-table-body");
  const totalPriceElement = document.getElementById("total-price");
  const grandTotalElement = document.getElementById("grand-total");
  const seatCount = document.getElementById("seat-count");

  // Create label
  const labelElement = document.createElement("label");
  labelElement.textContent = label;
  labelElement.className = "text-[#030712] font-bold text-xl ";
  container.appendChild(labelElement);

  // Generate buttons for the label
  for (let i = 1; i <= totalButtons; i++) {
    const button = document.createElement("button");
    button.textContent = `${label}${i}`;

    const marginLeft = i === 1 ? "ml-8" : "ml-12";
    button.className =
      "m-2 p-2 lg:ml-4 bg-[#F7F8F8] text-[#03071280] rounded-2xl w-[90px] h-[50px] " +
      marginLeft;

    // Add margin-right to A2-J2 buttons
    if (
      (label === "A" && i === 2) ||
      (label === "B" && i === 2) ||
      (label === "C" && i === 2) ||
      (label === "D" && i === 2) ||
      (label === "E" && i === 2) ||
      (label === "F" && i === 2) ||
      (label === "G" && i === 2) ||
      (label === "H" && i === 2) ||
      (label === "I" && i === 2) ||
      (label === "J" && i === 2)
    ) {
      button.style.marginRight = "48px";
    }

    // Add click event listener to each button
    button.addEventListener("click", function () {
      // Check if the button is already selected
      if (button.style.backgroundColor === "rgb(29, 209, 0)") {
        if (couponApplied)
          return showAlert(
            "Coupon code is already applied. You can't change this now."
          );

        // Deselect the button
        button.style.backgroundColor = "#F7F8F8";
        button.style.color = "#03071280";
        selectedSeats--;
        seatCount.textContent = selectedSeats;
        // Remove the seat from the table
        removeSeatFromTable(button.textContent);
        if (selectedSeats < 4) {
          document.getElementById("coupon-input").readOnly = true;
          document.getElementById("apply-button").disabled = true;
          document.getElementById("coupon-input").value = "";
        }
      } else {
        // Check if maximum seats are selected
        if (selectedSeats < 4) {
          // Select the button
          button.style.backgroundColor = "#1DD100";
          button.style.color = "#FFFFFF";

          selectedSeats++;
          seatCount.textContent = selectedSeats;

          // Add the seat to the table
          addSeatToTable(button.textContent, selectedSeats);
          // Check if maximum seats are selected to enable coupon input and button
          if (selectedSeats === 4) {
            document.getElementById("coupon-input").readOnly = false;
            document.getElementById("apply-button").disabled = false;
          }
        } else {
          // Alert if attempting to select more than 4 seats
          showAlert("You can only select 4 seats at a time.");
        }
      }
    });

    container.appendChild(button);
  }

  // Add spacing after the buttons
  const spacingElement = document.createElement("div");
  spacingElement.style.marginBottom = "10px"; // You can adjust the spacing as needed
  container.appendChild(spacingElement);
}

// Function to add seat to the table
function addSeatToTable(seat, selectedSeats) {
  updateNextButtonStatus();

  const tableBody = document.getElementById("seat-table-body");
  const totalPriceElement = document.getElementById("total-price");

  const row = document.createElement("tr");
  const seatCell = document.createElement("td");
  const classCell = document.createElement("td");
  const priceCell = document.createElement("td");

  seatCell.textContent = seat;
  classCell.textContent = "Economy"; // You can set the class as needed
  priceCell.textContent = "550"; // You can set the price as needed

  row.appendChild(seatCell);
  row.appendChild(classCell);
  row.appendChild(priceCell);

  tableBody.appendChild(row);

  // Update total price
  totalPrice = selectedSeats * 550;
  totalPriceElement.textContent = totalPrice;

  // Update grand total
  updateGrandTotal();

  // Update total seats count
  remainingSeats = 40 - selectedSeats; // Assuming you start with 40 seats
  updateRemainingSeats();
}

// Function to remove seat from the table
function removeSeatFromTable(seat) {
  updateNextButtonStatus();
  const tableBody = document.getElementById("seat-table-body");
  const totalPriceElement = document.getElementById("total-price");
  const rows = tableBody.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    if (cells.length > 0 && cells[0].textContent === seat) {
      tableBody.removeChild(rows[i]);
      break;
    }
  }

  // Update total price
  totalPrice -= 550;
  totalPriceElement.textContent = totalPrice;

  // Update grand total
  updateGrandTotal();

  // Update total seats count
  remainingSeats = 40 - selectedSeats; // Assuming you start with 40 seats
  updateRemainingSeats();
}

// Function to update the grand total based on the coupon code
function updateGrandTotal() {
  const couponInput = document.getElementById("coupon-input");
  const grandTotalElement = document.getElementById("grand-total");
  let grandTotal = totalPrice;

  // Apply coupon discounts if applicable
  const couponCode = couponInput.value.trim().toUpperCase();
  if (couponCode === "NEW15") {
    grandTotal *= 0.85; // Apply 15% discount
  } else if (couponCode === "COUPLE20") {
    grandTotal *= 0.8; // Apply 20% discount
  }

  grandTotalElement.textContent = grandTotal;
}

// Generate buttons with labels for rows A-J and 4 buttons per column
for (
  let labelCode = "A".charCodeAt(0);
  labelCode <= "J".charCodeAt(0);
  labelCode++
) {
  const label = String.fromCharCode(labelCode);
  createButtonsWithLabel(label);
}

// Function to apply coupon and update grand total
function applyCoupon() {
  const couponButtonInput = document.getElementById("coupon-input-button");
  const couponInput = document.getElementById("coupon-input");
  const grandTotalElement = document.getElementById("grand-total");
  const discountAmountDiv = document.getElementById("discount-amount-div");
  const discountAmount = document.getElementById("discount-amount");

  let grandTotal = totalPrice;

  // Apply coupon discounts if applicable
  const couponCode = couponInput.value;
  if (couponCode === "NEW15") {
    grandTotal *= 0.85; // Apply 15% discount
    couponApplied = true;
    // Disable coupon input and button after applying coupon
    couponInput.readOnly = true;
    document.getElementById("apply-button").disabled = true;
    couponButtonInput.style.display = "none";
    discountAmountDiv.style.display = "flex";

    const discountAmountCalculate = (totalPrice * 15) / 100;
    discountAmount.textContent = Math.floor(discountAmountCalculate);
    showAlert("Successfully Applied Coupon!", "success");
  } else if (couponCode === "Couple 20") {
    grandTotal *= 0.8; // Apply 20% discount
    couponApplied = true;
    // Disable coupon input and button after applying coupon
    couponInput.readOnly = true;
    document.getElementById("apply-button").disabled = true;
    couponButtonInput.style.display = "none";

    couponButtonInput.style.display = "none";
    discountAmountDiv.style.display = "flex";

    const discountAmountCalculate = (totalPrice * 20) / 100;
    discountAmount.textContent = Math.floor(discountAmountCalculate);
    showAlert("Successfully Applied Coupon!", "success");
  } else {
    // Invalid coupon code
    showAlert("Invalid coupon code. Please enter a valid coupon code.");
    return;
  }

  grandTotalElement.textContent = grandTotal;
}

// Update Remaining Seats
function updateRemainingSeats() {
  const remainingSeatsElement = document.getElementById("remaining-seats");
  // remainingSeats--;

  // Update the display
  remainingSeatsElement.textContent = `${remainingSeats} seats left`;

  // Disable the apply button when all seats are selected
  if (remainingSeats === 0) {
    document.getElementById("apply-button").disabled = true;
  }
}

// Get references to the input fields, the NEXT button, and the error message
const passengerNameInput = document.getElementById("passengerName");
const passengerNumberInput = document.getElementById("passengerNumber");
const emailIdInput = document.getElementById("emailId");
const nextButton = document.getElementById("nextButton");
const phoneError = document.getElementById("phoneError");

// Add input event listeners to the required fields
passengerNameInput.addEventListener("input", handleInputChange);
passengerNumberInput.addEventListener("input", handleInputChange);

// Function to handle input changes
function handleInputChange() {
  // Check if both required fields have values
  const isPassengerNameValid = passengerNameInput.value.trim() !== "";
  const isPassengerNumberValid = /^\d{11}$/.test(
    passengerNumberInput.value.trim()
  ); // 11-digit number

  // Display error message for invalid phone number
  if (passengerNumberInput.value.trim().length > 11) {
    phoneError.textContent = "Phone number must be 11 digits";
  } else {
    phoneError.textContent = "";
  }

  // Enable or disable the NEXT button based on the validation
  nextButton.disabled = !(isPassengerNameValid && isPassengerNumberValid);
}

// Function to update the Next button status based on seat selection
function updateNextButtonStatus() {
  const isPassengerNameValid = passengerNameInput.value.trim() !== "";
  const isPassengerNumberValid = /^\d{11}$/.test(
    passengerNumberInput.value.trim()
  );
  const isSeatSelected = selectedSeats > 0;

  nextButton.disabled = !(
    isPassengerNameValid &&
    isPassengerNumberValid &&
    isSeatSelected
  );
}

// Add event listeners to passenger name and number inputs for real-time validation
passengerNameInput.addEventListener("input", updateNextButtonStatus);
passengerNumberInput.addEventListener("input", updateNextButtonStatus);

// Get references to the modal and Next button
const modal = document.getElementById("successModal");
// const nextModalButton = document.getElementById("nextButton");

// Function to open the modal
function openModal() {
  modal.style.display = "flex justify-center";
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
  location.reload(); // Reload the page
}

// Function to continue booking
function continueBooking() {
  // Add your logic for continuing the booking process here
  closeModal(); // Close the modal after continuing
  location.reload(); // Reload the page
}

// Event listener for the Next button
nextButton.addEventListener("click", function () {
  const isPassengerNameValid = passengerNameInput.value.trim() !== "";
  const isPassengerNumberValid = /^\d{11}$/.test(
    passengerNumberInput.value.trim()
  );

  if (isPassengerNameValid && isPassengerNumberValid) {
    openModal(); // Open the modal if the required fields are valid
  }
});

function showAlert(message, toastType = "") {
  var toastEnd = document.getElementById("toast-end");
  const alert = document.getElementById("alert");

  // Remove both classes initially
  alert.classList.remove("alert-error", "alert-success");

  // Add the appropriate class based on toastType
  if (toastType === "success") {
    alert.classList.add("alert-success");
  } else {
    alert.classList.add("alert-error");
  }

  toastEnd.classList.remove("hidden");
  document.getElementById("toast-message").textContent = message;

  setTimeout(function () {
    toastEnd.classList.add("hidden");
  }, 3000); // 3000 milliseconds (3 seconds)
}
