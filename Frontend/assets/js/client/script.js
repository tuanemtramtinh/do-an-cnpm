
// Hiển thị thông báo
const showAlert = (content = null, time = 3000, type = "alert--success") => {
    if(content) {
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
        })
        
        setTimeout(() => {
            alertList.removeChild(newAlert);
        }, time)
    }
}
// Hết Hiển thị thông báo


// Biến toàn cục để lưu trữ user ID
let userId = null;

// Lấy thông tin ngừoi dùng
const userInfo = () => {
    axios.get("http://4.194.248.208:3000/user/info")
    .then(res => {
        console.log(res.data);
        userID = res.data.id;
    })
}

// Gọi hàm fetchUserInfo ngay khi trang được tải
userInfo();
// Hết Lấy thông tin ngừoi dùng


// Bắt sự kiện cho nút xóa
const eventButtonDelete = () => {
    const listButtonDelete = document.querySelectorAll("[button-delete]");
    listButtonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-delete");

            const body = document.querySelector("body");

            const elementDelete = document.createElement("div");
            elementDelete.classList.add("modal");

            elementDelete.innerHTML = `
                <div class="modal__main">
                    <button class="modal__close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <div class="modal__content">
                        <div class="modal__content__top">
                            <div class="modal__content__top--icon"><i class="fa-solid fa-circle-exclamation"></i></div>
                            <div class="modal__content__top--title">Bạn có chắc muốn xóa?</div>
                            <div class="modal__content__top--desc">Đây là hành động không thể hoàn tác!</div>
                        </div>
                        <div class="modal__content__bottom">
                            <button class="modal__bottom--No button">Hủy</button>
                            <button class="modal__bottom--Yes button">Có, hãy xóa nó!</button>
                        </div>
                    </div>
                </div>
                <div class="modal__overlay">
                </div>
            `;

            body.appendChild(elementDelete);

            const buttonClose = elementDelete.querySelector(".modal__close");
            const buttonOverlay = elementDelete.querySelector(".modal__overlay");
            const buttonNo = elementDelete.querySelector(".modal__bottom--No");

            buttonClose.addEventListener("click", () => {
                body.removeChild(elementDelete);
            })
            buttonOverlay.addEventListener("click", () => {
                body.removeChild(elementDelete);
            })
            buttonNo.addEventListener("click", () => {
                body.removeChild(elementDelete);
            })

            const buttonYes = elementDelete.querySelector(".modal__bottom--Yes");

            buttonYes.addEventListener("click", () => {

                axios.delete(`http://localhost:3000/comics/${id}`)
                    .then(res => {  
                        const eDeleted = document.querySelector(`div[item-id="${id}"]`);
                        if(eDeleted) {
                            eDeleted.remove();
                        }
                        body.removeChild(elementDelete);
                        showAlert("Xóa truyện thành công!");
                    })
            })
        })
    })
}
// Hết Bắt sự kiện cho nút xóa


// Vẽ ra giao diện từ database - mangaWrittingCenter
const elementProductList = document.querySelector("#product-list");
if(elementProductList) {
    axios.get("http://localhost:3000/comics")
    .then(res => {

        let htmls = "";

        for (const item of res.data) {

            const href = item.type === "Truyện tranh" ? `upload-chapterManga.html?id=${item.id}` : `upload-chapterNovel.html?id=${item.id}`;

            htmls += `
                <div class="client--mangaWrittingCenter-element" item-id="${item.id}"> 
                    <div class="client--mangaWrittingCenter-element--right"><img src=${item.image} alt=${item.name}></div>
                    <div class="client--mangaWrittingCenter-element--middle">
                        <div class="client--mangaWrittingCenter-element-top">
                            <div class="client--mangaWrittingCenter-element-top--language">${item.language}</div>
                            <div class="client--mangaWrittingCenter-element-top--name">${item.name}</div>
                            <div class="client--mangaWrittingCenter-element-top--type">${item.type}</div>
                        </div>
                        <div class="client--mangaWrittingCenter-element-mid"> 
                            <div class="client--mangaWrittingCenter-element-mid--status">${item.status}</div>
                            <div class="client--mangaWrittingCenter-element-mid--date"> <i class="fa-regular fa-clock"></i>
                                <div class="content">${item.time} ${item.date}</div>
                            </div>
                        </div>
                        <div class="client--mangaWrittingCenter-element-bottom"><a class="button client--mangaWrittingCenter-element-bottom--edit" href="edit-Manga.html?id=${item.id}"><i class="fa-regular fa-pen-to-square"></i>Chỉnh sửa</a>
                            <button class="button button-delete client--mangaWrittingCenter-element-bottom--delete" button-delete="${item.id}"><i class="fa-regular fa-trash-can"></i>Xóa</button>
                        </div>
                    </div>
                    <div class="client--mangaWrittingCenter-element--left">
                        <div class="client--mangaWrittingCenter-element--left-inner"><a class="button client--mangaWrittingCenter-element--left_button--addChapter" href="${href}"><i class="fa-solid fa-file-arrow-up"></i>
                            <div class="content">Thêm chương</div></a>
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
}
// Hết Vẽ ra giao diện từ database - mangaWrittingCenter


// Đổ data từ database ra trang edit manga - edit-Manga
const formEdit = document.querySelector("#form-edit");
if(formEdit) {
    const params = new URL(window.location.href).searchParams;
    const id = params.get("id");
    axios.get(`http://localhost:3000/comics/${id}`)
        .then(res => {

            formEdit.nameOfManga.value = res.data.name;
            formEdit.nameOfAuthor.value = res.data.author;
            formEdit.description.value = res.data.description;

            //tag
            let tagArray = res.data.tag.split(", ");
            let variables = {};

            for(let i = 0; i < tagArray.length; i++) {
                variables[`var${i+1}`] = tagArray[i];
            }

            for (let key in variables) {
                if(variables[key] === "Tổng tài") {
                    formEdit.alphaMale.checked = true;
                }
                if(variables[key] === "Trinh thám") {
                    formEdit.detective.checked = true;
                }
                if(variables[key] === "Tình cảm") {
                    formEdit.love.checked = true;
                }
                if(variables[key] === "Phiêu lưu") {
                    formEdit.advanture.checked = true;
                }
                if(variables[key] === "Hành động") {
                    formEdit.act.checked = true;
                }
                if(variables[key] === "Viễn tưởng") {
                    formEdit.science.checked = true;
                }
                if(variables[key] === "Kinh dị") {
                    formEdit.horrified.checked = true;
                }
                if(variables[key] === "Đời thường") {
                    formEdit.realLife.checked = true;
                }
                if(variables[key] === "Hài hước") {
                    formEdit.funny.checked = true;
                }
            }

            //language
            const languageSelect = document.getElementById("language");
            if (languageSelect) {
                const options = languageSelect.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === res.data.language) {
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
                    if (options[i].value == res.data.age) {
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
                    if (options[i].value == res.data.type) {
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
                    if (options[i].value == res.data.status) {
                        options[i].selected = true;
                        break;
                    }
                }
            }

            // Sự kiện submit form editManga
            formEdit.addEventListener("submit", (event) => {
                event.preventDefault();

                //Lấy giá trị của các thuộc tính
                const language = document.getElementById("language").value;
                const age = document.getElementById("ageLimit").value;
                const name = formEdit.nameOfManga.value;
                const author = formEdit.nameOfAuthor.value;
                const type = document.getElementById("typeOfManga").value;
                const status = document.getElementById("statusOfManga").value;
                const tag = Array.from(event.target.tag);
                const checkedTag = tag.filter((item) => item.checked === true);
                const description = formEdit.description.value;

                // In ra cảnh báo
                if(!name) {
                    showAlert("Vui lòng nhập tên truyện!", 3000, "alert--error");
                    return;
                }
                if(!author) {
                    showAlert("Vui lòng nhập tên tác giả!", 3000, "alert--error");
                    return;
                }
                if(checkedTag.length === 0) {
                    showAlert("Vui lòng chọn Tag cho truyện!", 3000, "alert--error");
                    return;
                }
                if(!description) {
                    showAlert("Vui lòng nhập mô tả cho truyện!", 3000, "alert--error");
                    return;
                }

                const data = {
                    language: language,
                    age: age,
                    name: name,
                    author: author,
                    type: type,
                    status: status,
                    tag: checkedTag.map(item => item.value).join(", "),
                    description: description
                }

                axios.patch(`http://localhost:3000/comics/${id}`, data)
                .then(res => {
                    showAlert("Chỉnh sửa Truyện thành công!");
                })
            })

            
            // Hết Sự kiện submit form editManga

        })
}
// Hết Đổ data từ database ra trang edit manga - edit-Manga


// Lấy data từ UploadManga form gửi về database
const formUploadManga = document.querySelector("#form-uploadManga");
if(formUploadManga) {
    formUploadManga.addEventListener("submit", (event) => {
        event.preventDefault();

        //Lấy data trong form
        const language = document.getElementById("languageUM").value;
        console.log(language);
        const age = document.getElementById("ageLimitUM").value;
        const name = formUploadManga.nameOfMangaUM.value;
        const author = formUploadManga.nameOfAuthorUM.value;
        const type = document.getElementById("typeOfMangaUM").value;
        const status = document.getElementById("statusOfMangaUM").value;
        const tag = Array.from(event.target.tagUM);
        const checkedTag = tag.filter((item) => item.checked === true);
        const description = formUploadManga.descriptionUM.value;

        let imageDefault = "../../assets/images/images.png"; //ảnh mặc định nếu người dùng không upload ảnh
        let timeDefault = "18:00";
        let dateDefault = "17/12/2024";

        // In ra cảnh báo
        if(!name) {
            showAlert("Vui lòng nhập tên truyện!", 3000, "alert--error");
            return;
        }
        if(!author) {
            showAlert("Vui lòng nhập tên tác giả!", 3000, "alert--error");
            return;
        }
        if(checkedTag.length === 0) {
            showAlert("Vui lòng chọn Tag cho truyện!", 3000, "alert--error");
            return;
        }
        if(!description) {
            showAlert("Vui lòng nhập mô tả cho truyện!", 3000, "alert--error");
            return;
        }

        const data = {
            language: language,
            age: age,
            name: name,
            author: author,
            type: type,
            status: status,
            tag: checkedTag.map(item => item.value).join(", "),
            description: description,
            image: imageDefault,
            time: timeDefault,
            date: dateDefault
        }

        axios.post("http://localhost:3000/comics", data)
        .then(res => {
            showAlert("Tạo truyện mới thành công!");
            formUploadManga.reset();
        })

    });
}
// Hết Lấy data từ UploadManga form gửi về database


// Form Search
const formSearch = document.querySelector(".form-search");
if(formSearch) {
    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = formSearch.keyword.value;
        console.log(keyword);

        axios.get(`http://localhost:3000/comics?q=${keyword}`)
            .then(res => {
                let htmls = "";

                for(const item of res.data) {

                    const href = item.type === "Truyện tranh" ? `upload-chapterManga.html?id=${item.id}` : `upload-chapterNovel.html?id=${item.id}`;

                    htmls += `
                        <div class="client--mangaWrittingCenter-element" item-id="${item.id}"> 
                            <div class="client--mangaWrittingCenter-element--right"><img src=${item.image} alt=${item.name}></div>
                            <div class="client--mangaWrittingCenter-element--middle">
                                <div class="client--mangaWrittingCenter-element-top">
                                    <div class="client--mangaWrittingCenter-element-top--language">${item.language}</div>
                                    <div class="client--mangaWrittingCenter-element-top--name">${item.name}</div>
                                    <div class="client--mangaWrittingCenter-element-top--type">${item.type}</div>
                                </div>
                                <div class="client--mangaWrittingCenter-element-mid"> 
                                    <div class="client--mangaWrittingCenter-element-mid--status">${item.status}</div>
                                    <div class="client--mangaWrittingCenter-element-mid--date"> <i class="fa-regular fa-clock"></i>
                                        <div class="content">${item.time} ${item.date}</div>
                                    </div>
                                </div>
                                <div class="client--mangaWrittingCenter-element-bottom"><a class="button client--mangaWrittingCenter-element-bottom--edit" href="edit-Manga.html?id=${item.id}"><i class="fa-regular fa-pen-to-square"></i>Chỉnh sửa</a>
                                    <button class="button button-delete client--mangaWrittingCenter-element-bottom--delete" button-delete="${item.id}"><i class="fa-regular fa-trash-can"></i>Xóa</button>
                                </div>
                            </div>
                            <div class="client--mangaWrittingCenter-element--left">
                                <div class="client--mangaWrittingCenter-element--left-inner"><a class="button client--mangaWrittingCenter-element--left_button--addChapter" href="${href}"><i class="fa-solid fa-file-arrow-up"></i>
                                    <div class="content">Thêm chương</div></a>
                                    <a class="button client--mangaWrittingCenter-element--left_button--addChapter" href="chapter-list.html?id=${item.id}"><i class="fa-solid fa-ellipsis-vertical"></i><i class="fa-solid fa-bars"></i>
                                        <div class="content">Danh sách chương</div>
                                    </a></div>
                            </div>
                        </div>
                    `;
                }

                elementProductList.innerHTML = htmls;
            })
    })
}
// Hết Form Search


