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
const ContactEmail = document.createElement("input");
const ContactPhone = document.createElement("input");
const EditBut = document.createElement("button");
const DeleteBut = document.createElement("button");

ContactTab.style.visibility = "hidden";

ContactTab.className = "ContactTab";
ContactTab.id = ContactId;

Contactname.className = "Contact_Name";
Contactname.readOnly = true;
Contactname.value = Contact.firstName + " " + Contact.lastName;

ContactEmail.className = "Contact_Email";
ContactEmail.readOnly = true;
ContactEmail.value = Contact.email;

ContactPhone.className = "Contact_Phone";
ContactPhone.readOnly = true;
ContactPhone.value = Contact.phone;

EditBut.onclick = () => Edit(ContactId, Contact);
DeleteBut.onclick = () => DeleteCont(ContactTab,ContactId);
ContactTab.appendChild(Contactname);
ContactTab.appendChild(ContactEmail);
ContactTab.appendChild(ContactPhone);
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
                let newname = temp.querySelector(".Contact_Name");
                let newemail = temp.querySelector(".Contact_Email");
                let newphone = temp.querySelector(".Contact_Phone");
                let F = document.getElementById("EPopNameF").value;
                let L = document.getElementById("EPopNameL").value;
                let E = document.getElementById("EPopEmail").value;
                let P = document.getElementById("EPopPhone").value;
                newname.value = F + " " + L;
                newemail.value = E;
                newphone.value = P;
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


    document.querySelectorAll(".ContactTab").forEach (con => {
        con.style.visibility = "hidden";
    });

    let Temp = document.getElementById("SearchCon").value;
    const SearchData = {
        userId,
        search: Temp
    };

let jsonPayload = JSON.stringify(SearchData);
let url = urlBase + '/SearchContacts.php';
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
                jsonObject.results.forEach(contact => {
                    let ContactFound = document.getElementById(contact.id);
                    if(ContactFound){
                        ContactFound.style.visibility = "visible";
                    }
                    else{
                        CreateContact(contact,contact.id);
                        let ContactFound = document.getElementById(contact.id);
                        ContactFound.style.visibility = "visible";
                    }
                    
                    
                });
                
                ReArrainge();
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        document.getElementById("ErrorText").innerHTML = err.message;
    }

}

function ReArrainge()
{
const SearchConatiner = document.getElementById("SearchList");
const Contacts = Array.from(SearchConatiner.children);
const Visable = Contacts.filter(i => i.style.visibility === "visible");
const Hidden = Contacts.filter(i => i.style.visibility !== "visible");

SearchConatiner.innerHTML = "";
Visable.forEach(i => SearchConatiner.appendChild(i));
Hidden.forEach(i => SearchConatiner.appendChild(i));



}


