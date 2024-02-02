// Preload pages
const purge_pages = async () => {
  const id = 'purge-pages';
  const selector = `#wp-admin-bar-${id} > a`;
  const elem = document.querySelector(selector);
  const title = elem.innerText;
  try {
    elem.innerText = title + ' ⏳';
    await fetch(window.flying_press_rest_url + '/' + id, { method: 'POST' });
  } catch (error) {
    console.error(error);
  } finally {
    elem.innerText = title;
  }
};

// Preload cache
const preload_cache = async () => {
  const id = 'preload-cache';
  const selector = `#wp-admin-bar-${id} > a`;
  const elem = document.querySelector(selector);
  const title = elem.innerText;
  try {
    elem.innerText = title + ' ⏳';
    await fetch(window.flying_press_rest_url + '/' + id, { method: 'POST' });
  } catch (error) {
    console.error(error);
  } finally {
    elem.innerText = title;
  }
};

// Purge current page
const purge_current_page = async () => {
  const id = 'purge-current-page';
  const selector = `#wp-admin-bar-${id} > a`;
  const elem = document.querySelector(selector);
  const title = elem.innerText;
  try {
    elem.innerText = title + ' ⏳ ';
    await fetch(window.flying_press_rest_url + '/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: window.location.href,
      }),
    });
  } catch (error) {
    console.error(error);
  } finally {
    elem.innerText = title;
  }
};

// Purge all pages and preload cache
const purge_pages_and_preload = async () => {
  const id = 'purge-pages-and-preload';
  const selector = `#wp-admin-bar-${id} > a`;
  const elem = document.querySelector(selector);
  const title = elem.innerText;
  try {
    elem.innerText = title + ' ⏳ ';
    await fetch(window.flying_press_rest_url + '/' + id, { method: 'POST' });
  } catch (error) {
    console.error(error);
  } finally {
    elem.innerText = title;
  }
};

// Purge everything and preload cache
const purge_everything_and_preload = async () => {
  const id = 'purge-everything-and-preload';
  const selector = `#wp-admin-bar-${id} > a`;
  const elem = document.querySelector(selector);
  const title = elem.innerText;
  try {
    elem.innerText = title + ' ⏳ ';
    await fetch(window.flying_press_rest_url + '/' + id, { method: 'POST' });
  } catch (error) {
    console.error(error);
  } finally {
    elem.innerText = title;
  }
};
