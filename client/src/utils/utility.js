export const stripStr = (str) => {
  return str.substr(0,13) + "...";
}

export const findChatName = (chatName, currentUser) => {
  let members = chatName.members;

  if(currentUser._id === members[0]._id){
    return members[1].username;
  }

  return members[0].username;
}

export const formatTime = (input) => {
  let time = new Date(input);

  let hours = time.getHours();
  let minutes = time.getMinutes();
  let meridian = hours >= 12 ? "PM" : "AM";

  if (hours > 12) {
    hours = hours - 12;
  }

  let hrs = hours < 10 ? "0" + hours : hours <= 12 ? hours : hours;
  let mins = (minutes < 10) ? "0" + minutes : minutes;

  if (hrs === "00") {
    hrs = 12;
  }

  return `${hrs}:${mins} ${meridian}`;
}

export const formatDate = (input) => {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let date = new Date(input);

  let month = months[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

export const getName = (input) => {
  input = input.split(" ");
  return input[0];
}

export const findId = (chatName, currentUser) => {
  let members = chatName.members;

  if(currentUser._id === members[0]._id){
    return members[1]._id;
  }

  return members[0]._id;
}

export const getUserName = (user) => {
  let name = user.username.split(" ");
  return name;
}