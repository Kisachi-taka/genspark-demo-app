const supabase = window._supabase;

async function signUp(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert("登録エラー: " + error.message);
  alert("登録しました。ログインしてください。");
}

async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert("ログインエラー: " + error.message);
  alert("ログイン成功");
}

async function signOut() {
  await supabase.auth.signOut();
  alert("ログアウトしました");
}

// ボタンが存在する場合だけ紐づけ
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("signupEmail")?.value;
    const pw = document.getElementById("signupPassword")?.value;
    await signUp(email, pw);
  });

  document.getElementById("loginBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail")?.value;
    const pw = document.getElementById("loginPassword")?.value;
    await signIn(email, pw);
  });

  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    await signOut();
  });
});
