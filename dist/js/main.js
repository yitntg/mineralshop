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
// 商品加载模块 
let products = [];
async function loadProducts() {
    const { data, error } = await supabase 
        .from('products')
        .select('*')
        .eq('stock', true);
 
    if (!error) {
        products = data;
        renderProducts();
    }
}
 
// 购物车管理系统 
const cart = {
    items: JSON.parse(localStorage.getItem('cart'))  || [],
    addItem(productId) {
        const existing = this.items.find(i  => i.id  === productId);
        existing ? existing.quantity++  : this.items.push({  id: productId, quantity: 1 });
        this.save(); 
    },
    save() {
        localStorage.setItem('cart',  JSON.stringify(this.items)); 
        document.getElementById('cart-counter').textContent  = this.items.length; 
    }
};
 
// 初始化加载 
document.addEventListener('DOMContentLoaded',  () => {
    loadProducts();
    supabase.auth.getSession();  // 检查当前会话 
});
// 分类筛选逻辑 
document.querySelectorAll('.category-btn').forEach(btn  => {
    btn.addEventListener('click',  function() {
        // 移除所有激活状态 
        document.querySelectorAll('.category-btn').forEach(b  => b.classList.remove('active')); 
        // 设置当前激活状态 
        this.classList.add('active'); 
        // 获取分类标识 
        const category = this.dataset.category; 
        // 执行筛选（需与商品数据联动）
        filterProducts(category);
    });
});
 
// 示例筛选函数（需对接Supabase数据）
function filterProducts(category) {
    const allProducts = document.querySelectorAll('.product-card'); 
    allProducts.forEach(product  => {
        const matches = (category === 'all') || 
                       (product.dataset.category  === category);
        product.style.display  = matches ? 'block' : 'none';
    });
}
 
// 初始化加载 
document.addEventListener('DOMContentLoaded',  () => {
    // 模拟商品数据加载 
    setTimeout(() => {
        document.querySelector('.product-grid').innerHTML  = `
            <div class="product-card" data-category="crystal">
                <img src="assets/crystal.jpg"  alt="水晶">
                <h3>天然白水晶</h3>
                <p>¥ 680.00</p>
            </div>
            <!-- 更多商品卡片... -->
        `;
    }, 500);
});
let currentPage = 1;
const loadProducts = async (category = 'all') => {
    // 模拟API请求 
    const response = await fetch(`/api/products?category=${category}&page=${currentPage}`);
    const data = await response.json(); 
    
    // 渲染商品卡片 
    const grid = document.querySelector('.seamless-product-grid'); 
    data.products.forEach(product  => {
        const card = document.createElement('div'); 
        card.className  = 'product-card';
        card.innerHTML  = `
            <img src="${product.image}"  alt="${product.name}"> 
            <div class="product-info">
                <h3>${product.name}</h3> 
                <p>¥${product.price.toFixed(2)}</p> 
            </div>
        `;
        grid.appendChild(card); 
    });
 
    // 更新页码与加载状态 
    currentPage++;
    isLoading = false;
};
 
// 滚动监听 
window.addEventListener('scroll',  () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement; 
    if (scrollTop + clientHeight >= scrollHeight - 500 && !isLoading) {
        loadProducts();
    }
});
// 分类点击事件 
document.querySelectorAll('.category-tab').forEach(tab  => {
    tab.addEventListener('click',  function() {
        // 重置状态 
        document.querySelectorAll('.category-tab').forEach(t  => t.classList.remove('active')); 
        this.classList.add('active'); 
        
        // 清空当前商品并加载新分类 
        document.querySelector('.seamless-product-grid').innerHTML  = '';
        currentPage = 1;
        loadProducts(this.dataset.category); 
 
        // 更新分类数量（示例）
        const countSpan = this.querySelector('.count'); 
        countSpan.textContent  = `(${Math.floor(Math.random()*500)+100})`;  // 需对接真实数据 
    });
});
