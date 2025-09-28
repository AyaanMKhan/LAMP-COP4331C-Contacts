<?php

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

$inData = getRequestInfo();


if (!isset($inData["userId"])) {
    returnWithError("userId is required");
    exit();
}

$searchTerm = isset($inData["search"]) ? trim($inData["search"]) : "";


$isEmptySearch = ($searchTerm === "");

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "COP##4331C", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}


if ($isEmptySearch) {
    // Return all contacts for this user
    $stmt = $conn->prepare("SELECT Id, first_name, last_name, email, phone FROM Contacts WHERE userId=?");
    $stmt->bind_param("i", $inData["userId"]);
} else {
    $stmt = $conn->prepare(
        "SELECT Id, first_name, last_name, email, phone
         FROM Contacts
         WHERE userId=? AND (first_name LIKE ? OR last_name LIKE ?)"
    );
    $like = "%".$searchTerm."%";
    $stmt->bind_param("iss", $inData["userId"], $like, $like);
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
    // Try JSON body first
    $inputData = file_get_contents('php://input');
    if ($inputData) {
        $data = json_decode($inputData, true);
        if (is_array($data)) return $data;
    }
    // Fallback to query params (GET) if no JSON body
    if (!empty($_GET)) return $_GET;

    // Default empty array so we can set defaults downstream
    return [];
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
