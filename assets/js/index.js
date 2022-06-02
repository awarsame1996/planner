const workingHours = [
  {
    label: "9AM",
    key: 9,
  },
  {
    label: "10AM",
    key: 10,
  },
  {
    label: "11AM",
    key: 11,
  },
  {
    label: "12AM",
    key: 12,
  },
  {
    label: "1PM",
    key: 13,
  },
  {
    label: "2PM",
    key: 14,
  },
  {
    label: "3PM",
    key: 15,
  },
  {
    label: "4PM",
    key: 16,
  },
  {
    label: "5PM",
    key: 17,
  },
];
const timeBlocks = $("#time-blocks");
//accessing date and time
const currentDateStamp = moment();
// add
const renderDate = () => {
  return moment().format("dddd, MMMM Do, YYYY");
};

const renderTime = () => {
  return moment().format("h:mm:ss a");
};

// target save button
//const saveButton = $("#saveBtn");
//saveButton.on("click", function () {
// console.log("button clicked");
//});

$("#currentDay").text(renderDate);
$("#currentTime").text(renderTime);

const getEventForTimeBlock = (hour) => {
  const tasks = readFromLocalStorage("planner", workingHours);
  // get task by hour from LS
  console.log(tasks);
  let task = tasks[hour];
  if (task == undefined) {
    task = "";
    return task;
  }
  return task;
};
const getClassName = (workingHour) => {
  const currentHour = moment().hour();
  //if workingHour is present
  if (workingHour === currentHour) {
    return "present";
  }
  //if workingHour is future
  if (workingHour > currentHour) {
    return "future";
  }
  return "past";
  //else past
};
const renderTimeBlocks = () => {
  const renderTimeBlock = (workingHour) => {
    console.log(workingHour);
    //create time block
    const timeBlock = `<div class="row p-2 my-2 ${getClassName(
      workingHour.key
    )}">
      <div class="col-md-1 col-sm-12 text-center my-1 d-flex flex-column justify-content-center">${
        workingHour.label
      }</div>
      <textarea class="col-md-9 col-sm-12" rows="3" data-textarea-key = ${
        workingHour.key
      }>${getEventForTimeBlock(workingHour.key)}</textarea>
      <div class="col-md-2 col-sm-12 text-center my-1 d-flex flex-column justify-content-center">
        <button type="button" data-hour=${
          workingHour.key
        }  class="btn btn-success">Save</button>
      </div>
    </div>`;

    //append to parent (timeBlocks)
    timeBlocks.append(timeBlock);
  };
  workingHours.forEach(renderTimeBlock);
};
const resetPlanner = () => {
  localStorage.clear();
  timeBlocks.remove();
  $("#timeBlock").append(` <div id="time-blocks" class="container"></div>`);
  readFromLocalStorage();
  renderTimeBlocks();
};

const onReady = () => {
  renderDate();
  readFromLocalStorage();
  renderTimeBlocks();
  //refresh every 5 minutes - TODO
};

const readFromLocalStorage = (key, defaultValue) => {
  //get from LS with key name
  const dataFromLS = localStorage.getItem(key);

  //parse data
  const parsedData = JSON.parse(dataFromLS);
  console.log(parsedData);
  if (parsedData) {
    return parsedData;
  } else {
    return defaultValue;
  }
};
const writeToLocalStorage = (key, value) => {
  //value turned to string
  const stringifiedValue = JSON.stringify(value);

  localStorage.setItem(key, stringifiedValue);
};
const saveToLocalStorage = (event) => {
  const target = $(event.target);

  if (target.is("button")) {
    console.log("click");
    const key = target.attr("data-hour");
    console.log(key);
    const value = $(`textarea[data-textarea-key="${key}"]`).val();
    console.log(value);
    const planner = readFromLocalStorage("planner", {});

    planner[key] = value;

    writeToLocalStorage("planner", planner);
  }
};
$("#refreshBtn").click(resetPlanner);
timeBlocks.click(saveToLocalStorage);
$(document).ready(onReady);
