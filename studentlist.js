"use strict";

window.addEventListener("DOMContentLoaded", init);

// GLOBALS
let studTarget = document.querySelector("#student_template");
let studOutput = document.querySelector("#stud_list_wrap");
let allStud;
let bloodList;
let houseData = "alle";
let filteredList;
let modal;
let expelledStudentsArr = [];

// Student Prototype
const studentPrototype = {
  fullname: "-full name-",
  house: "-student house-",
  firstname() {
    const letter = this.fullname.split(" ");
    return letter[0];
  },
  midname() {
    const letter = this.fullname.split(" ");
    return letter[1];
  },
  lastname() {
    const letter = this.fullname.split(" ");
    return letter[letter.length - 1];
  },
  image() {
    const letter = this.fullname.split(" ");
    const firstNameLow = letter[0].toLocaleLowerCase();
    const firstNameFirstLetter = Array.from(firstNameLow)[0];
    const LasttNameLow = letter[letter.length - 1].toLocaleLowerCase();

    return `${LasttNameLow}_${firstNameFirstLetter}`;
    console.log(`${LasttNameLow}_${firstNameFirstLetter}`);
  },
  setData(stud) {
    this.fullname = stud.fullname;
    this.house = stud.house;

    // const letter = this.fullname.split(" ");

    this.firstname = this.firstname();
    this.midname = this.midname();
    this.lastname = this.lastname();
    this.image = this.image();
    this.blood = tjekBloodStatus(this.lastname);
  }
};

// Empty Array for new data
let newStudArray = [];

function init() {
  console.log("init");

  // TODO: Load JSON, create clones, build list, add event listeners, show modal, find images, and other stuff ...
  getJSON();
  // FILTER BUTTONS
  clickFilterByHouse();
}
// Fetches Json data
async function getJSON() {
  console.log("getJSON");

  let jsonObject = await fetch(
    "https://petlatkea.dk/2019/hogwarts/students.json"
  );

  allStud = await jsonObject.json();

  let bloodStatusObjekt = await fetch(
    "https://petlatkea.dk/2019/hogwarts/families.json"
  );

  bloodList = await bloodStatusObjekt.json();

  // NOTE: Maybe also call sortByFirst the first time ... Investigate!
  constructNewArrayFromJson();
  filterList(houseData);
  console.log(bloodList.half);
}

function constructNewArrayFromJson() {
  console.log("constructNewArrayFromJson");

  allStud.forEach(stud => {
    let studProt = Object.create(studentPrototype);
    studProt.setData(stud);
    newStudArray.push(studProt);
  });
}

//TO BE CALLED IN GET JSON
function clickFilterByHouse() {
  // EVENTLISTENER
  document.querySelectorAll(".filter_knap").forEach(knap => {
    knap.addEventListener("click", function() {
      //  Gets Data-Atrribute from Filter button.
      houseData = this.getAttribute("data-house");

      filterList(houseData);
      // console.log(houseData + "is showing");
      // console.log(newStudArray);
      // console.log(listShown);
    });
  });
}

function filterList(houseData) {
  filteredList = filterByHouse(houseData);

  clickSortBy();

  displayList(filteredList);
}

// FILTER
function filterByHouse(house) {
  // console.log("filterByHouse");
  function filterHouse(element) {
    if (house === "alle") {
      return true;
    } else {
      return element.house === house;
    }
  }
  return newStudArray.filter(filterHouse);
}

// SORTING
function clickSortBy() {
  document.querySelectorAll(".sort_knap").forEach(knap => {
    knap.addEventListener("click", function() {
      //  Gets Data-Atrribute from Filter button.
      let sortData = this.getAttribute("data-sort");
      // FUNCTION THAT CLEARS INNTER HTML OF OUTPUT
      if (sortData === "firstname") {
        newStudArray.sort(sortListByFirstName);
        filterList(houseData);
      }
      if (sortData === "lastname") {
        console.log(sortData);
        newStudArray.sort(sortListByLAstName);
        filterList(houseData);
      }
      if (sortData === "house") {
        console.log(sortData);
        newStudArray.sort(sortListByHouse);
        filterList("alle");
      }
    });
  });
}

function sortListByFirstName(a, b) {
  if (a.firstname < b.firstname) {
    return -1;
  } else {
    return 1;
  }
}

function sortListByLAstName(a, b) {
  if (a.lastname < b.lastname) {
    return -1;
  } else {
    return 1;
  }
}

function sortListByHouse(a, b) {
  if (a.house < b.house) {
    return -1;
  } else {
    return 1;
  }
}

// DISPLAY LIST
function displayList(students) {
  console.log("displayList");
  // FUNCTION THAT CLEARS INNTER HTML OF OUTPUT
  clearList();

  //Creates table header before students are put in
  creatTableHeader();

  // Create af table element for each student
  students.forEach(stud => {
    // CLONES TEMPLATE FROM HTML
    let clone = studTarget.cloneNode(true).content;

    let imagePath = "images/" + stud.image + ".png";
    clone.querySelector(".stud_image").src = imagePath;

    clone.querySelector(".first_name").textContent = stud.firstname;
    clone.querySelector(".last_name").textContent = stud.lastname;
    clone.querySelector(".house").textContent = stud.house;
    clone.querySelector(".blood_status").textContent = stud.blood;
    clone.querySelector(".expel_but").dataset.id = stud.firstname;
    //SET HOUSE COCLOR
    clone
      .querySelector(".stud_wrap")
      .classList.add(`${stud.house.toLocaleLowerCase()}`);

    // calls makemodal.
    clone.querySelector(".stud_wrap").addEventListener("click", event => {
      let buttData = event.target.dataset.id;
      if (buttData === stud.firstname) {
        removeStudent(event);
      } else {
        makeModal(stud);
      }
    });

    studOutput.appendChild(clone);

    // console.dir(document.querySelectorAll(".stud_image"));
  });
}
function clearList() {
  console.log("Clear LIST");
  studOutput.innerHTML = " ";
}

// MODAL -------------------------------------------
function makeModal(stud) {
  modal = document.querySelector("#modal_wrapper");
  showModal(modal, stud);

  console.log(stud.house);

  let imagePath = "images/" + stud.image + ".png";
  modal.querySelector(".modal_img").src = imagePath;

  modal.querySelector(".modal_fullname").textContent = stud.fullname;
  modal.querySelector(".modal_house").textContent = stud.house;
  modal.querySelector(".modal_blood").textContent = stud.blood;

  modal.querySelector(".expel_but").dataset.id = stud.firstname;

  //SET HOUSE COCLOR

  document.querySelector(".modal_close").addEventListener("click", () => {
    hideModal(modal);
  });
  modal.querySelector(".expel_but").addEventListener("click", event => {
    console.log(event.target);
    hideModal(modal);
    removeStudent(event);
  });
}

function showModal(modal, stud) {
  modal.style.display = "block";

  //DRYYYYYYYYY!!!!!
  if (stud.house === "Gryffindor") {
    modal.querySelector(".modal_con").classList.add("gryffindor");
  }

  if (stud.house === "Hufflepuff") {
    modal.querySelector(".modal_con").classList.add("hufflepuff");
  }

  if (stud.house === "Ravenclaw") {
    modal.querySelector(".modal_con").classList.add("ravenclaw");
  }

  if (stud.house === "Slytherin") {
    modal.querySelector(".modal_con").classList.add("slytherin");
  }
  //DRYYYY!Y!!Y!Y!Y
}

function hideModal(modal) {
  modal.style.display = "none";

  modal.querySelector(".modal_con").classList.remove("hufflepuff");
  modal.querySelector(".modal_con").classList.remove("ravenclaw");
  modal.querySelector(".modal_con").classList.remove("gryffindor");
  modal.querySelector(".modal_con").classList.remove("slytherin");
}
// MODAL END ----------------------------------------

// CREATES TABLE HEADER
function creatTableHeader() {
  let tr = document.createElement("tr");
  tr.id = "tableHeader";
  document.querySelector("#stud_list_wrap").appendChild(tr);

  // FOR LOOP CREATES TABLE HEADER
  let tableHeaerArr = [
    "Firstname",
    "Lastname",
    "House",
    "Image",
    "Blood Status",
    "Expel"
  ];
  for (let i = 0; i < tableHeaerArr.length; i++) {
    let th = document.createElement("th");
    th.textContent = tableHeaerArr[i];
    document.querySelector("#tableHeader").appendChild(th);
  }
}

function removeStudent(event) {
  console.log(event.target.dataset.id);
  let slectedStudent = event.target.dataset.id;

  let selectedStudentIndex = findIndexByStudName(slectedStudent);
  let removeStudObjekt = newStudArray.splice(selectedStudentIndex, 1);
  filterList(houseData);
  expelledStudentsArr.push(...removeStudObjekt);

  displayExpelled(expelledStudentsArr);
  console.table(expelledStudentsArr);
  console.table(newStudArray);
}

// FIND STUDENT INDEX BY NAME
function findIndexByStudName(name) {
  return newStudArray.findIndex(stud => stud.firstname === name);
}

// Tjek Blood Status

function tjekBloodStatus(lastname) {
  let halfList = bloodList.half;
  let pureList = bloodList.pure;

  let half = false;
  let pure = false;

  bloodTjek();
  function bloodTjek() {
    for (let i = 0; i < halfList.length; i++) {
      console.log(lastname);
      if (lastname === halfList[i]) {
        half = true;
      }
    }
    for (let i = 0; i < pureList.length; i++) {
      if (lastname === pureList[i]) {
        pure = true;
      }
    }
  }

  if (pure == true && half == true) {
    return "Mudd Blood";
  } else if (pure == false && half == true) {
    return "Mudd Blood";
  } else if (pure == true && half == false) {
    return "Pure";
  } else if (pure == false && half == false) {
    return "Muggle";
  }
}

//DISPLAY Expledded STUDENT LIST
function displayExpelled(expelStudList) {
  console.log(expelStudList);
  document.querySelector(".expel_stud_con").textContent = "";
  expelStudList.forEach(exStud => {
    let li = document.createElement("li");
    li.textContent = exStud.fullname;
    document.querySelector(".expel_stud_con").appendChild(li);
  });
}
