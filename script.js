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
let completePokedex;

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

let getPokedexInfo = async () => {
  // Replace ./data.json with your JSON feed
  await fetch("./data/pokedexdata.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Work with JSON data here

      completePokedex = data;
    })
    .catch((err) => {
      console.log(err);
      // Do something for an error here
    });
};
getPokedexInfo();

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
      serializeUI(catchingTasks, "Catching");
    }
    if (tab.textContent === "Throwing Tasks") {
      console.clear();
      throwingTasks = new Map([...throwingTasks.entries()].sort());
      console.log(throwingTasks);
      serializeUI(throwingTasks, "Throwing");
    }
    if (tab.textContent === "Battling Tasks") {
      console.clear();
      battlingTasks = new Map([...battlingTasks.entries()].sort());
      console.log(battlingTasks);
      serializeUI(battlingTasks, "Battling");
    }
    if (tab.textContent.split("/")[0] === "Buddy") {
      console.clear();
      buddyFriendshipTasks = new Map(
        [...buddyFriendshipTasks.entries()].sort()
      );
      console.log(buddyFriendshipTasks);
      serializeUI(buddyFriendshipTasks, "Buddy");
    }
    if (tab.textContent === "Items Tasks") {
      console.clear();
      itemsTasks = new Map([...itemsTasks.entries()].sort());
      console.log(itemsTasks);
      serializeUI(itemsTasks, "Items");
    }
    if (tab.textContent === "Miscellaneous Tasks") {
      console.clear();
      miscellaneousTasks = new Map([...miscellaneousTasks.entries()].sort());
      console.log(miscellaneousTasks);
      serializeUI(miscellaneousTasks, "Miscellaneous");
    }
  });
}

const serializeUI = (tasks, category = "Default") => {
  const serializerMap = new Map();
  console.clear();
  for (let [key, value] of tasks) {
    if (!serializerMap.has(...key))
      serializerMap.set(
        ...key,
        value
          .toLowerCase()
          .replace(/(.*) (burmy)/, "$2-$1")
          .replace(/(alolan) (.*)/, "$2-$1")
          .replace(/(hisuian) (.*)/, "$2-$1")
          .replace(/(galarian) (.*)/, "$2-$1")
      );
    else
      serializerMap.set(
        ...key,
        serializerMap.get(...key) +
          "#" +
          value
            .toLowerCase()
            .replace(/(.*) (burmy)/, "$2-$1")
            .replace(/(alolan) (.*)/, "$2-$1")
            .replace(/(hisuian) (.*)/, "$2-$1")
            .replace(/(galarian) (.*)/, "$2-$1")
      );
  }
  serializeImages(serializerMap, category);
};

const serializeImages = async (tasks, category = "Default") => {
  let serializerImagesMap = new Map();
  let pokedexdata = completePokedex;
  let sortedValue;
  for (let [key, value] of tasks) {
    if (category !== "Items") {
      sortedValue = value
        .split("#")
        .sort((a, b) => {
          if (a.split("-")[0] !== b.split("-")[0])
            return (
              parseInt(pokedexdata[a.split("-")[0]]) -
              parseInt(pokedexdata[b.split("-")[0]])
            );
          if (a.split("-")[0] === b.split("-")[0]) return a.length - b.length;
        })
        .join("#");
    }
    if (category === "Items") {
      if (value.includes("mega"))
        sortedValue = value
          .split("#")
          .sort((a, b) =>
            parseInt(
              pokedexdata[a.split(" ")[1]] - pokedexdata[b.split(" ")[1]]
            )
          )
          .join("#");
      else
        sortedValue = value
          .split("#")
          .sort((a, b) => a - b)
          .join("#");
    }
    serializerImagesMap.set(key, sortedValue);
    console.log(sortedValue);
  }
  serializeTitles(serializerImagesMap, category);
};

const serializeTitles = (tasks, category) => {
  let titles = [...tasks.keys()];
  let sortedTitle = [];
  switch (category) {
    case "Catching": {
      console.clear();
      sortedTitle = titles.sort((a, b) => {
        if (a.includes("dragon"))
          return a.split(" ")[2].length - b.split(" ")[2].length;
        if (a.includes("Catch"))
          return parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]);
        if (a.includes("Use"))
          return (
            parseInt(a.split(" ")[0].length) - parseInt(b.split(" ")[0].length)
          );
      });
      console.log(sortedTitle);
      break;
    }
    case "Throwing": {
      console.clear();
      sortedTitle = titles
        .sort((a, b) => a.length - b.length)
        .sort((a, b) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]))
        .sort(
          (a, b) =>
            parseInt(a.split(" ")[2].length) - parseInt(b.split(" ")[2].length)
        );
      console.log(sortedTitle);
      break;
    }
    case "Battling": {
      break;
    }
    case "Buddy": {
      break;
    }
    case "Items": {
      break;
    }
    case "Miscellaneous": {
      break;
    }
    default: {
      console.log(
        "This shouldn't have happened. It belongs to none of the categories. Please fix it."
      );
    }
  }
};

/*
 * Needs Changes
 */
const buildUI = (tasks, category = "Default") => {
  tasks.set([""], "");
  let temp = "";
  let rightdiv = document.createElement("div");
  rightdiv.classList.add("right");

  let superdiv = document.createElement("div");
  superdiv.classList.add("master");

  let flag = false;
  for (let [key, value] of tasks) {
    if (temp !== key[0]) {
      temp = key[0];
      if (flag) {
        superdiv.append(rightdiv);
        quest.append(superdiv);
      }
      flag = true;
      rightdiv = document.createElement("div");
      rightdiv.classList.add("right");
      superdiv = document.createElement("div");
      superdiv.classList.add("master");
      let h1 = document.createElement("h1");
      h1.classList.add("questTitle");
      h1.textContent = temp;
      let leftdiv = document.createElement("div");
      leftdiv.classList.add("left");
      leftdiv.append(h1);
      superdiv.append(leftdiv);
    }
    if (temp === key[0] && category !== "Items") {
      let div = document.createElement("div");
      div.classList.add("questImagesContainer");
      let img = document.createElement("img");
      let img2 = document.createElement("img");
      img.classList.add("pokemon");
      img2.classList.add("shiny");
      if (value)
        img.src = `https://img.pokemondb.net/sprites/home/normal/${value}.png`;
      img2.src = "./Images/shiny.png";
      div.append(img);
      div.append(img2);
      rightdiv.append(div);
    }
    if (temp === key[0] && category === "Items") {
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
        if (value)
          img.src = `./Images/${value.split(" ")[1].toLowerCase()}.png`;
        img.classList.add("item");
        p.classList.add("itemQuantity");
      }
      div.append(img);
      div.append(p);
      rightdiv.append(div);
    }
  }
};

document.addEventListener("click", function (e) {
  const target = e.target.closest(".shiny"); // Or any other selector.
  if (target) {
    target.style.display = "none";
  }
  const scaleUp = e.target.closest(".pokemon");
  if (scaleUp) {
    scaleUp.style.scale = 1.3;
  }
  const scaleUp2 = e.target.closest(".item");
  if (scaleUp2) {
    scaleUp2.style.scale = 1.3;
  }
  const scaleUp3 = e.target.closest(".megaEnergy");
  if (scaleUp3) {
    scaleUp3.style.scale = 1.3;
  }
  const scaleUp4 = e.target.closest(".megaPokemon");
  if (scaleUp4) {
    scaleUp4.style.scale = 1.3;
  }
  const download = e.target.closest(".child");
  if (download) {
    console.log("pending");
  }
});

// BUILD A KANBAN BOARD
