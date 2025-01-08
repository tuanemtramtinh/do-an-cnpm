const loadingPage = document.querySelector(".loading-page");

// Hiển thị thông báo
const showAlert = (content = null, time = 3000, type = "alert--success") => {
  if (content) {
    const newAlert = document.createElement("div");
    newAlert.setAttribute("class", `alert ${type}`);

    newAlert.innerHTML = `
            <span class="alert__content">${content}</span>
            <span class="alert__close">
            <i class="fa-solid fa-xmark"></i>
            </span>
        `;

    const alertList = document.querySelector(".alert-list");

    alertList.appendChild(newAlert);

    const alertClose = newAlert.querySelector(".alert__close");

    alertClose.addEventListener("click", () => {
      alertList.removeChild(newAlert);
    });

    setTimeout(() => {
      alertList.removeChild(newAlert);
    }, time);
  }
};
// Hết Hiển thị thông báo

// Bắt sự kiện cho nút xóa
const eventButtonDelete = () => {
  const listButtonDelete = document.querySelectorAll("[button-delete]");
  listButtonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("button-delete");

      const body = document.querySelector("body");

      const elementDelete = document.createElement("div");
      elementDelete.classList.add("_modal");

      elementDelete.innerHTML = `
                <div class="_modal__main">
                    <button class="_modal__close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <div class="_modal__content">
                        <div class="_modal__content__top">
                            <div class="_modal__content__top--icon"><i class="fa-solid fa-circle-exclamation"></i></div>
                            <div class="_modal__content__top--title">Bạn có chắc muốn xóa?</div>
                            <div class="_modal__content__top--desc">Đây là hành động không thể hoàn tác!</div>
                        </div>
                        <div class="_modal__content__bottom">
                            <button class="_modal__bottom--No button">Hủy</button>
                            <button class="_modal__bottom--Yes button">Có, hãy xóa nó!</button>
                        </div>
                    </div>
                </div>
                <div class="_modal__overlay">
                </div>
            `;

      body.appendChild(elementDelete);

      const buttonClose = elementDelete.querySelector("._modal__close");
      const buttonOverlay = elementDelete.querySelector("._modal__overlay");
      const buttonNo = elementDelete.querySelector("._modal__bottom--No");

      buttonClose.addEventListener("click", () => {
        body.removeChild(elementDelete);
      });
      buttonOverlay.addEventListener("click", () => {
        body.removeChild(elementDelete);
      });
      buttonNo.addEventListener("click", () => {
        body.removeChild(elementDelete);
      });

      const buttonYes = elementDelete.querySelector("._modal__bottom--Yes");

      buttonYes.addEventListener("click", () => {
        axios.delete(`http://localhost:3000/comics/${id}`).then((res) => {
          const eDeleted = document.querySelector(`div[item-id="${id}"]`);
          if (eDeleted) {
            eDeleted.remove();
          }
          body.removeChild(elementDelete);
          showAlert("Xóa truyện thành công!");
        });
      });
    });
  });
};
// Hết Bắt sự kiện cho nút xóa

// Vẽ ra giao diện từ database phần danh sách truyện - trang mangaWrittingCenter --XONG -- còn cái tên user
const elementProductList = document.querySelector("#product-list");
if (elementProductList) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Không tìm thấy token. Vui lòng đăng nhập trước.");
    alert("Vui lòng đăng nhập để xem danh sách truyện.");
  }

  fetch("https://api.mangocomic.io.vn/book/posted-manga-list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((errorData) => {
          console.error("Error data:", errorData);
          if (response.status === 401) {
            console.error("Token hết hạn. Vui lòng đăng nhập lại.");
            alert("Token hết hạn. Vui lòng đăng nhập lại.");
          } else {
            showAlert(
              "Có lỗi xảy ra khi lấy danh sách truyện!",
              3000,
              "alert--error"
            );
          }
          throw new Error(errorData);
        });
      }
    })

    .then((res) => {
      console.log(res.payload);

      let htmls = "";

      for (const item of res.payload) {
        const href =
          item.type === "truyện tranh"
            ? `upload-chapterManga.html?id=${item.id}`
            : `upload-chapterNovel.html?id=${item.id}`;

        const dateObj = new Date(item.day_update);
        const date = dateObj.toLocaleDateString("vi-VN"); // Định dạng ngày theo chuẩn Việt Nam
        const time = dateObj.toLocaleTimeString("vi-VN"); // Định dạng giờ theo chuẩn Việt Nam

        console.log(item.id);

        htmls += `
                <div class="client--mangaWrittingCenter-element" item-id="${item.id}"> 
                    <div class="client--mangaWrittingCenter-element--right"><img src=${item.img} alt=${item.name}></div>
                    <div class="client--mangaWrittingCenter-element--middle">
                        <div class="client--mangaWrittingCenter-element-top">
                            <div class="client--mangaWrittingCenter-element-top--language">${item.language}</div>
                            <div class="client--mangaWrittingCenter-element-top--name">${item.name}</div>
                            <div class="client--mangaWrittingCenter-element-top--type">${item.type}</div>
                        </div>
                        <div class="client--mangaWrittingCenter-element-mid"> 
                            <div class="client--mangaWrittingCenter-element-mid--status">${item.status}</div>
                            <div class="client--mangaWrittingCenter-element-mid--date"> <i class="fa-regular fa-clock"></i>
                                <div class="content">${time} ${date}</div>
                            </div>
                        </div>
                        <div class="client--mangaWrittingCenter-element-bottom">
                            <a class="button client--mangaWrittingCenter-element-bottom--edit" href="edit-Manga.html?id=${item.id}">
                                <i class="fa-regular fa-pen-to-square"></i>Chỉnh sửa
                            </a>
                            <button class="button button-delete client--mangaWrittingCenter-element-bottom--delete" button-delete="${item.id}"><i class="fa-regular fa-trash-can"></i>Xóa</button>
                        </div>
                    </div>
                    <div class="client--mangaWrittingCenter-element--left">
                        <div class="client--mangaWrittingCenter-element--left-inner">
                            <a class="button client--mangaWrittingCenter-element--left_button--addChapter" href="${href}">
                                <i class="fa-solid fa-file-arrow-up"></i>
                                <div class="content">Thêm chương</div>
                            </a>
                            <a class="button client--mangaWrittingCenter-element--left_button--addChapter" href="chapter-list.html?id=${item.id}"><i class="fa-solid fa-ellipsis-vertical"></i><i class="fa-solid fa-bars"></i>
                                <div class="content">Danh sách chương</div>
                            </a></div>
                    </div>
                </div>
            `;
      }

      elementProductList.innerHTML = htmls;
      eventButtonDelete();
    })
    .catch((error) => {
      console.error("Error:", error);
      showAlert(
        "Có lỗi xảy ra khi lấy danh sách truyện!",
        3000,
        "alert--error"
      );
    });
}
// Hết Vẽ ra giao diện từ database - mangaWrittingCenter

// Đổ data từ database ra trang edit manga - edit-Manga
const formEdit = document.querySelector("#form-edit");
if (formEdit) {
  const params = new URL(window.location.href).searchParams;
  const id = params.get("id"); // Đảm bảo tham số là "id" thay vì "Id"

  if (!id) {
    console.error("Không tìm thấy id trong URL.");
    alert("Không tìm thấy id trong URL.");
  }

  fetch(`https://api.mangocomic.io.vn/book?bookId=${id}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((errorData) => {
          console.error("Error data:", errorData);
          showAlert(
            "Có lỗi xảy ra khi lấy chi tiết truyện!",
            3000,
            "alert--error"
          );
          throw new Error(errorData);
        });
      }
    })

    .then((res) => {
      console.log(res.payload);

      formEdit.nameOfManga.value = res.payload.name;
      formEdit.nameOfAuthor.value = res.payload.author;
      formEdit.description.value = res.payload.description;

      // Xử lý các tag
      const tagElements = document.querySelectorAll('input[name="tag"]');
      const tagArray = res.payload.tag;

      tagElements.forEach((tagElement) => {
        const tagId = tagElement.getAttribute("tag-id");
        if (tagArray.some((tag) => tag._id === tagId)) {
          tagElement.checked = true;
        }
      });

      // Hiển thị thumbnail
      const thumbnailPreview = document.querySelector(
        ".client--edit-manga__middle--image-main img"
      );
      thumbnailPreview.src = res.payload.thumbnail;

      //language
      const languageSelect = document.getElementById("languageEM");
      if (languageSelect) {
        const options = languageSelect.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === res.payload.language) {
            options[i].selected = true;
            break;
          }
        }
      }

      //age
      const ageSelect = document.getElementById("ageLimit");
      if (ageSelect) {
        const options = ageSelect.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value == res.payload.age_limit) {
            options[i].selected = true;
            break;
          }
        }
      }

      //type
      const typeSelect = document.getElementById("typeOfManga");
      if (typeSelect) {
        const options = typeSelect.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value == res.payload.type) {
            options[i].selected = true;
            break;
          }
        }
      }

      //status
      const statusSelect = document.getElementById("statusOfManga");
      if (statusSelect) {
        const options = statusSelect.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value == res.payload.status) {
            options[i].selected = true;
            break;
          }
        }
      }

      // Sự kiện submit form editManga
      formEdit.addEventListener("submit", (event) => {
        event.preventDefault();
        loadingPage.classList.remove("hidden");

        // const thumbnailInput = formEdit.querySelector('input[name="thumbnail"]');
        // thumbnailInput.addEventListener("change", (event) => {
        //     const file = event.target.files[0];
        //     if (file) {
        //         const reader = new FileReader();
        //         reader.onload = (e) => {
        //             thumbnailPreview.src = e.target.result;
        //         };
        //         reader.readAsDataURL(file);
        //     }
        // });

        const language = document.getElementById("language").value;
        const age_limit = parseInt(document.getElementById("ageLimit").value);
        const name = formEdit.nameOfManga.value;
        const author = formEdit.nameOfAuthor.value;
        const type = document.getElementById("typeOfManga").value;
        const status = document.getElementById("statusOfManga").value;
        // const tag = Array.from(event.target.tag);
        // const checkedTag = tag.filter((item) => item.checked === true);
        const description = formEdit.description.value;

        // In ra cảnh báo
        if (!name) {
          showAlert("Vui lòng nhập tên truyện!", 3000, "alert--error");
          return;
        }
        if (!author) {
          showAlert("Vui lòng nhập tên tác giả!", 3000, "alert--error");
          return;
        }
        // if(checkedTag.length === 0) {
        //     showAlert("Vui lòng chọn Tag cho truyện!", 3000, "alert--error");
        //     return;
        // }
        if (!description) {
          showAlert("Vui lòng nhập mô tả cho truyện!", 3000, "alert--error");
          return;
        }
        // if (!thumbnail) {
        //     showAlert("Vui lòng upload ảnh bìa cho truyện!", 3000, "alert--error");
        //     return;
        // }
        // formData.append('thumbnail', thumbnail);

        // // Tạo mảng lưu giá trị của thuộc tính tag-id của những checkbox đã được checked
        // const tagIDsArray = checkedTag.map(item => item.getAttribute('tag-id'));
        // // Sử dụng JSON.stringify() để chuyển đổi mảng thành chuỗi JSON và thêm vào FormData
        // formData.append('tag', JSON.stringify(tagIDsArray));

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Không tìm thấy token. Vui lòng đăng nhập trước.");
          alert("Vui lòng đăng nhập để cập nhật hồ sơ.");
          return;
        }

        fetch(`https://api.mangocomic.io.vn/book/update/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language,
            age_limit,
            name,
            author,
            type,
            status,
            description,
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              return response.json().then((errorData) => {
                console.error("Error data:", errorData);
                if (response.status === 401) {
                  console.error("Token hết hạn. Vui lòng đăng nhập lại.");
                  alert("Token hết hạn. Vui lòng đăng nhập lại.");
                } else {
                  showAlert(
                    "Có lỗi xảy ra khi cập nhật truyện!",
                    3000,
                    "alert--error"
                  );
                }
                throw new Error(errorData);
              });
            }
          })
          .then((result) => {
            console.log(result);
            loadingPage.classList.add("hidden");
            showAlert("Cập nhật truyện thành công!");
          })
          .catch((error) => {
            console.error("Error:", error);
            showAlert(
              "Có lỗi xảy ra khi cập nhật truyện!",
              3000,
              "alert--error"
            );
          });
      });
      // Hết Sự kiện submit form editManga
    });
}
// Hết Đổ data từ database ra trang edit manga - edit-Manga

// Lấy data từ UploadManga form gửi về database -XONG
// Nút thêm truyện/tiểu thuyết
const formUploadManga = document.querySelector("#form-uploadManga");
if (formUploadManga) {
  const thumbnailInput = formUploadManga.querySelector(
    'input[name="thumbnail"]'
  );
  const thumbnailPreview = formUploadManga.querySelector(
    ".client--edit-manga__middle--image-main img"
  );

  thumbnailInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        thumbnailPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  formUploadManga.addEventListener("submit", (event) => {
    event.preventDefault();
    loadingPage.classList.remove("hidden");
    //Lấy data trong form
    const language = document.getElementById("languageUM").value;
    const age = document.getElementById("ageLimitUM").value;
    const name = formUploadManga.nameOfMangaUM.value;
    const author = formUploadManga.nameOfAuthorUM.value;
    const type = document.getElementById("typeOfMangaUM").value;
    const status = document.getElementById("statusOfMangaUM").value;
    const tag = Array.from(event.target.tagUM);
    const checkedTag = tag.filter((item) => item.checked === true);
    const description = formUploadManga.descriptionUM.value;

    const thumbnail = thumbnailInput.files[0];

    // In ra cảnh báo
    if (!name) {
      showAlert("Vui lòng nhập tên truyện!", 3000, "alert--error");
      return;
    }
    if (!author) {
      showAlert("Vui lòng nhập tên tác giả!", 3000, "alert--error");
      return;
    }
    if (checkedTag.length === 0) {
      showAlert("Vui lòng chọn Tag cho truyện!", 3000, "alert--error");
      return;
    }
    if (!description) {
      showAlert("Vui lòng nhập mô tả cho truyện!", 3000, "alert--error");
      return;
    }
    if (!thumbnail) {
      showAlert("Vui lòng upload ảnh bìa cho truyện!", 3000, "alert--error");
      return;
    }

    const formData = new FormData();
    formData.append("language", language);
    formData.append("age_limit", age);
    formData.append("name", name);
    formData.append("author", author);
    formData.append("type", type);
    formData.append("status", status);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);

    // Tạo mảng lưu giá trị của thuộc tính tag-id của những checkbox đã được checked
    const tagIDsArray = checkedTag.map((item) => item.getAttribute("tag-id"));
    // Sử dụng JSON.stringify() để chuyển đổi mảng thành chuỗi JSON và thêm vào FormData
    formData.append("tagIDs", JSON.stringify(tagIDsArray));

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token. Vui lòng đăng nhập trước.");
      alert("Vui lòng đăng nhập để cập nhật hồ sơ.");
      return;
    }

    fetch("https://api.mangocomic.io.vn/book/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((errorData) => {
            console.error("Error data:", errorData);
            if (response.status === 401) {
              console.error("Token hết hạn. Vui lòng đăng nhập lại.");
              alert("Token hết hạn. Vui lòng đăng nhập lại.");
            } else {
              showAlert(
                "Có lỗi xảy ra khi tạo truyện mới!",
                3000,
                "alert--error"
              );
            }
            throw new Error(errorData);
          });
        }
      })
      .then((result) => {
        loadingPage.classList.add("hidden");
        showAlert("Tạo truyện mới thành công!");
        formUploadManga.reset();
        thumbnailPreview.src =
          "../../assets/img/edit-manga-uploadMangaDefault.png"; // Reset to default image
      })
      .catch((error) => {
        console.error("Error:", error);
        showAlert("Có lỗi xảy ra khi tạo truyện mới!", 3000, "alert--error");
      });
  });
}
// Hết Lấy data từ UploadManga form gửi về database

// Thêm chapter mới cho truyện tranh (comic) - XONG, còn hiện ảnh lên giao diện nữa
const previewImage = document.querySelector(".preview-image");
const uploadImages = document.querySelector('input[name="images"]');
const deletePreviewImage = document.querySelector(".preview-image-delete");
if (previewImage) {
  uploadImages.addEventListener("change", (e) => {
    const files = uploadImages.files;
    for (let i = 0; i < files.length; i++) {
      const image = document.createElement("img");
      image.src = URL.createObjectURL(files[i]);
      previewImage.appendChild(image);
    }
  });
}

if (deletePreviewImage) {
  console.log(deletePreviewImage);
  deletePreviewImage.addEventListener("click", (e) => {
    uploadImages.value = "";
    previewImage.innerHTML = "";
  });
}

const formAddChapterManga = document.querySelector("#form-add-chapterManga");
if (formAddChapterManga) {
  formAddChapterManga.addEventListener("submit", (event) => {
    event.preventDefault();
    loadingPage.classList.remove("hidden");

    const params = new URL(window.location.href).searchParams;
    const id = params.get("id"); // Đảm bảo tham số là "id" thay vì "Id"

    const chapNo = parseInt(formAddChapterManga.numberOfChapter.value);
    const chapName = formAddChapterManga.nameOfChapter.value;
    const files = formAddChapterManga.querySelector(
      'input[name="images"]'
    ).files;
    const bookID = id;

    if (!chapNo) {
      showAlert("Vui lòng nhập số của chương!", 3000, "alert--error");
      return;
    }
    if (!chapName) {
      showAlert("Vui lòng nhập tên của chương!", 3000, "alert--error");
      return;
    }
    if (files.length === 0) {
      showAlert("Vui lòng chọn ít nhất một ảnh!", 3000, "alert--error");
      return;
    }
    if (!bookID) {
      showAlert("Không tìm thấy bookID!", 3000, "alert--error");
      return;
    }

    const formData = new FormData();
    formData.append("chapter_no", chapNo);
    formData.append("name", chapName);
    formData.append("book_ID", bookID);

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token. Vui lòng đăng nhập trước.");
      alert("Vui lòng đăng nhập để thêm chương.");
      return;
    }

    fetch("https://api.mangocomic.io.vn/chapter/create-chapter-comic", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((errorData) => {
            console.error("Error data:", errorData);
            if (response.status === 401) {
              console.error("Token hết hạn. Vui lòng đăng nhập lại.");
              alert("Token hết hạn. Vui lòng đăng nhập lại.");
            } else {
              showAlert(
                "Có lỗi xảy ra khi thêm chương mới!",
                3000,
                "alert--error"
              );
            }
            throw new Error(errorData);
          });
        }
      })
      .then((result) => {
        loadingPage.classList.add("hidden");
        uploadImages.value = "";
        previewImage.innerHTML = "";
        showAlert("Thêm chương mới thành công!");
        formAddChapterManga.reset();
        // thumbnailPreview.src = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        showAlert("Có lỗi xảy ra khi thêm chương mới!", 3000, "alert--error");
      });
  });
}
// Hết Thêm chapter mới cho truyện tranh (comic)

// Thêm chapter mới cho tiểu thuyết (novel)
const formAddChapterNovel = document.querySelector("#form-add-chapterNovel");
if (formAddChapterNovel) {
  formAddChapterNovel.addEventListener("submit", (event) => {
    event.preventDefault();
    loadingPage.classList.remove("hidden");
    const params = new URL(window.location.href).searchParams;
    const id = params.get("id"); // Đảm bảo tham số là "id" thay vì "Id"

    const chapter_no = parseInt(formAddChapterNovel.numberOfChapter.value);
    const name = formAddChapterNovel.nameOfChapter.value;
    const content = formAddChapterNovel.contentOfChapter.value;
    const book_ID = id;

    if (!chapter_no) {
      showAlert("Vui lòng nhập số của chương!", 3000, "alert--error");
      return;
    }
    if (!name) {
      showAlert("Vui lòng nhập tên của chương!", 3000, "alert--error");
      return;
    }
    if (!content) {
      showAlert("Vui lòng nhập nội dung của chương!", 3000, "alert--error");
      return;
    }
    if (!book_ID) {
      showAlert("Không tìm thấy bookID!", 3000, "alert--error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token. Vui lòng đăng nhập trước.");
      alert("Vui lòng đăng nhập để thêm chương.");
      return;
    }

    fetch("https://api.mangocomic.io.vn/chapter/create-chapter-novel", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chapter_no,
        name,
        content,
        book_ID,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((errorData) => {
            console.error("Error data:", errorData);
            if (response.status === 401) {
              console.error("Token hết hạn. Vui lòng đăng nhập lại.");
              alert("Token hết hạn. Vui lòng đăng nhập lại.");
            } else {
              showAlert(
                "Có lỗi xảy ra khi thêm chương mới!",
                3000,
                "alert--error"
              );
            }
            throw new Error(errorData);
          });
        }
      })
      .then((result) => {
        loadingPage.classList.add("hidden");
        showAlert("Thêm chương mới thành công!");
        formAddChapterNovel.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        showAlert("Có lỗi xảy ra khi thêm chương mới!", 3000, "alert--error");
      });
  });
}
// Hết Thêm chapter mới cho tiểu thuyết (novel)

// Vẽ ra giao diện trang chapter-list
const elementChapterList = document.querySelector("#chapter-list");
if (elementChapterList) {
  const params = new URL(window.location.href).searchParams;
  const id = params.get("id");

  if (!id) {
    console.error("Không tìm thấy id trong URL.");
    alert("Không tìm thấy id trong URL.");
  }

  fetch(`https://api.mangocomic.io.vn/book/get-all-chapter?id=${id}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((errorData) => {
          console.error("Error data:", errorData);
          showAlert(
            "Có lỗi xảy ra khi lấy danh sách chương!",
            3000,
            "alert--error"
          );
          throw new Error(errorData);
        });
      }
    })

    .then((res) => {
      console.log(res.chapters);

      let htmls = "";

      for (const item of res.chapters) {
        htmls += `
                <a class="client--chapter-list__main--element" href="#" src="_self">
                    <div class="client--chapter-list__main--element-content">Chapter ${item.chapter_no}: ${item.title}</div>
                </a>
            `;
      }

      elementChapterList.innerHTML = htmls;
    })
    .catch((error) => {
      console.error("Error:", error);
      showAlert(
        "Có lỗi xảy ra khi lấy danh sách chương!",
        3000,
        "alert--error"
      );
    });
}
// Hết Vẽ ra giao diện trang chapter-list

// Vẽ ra giao diện user-info
const userInfo = document.querySelector("#user-info");
if (userInfo) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Không tìm thấy token. Vui lòng đăng nhập trước.");
    alert("Vui lòng đăng nhập để xem danh sách truyện.");
  }

  fetch("https://api.mangocomic.io.vn/user/info", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((errorData) => {
          console.error("Error data:", errorData);
          if (response.status === 401) {
            console.error("Token hết hạn. Vui lòng đăng nhập lại.");
            alert("Token hết hạn. Vui lòng đăng nhập lại.");
          } else {
            showAlert(
              "Có lỗi xảy ra khi lấy danh sách truyện!",
              3000,
              "alert--error"
            );
          }
          throw new Error(errorData);
        });
      }
    })

    .then((res) => {
      console.log(res);

      let htmls = "";

      htmls += `
            <div class="client--user-info__element--image"><img src=${res.payload.avatar} alt="avatar"/></div>
            <div class="client--user-info__element--content">
                <div class="client--user-info__element--content-name">${res.payload.username}</div>
                <div class="client--user-info__element--content-position">Vị trí: ${res.payload.role}</div>
                <div class="client--user-info__element--content-day">Ngày gia nhập: ${res.payload.createdAt}</div>
            </div>
        `;

      userInfo.innerHTML = htmls;
    });
}
// Hết Vẽ ra giao diện user-info
