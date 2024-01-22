const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl)
})

const bgm = document.getElementById("bgm");

function openDialog() {
	var dialog = document.getElementById("dialog");
	dialog.style.display = "flex";
}

function closeDialog() {
	var dialog = document.getElementById("dialog");
	dialog.style.display = "none";
}

function initRandom() {
	$.getJSON("result.json?" + Date.now(), function (result) {
		if (!result || !Object.keys(result).length) return;

		for (let index in result) {
			const winnerIDs = result[index]
			winnerIDs.forEach(id => {
				setWinner(index, id)
			})
		}

		$('#list_control').addClass('active')
	});
}
initRandom();

function saveResult() {
	const winner_order = []
	$('.prize-block').each(function () {
		const winnerIDsStr = $(this).data('winner-id')
		const winnerIDs = winnerIDsStr ? winnerIDsStr.split(',') : []
		winner_order.push(winnerIDs)
	})
	$.ajax({
		type: "POST",
		dataType: 'json',
		url: 'save.php',
		data: { winner_order: winner_order },
	});
}

function setWinner(index, id) {
	if (!id) return;

	// set data attr
	const prizeBlock = $('.prize-block').eq(index)
	const winnerIDsStr = prizeBlock.data('winner-id')
	const winnerIDs = winnerIDsStr ? winnerIDsStr.split(',') : []
	winnerIDs.push(id)
	prizeBlock.data('winner-id', winnerIDs.join(','))

	// get info from blocks
	const block = $(`.block[data-id="${id}"]`)
	const name = block.data('name')
	const phone = block.data('phone')
	const img = prizeBlock.data('img')

	// set prize blocks info
	prizeBlock.find('.prize-id').text(winnerIDs.join(' - '))
	// prizeBlock.find('.prize-name').text(name)
	// prizeBlock.find('.prize-phone').text(phone)
	// prizeBlock.find('.prize-img').attr('src', img)

	// set blocks final class
	$(`.block[data-id="${id}"]`).addClass('final');

	// set dialog info
	const dialog = $('#dialog')
	dialog.find('.dialog-id').text(id)
	dialog.find('.dialog-name').text(name)
	dialog.find('.dialog-phone').text(phone)
	dialog.find('.dialog-img').attr('src', img)
}

function random(index, steps, interval, region) {
	const ids = [];
	const idsRegion = []
	let blocks = $('.block').not('.final')
	blocks.each(function () {
		const id = $(this).data('id')
		ids.push(id)
	})
	if (region) blocks = blocks.filter(`[data-region="${region}"]`);
	blocks.each(function () {
		const id = $(this).data('id')
		idsRegion.push(id)
	})

	let currentStep = 0
	let highlight = setInterval(function () {
		let randomIndex = null
		while (randomIndex === null || $(`.block[data-id="${ids[randomIndex]}"]`).hasClass('final')) {
			randomIndex = Math.floor((Math.random() * ids.length));
		}
		const randomID = ids[randomIndex]
		const randomBlock = $(`.block[data-id="${randomID}"]`)

		randomBlock.addClass('highlight');
		let timeout = setTimeout(function () {
			randomBlock.removeClass('highlight');
		}, interval);

		currentStep++
		if (currentStep > steps) {
			clearInterval(highlight)

			setTimeout(() => {
				let randomIndexRegion = null
				let retries = 0
				while (
					(randomIndexRegion === null || $(`.block[data-id="${idsRegion[randomIndexRegion]}"]`).hasClass('final'))
					&& retries < 20
				) {
					randomIndexRegion = Math.floor((Math.random() * idsRegion.length));
					retries++
				}
				const randomIDRegion = idsRegion[randomIndexRegion]

				setWinner(index, randomIDRegion)
				saveResult()
			}, interval)

			// show congratulations
			// if (randomIDRegion) {
			// 	setTimeout(openDialog, 3 * interval)
			// 	// openDialog()
			// }
		}
	}, interval);
}

$('.start-random').on('click', function () {
	const currentPrize = $(this).closest('.prize-block')

	if (!currentPrize.length) return;
	if (currentPrize.data('winner-id')) return;

	$('.close').addClass('d-none');
	bgm.play();

	const prizeQuantity = currentPrize.data('prize-quantity')
	const index = $('.prize-block').index(currentPrize)
	const region = currentPrize.data('region')
	const steps = 20
	const interval = 300
	const duration = (steps + 3) * interval

	for (i = 0; i < prizeQuantity; i++) {
		const delay = i * 100
		setTimeout(() => {
			random(index, steps, interval, region)
		}, delay)
	}

	setTimeout(() => {
		$('.close').removeClass('d-none');
		bgm.pause();
		bgm.currentTime = 0
		currentPrize.find('.prize-img').trigger('click')
	}, duration + prizeQuantity * 100)
});

$('.prize-img').on('click', function () {
	const currentPrize = $(this).closest('.prize-block')
	const winnerIDsStr = currentPrize.data('winner-id')
	const winnerIDs = winnerIDsStr ? winnerIDsStr.split(',') : []

	const img = currentPrize.data('img')
	$('#prize_list_img').attr('src', img)

	$('#prize_list_table tbody').html('')

	winnerIDs.forEach((id, index) => {
		// get info from blocks
		const block = $(`.block[data-id="${id}"]`)
		const name = block.data('name')
		const phone = block.data('phone')

		$('#prize_list_table tbody').append(`
			<tr>
				<td>${index + 1}</td>
				<td>${id}</td>
				<td>${name}</td>
				<td>${phone}</td>
			</tr>
		`)
	})
})

$('#clear_list').on('click', function () {
	var passcode = prompt("Please enter passcode");
	if (passcode !== 'abc@123') return;

	$.ajax({
		type: "POST",
		url: 'save.php',
		data: { clear: '1' },
		success: function (response) {
			location.reload();
		}
	});
});
