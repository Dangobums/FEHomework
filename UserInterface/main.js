const USER_API = "http://localhost:3000/users/";
const saveButton = document.getElementById("save-btn");
const resetButton = document.getElementById("reset-btn");
const userName = document.getElementById("username");
const fullName = document.getElementById("fullname");
const email = document.getElementById("email");
const birthday = document.getElementById("birthday");
const modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
// const testButton = document.getElementById("test-btn");

let numberOfUsers;

let listOfUsers = []

const regexUserName = /^[a-zA-Z0-9]*$/;
const regexFullName =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]*$/;
const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const regexDate = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

window.onload = (e) => {
  e.preventDefault();
  fetch(`${USER_API}`).then((res) => res.json()).then((res) =>  {
    // let author = res.result;
    // console.log(res);
    numberOfUsers = res.length;
      res.forEach((user) => {
        tempUser = {
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          birthday: user.birthday,
          deleted: user.deleted,
        };
          updateUserList(tempUser);
      })
    updateUserTable(); 
  }).catch(err => {
    console.error(err);
  })
};

function updateToApi(user, method) {
  console.log(user);
  if (method === 'POST') {
    fetch(`${USER_API}`, {
      method: `${method}`,
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(user),
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      return;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  } else if (method === 'PUT') {
    fetch(`${USER_API}/${user.id}`, {
      method: `${method}`,
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(user),
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      return;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
}

function reformatBirthday(input) {
  let dob = input.split("-");
  return dob[2].concat("-", dob[1], "-", dob[0]);
}
const userListUserTemplate = (user) => {
  return `
  <tr>
    <td>${user.id}</td>
    <td>${user.username}</td>
    <td>${user.fullname}</td>
    <td>${user.email}</td>
    <td>${user.birthday}</td>
    <td><button class="btn btn-primary edit-btn" onclick="editUserData(${user.id})" id=${user.id}>EDIT</button></td>  
    <td><button class="btn btn-danger delete-btn" onclick="deleteUserData(${user.id})" id=${user.id}>DELETE</button></td>  
  </tr>
  `;
}

function regexValidate(user) {
  let flag = 0;
  if (!user.username || !user.fullname || !user.email || !user.birthday) {
    alert("Please enter all fields");
    return false;
  } else if (!regexUserName.test(user.username.trim())) {
    alert("Please enter valid username");
    return false;
  } else if (!regexFullName.test(user.fullname.trim()))  {
    alert("Please enter valid fullname");
    return false;
  } else if (!regexEmail.test(user.email.trim())) {
    alert("Please enter valid email");
    return false;
  // } else if (!regexDate.test(user.birthday) ||  new Date(user.birthday).getFullYear() >= new Date(Date.now()).getFullYear()) {
  //   alert("Please enter valid birthday");
  //   return false;
  } 
  return true;
}

function updateUserList(user) {
  listOfUsers = [...listOfUsers, user];
}


saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    //validate

    let userNameValue = userName.value;
    let fullNameValue = fullName.value;
    let emailValue = email.value;
    // console.log(userNameValue);
    // console.log(emailValue);
    let birthdayValue = birthday.value;
    let userid = numberOfUsers;
    user = {
      id: userid,
      username: userNameValue,
      fullname: fullNameValue,
      email: emailValue,
      birthday: birthdayValue,
      deleted: false,
    };
    if (regexValidate(user)) {
      fetch(`${USER_API}?username=${user.username}`).then((res) => res.json()).then((res) => {
        if (res.length > 0) {
          alert("Username already exist");
        } else {
          fetch(`${USER_API}?email=${user.email}`).then((res) => res.json()).then((res) => {
            if (res.length > 0) {
              alert("Email already exist");
            } else {
              numberOfUsers++;
              updateUserList(user);
              updateToApi(user, 'POST');
              updateUserTable();
            }
        })
        }
      }) 
  
    }
});

resetButton.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById("user-form").reset();
})

function editUserData(id) {
  const buttonClicked = document.getElementById(`${id}`);
  let listItems = buttonClicked.parentElement.parentElement.children;
  // console.log(listItems);
  if (buttonClicked.innerHTML == "EDIT") {
    userPre = {
      id: listItems[0].innerHTML,
      username: listItems[1].innerHTML,
      fullname: listItems[2].innerHTML,
      email: listItems[3].innerHTML,
      birthday: listItems[4].innerHTML,
      deleted: false
    };
    // console.log(userPre);
    buttonClicked.innerHTML = "FINISH";
    for (var i = 0; i < listItems.length - 2; i++) {
        const item = listItems[i];
        //console.log(item.innerHTML);
        item.setAttribute("contentEditable", true);
      
    }
} else if (buttonClicked.innerHTML == "FINISH") {
  let user = {
    id: listItems[0].innerHTML,
    username: listItems[1].innerHTML,
    fullname: listItems[2].innerHTML,
    email: listItems[3].innerHTML,
    birthday: listItems[4].innerHTML,
    deleted: false
  };
  if (JSON.stringify(userPre) === JSON.stringify(user)) {
    buttonClicked.innerHTML = "EDIT";
      for (var i = 1; i < listItems.length - 2; i++) {
        const item = listItems[i];
          item.setAttribute("contentEditable", false);
          // console.log(item.innerHTML);
          // console.log(item.id);
      } 
  } else if (regexValidate(user)) {
      // console.log(user);
      updateToApi(user, 'PUT');
      buttonClicked.innerHTML = "EDIT";
      for (var i = 1; i < listItems.length - 2; i++) {
        const item = listItems[i];
          item.setAttribute("contentEditable", false);
          // console.log(item.innerHTML);
          //console.log(item.id);

      } 
      //return;
    }
}
}
function deleteUserData(id) {
  const buttonClicked = document.getElementById(`${id}`);
  const confirm = document.getElementById("confirm-btn");
  const cancel = document.getElementById("cancel-btn");
  let removeId = buttonClicked.getAttribute("id");
  // console.log(removeId);
  // console.log("REMOVE");
  modal.style.display = "block";
  span.onclick = function() {
    modal.style.display = "none";
  }
   confirm.addEventListener('click', (e) => {
    e.preventDefault();
    listOfUsers[removeId].deleted = true;
    fetch(`${USER_API}/${removeId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(listOfUsers[removeId]),
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      return;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    buttonClicked.parentElement.parentElement.remove();
   })
  cancel.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = "none";
  })
}

function updateUserTable() {
  let output = "";
  listOfUsers.forEach((user) => {
      if (!user.deleted)
      output += userListUserTemplate(user);
  })
  document.getElementById("table-body").innerHTML = output;
}



