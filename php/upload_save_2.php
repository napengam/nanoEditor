<?php

$cd = getcwd();
$payload = [];
$payload['error'] = '';

if (isset($_POST['submit']) && $_POST['submit'] === "Speichern") {
    $uploadedFile = $_FILES['uploadedFile'];
    $nonoExtensions = ['bad', 'exe', 'vbs', 'pl'];
    $fileExtension = strtolower(pathinfo($uploadedFile['name'], PATHINFO_EXTENSION));
    if (in_array($fileExtension, $nonoExtensions)) {
        $payload['error'] = "<h2>Dateien dieses Typs werden nicht hochgeladen</h2>";
    } else {
        $path = $_POST['path'];
        $target_path = $path . time() . '_' . basename($uploadedFile['name']);
        if (file_exists($target_path)) {
            unlink($target_path);
        }
        if (move_uploaded_file($uploadedFile['tmp_name'], $target_path)) {
            $hw = getimagesize($target_path);
            $ratio = calculateAspectRatioFit($hw[0], $hw[1], 400, 300);
        } else {
            $payload['error'] = "<h2>";
            $payload['error'] .= !file_exists($path) ? "Verzeichnis $path nicht gefunden" : "Fehler beim Laden (Datei größer als 100 KB?); bitte erneut versuchen";
            $payload['error'] .= "</h2>";
        }
    }
} else {
    $payload['error'] = "HILFE";
}


$payload['result'] = $target_path;
$payload['width'] = ($hw[0] + 0.0) * $ratio;
$payload['height'] = ($hw[1] + 0.0) * $ratio;
echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);

function calculateAspectRatioFit($srcWidth, $srcHeight, $maxWidth, $maxHeight) {
    $ratio = 1;
    if ($srcWidth > $maxWidth || $srcHeight > $maxHeight) {
        $ratio = min($maxWidth / $srcWidth, $maxHeight / $srcHeight);
    }
    return $ratio;
}

?>
