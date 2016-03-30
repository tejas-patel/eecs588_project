$(document).ready(function(){
	var id = $("#safe-echo").html();
	$.ajax({
            type: "post",
            url: "get_uncompress.php",
            data: "uniq_id=" + id,
            success: function(data){
            	id_val_map = JSON.parse(data);
            	for(var key in id_val_map){
            		 $('span[data-safecompress-id="'+key+'"]').replaceWith(id_val_map[key]);

            	}
            }
        });
});

