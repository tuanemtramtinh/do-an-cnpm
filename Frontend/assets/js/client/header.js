const buyBtns = document.querySelectorAll(".header-item__login");
const modal = document.querySelector(".js-modal");
const modalContai = document.querySelector(".js-modal-container");
const tat = document.querySelector(".js-modal-close");

function showbuyticket() {
  modal.classList.add("open");
}

function tatbuyticket() {

  modal.classList.remove("open");
}

for (const buyBtn of buyBtns) {
  buyBtn.addEventListener("click", showbuyticket);
}

tat.addEventListener("click", tatbuyticket);
modal.addEventListener("click", tatbuyticket);
modalContai.addEventListener("click", function (event) {
  event.stopPropagation();
});

//////////////////////////////////////////////////////////////////////

const buyBtnsDangky = document.querySelectorAll("#dangky");
const modalDangky = document.querySelector(".js-modal-dangky");
const modalDangkyContai = document.querySelector(".js-modal-container-dangky");
const tatDangky = document.querySelector(".js-modal-close-dangky");

function showbuyticketDangky() {
  modalDangky.classList.add("open");
  modal.classList.remove("open");
}

function tatDangkybuyticket() {
  modalDangky.classList.remove("open");
}

for (const buyBtn of buyBtnsDangky) {
  buyBtn.addEventListener("click", showbuyticketDangky);
}

tatDangky.addEventListener('click',tatDangkybuyticket)
modalDangky.addEventListener('click',tatDangkybuyticket)
modalDangkyContai.addEventListener('click', function(event){
    event.stopPropagation()
})

/////////////////////////////////////////////////
const buyBtnsTH = document.querySelectorAll("#dangnhap");

console.log(buyBtnsTH);

function showbuyticket() {
  modal.classList.add("open");
  modalDangky.classList.remove("open");
}

function tatbuyticket() {
  modal.classList.remove("open");
}

for (const buyBtn of buyBtnsTH) {
  buyBtn.addEventListener("click", showbuyticket);
}

tat.addEventListener("click", tatbuyticket);
modal.addEventListener("click", tatbuyticket);
modalContai.addEventListener("click", function (event) {
  event.stopPropagation();
});

document.addEventListener("DOMContentLoaded", function () {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("button-login");

  function validateInputs() {
    const isUsernameFilled = usernameInput.value.trim() !== "";
    const isPasswordFilled = passwordInput.value.trim() !== "";

    if (isUsernameFilled && isPasswordFilled) {
      loginButton.disabled = false;
    } else {
      loginButton.disabled = true;
      // alert("Vui lòng nhập đầy đủ.");
    }
  }

  usernameInput.addEventListener("input", validateInputs);
  passwordInput.addEventListener("input", validateInputs);

  validateInputs();
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-2");
  const usernameInput = document.getElementById("username2");
  const passwordInput = document.getElementById("pass2");
  const daybdInput = document.getElementById("daybd");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const registerButton = document.getElementById("button-dangky");

  function validateInputs() {
    const isUsernameFilled = usernameInput.value.trim() !== "";
    const isPasswordFilled = passwordInput.value.trim() !== "";
    const isDaybdFilled = daybdInput.value.trim() !== "";
    const isEmailValid = emailInput.checkValidity();
    const isPhoneValid = phoneInput.checkValidity();

    if (
      isUsernameFilled &&
      isPasswordFilled &&
      isDaybdFilled &&
      isEmailValid &&
      isPhoneValid
    ) {
      registerButton.disabled = false;
    } else {
      registerButton.disabled = true;
      // alert("Vui lòng nhập đầy đủ.");
    }
  }

  usernameInput.addEventListener("input", validateInputs);
  passwordInput.addEventListener("input", validateInputs);
  daybdInput.addEventListener("input", validateInputs);
  emailInput.addEventListener("input", validateInputs);
  phoneInput.addEventListener("input", validateInputs);

  validateInputs();
});

/////////////////////////////////////////////////////////
// xu ly xac thuc nguoi dung
async function login(username, password) {
    // console.log(username);
    // console.log(password);
	try {
		const response = await fetch("https://api.mangocomic.io.vn/user/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

    if (response.ok) {
      const data = await response.json();
      console.log(data.payload.token);
      if (data.payload.token) {
        localStorage.setItem("token", data.payload.token);
        updateUIBasedOnLogin();
        console.log("Đăng nhập thành công!");
      } else {
        console.error("Không nhận được token.");
        alert("Đăng nhập thất bại: Không nhận được token.");
      }
    } else {
      const errorData = await response.json();
      console.error("Đăng nhập thất bại:", errorData.message);
      alert(`Đăng nhập thất bại: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Đã xảy ra lỗi trong quá trình đăng nhập.");
  }
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Token không hợp lệ:", e);
    return null;
  }
}

async function updateUIBasedOnLogin() {
  const token = localStorage.getItem("token");
  if (token) {
    const userInfo = parseJwt(token);
    if (userInfo) {
      document.querySelector(".header-item__login").style.display = "none";
      document.querySelector(".header__navbar-user").style.display = "flex";
    }
    const logoutButton = document.querySelector("#button-logout");
    console.log(logoutButton);
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        localStorage.removeItem("token");
        updateUIBasedOnLogin();
        window.location.href = "./home_page.html";
      });
    } else {
      console.error("Không tìm thấy nút đăng xuất.");
    }
  } else {
    document.querySelector(".header-item__login").style.display = "block";
    document.querySelector(".header__navbar-user").style.display = "none";
  }
  await getUserProfile();
}

async function getUserProfile() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in first.");
      return;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
	await updateUIBasedOnLogin();
  
	const loginButton = document.querySelector("#button-login");
    
	if (loginButton) {
	  loginButton.addEventListener("click", async function () {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      await login(username, password);
      location.reload();
      const modal = document.querySelector(".js-modal");
      if (modal) {
        setTimeout(() => {
        modal.classList.remove("open");
        }, 200);
      }
	  });
	} else {
	  console.error("Login button (#button-login) not found.");
	}
});

////////////////////////////////////////////////////////////////////////
// dang ky tai khoan moi
async function dangky(email, username, password, dob, phone) {
	try {
		const response = await fetch(
			"https://api.mangocomic.io.vn/user/register",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
                    username,
                    password,
                    dob,
                    phone,
				}),
			}
		);
        console.log(response);
		if (response.ok) {
			const data = await response.json();
            
			alert("Đăng ký thành công");

		} else {
			const errorData = await response.json();
			console.error("Đăng ký thất bại:", errorData.message);
			alert(`Đăng ký thất bại: ${errorData.message}`);
		}
	} catch (error) {
		console.error("Lỗi:", error);
		alert("Đã xảy ra lỗi trong quá trình đăng ký.");
	}
}

document.addEventListener("DOMContentLoaded", async function () {
  await updateUIBasedOnLogin();

  const dangkyButton = document.querySelector("#button-dangky");
  if (dangkyButton) {
    dangkyButton.addEventListener("click", async function () {
      const email = document.getElementById("email").value;
      const username = document.getElementById("username2").value;
      const password = document.getElementById("pass2").value;
      const dob = document.getElementById("daybd").value;
      const phone = document.getElementById("phone").value;

      await dangky(email, username, password, dob, phone);

      setTimeout(() => {
        const modal = document.querySelector(".js-modal-dangky");
        if (modal) {
          modal.classList.remove("open");
        }
      }, 200);
    });
  }
});
document.addEventListener("DOMContentLoaded", async function () {
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
});
