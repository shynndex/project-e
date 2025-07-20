
exports.formatOrder = (order) => {
    return {
        _id: order.id,
        customerEmail: order.customer_email,
        total: parseFloat(order.total),
        status: order.status,
        deliveryAddress: order.delivery_address,
        paymentMethod: order.payment_method,
        createdAt: order.created_at,
        updatedAt: order.updated_at
    };
};


exports.validateOrderData = (orderData) => {
    const errors = [];
    
    if (!orderData.customerEmail) {
        errors.push('Customer email is required');
    }
    
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        errors.push('Order items are required');
    }
    
    if (orderData.total === undefined || orderData.total < 0) {
        errors.push('Valid total amount is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};