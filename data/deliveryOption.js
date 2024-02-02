export const deliveryOptions = [{
  id:'1',
  deliveryDays: 7,
  priceCents: 0
},{
  id:'2',
  deliveryDays: 3,
  priceCents: 499
}, {
  id:'3',
  deliveryDays: 1,
  priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });

    return deliveryOption;
};

export function calculateDeliveryDate(deliveryOption) {
  const today = new Date();
  let deliveryDate = new Date(today.getTime() + deliveryOption.deliveryTime * 24 * 60 * 60 * 1000);
  
  // Skip weekends
  while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return deliveryDate.toLocaleDateString('en-US', options);
}
