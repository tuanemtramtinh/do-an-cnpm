const bookId = "67512a8bc706c61bb91d8c7c"; 
document.addEventListener("DOMContentLoaded", function () {
  fetch(`http://4.194.248.208:3000/book/get-all-chapter?id=${bookId}`)
    .then(response => response.json())  
    .then(data => {
      if (data.status === 'success') {
        const chapters = data.chapters;
        
        const chapterListElement = document.querySelector('.chapter-list');
        chapterListElement.innerHTML = '';  
        
        chapters.forEach(chapter => {
          const chapterItem = document.createElement('div');
          chapterItem.classList.add('chapter-item');
          
          const chapterTitle = document.createElement('div');
          chapterTitle.classList.add('chapter-title');
          chapterTitle.textContent = `Chapter ${chapter.chapter_no}: ${chapter.title}`;
          
          const chapterDivider = document.createElement('div');
          chapterDivider.classList.add('chapter-divider');
          
          chapterItem.appendChild(chapterTitle);
          chapterItem.appendChild(chapterDivider);
          
          chapterItem.addEventListener("click", () => {
            window.location.href = `../../client/pages/read-manga.html?bookId=${bookId}&chapterNo=${chapter.chapter_no}`;
          });
          chapterListElement.appendChild(chapterItem);
        });
      } else {
        console.error("Failed to fetch chapters");
      }
    })
    .catch(error => {
      console.error("Error fetching chapters:", error);
    });
});
const importContactsIcon = document.getElementById("first-chapter");
importContactsIcon.addEventListener("click", () => {
  window.location.href = `../../client/pages/read-manga.html?bookId=${bookId}&chapterNo=1`;
});
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
    if (evt) {
      evt.currentTarget.className += " active";
    }
}