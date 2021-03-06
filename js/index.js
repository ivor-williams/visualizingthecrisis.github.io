var masonry;
$(document).ready(function(){

});
$(window).load(function(){


    $.get(path, function(xmlDoc){
      var sections=$(xmlDoc).find('section');
      for(var s=0;s<sections.length;s++){
        var authors=$(sections[s]).parent().parent().parent().find('authors').first().clone();
        $(sections[s]).append(authors);
      }

        processXML(xmlDoc);



    $.get('keywords.xml', function(d){

      var areas=$(d).children().first().children();
      for(var a=0;a<areas.length;a++){
        var $ar=$("<div class='area'></div>");
        $('#bulletin-search').prepend($ar);
        var $area=$(areas[a]);
        var keywords=$area.children();
        $ar.append("<h3>"+$area.attr('name')+"</h3>");

        for(var k=0;k<keywords.length;k++){
          var $area_element=$("<div class='area-element'></div>");
          $ar.append($area_element);

          var $keyword=$(keywords[k]);
          $area_element.append("<input type='radio' name='"+$keyword.text()+"' value='"+$keyword.text()+"'>"+$keyword.text()+"<br>");
        }
      }
      var container = document.querySelector('#bulletin-container');
      masonry = new Masonry(container, {
        columnWidth: 532,
        itemSelector: '.section'});
      });
       });
 });


 function filter(){
   if($('#bulletin-search').css('display')=='none'){
     $('#bulletin-search').fadeIn();
   return;
  }
   var filters=[];
   sources=[];
   filters=[];
   var n = $( "input:checked" ).length;
   var checked=$( "input:checked" );
   for(var i=0; i<checked.length; i++){
     filters.push($(checked[i]).attr('name'));
   }
   console.log(filters);

   //$(".loader-container").css("opacity",1);
   //$("#bulletin-container").hide();

   $(".loader-container").fadeIn("fastest",function(){
     processFilters(filters);
     $('#bulletin-search').fadeOut();
   });

 /*
   $(".loader-container").fadeOut(function(){
     $("#bulletin-container").fadeIn();
   });
 */

 }

 function processFilters(filters){

   var $all=$('<sections></sections>');
     function parse(i){
       if(i<paths.length){
         $.ajax({
           url:paths[i],
           type:'GET',
           error: function(){
             parse(i+1);
           },
           success: function(xml){
           //  $("#bulletin-container").append('<div style="display:block;width:100%;background-color:black;color:white;">'+paths[i]+'</div>');
             console.log('processing: '+paths[i]);
           //  processXML(xml);
             var sections=$(xml).find('section');
             for(var s=0;s<sections.length;s++){
               var authors=$(sections[s]).parent().parent().parent().find('authors').first().clone();
               $(sections[s]).append(authors);
               $all.append(sections[s]);
             }
             parse(i+1);
           }
         });
       }
       else{
         //  console.log($all.html());

         $("#bulletin-container").children().remove();
         $("#bulletin-header").children().remove();
         $("#bulletin-footer").children().remove();

         processXML($all,filters,15);
         masonry.reloadItems();
         $(".loader-container").fadeOut();
       }
     }
     parse(0);
 }
