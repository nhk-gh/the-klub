/**
 * Created by nhk on 10/21/13.
 */

$(document).ready(function(){
    /*
    var ul = document.getElementById("por");
    var lis = ul.getElementsByTagName("li");

    for (var i=0; i< lis.length; i++){
        var l = lis[i];

        l.onclick = (function(ind){
            return function(){
                alert(ind);
            }
        })(i)
    }
    */


    //WHAT WOULD HAPPEN IN THIS EXAMPLE ?
    /*
    var myFn = function(){
        alert("Surprise !");
    } // <-------------------- NO SEMOCOLON

    (function(){

    })();  */
  /*
  var list = [1,2,3,4,5,6,7,8,9];
  list = list.sort(function(){return Math.random() - 0.5});
  alert(list);   */

 /*
  function User(name) {
    this.name = name;
  };

  var j = new User('Jack');
  alert(j.name)
  */
  /*
  Object.prototype.jack = {};

  var a = [1,2,3];

  for ( var number in a ) {
    alert( number )
  }   */

 /*
  function bar(){
    return foo();
    foo = 10;
    function foo() {}
    var foo = '11';
  }
  alert(bar());*/
});

