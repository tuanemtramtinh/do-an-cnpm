var urlParams = new URLSearchParams(window.location.search);
var bookId = urlParams.get('bookId');

document.addEventListener("DOMContentLoaded", function () {  
fetch(`https://api.mangocomic.io.vn/book?bookId=${bookId}`)
.then(response => response.json())
.then(data => {
  if (data.status === 200 && data.payload) {
    const book = data.payload;

    if (book) {
      document.getElementById('book-cover').src = book.thumbnail;
      document.getElementById('book-banner').src = book.thumbnail;
      document.getElementById('book-title').textContent = book.name || 'No title available';
      document.getElementById('book-author').textContent = book.author || 'No author available';
      document.getElementById('book-type').textContent = `Type: ${book.type}`;
      document.getElementById('book-tags').textContent = 
        Array.isArray(book.tag) 
        ? book.tag.map(tag => tag.name).join(', ') 
        : 'No tags available';
      document.getElementById('book-date').textContent = `Updated at: ${book.updatedAt || 'No date available'}`;
      document.getElementById('book-description').textContent = book.description || 'No description available';

      // fetch chapter
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

              // chuyen toi trang doc truyen theo type
              const chapterLink = book.type === 'tiểu thuyết'
                ? `../../client/pages/read-novel.html?novelId=${bookId}&chapterNo=${chapter.chapter_no}`
                : `../../client/pages/read-manga.html?bookId=${bookId}&chapterNo=${chapter.chapter_no}`;
              var importContactsIcon = document.getElementById("first-chapter");
              if (importContactsIcon) {
                importContactsIcon.addEventListener("click", () => {
                  const firstChapterLink = book.type === "tiểu thuyết"
                    ? `../../client/pages/read-novel.html?novelId=${bookId}&chapterNo=1`
                    : `../../client/pages/read-manga.html?bookId=${bookId}&chapterNo=1`;
                  
                  window.location.href = firstChapterLink;
                });
              }
                
              chapterItem.addEventListener("click", () => {
                window.location.href = chapterLink;
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
fetchComments(bookId);

async function postComment(bookId, commentContent) {
  const token = localStorage.getItem('token'); 

  if (!token) {
      alert('Bạn phải đăng nhập trước khi bình luận!');
      return;
  }

  try {
      const response = await fetch("https://api.mangocomic.io.vn/user/comment", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, 
          },
          body: JSON.stringify({
              bookId: bookId,
              comment: commentContent,
          }),
      });

      if (response.ok) {
          const data = await response.json();
          console.log('Bình luận thành công:', data);
          // alert('Bình luận đã được đăng!');

          fetchComments(bookId);
          document.getElementById('comment-input').value = '';
      } else {
          const errorData = await response.json();
          console.error('Bình luận thất bại:', errorData.message);
          // alert(`Bình luận thất bại: ${errorData.message}`);
      }
  } catch (error) {
      console.error('Lỗi:', error);
      alert('Đã xảy ra lỗi trong quá trình đăng bình luận.');
  }
}


function fetchComments(bookId) {
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
                }
            } else {
                console.error("Failed to fetch comments:", data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching comments:", error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('comment-form');
  form.addEventListener('submit', function(event) {
      event.preventDefault();

      const commentInput = document.getElementById('comment-input');
      const commentContent = commentInput.value.trim(); 

      postComment(bookId, commentContent);
      commentInput.value = ''; 
  });
});