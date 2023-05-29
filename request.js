$.ajax({
    url: "/drive", 
    type: "post",
    dataType : "json",
    contentType: "application/json",
    data: JSON.stringify({cmd: "list"}),
    success: function(r){
        console.log(r);
    }
});
