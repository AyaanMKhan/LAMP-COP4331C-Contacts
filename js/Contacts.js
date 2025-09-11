const urlBase = 'http://209.38.140.72/backend'; 
const contactFile = "contacts.html";


let userId = jsonObject.id;
let ContactEdited = null;

function refreshValues()
{
    userId = 0;
    fName = '';
    lName = '';
}


function logout()
{
	refreshValues();
	document.cookie = "fName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}



function CreateContactPop()
{
document.getElementById("ContactPopup").style.visibility = "visible";
}

function SubmitContact()
{


let ContNameF = document.getElementById("PopNameF").value;
let ContNameL = document.getElementById("PopNameL").value;
let ContEmail = document.getElementById("PopEmail").value;
let ContPhone = document.getElementById("PopPhone").value;




const NewContact  = {
    userId,
    first_name: ContNameF,
    last_name: ContNameL,
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


                CreateContact(NewContact);
                document.getElementById("ContactPopup").style.visibility = "hidden";
        
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        document.getElementById("ErrorText").innerHTML = err.message;
    }

}


function CreateContact(Contact)
{
const ContactTab = document.createElement("div");
const Contactname = document.createElement("input");
const EditBut = document.createElement("button");
const DeleteBut = document.createElement("button");


ContactTabID = Date.now();
ContactTab.id = ContactTabID;
ContactTab.className = "ContactTab";
Contactname.readOnly = true;
Contactname.value = Contact.ContNameF + " " + Contact.ContNameL;


EditBut.onclick = () => Edit(ContactTabID, Contact);
DeleteBut.onclick = () => DeleteCont(ContactTab,ContactTabID);
ContactTab.appendChild(Contactname);
ContactTab.appendChild(EditBut);
ContactTab.appendChild(DeleteBut);
document.getElementById("SearchList").appendChild(ContactTab);
}

DeleteCont(ContactTab,ContactTabID)
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

EditCont()
{

    const EditContact  = {
    userId,
    contactId: ContactEdited,
    first_name: document.getElementById("EPopNameF").value,
    last_name: document.getElementById("EPopNameL").value,
    email: document.getElementById("EPopEmail").value,
    phone: document.getElementById("EPopPhone").value,
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

Edit(ContactTabID,Contact)
{
ContactEdited = ContactTabID;

 document.getElementById("ContactPopupEdit").style.visibility = "visable";
 document.getElementById("EPopNameF").value = Contact.ContNameF;
 document.getElementById("EPopNameL").value = Contact.ContNameL;
 document.getElementById("EPopEmail").value = Contact.ContEmail;
 document.getElementById("EPopPhone").value = Contact.ContPhone;
}

SearchContacts()
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


