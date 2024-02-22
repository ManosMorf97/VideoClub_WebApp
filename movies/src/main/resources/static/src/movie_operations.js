import root_module from "./root_module.js";
let spanners=document.getElementsByTagName("span");

/*
<div class="external-div">
                <h1>Batman Begins</h1>
                <h2>2005</h2>
                <img src="img1.jpg" alt="none" width="200" height="200" />
                <br>
                <div class="bottom">
                    <a href="" id="more" >more..</a>
                </div>
                <br>
            </div>
            <div class="external-div">
                <h1>Batman Begins</h1>
                <h2>2005</h2>
                <img src="img1.jpg" alt="none" width="200" height="200" />
                <br>
                <h3>Movie</h3>
                <h3>tt0372784</h3>
                <button class="buttonS">LIKE</button>
                <div class="bottom">
                    <a href="" >less</a>
                </div>
                <br>
            </div>




*/
if(localStorage.getItem("LoggedIn")===null||localStorage.getItem("LoggedIn")===undefined){
    let body=document.getElementsByTagName("body")[0].style;
    body.opacity="0.3";
    body["pointer-events"]="none";
}else{
    document.getElementById("welcome_user").appendChild(
        document.createTextNode("Welcome "+localStorage.getItem("LoggedIn")))
}

function changeindexedcolor(i){
    return function changecontentcolor(e){
        console.log("WWWWWWWWWWW")
        spanners[i].classList.add("hoveredspan");
    }
    
}
for(let i=0; i<spanners.length; i++){
    spanners[i].addEventListener("mouseover",changeindexedcolor(i));
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


async function getMovies(url){
    const response=await fetch(url)
    return response.json()

}

async function getMoviesJson(url){
    const response_json=await getMovies(url)
    return response_json.Search
}

async function getBlob(url){
    const response=await fetch(url)
    return response.blob()
}

async function getImageURL(url){
    const blob=await getBlob(url)
    return URL.createObjectURL(blob)
}

function bottomHref(bottom_div,info_message){
    let a_bottom=document.createElement("a")
    a_bottom.setAttribute("href","javascript:void(0);")
    //a_bottom.setAttribute("id","more"+movie.imdbId)
    a_bottom.appendChild(document.createTextNode(info_message))
    bottom_div.appendChild(a_bottom)
    return a_bottom
}


let moreInfo=null
let lessInfo=null

function addmovie(ID){
    return function(){
        let data={}
        data['movieId']=ID
        data['email']=localStorage.getItem("LoggedIn")
        let url='http://localhost:8080/Welcome'
        root_module.activate_loader()
        fetch(url,{
            method:'post',
            mode:'cors',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        }).then((response)=>root_module.afterwards(response)).
        catch((response)=>root_module.afterwards(response))
    }
}

function LogOut(){
    localStorage.removeItem("LoggedIn")
}

moreInfo=function (external_div,movie,bottom_div,a_bottom){
    return function(e){
        let more_info_div=document.createElement("div")
        bottom_div.removeChild(a_bottom)
        external_div.removeChild(bottom_div)
        let added_attributes=["imdbID","Type"]
        for(let attribute of added_attributes){
            let element=document.createElement("h3")
            element.appendChild(document.createTextNode(movie[attribute]))
            more_info_div.appendChild(element)
        }
        let button_elemenent=document.createElement("button")
        button_elemenent.classList.add("buttonS")
        button_elemenent.appendChild(document.createTextNode("LIKE"))
        button_elemenent.addEventListener("click",addmovie(movie.imdbID))
        let less_bottom_div=document.createElement("div")
        less_bottom_div.classList.add("bottom")
        less_bottom_div.appendChild(bottomHref(bottom_div,"less.."))
        more_info_div.appendChild(button_elemenent)
        more_info_div.appendChild(less_bottom_div)
        external_div.appendChild(more_info_div)
        less_bottom_div.addEventListener("click",lessInfo(external_div,more_info_div,movie))
    }
}

lessInfo=function(external_div,more_info_div,movie){
    return function(e){
        external_div.removeChild(more_info_div)
        let bottom_div=document.createElement("div")
        bottom_div.classList.add("bottom")
        let a_bottom=bottomHref(bottom_div,"more..")
        bottom_div.appendChild(a_bottom)
        external_div.appendChild(bottom_div)
        bottom_div.addEventListener("click",moreInfo(external_div,movie,bottom_div,a_bottom))
    }
}
document.getElementById("bye").onclick=LogOut

document.getElementById("inputSearch").addEventListener("keyup",async function (e){
    let movie_at=document.getElementsByClassName("movies")[0]
    removeAllChildNodes(movie_at)
    let search_value=document.getElementById("inputSearch").value
    let url="http://www.omdbapi.com/?apikey=1c07e2b7&&s="+search_value
    if(search_value===undefined || search_value==="")
        return -1;
    let movies=await getMoviesJson(url)
    console.log(movies)
    if(movies===undefined)
        return -1;
    for(let movie of movies){
        let external_div=document.createElement("div")
        external_div.classList.add("external-div")
        let attributes=["h1","h2"]
        let properties=[movie.Title,movie.Year]
        for(let i=0; i<2; i++){
            let element=document.createElement(attributes[i])
            let text=document.createTextNode(properties[i])
            element.appendChild(text)
            external_div.appendChild(element)
        }
        let imageURL=await getImageURL(movie.Poster)
        let img_el=document.createElement("img")
        img_el.setAttribute("src",imageURL)
        img_el.setAttribute("alt","none") //make it better
        img_el.setAttribute("width","200")
        img_el.setAttribute("height","200")
        external_div.appendChild(img_el)
        external_div.appendChild(document.createElement("br"))
        let bottom_div=document.createElement("div")
        bottom_div.classList.add("bottom")
        let a_bottom=bottomHref(bottom_div,"more..")
        a_bottom.addEventListener("click",moreInfo(external_div,movie,bottom_div,a_bottom))
        external_div.appendChild(bottom_div)
        external_div.appendChild(document.createElement("br"))
        movie_at.appendChild(external_div)
    }
    

})
