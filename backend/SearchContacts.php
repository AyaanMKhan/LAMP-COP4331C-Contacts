<?php

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

$inData = getRequestInfo();

// If no input data received, return error for userId
if (empty($inData) || !isset($inData["userId"]) || $inData["userId"] <= 0) {
    returnWithError("Valid userId is required");
    exit();
}


if (!isset($inData["search"])) {
    $inData["search"] = "";
}

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "COP##4331C", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}


$searchTerm = trim($inData["search"]);
if (empty($searchTerm) || $searchTerm === "") {
   
    $stmt = $conn->prepare("SELECT Id, first_name, last_name, email, phone FROM Contacts WHERE userId=?");
    if (!$stmt) {
        returnWithError($conn->error);
        exit();
    }
    $stmt->bind_param("i", $inData["userId"]);
} else {
    
    $stmt = $conn->prepare("SELECT Id, first_name, last_name, email, phone FROM Contacts WHERE userId=? AND (first_name LIKE ? OR last_name LIKE ?)");
    if (!$stmt) {
        returnWithError($conn->error);
        exit();
    }
    $searchTerm = "%" . $searchTerm . "%";
    $stmt->bind_param("iss", $inData["userId"], $searchTerm, $searchTerm);
}

if (!$stmt->execute()) {
    returnWithError("SQL Execution Error: " . $stmt->error);
    exit();
}

$result = $stmt->get_result();

while($row = $result->fetch_assoc()) {
    if ($searchCount > 0) {
        $searchResults .= ",";
    }
    $searchCount++;
    $searchResults .= '{"id":' . $row["Id"] . ',"firstName":"' . $row["first_name"] . '","lastName":"' . $row["last_name"] . '","email":"' . $row["email"] . '","phone":"' . $row["phone"] . '"}';
}

if ($searchCount == 0) {
    if (empty(trim($inData["search"]))) {
        returnWithError("No contacts found for user " . $inData["userId"]);
    } else {
        returnWithError("No Records Found");
    }
} else {
    returnWithInfo($searchResults);
}

$stmt->close();
$conn->close();

function getRequestInfo()
{
    $inputData = file_get_contents('php://input');
    if ($inputData) {
        return json_decode($inputData, true);
    } else {
        return array();
    }
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"results":[' . $searchResults . '],"error":""}';
    sendResultInfoAsJson($retValue);
}
	
?>
