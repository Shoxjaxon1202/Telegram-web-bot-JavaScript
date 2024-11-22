document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  let currentPage = 1;
  const formData = {
    ustoz: "",
    guruhNomi: "",
    mavzu: "",
    nechtaKeldi: "",
    nechtaKelmadi: "",
    qoshimchaIzoh: "",
  };

  let isSubmitting = false; // Yangi holat, loaderni boshqarish uchun

  const renderApp = () => {
    app.innerHTML = `
      <div class="form-container">
        <div class="page-indicator">
          ${[1, 2, 3, 4]
            .map(
              (page) => ` 
              <div class="indicator ${page === currentPage ? "current" : ""} ${
                page < currentPage ? "completed" : ""
              }"></div>`
            )
            .join("")}
        </div>
        <h1>Kunlik Report</h1>
        <div id="form-content">${renderPage()}</div>
        <div class="buttons">
          ${
            currentPage > 1
              ? `<button id="back-btn">← Ortga</button>`
              : `<span></span>`
          }
          <button id="next-btn" ${isSubmitting ? "disabled" : ""}>${
      currentPage === 4
        ? isSubmitting
          ? "Yuklanmoqda..."
          : "Tamom"
        : "Keyingi →"
    }</button>
        </div>
      </div>
    `;
    addEventListeners();
  };

  const renderPage = () => {
    if (currentPage === 1) {
      return ` 
        <div class="form-page" data-page="1">
          <label>Ustoz <span>*</span></label>
          <input required type="text" id="ustoz" value="${formData.ustoz}" />
          <p class="error-message" style="display: none;">Please enter a value</p>
        </div>
      `;
    } else if (currentPage === 2) {
      return `
        <div class="form-page" data-page="2">
          <label>Guruh nomi <span>*</span></label>
          <input required type="text" id="guruhNomi" value="${formData.guruhNomi}" />
          <p class="error-message" style="display: none;">Please enter a value</p>
          <label>Mavzu <span>*</span></label>
          <input required type="text" id="mavzu" value="${formData.mavzu}" />
          <p class="error-message" style="display: none;">Please enter a value</p>
        </div>
      `;
    } else if (currentPage === 3) {
      return `
        <div class="form-page" data-page="3">
          <label>Nechta keldi <span>*</span></label>
          <input required type="number" id="nechtaKeldi" value="${formData.nechtaKeldi}" />
          <p class="error-message" style="display: none;">Please enter a value</p>
          <label>Nechta kelmadi <span>*</span></label>
          <input required type="number" id="nechtaKelmadi" value="${formData.nechtaKelmadi}" />
          <p class="error-message" style="display: none;">Please enter a value</p>
        </div>
      `;
    } else if (currentPage === 4) {
      return `
        <div class="form-page" data-page="4">
          <label>Qo'shimcha izoh</label>
          <textarea id="qoshimchaIzoh">${formData.qoshimchaIzoh}</textarea>
        </div>
      `;
    }
  };

  const addEventListeners = () => {
    // "Ortga" tugmasi
    if (currentPage > 1) {
      document.getElementById("back-btn").addEventListener("click", () => {
        currentPage--;
        renderApp();
      });
    }

    // "Keyingi" tugmasi
    document.getElementById("next-btn").addEventListener("click", () => {
      if (isSubmitting) return; // Agar form yuborilayotgan bo'lsa, hech narsa qilmaslik

      if (currentPage === 4) {
        if (validateForm()) {
          isSubmitting = true;
          renderApp(); // Loaderni ko'rsatish
          setTimeout(() => {
            formData.ustoz = "";
            formData.guruhNomi = "";
            formData.mavzu = "";
            formData.nechtaKeldi = "";
            formData.nechtaKelmadi = "";
            formData.qoshimchaIzoh = "";
            alert("Ma'lumotlar muvaffaqiyatli to'plandi!");
            isSubmitting = false;
            renderApp(); // Loaderni yashirish
          }, 2000); // Loaderni 2 soniya davomida ko'rsatish (masalan, serverga yuborish)
        }
      } else {
        if (validateForm()) {
          currentPage++;
          renderApp();
        }
      }
    });

    // "Enter" tugmasi bilan submit qilish
    document.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Enter tugmasini standart submitdan bloklash

          // Hozirgi inputni tekshirish
          if (!input.value.trim()) {
            input.focus(); // Agar hozirgi input bo'sh bo'lsa, fokus shu joyda qolsin
            const errorMessage = input.nextElementSibling;
            if (
              errorMessage &&
              errorMessage.classList.contains("error-message")
            ) {
              errorMessage.style.display = "block"; // Xatolik xabarini ko'rsatish
            }
          } else {
            const nextInput = getNextInput(currentPage);
            if (nextInput) {
              nextInput.focus(); // Keyingi inputga fokus o'tadi
            } else if (currentPage < 4) {
              currentPage++;
              renderApp(); // Keyingi sahifaga o'tish
            } else {
              document.getElementById("next-btn").click(); // Oxirgi sahifada bo'lsa, submit qilinadi
            }
          }
        }
      });

      input.addEventListener("input", (e) => {
        formData[e.target.id] = e.target.value;
      });
    });
  };

  // Keyingi inputga o'tish
  const getNextInput = (page) => {
    const inputs = document.querySelectorAll(
      `#form-content .form-page[data-page="${page}"] input`
    );
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].value.trim()) {
        return inputs[i]; // Keyingi bo'sh inputni qaytarish
      }
    }
    return null;
  };

  // Formani tekshirish (har bir input required)
  const validateForm = () => {
    const requiredInputs = document.querySelectorAll(
      "input[required], textarea"
    );
    let isValid = true;

    requiredInputs.forEach((input) => {
      const errorMessage = input.nextElementSibling; // Xatolik xabari uchun P tag

      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = "red"; // Xatolikni ko'rsatish
        if (errorMessage && errorMessage.classList.contains("error-message")) {
          errorMessage.style.display = "block"; // Xatolik xabarini ko'rsatish
        }

        // Fokus faqat birinchi xato input yoki textarea ga o'tadi
        if (
          isValid &&
          currentPage === parseInt(input.closest(".form-page").dataset.page)
        ) {
          input.focus();
        }
      } else {
        input.style.borderColor = ""; // Xato yo'q bo'lsa chegarani normal ko'rinishga qaytarish
        if (errorMessage && errorMessage.classList.contains("error-message")) {
          errorMessage.style.display = "none"; // Xatolik xabarini yashirish
        }
      }
    });

    return isValid;
  };

  renderApp();
});
