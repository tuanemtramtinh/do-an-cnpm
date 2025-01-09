//Chuyển hướng về trang chủ 

const trangCaNhan = document.querySelector(".header__navbar-user-item a");
trangCaNhan.href = "../../client/pages/personal_page.html";

const trangChu = document.querySelector(".header-logo-link");
trangChu.href = "../../client/pages/home_page.html"

const dangXuat = document.querySelector(".header__navbar-user-item--separate button");
// dangXuat.innerHTML = '<a href="./../client/pages/home_page.html">Đăng Xuất</a>';

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

// Hàm toggle hiển thị/ẩn dropdown
function toggleDropdown(button) {
    const dropdown = button.nextElementSibling;
    dropdown.classList.toggle('active');
  }
  
  // Hàm thay đổi role
function changeRole(role, listItem) {
    const userCard = listItem.closest('.user-card');
    const roleButton = userCard.querySelector('.user-role');
    
    // Cập nhật role trên button
    roleButton.textContent = role;
  
    // Đóng dropdown
    listItem.parentElement.classList.remove('active');
  
    // Thực hiện các logic khác như gửi request để cập nhật role
    console.log(`Role updated to: ${role}`);
}

function showSection(section) {
  // Ẩn tất cả các section
  document.querySelectorAll('.admin-user-management').forEach((content) => {
    content.classList.add('hidden'); // Thêm class 'hidden'
  });

  // Hiển thị section được chọn
  const targetSection = document.getElementById(`${section}Section`);
  if (targetSection) {
    targetSection.classList.remove('hidden'); // Loại bỏ class 'hidden'
  }
}



document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.function-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const section = button.dataset.section; // Lấy section từ data-section
      showSection(section); // Hiển thị section mục tiêu
    });
  });
});

document.addEventListener('DOMContentLoaded', async function(){
  const token = localStorage.getItem('token');
  const userList = document.querySelector('.user-list');
  // const changeUserRole = async () => {
  //   const response = await 
  // }
  try{
    const response = await fetch('https://api.mangocomic.io.vn/admin/user/getAlluser', {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },});
      if(response.ok){
        const data = await response.json();
        data.data.map((el) => {
          const userCard = document.createElement('div');
          userCard.classList.add('user-card');
          userCard.innerHTML = `<img class="user-avatar" src="${el.avatar}" alt="Avatar"/>
                  <div class="user-details">
                    <h3 class="user-name">${el.username}</h3>
                    <p class="user-email">${el.email}</p>
                    <select class='user-change-role' value=${el.isAdmin} user-id="${el._id}">
                      <option value=true ${el.isAdmin === true ? "selected" : ""}>Admin</option>
                      <option value=false ${el.isAdmin === false ? "selected" : ""}>Uploader</option>
                    </select>
                  </div>
                  <div class="user-status">
                    <button class="status-btn active"><i class="fa-solid fa-circle"></i>  Hoạt động</button>
                    <button class="delete-btn"><i class="fa-solid fa-trash"></i> Xóa</button>
                  </div>
                `
          userList.appendChild(userCard);
        });


        const selectChangeRole = document.querySelectorAll(".user-change-role");
        if (selectChangeRole.length !== 0) {
          selectChangeRole.forEach((select) => {
            const userId = select.getAttribute("user-id");
            select.addEventListener("change", async () => {
              const response = await fetch(`https://api.mangocomic.io.vn/admin/user/change-role/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  role: select.value === "true" ? "admin" : "uploader"
                })
              });
              showAlert("Phân quyền thành công");
            })
          })
        }
      }
  }
  catch(err){
    console.error("Lấy thông tin người dùng thất bại !!!");
  }
})