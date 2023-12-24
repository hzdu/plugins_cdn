document.addEventListener("DOMContentLoaded", UploadSettings);

function UploadSettings() {
	document.getElementsByClassName('form-table')[0].style.opacity = "1";
	if (document.getElementById('chaport_default_installation_code').checked == true) {
		document.getElementById("chaport_app_id_field").parentNode.parentNode.style.display = "none";
		document.getElementById("chaport_app_installation_code_field").parentNode.parentNode.style.display = "table-row";
	} else {
		document.getElementById("chaport_app_id_field").parentNode.parentNode.style.display = "table-row";
		document.getElementById("chaport_app_installation_code_field").parentNode.parentNode.style.display = "none";
	}
}

function ChooseAppId() {
	document.getElementById("chaport_app_id_field").parentNode.parentNode.style.display = "table-row";
	document.getElementById("chaport_app_installation_code_field").parentNode.parentNode.style.display = "none";
}

function ChooseInstallationCode() {
	document.getElementById("chaport_app_id_field").parentNode.parentNode.style.display = "none";
	document.getElementById("chaport_app_installation_code_field").parentNode.parentNode.style.display = "table-row";
}
