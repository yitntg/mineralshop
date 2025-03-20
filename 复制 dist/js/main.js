// 商品列表渲染
async function loadProducts() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    const container = document.getElementById('product-list');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>¥${product.price.toFixed(2)}</p>
            <button onclick="addToCart('${product.id}')">加入购物车</button>
        </div>
    `).join('');
}

// 购物车功能
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    document.getElementById('cart-count').textContent = cartItems.length;
}

function addToCart(productId) {
    cartItems.push(productId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
});
