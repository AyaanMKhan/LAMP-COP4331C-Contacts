<?php

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(204); 
    exit(); 
}

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

$inData = getRequestInfo();

// Fallbacks if JSON body missing userId
if (!isset($inData["userId"]) && isset($_REQUEST['userId'])) {
    $inData["userId"] = (int)$_REQUEST['userId'];
}
if (!isset($inData["userId"]) && isset($_COOKIE['userId'])) {
    $inData["userId"] = (int)$_COOKIE['userId'];
}

if (!isset($inData["userId"]) || (int)$inData["userId"] <= 0) {
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
    // Return empty results array instead of error
    returnWithInfo("");
} else {
    returnWithInfo($searchResults);
}

$stmt->close();
$conn->close();

function getRequestInfo()
{
    // 1) JSON body
    $raw = file_get_contents('php://input');
    if ($raw !== false && $raw !== '') {
        $data = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
            return $data;
        }
        // also handle x-www-form-urlencoded body sent without $_POST
        parse_str($raw, $out);
        if (!empty($out)) return $out;
    }
    // 2) Form POST
    if (!empty($_POST)) return $_POST;
    // 3) GET query
    if (!empty($_GET)) return $_GET;

    return [];
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    header('Content-type: application/json');
    echo json_encode(["results"=>[], "error"=>$err]);
    exit();
}

function returnWithInfo($searchResults)
{
    header('Content-type: application/json');
    echo '{"results":[' . $searchResults . '],"error":""}';
    exit();
}
	
?>
