// WishList Member - Member Action Button scripting
window.addEventListener("load", () => {
  document.querySelectorAll("button.wishlistmember-member-action-button:not(:disabled)").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      var url = e.target.dataset.url;
      if("function" == typeof fetch) {
        try {
          // Ajax Request with fetch() function
          fetch(url, {
            headers: {
              "X-Ajax-Request" : "true",
            }
          }).then(response => response.json()
          ).then(data => {
              if(data.redirect) {
                // Redirect.
                location.href = data.data;
              } else {
                // Replace button.
                btn.insertAdjacentHTML("afterend", data.data);
                btn.parentNode.removeChild(btn);
              }
          })
        }catch(err) {
          location.href = url;
        }
      } else {
        // No Ajax Request because there is no fetch() function
        location.href = url;
      }
    });
  })
})
