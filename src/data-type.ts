export interface SignUp{
    name:string,
    password:string,
    email:string
}

export interface Login{
    password:string,
    email:string
}
export class Product{
    id:string;
    pName:string;
    price:string;
    color:string;
    catagory:string;
    desc:string;
    image:string
}