"use strict";

window.addEventListener("DOMContentLoaded", init);

// GLOBALS
let studTarget = document.querySelector("#student_template");
let studOutput = document.querySelector("#stud_list_wrap");
let allStud;
let houseData = "alle";
let filteredList;
let modal;

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

  //click sort by
}
// Fetches Json data
async function getJSON() {
  console.log("getJSON");

  let jsonObject = await fetch(
    "https://petlatkea.dk/2019/hogwarts/students.json"
  );

  allStud = await jsonObject.json();

  // NOTE: Maybe also call sortByFirst the first time ... Investigate!
  constructNewArrayFromJson();
  filterList(houseData);
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

function clickSortBy() {
  document.querySelectorAll(".sort_knap").forEach(knap => {
    knap.addEventListener("click", function() {
      //  Gets Data-Atrribute from Filter button.
      let sortData = this.getAttribute("data-sort");
      // FUNCTION THAT CLEARS INNTER HTML OF OUTPUT
      if (sortData === "firstname") {
        let firtNameSort = filteredList.sort(sortListByFirstName);
        displayList(firtNameSort);
      }
      if (sortData === "lastname") {
        console.log(sortData);
        let LastNameSort = filteredList.sort(sortListByLAstName);
        displayList(LastNameSort);
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

function sortListByLAstName(a, b) {
  if (a.lastname < b.lastname) {
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

    //SET HOUSE COCLOR
    clone
      .querySelector(".stud_wrap")
      .classList.add(`${stud.house.toLocaleLowerCase()}`);

    // calls makemodal.
    clone.querySelector(".stud_wrap").addEventListener("click", () => {
      makeModal(stud);
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

  //SET HOUSE COCLOR

  document.querySelector(".modal_close").addEventListener("click", () => {
    hideModal(modal);
  });
}

function showModal(modal, stud) {
  modal.style.display = "block";

  //DRYYYYYYYYY!!!!!
  if (stud.house === "Gryffindor") {
    modal.querySelector(".modal_con").classList.add("gryffindor");
    modal.querySelector(".modal_con").classList.remove("hufflepuff");
    modal.querySelector(".modal_con").classList.remove("ravenclaw");
    modal.querySelector(".modal_con").classList.remove("slytherin");
  }

  if (stud.house === "Hufflepuff") {
    modal.querySelector(".modal_con").classList.add("hufflepuff");
    modal.querySelector(".modal_con").classList.remove("ravenclaw");
    modal.querySelector(".modal_con").classList.remove("slytherin");
    modal.querySelector(".modal_con").classList.remove("gryffindor");
  }

  if (stud.house === "Ravenclaw") {
    modal.querySelector(".modal_con").classList.add("ravenclaw");
    modal.querySelector(".modal_con").classList.remove("hufflepuff");
    modal.querySelector(".modal_con").classList.remove("slytherin");
    modal.querySelector(".modal_con").classList.remove("gryffindor");
  }

  if (stud.house === "Slytherin") {
    modal.querySelector(".modal_con").classList.add("slytherin");
    modal.querySelector(".modal_con").classList.remove("hufflepuff");
    modal.querySelector(".modal_con").classList.remove("ravenclaw");
    modal.querySelector(".modal_con").classList.remove("gryffindor");
  }
  //DRYYYY!Y!!Y!Y!Y
}

function hideModal(modal) {
  modal.style.display = "none";
}
// MODAL END ----------------------------------------

// CREATES TABLE HEADER
function creatTableHeader() {
  let tr = document.createElement("tr");
  tr.id = "tableHeader";
  document.querySelector("#stud_list_wrap").appendChild(tr);

  // FOR LOOP CREATES TABLE HEADER
  let tableHeaerArr = ["Firstname", "Lastname", "House", "Image"];
  for (let i = 0; i < 4; i++) {
    let th = document.createElement("th");
    th.textContent = tableHeaerArr[i];
    document.querySelector("#tableHeader").appendChild(th);
  }
}
