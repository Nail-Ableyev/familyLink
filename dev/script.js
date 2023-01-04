let activeOne,
    activeTwo,
    currentEl,
    objectToUse,
    counter = 0

//Default names to be used
const family = {
  ao1omolr: "John",
  bo1ofolr: "Johana",
  co2omol: "Mike",
  do2ofor: "Tara",
  abo2ofol: "Miley",
  abo2omor: "Tony",
  abco3ofol: "Betsy",
  abco3omol: "Brian",
  abdo3ofor: "Cheryl",
  abdo3omor: "Charlie"
}

//Checking if name exist in local storage (which means they have been changes before)
function getFromStorage(){
  if (localStorage.getItem('family') === null) {
    objectToUse = family
  }
  else{
    objectToUse=JSON.parse(window.localStorage.getItem('family'));
  }
  return objectToUse
}

function saveToStorage(){
  window.localStorage.setItem("family", JSON.stringify(objectToUse))
}

//Populate pre-existing grid with names
function populator(){
  getFromStorage();
  [...document.querySelectorAll('.person-name')].forEach(function(item) {
    item.textContent=objectToUse[item.dataset.familyid]
  })

}

populator()

//the keys in "family" are used to help with logic in comparer function later. id - like a  gene(ab- means a decendant of person a and peson b)
//level - is a generation, branch - devides tree in two halves left and right
function divider (inputString){
  const interimArray = inputString.split("o")
  const itemObject = {id: interimArray[0], level: interimArray[1], gender: interimArray[2], branch:interimArray[3]}
  return itemObject
}

function removeActive(){
  Array.from(document.querySelectorAll('.person')).forEach((el) => el.classList.remove('active'));
  counter=0
  document.getElementById('sentence').innerHTML ="<h2>Click on a family member</h2>"
}

//Heavy lifting of deciding relation between first and second person clicked 
function comparer(){
  const object1=divider(activeOne);
  const object2=divider(activeTwo);

  levelDifference=object1.level - object2.level

  if(levelDifference===-2){
    object1.gender === "m" ? sentenceMaker("grandfather") : sentenceMaker("grandmother")
  }
  else if (levelDifference===2) {
    object1.gender === "m" ? sentenceMaker("grandson") : sentenceMaker("granddaughter")
  }
  else if (levelDifference===-1){
    if (object2.id.includes(object1.id)){
      if(object1.branch.includes(object2.branch)){
          object1.gender === "m" ? sentenceMaker("father") : sentenceMaker("mother")
      }
      else{
        object1.gender === "m" ? sentenceMaker("uncle") : sentenceMaker("aunt")
      }
    }
    else{
      if(object1.level === "2"){
        object1.gender === "m" ? sentenceMaker("uncle") : sentenceMaker("aunt")
      }
      else{
        object1.gender === "m" ? sentenceMaker("father-in-law") : sentenceMaker("mother-in-law")
      }
      
    }
  }
  else if (levelDifference===1){
    if (object1.id.includes(object2.id)){
      if(object2.branch.includes(object1.branch)){
          object1.gender === "m" ? sentenceMaker("son") : sentenceMaker("daughter")
      }
      else{
        object1.gender === "m" ? sentenceMaker("nephew") : sentenceMaker("niece")
      }
    }
    else{
      if(object1.level === "2"){
        object1.gender === "m" ? sentenceMaker("son-in-law") : sentenceMaker("daughter-in-law")
      }
      else{
        object1.gender === "m" ? sentenceMaker("nephew") : sentenceMaker("niece")
      }
      
    }
  }
  else{
    if(object1.id===object2.id){
      object1.gender === "m" ? sentenceMaker("brother") : sentenceMaker("sister")
    }
    else{
      if(object1.level==="3"){
        sentenceMaker("cousin")
      }
      else if(object1.id==="c" || object1.id==="d" ){
        object1.gender === "m" ? sentenceMaker("brother-in-law") : sentenceMaker("sister-in-law")
      }
      else{
        object1.gender === "m" ? sentenceMaker("husband") : sentenceMaker("wife")
      }
    }
  }
}

//Shows final sentence consiting of two people clicked and relation status between them. Using innerText to sanitize user input as they can change names
function sentenceMaker(relative){
  document.getElementById('sentence').innerHTML = `<h2><span id='firstperson'></span> is <span id='secondperson'></span>'s <span id='relative'>${relative}</span></h2>`
  document.getElementById('firstperson').innerText=objectToUse[activeOne]
  document.getElementById('secondperson').innerText=objectToUse[activeTwo]
 
}

document.getElementById('family-grid')
.addEventListener('click', event => {
  if (event.target.className === 'person') {
    currentEl=event.target
    handleClick(currentEl.dataset.familyid);
  }
  else{
    removeActive()
  }
});

[...document.querySelectorAll('.person-name')].forEach(function(item) {
  item.addEventListener('keypress', event => {
    if(event.which===13 || event.keyCode===13){
      objectToUse[event.target.dataset.familyid] = event.target.innerText
      saveToStorage()
      event.target.blur()
    }

  });
   });

[...document.querySelectorAll('.person-name')].forEach(function(item) {
  item.addEventListener('blur', event => {
    objectToUse[event.target.dataset.familyid] = event.target.innerText
    saveToStorage()
  });
   });

   window.oncontextmenu = (e) => {
    e.preventDefault()
    removeActive()
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
        comparer()
        counter++
    }

    else {
      removeActive()
    }
}