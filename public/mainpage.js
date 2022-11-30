 
 
 
 function getdata(theurl){
    console.log(theurl);
    var request = new XMLHttpRequest();
    request.open( "GET",`${theurl}`);
    request.send();
 
    request.addEventListener("load",function(){
       let data=JSON.parse(request.responseText);
   //      console.log("request.responseText",data);
   //       console.log("data.url",data.url);
   //  console.log("data.price",data.price);
   //  console.log("data.product",data.product);
   //  console.log("data.desc",data.desc);
        
    
    let image=document.getElementById("image");
    image.src=data.url;

    let price=document.getElementById("price");
    price.innerHTML=data.price;

    let product=document.getElementById("product");
    product.innerHTML=data.product;

    let desc=document.getElementById("description");
    desc.innerHTML=data.desc;

    let dialog=document.getElementById("dialog");
    dialog.open=true; 
   
   dialog.addEventListener("click",function(){
    dialog.open=false;
   })

    })
   


  }
  



