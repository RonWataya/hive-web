
document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const paymentMethod = document.querySelector('input[name="payment_method"]:checked');

    if (!paymentMethod) {
        alert('Please select a payment method.');
        return;
    }



    if (paymentMethod.value === 'card') {
        // Handle card payment (Stripe)
        // Assume you have the userId and price defined somewhere


        // Make the fetch request to your server
        try {
            const userData = sessionStorage.getItem('userData');
            const user = JSON.parse(userData);
            const userId = user.id;
            Price = '299';

            const response = await fetch('https://malh.fun:4000/api/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    price: Price
                }),
            });

            // Rest of the code...


            if (response.ok) {
                const data = await response.json();
               // console.log('Stripe Response:', data);

                // Handle the redirect on the client side
                window.location.href = data.url;
            } else {
                console.error('Stripe Error:', response.status, await response.text());
                // Handle errors
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            // Handle errors
        }



    } else if (paymentMethod.value === 'paypal') {
        // Handle card payment (Stripe)
        // Assume you have the userId and price defined somewhere


        // Make the fetch request to your server
        try {
            const userData = sessionStorage.getItem('userData');
            const user = JSON.parse(userData);
            const userId = user.id;
            const price = '2.99'; // Set the correct price value
    
            const response = await fetch('https://malh.fun:4000/create_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    price: price,
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                //console.log('PayPal Order ID:', data.id);
    
                // Redirect to the PayPal checkout URL
                window.location.href = data.url;
            } else {
                console.error('Error creating PayPal order:', response.status, await response.text());
                // Handle errors
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            // Handle errors
        }



    }

});

