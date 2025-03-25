 const prevBtn = document.querySelector(`.prev`);
 const nextBtn = document.querySelector(`.next`);
 const slideList = document.querySelectorAll(`.slide`);
 let index = 0;
 
 prevBtn.addEventListener("click", goPrev);
 nextBtn.addEventListener("click", goNext);
 
 function update() {
   slideList.forEach((element, i) => {
     element.classList.toggle("active", i == index);
   });
 }
 
 function goNext() {
   if (index < slideList.length - 1) {
     index++;
     update();
   } else {
     index = 0;
     update();
   }
 }
 
 function goPrev() {
   if (index > 0) {
     index--;
     update();
   } else {
     index = slideList.length - 1;
     update();
   }
 }
 
 update();