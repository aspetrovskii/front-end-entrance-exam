document.addEventListener("DOMContentLoaded", () => {
  const editableElements = document.querySelectorAll(".editable");

  editableElements.forEach((el, index) => {
    const key = `editable-${index}`;

    const saved = localStorage.getItem(key);
    if (saved) el.textContent = saved;
    if (index === 1 && saved) {
      const pageTitle = document.querySelector("title");
      pageTitle.textContent = `Resume | ${saved}`;
    }

    el.classList.add("highlightable");
    el.addEventListener("click", () => {
      if (el.querySelector("textarea")) return;

      const currentText = el.textContent;
      const textarea = document.createElement("textarea");
      textarea.className = "inline-editor";
      textarea.value = currentText;
      const measure = document.createElement("div");
      measure.style.position = "absolute";
      measure.style.visibility = "hidden";
      measure.style.resize = "none";
      measure.style.minWidth = "120px";
      measure.style.whiteSpace = "pre-wrap";
      measure.style.font = window.getComputedStyle(el).font;
      measure.style.lineHeight = window.getComputedStyle(el).lineHeight;
      measure.style.width = `${el.offsetWidth + 25}px`;
      measure.style.padding = "0";
      measure.textContent = currentText;
      document.body.appendChild(measure);

      textarea.style.width = `${measure.offsetWidth}px`;
      textarea.style.height = `${measure.offsetHeight}px`;

      document.body.removeChild(measure);

      el.textContent = "";
      el.appendChild(textarea);
      textarea.focus();

      textarea.addEventListener("blur", () => {
        const newText = textarea.value.trim();
        if (newText.length === 0) el.textContent = currentText;
        else {
          el.textContent = newText;
          if (index === 1) {
            const pageTitle = document.querySelector("title");
            pageTitle.textContent = `Resume | ${newText}`;
          }
        }
        localStorage.setItem(key, newText);
      });

      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter") textarea.blur();
      });
    });
  });
});

document.getElementById("cmd").addEventListener("click", () => {
  const resume = document.querySelector(".resume-content");
  const x = resume.offsetWidth;
  const y = resume.offsetHeight;

  html2canvas(resume, {
    scale: 2,
    useCORS: true,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [y, x],
    });

    pdf.addImage(imgData, "JPEG", 0, 0, x, y);
    pdf.save("resume.pdf");
  });
});
