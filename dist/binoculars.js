!function(){
  var oo = {version: "0.6.0"};

oo._support = {}

/**
 * Converts a single rgb color array to
 * a single rgb object
 * @example [234, 124, 45] => {r:234, g:124, b:45}
 */
 oo._support.toColorObj = function (colorArr) {
  var color = {};
  color.r = colorArr[0];
  color.g = colorArr[1];
  color.b = colorArr[2];
  return color;
}

oo._support.CanvasImage = function (image) {
    this.canvas  = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    this.width  = this.canvas.width  = image.width;
    this.height = this.canvas.height = image.height;

    this.context.drawImage(image, 0, 0, this.width, this.height);
};

oo._support.CanvasImage.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

oo._support.CanvasImage.prototype.update = function (imageData) {
    this.context.putImageData(imageData, 0, 0);
};

oo._support.CanvasImage.prototype.getPixelCount = function () {
    return this.width * this.height;
};

oo._support.CanvasImage.prototype.getImageData = function () {
    return this.context.getImageData(0, 0, this.width, this.height);
};

oo._support.CanvasImage.prototype.removeCanvas = function () {
    this.canvas.parentNode.removeChild(this.canvas);
};
oo.algorithms = {};


oo.algorithms.quantize = function(pixelArray, colorCount) {
	return quantizeJsWrap(pixelArray, colorCount);
}

/*!
 * This function wraps quantize.js Copyright 2008 Nick Rabinowitz.
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
/*jshint ignore: start*/
function quantizeJsWrap(pixelArray, colorCount) {
	if (!pv) {
	    var pv = {
	        map: function(array, f) {
	          var o = {};
	          return f ? array.map(function(d, i) { o.index = i; return f.call(o, d); }) : array.slice();
	        },
	        naturalOrder: function(a, b) {
	            return (a < b) ? -1 : ((a > b) ? 1 : 0);
	        },
	        sum: function(array, f) {
	          var o = {};
	          return array.reduce(f ? function(p, d, i) { o.index = i; return p + f.call(o, d); } : function(p, d) { return p + d; }, 0);
	        },
	        max: function(array, f) {
	          return Math.max.apply(null, f ? pv.map(array, f) : array);
	        }
	    };
	}

	var MMCQ = (function() {
	    // private constants
	    var sigbits = 5,
	        rshift = 8 - sigbits,
	        maxIterations = 1000,
	        fractByPopulations = 0.75;

	    // get reduced-space color index for a pixel
	    function getColorIndex(r, g, b) {
	        return (r << (2 * sigbits)) + (g << sigbits) + b;
	    }

	    // Simple priority queue
	    function PQueue(comparator) {
	        var contents = [],
	            sorted = false;

	        function sort() {
	            contents.sort(comparator);
	            sorted = true;
	        }

	        return {
	            push: function(o) {
	                contents.push(o);
	                sorted = false;
	            },
	            peek: function(index) {
	                if (!sorted) sort();
	                if (index===undefined) index = contents.length - 1;
	                return contents[index];
	            },
	            pop: function() {
	                if (!sorted) sort();
	                return contents.pop();
	            },
	            size: function() {
	                return contents.length;
	            },
	            map: function(f) {
	                return contents.map(f);
	            },
	            debug: function() {
	                if (!sorted) sort();
	                return contents;
	            }
	        };
	    }

	    // 3d color space box
	    function VBox(r1, r2, g1, g2, b1, b2, histo) {
	        var vbox = this;
	        vbox.r1 = r1;
	        vbox.r2 = r2;
	        vbox.g1 = g1;
	        vbox.g2 = g2;
	        vbox.b1 = b1;
	        vbox.b2 = b2;
	        vbox.histo = histo;
	    }
	    VBox.prototype = {
	        volume: function(force) {
	            var vbox = this;
	            if (!vbox._volume || force) {
	                vbox._volume = ((vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1));
	            }
	            return vbox._volume;
	        },
	        count: function(force) {
	            var vbox = this,
	                histo = vbox.histo;
	            if (!vbox._count_set || force) {
	                var npix = 0,
	                    i, j, k;
	                for (i = vbox.r1; i <= vbox.r2; i++) {
	                    for (j = vbox.g1; j <= vbox.g2; j++) {
	                        for (k = vbox.b1; k <= vbox.b2; k++) {
	                             index = getColorIndex(i,j,k);
	                             npix += (histo[index] || 0);
	                        }
	                    }
	                }
	                vbox._count = npix;
	                vbox._count_set = true;
	            }
	            return vbox._count;
	        },
	        copy: function() {
	            var vbox = this;
	            return new VBox(vbox.r1, vbox.r2, vbox.g1, vbox.g2, vbox.b1, vbox.b2, vbox.histo);
	        },
	        avg: function(force) {
	            var vbox = this,
	                histo = vbox.histo;
	            if (!vbox._avg || force) {
	                var ntot = 0,
	                    mult = 1 << (8 - sigbits),
	                    rsum = 0,
	                    gsum = 0,
	                    bsum = 0,
	                    hval,
	                    i, j, k, histoindex;
	                for (i = vbox.r1; i <= vbox.r2; i++) {
	                    for (j = vbox.g1; j <= vbox.g2; j++) {
	                        for (k = vbox.b1; k <= vbox.b2; k++) {
	                             histoindex = getColorIndex(i,j,k);
	                             hval = histo[histoindex] || 0;
	                             ntot += hval;
	                             rsum += (hval * (i + 0.5) * mult);
	                             gsum += (hval * (j + 0.5) * mult);
	                             bsum += (hval * (k + 0.5) * mult);
	                        }
	                    }
	                }
	                if (ntot) {
	                    vbox._avg = [~~(rsum/ntot), ~~(gsum/ntot), ~~(bsum/ntot)];
	                } else {
	//                    console.log('empty box');
	                    vbox._avg = [
	                        ~~(mult * (vbox.r1 + vbox.r2 + 1) / 2),
	                        ~~(mult * (vbox.g1 + vbox.g2 + 1) / 2),
	                        ~~(mult * (vbox.b1 + vbox.b2 + 1) / 2)
	                    ];
	                }
	            }
	            return vbox._avg;
	        },
	        contains: function(pixel) {
	            var vbox = this,
	                rval = pixel[0] >> rshift;
	                gval = pixel[1] >> rshift;
	                bval = pixel[2] >> rshift;
	            return (rval >= vbox.r1 && rval <= vbox.r2 &&
	                    gval >= vbox.g1 && gval <= vbox.g2 &&
	                    bval >= vbox.b1 && bval <= vbox.b2);
	        }
	    };

	    // Color map
	    function CMap() {
	        this.vboxes = new PQueue(function(a,b) {
	            return pv.naturalOrder(
	                a.vbox.count()*a.vbox.volume(),
	                b.vbox.count()*b.vbox.volume()
	            );
	        });
	    }
	    CMap.prototype = {
	        push: function(vbox) {
	            this.vboxes.push({
	                vbox: vbox,
	                color: vbox.avg()
	            });
	        },
	        palette: function() {
	            return this.vboxes.map(function(vb) { return vb.color; });
	        },
	        size: function() {
	            return this.vboxes.size();
	        },
	        map: function(color) {
	            var vboxes = this.vboxes;
	            for (var i=0; i<vboxes.size(); i++) {
	                if (vboxes.peek(i).vbox.contains(color)) {
	                    return vboxes.peek(i).color;
	                }
	            }
	            return this.nearest(color);
	        },
	        nearest: function(color) {
	            var vboxes = this.vboxes,
	                d1, d2, pColor;
	            for (var i=0; i<vboxes.size(); i++) {
	                d2 = Math.sqrt(
	                    Math.pow(color[0] - vboxes.peek(i).color[0], 2) +
	                    Math.pow(color[1] - vboxes.peek(i).color[1], 2) +
	                    Math.pow(color[2] - vboxes.peek(i).color[2], 2)
	                );
	                if (d2 < d1 || d1 === undefined) {
	                    d1 = d2;
	                    pColor = vboxes.peek(i).color;
	                }
	            }
	            return pColor;
	        },
	        forcebw: function() {
	            // XXX: won't  work yet
	            var vboxes = this.vboxes;
	            vboxes.sort(function(a,b) { return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color));});

	            // force darkest color to black if everything < 5
	            var lowest = vboxes[0].color;
	            if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5)
	                vboxes[0].color = [0,0,0];

	            // force lightest color to white if everything > 251
	            var idx = vboxes.length-1,
	                highest = vboxes[idx].color;
	            if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251)
	                vboxes[idx].color = [255,255,255];
	        }
	    };

	    // histo (1-d array, giving the number of pixels in
	    // each quantized region of color space), or null on error
	    function getHisto(pixels) {
	        var histosize = 1 << (3 * sigbits),
	            histo = new Array(histosize),
	            index, rval, gval, bval;
	        pixels.forEach(function(pixel) {
	            rval = pixel[0] >> rshift;
	            gval = pixel[1] >> rshift;
	            bval = pixel[2] >> rshift;
	            index = getColorIndex(rval, gval, bval);
	            histo[index] = (histo[index] || 0) + 1;
	        });
	        return histo;
	    }

	    function vboxFromPixels(pixels, histo) {
	        var rmin=1000000, rmax=0,
	            gmin=1000000, gmax=0,
	            bmin=1000000, bmax=0,
	            rval, gval, bval;
	        // find min/max
	        pixels.forEach(function(pixel) {
	            rval = pixel[0] >> rshift;
	            gval = pixel[1] >> rshift;
	            bval = pixel[2] >> rshift;
	            if (rval < rmin) rmin = rval;
	            else if (rval > rmax) rmax = rval;
	            if (gval < gmin) gmin = gval;
	            else if (gval > gmax) gmax = gval;
	            if (bval < bmin) bmin = bval;
	            else if (bval > bmax)  bmax = bval;
	        });
	        return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
	    }

	    function medianCutApply(histo, vbox) {
	        if (!vbox.count()) return;

	        var rw = vbox.r2 - vbox.r1 + 1,
	            gw = vbox.g2 - vbox.g1 + 1,
	            bw = vbox.b2 - vbox.b1 + 1,
	            maxw = pv.max([rw, gw, bw]);
	        // only one pixel, no split
	        if (vbox.count() == 1) {
	            return [vbox.copy()];
	        }
	        /* Find the partial sum arrays along the selected axis. */
	        var total = 0,
	            partialsum = [],
	            lookaheadsum = [],
	            i, j, k, sum, index;
	        if (maxw == rw) {
	            for (i = vbox.r1; i <= vbox.r2; i++) {
	                sum = 0;
	                for (j = vbox.g1; j <= vbox.g2; j++) {
	                    for (k = vbox.b1; k <= vbox.b2; k++) {
	                        index = getColorIndex(i,j,k);
	                        sum += (histo[index] || 0);
	                    }
	                }
	                total += sum;
	                partialsum[i] = total;
	            }
	        }
	        else if (maxw == gw) {
	            for (i = vbox.g1; i <= vbox.g2; i++) {
	                sum = 0;
	                for (j = vbox.r1; j <= vbox.r2; j++) {
	                    for (k = vbox.b1; k <= vbox.b2; k++) {
	                        index = getColorIndex(j,i,k);
	                        sum += (histo[index] || 0);
	                    }
	                }
	                total += sum;
	                partialsum[i] = total;
	            }
	        }
	        else {
	            for (i = vbox.b1; i <= vbox.b2; i++) {
	                sum = 0;
	                for (j = vbox.r1; j <= vbox.r2; j++) {
	                    for (k = vbox.g1; k <= vbox.g2; k++) {
	                        index = getColorIndex(j,k,i);
	                        sum += (histo[index] || 0);
	                    }
	                }
	                total += sum;
	                partialsum[i] = total;
	            }
	        }
	        partialsum.forEach(function(d,i) {
	            lookaheadsum[i] = total-d;
	        });
	        function doCut(color) {
	            var dim1 = color + '1',
	                dim2 = color + '2',
	                left, right, vbox1, vbox2, d2, count2=0;
	            for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
	                if (partialsum[i] > total / 2) {
	                    vbox1 = vbox.copy();
	                    vbox2 = vbox.copy();
	                    left = i - vbox[dim1];
	                    right = vbox[dim2] - i;
	                    if (left <= right)
	                        d2 = Math.min(vbox[dim2] - 1, ~~(i + right / 2));
	                    else d2 = Math.max(vbox[dim1], ~~(i - 1 - left / 2));
	                    // avoid 0-count boxes
	                    while (!partialsum[d2]) d2++;
	                    count2 = lookaheadsum[d2];
	                    while (!count2 && partialsum[d2-1]) count2 = lookaheadsum[--d2];
	                    // set dimensions
	                    vbox1[dim2] = d2;
	                    vbox2[dim1] = vbox1[dim2] + 1;
	//                    console.log('vbox counts:', vbox.count(), vbox1.count(), vbox2.count());
	                    return [vbox1, vbox2];
	                }
	            }

	        }
	        // determine the cut planes
	        return maxw == rw ? doCut('r') :
	            maxw == gw ? doCut('g') :
	            doCut('b');
	    }

	    function quantize(pixels, maxcolors) {
	        // short-circuit
	        if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
	//            console.log('wrong number of maxcolors');
	            return false;
	        }

	        // XXX: check color content and convert to grayscale if insufficient

	        var histo = getHisto(pixels),
	            histosize = 1 << (3 * sigbits);

	        // check that we aren't below maxcolors already
	        var nColors = 0;
	        histo.forEach(function() { nColors++; });
	        if (nColors <= maxcolors) {
	            // XXX: generate the new colors from the histo and return
	        }

	        // get the beginning vbox from the colors
	        var vbox = vboxFromPixels(pixels, histo),
	            pq = new PQueue(function(a,b) { return pv.naturalOrder(a.count(), b.count()); });
	        pq.push(vbox);

	        // inner function to do the iteration
	        function iter(lh, target) {
	            var ncolors = 1, // jshint ignore:line
	                niters = 0,
	                vbox;
	            while (niters < maxIterations) {
	                vbox = lh.pop();
	                if (!vbox.count())  { //just put it back
	                    lh.push(vbox);
	                    niters++;
	                    continue;
	                }
	                // do the cut
	                var vboxes = medianCutApply(histo, vbox),
	                    vbox1 = vboxes[0],
	                    vbox2 = vboxes[1];

	                if (!vbox1) {
	//                    console.log("vbox1 not defined; shouldn't happen!");
	                    return;
	                }
	                lh.push(vbox1);
	                if (vbox2) {  //vbox2 can be null
	                    lh.push(vbox2);
	                    ncolors++;
	                }
	                if (ncolors >= target) return;
	                if (niters++ > maxIterations) {
	//                    console.log("infinite loop; perhaps too few pixels!");
	                    return;
	                }
	            }
	        }

	        // first set of colors, sorted by population
	        iter(pq, fractByPopulations * maxcolors);

	        // Re-sort by the product of pixel occupancy times the size in color space.
	        var pq2 = new PQueue(function(a,b) {
	            return pv.naturalOrder(a.count()*a.volume(), b.count()*b.volume());
	        });
	        while (pq.size()) {
	            pq2.push(pq.pop());
	        }

	        // next set - generate the median cuts using the (npix * vol) sorting.
	        iter(pq2, maxcolors - pq2.size());

	        // calculate the actual colors
	        var cmap = new CMap();
	        while (pq2.size()) {
	            cmap.push(pq2.pop());
	        }

	        return cmap;
	    }

	    return {
	        quantize: quantize
	    };
	})();
	return MMCQ.quantize(pixelArray, colorCount);
};
/*jshint ignore: end*/
oo.video = {};

oo.video._hasPermission = false;
oo.video._listenerQueue = [];

oo.video.onPermission = function(listener) {
  if ( oo.video._hasPermission ) {
      listener.call();
  } else {
      oo.video._listenerQueue.push( listener );
  }
}

oo.video.gotPermission = function() {
  oo.video._hasPermission = true;
  if ( oo.video._listenerQueue ) {
    var fn, i = 0;
    while ( (fn = oo.video._listenerQueue[ i++ ]) ) {
      fn.call();
    }
    oo.video._listenerQueue = null;
  }
}
oo.video.register = function (videoSrc) {

  var hasGetUserMedia = function() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  if (!hasGetUserMedia()) {
    throw new Error("init(): Sorry, your browser does not support this behaviour");
  }

    var permissions = { "video": true };

    var videoListenerError = function(error) {
      console.error("Video capture error: ", error);
    };

    // Put video listeners into place
    if(navigator.getUserMedia) { // Standard
      navigator.getUserMedia(permissions, function(stream) {
        videoSrc.src = stream;
        videoSrc.play();
        oo.video.gotPermission();
      }, videoListenerError);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
      navigator.webkitGetUserMedia(permissions, function(stream){
        videoSrc.src = window.webkitURL.createObjectURL(stream);
        videoSrc.play();
        oo.video.gotPermission();
      }, videoListenerError);
    }
    else if(navigator.mozGetUserMedia) { // Firefox-prefixed
      navigator.mozGetUserMedia(permissions, function(stream){
        videoSrc.src = window.URL.createObjectURL(stream);
        videoSrc.play();
        oo.video.gotPermission();
      }, videoListenerError);
    }
}
/**
 * Checks the brightness of the dominant color of the video element snapshot.
 * because 255,255,255 == white(light) and 0,0,0 == black(dark)
 * we can know the sum: 765 is the brightest color.
 * From this, brightness level is divided into categories.
 * The following boolean functions boundary check a given videoSrc
 * agains it's respective category.
 */
 oo.video.isVeryDark = function(videoSrc){
  var c = getBrightnessConst();
  var dominantColor = oo.video.color.dominantColor(videoSrc);
      dominantColor = oo._support.toColorObj(dominantColor);

  var brightness = dominantColor.r +
                dominantColor.g +
                dominantColor.b;

  return (brightness < c.VERY_DARK) ? true : false;
}

oo.video.isDark = function(videoSrc){
  var c = getBrightnessConst();
  var dominantColor = oo.video.color.dominantColor(videoSrc);
      dominantColor = oo._support.toColorObj(dominantColor);

  var brightness = dominantColor.r +
                dominantColor.g +
                dominantColor.b;

  return (brightness < c.DARK) ? true : false;
}

oo.video.isBright = function(videoSrc){
  var c = getBrightnessConst();
  var dominantColor = oo.video.color.dominantColor(videoSrc);
      dominantColor = oo._support.toColorObj(dominantColor);

  var brightness = dominantColor.r +
                dominantColor.g +
                dominantColor.b;

  return (brightness < c.BRIGHT) ? true : false;
}

oo.video.isVeryBright = function(videoSrc){
  var c = getBrightnessConst();
  var dominantColor = oo.video.color.dominantColor(videoSrc);
      dominantColor = oo._support.toColorObj(dominantColor);

  var brightness = dominantColor.r +
                dominantColor.g +
                dominantColor.b;

  return (brightness > c.VERY_BRIGHT) ? true : false;
}

oo.video.getBrightness = function(videoSrc) {
  var c = getBrightnessConst();
  var dominantColor = oo.video.color.dominantColor(videoSrc, 5);
  dominantColor = oo._support.toColorObj(dominantColor);

  var brightness = dominantColor.r +
                dominantColor.g +
                dominantColor.b;

  return brightness/c.MAX_BRIGHTNESS;
}

function getBrightnessConst() {
  var MAX_BRIGHTNESS = 765,
      BRIGHTNESS_CONSTANT = 7, //higher constant => more colors categorized as "bright"
      BRIGHTNESS_STEP   = MAX_BRIGHTNESS/BRIGHTNESS_CONSTANT; //TODO COLOR_STEP is not whole, spectrum contains holes.

  return {
    MAX_BRIGHTNESS: 765,
    VERY_DARK     : BRIGHTNESS_STEP*1,
    DARK          : BRIGHTNESS_STEP*2,
    BRIGHT        : BRIGHTNESS_STEP*3,
    VERY_BRIGHT   : BRIGHTNESS_STEP*4
  };
}

oo.video.getPixels = function(videoSrc) {
  var image      = new oo._support.CanvasImage(videoSrc);
  var imageData  = image.getImageData();
  var pixels     = imageData.data;

  // Clean up
  image.removeCanvas();

  return pixels;
};

oo.video.getPixelCount = function(videoSrc) {
  var image = new oo._support.CanvasImage(videoSrc);

  // Clean up
  image.removeCanvas();

  return image.getPixelCount();
};

oo.video.color = {};

/*!
 * This function wraps
 * Color Thief v2.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * License
 * -------
 * Creative Commons Attribution 2.5 License:
 * http://creativecommons.org/licenses/by/2.5/
 */
 oo.video.color.colorPalette = function(videoSrc, colorCount, quality) {

  if (typeof colorCount === 'undefined') {
        colorCount = 10;
  }
  if (typeof quality === 'undefined') {
      quality = 10;
  }

  // Create custom CanvasImage object
  var image      = new oo._support.CanvasImage(videoSrc);
  var imageData  = image.getImageData();
  var pixels     = imageData.data;
  var pixelCount = image.getPixelCount();

  // Store the RGB values in an array format suitable for quantize function
  var pixelArray = [];
  for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
      offset = i * 4;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];
      // If pixel is mostly opaque and not white
      if (a >= 125) {
          if (!(r > 250 && g > 250 && b > 250)) {
              pixelArray.push([r, g, b]);
          }
      }
  }

  // Send array to quantize function which clusters values
  // using median cut algorithm
  var cmap    = oo.algorithms.quantize(pixelArray, colorCount);
  var thePalette = cmap.palette();

  // Clean up
  image.removeCanvas();

  return thePalette;
};
oo.video.color.dominantColor = function(videoSrc, quality) {
  var colPalette = oo.video.color.colorPalette(videoSrc, 5, quality);
  var dominantColor = colPalette[0];
  return dominantColor;
}

  if (typeof define === "function" && define.amd) define(oo);
  else if (typeof module === "object" && module.exports) module.exports = oo;
  this.oo = oo;
}();
