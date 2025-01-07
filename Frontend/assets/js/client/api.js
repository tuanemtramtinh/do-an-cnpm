document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('bookId');
  const currentChapterNo = parseInt(urlParams.get('chapterNo')) || 1; 
  const novelId = urlParams.get('novelId');

  const currentChapterElement = document.querySelector('.current-chapter');
  if (currentChapterElement) {
    currentChapterElement.textContent = `Chap ${currentChapterNo}`;
  }

  const isComicPage = document.querySelector(".image-gallery") !== null;
  const isNovelPage = document.querySelector(".reader-container") !== null;

  try {
    if (isComicPage) {
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
        console.error("Failed to fetch manga pages:", comicData);
      }
    } else if (isNovelPage) {
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
      console.warn("No content container found for this page.");
    }
  } catch (error) {
    console.error("Error loading content:", error);
  }

  // dropdown menu
  try {
    const response = await fetch(`https://api.mangocomic.io.vn/book/get-all-chapter?id=${bookId}`);
    const data = await response.json();

    if (data.status === "success") {
      const chapters = data.chapters;
      const dropdown = document.querySelector('.chapter-dropdown');
      
      if (dropdown) {
        dropdown.innerHTML = ""; 

        chapters.forEach(chapter => {
          const chapterItem = document.createElement('li');
          chapterItem.classList.add('dropdown-item');
          chapterItem.textContent = `Chap ${chapter.chapter_no}`;
          
          chapterItem.addEventListener("click", () => {
            window.location.href = `../../client/pages/read-manga.html?bookId=${bookId}&chapterNo=${chapter.chapter_no}`;
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
        controlContainer.classList.add("_hidden");
      } else {
        controlContainer.classList.remove("_hidden");
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

const backToMenuButton = document.querySelector('.nav-item.back-to-menu');
  if (backToMenuButton) {
      backToMenuButton.addEventListener("click", () => {
        window.location.href = `../../client/pages/chapter-page.html?bookId=${bookId}`
      })
  }
});