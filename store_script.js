

// პროდუქტების კონტეინერი
let products = document.querySelector(".products-container")

// Pagination ღილაკები
let prevBtn = document.querySelector("#prev")
let nextBtn = document.querySelector("#next")

// კატეგორიების კონტეინერი
let categoryContainer = document.querySelector(".store-category")

// მიმდინარე გვერდი
let currentPage = 1

// თითო გვერდზე რამდენი პროდუქტი გამოჩნდეს
let pageSize = 8

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