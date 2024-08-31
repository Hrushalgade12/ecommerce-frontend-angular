export interface SignUp{
    name:string,
    password:string,
    email:string
}

export interface Login{
    password:string,
    username:string
}
export interface Product{
    id:string;
    pName:string;
    price:number;
    color:string;
    catagory:string;
    desc:string;
    image:string;
    quantity:undefined|number;
}
export interface Cart{
    id:string;
    productId:string;
    pName:string;
    price:number;
    color:string;
    catagory:string;
    desc:string;
    image:string;
    quantity:undefined|number;
    userId:string;
}
export interface PriceSummary{
    price:number;
    discount:number;
    tax:number;
    deliveryCharges:number;
    total:number;
}
export interface Order{
    email:string,
    address:string,
    contact:string,
    totalPrice:number,
    userId:string,
    id:number|undefined
}