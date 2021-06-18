function customTrack(){
    let track = getMusicInfoDirectly();
    makeCustomTrack();
    showCustomTrack(track);
}

function freeTextToCustomTrack(){
    let t = document.getElementById("free-title").value;
    let a = document.getElementById("free-artist").value;
    showCustomTrack(({title: t, artist: a}));
}

function manualShowing(){
    let track = getMusicInfoDirectly();
    showCustomTrack(track);
}

function makeCustomTrack(){
    //KUVOページ内に独自の情報表示領域を作る
    let target = document.querySelector(".location");
    let insHTML = "<div class='custom-track-info'>"+
    "<div class='custom-title' id='pre-scroll'></div>"+
    "<div class='custom-artist' id='pre-scroll'></div>"+
    "</div>";
    let freeTextHTML = "<p>任意入力<br>title<input id='free-title' type='text'><span>title要素の長さ<div id='titleElm-width'></div></span><br>"+
    "artist<input id='free-artist' type='text'><span>artist要素の長さ<div id='artistElm-width'></div></span><br>"+
    "<button id='free-text'>送信</button></p>"+
    "<p><button id='manual-show'>現在のページ状態を反映</button></p>";
    target.insertAdjacentHTML("beforeend",insHTML+freeTextHTML);
    
    //ボタンのイベントリスナ
    document.getElementById("free-text").addEventListener("click", freeTextToCustomTrack);
    document.getElementById("manual-show").addEventListener("click", manualShowing);
}

function showCustomTrack(track){
    if(track===null) return;
    let titleElm = document.querySelector(".custom-title");
    let artistElm = document.querySelector(".custom-artist");
    if(track["title"]=="") track["title"] = " ";
    if(track["artist"]=="") track["artist"] = " ";
    titleElm.innerText = track["title"];
    artistElm.innerText = track["artist"];
    
    titleElm.setAttribute("id","pre-scroll");
    artistElm.setAttribute("id","pre-scroll");
    
    toScroll();
}

function toScroll(){
    chrome.storage.local.get(["customTitleLimitLength","customArtistLimitLength"],function(items){
        let titleLL = items.customTitleLimitLength;
        let artistLL = items.customArtistLimitLength;
        //もう一度読み込んで長さを見る
        let titleElm = document.querySelector(".custom-title");
        let artistElm = document.querySelector(".custom-artist");
        let titleWidth = titleElm.clientWidth;
        let artistWidth = artistElm.clientWidth;
        if(titleWidth > titleLL){
            titleElm.setAttribute("id","scroll-on")
        }else{
            titleElm.setAttribute("id","scroll-off");
        };
        if(artistWidth > artistLL){
            artistElm.setAttribute("id","scroll-on");
        }else{
            artistElm.setAttribute("id","scroll-off");
        };
        
        let widthDispTitle = document.querySelector("#titleElm-width");
        widthDispTitle.innerText = titleWidth;
        let widthDispArtist = document.querySelector("#artistElm-width");
        widthDispArtist.innerText = artistWidth;
    });
}

function observeMutation(){
    //DOMの変化を監視して完全自動で反映させる
    const target = document.querySelector('.tracklist-area');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            let track = getMusicInfoDirectly();
            showCustomTrack(track);
        });
    });
    const config = {
        childList: true,
        subtree: true
    };
    observer.observe(target, config);
}

function getMusicInfoDirectly(){
    let row = document.querySelector(".row.on");
    if(!row){ rowoff = document.querySelectorAll(".row.off");
        row = rowoff.item(rowoff.length-1);
    }
    if(!row){
        alert("Not Found");
        return null;
    }
    let t = row.querySelector(".title").innerText;
    let a = row.querySelector(".artist").innerText;
    let musicInfo = {title: t, artist: a};
    return musicInfo;
};

window.addEventListener("load", customTrack);

chrome.storage.local.get(["observePage"],function(items){
    if(items.observePage){
        observeMutation();
    }
});
