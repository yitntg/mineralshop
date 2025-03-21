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
// main.js 核心代码 
async function renderAllProducts() {
    // 从存储桶直接获取CSV 
    const { data: file, error } = await supabase.storage  
        .from('mineralshop')
        .download('csv/products.csv'); 
 
    if (error) {
        console.error('CSV 加载失败:', error);
        return;
    }
 
    // CSV转对象数组 
    const csvText = await file.text(); 
    const results = Papa.parse(csvText,  {
        header: true,
        dynamicTyping: true 
    });
    
    // 暴力渲染200条 
    const container = document.getElementById('productContainer'); 
    container.innerHTML  = results.data.map(product  => `
        <div class="product-card">
            <div class="image-box">${getImagePlaceholder(product.sku)}</div> 
            <h3>${product.name}</h3> 
            <p class="price">¥${product.price.toFixed(2)}</p> 
            <p class="sku">${product.sku}</p> 
        </div>
    `).join('');
}
 
// 图片占位逻辑 
function getImagePlaceholder(sku) {
    const hasImage = checkImageExists(sku); // 需实现校验逻辑 
    return hasImage ? 
        `<img src="${supabase.storage.from('image').getPublicUrl(`${sku}.jpg`)}">`  :
        '<div class="no-image">暂无图片</div>';
}
