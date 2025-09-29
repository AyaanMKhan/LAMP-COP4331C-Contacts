//Created by Hiroki Yoshida, edited by Jean Deguzman

const urlBase = 'https://contacts-fall-25-cop.xyz/backend'; 
const contactFile = "contacts.html";

const emailRegEx = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm

let userId = 0;
let fName = '';
let lName = '';

let ContactEdited = null;

// Validation functions
function validateEmptyCheck(field) {
    return field.value.trim() !== "";
}

function validateEmailCheck(email) {
    return emailRegEx.test(email.value.trim());
}

function setInvalid(id) {
    id.style.background = "rgba(252, 180, 180, 1)";
    id.style.backgroundSize = "contain";
    id.style.backgroundRepeat = "no-repeat";
    id.style.backgroundPosition = "right";
    id.style.backgroundBlendMode = "lighten";
}

function setValid(id) {
    id.style.background = "";
    id.style.backgroundSize = "";
    id.style.backgroundRepeat = "";
    id.style.backgroundPosition = "";
    id.style.backgroundBlendMode = "";
}



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
	
	if (!Number.isInteger(userId) || userId <= 0) {
		window.location.href = "index.html";
		return;
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
    
    document.getElementById("createEmptyField").style.display = "none";
    document.getElementById("createInvalidEmail").style.display = "none";
    document.getElementById("createServerError").style.display = "none";
    
   
    setValid(document.getElementById("PopNameF"));
    setValid(document.getElementById("PopNameL"));
    setValid(document.getElementById("PopEmail"));
    setValid(document.getElementById("PopPhone"));
    
  
    document.getElementById("ContactPopupMake").style.display = "flex";
    document.getElementById("ContactPopupMake").style.visibility = "visible";
    document.getElementById("overlayBG").style.display = "block";
    document.getElementById("overlayBG").style.visibility = "visible";
}

function EditContactPop()
{
    
    document.getElementById("editEmptyField").style.display = "none";
    document.getElementById("editInvalidEmail").style.display = "none";
    document.getElementById("editServerError").style.display = "none";
    
    
    setValid(document.getElementById("EPopNameF"));
    setValid(document.getElementById("EPopNameL"));
    setValid(document.getElementById("EPopEmail"));
    setValid(document.getElementById("EPopPhone"));
    
    document.getElementById("ContactPopupEdit").style.display = "flex";
    document.getElementById("ContactPopupEdit").style.visibility = "visible";
    document.getElementById("overlayBG").style.display = "block";
    document.getElementById("overlayBG").style.visibility = "visible";
}

//Exits overlay - Jean
function exitContactPop()
{
    document.getElementById("ContactPopupMake").style.display = "none";
    document.getElementById("ContactPopupMake").style.visibility = "hidden";
    document.getElementById("overlayBG").style.display = "none";
    document.getElementById("overlayBG").style.visibility = "hidden";

    document.getElementById("PopNameF").value = "";
    document.getElementById("PopNameL").value = "";
    document.getElementById("PopEmail").value = "";
    document.getElementById("PopPhone").value = "";
}

function exitEditContactPop()
{
    document.getElementById("ContactPopupEdit").style.display = "none";
    document.getElementById("ContactPopupEdit").style.visibility = "hidden";
    document.getElementById("overlayBG").style.display = "none";
    document.getElementById("overlayBG").style.visibility = "hidden";

    document.getElementById("EPopNameF").value = "";
    document.getElementById("EPopNameL").value = "";
    document.getElementById("EPopEmail").value = "";
    document.getElementById("EPopPhone").value = "";

}


function SubmitContact()
{
   
    document.getElementById("createEmptyField").style.display = "none";
    document.getElementById("createInvalidEmail").style.display = "none";
    document.getElementById("createServerError").style.display = "none";

   
    let firstNameField = document.getElementById("PopNameF");
    let lastNameField = document.getElementById("PopNameL");
    let emailField = document.getElementById("PopEmail");
    let phoneField = document.getElementById("PopPhone");

  
    let isValid = true;
    let hasEmptyFields = false;

    
    if (!validateEmptyCheck(firstNameField)) {
        setInvalid(firstNameField);
        hasEmptyFields = true;
    } else {
        setValid(firstNameField);
    }

    if (!validateEmptyCheck(lastNameField)) {
        setInvalid(lastNameField);
        hasEmptyFields = true;
    } else {
        setValid(lastNameField);
    }

    if (!validateEmptyCheck(emailField)) {
        setInvalid(emailField);
        hasEmptyFields = true;
    } else {
        setValid(emailField);
        
        if (!validateEmailCheck(emailField)) {
            setInvalid(emailField);
            document.getElementById("createInvalidEmail").style.display = "block";
            isValid = false;
        }
    }

    if (!validateEmptyCheck(phoneField)) {
        setInvalid(phoneField);
        hasEmptyFields = true;
    } else {
        setValid(phoneField);
    }

    if (hasEmptyFields) {
        document.getElementById("createEmptyField").style.display = "block";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // If validation passes, proceed with creating contact
    let ContNameF = firstNameField.value.trim();
    let ContNameL = lastNameField.value.trim();
    let ContEmail = emailField.value.trim();
    let ContPhone = phoneField.value.trim();

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
                    document.getElementById("createServerError").innerHTML = jsonObject.error;
                    document.getElementById("createServerError").style.display = "block";
                    return;
                } 

                // Close popup and refresh page to show new contact
                document.getElementById("ContactPopupMake").style.visibility = "hidden";
                window.location.reload();
        
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
       
    }

    exitContactPop();

}


function CreateContact(Contact,ContactId)
{
const ContactTab = document.createElement("div");
const ContactInfoContainer = document.createElement("div");
const ButtonContainer = document.createElement("div");
const Contactname = document.createElement("p");
const ContactEmail = document.createElement("p");
const ContactPhone = document.createElement("p");
const EditBut = document.createElement("button");
const DeleteBut = document.createElement("button");

ContactTab.style.visibility = "hidden";

ContactTab.className = "ContactTab";
ContactTab.id = ContactId;

// Create contact info container
ContactInfoContainer.style.display = "flex";
ContactInfoContainer.style.flex = "1";
ContactInfoContainer.style.gap = "20px";
ContactInfoContainer.style.alignItems = "center";

Contactname.className = "Contact_Name";
Contactname.readOnly = true;
Contactname.innerText = Contact.firstName + " " + Contact.lastName;

ContactEmail.className = "Contact_Email";
ContactEmail.readOnly = true;
ContactEmail.innerText = Contact.email;

ContactPhone.className = "Contact_Phone";
ContactPhone.readOnly = true;
ContactPhone.innerText = Contact.phone;

// Create button container
ButtonContainer.style.display = "flex";
ButtonContainer.style.gap = "10px";
ButtonContainer.style.alignItems = "center";

EditBut.className = "EDIT";
DeleteBut.className = "DELETE";

// Add accessibility labels for screen readers
EditBut.setAttribute('aria-label', 'Edit contact ' + Contact.firstName + ' ' + Contact.lastName);
DeleteBut.setAttribute('aria-label', 'Delete contact ' + Contact.firstName + ' ' + Contact.lastName);

EditBut.onclick = () => Edit(ContactId, Contact);
DeleteBut.onclick = () => DeleteCont(ContactTab,ContactId);

// Assemble the structure
ContactInfoContainer.appendChild(Contactname);
ContactInfoContainer.appendChild(ContactEmail);
ContactInfoContainer.appendChild(ContactPhone);

ButtonContainer.appendChild(EditBut);
ButtonContainer.appendChild(DeleteBut);

ContactTab.appendChild(ContactInfoContainer);
ContactTab.appendChild(ButtonContainer);

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
                    return;
                } 

                // Refresh page 
                window.location.reload();
        
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        
    }
}

function EditCont()
{
    // Clear all error messages at the start
    document.getElementById("editEmptyField").style.display = "none";
    document.getElementById("editInvalidEmail").style.display = "none";
    document.getElementById("editServerError").style.display = "none";

    // Get form fields
    let firstNameField = document.getElementById("EPopNameF");
    let lastNameField = document.getElementById("EPopNameL");
    let emailField = document.getElementById("EPopEmail");
    let phoneField = document.getElementById("EPopPhone");

    // Validate required fields
    let isValid = true;
    let hasEmptyFields = false;

    // Check for empty fields
    if (!validateEmptyCheck(firstNameField)) {
        setInvalid(firstNameField);
        hasEmptyFields = true;
    } else {
        setValid(firstNameField);
    }

    if (!validateEmptyCheck(lastNameField)) {
        setInvalid(lastNameField);
        hasEmptyFields = true;
    } else {
        setValid(lastNameField);
    }

    if (!validateEmptyCheck(emailField)) {
        setInvalid(emailField);
        hasEmptyFields = true;
    } else {
        setValid(emailField);
        // Check email format if not empty
        if (!validateEmailCheck(emailField)) {
            setInvalid(emailField);
            document.getElementById("editInvalidEmail").style.display = "block";
            isValid = false;
        }
    }

    if (!validateEmptyCheck(phoneField)) {
        setInvalid(phoneField);
        hasEmptyFields = true;
    } else {
        setValid(phoneField);
    }

    if (hasEmptyFields) {
        document.getElementById("editEmptyField").style.display = "block";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // If validation passes, proceed with editing contact
    const EditContact  = {
        userId,
        contactId: ContactEdited,
        firstName: firstNameField.value.trim(),
        lastName: lastNameField.value.trim(),
        email: emailField.value.trim(),
        phone: phoneField.value.trim()
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
                    document.getElementById("editServerError").innerHTML = jsonObject.error;
                    document.getElementById("editServerError").style.display = "block";
                    return;
                } 

                // Close popup and refresh page to show updated contact
                document.getElementById("ContactPopupEdit").style.visibility = "hidden";
                exitEditContactPop();
                ContactEdited = null;
                window.location.reload();
        
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        // Silent error handling
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
                    return;
                } 
                
                // First hide all contacts and remove any existing no results message
                const allContacts = document.querySelectorAll('.ContactTab');
                allContacts.forEach(contact => {
                    contact.style.visibility = "hidden";
                });
                
                // Remove any existing no results message
                const existingNoResults = document.getElementById("noResultsMessage");
                if (existingNoResults) {
                    existingNoResults.remove();
                }
                
                // Check if there are search results
                if (jsonObject.results.length === 0) {
                    // Show "no results" message
                    const noResultsDiv = document.createElement("div");
                    noResultsDiv.id = "noResultsMessage";
                    noResultsDiv.innerHTML = `
                        <div style="text-align: center; padding: 60px 20px; color: #888888; font-family: 'Press Start 2P', monospace; font-size: 14px; line-height: 1.6;">
                            <div style="margin-bottom: 20px; font-size: 48px;">🔍</div>
                            <div>NO CONTACTS FOUND</div>
                            <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">Try a different search term</div>
                        </div>
                    `;
                    document.getElementById("SearchList").appendChild(noResultsDiv);
                } else {
                    // Then show only matching contacts
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
                }
                
                ReArrainge();
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        // Silent error handling
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
                    return;
                } 
                
                // Clear existing contacts and messages
                document.getElementById("SearchList").innerHTML = "";
                
                // Check if there are any contacts
                if (jsonObject.results.length === 0) {
                    // Show "no contacts" message
                    const noContactsDiv = document.createElement("div");
                    noContactsDiv.id = "noContactsMessage";
                    noContactsDiv.innerHTML = `
                        <div style="text-align: center; padding: 60px 20px; color: #888888; font-family: 'Press Start 2P', monospace; font-size: 14px; line-height: 1.6;">
                            <div style="margin-bottom: 20px; font-size: 48px;">📇</div>
                            <div>NO CONTACTS CREATED YET</div>
                            <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">Click "CREATE CONTACT" to add your first contact</div>
                        </div>
                    `;
                    document.getElementById("SearchList").appendChild(noContactsDiv);
                } else {
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
            }
        };
        xhr.send(jsonPayload);
    } catch(err) {
      
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


