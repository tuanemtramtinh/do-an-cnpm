var urlParams = new URLSearchParams(window.location.search);
var bookId = urlParams.get('bookId');

document.addEventListener("DOMContentLoaded", function () {
  
  fetch(`https://api.mangocomic.io.vn/book/get-all-chapter?id=${bookId}`)
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
    
  fetch(`https://api.mangocomic.io.vn/book?book=${bookId}`)
  .then(response => response.json())
  .then(data => {
      if (data.status === 200 && Array.isArray(data.payload)) {
      const book = data.payload.find(item => item._id === bookId);

      if (book) {
          document.getElementById('book-cover').src = book.thumbnail;
          document.getElementById('book-banner').src = book.thumbnail;
          document.getElementById('book-title').textContent = book.name || 'No title available';
          document.getElementById('book-author').textContent = book.author || 'No author available';
          document.getElementById('book-tags').textContent = 
              Array.isArray(book.tag) 
              ? book.tag.map(tag => tag.name).join(', ') 
              : 'No tags available';
          document.getElementById('book-date').textContent = `Updated at: ${book.updatedAt || 'No date available'}`;
          document.getElementById('book-description').textContent = book.description;
      } else {
          console.error('Book not found with the provided bookId.');
      }
      } else {
      console.error('Invalid API response structure.');
      }
  })
  .catch(error => console.error('Error fetching data:', error));

  fetch('https://api.mangocomic.io.vn/book?keyword=highlight')
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

var importContactsIcon = document.getElementById("first-chapter");
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

fetch(`https://api.mangocomic.io.vn/book/getComment/${bookId}`)
  .then(response => response.json())
  .then(data => {
    if (data.status === 200 && Array.isArray(data.payload)) {
      const commentList = document.querySelector(".comment-list");

      if (commentList) {
        commentList.innerHTML = '';
        data.payload.forEach((comment) => {
          const commentItem = document.createElement("li");
          commentItem.className = "comment-item";

          commentItem.innerHTML = `
            <img src="${comment.avatar}" alt="${comment.username}" class="avatar" />
            <div class="comment-content">
              <span class="username">${comment.username}</span>: 
              <span class="comment-text">${comment.comment}</span>
            </div>
          `;

          commentList.appendChild(commentItem);
        });
      } else {
        console.error("Element with class 'comment-list' not found.");
      }
    } else {
      console.error("Failed to fetch comments:", data.message);
    }
  })
  .catch(error => {
    console.error("Error fetching comments:", error);
  });


