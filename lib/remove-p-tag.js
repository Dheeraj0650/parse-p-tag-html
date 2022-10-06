'use babel';

export default class RemovePTag{

  getHtmlElement(start, htmlCode) {
    var elementName = "";
    var flag = true;
    var totalElement = "";
    while(start < htmlCode.length){
      if(htmlCode[start] === ` ` && flag){
        elementName = totalElement.slice() + ">";
        flag = false;
      }

      totalElement += htmlCode[start]
      if(htmlCode[start] === `>`){
        if(totalElement === "</html>"){
          break;
        }

        if(flag){
            elementName = totalElement.slice();
        }

        start += 1;

        break;
      }
      start += 1;
    }
    return [totalElement, elementName[1] === "/" ? "endTag" : "startTag", start, elementName]
  }

  getParsedPTagCode(htmlCode) {
    var i = 0;
    var table_listDic = {};
    var stack = [];

    while(i < htmlCode.length){

      if(htmlCode[i] === "<"){
        var parsedHtmlElement = this.getHtmlElement(i, htmlCode);
        stack.push(parsedHtmlElement);
        i = parsedHtmlElement[2];

        if(parsedHtmlElement[3] === "<table>" || parsedHtmlElement[3] === "<ul>" || parsedHtmlElement[3] === "<ol>"){
          if(parsedHtmlElement[3] in table_listDic){
            table_listDic[parsedHtmlElement[3]] += 1;
          }
          else{
            table_listDic[parsedHtmlElement[3]] = 1;
          }
        }

        if(parsedHtmlElement[3] === "</p>" && ((table_listDic["<table>"] >= 1) || (table_listDic["<ul>"] >= 1) || (table_listDic["<ol>"] >= 1))){
          var idx = stack.length - 1;
          while(idx >= 0 ){
            if(stack[idx][3] === "<p>"){
              stack[idx] = -1;
              stack.pop();
              break;
            }
            idx--;
          }
        }

        if(parsedHtmlElement[3] === "</table>" || parsedHtmlElement[3] === "</ul>" || parsedHtmlElement[3] === "</ol>"){
          var checkTag = parsedHtmlElement[3].slice(0,1) + parsedHtmlElement[3].slice(2);
          if(table_listDic[checkTag] > 1){
            table_listDic[checkTag] -= 1;
          }
          else{
            delete table_listDic[checkTag];
          }
        }

      }

      else{
        var tempString = "";
        while(i < htmlCode.length){
          if(htmlCode[i] === "<"){
            stack.push([tempString, "text", i, ""])
            break;
          }
          tempString += htmlCode[i];
          i += 1
        }
      }
    }

    var resultHtmlCode = "";
    for(var idx = 0; idx < stack.length; idx++){
      if(stack[idx] === -1){
        continue;
      }
      resultHtmlCode += stack[idx][0];
    }
    return resultHtmlCode;
  }
}
