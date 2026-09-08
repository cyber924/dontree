import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { initializeFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, writeBatch, Timestamp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const config = { apiKey: "AIzaSyCh2jJOIPuY64FTP50zMeSN1PbYDHWW1Lo", authDomain: "pinstory-26738.firebaseapp.com", projectId: "pinstory-26738", storageBucket: "pinstory-26738.firebasestorage.app", messagingSenderId: "841861837489", appId: "1:841861837489:web:1dcf9c86767a8edf762890" };
const app = initializeApp(config);
const auth = getAuth(app);
const db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });
const ADMIN = "cyber924@naver.com";
const E = id => document.getElementById(id);
let posts = [];

const SEEDS = [
  { title: "법인카드 대납 상담 전 확인할 조건·필요서류·진행 절차", category: "법인카드대납", summary: "법인카드 결제 부담이 생겼을 때 상담 전에 확인할 자격 조건, 준비서류, 비용과 안전한 진행 절차를 상세히 안내합니다.", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=84" }
];
const BODY = "\n\n## 법인카드 대납이란?\n법인카드 결제일을 앞두고 운영자금이 부족한 사업자가 합법적인 금융 상담을 통해 상환 가능 여부와 필요한 자금을 검토하는 과정입니다. 단순 카드 현금화와는 구분해야 하며 실제 계약 당사자, 자금 지급 방식과 상환 의무를 명확히 확인해야 합니다.\n\n## 상담 가능한 기본 조건\n- 정상적으로 운영 중인 법인 또는 개인사업자인지 확인\n- 대표자와 실제 계약자의 신원 및 권한 확인\n- 최근 매출과 고정지출을 바탕으로 상환 가능 금액 산정\n- 카드 연체 여부와 기존 금융부채 현황 확인\n\n## 준비하면 좋은 필요서류\n- 사업자등록증과 법인 등기 관련 기본자료\n- 대표자 신분 확인 자료\n- 최근 매출자료와 통장 거래내역\n- 법인카드 이용명세서와 결제 예정금액\n서류는 상담 조건에 따라 달라질 수 있으므로 공식 상담 채널에서 필요한 항목을 먼저 확인하세요.\n\n## 진행 절차 5단계\n### 1. 결제 예정금액 확인\n카드사 명세서에서 정확한 결제일과 결제 예정액을 확인합니다.\n### 2. 사업 현황 정리\n월평균 매출, 고정비, 기존 대출 상환액을 정리합니다.\n### 3. 등록 업체 확인\n상호, 대표자, 등록번호와 실제 상담 주체가 일치하는지 확인합니다.\n### 4. 조건 비교\n금리뿐 아니라 총상환금액, 기간, 상환방식과 중도상환수수료를 함께 비교합니다.\n### 5. 계약서 확인\n구두 설명과 계약서 내용이 같은지 확인한 뒤 서명하고 사본을 보관합니다.\n\n## 반드시 피해야 할 위험 신호\n- 카드 비밀번호나 문자 인증번호 요구\n- 원격제어 앱 설치 또는 휴대전화 제출 요구\n- 계약 전 수수료와 보증금 선입금 요구\n- 실제 업체명과 다른 개인 계좌로 송금 요구\n이런 요구가 있으면 즉시 진행을 중단하고 금융감독원 등 공식 기관을 통해 확인해야 합니다.\n\n## 상담 전 최종 체크리스트\n- 업체 등록 여부를 확인했는가\n- 총비용과 실제 수령액을 확인했는가\n- 월 상환액을 감당할 수 있는가\n- 계약서와 설명서 사본을 받았는가\n- 가족이나 담당자와 조건을 다시 검토했는가\n\n## 자주 묻는 질문\n### 카드 한도가 남아 있으면 모두 이용할 수 있나요?\n카드 한도와 금융 상담 가능 금액은 같은 개념이 아닙니다. 실제 가능 여부는 매출, 부채와 상환능력 등을 종합적으로 검토해 결정됩니다.\n### 연체 중이어도 진행할 수 있나요?\n연체 상태와 기간에 따라 판단이 달라집니다. 추가 부담이 커질 수 있으므로 연체를 숨기지 말고 정확하게 알린 뒤 공적 채무조정 상담도 함께 검토하세요.\n\n이 글은 일반적인 금융 정보이며 개인별 승인이나 조건을 보장하지 않습니다.";

function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function next() { return posts.reduce((m, p) => Math.max(m, Number(p.postNumber) || 0), 38) + 1; }
function timed(p, ms = 12000) { return Promise.race([p, new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore 연결 시간이 초과되었습니다. Firestore 데이터베이스와 보안 규칙을 확인하세요.")), ms))]); }
function reset() { E("form").reset(); E("docId").value = ""; E("category").value = "신용카드 대납"; E("postNumber").value = next(); E("formTitle").textContent = "새 글 작성"; E("deleteBtn").hidden = true; E("msg").textContent = ""; }

async function load() {
  E("list").innerHTML = '<p class="muted">게시글을 불러오는 중...</p>';
  const snapshot = await timed(getDocs(collection(db, "posts")));
  posts = snapshot.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.postNumber - a.postNumber);
  E("list").innerHTML = posts.length ? posts.map(p => `<article class="post"><b>${esc(p.title)}</b><small>#${p.postNumber} · ${p.status === "published" ? "공개" : "임시저장"}</small><div class="post-actions"><button class="btn edit" data-id="${p.id}">수정</button>${p.status === "published" ? `<a class="btn dark" href="/blog/${p.postNumber}" target="_blank">보기</a>` : `<button class="btn dark publish" data-id="${p.id}">공개하기</button>`}<button class="btn danger list-delete" data-id="${p.id}" data-title="${esc(p.title)}">삭제</button></div></article>`).join("") : '<p class="muted">작성된 글이 없습니다.</p>';
  document.querySelectorAll(".edit").forEach(button => button.onclick = () => edit(button.dataset.id));
  document.querySelectorAll(".publish").forEach(button => button.onclick = async () => { if (!confirm("이 글을 공개하고 블로그에 표시할까요?")) return; button.disabled = true; try { await updateDoc(doc(db, "posts", button.dataset.id), { status: "published", publishedAt: serverTimestamp(), updatedAt: serverTimestamp() }); await load(); } catch (error) { alert(error.message); button.disabled = false; } });
  document.querySelectorAll(".list-delete").forEach(button => button.onclick = async () => { if (!confirm(`“${button.dataset.title}” 글을 삭제할까요?`)) return; button.disabled = true; try { await deleteDoc(doc(db, "posts", button.dataset.id)); await load(); reset(); } catch (error) { alert(error.message); button.disabled = false; } });
  if (!E("docId").value) E("postNumber").value = next();
}

function edit(id) {
  const p = posts.find(x => x.id === id);
  for (const key of ["postNumber", "status", "title", "summary", "category", "imageUrl", "content"]) E(key).value = p[key] ?? "";
  E("docId").value = id; E("formTitle").textContent = "글 수정"; E("deleteBtn").hidden = false; scrollTo({ top: 0, behavior: "smooth" });
}

E("logout").onclick = async () => { await signOut(auth); location.href = "/login"; };
E("newBtn").onclick = reset;
E("aiBtn").onclick = async () => {
  const topic = E("title").value.trim();
  if (topic.length < 3) { alert("제목 칸에 만들고 싶은 금융 주제를 3자 이상 입력하세요."); E("title").focus(); return; }
  try {
    E("aiBtn").disabled = true; E("aiBtn").textContent = "Gemini가 작성 중..."; E("aiStatus").textContent = "약 10~30초 정도 걸립니다.";
    const token = await auth.currentUser.getIdToken();
    const response = await fetch("/api/generate-article", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ topic }) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || "AI 생성에 실패했습니다.");
    for (const key of ["title", "summary", "category", "imageUrl", "content"]) E(key).value = result[key] || "";
    E("status").value = "published"; E("aiStatus").textContent = "AI 글 생성 완료 · 저장하면 즉시 공개됩니다."; E("aiStatus").className = "success";
  } catch (error) { E("aiStatus").textContent = error.message; E("aiStatus").className = "error"; }
  finally { E("aiBtn").disabled = false; E("aiBtn").textContent = "Gemini로 AI 초안 생성"; }
};
E("form").onsubmit = async event => {
  event.preventDefault();
  const data = { postNumber: Number(E("postNumber").value), status: E("status").value, title: E("title").value.trim(), summary: E("summary").value.trim(), category: E("category").value.trim(), imageUrl: E("imageUrl").value.trim(), content: E("content").value.trim(), authorEmail: ADMIN, updatedAt: serverTimestamp() };
  try { if (E("docId").value) await updateDoc(doc(db, "posts", E("docId").value), data); else await addDoc(collection(db, "posts"), { ...data, createdAt: serverTimestamp(), publishedAt: data.status === "published" ? serverTimestamp() : null }); await load(); reset(); E("msg").textContent = `저장되었습니다. 공개 주소: /blog/${data.postNumber}`; E("msg").className = "success"; } catch (error) { E("msg").textContent = error.message; E("msg").className = "error"; }
};
E("deleteBtn").onclick = async () => { if (!confirm("삭제할까요?")) return; await deleteDoc(doc(db, "posts", E("docId").value)); reset(); await load(); };
E("seedBtn").onclick = async () => {
  if (posts.some(p => p.seedKey === "finance-detail-v2")) { alert("상세 금융 글이 이미 등록되어 있습니다."); return; }
  if (!confirm("상세 금융 정보 글 1개를 등록할까요?")) return;
  const batch = writeBatch(db); const base = new Date();
  const number = next();
  SEEDS.forEach(seed => { batch.set(doc(collection(db, "posts")), { ...seed, content: seed.summary + BODY, postNumber: number, seedKey: "finance-detail-v2", status: "published", viewCount: 18, authorEmail: ADMIN, createdAt: Timestamp.fromDate(base), publishedAt: Timestamp.fromDate(base), updatedAt: Timestamp.fromDate(base) }); });
  try { E("seedBtn").disabled = true; E("seedBtn").textContent = "등록 중..."; await timed(batch.commit()); await load(); reset(); alert(`예시 글 1개가 /blog/${number}에 등록되었습니다.`); } catch (error) { alert(error.message); } finally { E("seedBtn").disabled = false; E("seedBtn").textContent = "예시 글 1개"; }
};

const authTimer = setTimeout(() => { E("user").textContent = "인증 확인 시간이 초과되었습니다."; E("user").className = "error"; E("list").innerHTML = '<p class="error">Firebase Authentication 연결을 확인하세요.</p>'; }, 10000);
onAuthStateChanged(auth, async user => {
  clearTimeout(authTimer);
  if (!user) { location.replace("/login"); return; }
  if ((user.email || "").toLowerCase() !== ADMIN) { E("user").textContent = "관리자 계정이 아닙니다."; await signOut(auth); location.replace("/login"); return; }
  E("user").textContent = `${user.email} 로그인 · 인증 정상`;
  try { await load(); reset(); } catch (error) { E("list").innerHTML = `<div class="error"><b>Firestore 연결 실패</b><p>${esc(error.message)}</p><p class="muted">Firebase Console에서 Firestore Database 생성과 보안 규칙 배포를 확인하세요.</p><button class="btn dark" id="retryBtn" type="button">다시 연결</button></div>`; E("retryBtn").onclick = () => location.reload(); }
});
