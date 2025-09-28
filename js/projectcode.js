//Change this as necessary to reflect new domain/file layout...
const urlBase = 'https://contacts-fall-25-cop.xyz/backend'; 
const contactFile = "contacts.html";

const emailRegEx = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm

let userId = 0;
let fName = '';
let lName = '';


//Sets stored values to nothing
function refreshValues()
{
    userId = 0;
    fName = '';
    lName = '';
}

//Implement md5 password hashing later...
function login()
{
    refreshValues();

    //Grabbing login info from HTML file and setting error text to default
    let login = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginErr").innerHTML = "";

    let temp = {login:login, password:password};
    let jsonPayload = JSON.stringify(temp);

    let url = urlBase + '/Login.php';

    let xhr = new XMLHttpRequest();

    //Sends information to Login.php
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        //Performs function once connection with server is established
        xhr.onreadystatechange = function()
        {
            //If server sent back a response that wasn't an error
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                let error = jsonObject.error;
                
                //If returnWithError was called, print out error
                if(error !== "")
                {
                    document.getElementById("loginErr").innerHTML = error;
                    document.getElementById("loginErr").style.visibility = "visible";
                    return;
                }

                userId = jsonObject.id;
                fName = jsonObject.firstName;
                lName = jsonObject.lastName;

                //Save data in cookie so information can be recalled
                cookieSave();

                window.location.href = contactFile;
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        document.getElementById("loginErr").innerHTML = err.message;
    }

}

function logout()
{
	refreshValues();
	document.cookie = "fName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function setInvalid(id)
{
    id.style.background = "rgba(252, 180, 180, 1)";
    id.style.backgroundSize = "contain";
    id.style.backgroundRepeat = "no-repeat";
    id.style.backgroundPosition = "right";
    id.style.backgroundBlendMode = "lighten";
}

function emptyCheck(id)
{
    let emptWarn = document.getElementById("emptyField");

    if (id.value == undefined || id.value == "")
    {
        setInvalid(id);
        id.dataset.valid = "0";
        emptWarn.style.visibility = "visible";
    }
    else 
    {
        id.style.background = "rgba(150, 240, 146, 1)";
        id.dataset.valid = "1";
    }
}

function clearError()
{
    if(document.getElementById("firstName").dataset.valid == "1" && document.getElementById("lastName").dataset.valid == "1"
    && document.getElementById("regPassword").dataset.valid == "1")
    {
        document.getElementById("emptyField").style.visibility = "hidden";
    }
}

// New validation functions that only validate without changing colors
function validateEmptyCheck(field)
{
    if (field.value.trim() == "")
    {
        field.dataset.valid = "0";
        return false;
    }
    else
    {
        field.dataset.valid = "1";
        return true;
    }
}

function validateEmailCheck(email)
{
    let login = email.value;
    if (login.match(emailRegEx) == login)
    {
        return true;
    }
    return false;
}

function validatePasswordCheck(password)
{
    if (password.value.length >= 8)
    {
        return true;
    }
    return false;
}

function emailCheck(email)
{
    let login = email.value;
    let emailErr =  document.getElementById("invalidEmail");

    if (login.match(emailRegEx) == login)
    {
        email.style.background = "rgba(150, 240, 146, 1)";
        emailErr.style.visibility = "hidden";
        return true;
    }

    setInvalid(email);
    emailErr.style.visibility = "visible";
    emailErr.appendChild(createWarningImg());

    return false;
}

function register()
{
    userId = 0;
    fName = document.getElementById("firstName").value;
    lName = document.getElementById("lastName").value;
    let login = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    let firstNameField = document.getElementById("firstName");
    let lastNameField = document.getElementById("lastName");
    let passwordField = document.getElementById("regPassword");
    let emailField = document.getElementById("regEmail");

    //let hash = md5(password);
    document.getElementById("regErr").innerHTML = "";

    // First validate all fields without showing colors
    let isValid = true;
    
    // Validate required fields
    if (!validateEmptyCheck(firstNameField)) {
        setInvalid(firstNameField);
        document.getElementById("emptyField").style.visibility = "visible";
        isValid = false;
    } else {
        setValid(firstNameField);
        document.getElementById("emptyField").style.visibility = "hidden";
        document.getElementById("invalidPassword").style.visibility = "hidden";
        document.getElementById("invalidEmail").style.visibility = "hidden";
    }
    
    if (!validateEmptyCheck(lastNameField)) {
        setInvalid(lastNameField);
        document.getElementById("emptyField").style.visibility = "visible";
        isValid = false;
    } else {
        setValid(lastNameField);
        document.getElementById("emptyField").style.visibility = "hidden";
        document.getElementById("invalidPassword").style.visibility = "hidden";
        document.getElementById("invalidEmail").style.visibility = "hidden";
    }
    
    if (!validateEmptyCheck(passwordField)) {
        setInvalid(passwordField);
        document.getElementById("emptyField").style.visibility = "visible";
        isValid = false;
    } else if (!validatePasswordCheck(passwordField)) {
        setInvalid(passwordField);
        document.getElementById("invalidPassword").style.visibility = "visible";
        isValid = false;
    } else {
        setValid(passwordField);
        document.getElementById("emptyField").style.visibility = "hidden";
        document.getElementById("invalidPassword").style.visibility = "hidden";
        document.getElementById("invalidEmail").style.visibility = "hidden";
    }
    
    // Validate email
    if (!validateEmailCheck(emailField)) {
        setInvalid(emailField);
        document.getElementById("invalidEmail").style.visibility = "visible";
        isValid = false;
    } else {
        setValid(emailField);
        document.getElementById("invalidEmail").style.visibility = "hidden";
        document.getElementById("invalidPassword").style.visibility = "hidden";
        document.getElementById("emptyField").style.visibility = "hidden";
    }

    if (!isValid) {
        return;
    }

    let temp = {login:login, password:password, first_name:fName, last_name:lName};
    let jsonPayload = JSON.stringify(temp);

    let url = urlBase + '/Register.php';
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error !== "")
                {
                    document.getElementById("regErr").innerHTML = jsonObject.error;
                    return;
                } 

                userId = jsonObject.id;
                fName = jsonObject.firstName;
                lName = jsonObject.lastName;
                cookieSave();
                window.location.href = contactFile;
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        document.getElementById("regErr").innerHTML = err.message;
    }
}

function cookieSave()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes*60*1000));
    let expires = "; expires=" + date.toGMTString();
    document.cookie = "fName=" + fName + expires;
    document.cookie = "lName=" + lName + expires;
    document.cookie = "userId=" + userId + expires;
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(";");

	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		if( tokens[0] == "fName" )
		{
			firstName = tokens[1];
		}

		else if( tokens[0] == "lName" )
		{
			lastName = tokens[1];
		}

		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}

	else
	{
        document.getElementById("fullName").innerHTML = firstName + " " + lastName;
	}

}
