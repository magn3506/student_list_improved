"use strict";

window.addEventListener("DOMContentLoaded", init);

// GLOBALS -------------------------------------------------------------------
// ---------------------------------------------------------------------------
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

// OBJEKT WITH DITAILS OF MY SELF. ADDED TO ALLSTUDD IN GETJSON
const myObject = [
  {
    fullname: "Magnus Vagn Jensen",
    house: "Hufflepuff"
  }
];

// Student Prototype.
const studentPrototype = {
  fullname: "-full name-",
  house: "-student house-",
  firstname() {
    // SETS THE DATA FOR FIRST NAME
    const letter = this.fullname.split(" ");
    return letter[0];
  },
  midname() {
    //SETS THE DATA FOR MIDNAME
    const letter = this.fullname.split(" ");
    return letter[1];
  },
  lastname() {
    //SETS THE DATA FOR LASTNAME
    const letter = this.fullname.split(" ");
    return letter[letter.length - 1];
  },
  image() {
    //SETS THE DATA FOR IMAGE PATH. lastname in lower case "_" + first letter of firstname in lowercase fx myself jensen_m
    const letter = this.fullname.split(/[ -]/);
    const firstNameLow = letter[0].toLocaleLowerCase();
    const firstNameFirstLetter = Array.from(firstNameLow)[0];
    const LasttNameLow = letter[letter.length - 1].toLocaleLowerCase();

    return `${LasttNameLow}_${firstNameFirstLetter}`;
  },
  setData(stud) {
    //SETS THE DATA EQUAL TO OBJET PROBERTY NAMES
    this.fullname = stud.fullname;
    this.house = stud.house;
    this.firstname = this.firstname();
    this.midname = this.midname();
    this.lastname = this.lastname();
    this.image = this.image();
    this.blood = tjekBloodStatus(this.lastname);
  }
};

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

//INIT FUNCTION
function init() {
  //LOADS JSON FILES SEE getJSON
  getJSON();

  // FILTER BUTTONS
  clickFilterByHouse();
}
// Fetches Json data
async function getJSON() {
  let jsonObject = await fetch(
    "https://petlatkea.dk/2019/hogwarts/students.json"
  );
  //sets allstud array = json object
  allStud = await jsonObject.json();
  //pushes myown object with my own student name and house data to allstud array
  allStud.push(...myObject);

  // Gets second json data
  let bloodStatusObjekt = await fetch(
    "https://petlatkea.dk/2019/hogwarts/families.json"
  );
  //set bloodList array = data with known families of wizards
  bloodList = await bloodStatusObjekt.json();

  //CALLS CUNSTRUCT NEW ARRAY
  constructNewArrayFromJson();
  //CALLS FILTER LIST WITH HOUSE DATA
  filterList(houseData);
}

// CONSTRUCTS A NEW OBJECT FROM EACH OBJECT IN ALLSTUD ARRAY, THORUGH STUDENTPROTOTYPE
function constructNewArrayFromJson() {
  //FOR EACH STUDENT IN ALLSTUD, CREATE AN OBJECT WIDTH STUDENT PROTOTYPE DATA SETS, AND PUSH IT TO NEWSTUDARRAY
  allStud.forEach(stud => {
    let studProt = Object.create(studentPrototype);
    studProt.setData(stud);
    newStudArray.push(studProt);
  });
}

//FILTER -------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//FILLTER BUTTONS EVENTLISTENERS
function clickFilterByHouse() {
  // EVENTLISTENER FOR EACH FILTER BUTTON
  document.querySelectorAll(".filter_knap").forEach(knap => {
    knap.addEventListener("click", function() {
      //  Gets Data-Atrribute from Filter button.
      houseData = this.getAttribute("data-house");
      //CALLS FILTER LIST WITH HOUSEDATA. HOUSE DATA IS =  "alle"  AS DEFAULT
      filterList(houseData);
    });
  });
}

//FILTER LIST
function filterList(houseData) {
  //SEND CHOSEN OR DEFAULT HOUSE DATA THOUGH FILTERBYHOUSE FUNCTION
  filteredList = filterByHouse(houseData);

  //CALLS FUNCTION WIDTH EVENTLISTERNES FOR SORTING BUTTONS
  clickSortBy();

  //CALLS DISPLAY LIST WIDTH THE FILLTERED LIST
  displayList(filteredList);
}

//FITLERES LIST BY HOUSE DATA.  DOBBELT FUNCTION
// IF HOUSE DATA of an element mathces the housedata it it returns a list with theese object to the newstudarray,
function filterByHouse(house) {
  function filterHouse(element) {
    if (house === "alle") {
      return true;
    } else {
      return element.house === house;
    }
  }
  //RETURNS NEWSTUDARRAY FILTERED THOUGH FILTERHOUSE
  return newStudArray.filter(filterHouse);
}
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//SORTING ------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
function clickSortBy() {
  //ADDS AN EVENTLISTENER FOR ALL SORT BUTTONS
  document.querySelectorAll(".sort_knap").forEach(knap => {
    knap.addEventListener("click", function() {
      //  Gets Data-Atrribute from Filter button.
      let sortData = this.getAttribute("data-sort");

      //IF STATMENT THAT TJEKS WICH BUTTON IS PRESSES AND
      //CALLS A SORTING FUNCTION DEPENDING ON EITHER FIRSTNAME, LASTNAME OR HOUSE

      if (sortData === "firstname") {
        newStudArray.sort(sortListByFirstName);
        filterList(houseData);
      }
      if (sortData === "lastname") {
        newStudArray.sort(sortListByLAstName);
        filterList(houseData);
      }
      if (sortData === "house") {
        newStudArray.sort(sortListByHouse);
        filterList("alle");
      }
    });
  });
}

// ---------------------------------------- SORING FUNCTION
//SORT LIST BY FIRSTNAME, APLHABETICALLY
function sortListByFirstName(a, b) {
  if (a.firstname < b.firstname) {
    return -1;
  } else {
    return 1;
  }
}
//SORT LIST BY FIRSTNAME, APLHABETICALLY
function sortListByLAstName(a, b) {
  if (a.lastname < b.lastname) {
    return -1;
  } else {
    return 1;
  }
}
//SORT LIST BY FIRSTNAME, APLHABETICALLY
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
// FUNCTION RECIEVES A LIST AND DISPLAYS IT IN THE TABLE
function displayList(students) {
  // FUNCTION THAT CLEARS INNTER HTML OF OUTPUT
  clearList();
  // COUNTER SETS NUMBER OF STUDENT, IN TOTAL, EACH HOUSE, AND EXPELLED
  countingStudents(students);
  //Creates table header before students are put in
  creatTableHeader();

  // Create af table element for each student
  students.forEach(stud => {
    // CLONES TEMPLATE FROM HTML
    let clone = studTarget.cloneNode(true).content;

    //SETS IMAGE DATA AND PATH
    let imagePath = "images/" + stud.image + ".png";
    clone.querySelector(".stud_image").src = imagePath;

    //SETS CONTENT DATA IN EACH STUDENT ELEMT
    clone.querySelector(".first_name").textContent = stud.firstname;
    clone.querySelector(".last_name").textContent = stud.lastname;
    clone.querySelector(".house").textContent = stud.house;
    clone.querySelector(".blood_status").textContent = stud.blood;
    clone.querySelector(".expel_but").dataset.id = stud.firstname;

    //SET HOUSE COCLOR BY ADDING A CLASS FROM CSS THAT IS EQUAL TO STUD HOUSE DATA
    clone
      .querySelector(".stud_wrap")
      .classList.add(`${stud.house.toLocaleLowerCase()}`);

    // ADDS EVENTLISTENER ON EACH STUDENT WRAPPER/TD.
    clone.querySelector(".stud_wrap").addEventListener("click", event => {
      let buttData = event.target.dataset.id;
      //GETS DATASET OF ID

      if (buttData === "Magnus") {
        // STUDENT NAME MAGNUS IS TRIED EXPELLED RUN HACKING CODE
        hacking();
      } else if (buttData === stud.firstname) {
        // IF ANYONE ELSE IS CLICKED GO TO REMOVE STUDENT
        removeStudent(event);
      } else {
        //IF NO EXPEL BUTTON IS CLICKED GO TO MAKE MODAL
        makeModal(stud);
      }
    });

    //PRINTS AND ELEMNT AFTER ALL DATA FOR THAT IS SET
    studOutput.appendChild(clone);
  });
}

//CLEARS LIST OF OUTPUT. ALL STUDENT BEFORE PRINTING AGAIN
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
  //sets image path
  let imagePath = "images/" + stud.image + ".png";
  modal.querySelector(".modal_img").src = imagePath;

  //sets data in modal for chosen student
  modal.querySelector(".modal_fullname").textContent = stud.fullname;
  modal.querySelector(".modal_house").textContent = stud.house;
  modal.querySelector(".modal_blood").textContent = stud.blood;
  modal.querySelector(".house_crest").style.backgroundImage = `url(images/${
    stud.house
  }.png)`;

  //SETS DATA ID ON ADD TOO INQUISITORIAL BUTTON IN MODAL
  modal.querySelector(".inquis_but").dataset.id = "";
  modal.querySelector(".inquis_but").dataset.id = stud.firstname;
  modal.querySelector(".inquis_but").dataset.blood = stud.blood;
  modal.querySelector(".inquis_but").dataset.house = stud.house;

  //EVENT LSITERNER IF CLICKED CLOSES MODAL WINDOW
  document.querySelector(".modal_close").addEventListener("click", () => {
    hideModal(modal);
  });

  // SET EVENT LISTENR FOR INQUIS BUTTIEN
  modal
    .querySelector(".inquis_but")
    .addEventListener("click", tjekCriteriaForInqSquad);

  //CALLS SHOW MODAL
  showModal(modal, stud);
}

// SHOW MODAL WINDOW
function showModal(modal, stud) {
  //DISLAY BLOCK
  modal.style.display = "block";
  //ADDS CSS CALLS WIDTH COLOR STYLE FOR EACH HOUSE DEPENTING OF WHAT STUDENT IS CHOSEN
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

//HIDES MODAL WINDOW
function hideModal(modal) {
  //DISPLAY NONE
  modal.style.display = "none";
  //REMOVED COLOR CSS CLASSES FOR EACH HOUSE
  modal.querySelector(".modal_con").classList.remove("hufflepuff");
  modal.querySelector(".modal_con").classList.remove("ravenclaw");
  modal.querySelector(".modal_con").classList.remove("gryffindor");
  modal.querySelector(".modal_con").classList.remove("slytherin");
}
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//REMOVE STUDENT------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

// 1 WHEN EXPEL STUDENT BUTTON IS CLICKED IT TJEKES IF THE RIGHT BUTTON WAS CLIKED
// 2 GET THE NAME OF THE STUDENT
// 3 FIND THE INDEX NUMBER OF THE CHOSEN STUDENTS NAME THOUGH findIndexByName FUNCTION
// 4 removes that student in newstudarray
// 5 displays expelled students
// calls filter list still with chosen house data, but newstud array has changes
function removeStudent(event) {
  // console.dir(event.target.dataset.id + " " + "was expelled");
  let e_but = event.target.getAttribute("class");
  if (e_but === "expel_but") {
    let slectedStudent = event.target.dataset.id;
    let selectedStudentIndex = findIndexByStudName(slectedStudent);
    let removeStudObjekt = newStudArray.splice(selectedStudentIndex, 1);
    expelledStudentsArr.push(...removeStudObjekt);
    displayExpelled(expelledStudentsArr);
    filterList(houseData);
  }
}
//--------------------------------------------------------------------------------------------------------

// FIND STUDENT INDEX BY NAME
// returns index number of a given name in newstudarray
function findIndexByStudName(name) {
  console.log(newStudArray);
  return newStudArray.findIndex(stud => stud.firstname === name);
}
//--------------------------------------------------------------------------------------------------------

// Tjek Blood Status recieves a last name
//--------------------------------------------------------------------------------------------------------

function tjekBloodStatus(lastname) {
  // MAKES 2 LIST FORM BLOODLIST / KNOWFAMILIES OF WIZARDS
  // 1. LIST WIDTH HALFBLOOD FALIMIE, 2. LIST WIDTH PURE BLOOD FAMILIE
  let halfList = bloodList.half;
  let pureList = bloodList.pure;

  //SCOOP GLOBAL VARIABLE FOR THIS FUNCTION
  //SETS TO BOOLEAS FOR TRUE OR FALSE, THESE ARE COMPARE IN THE BOTTUM OF THE FUNCTION
  let half = false;
  let pure = false;

  //BloodTjek
  // GOES TROUGH EACH LIST AND TJEK IF THE LAST NAME IS EQUAL TO THE LIST.
  // IF IT IS THE FUNCTIONR ETURNS TRUE.
  // 1 LAST NAME KAN BE IN 1 OF THE TWO LIST OG BOTH
  bloodTjek();
  function bloodTjek() {
    for (let i = 0; i < halfList.length; i++) {
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

  //RETURNS THE BLOOD STATUS
  // 1 IF LASTNAME IS IN BOTH LIST = THE STUDENT IS HALFBLOOD
  // 2 IF LASTNAME IS NOT IN THE PURE LIST, BUT IS IN HALF = STUDENT IS HALFBLOOD
  // 3 IF LASTNAME IS IN THE PURE LIST, BUT NOT THE HALF, = STUDENT IS PUREBLOOD
  // 4 IF LAST NAME IS NOT IN ANY OF THE LIST THE STUDENT = MUGGLE
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
  //CLEARS THE LIST BEFOR ADDING NEW ELEMENTS
  document.querySelector(".expel_stud_con").textContent = "";
  // creastes a li element for each student
  expelStudList.forEach(exStud => {
    let li = document.createElement("li");
    li.textContent = exStud.fullname;
    document.querySelector(".expel_stud_con").appendChild(li);
  });
}
//--------------------------------------------------------------------------------------------------------

//COUNTING STUDENTS --------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//FUNCTION THAT COUNTS THE STUDENT AND SETS THE DATA IN TABLE IN HTML
function countingStudents() {
  //VARIABLE FOR NUMBER OF STUD IN EACH HOUSE
  let G_count = 0;
  let H_count = 0;
  let S_count = 0;
  let R_count = 0;
  let total = allStud.length - expelledStudentsArr.length;

  // plusses 1 for each student in each house COUNTS ++ FOR EACH HOUSE
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
  //when studnts are expeled the list subtracts the student from the couter
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

  // DUSPLAYS NUMBERS IN "LIST COUNTER". in HTML
  document.querySelector(".total").textContent = total;
  document.querySelector(".gryf_count").textContent = G_count;
  document.querySelector(".huff_count").textContent = H_count;
  document.querySelector(".slyth_count").textContent = S_count;
  document.querySelector(".raven_count").textContent = R_count;
  document.querySelector(".expelled_count").textContent =
    expelledStudentsArr.length;
}

// INQUISITOTIAL
// --------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------
// FUNCTION THAT TJEKS THE CITERIA FOR EACH STUDENT
// ONLY STUDENTS WHO ARE IN SLYTHERIN HOUSE OR ARE PURE BLOOD CAN JOIN
// IF STUDENTS DONT MEET CRITERIA ALERT IS SHOWN
function tjekCriteriaForInqSquad() {
  let blood = this.dataset.blood;
  let house = this.dataset.house;

  if (blood == "Pure Blood") {
    addToInquisSquad(this);
  } else if (house == "Slytherin") {
    addToInquisSquad(this);
  } else {
    alert(
      "Only studens who are pure-blood or from Slytherin house can join the squad"
    );
  }

  // ADDS THE CHOSEN STUDEN TO THE LIST OF INQISITORIAL SQUAD
  //IF THE SUDENT HAS ALREADER BEEN CHOSEN IT ALERTS A MESSEGE SAYING SO AND DOES NOTHING
  function addToInquisSquad(e) {
    let listEmpty = inquisSquad[0];

    // TJEKS IF AN BJOECT HAS BEEN ADDED TO THE LIST
    let tjek = false;
    if (inquisSquad.length > 0) {
      inquisSquad.forEach(member => {
        if (member.firstname === e.dataset.id) {
          tjek = true;
        }
      });
    }

    //IF THE LIST IS EMBTY/UNDEFIENED ID ADDS THE CHOSEN STUDENT,
    //IF THE LIST HAS A STUDENT IT ADDS THAT STUDENT TO THE ARRAY,
    //AND GOES TO DISPLAY INQUISITORIAL SQUAD
    // SAME AS REMOVE STUDENT FUNCTION BUT IT ONLY COPYS THE DATA
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

// DISPLAY THE CHOSEN STUDENT IN THE LIST OF INQUISITORIAL
// Also adds a remove button for each student created
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
}
// SETS EVENTLSITENER FOR REMOVE BUTTON
// if clicked it goes to removeFromSquad function
function removeFromSquadClick() {
  document.querySelectorAll(".inquis_stud_con li button").forEach(knap => {
    knap.addEventListener("click", removeFromSquad);
  });
}
//REMOVES STUDENT FROM SQUAD
// USES FIND INDEX OF INQ SQUAD
// SIMILAR TO REMOVE STUDENT/ EXPEL STUDENT FUNCTION
function removeFromSquad() {
  let slectedStudent = this.dataset.name;
  let selectedStudentIndex = findIndexOfInqSquad(slectedStudent);
  inquisSquad.splice(selectedStudentIndex, 1);
  displayInquisSquad(inquisSquad);
}
// FIND STUDENT OF SQUAD INDEX BY NAME
// SIMILAR TO FIND INDEX OF LAST NAME
function findIndexOfInqSquad(name) {
  return inquisSquad.findIndex(stud => stud.firstname === name);
}
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//Hacking-------------------------------------------------------------------------------------------------
// if user tries to expel "Magnus" hell breakes loose
// HACKING STARTS
function hacking() {
  //SHOWS HACK MESSEGE
  showHackMessege();
  hackBloodStatus();
}

// HACKS BLOOD STATUS WHEN MYSELF IS ATEMPETT TO BE EXPELLED
// goes tough newstud array and sets blood status.
// if blood status is muggle or half-blood student is now set to be pureblood
// if student is purblood student is now set to be 50/50 either muggle or half-blood
// then calls filtered list with chosen house data but with new newstudarray
function hackBloodStatus() {
  for (let i = 0; i < newStudArray.length; i++) {
    if (
      newStudArray[i].blood === "Half Blood" ||
      newStudArray[i].blood === "Muggle"
    ) {
      newStudArray[i].blood = "Pure Blood";
    } else if (newStudArray[i].blood === "Pure Blood") {
      let random = Math.random();
      if (random < 0.5) {
        newStudArray[i].blood = "Muggle";
      }
      if (random > 0.5) {
        newStudArray[i].blood = "Half Blood";
      }
    }
  }
  filterList(houseData);
}

// HACK MESSEGE
// prints 100 elements into hacking screen through delayed function loop
// when counter reaches 100 loops the hacking screen is hidden, and alert messege is showing
function showHackMessege() {
  document.querySelector("#hacked_wrapper").style.display = "block";
  let c = 0;

  hackLoop();
  function hackLoop() {
    if (c < 100) {
      let div = document.createElement("div");
      div.textContent = "YOU ARE BEING HACKED";
      div.style.left = `${Math.random() * 1000}px`;
      div.style.top = `${Math.random() * 1000}px`;

      document.querySelector("#hacked_wrapper").appendChild(div);
      c++;

      setTimeout(hackLoop, 100);
    }
    if (c === 100) {
      hideHackMessege();
    }
  }
}
// HUDES HACKING SCREEN
function hideHackMessege() {
  document.querySelector("#hacked_wrapper").style.display = "none";
  alert("BLOOD TYPE HAS BEEN REVERSET");
}
//
