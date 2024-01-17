<?php

$winner_order = $_POST['winner_order'] ?? null;
$clear = $_POST['clear'] ?? null;
$myFile = "result.json";
$fh = fopen($myFile, 'w') or die("can't open file");
if ($clear != '1') {
	fwrite($fh, json_encode($winner_order));
} else {
	fwrite($fh, json_encode(new stdClass));
}
fclose($fh)

?>