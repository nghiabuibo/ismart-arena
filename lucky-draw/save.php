<?php

$winner_order = $_POST['winner_order'] ?? null;
$clear = $_POST['clear'] ?? null;
$source = $_GET['source'] ?? null;
$myFile = $source === 'ggsheet' ? "result_ggsheet.json" : "result.json";
$fh = fopen(__DIR__ . '/result/' . $myFile, 'w') or die("can't open file");
if ($clear != '1') {
	fwrite($fh, json_encode($winner_order));
} else {
	fwrite($fh, json_encode(new stdClass));
}
fclose($fh)

?>