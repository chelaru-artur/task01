
var rows = [];

$( document ).ready(function() {



renderAll();

 


$("#save_btn").click(function(  ){
       
			
 var valid = true;
   valid = valid && checkLength( $("#title"), "title", 3, 16 );
   valid = valid  && checkIfNumber($("#amount")) ;     //checkLength($("#amount"),"amount",1,100)

if (valid) {

    var row = {

        
    		 title : $("#title").val(),
			 brand   : $("#brand").val(),
			 amount : parseFloat($("#amount").val()),
			 tf_q : $("#tf_q").val(),
			 tf_year : $("#tf_year").val(),
			wconf : $("#wconf").val()


    };

  
  var id = $("#add_form").attr("row-id");
    $("#add_form").removeAttr("row-id");
   

   

     addRow(row, id);
    
    renderAll();
    $('#myModal').modal('hide'); 

    };
    
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

	  $("#add_form").attr("row-id" , id);

}

function deleteRow(id){
	$( "#dialog-confirm" ).dialog({
			width : 500,
			modal: true,
			buttons: {
				"OK" : function(){
					rows.pop(id);
					$.localStorage('rows', rows);
					$( this ).dialog( "close" );
					loadRows();

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

 			"id" : function(){

 				return rows.indexOf(this);
 			} 
	};

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

