function save_options(){
    let observePage = document.getElementById("observePage").checked;
    
    let customTitleLimitLength = document.getElementById("customTitleLimitLength").value;
    let customArtistLimitLength = document.getElementById("customArtistLimitLength").value;
    
    chrome.storage.local.set({
        observePage: observePage,
        customTitleLimitLength: customTitleLimitLength,
        customArtistLimitLength: customArtistLimitLength
    }, function(){
        var status = document.getElementById('status');
            status.textContent = "Options saved.";
            setTimeout(function() {
              status.textContent = "";
            }, 750);
    });
};

function set_options(){
    //default value
    chrome.storage.local.get({
    observePage: false,
    customTitleLimitLength: 1000,
    customArtistLimitLength: 1000
    }, function(items){
        //値が保存されていたら
        document.getElementById("observePage").checked = items.observePage;
        document.getElementById("customTitleLimitLength").value = items.customTitleLimitLength;
        document.getElementById("customArtistLimitLength").value = items.customArtistLimitLength;
    })
};

// set events
document.addEventListener("DOMContentLoaded", set_options);
document.getElementById("save").addEventListener("click", save_options);
