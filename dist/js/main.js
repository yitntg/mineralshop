// ================== 全局状态 ================== //
let isLoading = false;
let currentPage = 1;
let allProducts = []; // 全量数据缓存 
 
// ================== 核心渲染 ================== //
async function renderAllProducts() {
    isLoading = true;
    
    // 从存储桶获取CSV 
    const { data: file, error } = await supabase.storage  
        .from('mineralshop')
        .download('csv/products.csv'); 
 
    if (error) {
        console.error('CSV 加载失败:', error);
        isLoading = false;
        return;
    }
 
    // 解析CSV 
    const csvText = await file.text(); 
    const results = Papa.parse(csvText,  {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true 
    });
 
    // 缓存全量数据 
    allProducts = results.data; 
    
    // 分页渲染 
    renderPaginatedProducts(currentPage);
    
    isLoading = false;
}
 
// ================== 分页渲染 ================== //
function renderPaginatedProducts(page) {
    const start = (page - 1) * 20;
    const end = start + 20;
    const container = document.getElementById('productContainer'); 
    
    // 创建文档片段优化性能 
    const fragment = document.createDocumentFragment(); 
    
    allProducts.slice(start,  end).forEach(async (product) => {
        const card = document.createElement('div'); 
        card.className  = 'product-card';
        
        // 异步校验图片 
       const results = Papa.parse(csvText,  {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transform: (value) => value.trim(),  // 处理首尾空格 
    error: (err) => {
        console.error('CSV 解析错误:', err.message); 
        document.getElementById('error-toast').textContent  = '数据格式异常';
    }
});
        
        fragment.appendChild(card); 
    });
    
    container.appendChild(fragment); 
    currentPage++;
}
 
// ================== 滚动加载 ================== //
window.addEventListener('scroll',  () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement; 
    if (scrollTop + clientHeight >= scrollHeight - 500 && !isLoading) {
        renderPaginatedProducts(currentPage);
    }
});
 
// ================== 初始化执行 ================== //
document.addEventListener('DOMContentLoaded',  renderAllProducts);
