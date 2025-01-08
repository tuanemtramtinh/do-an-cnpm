document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const novelId = urlParams.get("novelId");
  const bookId = urlParams.get("bookId");
  const currentChapterNo = parseInt(urlParams.get("chapterNo")) || 1;

  const isNovelPage = !!novelId;
  const contentId = isNovelPage ? novelId : bookId;

  const currentChapterElement = document.querySelector(".current-chapter");
  if (currentChapterElement) {
    currentChapterElement.textContent = `Chap ${currentChapterNo}`;
  }

  try {
    if (isNovelPage) {
      const novelResponse = await fetch(
        `https://api.mangocomic.io.vn/chapter/get-novel?id=${novelId}&chapter_no=${currentChapterNo}`
      );
      const novelData = await novelResponse.json();
      if (novelData.status === "success" && novelData.content) {
        const readerContainer = document.querySelector(".reader-container");
        const novelContent = document.createElement("div");
        novelContent.classList.add("novel-content");

        novelContent.innerHTML = novelData.content
          .split("\n")
          .map((paragraph) => `<p>${paragraph}</p>`)
          .join("");

        readerContainer.appendChild(novelContent);
      } else {
        console.error("Failed to fetch novel content:", novelData);
      }
    } else {
      const comicResponse = await fetch(
        `https://api.mangocomic.io.vn/chapter/get-comic?id=${bookId}&chapter_no=${currentChapterNo}`
      );
      const comicData = await comicResponse.json();
      if (comicData.status === "success" && Array.isArray(comicData.URLs)) {
        const imageGallery = document.querySelector(".image-gallery");
        comicData.URLs.forEach((url, index) => {
          const img = document.createElement("img");
          img.src = url;
          img.alt = `Page ${index + 1}`;
          img.classList.add("manga-page");
          imageGallery.appendChild(img);
        });
      } else {
        console.error("Failed to fetch comic content:", comicData);
      }
    }
  } catch (error) {
    console.error("Error loading content:", error);
  }

  // dropdown menu 
  try {
    const response = await fetch(
      `https://api.mangocomic.io.vn/book/get-all-chapter?id=${contentId}`
    );
    const data = await response.json();

    if (data.status === "success") {
      const chapters = data.chapters;
      const dropdown = document.querySelector(".chapter-dropdown");

      if (dropdown) {
        dropdown.innerHTML = "";

        chapters.forEach((chapter) => {
          const chapterItem = document.createElement("li");
          chapterItem.classList.add("dropdown-item");
          chapterItem.textContent = `Chap ${chapter.chapter_no}`;

          const chapterLink = isNovelPage
            ? `read-novel.html?novelId=${novelId}&chapterNo=${chapter.chapter_no}`
            : `read-manga.html?bookId=${bookId}&chapterNo=${chapter.chapter_no}`;

          chapterItem.addEventListener("click", () => {
            window.location.href = chapterLink;
          });

          dropdown.appendChild(chapterItem);
        });
      }
    } else {
      console.error("Failed to fetch chapters:", data);
    }
  } catch (error) {
    console.error("Error fetching chapters:", error);
  }

  // Show/hide navigation bar on scroll
  const controlContainer = document.querySelector(".control-container");
  if (controlContainer) {
    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
      const currentScrollTop = window.scrollY;
      if (currentScrollTop > lastScrollTop) {
        controlContainer.classList.add("hidden");
      } else {
        controlContainer.classList.remove("hidden");
      }
      lastScrollTop = currentScrollTop;
    });
  }

  
  const chapterNavItem = document.querySelector(".nav-item.chapter");
  if (chapterNavItem) {
    chapterNavItem.addEventListener("click", () => {
      chapterNavItem.classList.toggle("active");
    });
  }

  const backToMenuButton = document.querySelector(".nav-item.back-to-menu");
  if (backToMenuButton) {
    backToMenuButton.addEventListener("click", () => {
      const backLink = isNovelPage
        ? `chapter-page.html?bookId=${novelId}`
        : `chapter-page.html?bookId=${bookId}`;
      window.location.href = backLink;
    });
  }
});