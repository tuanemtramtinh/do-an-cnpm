document.addEventListener("DOMContentLoaded", () => {
  const moreLink = document.querySelector(".more-link");
  const summaryText = document.querySelector(".summary-text");

  moreLink.addEventListener("click", (e) => {
    e.preventDefault();
    const isExpanded = summaryText.dataset.expanded === "true";
    
    if (isExpanded) {
      summaryText.dataset.expanded = "false";
      summaryText.style.display = "-webkit-box";
      summaryText.style.overflow = "hidden";
      summaryText.style.webkitBoxOrient = "vertical";
      summaryText.style.webkitLineClamp = "3";
      moreLink.textContent = "more";
    } else {
      summaryText.dataset.expanded = "true";
      summaryText.style.display = "block";
      summaryText.style.overflow = "visible";
      summaryText.style.webkitBoxOrient = "unset";
      summaryText.style.webkitLineClamp = "unset";
      moreLink.textContent = "less";
    }
  });
});
