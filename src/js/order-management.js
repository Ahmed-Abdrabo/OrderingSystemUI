// API Configuration
const API_URL = "https://orderingsystemserver.runasp.net/api"; // Backend API URL
const token = localStorage.getItem("token"); // Get token globally

// Redirect to login if no token is found
if (!token) {
  window.location.href = "login.html";
}

// Handle "Get Order" Button Click
$(document).on("click", ".get-order", function () {
  const orderId = $(this).data("id");
  window.location.href = `order-details.html?orderId=${orderId}`;
});

$(document).ready(function () {
  const ordersList = $("#ordersList");

  // Fetch & Render Orders
  function fetchOrders() {
    ordersList.html(
      '<tr><td colspan="5" class="text-center text-blue-500">Loading orders...</td></tr>'
    ); // Loading state

    $.ajax({
      url: `${API_URL}/orders`,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      success: function (orders) {
        renderOrders(orders);
      },
      error: function () {
        ordersList.html(
          '<tr><td colspan="5" class="text-center text-red-500">Failed to load orders</td></tr>'
        );
      },
    });
  }

  function renderOrders(orders) {
    ordersList.empty(); // Clear table before appending new data

    if (orders.length === 0) {
      ordersList.append(
        '<tr><td colspan="5" class="text-center text-gray-500">No orders found</td></tr>'
      );
      return;
    }

    orders.forEach((order) => {
      let firstProduct = true; // Flag for rowspan

      order.orderItems.forEach((item, index) => {
        let orderRow = `
          <tr class="odd:bg-gray-800 even:bg-gray-800 border-b border">
            ${index === 0 ? `
            <!-- Order ID -->
            <td class="px-6 py-4 font-medium text-gray-100 text-center align-middle border" rowspan="${order.orderItems.length}">
              <span>${order.id}</span>
            </td>

            <!-- Customer Name -->
            <td class="px-6 py-4 text-gray-100 text-center align-middle border" rowspan="${order.orderItems.length}">
              <span>${order.customerName}</span>
            </td>

            <!-- Order Date -->
            <td class="px-6 py-4 text-gray-300 text-center align-middle border" rowspan="${order.orderItems.length}">
              <span>${new Date(order.orderDate).toLocaleString()}</span>
            </td>

            <!-- Order Status -->
            <td class="px-6 py-4 text-center align-middle border" rowspan="${order.orderItems.length}">
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
            <td class="px-6 py-4 text-gray-300 border">
              <span>${item.quantity}</span>
            </td>

            ${firstProduct ? `
            <!-- Action Buttons -->
            <td class="px-6 py-4 text-center align-middle" rowspan="${order.orderItems.length}">
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
      headers: { Authorization: `Bearer ${token}` },
      success: function () {
        alert("Order canceled successfully.");
        fetchOrders(); // Refresh orders after deletion
      },
      error: function () {
        alert("Failed to cancel order.");
      },
    });
  });

  // Load orders on page load
  fetchOrders();
});
