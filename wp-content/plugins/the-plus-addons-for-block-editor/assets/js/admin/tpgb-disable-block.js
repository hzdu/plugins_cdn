document.addEventListener('DOMContentLoaded', (event) => {
    
    var ele = document.querySelector(".tpgb-scanning-blocks");
    if(ele){
        ele.addEventListener('click', function(event) {
            event.preventDefault();
            let block_type = false;
            ele.innerHTML = 'Scanning..';
            var xhr = new XMLHttpRequest();
            var url = ajaxurl;
            var params = 'action=tpgb_is_block_used_not&nonce=' + encodeURIComponent(tpgb_disable_block_data.nonce) + '&default_block=' + encodeURIComponent(block_type);

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response) {
                        ele.parentElement.classList.add('after-scan');
                        var unused_block_count = 0;
                        Object.keys(response).forEach(function(key) {
                        var list_block = document.querySelector('[data-list-block="' + key + '"]');
                        if (list_block) {
                            var newElement = document.createElement('span');
                            if (response[key] === 1) {
                            newElement.className = "tpgb-used-block";
                            newElement.textContent = 'In Use';
                            } else {
                            newElement.className = "tpgb-unused-block";
                            newElement.textContent = 'Unused';
                            unused_block_count++;
                            }
                            list_block.prepend(newElement);
                        }
                        });
                        ele.insertAdjacentHTML('beforebegin', '<div class="tpgb-unused-block-count">* ' + unused_block_count + ' Unused Blocks found!</div>');

                        var disable_block = document.querySelector(".tpgb-unused-disable-blocks");
                        if (disable_block) {
                        disable_block.addEventListener('click', function(e) {
                            e.preventDefault();
                            disable_block.innerHTML = 'Disabling Unused Blocks..';

                            var xhr2 = new XMLHttpRequest();
                            xhr2.open('POST', url, true);
                            xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                            xhr2.onreadystatechange = function() {
                            if (xhr2.readyState === XMLHttpRequest.DONE) {
                                if (xhr2.status === 200) {
                                var res = JSON.parse(xhr2.responseText);
                                if (res && res === 1) {
                                    disable_block.innerHTML = 'Disabled Successfully!';
                                    setTimeout(function() {
                                    location.reload(true);
                                    }, 200);
                                } else {
                                    alert('server not found');
                                }
                                }
                            }
                            };

                            xhr2.send('action=tpgb_unused_disable_block&blocks=' + encodeURIComponent(JSON.stringify(response)) + '&nonce=' + encodeURIComponent(tpgb_disable_block_data.disable_nonce) + '&default_block=' + encodeURIComponent(block_type));
                        });
                        }
                    }
                    ele.innerHTML = 'Scan Unused Blocks';
                }
            }
            };
            xhr.send(params);
        })
    }
})