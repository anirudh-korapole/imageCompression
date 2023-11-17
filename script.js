
function view(){
    const file = document.getElementById('demo').files[0];
    console.log(file);
    imageConversion.compressAccurately(file,10).then(res=>{
    
      console.log(res);
 
      var blobUrl = URL.createObjectURL(res);

      var link = document.createElement("a");
      link.href = blobUrl;
      link.download = "compressed-image.jpg";
      document.body.appendChild(link);
      link.click();
l
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    })
  } 
