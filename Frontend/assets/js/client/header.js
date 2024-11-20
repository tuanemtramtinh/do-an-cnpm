const buyBtns = document.querySelectorAll('.header-item__login')
// document de lay class trong bai query.. lay tat ca cac class co ten
const modal = document.querySelector('.js-modal')
const modalContai = document.querySelector('.js-modal-container')
const tat=document.querySelector('.js-modal-close')

function showbuyticket(){
    modal.classList.add('open')
}

function tatbuyticket(){
    modal.classList.remove('open')
}

for(const buyBtn of buyBtns){
    buyBtn.addEventListener('click', showbuyticket)
} // chay tung nut trong buyBtns

tat.addEventListener('click',tatbuyticket)
modal.addEventListener('click',tatbuyticket)
modalContai.addEventListener('click', function(event){
    event.stopPropagation()
})// ngang chan click vao ben trong bi out ra

//////////////////////////////////////////////////////////////////////


const buyBtnsDangky = document.querySelectorAll('#dangky')
// document de lay class trong bai query.. lay tat ca cac class co ten
const modalDangky = document.querySelector('.js-modal-dangky')
const modalDangkyContai = document.querySelector('.js-modal-container-dangky')
const tatDangky=document.querySelector('.js-modal-close-dangky')

function showbuyticketDangky(){
    modalDangky.classList.add('open')
    modal.classList.remove('open')
}

function tatDangkybuyticket(){
    modalDangky.classList.remove('open')
}

for(const buyBtn of buyBtnsDangky){
    buyBtn.addEventListener('click', showbuyticketDangky)
} // chay tung nut trong buyBtnsDangky

tatDangky.addEventListener('click',tatDangkybuyticket)
modalDangky.addEventListener('click',tatDangkybuyticket)
modalDangkyContai.addEventListener('click', function(event){
    event.stopPropagation()
})// ngang chan click vao ben trong bi out ra


/////////////////////////////////////////////////
const buyBtnsTH = document.querySelectorAll('#dangnhap')
// document de lay class trong bai query.. lay tat ca cac class co ten

function showbuyticket(){
    modal.classList.add('open')
    modalDangky.classList.remove('open')
}

function tatbuyticket(){
    modal.classList.remove('open')
}

for(const buyBtn of buyBtnsTH){
    buyBtn.addEventListener('click', showbuyticket)
} // chay tung nut trong buyBtnsTH

tat.addEventListener('click',tatbuyticket)
modal.addEventListener('click',tatbuyticket)
modalContai.addEventListener('click', function(event){
    event.stopPropagation()
})// ngang chan click vao ben trong bi out ra