<?php

//$json = @file_get_contents('php://input');
//$payload = json_decode($json, true);
//$_POST = $payload;
$cd = getcwd();
//chdir('..');

/**
  function exception_error_handler($errno, $errstr, $errfile, $errline) {
  throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
  }
  set_error_handler("exception_error_handler");* */
$cd = getcwd();
$payload = [];
$payload['error'] = '';

if (isset($_POST['submit']) && $_POST['submit'] == "Speichern") {
    if (preg_match('/\.bad$|\.exe$|\.vbs$|\.pl$/', basename($_FILES['uploadedfile']['name'])) < 1) {

        // Where the file is going to be placed
        //echo $_FILES['uploadedfile']['name'];
        $path = $_POST['path'];
        $target_path = $path . time() . '_' . basename($_FILES['uploadedfile']['name']);
        if (file_exists($target_path)) {
            unlink($target_path);
        }
        if (move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
            $hw = getimagesize($target_path);
            $ratio = calculateAspectRatioFit($hw[0], $hw[1], 400, 300);
        } else {
            if (!file_exists($path)) {
                $payload['error'] = "<h2>Directory $path nicht gefunden </h2>";
            } else {
                $payload['error'] = "<h2>Fehler beim laden (Datei größer 100KB ??); bitte nochmals versuchen</h2>";
            }
        }
    } else {
        $payload['error'] = "<h2>Datein diesen Typs werden nicht hochgeladen</h2>";
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
