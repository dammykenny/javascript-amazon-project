import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { loadProducts } from '../data/products.js';
import { loadCart } from '../data/cart.js';
//import '../data/cart-class.js';
//import '../data/backed-practice.js';

Promise.all([
    
new Promise((resolve) => {
    loadProducts(() => {
      resolve('value1');    
    });
}),
new Promise((resolve) => { 
    loadCart(() => {
       resolve();
    });
   })

]).then((values) => {
    console.log(values);
    renderOrderSummary();
    renderPaymentSummary();
});

/*
new Promise((resolve) => {
    loadProducts(() => {
      resolve('value1');    
    });

}).then((value) => {
    console.log(value)

    return new Promise((resolve) => { 
     loadCart(() => {
        resolve();
     });
    });

}).then(() => { 
    renderOrderSummary();
    renderPaymentSummary();
});
*/

/*
 loadProducts(() => {
    loadCart(() => {
        renderOrderSummary();
        renderPaymentSummary();
    });  
 })
*/
 
/*
// checkout.js
import { Car } from '../data/car.js';
const toyotaCorolla = new Car('Toyota', 'Corolla');
const teslaModel3 = new Car('Tesla', 'Model 3');
const hondaAccord = new Car('Honda', 'Accord');
const nissanPathfeinder = new Car('Nissan', 'Pathfeinder');


console.log(toyotaCorolla);
console.log(teslaModel3);
console.log(hondaAccord);
console.log(nissanPathfeinder);
*/