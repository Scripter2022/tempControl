  document.addEventListener("DOMContentLoaded", function () {
  var data; 
  var outputs = document.getElementsByTagName("output");

    function readFile(file, callback){
    var rawFile=new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("POST", file, true);
    rawFile.onreadystatechange=function(){
    if(rawFile.readyState==4 && rawFile.status=="200"){
        callback(rawFile.responseText);
        //console.log("GetResponce-->",rawFile.responseText);
      }
    }
    rawFile.send()
  }
 
function rd(){
  readFile("myapp/lib/data.json", function (text){
  data=JSON.parse(text);
  //console.log("FROMJSONFILE", data);
  outputs[0].innerHTML='<h2 id="data" style="color=#ff6347">'+data.hot+'°C'+'</h2>';
  outputs[1].innerHTML='<h2 id="data">'+data.room+'°C'+'</h2>';
  //console.log("readDataSetIntervalCall")
 
  });
};

setInterval(rd, 5000)

});

  //outputs[1].innerHTML=data.room;

  //setInterval(readFile, 1000);




