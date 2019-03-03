"use strict";

window.addEventListener("DOMContentLoaded", init);

// GLOBALS
let studTarget = document.querySelector("#student_template");
let studOutput = document.querySelector("#stud_list_wrap");
// 1.Json OBJ
let allStud;
// 2. Json obj
let bloodList;
let houseData = "alle";
let filteredList;
let modal;
//Empty Array for expelled students
let expelledStudentsArr = [];

//Empty Array for students in the inquisitorial squad
let inquisSquad = [];

// Empty Array for new data
let newStudArray = [];
const myObject = [
  {
    fullname: "Magnus Vagn Jensen",
    house: "Hufflepuff"
  }
];

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
    const letter = this.fullname.split(/[ -]/);
    const firstNameLow = letter[0].toLocaleLowerCase();
    const firstNameFirstLetter = Array.from(firstNameLow)[0];
    const LasttNameLow = letter[letter.length - 1].toLocaleLowerCase();

    return `${LasttNameLow}_${firstNameFirstLetter}`;
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

//INIT
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

  allStud.push(...myObject);

  let bloodStatusObjekt = await fetch(
    "https://petlatkea.dk/2019/hogwarts/families.json"
  );

  bloodList = await bloodStatusObjekt.json();

  // NOTE: Maybe also call sortByFirst the first time ... Investigate!
  constructNewArrayFromJson();
  filterList(houseData);
  console.log(bloodList.half);
}

// MAKE A NewStudArray
function constructNewArrayFromJson() {
  console.log("constructNewArrayFromJson");

  allStud.forEach(stud => {
    let studProt = Object.create(studentPrototype);
    studProt.setData(stud);
    newStudArray.push(studProt);
  });
}

//FILTER -------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

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
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//SORTING ------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
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
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//DISPLAY LIST -------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
function displayList(students) {
  console.log("displayList");
  // FUNCTION THAT CLEARS INNTER HTML OF OUTPUT
  clearList();
  // COUNTER
  countingStudents(students);
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
      console.log(buttData + " " + myObject.fi);

      if (buttData === "Magnus") {
        alert("HAHHAHAHAH");
      } else if (buttData === stud.firstname) {
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
//--------------------------------------------------------------------------------------------------------
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
//--------------------------------------------------------------------------------------------------------

//MODAL --------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
function makeModal(stud) {
  modal = document.querySelector("#modal_wrapper");

  let imagePath = "images/" + stud.image + ".png";
  modal.querySelector(".modal_img").src = imagePath;

  modal.querySelector(".modal_fullname").textContent = stud.fullname;
  modal.querySelector(".modal_house").textContent = stud.house;
  modal.querySelector(".modal_blood").textContent = stud.blood;
  modal.querySelector(".house_crest").style.backgroundImage = `url(images/${
    stud.house
  }.png)`;

  //SETS DATA ID
  modal.querySelector(".inquis_but").dataset.id = "";
  modal.querySelector(".inquis_but").dataset.id = stud.firstname;
  modal.querySelector(".inquis_but").dataset.blood = stud.blood;
  modal.querySelector(".inquis_but").dataset.house = stud.house;

  document.querySelector(".modal_close").addEventListener("click", () => {
    hideModal(modal);
  });

  // SET EVENT LISTENR FOR INQUIS BUTTIEN
  modal
    .querySelector(".inquis_but")
    .addEventListener("click", tjekCriteriaForInqSquad);

  showModal(modal, stud);
}
function showModal(modal, stud) {
  modal.style.display = "block";

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
}
function hideModal(modal) {
  modal.style.display = "none";

  modal.querySelector(".modal_con").classList.remove("hufflepuff");
  modal.querySelector(".modal_con").classList.remove("ravenclaw");
  modal.querySelector(".modal_con").classList.remove("gryffindor");
  modal.querySelector(".modal_con").classList.remove("slytherin");
}
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//REMOVE STUDENT------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

function removeStudent(event) {
  // console.dir(event.target.dataset.id + " " + "was expelled");
  let e_but = event.target.getAttribute("class");

  if (e_but === "expel_but") {
    let slectedStudent = event.target.dataset.id;
    console.log(slectedStudent + " " + "WAS CLICKED");
    let selectedStudentIndex = findIndexByStudName(slectedStudent);
    console.log(selectedStudentIndex + " " + "?");

    let removeStudObjekt = newStudArray.splice(selectedStudentIndex, 1);
    expelledStudentsArr.push(...removeStudObjekt);
    displayExpelled(expelledStudentsArr);
    filterList(houseData);
  }
}
//--------------------------------------------------------------------------------------------------------

// FIND STUDENT INDEX BY NAME
function findIndexByStudName(name) {
  console.log(newStudArray);
  return newStudArray.findIndex(stud => stud.firstname === name);
}
//--------------------------------------------------------------------------------------------------------

// Tjek Blood Status
//--------------------------------------------------------------------------------------------------------

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
    return "Half Blood";
  } else if (pure == false && half == true) {
    return "Half Blood";
  } else if (pure == true && half == false) {
    return "Pure Blood";
  } else if (pure == false && half == false) {
    return "Muggle";
  }
}
//--------------------------------------------------------------------------------------------------------

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
//--------------------------------------------------------------------------------------------------------

function countingStudents() {
  //VARIABLE FOR NUMBER OF STUD IN EACH HOUSE
  let G_count = 0;
  let H_count = 0;
  let S_count = 0;
  let R_count = 0;
  let total = allStud.length - expelledStudentsArr.length;

  // COUNTS ++ FOR EACH HOUSE
  allStud.forEach(stud => {
    if (stud.house === "Gryffindor") {
      G_count++;
    }
    if (stud.house === "Hufflepuff") {
      H_count++;
    }
    if (stud.house === "Slytherin") {
      S_count++;
    }
    if (stud.house === "Ravenclaw") {
      R_count++;
    }
  });
  // COUNTS -- FOR EACH GOUSE IN EXPELLED
  expelledStudentsArr.forEach(stud => {
    if (stud.house === "Gryffindor") {
      G_count--;
    }
    if (stud.house === "Hufflepuff") {
      H_count--;
    }
    if (stud.house === "Slytherin") {
      S_count--;
    }
    if (stud.house === "Ravenclaw") {
      R_count--;
    }
  });

  // DUSPLAYS NUMBERS IN "LIST COUNTER"
  document.querySelector(".total").textContent = total;
  document.querySelector(".gryf_count").textContent = G_count;
  document.querySelector(".huff_count").textContent = H_count;
  document.querySelector(".slyth_count").textContent = S_count;
  document.querySelector(".raven_count").textContent = R_count;
  document.querySelector(".expelled_count").textContent =
    expelledStudentsArr.length;

  console.log(total);
}

// INQUISITOTIAL
// --------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------

function tjekCriteriaForInqSquad() {
  let blood = this.dataset.blood;
  let house = this.dataset.house;
  let clicked = this.dataset.clicked;
  let id = this.dataset.id;

  if (blood == "Pure Blood") {
    addToInquisSquad(this);
  } else if (house == "Slytherin") {
    addToInquisSquad(this);
  } else {
    alert(
      "Only studens who are pure-blood or from Slytherin house can join the squad"
    );
  }

  function addToInquisSquad(e) {
    let listEmpty = inquisSquad[0];

    let tjek = false;
    if (inquisSquad.length > 0) {
      inquisSquad.forEach(member => {
        if (member.firstname === e.dataset.id) {
          tjek = true;
        }
      });
    }

    if (listEmpty === undefined || tjek == false) {
      let slectedStudent = e.dataset.id;
      let selectedStudentIndex = findIndexByStudName(slectedStudent);
      let selectedStudentData = newStudArray[selectedStudentIndex];
      inquisSquad.push(selectedStudentData);
      displayInquisSquad(inquisSquad);
    } else if (tjek == true) {
      alert("student is alreader a member");
    }
  }
}

function displayInquisSquad(list) {
  document.querySelector(".inquis_stud_con").textContent = "";
  list.forEach(inqStud => {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.dataset.name = inqStud.firstname;

    li.textContent = inqStud.fullname;
    button.textContent = "remove from squad";
    li.appendChild(button);
    document.querySelector(".inquis_stud_con").appendChild(li);
  });
  removeFromSquadClick();

  console.table(inquisSquad);
}

function removeFromSquadClick() {
  document.querySelectorAll(".inquis_stud_con li button").forEach(knap => {
    knap.addEventListener("click", removeFromSquad);
  });
}

function removeFromSquad() {
  console.dir(this.dataset.name);
  let slectedStudent = this.dataset.name;
  let selectedStudentIndex = findIndexOfInqSquad(slectedStudent);
  // console.log(inquisSquad);
  // console.log(this.firstname);
  // console.log(selectedStudentIndex);
  inquisSquad.splice(selectedStudentIndex, 1);
  displayInquisSquad(inquisSquad);
  // console.table(inquisSquad);
}

// FIND STUDENT OF SQUAD INDEX BY NAME
function findIndexOfInqSquad(name) {
  return inquisSquad.findIndex(stud => stud.firstname === name);
}
//--------------------------------------------------------------------------------------------------------
