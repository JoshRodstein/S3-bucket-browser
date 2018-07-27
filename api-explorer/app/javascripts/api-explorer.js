
/**
* Initializes and generates page elements and structure.
*
* Call methods to generate HTML skeleton. Makes XMLHttpRequest to S3
* bucket and parses returned XML doc into HTML Elements and appends
* to skeleton.
*/
function init() {

  document.body.appendChild(generateElements(htmlJSON));

  /** This creates an Http request and expects an XML document in return */
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://swagger-ui-docs.s3-us-east-2.amazonaws.com/', true);
  xhr.responseType = 'document';
  xhr.overrideMimeType('text/xml');

  xhr.onload = function () {
    try {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var xmlDoc = xhr.responseXML;
        if(xmlDoc != null) {
          console.log(xmlDoc);
          parseXML(xmlDoc);
        } else {
          throw "Document Request Error: Request returned null";
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  xhr.send(null);
}

/**
* This method accepts an S3 bucket XML docuemnt object.
* It parses the XML, renders the file structure in HTML,
* and creates links for each of the documents.
*@param xmlDoc obj An XML representation of an S3 bucket
* !-- This algorithm assumes a single level file structure --!
*/
function parseXML(xmlDoc) {
  // Keys represent .json & yaml file paths
  var keys = xmlDoc.getElementsByTagName('Key');
  var listing_div = document.getElementById("api-dropdown-content");
  var path,
      folder,
      dir_div,
      dir_head,
      file_list;

  for(var i = 0; i < keys.length; i++){
    path = keys[i].innerHTML.split("/");
    if(path[0] === "app") continue;
    // directory path w/o file name (create tree)
    if(path[path.length-1] === ""){

      folder = path[0];

      dir_div = document.createElement("div");
      dir_div.setAttribute('class', 'dir');
      dir_div.setAttribute('id', 'dir-div');

      dir_head = document.createElement("header");
      dir_head.setAttribute('class', 'dir');
      dir_head.setAttribute('id', 'dir-head');
      dir_head.innerHTML = "<a>"+path[0]+"</a>";

      file_list = document.createElement("ul");
      file_list.setAttribute('class', 'files');
      file_list.setAttribute('id', folder);

      listing_div.appendChild(dir_div).appendChild(dir_head);
      dir_div.appendChild(file_list);

    } else {

      folder = path[0];
      var dlBaseUrl = keys[i].baseURI;
      var a,
          ul,
          element,
          filename,
          swagFrame;

      /**
      * ! Use this URL builder statement in prod  !
      */
      //url = "http://" + location.hostname + ":8000/?url=" + dlBaseUrl + folder +"/";

      /**
      * ! URL builder for local(non-ec2 instance) testing !
      */
      //url = "http://18.222.149.185:8000/?url=" + dlBaseUrl + folder +"/";

      /**
      * ! Use builder for slate  !
      */
      url = "http://ec2-18-216-141-185.us-east-2.compute.amazonaws.com:8000";

      for(var x = 1; x < path.length; x++){
        filename = path[x];


        a = document.createElement("a");
        ul = document.getElementById(folder);
        element = document.createElement("li");
        swagFrame = document.getElementById("swagger-ui");

        a.setAttribute("onClick", "newSrc('"+url+"', '"+swagFrame.id+"');");
        a.setAttribute('href', '#');
        a.innerText = filename;
        ul.appendChild(element).appendChild(a);
      }
    }
  }
}

/**
* Accepts a JSON Object describing an HTML Root
* element and children. Uses tail recursion to build the root
* and nested elements. Allows for easier and more effective
* unit tests involving DOM manipulation.
*
* @cases
*   @base - No "children" key present in JSON obj
*   @recursive - At least one "children" key present in JSON obj
*
* @param obj - JSON object describing root and nested HTML elements
* @returns root element
*/
function generateElements(obj) {
  var element;
  for (var key in obj) {
      if(key != "children"){
        if(key == "element") {
          element = document.createElement(obj[key]);
        } else {
          element.setAttribute(key, obj[key]);
        }
      } else {
        var buildElement;
        for(i = 0; i < obj.children.length; i++){
          buildElement = generateElements(obj.children[i]);
          element.appendChild(buildElement);
        }
      }
  }
  return element;
}

/**
* Sets src attr. of elementId to srcURL
* @param srcURL - url to be assigned to elementID src attribute
* @param elementId - Id of element of which to assign new src URL
* @returns newly set src of iframe element
* @returns null if failure
*/
function newSrc(srcURL, elementId) {
  var newSrc = srcURL;
  var element = document.getElementById(elementId);
  try {
    element.setAttribute('src', newSrc);
  } catch(error) {
    console.error("Error: Cannot setAttribute of null element " + elementId);
    return null;
  }
  return element.src;
}
