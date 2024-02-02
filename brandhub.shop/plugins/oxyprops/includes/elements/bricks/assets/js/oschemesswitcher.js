var oxypropsStorageKey = "oxyprops-theme-preference";

var oxypropsOnClick = () => {
  switch (oxypropsTheme.value) {
    case "dark":
      oxypropsTheme.value = "dim";
      break;
    case "dim":
      oxypropsTheme.value = "light";
      break;
    case "light":
      oxypropsTheme.value = "colorful";
      break;
    case "colorful":
      oxypropsTheme.value = "dark";
      break;
    default:
      oxypropsTheme.value = "dark";
  }

  oxypropsSetPreference();
};

var oxypropsGetColorPreference = () => {
  if (localStorage.getItem(oxypropsStorageKey))
    return localStorage.getItem(oxypropsStorageKey);
  else
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
};

var oxypropsSetPreference = () => {
  localStorage.setItem(oxypropsStorageKey, oxypropsTheme.value);
  oxypropsReflectPreference();
};

var oxypropsReflectPreference = () => {
  document.firstElementChild.setAttribute("color-scheme", oxypropsTheme.value);

  document
    .querySelector("#scheme-switcher")
    ?.setAttribute("aria-label", oxypropsTheme.value);
};

var oxypropsTheme = {
  value: oxypropsGetColorPreference(),
};

// set early so no page flashes / CSS is made aware
oxypropsReflectPreference();

window.onload = () => {
  if (window.bricksData && !window.bricksIsFrontend) return;
  // set on load so screen readers can see latest value on the button
  oxypropsReflectPreference();

  // now this script can find and listen for clicks on the control
  document
    .querySelector("#scheme-switcher")
    .addEventListener("click", oxypropsOnClick);
};

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    oxypropsTheme.value = isDark ? "dark" : "light";
    oxypropsSetPreference();
  });
