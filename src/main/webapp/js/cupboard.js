/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//addDiaries(10,["template.png","template.png","template.png","template.png","template.png","template.png","template.png","template.png","template.png","template.png",]);

function addDiaries(num,image)
{
    for(i = 0;i < num;i++)
    {
        addDiary(image[i]);
    }
}

function addDiary(name)
{
    var element = document.createElement("div");
    element.classList.add('col-md-11');
    
    var thum = document.createElement("div");
    thum.classList.add('btn');
    thum.classList.add('diary-thumbnail');
    element.appendChild(thum);
    
    element.appendChild(document.createElement("br"));
    
    var chk = document.createElement("div");
    chk.classList.add('btn-group');
    chk.setAttribute("data-toggle", "buttons");
    thum.appendChild(chk);
    
    var lab = document.createElement("label");
    lab.classList.add('btn');
    lab.classList.add('btn-default');
    chk.appendChild(lab);
    
    var but = document.createElement("input");
    but.type = "checkbox";
    but.autocomplete = "off";
    lab.appendChild(but);
    
    var lab2 = document.createElement("label");
    lab2.classList.add('glyphicon');
    lab2.classList.add('glyphicon-ok');
    lab.appendChild(lab2);
    
    var title = document.createElement("label");
    title.classList.add("label");
    title.style.fontSize = "20px";
    title.innerHTML = name;
    title.style.color = '#fff';
    element.appendChild(title);
    
    document.getElementById('dashboard').appendChild(element);
}

function getTheme(count)
{
    console.log("Entered");
    $.ajax({
        url: "/theme", 
        type: "POST",
        dataType: "json",
        mimeType: "application/json",
        data: JSON.stringify({code: "gettheme",last: count}),
        success: function(data)
        {
            console.log("success");
            console.log(data);
        },
        error: function(data)
        {
            console.log("error");
            console.log(data);
        }
    });
    console.log("Ended");
}

// List diaries with their info
$.ajax({
    url: "/drive", 
    type: "post",
    dataType : "json",
    contentType: "application/json",
    data: JSON.stringify({cmd: "listdiaries"}),
    success: function(r){
        console.log(r.responseText);
    }
    ,
    error: function(r){
        console.log(r);
    }
});
