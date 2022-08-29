document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            init() {
                const url = `https://pizza-cart-api.herokuapp.com/api/pizzas`;

                axios
                    .get(url)
                    .then((result) => {
                        this.pizzas = result.data.pizzas;

                        // this.pizzas is declared on your AlpineJS Widget.

                    })
                    .then(() => {
                        
                        return this.createCart();
                        //const pizzas = result.data.pizzas;
                        //this.pizzas = pizzas;
                    })
                    .then((result) => {
                        this.cartId = result.data.cart_code;
                    });

            },

            createCart() {

                return axios
                            .get(`https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=` + this.username)

            },

            showCart() {
                const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

                axios
                .get(url)
                .then((result) =>{
                    this.cart = result.data;
                });
            },

            featuredPizzas(){
                //Get a list of featured pizzas
                return axios
                    .get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
              },
              postfeaturedPizzas(){
                //Get a list of featured pizzas
                return axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
                    .then(()=>{
                      
                      for (let i = 0; i < 4; i++) {
                        return !this.postfeaturedPizzas();
                      }
                      
                    })
              }, 

            pizzaImage(pizza) {
                return `/images/PizzaPicture.webp`
            },


            message: '',
            pizzas: [],
            username: '',
            cartId: '',
            cart: { total: 0 },
            paymentMessage:'',
            payNow: false,
            showCarts: false,
            paymentAmount: 0,

            add(pizza) {
                const params = {
                    cart_code: this.cartId,
                    pizza_id: this.pizza.id 

                }
                axios
                    .post(`https://pizza-cart-api.herokuapp.com/api/pizza-cart/add`, params)
                    .then(() => {
                        this.message = "Pizza added to the cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));

                //alert(pizza.id)
            },

            remove(pizza){
                // /api/pizza-cart/remove
                const params = {
                  cart_code : this.cartId,
                  pizza_id : this.pizza.id
                }
        
                axios
                  .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                  .then(()=>{
                    this.message= "Pizza dropped from the cart"
                    this.showCart();
                  })
                  .catch(err=>alert(err));
        
              },
              pay(pizza){
                const params = {
                  cart_code : this.cartId,
                
                }
        
                axios
                  .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
                  .then(()=>{
                      if(!this.paymentAmount){
                          this.paymentMessage = 'No Amount Entered. Enter Cart Total Please.'
                      }
                      else if(this.paymentAmount >= this.cart.total.toFixed(2)){
                          this.paymentMessage = 'Payment Sucessful!'
                          this.message= this.username  +" Paid!"
                          setTimeout(() => {
                              this.cart.total = ''
                          }, 7000);
          
                      }else{
                          this.paymentMessage = 'Insufficient fund!'
                          setTimeout(() => {
                              this.cart.total = ''
                          }, 4000);
                      }
                  
                  })
                  .catch(err=>alert(err));
                    
              },
            

        }
    })
})