<?php if (file_exists(__DIR__ . '/config.php')) include_once(__DIR__ . '/config.php'); ?>
<?php
$source = $_GET['source'] ?? '';
function getData($source)
{
	if ($source === 'ggsheet') {
		$api_url = defined('GG_API_URL') ? GG_API_URL : '';
		$token = defined('GG_TOKEN') ? GG_TOKEN : '';

		$sheet_name = defined('GG_SHEET_NAME') ? GG_SHEET_NAME : '';
		$sheet_range = defined('GG_SHEET_RANGE') ? GG_SHEET_RANGE : '';
		$params = '/values/'.urlencode($sheet_name).'!'.$sheet_range.'?key=';
		$spreadsheet_id = defined('GG_SPREADSHEET_ID') ? GG_SPREADSHEET_ID : '';
		$json = file_get_contents($api_url.$spreadsheet_id.$params.$token);
		$data_arr = json_decode($json)->values;
		$data = array_map(function($entry) {
			return [
				'id' => $entry[0] ?? '',
				'phone' => $entry[1] ?? '',
				'name' => $entry[2] ?? ''
			];
		}, $data_arr);
		return $data;
	}

	$api_url = defined('API_URL') ? API_URL : '';
	$token = defined('RESULT_TOKEN') ? RESULT_TOKEN : '';

	$params = [
		'filters[results][answers][$not]' => 'null'
	];
	$endpoint = $api_url . '/users?' . http_build_query($params);

	// Initialize cURL session
	$ch = curl_init();

	// Set cURL options
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
		'Authorization: Bearer ' . $token,
	]);
	curl_setopt($ch, CURLOPT_URL, $endpoint);

	// Execute cURL session and get the result
	$response = curl_exec($ch);

	// Check for errors
	if (curl_errno($ch)) {
		echo 'Curl error: ' . curl_error($ch);
	}

	// Close cURL session
	curl_close($ch);

	// Output the response
	$data = json_decode($response, true);

	return $data;
}
?>
<?php $cache = '240122'; ?>
<!DOCTYPE html>
<html lang="vi-VN">

<head>
	<meta charset="utf-8" />
	<meta content="width=device-width, initial-scale=1" name="viewport" />
	<link href="http://gmpg.org/xfn/11" rel="profile" />
	<title>
		Lucky Draw - iSmart Online
	</title>
	<meta content="vi_VN" property="og:locale" />
	<meta content="article" property="og:type" />
	<meta content="Lucky Draw - iSmart Online" property="og:title" />
	<meta content="Lucky Draw - iSmart Online" property="og:description" />
	<meta content="iSmart Online" property="og:site_name" />
	<meta content="assets/imgs/bg.jpg" property="og:image" />
	<meta content="Lucky Draw - iSmart Online" name="twitter:card" />
	<meta content="Lucky Draw - iSmart Online" name="twitter:description" />
	<meta content="Lucky Draw - iSmart Online" name="twitter:title" />
	<meta content="assets/imgs/bg.jpg" name="twitter:image" />
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
	<link rel="icon" href="favicon.ico" type="image/ico" />

	<link rel="stylesheet" type="text/css" href="assets/css/main.css?v=<?php echo $cache; ?>" />
</head>

<body>
	<div class="container wrapper">
		<div class="row g-md-5">
			<div class="col text-end">
				<img class="logo" src="assets/imgs/ism-logo.png" />
			</div>
			<div class="col">
				<img class="logo" src="assets/imgs/event-logo.png" />
			</div>
		</div>
		<div class="row">
			<h1 class="text-center display-1 fw-bold title my-3">Lucky Draw</h1>
		</div>
		<div class="row mt-3">
			<div class="col actions text-center">
				<button class="btn btn-primary" id="show_list" data-bs-target="#winner_list" data-bs-toggle="modal">Xem danh sách</button>
			</div>
		</div>
		<div class="row">
			<?php
			$prizeRow1 = [
				1 => 10,
				2 => 2,
				3 => 2
			];
			foreach ($prizeRow1 as $id => $prizeQuantity) {
			?>
				<div class="col-md-4">
					<div class="prize-block" data-prize-quantity="<?php echo $prizeQuantity; ?>" data-img="assets/imgs/prize-<?php echo $id; ?>.png?v=<?php echo $cache; ?>">
						<img class="img-fluid prize-img" src="assets/imgs/prize-<?php echo $id; ?>.png?v=<?php echo $cache; ?>" role="button" data-bs-target="#prize_list" data-bs-toggle="modal" />
						<div class="prize-id text-center fw-bold mt-3 lead"></div>
						<div class="prize-name text-center fw-bold"></div>
						<div class="prize-phone text-center fw-bold"></div>
						<div class="text-center mt-3">
							<button class="btn btn-success start-random" data-bs-target="#winner_list" data-bs-toggle="modal">Quay số</button>
						</div>
					</div>
				</div>
			<?php } ?>
		</div>
		<div class="row">
			<?php
			$prizeRow2 = [
				4 => 1,
				5 => 1,
			];
			foreach ($prizeRow2 as $id => $prizeQuantity) {
			?>
				<div class="col-md-4 <?php if ($id === 4) echo 'offset-md-2'; ?>">
					<div class="prize-block" data-prize-quantity="<?php echo $prizeQuantity; ?>" data-img="assets/imgs/prize-<?php echo $id; ?>.png?v=<?php echo $cache; ?>">
						<img class="img-fluid prize-img" src="assets/imgs/prize-<?php echo $id; ?>.png?v=<?php echo $cache; ?>" role="button" data-bs-target="#prize_list" data-bs-toggle="modal" />
						<div class="prize-id text-center fw-bold mt-3 lead"></div>
						<div class="prize-name text-center fw-bold"></div>
						<div class="prize-phone text-center fw-bold"></div>
						<div class="text-center mt-3">
							<button class="btn btn-success start-random" data-bs-target="#winner_list" data-bs-toggle="modal">Quay số</button>
						</div>
					</div>
				</div>
			<?php } ?>
		</div>
	</div>

	<audio src="assets/bgm.mp3" type="audio/mpeg" id="bgm">
		Your browser does not support the audio element.
	</audio>

	<div id="list_control">
		<button type="button" class="btn btn-danger" id="clear_list">
			Xóa danh sách
		</button>
	</div>

	<!-- Modal -->
	<div class="modal fade" id="winner_list" tabindex="-1" aria-labelledby="winner_list_label" aria-hidden="true">
		<div class="modal-dialog modal-fullscreen">
			<div class="modal-content">
				<div class="modal-body">
					<!--<button class="btn btn-light" id="toggle_size">Small</button>-->
					<div class="prize-blocks">
						<?php
						$data = getData($source);

						if ($data) {
							foreach ($data as $key => $entry) {
								$id = $entry['id'] ?? '';
								if (!$id) continue;

								$name = $entry['name'] ?? '';
								$phone = $entry['phone'] ?? '';
								if ($phone) $phone = '******' . substr($phone, -4);

								$region = $entry['grade'] ?? '';

								$tooltip = [];
								if ($name) $tooltip[] = $name;
								if ($phone) $tooltip[] = $phone;
								$tooltip_html = implode('<br/>', $tooltip);

								echo "<span type='button' class='block' data-id='$id' data-region='$region' data-bs-toggle='tooltip' data-bs-html='true' data-name='$name' data-phone='$phone' title='$tooltip_html'>$id</span>";
							}
						} else {
							echo '<span class="text-white">No data set!</span>';
						}
						?>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn close btn-secondary" data-bs-dismiss="modal">Quay về</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Prize Modal -->
	<div class="modal fade" id="prize_list" tabindex="-1" aria-labelledby="winner_list_label" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-lg">
			<div class="modal-content">
				<div class="modal-body">
					<div class="row align-items-center">
						<div class="col-lg-4">
							<img class="img-fluid prize-img" id="prize_list_img" src="" />
						</div>
						<div class="col-lg-8">
							<table class="table table-bordered" id="prize_list_table">
								<thead>
									<tr>
										<th>STT</th>
										<th>ID</th>
										<th>Tên</th>
										<th>Số điện thoại</th>
									</tr>
								</thead>
								<tbody>

								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn close btn-secondary" data-bs-dismiss="modal">Quay về</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Dialog -->
	<div id="dialog" class="dialog">
		<div class="dialog-content">
			<img class="dialog-img img-fluid" src="assets/imgs/400.svg" />
			<div class="p-3 text-center fw-bold">
				<p class="dialog-id lead fw-bold"></p>
				<p class="dialog-name"></p>
				<p class="dialog-phone"></p>
				<button class="btn btn-secondary" onclick="closeDialog()">Đóng</button>
			</div>
		</div>
	</div>

	<script src="https://code.jquery.com/jquery-3.7.0.min.js" integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g=" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
	<script type="text/javascript">
		const RESULT_SOURCE = '<?php echo $source; ?>';
	</script>
	<script type="text/javascript" src="assets/js/main.js?v=<?php echo $cache; ?>"> </script>
</body>

</html>