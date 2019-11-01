let fileNamePre = "";

function igdl_init(url, callback){
  // Callback is a function which is called with media links
  callback = callback || console.log;

  // Take the URL as parameter
  if(url.indexOf("https://") == -1){
    // Add HTTPS in URL if not present
    url = "https://" + url;
  }
  
  fetch(url)
  .then(data => data.text()) // Return the fetched "HTML" page as text
  .then(data => {
    // The string from where to start trimming the data
    let iniString = "window._sharedData = ";
    // The string upto where to trim the data
    let endString = ";</script>";
    
    // If the URL is valid, it will return the data with ini and end string
    if(data.indexOf(iniString) > -1){
      document.querySelector(".wrong-url").style.display == "none";
      // a is initial index
      let a = data.indexOf(iniString);
      // b is text from index to end. Adding length
      let b = data.slice(a + iniString.length);
      // c is end index
      let c = b.indexOf(endString);
      // d is the json part
      let d = b.substring(0, c);
    
      let json = JSON.parse(d);
      
      // Send the Javascript object scrapped from the HTML source code
      igdl_list_downloads(json, callback);
    }
  })
  .catch(e => {
    console.error("The URL is invalid or network access refused. Logging error.");
    console.error(e);
  });
}

function igdl_list_downloads(json, callback){
  // The JSON object contains a lot of information. We only need media links :)
  const base = json.entry_data.PostPage[0].graphql.shortcode_media;
  
  // Totally customisable. The downloaded image will have name like usernameXC87_devsaurabh.com.png
  fileNamePre = base.owner.username + base.shortcode + "_devsaurabh.com";
  
  // Single Image
  if(base.__typename == "GraphImage"){
    igdl_download(base.display_url, '.jpg');

   callback({type: "Image", URL: base.display_url});
  }
  
  // Single Video
  else if (base.__typename == "GraphVideo"){
    igdl_download(base.video_url, '.mp4');

    callback({type: "Video", URL: base.video_url});
  }
  
  // Multiple Items
  else if (base.__typename == "GraphSidecar"){
    let items = [];
    // Loop through items
    Array.prototype.forEach.call(base.edge_sidecar_to_children.edges, element => {
      // The item is a video
      if (element.node.__typename == "GraphVideo"){
        igdl_download(element.node.video_url, '.mp4');
        
        items.push({type: "Video", URL: element.node.video_url});
      }
      else if(element.node.__typename == "GraphImage"){
        igdl_download(element.node.display_url, '.jpg');

        items.push({type: "Image", URL: element.node.display_url});
      }
      else {
        console.error("The element type is neither image nor video. Logging element");
        console.error(element);
      }      
    });

    callback(items);
  }
  
  else {
    console.error("No media avaiable. Check network tab for more.");
  }
}

function igdl_download(url, type){
  let fileName = fileNamePre + type;
  
  // Using XHR to force download the image or / and video.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    
    xhr.onload  = function(){
      var urlCreator = window.URL || window.webkitURL;
      // Convert blob to http url object
      var fileURL = urlCreator.createObjectURL(this.response);

      var tag = document.createElement('a');
      tag.href = fileURL;
      tag.download = fileName;
      document.body.appendChild(tag);
      // Trigger the download
      tag.click();
      document.body.removeChild(tag);
    }

    xhr.send();
}