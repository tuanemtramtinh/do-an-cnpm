document.addEventListener('DOMContentLoaded', async function() {
    let mangaData = [];
    let currentIndex = 0;

    // Lấy truyện nổi bật 
    try {
        const response = await fetch('https://api.tuanemtramtinh.io.vn/book?keyword=highlight');
        const data = await response.json();

        if (data.status === 200 && data.payload) {
            mangaData = data.payload;
            renderCurrentManga(currentIndex);
        } else {
            console.error('Lấy dữ liệu truyện thất bại:', data.message);
            alert('Lấy dữ liệu truyện nổi bật thất bại.');
        }
    } catch (error) {
        console.error('Lỗi khi fetch truyện nổi bật:', error);
        alert('Đã xảy ra lỗi khi lấy dữ liệu truyện nổi bật.');
    }

    console.log(mangaData);

    
    function renderCurrentManga(index) {
        console.log(index)
        const manga = mangaData[index];
        console.log(manga);

        // console.log(manga);
        if (manga) {
            const mangaLink = document.querySelector('.content-noibat__noidung-truyen');
            const mangaImg = document.querySelector('.content-noibat__noidung-img');
            const mangaTitle = document.querySelector('.content-noibat__noidung-tieude');
            const mangaTagsContainer = document.querySelector('.content-noibat__noidung-tag-list');
            const mangaDescription = document.querySelector('.content-noibat__noidung-thongtin');
            const mangaBackground = document.querySelector('.content-noibat');

            if(index === 0){
                mangaLink.href = `./chapter-page.html?bookId=${manga.id}`; 
                mangaLink.setAttribute('data-id', manga.id); 
            }
            else{
                if (mangaLink) {
                    mangaLink.href = `./chapter-page.html?bookId=${manga._id}`; 
                    mangaLink.setAttribute('data-id', manga._id); 
                }
            }

            if (mangaImg) mangaImg.src = manga.thumbnail;
            if (mangaTitle) mangaTitle.textContent = manga.name;
            
            if (mangaDescription) {
                console.log(manga.description);
                mangaDescription.textContent = manga.description;
            }

            if (mangaTagsContainer) {
                mangaTagsContainer.innerHTML = '';
                manga.tag.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'content-noibat__noidung-tag-item';
                    tagElement.textContent = tag.name;
                    mangaTagsContainer.appendChild(tagElement);
                });
            }

            if (mangaBackground) {
                let blurLayer = mangaBackground.querySelector('.blur-layer');
                if (!blurLayer) {
                    blurLayer = document.createElement('div');
                    blurLayer.classList.add('blur-layer');
                    blurLayer.style.position = 'absolute';
                    blurLayer.style.top = '0';
                    blurLayer.style.left = '0';
                    blurLayer.style.width = '100%';
                    blurLayer.style.height = '100%';
                    blurLayer.style.backgroundImage = `url(${manga.thumbnail})`;
                    blurLayer.style.backgroundSize = 'cover';
                    blurLayer.style.backgroundPosition = 'center';
                    blurLayer.style.backgroundRepeat = 'no-repeat';
                    blurLayer.style.filter = 'blur(4px)';
                    blurLayer.style.zIndex = '-1';
                    blurLayer.style.transition = 'filter 0.5s ease, background-image 0.3s ease';
                    mangaBackground.appendChild(blurLayer);
                } else {
                    blurLayer.style.backgroundImage = `url(${manga.thumbnail})`;
                }

                let overlay = mangaBackground.querySelector('.overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.classList.add('overlay');
                    overlay.style.position = 'absolute';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.opacity = '0.6';
                    overlay.style.zIndex = '0';
                    overlay.style.transition = 'opacity 0.3s ease';
                    mangaBackground.appendChild(overlay);
                }

                mangaBackground.style.position = 'relative';
                mangaBackground.style.overflow = 'hidden';
            }
        }
    }

    const buttonNext = document.querySelector('.content-noibat__noidung-dieukhienphai');
    const buttonPrev = document.querySelector('.content-noibat__noidung-dieukhientrai');

    if (buttonNext) {
        buttonNext.addEventListener('click', function () {
            currentIndex = (currentIndex + 1) % mangaData.length;
            renderCurrentManga(currentIndex);
        });
    }

    if (buttonPrev) {
        buttonPrev.addEventListener('click', function () {
            currentIndex = (currentIndex - 1 + mangaData.length) % mangaData.length;
            renderCurrentManga(currentIndex);
        });
    }


    // Lấy danh sách truyện tranh

    try {
        const response = await fetch('https://api.tuanemtramtinh.io.vn/book');
        const data = await response.json();

        if (data.status === 200 && data.payload) {
            mangaData = data.payload; 

            const mangaListContainer = document.querySelector('.content-chuamanga__list-manga');
            if (mangaListContainer) {
                renderMangaList(mangaData);
            } else {
                console.error('Không tìm thấy container cho danh sách truyện.');
            }
        } else {
            console.error('Lấy dữ liệu manga thất bại:', data.message);
            alert('Lấy dữ liệu manga thất bại.');
        }

        const tagButtons = document.querySelectorAll('.content-chuatag__item-tag');
        tagButtons.forEach(button => {
            button.addEventListener('click', function () {
                const tagName = this.textContent.trim().toLowerCase();
                const filteredManga = mangaData.filter(manga =>
                    manga.tag.some(tag => tag.name.toLowerCase() === tagName)
                );
                renderMangaList(filteredManga); 
            });
        });

    } catch (error) {
        console.error('Lỗi khi fetch manga:', error);
        alert('Đã xảy ra lỗi khi lấy dữ liệu manga.');
    }

    function renderMangaList(mangaList) {
        const mangaListContainer = document.querySelector('.content-chuamanga__list-manga');
        if (mangaListContainer) {
            let mangaItemsHtml = mangaList.map(manga => {
                const mangaId = manga._id ? manga._id : 'no-id';

                return `
                    <div class="col l-3 m-4 c-6">
                        <div class="content-chuamanga__item-manga">
                            <a href="./chapter-page.html?bookId=${mangaId}" class="content-chuamanga__item-chitiet" value="${mangaId}">
                                <img src="${manga.thumbnail}" class="content-chuamanga__item-img" alt="${manga.name}">
                            </a>
                            <div class="content-chuamanga__item-container">
                                <h3 class="content-chuamanga__item-name">${manga.name}</h3>
                                <p class="content-chuamanga__item-author">${manga.author}</p>
                                <p class="content-chuamanga__item-time">Cập nhật lúc: ${manga.updatedAt}</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            mangaListContainer.innerHTML = `
                <div class="row sm-gutter">
                    ${mangaItemsHtml}
                </div>
            `;
        } else {
            console.error('Không tìm thấy container cho danh sách truyện.');
        }
    }



        // Lấy avatar 
    const token = localStorage.getItem('token');
    const avatarImg = document.querySelector('.header__navbar-user-img');
    const adminLink = document.querySelector('.header__navbar-user-item.admin-link'); 

    if (token && avatarImg) {
        avatarImg.src = '../../assets/img/loading.gif';
        try {
            const response = await fetch('https://api.tuanemtramtinh.io.vn/user/info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 200 && data.payload) {
                    const avatarUrl = data.payload.avatar;
                    if (avatarUrl) {
                        avatarImg.src = `${avatarUrl}?t=${new Date().getTime()}`; 
                    } else {
                        console.error('Không tìm thấy URL ảnh đại diện trong payload.');
                        avatarImg.src = '../../assets/img/truyen1.jpg'; 
                    }

                    if (data.payload.isAdmin) {
                        if (adminLink) {
                            adminLink.style.display = 'list-item'; 
                        }
                    }
                } else {
                    console.error('Lấy thông tin người dùng thất bại:', data.message);
                    avatarImg.src = '../../assets/img/truyen1.jpg'; 
                }
            } else {
                console.error('Lấy thông tin người dùng thất bại với mã phản hồi:', response.status);
                avatarImg.src = '../../assets/img/truyen1.jpg'; 
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            avatarImg.src = '../../assets/img/truyen1.jpg'; 
        }
    } else {
        if (avatarImg) {
            avatarImg.src = '../../assets/img/truyen1.jpg'; 
        }
    }


    ///////////////////////////////////////////////////////////////
    const buyBtnsquenpass = document.querySelectorAll('.modal-label-quenpass');
    const modalquenpass = document.querySelector('.js-modal-quenpass');
    const modalquenpassContai = document.querySelector('.js-modal-quenpass-container');
    const tatquenpass = document.querySelector('.js-modal-close-quenpass');

    const modal = document.querySelector('.js-modal');

    const otpModal = document.querySelector('.js-modal-otp');
    const otpModalContainer = document.querySelector('.js-modal-otp-container');
    const closeOtpModal = document.querySelector('.js-modal-close-otp');
    const chuyenOtps = document.querySelector('#button-quenpass');

    const changePassModal = document.querySelector('.js-modal-changepass');
    const changePassContainer = document.querySelector('.js-modal-changepass-container');
    const closeChangePassModal = document.querySelector('.js-modal-close-changepass');
    const chuyenchangePass = document.querySelector('#button-otp');

    function showbuyticketquenpass() {
        modalquenpass.classList.add('open');
        if (modal) {
            modal.classList.remove('open');
        }
    }

    function tatquenpassbuyticket() {
        modalquenpass.classList.remove('open');
    }

    for (const buyBtn of buyBtnsquenpass) {
        buyBtn.addEventListener('click', showbuyticketquenpass);
    }

    tatquenpass.addEventListener('click', tatquenpassbuyticket);
    modalquenpass.addEventListener('click', tatquenpassbuyticket);
    modalquenpassContai.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    /////////////////////////////////////////

    function showOtp() {
        otpModal.classList.add('open');
        modalquenpass.classList.remove('open');
    }

    function tatOtpbuyticket() {
        otpModal.classList.remove('open');
    }

    chuyenOtps.addEventListener('click', showOtp);

    closeOtpModal.addEventListener('click', tatOtpbuyticket);
    otpModal.addEventListener('click', tatOtpbuyticket);
    otpModalContainer.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    ////////////////////////////////////////////

    function showChangepass() {
        changePassModal.classList.add('open');
        otpModal.classList.remove('open');
    }

    function tatChangepassbuyticket() {
        changePassModal.classList.remove('open');
    }

    chuyenchangePass.addEventListener('click', showChangepass);

    closeChangePassModal.addEventListener('click', tatChangepassbuyticket);
    changePassModal.addEventListener('click', tatChangepassbuyticket);
    changePassContainer.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    ////////////////////////////////////////////////////////////
    // Xử lý quên mật khẩu
    let Emailxacnhan = "";

    async function sendEmail(email) {
        try {
            const response = await fetch("https://api.tuanemtramtinh.io.vn/user/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.payload.otp) {
                    Emailxacnhan = email;
                    alert('OTP đã được gửi thành công! Vui lòng kiểm tra email của bạn.');
                    showOtp();
                } else {
                    alert('Không nhận được OTP. Vui lòng thử lại.');
                }
            } else {
                const errorData = await response.json();
                alert(`Yêu cầu thất bại: ${errorData.message}`);
            }
        } catch (error) {
            alert('Đã xảy ra lỗi trong quá trình yêu cầu.');
        }
    }

    async function confirmOtp(email, otp) {
        if (!email) {
            alert('Email không được cung cấp. Vui lòng thử lại.');
            return;
        }
        try {
            const response = await fetch("https://api.tuanemtramtinh.io.vn/user/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, otp: otp }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.payload.token) {
                    localStorage.setItem('token', data.payload.token);
                    showChangepass();
                } else {
                    alert('Đăng nhập thất bại: Không nhận được token.');
                }
            } else {
                const errorData = await response.json();
                alert(`Đăng nhập thất bại: ${errorData.message}`);
            }
        } catch (error) {
            alert('Đã xảy ra lỗi trong quá trình đăng nhập.');
        }
    }

    async function changePass(password) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập để thực hiện thay đổi.");
            return;
        }

        try {
            const response = await fetch("https://api.tuanemtramtinh.io.vn/user/update-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                alert("Thay đổi mật khẩu thành công, vui lòng reload lại.");
                setTimeout(() => {
                    changePassModal.classList.remove("open");
                }, 200);
            } else {
                const errorData = await response.json();
                alert(`Thay đổi mật khẩu thất bại: ${errorData.message}`);
            }
        } catch (error) {
            alert("Đã xảy ra lỗi khi thay đổi.");
        }
    }

    const forgotPasswordButton = document.querySelector("#button-quenpass");
    if (forgotPasswordButton) {
        forgotPasswordButton.addEventListener("click", async function() {
            const email2 = document.getElementById("email2").value;
            await sendEmail(email2);
        });
    } else {
        console.error("Nút quên mật khẩu (#button-quenpass) không được tìm thấy.");
    }

    const testForm = document.querySelector('.test-form');
    if (testForm) {
        testForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const otp = document.getElementById("otpCode").value;

            if (Emailxacnhan) {
                await confirmOtp(Emailxacnhan, otp);
            }
        });
    }

    const testForm2 = document.querySelector('.test-form2');
    if (testForm2) {
        testForm2.addEventListener("submit", async function(event) {
            event.preventDefault();
            const password = document.getElementById("changepass").value;
            await changePass(password);
        });
    }
});
