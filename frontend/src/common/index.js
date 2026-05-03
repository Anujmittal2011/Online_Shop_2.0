const backendDomin = process.env.REACT_APP_BACKEND_URL  //"http://localhost:8080"
// const backendDomin = "https://onlineshop-aq8x.onrender.com"


const SummaryApi = {
    signUP: {
      url: `${backendDomin}/api/signup`,
      method: "post",
      withCredentials: true
    },
    signIn: {
      url: `${backendDomin}/api/signin`,
      method: "post",
      withCredentials: true
    },
    current_user: {
      url: `${backendDomin}/api/user-details`,
      method: "get",
      withCredentials: true
    },
    logout_user: {
      url: `${backendDomin}/api/userLogout`,
      method: "get",
      withCredentials: true
    },
    allUser: {
      url: `${backendDomin}/api/all-user`,
      method: "get",
      withCredentials: true
    },
    updateUser: {
      url: `${backendDomin}/api/update-user`,
      method: "post",
      withCredentials: true
    },
    uploadProduct: {
      url: `${backendDomin}/api/upload-product`,
      method: "post",
      withCredentials: true
    },
    allProduct: {
      url: `${backendDomin}/api/get-product`,
      method: "get"
    },
    updateProduct: {
      url: `${backendDomin}/api/update-product`,
      method: "post",
      withCredentials: true
    },
    categoryProduct: {
      url: `${backendDomin}/api/get-categoryProduct`,
      method: "get"
    },
    categoryWiseProduct: {
      url: `${backendDomin}/api/category-product`,
      method: "post"
    },
    productDetails: {
      url: `${backendDomin}/api/product-details`,
      method: "post"
    },
    addToCartProduct: {
      url: `${backendDomin}/api/addtocart`,
      method: "post",
      withCredentials: true
    },
    addToCartProductCount: {
      url: `${backendDomin}/api/countAddToCartProduct`,
      method: "get",
      withCredentials: true
    },
    addToCartProductView: {
      url: `${backendDomin}/api/view-card-product`,
      method: "get",
      withCredentials: true
    },
    updateCartProduct: {
      url: `${backendDomin}/api/update-cart-product`,
      method: "post",
      withCredentials: true
    },
    deleteCartProduct: {
      url: `${backendDomin}/api/delete-cart-product`,
      method: "post",
      withCredentials: true
    },
    searchProduct: {
      url: `${backendDomin}/api/search`,
      method: "get"
    },
    filterProduct: {
      url: `${backendDomin}/api/filter-product`,
      method: "post"
    },
    payment: {
      url: `${backendDomin}/api/checkout`,
      method: "post",
      withCredentials: true
    },
    verifyPayment: {
        url: `${backendDomin}/api/verify-payment`,
        method: "post"
    },
    orderProduct: {
    url: `${backendDomin}/api/order-list`,
    method: "get",
    withCredentials: true
    },
  };
  
  export default SummaryApi;