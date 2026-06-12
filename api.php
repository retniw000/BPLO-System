<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once "db.php";

$method = $_SERVER['REQUEST_METHOD'];
$table  = $_GET['table'] ?? '';
$body   = json_decode(file_get_contents("php://input"), true);

// ── Special case: cascade-delete an entire Application in one transaction ─────
if ($method === 'DELETE' && $table === 'fullApplication') {
    $lcn = $body['LCN'] ?? $_GET['LCN'] ?? null;
    
    if (!$lcn) {
        http_response_code(400);
        echo json_encode(["error" => "LCN is required for a full-application delete."]);
        exit();
    }

    $authRepID       = $body['Auth_Rep_ID']       ?? $_GET['Auth_Rep_ID']       ?? null;
    $safetyOfficerID = $body['Safety_Officer_ID'] ?? $_GET['Safety_Officer_ID'] ?? null;
    $tin             = $body['TIN']               ?? $_GET['TIN']               ?? null;

    $conn->begin_transaction();
    try {
        // 1 — Operations (must go first; FK child of Application)
        $stmt = $conn->prepare("DELETE FROM `establishment_operations` WHERE `LCN` = ?");
        $stmt->bind_param("s", $lcn);
        $stmt->execute();

        // 2 — Application
        $stmt = $conn->prepare("DELETE FROM `application` WHERE `LCN` = ?");
        $stmt->bind_param("s", $lcn);
        $stmt->execute();

        // 3 — Auth Rep (skip if another Application still points to it)
        if ($authRepID) {
            $stmt = $conn->prepare(
                "DELETE FROM `auth_rep`
                  WHERE `Auth_Rep_ID` = ?
                    AND NOT EXISTS (
                        SELECT 1 FROM `application` WHERE `Auth_Rep_ID` = ?
                    )"
            );
            $stmt->bind_param("ss", $authRepID, $authRepID);
            $stmt->execute();
        }

        // 4 — Safety Officer (same guard)
        if ($safetyOfficerID) {
            $stmt = $conn->prepare(
                "DELETE FROM `safety_officer`
                  WHERE `Safety_Officer_ID` = ?
                    AND NOT EXISTS (
                        SELECT 1 FROM `application` WHERE `Safety_Officer_ID` = ?
                    )"
            );
            $stmt->bind_param("ss", $safetyOfficerID, $safetyOfficerID);
            $stmt->execute();
        }

        // 5 — Taxpayer (same guard)
        if ($tin) {
            $stmt = $conn->prepare(
                "DELETE FROM `taxpayer`
                  WHERE `TIN` = ?
                    AND NOT EXISTS (
                        SELECT 1 FROM `application` WHERE `TIN` = ?
                    )"
            );
            $stmt->bind_param("ss", $tin, $tin);
            $stmt->execute();
        }

        $conn->commit();
        echo json_encode(["success" => true]);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit();
}

// ── SPECIAL CASE: Update an entire Application in one transaction ─────────────
if ($method === 'PUT' && $table === 'fullApplication') {
    if (empty($body['app']['LCN'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing LCN in app object."]);
        exit();
    }

    $conn->begin_transaction();
    try {
        if (isset($body['authRep']['Auth_Rep_Position'])) {
            $body['app']['Auth_Rep_Position'] = $body['authRep']['Auth_Rep_Position'];
            unset($body['authRep']['Auth_Rep_Position']);
        }

        // 1. Update Core Application
        if (!empty($body['app'])) {
            updateRow($conn, "application", $body['app'], ["LCN" => $body['app']['LCN']]);
        }
        // 2. Update Taxpayer
        if (!empty($body['taxpayer']) && !empty($body['taxpayer']['TIN'])) {
            updateRow($conn, "taxpayer", $body['taxpayer'], ["TIN" => $body['taxpayer']['TIN']]);
        }
        // 3. Update Auth Rep
        if (!empty($body['authRep']) && !empty($body['authRep']['Auth_Rep_ID'])) {
            updateRow($conn, "auth_rep", $body['authRep'], ["Auth_Rep_ID" => $body['authRep']['Auth_Rep_ID']]);
        }
        // 4. Update Safety Officer
        if (!empty($body['safetyOfficer']) && !empty($body['safetyOfficer']['Safety_Officer_ID'])) {
            updateRow($conn, "safety_officer", $body['safetyOfficer'], ["Safety_Officer_ID" => $body['safetyOfficer']['Safety_Officer_ID']]);
        }
        // 5. Update LOB and Operations
        if (!empty($body['lob']) && !empty($body['lob']['PSIC'])) {
            if (isset($body['lob']['Line_of_Business'])) {
                updateRow($conn, "lob", 
                    ["Line_of_Business" => $body['lob']['Line_of_Business']], 
                    ["PSIC" => $body['lob']['PSIC']]
                );
            }
            $opsData = [
                "Nature_of_Business" => $body['lob']['Nature_of_Business'] ?? '',
                "Number_of_Units"    => $body['lob']['Number_of_Units'] ?? 0,
                "LOB_Gross_Sales"    => $body['lob']['LOB_Gross_Sales'] ?? 0
            ];
            updateRow($conn, "establishment_operations", $opsData, [
                "LCN" => $body['app']['LCN'],
                "PSIC" => $body['lob']['PSIC']
            ]);
        }

        $conn->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit();
}

// Map frontend table names to DB table names and their primary keys
$tables = [
    "applications"   => ["db" => "application",              "pk" => ["LCN"]],
    "taxpayers"      => ["db" => "taxpayer",                 "pk" => ["TIN"]],
    "authReps"       => ["db" => "auth_rep",                 "pk" => ["Auth_Rep_ID"]],
    "safetyOfficers" => ["db" => "safety_officer",           "pk" => ["Safety_Officer_ID"]],
    "lobs"           => ["db" => "lob",                      "pk" => ["PSIC"]],
    "operations"     => ["db" => "establishment_operations", "pk" => ["LCN", "PSIC"]],
];

if (!array_key_exists($table, $tables)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid table: $table"]);
    exit();
}

$dbTable = $tables[$table]["db"];
$pks     = $tables[$table]["pk"];

// ── GET ──────────────────────────────────────────────────────────────────────
if ($method === "GET") {
    $result = $conn->query("SELECT * FROM `$dbTable`");
    if (!$result) { http_response_code(500); echo json_encode(["error" => $conn->error]); exit(); }
    $rows = [];
    while ($row = $result->fetch_assoc()) $rows[] = $row;
    echo json_encode($rows);
}

// ── POST (insert) ─────────────────────────────────────────────────────────────
elseif ($method === "POST") {
    if (empty($body)) { http_response_code(400); echo json_encode(["error" => "No data"]); exit(); }

    if ($table === "applications" && isset($body['app'])) {
        $conn->begin_transaction();
        try {
            if (empty($body['taxpayer']) || empty($body['authRep']) || empty($body['safetyOfficer']) || empty($body['lobs'])) {
                throw new Exception("Missing taxpayer, authRep, safetyOfficer, or lobs data in full application payload.");
            }

            insertOrIgnore($conn, "taxpayer", $body['taxpayer']);
            
            $authRepRow = $body['authRep'];
            $position   = $authRepRow['Auth_Rep_Position'] ?? null;
            unset($authRepRow['Auth_Rep_Position']);

            insertOrIgnore($conn, "auth_rep", $authRepRow);
            insertOrIgnore($conn, "safety_officer", $body['safetyOfficer']);

            $authRepEmail = $authRepRow['Auth_Rep_Email'] ?? null;
            $safetyEmail  = $body['safetyOfficer']['Safety_Officer_Email'] ?? null;

            if (!$authRepEmail) throw new Exception('Auth_Rep_Email is required to resolve Auth_Rep_ID.');
            if (!$safetyEmail)  throw new Exception('Safety_Officer_Email is required to resolve Safety_Officer_ID.');

            $stmt = $conn->prepare("SELECT `Auth_Rep_ID` FROM `auth_rep` WHERE `Auth_Rep_Email` = ? LIMIT 1");
            $stmt->bind_param("s", $authRepEmail);
            $stmt->execute();
            $res = $stmt->get_result();
            $authRepId = ($res && $res->num_rows) ? $res->fetch_assoc()['Auth_Rep_ID'] : null;

            $stmt = $conn->prepare("SELECT `Safety_Officer_ID` FROM `safety_officer` WHERE `Safety_Officer_Email` = ? LIMIT 1");
            $stmt->bind_param("s", $safetyEmail);
            $stmt->execute();
            $res = $stmt->get_result();
            $safetyOfficerId = ($res && $res->num_rows) ? $res->fetch_assoc()['Safety_Officer_ID'] : null;

            if (!$authRepId)       throw new Exception('Failed to resolve Auth_Rep_ID from Auth_Rep_Email: ' . $authRepEmail);
            if (!$safetyOfficerId) throw new Exception('Failed to resolve Safety_Officer_ID from Safety_Officer_Email: ' . $safetyEmail);

            foreach ($body['lobs'] as $lob) { 
                if (empty($lob['PSIC'])) continue; 
                insertOrIgnore($conn, "lob", ["PSIC" => $lob['PSIC'], "Line_of_Business" => $lob['Line_of_Business'] ?? '']);
            }

            $app = $body['app'];
            $app['TIN']               = $body['taxpayer']['TIN'];
            $app['Auth_Rep_ID']       = $authRepId;
            $app['Auth_Rep_Position'] = $position;
            $app['Safety_Officer_ID'] = $safetyOfficerId;
            
            insertRow($conn, "application", $app);

            foreach ($body['lobs'] as $lob) {
                if (empty($lob['PSIC'])) continue;
                insertRow($conn, "establishment_operations", [
                    "LCN"                => $app['LCN'],
                    "PSIC"               => $lob['PSIC'],
                    "Nature_of_Business" => $lob['Nature_of_Business'] ?? '',
                    "Number_of_Units"    => $lob['Number_of_Units'] ?? 0,
                    "LOB_Gross_Sales"    => $lob['LOB_Gross_Sales'] ?? 0,
                ]);
            }

            $conn->commit();
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            $conn->rollback();
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    } else {
        try {
            insertRow($conn, $dbTable, $body);
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}

// ── PUT (update generic) ──────────────────────────────────────────────────────────────
elseif ($method === "PUT") {
    if (empty($body)) { http_response_code(400); echo json_encode(["error" => "No data provided for update."]); exit(); }

    $setClauses = [];
    $params     = [];
    $types      = "";

    foreach ($body as $col => $val) {
        if (in_array($col, $pks)) continue;
        $setClauses[] = "`$col` = ?";
        $params[]     = $val;
        $types       .= "s";
    }

    if (empty($setClauses)) {
        http_response_code(400);
        echo json_encode(["error" => "No valid fields provided to update."]);
        exit();
    }

    $whereClauses = [];
    foreach ($pks as $pk) {
        $pkValue = $body[$pk] ?? $_GET[$pk] ?? null;

        if ($pkValue === null) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required primary key: $pk"]);
            exit();
        }
        $whereClauses[] = "`$pk` = ?";
        $params[]       = $pkValue;
        $types         .= "s";
    }

    $sql  = "UPDATE `$dbTable` SET " . implode(", ", $setClauses) . " WHERE " . implode(" AND ", $whereClauses);
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "SQL Prepare failed: " . $conn->error]);
        exit();
    }

    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "affected" => $stmt->affected_rows]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Update failed: " . $stmt->error]);
    }
}

// ── DELETE (delete generic) ────────────────────────────────────────────────────────────────────
elseif ($method === "DELETE") {
    if (empty($body)) { http_response_code(400); echo json_encode(["error" => "No data"]); exit(); }

    $whereClauses = [];
    $params       = [];
    $types        = "";

    foreach ($pks as $pk) {
        if (!isset($body[$pk])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required primary key: $pk"]);
            exit();
        }
        $whereClauses[] = "`$pk` = ?";
        $params[]       = $body[$pk];
        $types         .= "s";
    }

    $sql  = "DELETE FROM `$dbTable` WHERE " . implode(" AND ", $whereClauses);
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "SQL Prepare failed: " . $conn->error]);
        exit();
    }

    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "affected" => $stmt->affected_rows]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Delete failed: " . $stmt->error]);
    }
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function insertRow($conn, $table, $data) {
    if (empty($data)) return; 

    $cols         = implode(", ", array_map(fn($c) => "`$c`", array_keys($data)));
    $placeholders = implode(", ", array_fill(0, count($data), "?"));
    $types        = str_repeat("s", count($data));
    $params       = array_values($data);

    $sql  = "INSERT INTO `$table` ($cols) VALUES ($placeholders)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new Exception($conn->error);
    $stmt->bind_param($types, ...$params);
    if (!$stmt->execute()) throw new Exception($stmt->error);
}

function insertOrIgnore($conn, $table, $data) {
    if (empty($data)) return; 

    $cols         = implode(", ", array_map(fn($c) => "`$c`", array_keys($data)));
    $placeholders = implode(", ", array_fill(0, count($data), "?"));
    $types        = str_repeat("s", count($data));
    $params       = array_values($data);

    $sql  = "INSERT IGNORE INTO `$table` ($cols) VALUES ($placeholders)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new Exception($conn->error);
    $stmt->bind_param($types, ...$params);
    if (!$stmt->execute()) throw new Exception($stmt->error);
}

function updateRow($conn, $table, $data, $conditions) {
    foreach ($conditions as $pk => $val) {
        unset($data[$pk]);
    }

    if (empty($data)) return; 

    $setClauses = [];
    $params     = [];
    $types      = "";

    foreach ($data as $col => $val) {
        $setClauses[] = "`$col` = ?";
        $params[]     = $val;
        $types       .= "s";
    }

    $whereClauses = [];
    foreach ($conditions as $col => $val) {
        $whereClauses[] = "`$col` = ?";
        $params[]       = $val;
        $types         .= "s";
    }

    $sql  = "UPDATE `$table` SET " . implode(", ", $setClauses) . " WHERE " . implode(" AND ", $whereClauses);
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) throw new Exception("Prepare failed for $table: " . $conn->error);
    
    $stmt->bind_param($types, ...$params);
    if (!$stmt->execute()) throw new Exception("Execute failed for $table: " . $stmt->error);
}
?>