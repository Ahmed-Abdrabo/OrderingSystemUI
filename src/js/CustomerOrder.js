// const API_URL = "https://localhost:7018/api"; // Backend API URL
const API_URL = "https://orderingsystemserver.runasp.net/api"; // Backend API URL
const token = localStorage.getItem("token"); // Get token globally

// Redirect to login if no token is found
if (!token) {
    window.location.href = "login.html";
}


// Store product stock data
let productStockMap = {};


// Load products into dropdown
const loadProducts = () => {
    $.ajax({
        url: `${API_URL}/products`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}` },
        success: function (products) {
            const productSelect = $("#product");
            productSelect.empty(); 

            if (products.length === 0) {
                productSelect.append(`<option disabled class="bg-gray-800 text-white">No products available</option>`);
                return;
            }

            products.forEach((product) => {
                productStockMap[product.id] = product.stock;  
                if (product.stock > 0) {
                productSelect.append(
                    `<option value="${product.id}" class="bg-white-900 text-gray-500">
                        ${product.name} - $${product.price} (Stock: ${product.stock})
                    </option>`
                );
            }
            });
        },
        error: function () {
            alert("Failed to load products");
        },
    });
};

// Store selected products
let selectedProducts = [];

// Add product to the order list
$("#addProduct").click(function () {
     const productId = $("#product").val();
    const productName = $("#product option:selected").text().trim().split(/\s|-/)[0];
    const quantity = parseInt($("#quantity").val());
    const availableStock = productStockMap[productId] || 0; // Get stock from map

    if (!productId || isNaN(quantity) || quantity <= 0) {
        alert("Please select a valid product and quantity.");
        return;
    }
    
    if (quantity > availableStock) {
        alert(`Selected quantity exceeds available stock (${availableStock}).`);
        return;
    }
   // Check if product already exists in selectedProducts
   let existingProduct = selectedProducts.find(item => item.productId == productId);
    
   if (existingProduct) {
       // Update quantity
       let newQuantity = existingProduct.quantity + quantity;

       if (newQuantity > availableStock) {
           alert(`Total quantity exceeds available stock (${availableStock}).`);
           return;
       }

       existingProduct.quantity = newQuantity;

       // Update UI
       $(`#selectedProducts li[data-id="${productId}"] span`).text(`${productName} - Quantity: ${newQuantity}`);
   } else {
       // Add new product
       selectedProducts.push({ productId: parseInt(productId), quantity });

       // Append to UI
       $("#selectedProducts").append(`
           <li data-id="${productId}" class="flex justify-between items-center bg-gray-800 p-2 rounded-lg">
               <span>${productName} - Quantity: ${quantity}</span>
               <button class="text-red-500 remove-product cursor-pointer" data-id="${productId}">Remove</button>
           </li>
       `);
   }
});

// Remove product from the list
$("#selectedProducts").on("click", ".remove-product", function () {
    const productId = $(this).data("id");
    selectedProducts = selectedProducts.filter(item => item.productId !== productId);
    $(this).parent().remove();
});

// Handle Order Submission
$("#createOrderForm").submit(function (e) {
    e.preventDefault();

    if (selectedProducts.length === 0) {
        alert("Please add at least one product to the order.");
        return;
    }

    const orderData = { orderItems: selectedProducts };

    $.ajax({
        url: `${API_URL}/orders`,
        type: "POST",
        contentType: "application/json",
        headers: { Authorization: `Bearer ${token}` },
        data: JSON.stringify(orderData),
        success: function () {
            alert("Order placed successfully!");
            
            // Clear selection
            selectedProducts = [];
            $("#selectedProducts").empty();
            $("#quantity").val(''); // Reset quantity input
            
            // Refresh data
            fetchOrders();  // Reload orders list
            loadProducts(); // Reload products (to update stock)
        },
        error: function () {
            alert("Failed to place order.");
        },
    });
});

const ordersList = $("#ordersList"); // Ensure this is a jQuery object

// Handle "Get Order" Button Click
// Handle "Get" button click
$(document).on("click", ".get-order", function () {
    const orderId = $(this).data("id");
    window.location.href = `order-details.html?orderId=${orderId}`;
});

$(document).ready(function () {
    const ordersList = $("#ordersList");

    // Fetch & Render Orders
    function fetchOrders() {
        $.ajax({
            url: `${API_URL}/orders/GetOrderForCustomer`,
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            success: function (orders) {
                renderOrders(orders);
            },
            error: function () {
                ordersList.html('<tr><td colspan="4" class="text-center text-red-500">Failed to load orders</td></tr>');
            },
        });
    }

    function renderOrders(orders) {
        ordersList.empty(); // Clear table before appending new data

        if (orders.length === 0) {
            ordersList.append('<tr><td colspan="4" class="text-center text-gray-500">No orders found</td></tr>');
            return;
        }

        orders.forEach((order) => {
            let firstProduct = true; // Flag for rowspan
      
            order.orderItems.forEach((item, index) => {
              let orderRow = `
                <tr class="odd:bg-gray-800 even:bg-gray-800 border">
                  ${index === 0 ? `
                  <!-- Order ID -->
                  <td class="px-6 py-4 font-medium text-gray-100 text-center align-middle border" rowspan="${order.orderItems.length}">
                    <span>${order.id}</span>
                  </td>
      
            
      
                  <!-- Order Date -->
                  <td class="px-6 py-4 text-gray-300 text-center align-middle border" rowspan="${order.orderItems.length}">
                    <span>${new Date(order.orderDate).toLocaleString()}</span>
                  </td>
      
                  <!-- Order Status -->
                  <td class="px-6 py-4 text-center align-middle border border-white" rowspan="${order.orderItems.length}">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Pending' ? 'bg-yellow-300 text-gray-800' : 'bg-green-400 text-white'}">
                      ${order.status}
                    </span>
                  </td>
                  ` : ''}
      
                  <!-- Product Name -->
                  <td class="px-6 py-4 text-gray-300 border">
                    <span>${item.productName}</span>
                  </td>
      
                  <!-- Quantity -->
                  <td class="px-6 py-4 text-gray-300 border border-white">
                    <span>${item.quantity}</span>
                  </td>
      
                  ${firstProduct ? `
                  <!-- Action Buttons -->
                  <td class="px-6 py-4 text-center align-middle border border-white" rowspan="${order.orderItems.length}">
                    <div class="flex items-center justify-center gap-2">
                      <button class="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium px-4 py-2 rounded-lg shadow-md get-order"
                              data-id="${order.id}">
                        Get
                      </button>
                      <button class="bg-red-600 hover:bg-red-700 text-white cursor-pointer font-medium px-4 py-2 rounded-lg shadow-md delete-order"
                              data-id="${order.id}">
                        Delete
                      </button>
                    </div>
                  </td>
                  ` : ''}
                </tr>`;
      
              ordersList.append(orderRow);
              firstProduct = false;
            });
          });
    }

    // Delete Order Handler
    ordersList.on("click", ".delete-order", function () {
        let orderId = $(this).data("id");

        if (!confirm("Are you sure you want to cancel this order?")) return;

        $.ajax({
            url: `${API_URL}/orders/${orderId}`,
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            success: function () {
                alert("Order canceled successfully.");
                fetchOrders(); // Refresh orders after deletion
            },
            error: function () {
                alert("Failed to cancel order.");
            },
        });
    });

    // Load products and orders on page load
    loadProducts();
    fetchOrders();
});