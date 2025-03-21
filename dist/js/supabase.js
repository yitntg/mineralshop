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
