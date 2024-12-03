document.addEventListener('DOMContentLoaded', async function() {
    const buyBtnsquenpass = document.querySelectorAll('.modal-label-quenpass');
    const modalquenpass = document.querySelector('.js-modal-quenpass');
    const modalquenpassContai = document.querySelector('.js-modal-quenpass-container');
    const tatquenpass = document.querySelector('.js-modal-close-quenpass');

    const modal = document.querySelector('.js-modal'); 

    const otpModal = document.querySelector('.js-modal-otp');
    const otpModalContainer = document.querySelector('.js-modal-otp-container');
    const closeOtpModal = document.querySelector('.js-modal-close-otp');
    const resendOtpButton = document.querySelector('#resendOtp');
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
        console.log('showOtp');
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
        console.log('showChangepass');
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
            const response = await fetch("https://do-an-cnpm.onrender.com/user/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.payload.otp) {
                    Emailxacnhan = email; 
                    alert('OTP đã được gửi thành công! Vui lòng kiểm tra email của bạn.');
                    console.log('OTP đã được gửi!');
                    showOtp(); 
                } else {
                    console.error('Không nhận được OTP.');
                    alert('Không nhận được OTP. Vui lòng thử lại.');
                }
            } else {
                const errorData = await response.json();
                console.error('Yêu cầu thất bại:', errorData.message);
                alert(`Yêu cầu thất bại: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi trong quá trình yêu cầu.');
        }
    }

    async function confirmOtp(email, otp) {
        if (!email) {
            console.error("Email is not provided to confirm OTP.");
            alert('Email không được cung cấp. Vui lòng thử lại.');
            return;
        }
        try {
            const otpNumber = otp;
            console.log('Sending request to server with:', { email, otp: otpNumber });
            const response = await fetch("https://do-an-cnpm.onrender.com/user/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },            
                body: JSON.stringify({ email: email, otp: otp }),

            });
            console.log('Received response:', response);

            if (response.ok) {
                const data = await response.json();
                console.log(data.payload.token);
                if (data.payload.token) {
                    localStorage.setItem('token', data.payload.token); 
                    // updateUIBasedOnLogin(); 
                    console.log('Đăng nhập thành công!');
                    showChangepass(); 
                } else {
                    console.error('Không nhận được token.');
                    alert('Đăng nhập thất bại: Không nhận được token.');
                }
            } else {
                const errorData = await response.json();
                console.error('Đăng nhập thất bại:', errorData.message);
                alert(`Đăng nhập thất bại: ${errorData.message}`);
            }
        } catch (error) {
            console.log(error);
            console.error('Lỗi trong quá trình fetch:', error.message);
            console.error('Stack trace:', error.stack);
            alert('Đã xảy ra lỗi trong quá trình đăng nhập.');
        }    
    }

    async function changePass(password) {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không tìm thấy token. Vui lòng đăng nhập trước.");
            alert("Vui lòng đăng nhập để mua thêm giấy.");
            return;
        }

        try {
            const response = await fetch("https://do-an-cnpm.onrender.com/user/update-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({password}), 
                }
            );

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
            console.error("Lỗi thay đổi:", error);
            alert("Đã xảy ra lỗi khi thay đổi.");
        }
    }


    
    await updateUIBasedOnLogin();

    const forgotPasswordButton = document.querySelector("#button-quenpass");
    if (forgotPasswordButton) {
        forgotPasswordButton.addEventListener("click", async function () {
            const email2 = document.getElementById("email2").value;
            await sendEmail(email2);
        });
    } else {
        console.error("Nút quên mật khẩu (#button-quenpass) không được tìm thấy.");
    }


    ////////////////////////////////////////
    const testForm = document.querySelector('.test-form');
    if (testForm) {
        testForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const otp = document.getElementById("otpCode").value;

            if (Emailxacnhan) {
                console.log('Email xác nhận:', Emailxacnhan);
                await confirmOtp(Emailxacnhan, otp);
            }
        });
    } else {
        console.error("Form xác nhận OTP (.test-form) không được tìm thấy.");
    }

    //////////////////////////////////////////////////


    const testForm2 = document.querySelector('.test-form2');
    if (testForm2) {
        testForm2.addEventListener("submit", async function (event) {
            event.preventDefault();
            const password = document.getElementById("changepass").value;
            await changePass(password);
        });
    } else {
        console.error("Form thay đổi mật khẩu (.test-form2) không được tìm thấy.");
    }
});

