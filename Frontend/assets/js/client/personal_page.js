document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    const avatarImg = document.querySelector('.profile-avatar');
    const profileSection = document.querySelector('.profile-section');
    const profileInfo = document.querySelector('.personal-info-box');
    if (token && avatarImg) {
        avatarImg.src = '../../assets/img/loading.gif';
        try {
            const response = await fetch('https://api.mangocomic.io.vn/user/info', {
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
                    profileSection.innerHTML = `<img class="profile-avatar" src="${avatarUrl}" alt="Profile Avatar"/> <div class="profile-info"> <h2 class="profile-name">${data.payload.username}</h2> <p class="profile-role">Vai trò: ${data.payload.role}</p> <p class="profile-join-date">Ngày gia nhập: ${data.payload.createdAt}</p> </div>`
                    profileInfo.innerHTML = `<p><strong>Email: </strong>${data.payload.email}</p> <p><strong>Username: </strong>${data.payload.username}</p> <p><strong>SĐT: </strong>${data.payload.phone}</p> <p><strong>Ngày sinh: </strong>${data.payload.dob}</p>`
                    if (avatarUrl) {
                        avatarImg.src = `${avatarUrl}?t=${new Date().getTime()}`; 
                    } else {
                        console.error('Không tìm thấy URL ảnh đại diện trong payload.');
                        avatarImg.src = '../../assets/img/default-avatar.jpg'; 
                    }

                } else {
                    console.error('Lấy thông tin người dùng thất bại:', data.message);
                    avatarImg.src = '../../assets/img/default-avatar.jpg'; 
                }
            } else {
                console.error('Lấy thông tin người dùng thất bại với mã phản hồi:', response.status);
                avatarImg.src = '../../assets/img/default-avatar.jpg'; 
            }

        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            avatarImg.src = '../../assets/img/default-avatar.jpg'; 
        }
    } else {
        if (avatarImg) {
            avatarImg.src = '../../assets/img/default-avatar.jpg'; 
        }
    }
    console.log(token);
    if (token) {
        try{
            const response = await fetch('https://api.mangocomic.io.vn/book/posted-manga-list', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            }
        );
        console.log(response);
        if (response.ok){
            const manganen = document.querySelector('.content-chuamanga__item-rank-noidung');
            const mangatacgia = document.querySelector('.content-chuamanga__item-rank-tag-author');
            const mangaten = document.querySelector('.content-chuamanga__item-rank-tieude');
            const mangalisted = document.querySelector('.content-chuamanga__item-rank-tag-list');
            const mangachapters = document.querySelector('.content-chuamanga__item-rank-thongtinduoi');
            const mangaPersonalPage = document.querySelector('.content-chuamanga-personal_page'); 
            // console.log(mangaPersonalPage);
            const data = await response.json();
            if (mangaPersonalPage && data.status === 200 && data.payload){
                // console.log(data.payload);
                for (let i = 0; i < data.payload.length; i++){
                    const mangaListRank = document.createElement("div");
                    mangaListRank.classList.add("content-chuamanga__list-rank")
                    let mangaChapterList = [];
                    let mangaTagList = [];
                    // console.log(data.payload[i].chapter);

                    for (let j = 0; j < data.payload[i].chapter.length; j++) {
                        mangaChapterList.push(`<li class="content-chuamanga__item-rank-chap">Chap ${data.payload[i].chapter[j].chapter_no}</li>`);
                    }

                    for (let z = 0; z < data.payload[i].tag.length; z++) {
                        mangaTagList.push(`<li class="content-chuamanga__item-rank-tag-item">${data.payload[i].tag[z].name}</li>`);
                    }

                    mangaChapterList = mangaChapterList.join("\n");
                    mangaTagList = mangaTagList.join("\n");

                    mangaListRank.innerHTML = `
                    <div class="content-chuamanga__item-rank">
                        <div class="content-chuamanga__item-rank-noidung"><img class="content-chuamanga__item-rank-img" src=${data.payload[i].img} alt="">
                        <div class="content-chuamanga__item-rank-thongtinhienthi">
                            <div class="content-chuamanga__item-rank-thongtintren">
                            <div class="content-chuamanga__item-rank-thongtintrai">
                                <h3 class="content-chuamanga__item-rank-tieude">${data.payload[i].name}</h3>
                                <p class="content-chuamanga__item-rank-tag-author">${data.payload[i].author}</p>
                                <p class="content-chuamanga__item-rank-tag-theloai">Thể loại</p>
                                <ul class="content-chuamanga__item-rank-tag-list"> 
                                    ${mangaTagList}
                                </ul>
                            </div>
                            <div class="content-chuamanga__item-rank-thongtinphai">
                                <div class="content-chuamanga__item-rank-like"><i class="fa-regular fa-heart"></i>
                                <p class="content-chuamanga__item-rank-num-like">20</p>
                                </div>
                                <div class="content-chuamanga__item-rank-cmt"><i class="fa-regular fa-comment-dots"></i>
                                <p class="content-chuamanga__item-rank-num-like">10</p>
                                </div>
                            </div>
                            </div>
                            <p class="content-chuamanga__item-rank-xemthem">Xem thêm</p>
                            <ul class="content-chuamanga__item-rank-thongtinduoi"> 
                                ${mangaChapterList}
                            </ul>
                        </div>
                        </div>
                    </div>
                    `
                    mangaPersonalPage.appendChild(mangaListRank);
                    // console.log(mangaListRank);
                    // const mangaChapterList = 
                }
            }
        }
        }
        catch (error) {
            console.error('Thông tin truyện lỗi:', error);
        }
    
    }
})

function toggleMangaList(listIdToShow) {
    const mangaLists = document.querySelectorAll('.content-chuamanga-personal_page');

    mangaLists.forEach((list) => {
      list.classList.remove('open');
      list.classList.add('hidden');
    });
  
    const targetList = document.getElementById(listIdToShow);
    if (targetList) {
      targetList.classList.remove('hidden');
      targetList.classList.add('open');
    }
  }
  