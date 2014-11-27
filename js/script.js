
var rows = [];

$(document).ready(function() {

   renderAll();

	$("#add_to_market").on('click', function(){
		//clear all fields 
			 $("#title").val("");
			 $("#brand").val("");
			 $("#amount").val("");
			 $("#tf_q :selected").removeAttr("selected");
			 $("#tf_year :selected").removeAttr("selected");
			 $("#wconf :selected").removeAttr("selected");


	});


	$("#save_btn").on('click', function(){
	       
				
		 var valid = true;
		   valid = valid && checkLength( $("#title"), "title", 3, 16 );
		   valid = valid  && checkLength($("#amount"),"amount",1,100) && checkIfNumber($("#amount"));

		if (valid) {

			    var current_id = $("#myModal").find("#add_form").attr("row-id");
		    var row = {

		        	 id    : parseInt(current_id),  // $.attr() returns string
		    		 title : $("#title").val(),
					 brand   : $("#brand").val(),
					 amount : parseFloat($("#amount").val()),
					 tf_q : $("#tf_q").val(),
					 tf_year : $("#tf_year").val(),
					wconf : $("#wconf").val()

		    };

		    
		    
	  		$("#add_form").attr("row-id","");
	     	var id = $("#add_form").attr("row-index");
	    	$("#add_form").removeAttr("row-index");
	   		addRow(row, id);	    
	    	renderAll();
	    $('#myModal').modal('hide'); 

	    };	    
			}); 	 


	$('.sortBtn').on('click', function(){   // sort action 

        var currentCriteria = $('#main').attr('sort-criteria');	
		var criteria = $(this).attr('sort-criteria');   //get by what property to sort data
		
		$('#main').attr('sort-criteria', criteria); // add criteria to table 

			var asc = 'ascending' ;
			var desc = 'descending' ;
			var direction =  $('#main').attr('sort-direction');

			
		    if (   (currentCriteria != criteria )     ) {   // if there was sort action with other criteria (for make first sort in ascending)
		    			
		    		
		    			direction = null;

		    	}

		    	
		    		 
		 		if (direction)    // choose what direction to ad in dependence of it was a sort action before or not
		 		   	{

		 		   		if (direction == asc) {
		 		   		  	$('#main').attr('sort-direction',desc)
		 		   	}else{

		 		   		$('#main').attr('sort-direction',asc);

		 		   		 }

		 		   	}else{         // if there wasn't any sort action before add by default sor in asscendent


		 		   			$('#main').attr('sort-direction', 'ascending')
		 		   	}
		 		   	renderAll();
								
	});		 
 
});




function renderAll(){
	var storage = $.localStorage;
    	
	if ( localStorage.getItem("rows") != null) {
		
		rows = $.localStorage('rows');

		loadRows();
		loadTotal();

	}else{

		$.localStorage('rows', rows); // create obj rows in storage if doesn't exist
	}

	
}


function addRow(row, id ){

   if(id != null){
      rows[id] = row;

   }else{
    
	rows.push(row); 
	id = rows.length - 1; // last element


	if (rows.length == 1) {
         rows[id].id = 1;
         
	 }
	 	else{

	 		var newid = rows[id - 1].id + 1  // increment id of previous element
	 		rows[id].id = newid // add new id to last element

	 } ;
}  
	$.localStorage('rows', rows);


}


function updateRow(id){
	$('#myModal').modal('show'); 


var row = rows[id];

	   $("#title").val(row.title  );
	   $("#brand").val(row.brand);
	  $("#amount").val(row.amount);
	   $("#tf_q").val(row.tf_q);
	  $("#tf_year").val(row.tf_year);
	  $("#wconf").val(row.wconf);

	  $("#add_form").attr("row-index" , id);

	  $("#add_form").attr("row-id",row.id)

	  

}

function deleteRow(id){
	$( "#dialog-confirm" ).dialog({
			width : 500,
			modal: true,
			buttons: {
				"OK" : function(){
					
					rows.splice(id,1);
					$.localStorage('rows', rows);
					$( this ).dialog( "close" );
					renderAll();

				},
				"Cancel" : function(){
					$(this).dialog("close");
				}
			}


	}
		);
	
}


function loadRows() {

 

 var data = { "rows" : rows ,

 			"chf" : function (){
 				return   this.amount +(this.amount * 0.1);
					},

 			"index" : function(){
 							
 						return rows.indexOf(this);
 					}	
 			
	};

     var  criteria =  $('#main').attr('sort-criteria');
     var  direction = $('#main').attr('sort-direction');

if (criteria && direction) {

	 if( !parseInt(rows[0][criteria])){

	 	data.rows = rows.sort(sortAlphabetical(criteria,direction));
	 }
	 else{

		data.rows = rows.sort(sortNumeric(criteria,direction));
		}
	}
    

	

  var template = $('#row_template').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, data );
  $('tbody').html(rendered);

  

}

function loadTotal(){
	var totalUSD = 0;
	var totalCHF = 0;
	var num = rows.length;
  
for (var i = 0; i < rows.length ; i++) {
    var CHF =  rows[i].amount + (rows[i].amount * 0.1);
	totalUSD +=   rows[i].amount;
	totalCHF += CHF;
	
}

	var template = $('#totals_template').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, { "totalUSD" : totalUSD, "totalCHF" : totalCHF, "num" : num }   );
  $('#totals').html(rendered);

}


// validation funcion
 function checkLength( o, n, min, max ) {
      if ( o.val().length > max || o.val().length < min ) {

      	var tip = "Length of " + n + " must be between " +
          min + " and " + max + "." ;

        o.addClass( "ui-state-error" );
		

		o.popover({
        title: 'Error',
        content: tip,
        trigger: 'manual',
        placement:'top',
        html: true
    });
		o.popover('show');

		 setTimeout(function() {
        o.popover("hide");
      }, 5000 );
       
        return false;
      } else {
        return true;
      }
    }


    function checkIfNumber(o){
    	var num = parseFloat(o.val());
    	if( !$.isNumeric( o.val() )){
    		o.addClass( "ui-state-error" );
		

		o.popover({
        title: 'Error',
        content: "Must be number",
        trigger: 'manual',
        placement:'top',
        html: true
    });
		o.popover('show');

		 setTimeout(function() {
        o.popover("hide");
      }, 5000 );
		 return false;
    	}else{
    		return true;
    	}
    }


    function sortAlphabetical(criteria, direction) {
    	if (direction == 'ascending') {
    			return	function(a,b){
    				
    				return a[criteria]<b[criteria]
    			};
    		}
    		else if (direction == 'descending') { 
    			return function(a,b){
    				return b[criteria]<a[criteria]
    			};	
    }
}

    function sortNumeric(criteria ,direction){

      
    		if (direction == 'ascending') {
    			return	function(a,b){
    				
    				return a[criteria]-b[criteria]
    			};
    		}
    		else if (direction == 'descending') { // choos else if instead of else in case direction is different of ascending and descending
    			return function(a,b){
    				return b[criteria]-a[criteria]
    			};	
    		}    

    }

