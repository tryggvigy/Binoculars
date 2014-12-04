oo.detect.usingFirefox = function(){

  return new Promise(function (fulfill, reject){
    var hasFirefox,
        firefoxImg = document.createElement("img");
        firefoxImg.addEventListener("load", function(e){
            fulfill(hasFirefox = true)
        }, false);
        firefoxImg.addEventListener("error", function(e){
            fulfill(hasFirefox = false);
        }, false);

    firefoxImg.setAttribute("src", "about:logo");
  });
}