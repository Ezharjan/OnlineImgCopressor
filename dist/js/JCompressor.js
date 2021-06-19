function JCompressor(_this,option){if(_this.value==''){return false;}
if(option==undefined){option={}}
var defaultopts={MaxSize:20*1024*1024,IsImg:true,IsPreview:true,PreviewContainer:(_this.name||_this.id)+"_img",IsCompress:true,MaxWidth:750,MaxHeight:1280,MaxCompressSize:0,Quality:0.8,AllowPngToJpg:false,FileType:'blob',ChangeBefore:function(){},ChangeAfter:function(){},FileLoad:function(data,obj){},ErrorEmpty:function(){},ImgPreview:function(data){ImgPreview(data);},NeedDownload:false,DownloadLoad:function(nextfn){}}
var opts={};if(Object.assign==undefined){for(var key in defaultopts){if(option[key]==undefined){opts[key]=defaultopts[key];}else{opts[key]=option[key];}}}else{opts=Object.assign(defaultopts,option);}
if(opts.PreviewContainer!=undefined&&typeof(opts.PreviewContainer)=="string"){opts.PreviewContainer=document.getElementById(opts.PreviewContainer);}
var openobj={FileDom:_this,ChangeBefore:opts.ChangeBefore,ChangeAfter:opts.ChangeAfter,ImgPreview:opts.ImgPreview,FileLoad:opts.FileLoad,ErrorEmpty:opts.ErrorEmpty,BlobToBase64:BlobToBase64,Base64ToBlob:Base64ToBlob,DownloadLoad:opts.DownloadLoad}
openobj.ChangeBefore();var files=_this.files;var isMultiple=_this.hasAttribute('multiple');if(files.length==0){FileEmpty(function(){console.log("未选中文件");});return false;}
if(isMultiple){var fileArr=[];var fileBase64Arr=[];for(var i=0;i<files.length;i++){ProcessingFn(files[i]);}}else{ProcessingFn(files[0]);}
function ProcessingFn(file){if(file.size>opts.MaxSize){FileEmpty(function(){alert('上传文件大小不能超过'+opts.MaxSize+'B，请重新上传！');});return false;}
if(!opts.IsImg){return false;}
if(!/(jp|jpe|pn)g$/.test(file.name)){FileEmpty(function(){alert('图片格式错误，请重新上传！');});return false;}
if(opts.IsCompress){if(file.size<opts.MaxCompressSize){FileReady(file);return false;}else{CompressorFn(file);}}else{FileReady(file);}}
function FileReady(filedata){if(isMultiple){fileArr.push(filedata);BlobToBase64(filedata,function(result){fileBase64Arr.push(result);if(fileBase64Arr.length==files.length){fileLoad(fileArr,fileBase64Arr);}});}else{BlobToBase64(filedata,function(result){fileLoad(filedata,result);});}
function fileLoad(filedata,filebase64){if(opts.IsPreview){openobj.ImgPreview(filebase64);}
if(opts.NeedDownload){DownloadLoad(filedata);}
if(opts.FileType=="base64"){openobj.FileLoad(filebase64);}else{openobj.FileLoad(filedata);}
openobj.ChangeAfter();}}
function ImgPreview(filedata){if(!opts.PreviewContainer){alert("预览图片元素未找到！");return;}
var isimgtag=opts.PreviewContainer.localName=="img";if(isMultiple){if(isimgtag){alert("多张图片预览时PreviewContainer属性值不能是img标签");return;}
opts.PreviewContainer.innerHTML="";filedata.forEach(function(item){var img=document.createElement("img");img.setAttribute("src",item);opts.PreviewContainer.appendChild(img);})}else{if(isimgtag){opts.PreviewContainer.src=filedata;}else{alert("单张图片预览时PreviewContainer属性值必须传入img标签");}}}
function CompressorFn(imgfile){BlobToBase64(imgfile,function(result){var img=new Image();img.src=result;img.onload=function(){var imgw=this.width;var imgh=this.height;var cvsw,cvsh;cvsw=imgw>opts.MaxWidth?opts.MaxWidth:imgw;cvsh=imgh>opts.MaxHeight?opts.MaxHeight:imgh;var wp=imgw/opts.MaxWidth;var hp=imgh/opts.MaxHeight;if(wp>hp){cvsh=imgh/imgw*cvsw;}else if(wp<hp){cvsw=imgw/imgh*cvsh;}
var mimeType=imgfile.type;CanvasDraw(img,cvsw,cvsh,mimeType,function(imgblob){if(opts.AllowPngToJpg&&mimeType=='image/png'&&imgblob.size>opts.MaxCompressSize){CanvasDraw(img,cvsw,cvsh,'image/jpeg',function(imgblob){nextfn(imgblob,imgfile.name.replace(/\.(png|jpg|gif)$/,".jpg"));});}else{nextfn(imgblob,imgfile.name);}});function nextfn(imgblob,imgname){imgblob.name=imgname;if(imgblob.size>=imgfile.size){FileReady(imgfile);openobj.compressed=false;}else{FileReady(imgblob);openobj.compressed=true;}}}})
function CanvasDraw(image,canvasw,canvash,mimeType,callback){var canvas=document.createElement('canvas');var ctx=canvas.getContext('2d');var anw=document.createAttribute("width");anw.nodeValue=canvasw;var anh=document.createAttribute("height");anh.nodeValue=canvash;canvas.setAttributeNode(anw);canvas.setAttributeNode(anh);ctx.drawImage(image,0,0,canvasw,canvash);if(canvas.toBlob==undefined){var imgbase64=canvas.toDataURL(mimeType,opts.Quality);var imgblob=Base64ToBlob(imgbase64);callback(imgblob);}else{var imgblob=canvas.toBlob(function(imgblob){callback(imgblob);},mimeType,opts.Quality);}}}
function BlobToBase64(fileblob,loadfn){var fr=new FileReader();fr.onload=function(){loadfn(this.result);};fr.readAsDataURL(fileblob);}
function Base64ToBlob(base64,mimeType){var bytes=window.atob(base64.split(",")[1]);var ab=new ArrayBuffer(bytes.length);var ia=new Uint8Array(ab);for(var i=0;i<bytes.length;i++){ia[i]=bytes.charCodeAt(i);}
var _blob=new Blob([ab],{type:mimeType});return _blob;}
function FileEmpty(backfn){_this.value='';if(opts.IsPreview&&opts.PreviewContainer){if(isMultiple){opts.PreviewContainer.innerHTML='';}else{opts.PreviewContainer.src='';}}
backfn();openobj.ErrorEmpty();openobj.ChangeAfter();}
function DownloadLoad(filedata){var isArray=filedata instanceof Array;if(isArray&&filedata.length==1){filedata=filedata[0];isArray=false;}
if(isArray){PackInZip(filedata,function(content){openobj.DownloadLoad(function(){DownloadFile("images.zip",content);})});}else{openobj.DownloadLoad(function(){DownloadFile(filedata.name,filedata);})}}
function PackInZip(filearr,callback){var zip=new JSZip();var img=zip.folder("images");var fileNum=0;for(var i=0;i<filearr.length;i++){(function(){var filei=filearr[i];BlobToBase64(filei,function(base64data){base64data=base64data.replace(/(^\s*)data\:.+base64,/,"");img.file(filei.name,base64data,{base64:true});fileNum++;if(fileNum==filearr.length){toBase64Load();}})})()}
function toBase64Load(){var zipdata=zip.generateAsync({type:"blob"});zipdata.then(function(content){callback(content);});}}
function DownloadFile(fileName,content){saveAs(content,fileName);}}