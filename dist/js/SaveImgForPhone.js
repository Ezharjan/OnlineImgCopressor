function saveImg() {
    var img = document.getElementById("imgbox");
    var alink = document.createElement("a");
    alink.href = img.src;
    alink.click();
}