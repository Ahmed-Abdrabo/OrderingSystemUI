// const API_URL = "https://localhost:7018/api";
const API_URL = "https://orderingsystemserver.runasp.net/api"; // Backend API URL

const token = localStorage.getItem("token"); // Get token globally

// Redirect to login if no token is found
if (!token) {
    window.location.href = "login.html";
}

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("orderId");

    if (!orderId) {
        $("#orderDetails").html(`<p class="text-red-500">Order ID is missing.</p>`);
        return;
    }

    $("#orderDetails").html(`<p class="p-10">Loading....</p>`);


    $.ajax({
        url: `${API_URL}/orders/${orderId}`,
        type: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        success: function (order) {
            displayOrderDetails(order);
        },
        error: function () {
            $("#orderDetails").html(`<p class="text-red-500">Failed to load order details.</p>`);
        }
    });
});

function displayOrderDetails(order) {
    let totalAmount = 0;
    let html = `
        <div class="bg-gray-700 p-4 rounded-lg">
            <p class="text-lg"><strong>Order ID:</strong> ${order.id}</p>
            <p class="text-lg"><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
            <p class="text-lg"><strong>Status:</strong> <span class="text-yellow-400">${order.status}</span></p>
        </div>
        <h3 class="font-semibold mt-4 text-xl">Items:</h3>
        <ul class="list-none mt-2 space-y-2">
    `;

    order.orderItems.forEach(item => {
        totalAmount += item.price * item.quantity; // Calculate total
        html += `
            <li class="flex justify-between bg-gray-600 p-3 rounded-lg">
                <span>${item.productName} - <span class="text-yellow-300">Quantity: ${item.quantity}</span></span>
                <span class="text-green-400">$${(item.price * item.quantity).toFixed(2)}</span>
            </li>
        `;
    });

    html += `</ul>`;

    $("#orderDetails").html(html);
    $("#orderTotal").text(`$${totalAmount.toFixed(2)}`);
}
