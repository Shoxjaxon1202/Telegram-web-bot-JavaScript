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
          <button id="next-btn">${
            currentPage === 4 ? "Tamom" : "Keyingi →"
          }</button>
        </div>
      </div>
    `;
    addEventListeners();
  };

  const renderPage = () => {
    if (currentPage === 1) {
      return `
        <div class="form-page">
          <label>Ustoz <span>*</span></label>
          <input type="text" id="ustoz" value="${formData.ustoz}" />
        </div>
      `;
    } else if (currentPage === 2) {
      return `
        <div class="form-page">
          <label>Guruh nomi <span>*</span></label>
          <input type="text" id="guruhNomi" value="${formData.guruhNomi}" />
          <label>Mavzu <span>*</span></label>
          <input type="text" id="mavzu" value="${formData.mavzu}" />
        </div>
      `;
    } else if (currentPage === 3) {
      return `
        <div class="form-page">
          <label>Nechta keldi <span>*</span></label>
          <input type="number" id="nechtaKeldi" value="${formData.nechtaKeldi}" />
          <label>Nechta kelmadi <span>*</span></label>
          <input type="number" id="nechtaKelmadi" value="${formData.nechtaKelmadi}" />
        </div>
      `;
    } else if (currentPage === 4) {
      return `
        <div class="form-page">
          <label>Qo'shimcha izoh</label>
          <textarea id="qoshimchaIzoh">${formData.qoshimchaIzoh}</textarea>
        </div>
      `;
    }
  };

  const addEventListeners = () => {
    if (currentPage > 1) {
      document.getElementById("back-btn").addEventListener("click", () => {
        currentPage--;
        renderApp();
      });
    }
    document.getElementById("next-btn").addEventListener("click", () => {
      if (currentPage === 4) {
        alert("Ma'lumotlar muvaffaqiyatli to'plandi!");
        console.log("Yig'ilgan ma'lumotlar:", formData);
      } else {
        currentPage++;
        renderApp();
      }
    });

    document.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", (e) => {
        formData[e.target.id] = e.target.value;
      });
    });
  };

  renderApp();
});
