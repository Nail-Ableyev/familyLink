let activeOne;
let activeTwo;
let counter = 0;
let relativeStatus="relative"
let currentEl;


document.getElementById('family-grid')
.addEventListener('click', event => {
  if (event.target.className === 'family-cell') {
    currentEl=event.target
    handleClick(currentEl.id);
  }
});

function sentenceMaker(relative){
    document.getElementById('sentence').innerHTML = `<h2><span>${activeOne}</span> is <span>${activeTwo}</span>'s  ${relative}</h2>` 
}

function handleClick(cellId){
    if (counter===0){
        activeOne=cellId
        currentEl.classList.add("active");
        counter++
    }

    else if (counter===1){
        activeTwo=cellId;
        currentEl.classList.add("active");
        sentenceMaker(relativeStatus)
        counter++
    }

    else {
        Array.from(document.querySelectorAll('.family-cell')).forEach((el) => el.classList.remove('active'));
        counter=0
    }
    console.log(cellId)

}