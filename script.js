// ASYNCHRONOUS PROGRAMMING AND DATA STRUCTURING
let rawText = "";
let rawArray = (rewardsArray = []);
let filteredData = new Map();
let catchingTasks = new Map();
let throwingTasks = new Map();
let battlingTasks = new Map();
let buddyFriendshipTasks = new Map();
let itemsTasks = new Map();
let miscellaneousTasks = new Map();
let quest = document.querySelector(".quest");

let getSeasonalQuestData = async () => {
  // Replace ./data.json with your JSON feed
  await fetch("./data/Season-Quests.txt")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      // Work with JSON data here
      rawText = data;
      buildArray(rawText);
    })
    .catch((err) => {
      console.log(err);
      // Do something for an error here
    });
};
getSeasonalQuestData();

let buildArray = (text) => {
  let questArray = [];
  rawArray = text.split(/\r?\n|\r|\n/g).slice(2);
  for (let item of rawArray) {
    questArray.push(item.split(" ").slice(1).join(" "));
  }
  buildGroups(questArray);
};

let buildGroups = (questData) => {
  let groupedData = new Map();
  let flag = false;
  for (let data of questData) {
    if (flag && data !== "") {
      groupedData.set([data], ...rewardsArray.slice(-1));
    }
    if (!flag) {
      rewardsArray.push(data.slice(0, -1));
      flag = true;
    }
    if (data === "") {
      flag = false;
    }
  }
  filterGroups(groupedData);
};

let filterGroups = (pairedData) => {
  for (let [key, value] of pairedData) {
    if (value.includes("Pinap") || value.includes("Balls")) continue;
    if (value.includes("Berries") && !value.includes("Golden")) continue;
    if (
      value === "200 Stardust" ||
      value === "500 Stardust" ||
      value === "1 Rare Candy"
    )
      continue;
    filteredData.set(key, value);
  }
  getAllItemTasks(filteredData);
};

let getAllItemTasks = (mixedData) => {
  let remnant = new Map();
  for (let [key, value] of mixedData) {
    if (
      value.includes("Rare") ||
      value.includes("Mega") ||
      value.includes("Golden") ||
      value.includes("Stardust")
    ) {
      itemsTasks.set(key, value);
    } else {
      remnant.set(key, value);
    }
  }
  //   console.log(itemsTasks)
  filteredData = remnant;
  getAllCatchingTasks(filteredData);
};

let getAllCatchingTasks = (mixedData) => {
  let remnant = new Map();
  for (let [key, value] of mixedData) {
    if (key[0].toLowerCase().includes("catch")) {
      catchingTasks.set(key, value);
    } else {
      remnant.set(key, value);
    }
  }
  //   console.log(catchingTasks)
  filteredData = remnant;
  getAllThrowingTasks(filteredData);
};

let getAllThrowingTasks = (mixedData) => {
  let remnant = new Map();
  for (let [key, value] of mixedData) {
    if (key[0].includes("Make")) {
      throwingTasks.set(key, value);
    } else {
      remnant.set(key, value);
    }
  }
  //   console.log(throwingTasks);
  filteredData = remnant;
  getAllBattlingTasks(filteredData);
};

let getAllBattlingTasks = (mixedData) => {
  let remnant = new Map();
  for (let [key, value] of mixedData) {
    if (key[0].includes("Win") || key[0].includes("Defeat")) {
      battlingTasks.set(key, value);
    } else {
      remnant.set(key, value);
    }
  }
  //   console.log(battlingTasks);
  filteredData = remnant;
  getAllBuddyFriendshipTasks(filteredData);
};

let getAllBuddyFriendshipTasks = (mixedData) => {
  let remnant = new Map();
  for (let [key, value] of mixedData) {
    if (
      key[0].includes("buddy") ||
      key[0].includes("Gifts") ||
      key[0].includes("Trade") ||
      key[0].includes("Evolve")
    ) {
      buddyFriendshipTasks.set(key, value);
    } else {
      remnant.set(key, value);
    }
  }
  //   console.log(buddyFriendshipTasks);
  filteredData = remnant;
  getAllMiscellaneousTasks(filteredData);
};

let getAllMiscellaneousTasks = (tasks) => {
  miscellaneousTasks = tasks;
  //   console.log(miscellaneousTasks);
};

// UI IMPLEMENTATION AND FINAL RENDERING
let parent = document.querySelector(".container");
let tabs = document.querySelectorAll(".tasks");
let title = document.querySelector(".child");
let selectedTab = document.querySelectorAll(".tasks")[0];
// let button = document.querySelector(".button-name");

for (let tab of tabs) {
  tab.addEventListener("click", () => {
    title.textContent = tab.textContent;
    title.style.backgroundColor = tab.getAttribute("color");
    selectedTab = tab;
    quest.innerHTML = "";
    if (tab.textContent === "Catching Tasks") {
      console.clear();
      catchingTasks = new Map([...catchingTasks.entries()].sort());
      console.log(catchingTasks);
      buildUI(catchingTasks);
    }
    if (tab.textContent === "Throwing Tasks") {
      console.clear();
      throwingTasks = new Map([...throwingTasks.entries()].sort());
      console.log(throwingTasks);
      buildUI(throwingTasks);
    }
    if (tab.textContent === "Battling Tasks") {
      console.clear();
      battlingTasks = new Map([...battlingTasks.entries()].sort());
      console.log(battlingTasks);
      buildUI(battlingTasks);
    }
    if (tab.textContent === "Buddy/Friendship Tasks") {
      console.clear();
      buddyFriendshipTasks = new Map(
        [...buddyFriendshipTasks.entries()].sort()
      );
      console.log(buddyFriendshipTasks);
      buildUI(buddyFriendshipTasks);
    }
    if (tab.textContent === "Items Tasks") {
      console.clear();
      itemsTasks = new Map([...itemsTasks.entries()].sort());
      console.log(itemsTasks);
      buildUI(itemsTasks, true);
    }
    if (tab.textContent === "Miscellaneous Tasks") {
      console.clear();
      miscellaneousTasks = new Map([...miscellaneousTasks.entries()].sort());
      console.log(miscellaneousTasks);
      buildUI(miscellaneousTasks);
    }
  });
}

const buildUI = (tasks, isItem = false) => {
  let temp = "";
  for (let [key, value] of tasks) {
    if (temp !== key[0]) {
      temp = key[0];
      let br = document.createElement("br");
      quest.append(br);
      let h1 = document.createElement("h1");
      h1.classList.add("questTitle");
      h1.textContent = temp;
      quest.append(h1);
    }
    if (temp === key[0] && !isItem) {
      let div = document.createElement("div");
      div.classList.add("questImagesContainer");
      let img = document.createElement("img");
      let img2 = document.createElement("img");
      img.classList.add("pokemon");
      img2.classList.add("shiny");
      img.src = `https://img.pokemondb.net/sprites/home/normal/${value
        .toLowerCase()
        .replace(/(.*) (burmy)/, "$2-$1")
        .replace(/(alolan) (.*)/, "$2-$1")
        .replace(/(hisuian) (.*)/, "$2-$1")
        .replace(/(galarian) (.*)/, "$2-$1")}.png`;
      img2.src = "./Images/shiny.png";
      div.append(img);
      div.append(img2);
      quest.append(div);
    }
    if (temp === key[0] && isItem) {
      let p = document.createElement("p");
      p.classList.add("quantity");
      let div = document.createElement("div");
      div.classList.add("questItemsContainer");
      p.textContent = `x ${value.split(" ")[0]}`;
      let img = document.createElement("img");
      if (value.includes("Mega")) {
        let img2 = document.createElement("img");
        img.classList.add("megaPokemon");
        img2.classList.add("megaEnergy");
        img.src = `https://img.pokemondb.net/sprites/home/normal/${
          value
            .toLowerCase()
            .replace(/(.*) (mega)/, "$1")
            .split(" ")[1]
        }.png`;
        img2.src = `./Images/mega/${
          value.split(" ")[1][0].toUpperCase() + value.split(" ")[1].slice(1)
        }_mega_energy.webp`;
        div.append(img2);
      } else {
        img.src = `./Images/${value.split(" ")[1].toLowerCase()}.png`;
        img.classList.add("item");
      }
      div.append(img);
      quest.append(div);
      quest.append(p);
    }
  }
};
