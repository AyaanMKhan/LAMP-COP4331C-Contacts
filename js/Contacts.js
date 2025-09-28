//Created by Hiroki Yoshida, edited by Jean Deguzman
//<a target="_blank" href="https://icons8.com/icon/114093/edit">Edit</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//<a target="_blank" href="https://icons8.com/icon/67884/delete">Delete</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
const urlBase = 'https://contacts-fall-25-cop.xyz/backend'; 
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
	fName = '';
	lName = '';

	const data = document.cookie;
	const splits = data.split(";");

	for (let i = 0; i < splits.length; i++) {
		const [k, vRaw] = splits[i].trim().split("=");
		const v = (vRaw || "").trim();
		if (k === "fName") fName = v;
		else if (k === "lName") lName = v;
		else if (k === "userId") userId = Number(v);
	}
	
	console.log("Cookie values - fName:", fName, "lName:", lName, "userId:", userId);
	
	if (!Number.isInteger(userId) || userId <= 0) {
		window.location.href = "index.html";
		return;
	}

	// Safe: these are declared globals
	const fullNameElement = document.getElementById("fullName");
	if (fullNameElement) {
		if (fName && lName) {
			fullNameElement.textContent = `${fName} ${lName}`;
		} else {
			fullNameElement.textContent = "User"; // Fallback if names are missing
		}
	}
	LoadAllContacts();
}


function logout()
{
	refreshValues();
	document.cookie = "fName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


//Made edit to create overlay effect instead of a visibility toggle - Jean
function CreateContactPop()
{
    document.getElementById("ContactPopupMake").style.display = "flex";
    document.getElementById("ContactPopupMake").style.visibility = "visible";
    document.getElementById("overlayBG").style.display = "block";
    document.getElementById("overlayBG").style.visibility = "visible";
}

function EditContactPop()
{
    document.getElementById("ContactPopupEdit").style.display = "flex";
    document.getElementById("ContactPopupEdit").style.visibility = "visible";
    document.getElementById("overlayBG").style.display = "block";
    document.getElementById("overlayBG").style.visibility = "visible";
}

//Exits overlay - Jean
function exitContactPop()
{
    document.getElementById("ContactPopupMake").style.display = "none";
    document.getElementById("ContactPopupMake").style.visibility = "none";
    document.getElementById("overlayBG").style.display = "none";
    document.getElementById("overlayBG").style.visibility = "none";

    document.getElementById("PopNameF").value = "";
    document.getElementById("PopNameL").value = "";
    document.getElementById("PopEmail").value = "";
    document.getElementById("PopPhone").value = "";

}

function exitEditContactPop()
{
    document.getElementById("ContactPopupEdit").style.display = "none";
    document.getElementById("ContactPopupEdit").style.visibility = "none";
    document.getElementById("overlayBG").style.display = "none";
    document.getElementById("overlayBG").style.visibility = "none";

    document.getElementById("EPopNameF").value = "";
    document.getElementById("EPopNameL").value = "";
    document.getElementById("EPopEmail").value = "";
    document.getElementById("EPopPhone").value = "";

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
let url = urlBase + '/AddContact.php';
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

    exitContactPop();

}


function CreateContact(Contact,ContactId)
{
const ContactTab = document.createElement("div");
const Contactname = document.createElement("p");
const ContactEmail = document.createElement("p");
const ContactPhone = document.createElement("p");
const EditBut = document.createElement("button");
const DeleteBut = document.createElement("button");

ContactTab.style.visibility = "hidden";

ContactTab.className = "ContactTab";
ContactTab.id = ContactId;

Contactname.className = "Contact_Name";
Contactname.readOnly = true;
Contactname.innerText = Contact.firstName + " " + Contact.lastName;

ContactEmail.className = "Contact_Email";
ContactEmail.readOnly = true;
ContactEmail.innerText = Contact.email;

ContactPhone.className = "Contact_Phone";
ContactPhone.readOnly = true;
ContactPhone.innerText = Contact.phone;

EditBut.className = "EDIT";
DeleteBut.className =  "DELETE";

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
                exitEditContactPop();
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

 document.getElementById("EPopNameF").value = Contact.firstName;
 document.getElementById("EPopNameL").value = Contact.lastName;
 document.getElementById("EPopEmail").value = Contact.email;
 document.getElementById("EPopPhone").value = Contact.phone;

 EditContactPop();
}

function SearchContacts()
{
    let Temp = document.getElementById("SearchCon").value;
    
    // If search is empty, load all contacts
    if (Temp.trim() === "") {
        LoadAllContacts();
        return;
    }

    document.querySelectorAll(".ContactTab").forEach (con => {
        con.style.visibility = "hidden";
    });

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
                        const FoundCont = {
                            userId,
                            contactId: contact.id,
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                            email: contact.email,
                            phone: contact.phone
                        };

                        CreateContact(FoundCont,contact.id);
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

function LoadAllContacts()
{
    // Ensure userId is valid before proceeding
    if (!Number.isInteger(userId) || userId <= 0) {
        console.error("Invalid userId:", userId);
        return;
    }
    
    const SearchData = {
        userId: Number(userId),   // never undefined in JSON
        search: ""                // Empty search to get all contacts
    };

    let jsonPayload = JSON.stringify(SearchData);
    
    let url = urlBase + '/SearchContacts.php';
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        // Capture userId in closure to ensure it's available in callback
        const currentUserId = userId;
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error !== "") {
                    document.getElementById("ErrorText").innerHTML = jsonObject.error;
                    return;
                } 
                
                // Clear existing contacts
                document.getElementById("SearchList").innerHTML = "";
                
                // Load all contacts
                jsonObject.results.forEach((contact, index) => {
                    const FoundCont = {
                        userId: currentUserId,
                        contactId: contact.id,
                        firstName: contact.firstName,
                        lastName: contact.lastName,
                        email: contact.email,
                        phone: contact.phone
                    };
                    CreateContact(FoundCont, contact.id);
                    
                    // Make the contact visible (it's created as hidden by default)
                    let ContactFound = document.getElementById(contact.id);
                    if (ContactFound) {
                        ContactFound.style.visibility = "visible";
                    }
                });
            }
        };
        xhr.send(jsonPayload);
    } catch(err) {
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


