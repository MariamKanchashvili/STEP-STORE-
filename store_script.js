

// პროდუქტების კონტეინერი
let products = document.querySelector(".products-container")

// Pagination ღილაკები
let prevBtn = document.querySelector("#prev")
let nextBtn = document.querySelector("#next")
let pageButtons=document.querySelectorAll(".btn1")

// კატეგორიების კონტეინერი
let categoryContainer = document.querySelector(".store-category")

// მიმდინარე გვერდი
let currentPage = 1

// თითო გვერდზე რამდენი პროდუქტი გამოჩნდეს
let pageSize =8

// მიმდინარე არჩეული კატეგორია
// null ში შემდგომ  ყველა პროდუქტი უნდა გამოჩნდეს
let currentCategory = null



// პროდუქტების წამოღება


async function getProducts(page){

    try {

        // ამ ცვლადში შევინახე ლინკი 
        let url

        // თუ მომხმარებელმა კატეგორია აირჩია
        if(currentCategory){

            // წამოიღოს მხოლოდ ამ კატეგორიის პროდუქტები
            url = `https://api.everrest.educata.dev/shop/products/category/${currentCategory}?page_index=${page}&page_size=${pageSize}`

        }else{

            // თუ კატეგორია არ არის არჩეული
            // წამოიღოს ყველა პროდუქტი
            url = `https://api.everrest.educata.dev/shop/products/all?page_index=${page}&page_size=${pageSize}`

        }

        const response = await fetch(url)

        const data = await response.json()

        console.log(data)

        // ძველი პროდუქტების გასუფთავება
        products.innerHTML = ""

        // პროდუქტების გამოტანა
        data.products.forEach(item => {

            products.innerHTML += productsPrint(item)

        })

    } catch (error) {

        console.log("შეცდომა:", error)

    }
}


// პროდუქტის HTML

function productsPrint(product){
 // ბრენდი გადავიყვანე დიდ ასოებში 
    return `
    
    <div class="card" style="width: 18rem;">

        <img src="${product.thumbnail}" class="card-img-top">

        <div class="card-body">

            <h5 class="card-title">
                ${product.title}
            </h5>

            <p class="card-text">
                ${product.brand.toUpperCase()}
            </p>

            <p>
                ${product.category.name}
            </p>

            <p>
                ${product.price.current}
                ${product.price.currency}
            </p>
            <button class="cart">
                Add To Cart
            </button>

        </div>

    </div>

    `
}



// კატეგორიების წამოღება


async function getCategory(){

    try {

        const response = await fetch(
            "https://api.everrest.educata.dev/shop/products/categories"
        )

        const data = await response.json()

        console.log(data)

    
         categoryContainer.innerHTML = `
            <button
                class="categoryBtn"
                onclick="showAllProducts()"
            >
                All
            </button>
        `

        // თითოეული კატეგორიის გამოტანა
        data.forEach(item => {

            categoryContainer.innerHTML += categoryPrint(item)

        })

    } catch(error){

        console.log("შეცდომა:", error)

    }
}



// კატეგორიის ღილაკი


function categoryPrint(category){

    return `
      
        
        <button
            class="categoryBtn"
            onclick="filterCategory('${category.id}')"
        >
            ${category.name}
        </button>

    `
}



// კატეგორიის ფილტრაცია


function filterCategory(categoryId){

    // ცვლადში შევინახე  არჩეული კატეგორია
    currentCategory = categoryId

    // ახალ კატეგორიაზე გადასვლისას
    // პირველი გვერდიდან იწყება
    currentPage = 1

    // თავიდან ვიძახებ პროდუქტებს
    getProducts(currentPage)

}



// ყველა პროდუქტის ჩვენება


function showAllProducts(){

    currentCategory = null

    currentPage = 1

    getProducts(currentPage)

}



// გვერდის ჩატვირთვისას


getProducts(currentPage)

getCategory()

//გვერდების ღილაკები 

pageButtons.forEach(button=>{
    button.addEventListener("click", ()=>{

        currentPage=Number(button.textContent)
         getProducts(currentPage)
    })
})

// NEXT BUTTON


nextBtn.addEventListener("click", () => {

    currentPage++

    getProducts(currentPage)

})



// PREV BUTTON


prevBtn.addEventListener("click", () => {

    if(currentPage > 1){

        currentPage--

        getProducts(currentPage)

    }

})


// ბრენდების სახელების გამოტანა

const brands=document.getElementById("aside-menu")

async function brandList() {
    try {
    const response=await fetch("https://api.everrest.educata.dev/shop/products/brands")
    const data= await response.json()
     console.log(data)


     data.forEach(item => {

            brands.innerHTML+= brandsPrint(item)

        })


    function brandsPrint(brandsList){
        return `
       
     <option value="${brandsList}">
      ${brandsList.toUpperCase()}
     </option>
  
        
        `
    }


    } catch (error) {
        console.log("შეცდომაა" , error)
    }
}
brandList()


function brandChanged(brandName) {
    currentPage = 1
    getBrandProducts(brandName)
}



// BRAND PRODUCTS


async function getBrandProducts(brandName) {

    try {

        const response = await fetch(
            `https://api.everrest.educata.dev/shop/products/brand/${brandName}?page_index=${currentPage}&page_size=${pageSize}`
        )

        const data = await response.json()

        products.innerHTML = ""

        data.products.forEach(item => {
            products.innerHTML += productsPrint(item)
        })

    } catch (error) {
        console.log(error)
    }
}

const searchInput=document.getElementById("searchInput")
const searchBtn=document.getElementById("searchBtn")
const brandSelect=document.getElementById("aside-menu")
async function searchProducts() {

    try {
    const keyword=searchInput.value
    const brand=brandSelect.value
    const rating=document.getElementById("rating").value
    const minPrice=Number(document.getElementById("minPrice").value)
    const maxPrice=Number(document.getElementById("maxPrice").value)
    const sortBy=document.getElementById("sortBy").value
    const sortDirection=document.getElementById("sortDirection").value

    let url= `https://api.everrest.educata.dev/shop/products/search?`
    if(keyword){
        url+=`keywords=$keyword&`
    }
    if(brand){
        url+=`brand=${brand}`
    }
     if(rating){
            url += `rating=${rating}&`
        }

        if (minPrice >= 0 && !isNaN(minPrice)) {
            url += `price_min=${minPrice}&`

        }

        if(maxPrice>=0 && !isNaN(maxPrice)){
            url += `price_max=${maxPrice}&`
        }

        if(sortBy){
            url += `sort_by=${sortBy}&`
        }

        if(sortDirection){
            url += `sort_direction=${sortDirection}&`
        }
url=url.slice(0,-1)
   console.log("FINAL URL:", url)
        

   const response=await fetch(url)
   const data=await response.json()
     products.innerHTML = ""

        data.products.forEach(item => {
            products.innerHTML += productsPrint(item)
        })
    } catch (error) {
        console.log("შეცდომაა keyword-ის ძებნისას")
    }
   
}


searchBtn.addEventListener("click",()=>{
    const keyword=searchInput.value
    searchProducts(keyword)
    const brand=brandSelect.value
    const rating=document.getElementById("rating").value
    const minPrice=document.getElementById("minPrice").value
    const maxPrice=document.getElementById("maxPrice").value
    const sortBy=document.getElementById("sortBy").value
    const sortDirection=document.getElementById("sortDirection").value
     console.log(keyword)

    console.log(brand)

    console.log(rating)

    console.log(minPrice)

    console.log(maxPrice)

    console.log(sortBy)

    console.log(sortDirection)
})

//sign up 

let accessToken="";  //რადგან ფუნქციიდან ვერ გამოდის ვქმნით გლობალ ცვლადს რაც საშუალებას გვაძლევს რომ გარედან შევიტანთ ფუნქციის დაბრუნებისას

async function signUp(event) {
event.preventDefault();

    const userData={
firstName:document.getElementById("signup-firstname").value,
lastName:document.getElementById("signup-lastname").value,
age:Number(document.getElementById("signup-age").value),
email:document.getElementById("signup-email").value,
password:document.getElementById("signup-password").value,
address:document.getElementById("signup-address").value,
phone:document.getElementById("signup-phone").value,
zipcode:document.getElementById("signup-zipcode").value,
avatar:document.getElementById("signup-avatar").value,
gender:document.querySelector('input[name="gender"]:checked')?.value,

  };
  console.log(userData)
  const res=await fetch("https://api.everrest.educata.dev/auth/sign_up",
    {
   method:"POST",
   headers:{
    "Content-type":"application/json",
    "Accept":"*/*"
   },
   body:JSON.stringify(userData)
  })

  const data= await res.json()
  if(res.ok){
    alert("Signed up");
}else{
    alert("Something went wrong");
}
  console.log(data)
   
}

document
.getElementById("signup-form")
.addEventListener("submit",signUp)



