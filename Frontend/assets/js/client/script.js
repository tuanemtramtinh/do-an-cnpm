// const bookId = "67512a8bc706c61bb91d8c7c";
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('bookId');
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

  fetch('http://4.194.248.208:3000/book?keyword=highlight')
  .then(response => response.json())
  .then(data => {
    if (data.status === 200) {
      const books = data.payload;

      const relatedComicList = document.querySelector('.related_comic-list');
      relatedComicList.innerHTML = ''; 

      books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.classList.add('related-list-item');

        const imgElement = document.createElement('img');
        imgElement.src = book.thumbnail;
        imgElement.alt = book.name;

        const titleElement = document.createElement('p');
        titleElement.textContent = book.name;

        listItem.appendChild(imgElement);
        listItem.appendChild(titleElement);

        listItem.addEventListener('click', () => {
          window.location.href = `../../client/pages/chapter-page.html?bookId=${book.id}`;
        });

        relatedComicList.appendChild(listItem);
      });
    } else {
      console.error("Failed to fetch books");
    }
  })
  .catch(error => {
    console.error("Error fetching books:", error);
  });
});


document.querySelectorAll('.icon-box').forEach(box => {
  box.addEventListener('click', (e) => {
    e.stopPropagation();
    box.classList.toggle('filled');
  });
});

const importContactsIcon = document.getElementById("first-chapter");
importContactsIcon.addEventListener("click", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('bookId');
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