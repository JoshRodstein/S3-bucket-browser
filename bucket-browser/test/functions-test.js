
/**
* Force Test: demonstrate that QUnit is functioning
*/
QUnit.test('forced pass', function(assert) {
  assert.ok(true, 'Force pass assertion: QUnit is functioning');
})

/**
* Unit Test: genElements();
* @param JSON Object describing Root + Nested HTML elements
* and attributes.
* Success: returns generated element with nested genElements
* Fails: Returns null
*/
QUnit.test('genElements()', function(assert) {
  /**
* JSON object dscribing HTML body Skeleton
*/
var testJSON =
  {
    "element": "wrapper",
    "id":"main",
    "children": [
      {
        "element":"div",
        "id":"listing"
      },
      {
        "element":"iframe",
        "id":"swagger-ui",
        "src":"http://petstore.swagger.io",
      }
    ]
  }


  var element = generateElements(testJSON);
  var elemId = element.id;
  var listingDivId = element.childNodes[0].id;
  var swaggerFrameId = element.childNodes[1].id;
  var swaggerFrameSrc = element.childNodes[1].src;

  assert.ok(element, "Returned non-null element");
  assert.ok(elemId === "main", "Element attr Test: Root Element '"+elemId+"' created");
  assert.ok(listingDivId === "listing", "Element attr Test: Child Element '"+listingDivId+"' created");
  assert.ok(swaggerFrameId === "swagger-ui", "Element attr Test: Child Element '"+swaggerFrameId+"' created");
  assert.ok(swaggerFrameSrc === "http://petstore.swagger.io/", "Element attr Test: Element 'swagger-ui' src set to: "+swaggerFrameSrc);
})

/**
* Unit Test: newSrc()
* @param url, elementId
* onClick: sets src of elementId to URL
* Success: returns new url of element matching passed URL
* Fails: return null or non-matching url
*/
QUnit.test('newSrc()', function(assert) {
  // test URL, to assign to iframe src
  var rootElement = generateElements(htmlJSON);
  document.body.appendChild(rootElement);
  var srcURL = 'http://www.my.pitt.edu/';
  var frameElement = rootElement.childNodes[0];
  console.log(frameElement);
  //rootElement.childNodes[1].style.visibility= "hidden";

  assert.ok(rootElement != null, "rootElement not null");
  assert.ok(frameElement, "iframe element has been created and not null");
  assert.ok(newSrc(srcURL, frameElement.id) == srcURL, frameElement.id + ' src has been set to '+frameElement.src);
  assert.notOk(newSrc(srcURL, null) == srcURL, 'newSrc does not accept NULL params: 1' );
  assert.notOk(newSrc(null, frameElement.id) == srcURL, 'newSrc does not accept NULL params: 2' );
})
