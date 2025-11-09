document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("caseModal");
    const frame = document.getElementById("caseFrame");
    const closeBtn = modal.querySelector(".case-modal__close");
  
    // 🔹 вказуємо шляхи до файлів
    const links = {
      case1: "cases/Spribe.pdf",
      case2: "cases/case2.pdf",
      case3: "cases/case3.pdf",
      case4: "cases/case4.pdf"
    };
  
    document.querySelectorAll(".case").forEach(el => {
      el.addEventListener("click", () => {
        const key = el.dataset.case;
        frame.src = links[key] || "";
        modal.classList.add("active");
      });
    });
  
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      frame.src = "";
    });
  
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.classList.remove("active");
        frame.src = "";
      }
    });
  });