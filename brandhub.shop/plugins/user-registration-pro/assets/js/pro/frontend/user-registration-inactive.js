/* global  user_registration_inactive_params */
(function ($) {
	/**
	 * @since 3.0.2
	 *
	 * Inactive time period.
	 */
	var inactiveTimePeriod = ur_inactive_params.inactive_time_period,
	timeCountdownInactivePeriod = ur_inactive_params.time_countdown_inactive_period*1000,

	/**
	 * @since 3.0.2
	 *
	 * To check the inactivity in my account page.
	 */
	user_registration_my_account_inactivity_init = function() {
		var inactiveTimeout;
		// Function to handle inactivity.
		function handleInactive() {
			Swal.fire({
				title: ur_inactive_params.inactive_title,
				icon:'warning',
				html: ur_inactive_params.inactive_message,
				boxWidth: '567px',
				showCancelButton: true,
				cancelButtonText:ur_inactive_params.stay_signin,
				timer: timeCountdownInactivePeriod,
				timerProgressBar: true,
				didOpen: function() {
				  Swal.showLoading();
				  var cancelButton = Swal.getCancelButton();
    			  var cancelButtonContainer = cancelButton.parentElement.querySelector('b');
				  timerInterval = setInterval(function() {
					var timerLeft = Swal.getTimerLeft();
					var seconds = Math.ceil(timerLeft / 1000);
					cancelButtonContainer.textContent = seconds;
				  }, 1000);
				},
				willClose: function() {
				  clearInterval(timerInterval);
				},
			  }).then(function(result) {

				if (result.dismiss === Swal.DismissReason.timer) {
				  	// Perform actions when the window is inactive for specified time period.
					$.ajax({
						type: 'POST',
						url: ur_inactive_params.ajax_url,
						data: {
							action: 'user_registration_pro_inactive_logout',
							security: ur_inactive_params.inactive_logout_nonce,
						},
						success:function(res){
							Swal.fire({
								title: ur_inactive_params.inactive_title,
								icon:'info',
								html: ur_inactive_params.inactive_logout_message,
								showCancelButton: true,
								showConfirmButton: true,
								confirmButtonText:ur_inactive_params.inactive_ok,
								cancelButtonText:ur_inactive_params.reload_text,
							  }).then(function(result) {
								if(result.isConfirmed) {
									window.location.reload();
								}
							  });
						}
					})
				}
				if (result.dismiss === 'cancel') {
					resetInactiveTimer();
				}
			  });

		}

		// Function to reset the inactivity timer.
		function resetInactiveTimer() {
		clearTimeout(inactiveTimeout);
		inactiveTimeout = setTimeout(handleInactive, inactiveTimePeriod * 60 * 1000);
		}

		// Event listeners to track user activity.
		window.addEventListener("mousemove", resetInactiveTimer);
		window.addEventListener("keydown", resetInactiveTimer);

		// Initialize the inactivity timer after page load.
		window.onload = function() {
			resetInactiveTimer();
		};
	};
	user_registration_my_account_inactivity_init();
})(jQuery);
