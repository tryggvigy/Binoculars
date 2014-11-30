Binoculars  oo
===============

Binoculars allow you to see distant hard to reach data. The goal? If some data is accessable somehow, then Binoculars want to give you access to it.

Oh yeah, here are the current main usecases for Binoculars:

* Read color and brightness data from &lt;video&gt; elements in order to do stuff
* Stylesheet shuffling based on color or brightness level in the enviroment of the user.


Assembling your Binoculars
---------------------------

If you are not familiar with gulp then [check them out](http://gulpjs.com/).

	npm install
	gulp

To execute all unit tests, do:

	gulp test


Things to come
---------------

* Hopefully reading audio data from users
* More ways to catch more data
* Documentation
* More rigorous unit testing


Note
-----

This technology is relatively new and has
limited browser support (Firefox and Chrome last few versions)

If you want some more info see this 
[html5rocks](http://www.html5rocks.com/en/tutorials/getusermedia/intro/) article or the 
W3C [Device APIs Working Group](http://www.w3.org/2009/dap/)

Thanks
-------
* [Lokesh Dhakar](https://github.com/lokesh) -
	For creating [color-thief](https://github.com/lokesh/color-thief)
* [Nick Rabinowitz](https://github.com/nrabinowitz) -
	For implementing the MMCQ algorithm in Javascript:
	[quantize.js](https://gist.github.com/nrabinowitz/1104622)
