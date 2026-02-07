// ===== Supabase 初期化（app.jsの一番上に置く）=====
const SUPABASE_URL = "https://vhnshcsfucefikbxhuxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZQNSoFRd8Yhw5Qt6WBM2HA_nEjb1214";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 画面切り替え（あなたのDOMに合わせた最小）
function showScreen(screenId) {
  document.getElementById("loginScreen")?.classList.add("hidden");
  document.getElementById("mainScreen")?.classList.add("hidden");
  document.getElementById("adminScreen")?.classList.add("hidden");
  document.getElementById(screenId)?.classList.remove("hidden");
}

// グローバル変数
let currentUser = null;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    // ログイン状態チェック
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        showScreen(currentUser.role);
    } else {
        showLoginScreen();
    }

    // イベントリスナー設定
    setupEventListeners();
});

// イベントリスナー設定
function setupEventListeners() {
    // ログインフォーム
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // ログアウトボタン
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', handleLogout);
    }
}

// 社員画面のイベントリスナーを設定
function setupEmployeeListeners() {
    // タブ切り替え（社員用）
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab, '.tab-button', '.tab-content');
            
            // タブ切り替え時にデータをロード
            if (this.dataset.tab === 'kpi') {
                loadKpiData();
            } else if (this.dataset.tab === 'sales') {
                loadSalesData();
            } else if (this.dataset.tab === 'review') {
                loadReviewData();
            } else if (this.dataset.tab === 'dashboard') {
                loadDashboard();
            }
        });
    });
    
    // フォーム送信
    const kpiForm = document.getElementById('kpiForm');
    if (kpiForm) {
        kpiForm.addEventListener('submit', handleKpiSubmit);
    }
    
    const salesForm = document.getElementById('salesForm');
    if (salesForm) {
        salesForm.addEventListener('submit', handleSalesSubmit);
    }
    
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
    
    // 日付の初期値設定
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    
    const salesDate = document.getElementById('salesDate');
    if (salesDate) {
        salesDate.value = today;
    }
    
    const reviewDate = document.getElementById('reviewDate');
    if (reviewDate) {
        reviewDate.value = today;
    }
    
    const kpiMonth = document.getElementById('kpiMonth');
    if (kpiMonth) {
        kpiMonth.value = thisMonth;
    }
}

// 管理者画面のイベントリスナーを設定
function setupAdminListeners() {
    // タブ切り替え（管理者用）
    document.querySelectorAll('.admin-tab-button').forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab, '.admin-tab-button', '.tab-content', 'adminTab');
            
            // タブ切り替え時にデータをロード
            if (this.dataset.tab === 'adminKpi') {
                loadAdminKpiData();
            } else if (this.dataset.tab === 'adminSales') {
                loadAdminSalesData();
            } else if (this.dataset.tab === 'adminReview') {
                loadAdminReviewData();
            } else if (this.dataset.tab === 'adminOverview') {
                loadAdminOverview();
            }
        });
    });
    
    // 管理者フィルター
    const applyFilterBtn = document.getElementById('applyFilter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyAdminFilter);
    }
    
    // 月フィルターの初期値設定
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter) {
        monthFilter.value = thisMonth;
    }
}

// ログイン処理
async function loginWithSupabase(e) {
  e.preventDefault();

  const emailEl = document.getElementById("email");
  const passEl  = document.getElementById("password");

  if (!emailEl || !passEl) {
    alert("ログイン画面の input(id=email / id=password) が見つかりません。index.htmlのIDを確認してください。");
    return;
  }

  const email = emailEl.value.trim();
  const password = passEl.value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert("ログイン失敗: " + error.message);
    return;
  }

  // 成功 → mainScreenへ
  showScreen("mainScreen");
}

// loginScreen内のフォームに紐づけ
window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginScreen form");
  if (!loginForm) {
    alert("ログインフォームが見つかりません（#loginScreen form）。index.htmlを確認してください。");
    return;
  }
  loginForm.addEventListener("submit", loginWithSupabase);
});

// ログアウト処理
function handleLogout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  showLoginScreen();
}

// 画面表示切り替え
function showScreen(id) {
  document.getElementById("loginScreen")?.classList.add("hidden");
  document.getElementById("mainScreen")?.classList.add("hidden");
  document.getElementById("adminScreen")?.classList.add("hidden");
  document.getElementById(id)?.classList.remove("hidden");
}

    
    if (role === 'admin') {
        document.getElementById('adminScreen').classList.remove('hidden');
        document.getElementById('adminUserInfo').textContent = `${currentUser.name} (${currentUser.department})`;
        setupAdminListeners();
        loadAdminData();
    } else {
        document.getElementById('mainScreen').classList.remove('hidden');
        document.getElementById('userInfo').textContent = `${currentUser.name} (${currentUser.department})`;
        setupEmployeeListeners();
        loadKpiData();
    }


function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('adminScreen').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

// タブ切り替え
function switchTab(tabName, buttonSelector, contentSelector, suffix = 'Tab') {
    // すべてのタブボタンとコンテンツから active クラスを削除
    document.querySelectorAll(buttonSelector).forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll(contentSelector).forEach(content => content.classList.remove('active'));
    
    // 選択されたタブをアクティブに
    document.querySelector(`${buttonSelector}[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(tabName + suffix)?.classList.add('active');
}

// ===== KPI目標管理 =====

async function handleKpiSubmit(e) {
    e.preventDefault();
    
    const kpiData = {
        employee_id: currentUser.employee_id,
        month: document.getElementById('kpiMonth').value,
        sales_target: parseInt(document.getElementById('salesTarget').value),
        visit_target: parseInt(document.getElementById('visitTarget').value),
        contract_target: parseInt(document.getElementById('contractTarget').value),
        call_target: parseInt(document.getElementById('callTarget').value)
    };
    
    try {
        // 同じ月のKPIが既に存在するか確認
        const response = await fetch(`tables/kpi_targets?limit=100`);
        const data = await response.json();
        const existingKpi = data.data.find(kpi => 
            kpi.employee_id === currentUser.employee_id && kpi.month === kpiData.month
        );
        
        if (existingKpi) {
            // 更新
            await fetch(`tables/kpi_targets/${existingKpi.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(kpiData)
            });
            showMessage('kpiMessage', 'KPI目標を更新しました', 'success');
        } else {
            // 新規作成
            await fetch('tables/kpi_targets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(kpiData)
            });
            showMessage('kpiMessage', 'KPI目標を保存しました', 'success');
        }
        
        loadKpiData();
    } catch (error) {
        console.error('KPI save error:', error);
        showMessage('kpiMessage', '保存に失敗しました', 'error');
    }
}

async function loadKpiData() {
    try {
        const response = await fetch(`tables/kpi_targets?limit=100`);
        const data = await response.json();
        const userKpis = data.data.filter(kpi => kpi.employee_id === currentUser.employee_id)
            .sort((a, b) => b.month.localeCompare(a.month));
        
        const listDiv = document.getElementById('kpiList');
        if (userKpis.length === 0) {
            listDiv.innerHTML = '<p class="text-gray-500">まだKPI目標が設定されていません</p>';
            return;
        }
        
        listDiv.innerHTML = userKpis.map(kpi => `
            <div class="bg-gray-50 p-4 rounded border">
                <div class="flex justify-between items-center">
                    <div>
                        <span class="font-bold">${kpi.month}</span>
                        <span class="ml-4">売上: ${kpi.sales_target.toLocaleString()}円</span>
                        <span class="ml-4">訪問: ${kpi.visit_target}件</span>
                        <span class="ml-4">契約: ${kpi.contract_target}件</span>
                        <span class="ml-4">架電: ${kpi.call_target}件</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Load KPI error:', error);
    }
}

// ===== 営業数値管理 =====

async function handleSalesSubmit(e) {
    e.preventDefault();
    
    const salesData = {
        employee_id: currentUser.employee_id,
        date: document.getElementById('salesDate').value,
        sales_amount: parseInt(document.getElementById('salesAmount').value),
        visits: parseInt(document.getElementById('visits').value),
        contracts: parseInt(document.getElementById('contracts').value),
        calls: parseInt(document.getElementById('calls').value)
    };
    
    try {
        // 同じ日のデータが既に存在するか確認
        const response = await fetch(`tables/sales_records?limit=1000`);
        const data = await response.json();
        const existingRecord = data.data.find(record => 
            record.employee_id === currentUser.employee_id && record.date === salesData.date
        );
        
        if (existingRecord) {
            // 更新
            await fetch(`tables/sales_records/${existingRecord.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(salesData)
            });
            showMessage('salesMessage', '営業数値を更新しました', 'success');
        } else {
            // 新規作成
            await fetch('tables/sales_records', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(salesData)
            });
            showMessage('salesMessage', '営業数値を保存しました', 'success');
        }
        
        loadSalesData();
    } catch (error) {
        console.error('Sales save error:', error);
        showMessage('salesMessage', '保存に失敗しました', 'error');
    }
}

async function loadSalesData() {
    try {
        const response = await fetch(`tables/sales_records?limit=1000`);
        const data = await response.json();
        
        // 今月のデータのみ表示
        const thisMonth = new Date().toISOString().slice(0, 7);
        const userSales = data.data
            .filter(record => record.employee_id === currentUser.employee_id && record.date.startsWith(thisMonth))
            .sort((a, b) => b.date.localeCompare(a.date));
        
        const listDiv = document.getElementById('salesList');
        if (userSales.length === 0) {
            listDiv.innerHTML = '<p class="text-gray-500">今月の営業数値がまだ登録されていません</p>';
            return;
        }
        
        listDiv.innerHTML = `
            <table class="min-w-full bg-white border">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-4 py-2 border">日付</th>
                        <th class="px-4 py-2 border">売上金額</th>
                        <th class="px-4 py-2 border">訪問件数</th>
                        <th class="px-4 py-2 border">契約件数</th>
                        <th class="px-4 py-2 border">架電件数</th>
                    </tr>
                </thead>
                <tbody>
                    ${userSales.map(record => `
                        <tr>
                            <td class="px-4 py-2 border">${record.date}</td>
                            <td class="px-4 py-2 border text-right">${record.sales_amount.toLocaleString()}円</td>
                            <td class="px-4 py-2 border text-center">${record.visits}</td>
                            <td class="px-4 py-2 border text-center">${record.contracts}</td>
                            <td class="px-4 py-2 border text-center">${record.calls}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Load sales error:', error);
    }
}

// ===== 日次振り返り管理 =====

async function handleReviewSubmit(e) {
    e.preventDefault();
    
    const reviewData = {
        employee_id: currentUser.employee_id,
        date: document.getElementById('reviewDate').value,
        achievements: document.getElementById('achievements').value,
        challenges: document.getElementById('challenges').value,
        tomorrow_plan: document.getElementById('tomorrowPlan').value
    };
    
    try {
        // 同じ日のデータが既に存在するか確認
        const response = await fetch(`tables/daily_reviews?limit=1000`);
        const data = await response.json();
        const existingReview = data.data.find(review => 
            review.employee_id === currentUser.employee_id && review.date === reviewData.date
        );
        
        if (existingReview) {
            // 更新
            await fetch(`tables/daily_reviews/${existingReview.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(reviewData)
            });
            showMessage('reviewMessage', '振り返りを更新しました', 'success');
        } else {
            // 新規作成
            await fetch('tables/daily_reviews', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(reviewData)
            });
            showMessage('reviewMessage', '振り返りを保存しました', 'success');
        }
        
        loadReviewData();
    } catch (error) {
        console.error('Review save error:', error);
        showMessage('reviewMessage', '保存に失敗しました', 'error');
    }
}

async function loadReviewData() {
    try {
        const response = await fetch(`tables/daily_reviews?limit=1000`);
        const data = await response.json();
        const userReviews = data.data
            .filter(review => review.employee_id === currentUser.employee_id)
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 10);
        
        const listDiv = document.getElementById('reviewList');
        if (userReviews.length === 0) {
            listDiv.innerHTML = '<p class="text-gray-500">まだ振り返りが登録されていません</p>';
            return;
        }
        
        listDiv.innerHTML = userReviews.map(review => `
            <div class="bg-gray-50 p-4 rounded border">
                <div class="font-bold text-lg mb-2">${review.date}</div>
                <div class="mb-2">
                    <span class="font-semibold text-green-600"><i class="fas fa-star mr-1"></i>本日の成果:</span>
                    <p class="mt-1 text-gray-700">${review.achievements}</p>
                </div>
                <div class="mb-2">
                    <span class="font-semibold text-orange-600"><i class="fas fa-exclamation-triangle mr-1"></i>課題・反省点:</span>
                    <p class="mt-1 text-gray-700">${review.challenges}</p>
                </div>
                <div>
                    <span class="font-semibold text-blue-600"><i class="fas fa-calendar-check mr-1"></i>明日の予定:</span>
                    <p class="mt-1 text-gray-700">${review.tomorrow_plan}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Load review error:', error);
    }
}

// ===== ダッシュボード =====

async function loadDashboard() {
    try {
        const thisMonth = new Date().toISOString().slice(0, 7);
        
        // KPI目標取得
        const kpiResponse = await fetch(`tables/kpi_targets?limit=100`);
        const kpiData = await kpiResponse.json();
        const kpi = kpiData.data.find(k => k.employee_id === currentUser.employee_id && k.month === thisMonth);
        
        // 営業数値取得
        const salesResponse = await fetch(`tables/sales_records?limit=1000`);
        const salesData = await salesResponse.json();
        const monthlySales = salesData.data.filter(s => 
            s.employee_id === currentUser.employee_id && s.date.startsWith(thisMonth)
        );
        
        // 集計
        const totalSales = monthlySales.reduce((sum, s) => sum + s.sales_amount, 0);
        const totalVisits = monthlySales.reduce((sum, s) => sum + s.visits, 0);
        const totalContracts = monthlySales.reduce((sum, s) => sum + s.contracts, 0);
        const totalCalls = monthlySales.reduce((sum, s) => sum + s.calls, 0);
        
        const dashboardDiv = document.getElementById('dashboardContent');
        
        if (!kpi) {
            dashboardDiv.innerHTML = '<p class="text-gray-500 col-span-2">今月のKPI目標を設定してください</p>';
            return;
        }
        
        // 達成率計算
        const salesRate = ((totalSales / kpi.sales_target) * 100).toFixed(1);
        const visitRate = ((totalVisits / kpi.visit_target) * 100).toFixed(1);
        const contractRate = ((totalContracts / kpi.contract_target) * 100).toFixed(1);
        const callRate = ((totalCalls / kpi.call_target) * 100).toFixed(1);
        
        dashboardDiv.innerHTML = `
            <div class="bg-blue-50 p-6 rounded-lg border-2 border-blue-900">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-bold text-blue-900"><i class="fas fa-yen-sign mr-2"></i>売上金額</h3>
                    <span class="text-2xl font-bold ${parseFloat(salesRate) >= 100 ? 'text-green-600' : 'text-orange-600'}">${salesRate}%</span>
                </div>
                <p class="text-gray-700">実績: ${totalSales.toLocaleString()}円</p>
                <p class="text-gray-700">目標: ${kpi.sales_target.toLocaleString()}円</p>
                <div class="mt-2 bg-gray-200 rounded-full h-4">
                    <div class="bg-blue-900 h-4 rounded-full" style="width: ${Math.min(parseFloat(salesRate), 100)}%"></div>
                </div>
            </div>
            
            <div class="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-900">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-bold text-indigo-900"><i class="fas fa-users mr-2"></i>訪問件数</h3>
                    <span class="text-2xl font-bold ${parseFloat(visitRate) >= 100 ? 'text-green-600' : 'text-orange-600'}">${visitRate}%</span>
                </div>
                <p class="text-gray-700">実績: ${totalVisits}件</p>
                <p class="text-gray-700">目標: ${kpi.visit_target}件</p>
                <div class="mt-2 bg-gray-200 rounded-full h-4">
                    <div class="bg-indigo-900 h-4 rounded-full" style="width: ${Math.min(parseFloat(visitRate), 100)}%"></div>
                </div>
            </div>
            
            <div class="bg-slate-50 p-6 rounded-lg border-2 border-slate-900">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-bold text-slate-900"><i class="fas fa-handshake mr-2"></i>契約件数</h3>
                    <span class="text-2xl font-bold ${parseFloat(contractRate) >= 100 ? 'text-green-600' : 'text-orange-600'}">${contractRate}%</span>
                </div>
                <p class="text-gray-700">実績: ${totalContracts}件</p>
                <p class="text-gray-700">目標: ${kpi.contract_target}件</p>
                <div class="mt-2 bg-gray-200 rounded-full h-4">
                    <div class="bg-slate-900 h-4 rounded-full" style="width: ${Math.min(parseFloat(contractRate), 100)}%"></div>
                </div>
            </div>
            
            <div class="bg-cyan-50 p-6 rounded-lg border-2 border-cyan-900">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-bold text-cyan-900"><i class="fas fa-phone mr-2"></i>架電件数</h3>
                    <span class="text-2xl font-bold ${parseFloat(callRate) >= 100 ? 'text-green-600' : 'text-orange-600'}">${callRate}%</span>
                </div>
                <p class="text-gray-700">実績: ${totalCalls}件</p>
                <p class="text-gray-700">目標: ${kpi.call_target}件</p>
                <div class="mt-2 bg-gray-200 rounded-full h-4">
                    <div class="bg-cyan-900 h-4 rounded-full" style="width: ${Math.min(parseFloat(callRate), 100)}%"></div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Load dashboard error:', error);
    }
}

// ===== 管理者機能 =====

async function loadAdminData() {
    try {
        // 社員リスト取得
        const response = await fetch('tables/employees?limit=100');
        const data = await response.json();
        const employees = data.data.filter(emp => emp.role === 'employee');
        
        const select = document.getElementById('employeeFilter');
        select.innerHTML = '<option value="">全社員</option>' + 
            employees.map(emp => `<option value="${emp.employee_id}">${emp.name}</option>`).join('');
        
        // 初期データロード
        loadAdminKpiData();
    } catch (error) {
        console.error('Load admin data error:', error);
    }
}

function applyAdminFilter() {
    const activeTab = document.querySelector('.admin-tab-button.active')?.dataset.tab;
    
    if (activeTab === 'adminKpi') {
        loadAdminKpiData();
    } else if (activeTab === 'adminSales') {
        loadAdminSalesData();
    } else if (activeTab === 'adminReview') {
        loadAdminReviewData();
    } else if (activeTab === 'adminOverview') {
        loadAdminOverview();
    }
}

async function loadAdminKpiData() {
    try {
        const employeeFilter = document.getElementById('employeeFilter').value;
        const monthFilter = document.getElementById('monthFilter').value;
        
        const [kpiResponse, empResponse] = await Promise.all([
            fetch('tables/kpi_targets?limit=1000'),
            fetch('tables/employees?limit=100')
        ]);
        
        const kpiData = await kpiResponse.json();
        const empData = await empResponse.json();
        
        let filteredKpis = kpiData.data;
        if (employeeFilter) {
            filteredKpis = filteredKpis.filter(kpi => kpi.employee_id === employeeFilter);
        }
        if (monthFilter) {
            filteredKpis = filteredKpis.filter(kpi => kpi.month === monthFilter);
        }
        
        filteredKpis.sort((a, b) => b.month.localeCompare(a.month));
        
        const listDiv = document.getElementById('adminKpiList');
        if (filteredKpis.length === 0) {
            listDiv.innerHTML = '<p class="text-gray-500">データがありません</p>';
            return;
        }
        
        listDiv.innerHTML = `
            <table class="min-w-full bg-white border">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-4 py-2 border">社員名</th>
                        <th class="px-4 py-2 border">対象月</th>
                        <th class="px-4 py-2 border">売上目標</th>
                        <th class="px-4 py-2 border">訪問目標</th>
                        <th class="px-4 py-2 border">契約目標</th>
                        <th class="px-4 py-2 border">架電目標</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredKpis.map(kpi => {
                        const emp = empData.data.find(e => e.employee_id === kpi.employee_id);
                        return `
                            <tr>
                                <td class="px-4 py-2 border">${emp?.name || kpi.employee_id}</td>
                                <td class="px-4 py-2 border">${kpi.month}</td>
                                <td class="px-4 py-2 border text-right">${kpi.sales_target.toLocaleString()}円</td>
                                <td class="px-4 py-2 border text-center">${kpi.visit_target}</td>
                                <td class="px-4 py-2 border text-center">${kpi.contract_target}</td>
                                <td class="px-4 py-2 border text-center">${kpi.call_target}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Load admin KPI error:', error);
    }
}

async function loadAdminSalesData() {
    try {
        const employeeFilter = document.getElementById('employeeFilter').value;
        const monthFilter = document.getElementById('monthFilter').value;
        
        const [salesResponse, empResponse] = await Promise.all([
            fetch('tables/sales_records?limit=1000'),
            fetch('tables/employees?limit=100')
        ]);
        
        const salesData = await salesResponse.json();
        const empData = await empResponse.json();
        
        let filteredSales = salesData.data;
        if (employeeFilter) {
            filteredSales = filteredSales.filter(s => s.employee_id === employeeFilter);
        }
        if (monthFilter) {
            filteredSales = filteredSales.filter(s => s.date.startsWith(monthFilter));
        }
        
        filteredSales.sort((a, b) => b.date.localeCompare(a.date));
        
        const listDiv = document.getElementById('adminSalesList');
        if (filteredSales.length === 0) {
            listDiv.innerHTML = '<p class="text-gray-500">データがありません</p>';
            return;
        }
        
        listDiv.innerHTML = `
            <table class="min-w-full bg-white border">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-4 py-2 border">社員名</th>
                        <th class="px-4 py-2 border">日付</th>
                        <th class="px-4 py-2 border">売上金額</th>
                        <th class="px-4 py-2 border">訪問件数</th>
                        <th class="px-4 py-2 border">契約件数</th>
                        <th class="px-4 py-2 border">架電件数</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredSales.map(record => {
                        const emp = empData.data.find(e => e.employee_id === record.employee_id);
                        return `
                            <tr>
                                <td class="px-4 py-2 border">${emp?.name || record.employee_id}</td>
                                <td class="px-4 py-2 border">${record.date}</td>
                                <td class="px-4 py-2 border text-right">${record.sales_amount.toLocaleString()}円</td>
                                <td class="px-4 py-2 border text-center">${record.visits}</td>
                                <td class="px-4 py-2 border text-center">${record.contracts}</td>
                                <td class="px-4 py-2 border text-center">${record.calls}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Load admin sales error:', error);
    }
}

async function loadAdminReviewData() {
    try {
        const employeeFilter = document.getElementById('employeeFilter').value;
        const monthFilter = document.getElementById('monthFilter').value;
        
        const [reviewResponse, empResponse] = await Promise.all([
            fetch('tables/daily_reviews?limit=1000'),
            fetch('tables/employees?limit=100')
        ]);
        
        const reviewData = await reviewResponse.json();
        const empData = await empResponse.json();
        
        let filteredReviews = reviewData.data;
        if (employeeFilter) {
            filteredReviews = filteredReviews.filter(r => r.employee_id === employeeFilter);
        }
        if (monthFilter) {
            filteredReviews = filteredReviews.filter(r => r.date.startsWith(monthFilter));
        }
        
        filteredReviews.sort((a, b) => b.date.localeCompare(a.date));
        
        const listDiv = document.getElementById('adminReviewList');
        if (filteredReviews.length === 0) {
            listDiv.innerHTML = '<p class="text-gray-500">データがありません</p>';
            return;
        }
        
        listDiv.innerHTML = filteredReviews.map(review => {
            const emp = empData.data.find(e => e.employee_id === review.employee_id);
            return `
                <div class="bg-gray-50 p-4 rounded border">
                    <div class="flex justify-between items-center mb-2">
                        <div class="font-bold text-lg">${emp?.name || review.employee_id}</div>
                        <div class="text-gray-600">${review.date}</div>
                    </div>
                    <div class="mb-2">
                        <span class="font-semibold text-green-600"><i class="fas fa-star mr-1"></i>本日の成果:</span>
                        <p class="mt-1 text-gray-700">${review.achievements}</p>
                    </div>
                    <div class="mb-2">
                        <span class="font-semibold text-orange-600"><i class="fas fa-exclamation-triangle mr-1"></i>課題・反省点:</span>
                        <p class="mt-1 text-gray-700">${review.challenges}</p>
                    </div>
                    <div>
                        <span class="font-semibold text-blue-600"><i class="fas fa-calendar-check mr-1"></i>明日の予定:</span>
                        <p class="mt-1 text-gray-700">${review.tomorrow_plan}</p>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Load admin review error:', error);
    }
}

async function loadAdminOverview() {
    try {
        const monthFilter = document.getElementById('monthFilter').value || new Date().toISOString().slice(0, 7);
        
        const [empResponse, kpiResponse, salesResponse] = await Promise.all([
            fetch('tables/employees?limit=100'),
            fetch('tables/kpi_targets?limit=1000'),
            fetch('tables/sales_records?limit=1000')
        ]);
        
        const empData = await empResponse.json();
        const kpiData = await kpiResponse.json();
        const salesData = await salesResponse.json();
        
        const employees = empData.data.filter(emp => emp.role === 'employee');
        
        const overviewDiv = document.getElementById('adminOverviewContent');
        
        const overviewCards = employees.map(emp => {
            const kpi = kpiData.data.find(k => k.employee_id === emp.employee_id && k.month === monthFilter);
            const sales = salesData.data.filter(s => s.employee_id === emp.employee_id && s.date.startsWith(monthFilter));
            
            if (!kpi) {
                return `
                    <div class="bg-gray-50 p-6 rounded-lg border">
                        <h3 class="text-lg font-bold mb-2">${emp.name}</h3>
                        <p class="text-gray-500">KPI目標未設定</p>
                    </div>
                `;
            }
            
            const totalSales = sales.reduce((sum, s) => sum + s.sales_amount, 0);
            const totalVisits = sales.reduce((sum, s) => sum + s.visits, 0);
            const totalContracts = sales.reduce((sum, s) => sum + s.contracts, 0);
            const totalCalls = sales.reduce((sum, s) => sum + s.calls, 0);
            
            const salesRate = ((totalSales / kpi.sales_target) * 100).toFixed(1);
            const visitRate = ((totalVisits / kpi.visit_target) * 100).toFixed(1);
            const contractRate = ((totalContracts / kpi.contract_target) * 100).toFixed(1);
            const callRate = ((totalCalls / kpi.call_target) * 100).toFixed(1);
            
            const avgRate = ((parseFloat(salesRate) + parseFloat(visitRate) + parseFloat(contractRate) + parseFloat(callRate)) / 4).toFixed(1);
            
            return `
                <div class="bg-white p-6 rounded-lg border-2 ${parseFloat(avgRate) >= 100 ? 'border-green-400' : parseFloat(avgRate) >= 70 ? 'border-yellow-400' : 'border-red-400'}">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold">${emp.name}</h3>
                        <span class="text-2xl font-bold ${parseFloat(avgRate) >= 100 ? 'text-green-600' : parseFloat(avgRate) >= 70 ? 'text-yellow-600' : 'text-red-600'}">${avgRate}%</span>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>売上:</span>
                            <span class="${parseFloat(salesRate) >= 100 ? 'text-green-600' : 'text-red-600'} font-semibold">${salesRate}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span>訪問:</span>
                            <span class="${parseFloat(visitRate) >= 100 ? 'text-green-600' : 'text-red-600'} font-semibold">${visitRate}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span>契約:</span>
                            <span class="${parseFloat(contractRate) >= 100 ? 'text-green-600' : 'text-red-600'} font-semibold">${contractRate}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span>架電:</span>
                            <span class="${parseFloat(callRate) >= 100 ? 'text-green-600' : 'text-red-600'} font-semibold">${callRate}%</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        overviewDiv.innerHTML = overviewCards;
    } catch (error) {
        console.error('Load admin overview error:', error);
    }
}

// ===== ユーティリティ関数 =====

function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = message;
    messageDiv.className = `mt-4 p-3 rounded ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
    messageDiv.classList.remove('hidden');
    
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 3000);
}
// ===== ログイン処理（IDが分からなくても拾う版）=====
async function handleLoginClick() {
  try {
    const screen = document.getElementById("loginScreen");
    if (!screen) throw new Error("loginScreen が見つかりません");

    const emailEl = screen.querySelector('input[type="email"]');
    const passEl  = screen.querySelector('input[type="password"]');

    const email = emailEl?.value?.trim();
    const password = passEl?.value;

    if (!email || !password) {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // ログイン成功 → メイン画面へ
    showScreen("mainScreen");
    alert("ログイン成功");
  } catch (e) {
    alert("ログインエラー: " + e.message);
  }
}

function wireLoginButton() {
  const screen = document.getElementById("loginScreen");
  if (!screen) return;

  // loginScreen内の「ログイン」ボタンを拾う（最初のbuttonを使う）
  const btn = screen.querySelector("button");
  if (!btn) return;

  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    handleLoginClick();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  wireLoginButton();
});
