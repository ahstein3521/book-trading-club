var URL=q=>"https://www.googleapis.com/books/v1/volumes?q="+q+"+intitle:"+q+"&printType=books&filter=paid-ebooks";
var query=$("input[type='text']");
var results=[];
var Default_IMG="https://placeholdit.imgix.net/~text?txtsize=33&txt=ImageNotAvailable&w=100&h=150";

var formatBook=function(book,i){
	var btn=isNaN(i)? "<span class='close delete-btn' id='"+book._id+"'>X</span>": "";
	var _class=isNaN(i)? "" : " class='result' ";

	return "<div "+_class+" id='"+i+"'>"+btn+"<img src='"+book.image +" 'title='"+book.title+"'></div>"
}

var formatAuthor=function(authors){
	if(!authors) return "Anon";
	if(authors.length==1) return authors[0];

	return authors.join(", ");
}

$('.search').on('show.bs.modal',function(){
	$.getJSON(URL(query.val()),function({items}){
		var html='';
		console.log(items)
		results=items.map(book=>{
			var _=book.volumeInfo
			return {title:_.title, 
					image:_.imageLinks? _.imageLinks.thumbnail : Default_IMG,
					authors:formatAuthor(_.authors),
					description:_.description || "No description",
					pageCount:_.pageCount,
					publisher:_.publisher,
					averageRating:_.averageRating}
				})
			results.forEach((book,i)=> html+= formatBook(book,i))
			$(".modal-body").html("<div class='results'>"+html+"</div>")
			query.val("")	
	})
})

$(document).on("click",".result",function(){
	var result_index=$(this).attr("id");
	var result=results[result_index];
	if(confirm("Would you like to add "+result.title+" to your collection?")){
		$.ajax({
			url:"/add",
			type:"POST",
			data:result,
			success:function(data){
				$(".books").append(formatBook(data,NaN))
				$(".search").modal("hide");
			}
		})
	}
})

$(document).on("click",".delete-btn",function(){
	var id=$(this).attr("id");
	var _this=this;
	if(confirm("Are you sure you want to delete this from your library?")){
		$.ajax({
			url:"/remove?book="+id,
			type:"DELETE",
			success:function(data){
				console.log(data)
				$(_this).parent().hide();
			}
		})
	}
})
