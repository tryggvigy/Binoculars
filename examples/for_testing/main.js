window.addEventListener("DOMContentLoaded", function() {

  var bb = {};
  bb.func = function(){
    console.log("hello from func");
  }
  bb.lala = {};
  bb.lala.func = function() {
    console.log("hello from bb.lala.func");
  }

  bb.video = function(src) {
    var video = this;

    if (video === bb) {
      return new bb.video(src);
    }

    video.greet = function() {
      return src;
    }

    video.color = {}
    video.color.getDominant = function() {
        return src;
    };
  }

  bb.func();
  bb.lala.func();

  var a = bb.video("hi!");
  console.log(a.greet());
  console.log(a.color.getDominant());
  a.src = null;
  console.log(a.greet());

  var b = bb.video("bye!");
  console.log(b.greet());
  console.log(b.color.getDominant());
  b.src = null;
  console.log(b.greet());

}, false);
