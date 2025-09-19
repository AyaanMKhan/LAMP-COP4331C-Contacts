const urlBase = 'http://209.38.140.72/backend'; 
const contactFile = "contacts.html";

let userId = 0;
let fName = '';
let lName = '';

let ContactEdited = null;

//Also from Jean
function refreshValues()
{
    userId = 0;
    fName = '';
    lName = '';
}

//Jeans readCookie code to grab UserID for my functions
function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");

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


function logout()
{
	refreshValues();
	document.cookie = "fName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}



function CreateContactPop()
{
document.getElementById("ContactPopupMake").style.visibility = "visible";
}

function SubmitContact()
{


let ContNameF = document.getElementById("PopNameF").value;
let ContNameL = document.getElementById("PopNameL").value;
let ContEmail = document.getElementById("PopEmail").value;
let ContPhone = document.getElementById("PopPhone").value;




const NewContact  = {
    userId,
    firstName: ContNameF,
    lastName: ContNameL,
    email: ContEmail,
    phone: ContPhone
};

let jsonPayload = JSON.stringify(NewContact);
let url = urlBase + '/AddContactHY.php';
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
                    document.getElementById("ErrorText").innerHTML = jsonObject.error;
                    return;
                } 

                let ContactId = jsonObject.id;
                CreateContact(NewContact,ContactId);
                document.getElementById("ContactPopupMake").style.visibility = "hidden";
        
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        document.getElementById("ErrorText").innerHTML = err.message;
    }

}


function CreateContact(Contact,ContactId)
{
const ContactTab = document.createElement("div");
const Contactname = document.createElement("input");
const EditBut = document.createElement("button");
const DeleteBut = document.createElement("button");

ContactTab.className = "ContactTab";
ContactTab.id = ContactId;
Contactname.readOnly = true;
Contactname.value = Contact.firstName + " " + Contact.lastName;


EditBut.onclick = () => Edit(ContactId, Contact);
DeleteBut.onclick = () => DeleteCont(ContactTab,ContactId);
ContactTab.appendChild(Contactname);
ContactTab.appendChild(EditBut);
ContactTab.appendChild(DeleteBut);
document.getElementById("SearchList").appendChild(ContactTab);
}

function DeleteCont(ContactTab,ContactTabID)
{
    const Del = {
        userId,
        contactId:ContactTabID
    };

    let jsonPayload = JSON.stringify(Del);
let url = urlBase + '/DeleteContact.php';
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
                    document.getElementById("ErrorText").innerHTML = jsonObject.error;
                    return;
                } 

                ContactTab.remove();
        
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        document.getElementById("ErrorText").innerHTML = err.message;
    }
}

function EditCont()
{

    const EditContact  = {
    userId,
    contactId: ContactEdited,
    firstName: document.getElementById("EPopNameF").value,
    lastName: document.getElementById("EPopNameL").value,
    email: document.getElementById("EPopEmail").value,
    phone: document.getElementById("EPopPhone").value
};

let jsonPayload = JSON.stringify(EditContact);
let url = urlBase + '/UpdateContact.php';
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
                    document.getElementById("ErrorText").innerHTML = jsonObject.error;
                    return;
                } 

                document.getElementById("ContactPopupEdit").style.visibility = "hidden";
                let temp = document.getElementById(ContactEdited);
                let oldname = temp.querySelector("input");
                let F = document.getElementById("EPopNameF").value;
                let L = document.getElementById("EPopNameL").value;
                oldname.value = F + " " + L;
                ContactEdited = null;
        
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        document.getElementById("ErrorText").innerHTML = err.message;
    }
}

function Edit(ContactId,Contact)
{
ContactEdited = ContactId;

 document.getElementById("ContactPopupEdit").style.visibility = "visible";
 document.getElementById("EPopNameF").value = Contact.firstName;
 document.getElementById("EPopNameL").value = Contact.lastName;
 document.getElementById("EPopEmail").value = Contact.email;
 document.getElementById("EPopPhone").value = Contact.phone;
}

function SearchContacts()
{

    let Temp = document.getElementById("SearchCon").value;
    const SearchData = {
        userId,
        search: Temp
    };

let jsonPayload = JSON.stringify(SearchData);
let url = urlBase + '/SearchContact.php';
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
                    document.getElementById("ErrorText").innerHTML = jsonObject.error;
                    return;
                } 

                

            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        document.getElementById("ErrorText").innerHTML = err.message;
    }

}


