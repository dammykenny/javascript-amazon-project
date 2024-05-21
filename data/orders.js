export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
    orders.unshift(order);
    saveTostorage();
}

function saveTostorage() {
    localStorage.setItem('orders', JSON.stringify(orders))
}