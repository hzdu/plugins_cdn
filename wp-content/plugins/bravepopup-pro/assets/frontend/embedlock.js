function brave_lockContent(popupID){
   var embeddedPopup = document.getElementById('bravepopup_embedded_'+popupID);
   if(!embeddedPopup){ return; }
   var brave_lockContent = embeddedPopup.classList.contains('bravepopup_embedded--lock');
   var brave_embed_parentElm = embeddedPopup.parentNode;
   brave_embed_parentElm.classList.add('bravepop_embedded_parent', 'bravepop_embedded_parent-'+popupID);   
   if(brave_lockContent){
      brave_embed_parentElm.classList.add('bravepop_embedded_parent--locked'); 
      brave_popup_data[popupID].embedLock = true;
      var embeddedPopupSiblings = document.querySelectorAll('.bravepop_embedded_parent > *');
      embeddedPopupSiblings = Array.prototype.slice.call(embeddedPopupSiblings);
      var embeddedPopupIndex = embeddedPopupSiblings.findIndex(function (elm) {
         if(elm.classList.contains('bravepopup_embedded')){   return true;  }else{    return false;   }
      })
      var filteredSiblings = embeddedPopupSiblings.slice(embeddedPopupIndex + 3, embeddedPopupSiblings.length);
      filteredSiblings.forEach(function (sibling) {
         sibling.classList.add('bravepop_embedded_sibling');
      })
      //console.log(filteredSiblings);
   }
}

var allEmbeddedContent = document.querySelectorAll('.bravepopup_embedded--lock');
allEmbeddedContent = Array.prototype.slice.call(allEmbeddedContent);
allEmbeddedContent.forEach(function (lockedItem) {
   var popupID = lockedItem.dataset.popupid ? parseInt(lockedItem.dataset.popupid, 10) : false;
   if(popupID){
      brave_lockContent(popupID);
   }
})

document.addEventListener('brave_goal_complete', function (e) { 
   //console.log(e);
   if(e.detail.popupId){
      var lockedElements = document.querySelectorAll('.bravepop_embedded_parent-'+e.detail.popupId+' .bravepop_embedded_sibling');
      lockedElements = Array.prototype.slice.call(lockedElements);
      lockedElements.forEach(function (elm) {
         elm.classList.remove('bravepop_embedded_sibling');
      });
      document.querySelectorAll('.bravepop_embedded_parent-'+e.detail.popupId+' .bravepop_embedded_sibling');
      var popupLocker = document.querySelector('.bravepopup_embedded__locker_'+e.detail.popupId);
      
      if(popupLocker){
         popupLocker.classList.add('bravepopup_embedded__locker--hide');
      }
   }
 }, false);