# Instagram Media Download with JavaScript

As easy as calling `igdl_init(url, callback)`. Example source code is given in example.html

It uses fetch API to fetch the HTML source code of the url given. Then it trims out the JSON from the source code which contains a lot of data. Graph API data.

It uses XMLHttpRequest to force the browser to download the media file instead of opening it in the current or new tab (depending on whether or not you are using attribute `target="_blank"`).
The XHR onload event listener also converts the "blob" response to HTTP URL Object and attaches it to HTML anchor (<a></a>) tag's href attribute.

The callback function recieves a single parameter.
```javascript
igdl_init(url, callback);

function callback(parameter){
  // Check if parameter is an array of objects. (Case of multiple media in single post)
  if(Array.isArray(parameter)){
    // It is an array. Loop through it
    parameter.forEach(object => {
      // object has two keys : 1. type, 2. URL
      // type can be either : 1. Image, 2. Video
      doSomething(object);
    });
  }
  
  // Check if parameter is an object. (Case of single file in the post)
  else if(typeof parameter === "object"){
    // object has two keys : 1. type, 2. URL
    // type can be either : 1. Image, 2. Video
    doSomething(parameter);
  }
}

function doSomething({type, URL}){
  console.log(type, URL);
}
```

## Is it available in python or PHP or any other language
Mate, the algorithm is simple. All you have to do is fetch the source code, extract the JSON data and loop through it. If you find it difficult you may see the source code to know how easy it is.

## Implementation
[Instagram Media Downloader](https://devsaurabh.com/instagram-downloader)
