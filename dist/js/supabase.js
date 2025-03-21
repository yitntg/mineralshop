const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_KEY';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// 初始化Supabase客户端 
const supabase = supabase.createClient( 
    'https://your-project.supabase.co', 
    'your-anon-key'
);
 
// 实时监听用户状态 
supabase.auth.onAuthStateChange((event,  session) => {
    const authSection = document.getElementById('auth-section'); 
    if (session?.user) {
        authSection.innerHTML  = `<span>欢迎，${session.user.email}</span> 
                                <button onclick="logout()">退出</button>`;
    } else {
        authSection.innerHTML  = '<button onclick="showAuthModal()">登录</button>';
    }
});
 
// 暴露全局方法 
window.loginWith  = async (provider) => {
    await supabase.auth.signInWithOAuth({  provider });
};
 
window.logout  = async () => {
    await supabase.auth.signOut(); 
    localStorage.removeItem('cart'); 
};
// supabase.js 简化配置 
import { createClient } from '@supabase/supabase-js'
export default createClient(
    process.env.SUPABASE_URL,   // Cloudflare环境变量注入 
    process.env.SUPABASE_KEY  
)
// 直接读取存储桶CSV（无需数据库表）
const { data: csvFile } = await supabase.storage  
    .from('mineralshop')
    .download('csv/products.csv'); 
 
// 转换CSV为JSON 
const text = await csvFile.text(); 
const products = Papa.parse(text,  { header: true }).data;
