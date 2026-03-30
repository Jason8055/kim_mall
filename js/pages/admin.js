// js/pages/admin.js
/**
 * 군산 1번가 — 관리자 페이지
 * 비밀번호 인증 후 핵심 설정을 수정할 수 있는 관리 화면
 */
import { getConfig, saveConfig, resetConfig, checkAdminPassword, getDefaultConfig } from '../utils/config.js';
import { getPolicies, defaultPolicies } from '../data/policies.js';
import { savePolicyOverride, resetPolicyOverride, getPolicyOverrides } from '../utils/policyManager.js';
import { resizeImageFile } from '../utils/imageHelper.js';
import { getAllCustomReviews, addReview, deleteReview, getReviews, getTotalCustomReviewCount } from '../utils/reviews.js';

let isAuthenticated = false;

export async function renderAdmin(container) {

  function renderLogin() {
    container.innerHTML = `
      <div style="min-height:100vh; background:var(--color-bg); display:flex; align-items:center; justify-content:center; padding:20px;">
        <div style="background:#fff; border-radius:16px; padding:32px 24px; width:100%; max-width:400px; box-shadow:var(--shadow-elevated); text-align:center;">
          <span class="material-symbols-rounded" style="font-size:48px; color:var(--color-primary);">admin_panel_settings</span>
          <h1 style="font-size:20px; font-weight:800; color:var(--color-text-black); margin-top:12px;">군산 1번가 관리자</h1>
          <p style="font-size:13px; color:var(--color-text-gray); margin-top:6px;">관리자 비밀번호를 입력해주세요</p>

          <div style="margin-top:24px;">
            <input type="password" id="adminPw" placeholder="비밀번호 입력"
              style="width:100%; height:44px; border:1px solid var(--color-border); border-radius:8px; padding:0 14px; font-size:15px; text-align:center; box-sizing:border-box;"
            />
            <div id="pwError" style="color:var(--color-red); font-size:12px; margin-top:8px; display:none;">비밀번호가 올바르지 않습니다.</div>
            <button id="loginBtn" style="width:100%; height:44px; background:var(--color-primary); color:#fff; border-radius:8px; font-size:15px; font-weight:700; margin-top:12px; cursor:pointer;">
              로그인
            </button>
          </div>

          <a href="#/" style="display:block; margin-top:20px; font-size:13px; color:var(--color-text-light);">← 쇼핑몰로 돌아가기</a>
        </div>
      </div>
    `;

    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('adminPw').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin();
    });

    async function handleLogin() {
      const pw = document.getElementById('adminPw').value;
      if (checkAdminPassword(pw)) {
        isAuthenticated = true;
        await renderDashboard();
      } else {
        document.getElementById('pwError').style.display = 'block';
      }
    }
  }

  async function renderDashboard() {
    const config = await getConfig();
    const policies = await getPolicies();
    const overrides = await getPolicyOverrides();

    container.innerHTML = `
      <div style="min-height:100vh; background:var(--color-bg); padding:20px; padding-bottom:40px;">
        <div style="max-width:480px; margin:0 auto;">

          <!-- 관리자 헤더 -->
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="material-symbols-rounded" style="font-size:28px; color:var(--color-primary);">admin_panel_settings</span>
              <h1 style="font-size:18px; font-weight:800; color:var(--color-text-black);">관리자 대시보드</h1>
            </div>
            <a href="#/" style="font-size:13px; color:var(--color-primary); font-weight:600;">쇼핑몰 보기 →</a>
          </div>

          <!-- ========== 섹션 1: 히어로 영상 설정 ========== -->
          <div class="admin-card">
            <div class="admin-card-header">
              <span class="material-symbols-rounded">video_library</span>
              <h2>히어로 영상 설정</h2>
            </div>
            <div class="admin-field">
              <label>유튜브 영상 ID</label>
              <input type="text" id="cfg-videoUrl" value="${config.videoUrl}" placeholder="예: 3ZtMsl8rRJc" />
              <span class="admin-hint">유튜브 URL에서 영상 ID만 입력하세요 (youtu.be/<strong>여기</strong>)</span>
            </div>
            <div class="admin-field">
              <label>히어로 제목</label>
              <input type="text" id="cfg-heroTitle" value="${config.heroTitle}" />
            </div>
            <div class="admin-field">
              <label>히어로 부제</label>
              <input type="text" id="cfg-heroSubtitle" value="${config.heroSubtitle}" />
            </div>
            <div class="admin-field">
              <label>히어로 캡션 (작은 글씨)</label>
              <input type="text" id="cfg-heroCaption" value="${config.heroCaption}" />
            </div>
          </div>

          <!-- ========== 섹션 2: 캠페인 설정 ========== -->
          <div class="admin-card">
            <div class="admin-card-header">
              <span class="material-symbols-rounded">campaign</span>
              <h2>캠페인 설정</h2>
            </div>
            <div class="admin-field">
              <label>경선 시작일</label>
              <input type="datetime-local" id="cfg-ddayDate" value="${config.ddayDate.slice(0,16)}" />
            </div>
            <div class="admin-field">
              <label>경선 종료일</label>
              <input type="datetime-local" id="cfg-ddayEndDate" value="${config.ddayEndDate.slice(0,16)}" />
              <span class="admin-hint">시작일~종료일 기간 동안 "경선 마감까지" 카운트다운이 표시됩니다</span>
            </div>
            <div class="admin-field">
              <label>프로모션 띠배너 텍스트</label>
              <input type="text" id="cfg-promoText" value="${config.promoText}" />
            </div>
            <div class="admin-field">
              <label>신뢰 배너 제목</label>
              <textarea id="cfg-trustTitle" rows="2">${config.trustTitle}</textarea>
            </div>
            <div class="admin-field">
              <label>신뢰 배너 부제</label>
              <input type="text" id="cfg-trustSubtitle" value="${config.trustSubtitle}" />
            </div>
          </div>

          <!-- ========== 섹션 3: 콘텐츠 설정 ========== -->
          <div class="admin-card">
            <div class="admin-card-header">
              <span class="material-symbols-rounded">article</span>
              <h2>콘텐츠 설정</h2>
            </div>
            <div class="admin-field">
              <label>상품 섹션 제목</label>
              <input type="text" id="cfg-sectionTitle" value="${config.sectionTitle}" />
            </div>
            <div class="admin-field">
              <label>하단 슬로건</label>
              <textarea id="cfg-footerSlogan" rows="3">${config.footerSlogan}</textarea>
            </div>
          </div>

          <!-- ========== 섹션 3-2: 이미지 관리 ========== -->
          <div class="admin-card">
            <div class="admin-card-header">
              <span class="material-symbols-rounded">image</span>
              <h2>이미지 관리 (플랫폼 자동 조정)</h2>
            </div>
            <span class="admin-hint" style="display:block; margin-bottom:14px;">이미지를 업로드하면 플랫폼 크기에 맞게 자동 리사이즈됩니다 (최대 800px)</span>

            <!-- 신뢰 배너 이미지 -->
            <div class="admin-field">
              <label>🤝 신뢰 배너 이미지 (예: 이재명 대표와 함께)</label>
              <div style="display:flex; gap:8px; align-items:center;">
                <input type="file" id="img-trust" accept="image/*" style="flex:1;" />
                ${config.trustImage ? '<button id="img-trust-del" style="font-size:12px; color:var(--color-red); white-space:nowrap; cursor:pointer;">삭제</button>' : ''}
              </div>
              ${config.trustImage ? '<img src="' + config.trustImage + '" style="width:100%; max-height:120px; object-fit:cover; border-radius:8px; margin-top:8px; border:1px solid var(--color-border);">' : ''}
            </div>

            <!-- 프로모션 이미지 -->
            <div class="admin-field">
              <label>📢 프로모션 띄배너 이미지</label>
              <div style="display:flex; gap:8px; align-items:center;">
                <input type="file" id="img-promo" accept="image/*" style="flex:1;" />
                ${config.promoImage ? '<button id="img-promo-del" style="font-size:12px; color:var(--color-red); white-space:nowrap; cursor:pointer;">삭제</button>' : ''}
              </div>
              ${config.promoImage ? '<img src="' + config.promoImage + '" style="width:100%; max-height:80px; object-fit:cover; border-radius:8px; margin-top:8px; border:1px solid var(--color-border);">' : ''}
            </div>

            <!-- 하단 슬로건 이미지 -->
            <div class="admin-field">
              <label>🏙️ 하단 슬로건 배경 이미지</label>
              <div style="display:flex; gap:8px; align-items:center;">
                <input type="file" id="img-footer" accept="image/*" style="flex:1;" />
                ${config.footerImage ? '<button id="img-footer-del" style="font-size:12px; color:var(--color-red); white-space:nowrap; cursor:pointer;">삭제</button>' : ''}
              </div>
              ${config.footerImage ? '<img src="' + config.footerImage + '" style="width:100%; max-height:120px; object-fit:cover; border-radius:8px; margin-top:8px; border:1px solid var(--color-border);">' : ''}
            </div>
          </div>

          <!-- ========== 섹션 4: 공약 관리 (직접 수정) ========== -->
          <div class="admin-card">
            <div class="admin-card-header">
              <span class="material-symbols-rounded">edit_document</span>
              <h2>공약 정보 수정 (${getPolicies().length}개)</h2>
            </div>
            ${getPolicies().map((p, i) => `
              <div style="padding:16px 0; ${i > 0 ? 'border-top:1px solid var(--color-divider);' : ''}">
                <div style="display:flex; align-items:flex-start; gap:10px;">
                  <img src="${p.image}" style="width:50px; height:50px; border-radius:6px; object-fit:cover; flex-shrink:0;">
                  <div style="flex:1; min-width:0;">
                    <div style="font-size:13px; font-weight:600; color:var(--color-text-dark);">${p.title}</div>
                    <div style="font-size:11px; color:var(--color-text-gray); margin-bottom:4px; line-height:1.3;">${p.subtitle}</div>
                    <div style="font-size:11px; color:var(--color-primary);">${p.buyPoint || ''}</div>
                  </div>
                  <button onclick="window._toggleEditPolicy('${p.id}')" style="flex-shrink:0; font-size:12px; padding:6px 12px; border-radius:4px; background:var(--color-party-blue-bg); color:var(--color-primary); font-weight:600; border:none; cursor:pointer;">
                    수정
                  </button>
                </div>

                <div id="edit-form-${p.id}" style="display:none; margin-top:12px; padding:12px; background:#fafafa; border-radius:8px; border:1px solid var(--color-border-light);">
                  <div class="admin-field" style="margin-bottom:8px;">
                    <label>이미지 변경 <span style="font-size:10px; color:var(--color-text-light); font-weight:400;">(선택)</span></label>
                    <input type="file" id="edit-img-${p.id}" accept="image/*" />
                  </div>
                  <div class="admin-field" style="margin-bottom:8px;">
                    <label>제목</label>
                    <input type="text" id="edit-title-${p.id}" value="${p.title}" />
                  </div>
                  <div class="admin-field" style="margin-bottom:8px;">
                    <label>부제목(설명)</label>
                    <input type="text" id="edit-sub-${p.id}" value="${p.subtitle}" />
                  </div>
                  <div class="admin-field" style="margin-bottom:8px;">
                    <label>기대효과 (구매포인트)</label>
                    <input type="text" id="edit-point-${p.id}" value="${p.buyPoint || ''}" />
                  </div>
                  <div class="admin-field" style="margin-bottom:8px;">
                    <label>상세 내용 (줄바꿈 허용)</label>
                    <textarea id="edit-details-${p.id}" rows="4" style="line-height:1.5;">${Array.isArray(p.details) ? p.details.join('\\n') : p.details}</textarea>
                  </div>
                  <div style="display:flex; gap:8px; margin-top:12px;">
                    <button onclick="window._savePolicyEdit('${p.id}')" class="btn btn-primary" style="flex:1; height:36px; border-radius:6px; font-size:13px; font-weight:600;">✅ 저장</button>
                    ${overrides[p.id] ? `<button onclick="window._resetPolicyEdit('${p.id}')" class="btn btn-outline" style="flex:1; height:36px; border-radius:6px; font-size:13px; color:var(--color-red); border-color:var(--color-red); font-weight:600;">🔄 기본값 복구</button>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- ========== 섹션 5: 리뷰(댓글) 관리 ========== -->
          <div class="admin-card">
            <div class="admin-card-header">
              <span class="material-symbols-rounded">rate_review</span>
              <h2>리뷰(댓글) 관리 <span style="font-size:12px; color:var(--color-text-gray); font-weight:400;">추가 ${await getTotalCustomReviewCount()}개</span></h2>
            </div>

            <!-- 리뷰 추가 폼 -->
            <div style="background:var(--color-party-blue-bg); border-radius:10px; padding:14px; margin-bottom:16px;">
              <div style="font-size:13px; font-weight:700; color:var(--color-primary); margin-bottom:10px;">➕ 새 리뷰 추가</div>
              <div class="admin-field" style="margin-bottom:8px;">
                <label>공약 선택</label>
                <select id="rv-policy">
                  ${policies.map(p => `<option value="${p.id}">${p.title}</option>`).join('')}
                </select>
              </div>
              <div style="display:flex; gap:8px; margin-bottom:8px;">
                <div class="admin-field" style="flex:1; margin-bottom:0;">
                  <label>작성자</label>
                  <input type="text" id="rv-author" placeholder="예: 나운동 시민" />
                </div>
                <div class="admin-field" style="width:80px; margin-bottom:0;">
                  <label>별점</label>
                  <select id="rv-rating">
                    <option value="5">⭐ 5</option>
                    <option value="4">⭐ 4</option>
                    <option value="3">⭐ 3</option>
                  </select>
                </div>
              </div>
              <div class="admin-field" style="margin-bottom:8px;">
                <label>리뷰 내용</label>
                <textarea id="rv-text" rows="2" placeholder="시민 리뷰 내용을 입력하세요"></textarea>
              </div>
              <div class="admin-field" style="margin-bottom:8px;">
                <label>판매자 답변 (선택)</label>
                <textarea id="rv-reply" rows="2" placeholder="김재준 후보의 답변 (비워두면 답변 없음)"></textarea>
              </div>
              <button id="rv-addBtn" class="btn btn-primary" style="width:100%; height:40px; border-radius:8px; font-size:13px;">
                <span class="material-symbols-rounded" style="font-size:16px;">add</span>
                리뷰 추가하기
              </button>
            </div>

            <!-- 공약별 리뷰 목록 -->
            ${policies.map(p => {
              const customReviews = (customReviewsAll[p.id] || []);
              return `
              <div style="margin-bottom:12px;">
                <div style="font-size:13px; font-weight:700; color:var(--color-text-dark); padding:8px 0; border-bottom:1px solid var(--color-divider);">
                  ${p.title}
                  <span style="font-size:11px; color:var(--color-text-gray); font-weight:400;">
                    추가 ${customReviews.length}개
                  </span>
                </div>
                ${customReviews.length > 0 ? customReviews.map(r => `
                  <div style="padding:8px 0; border-bottom:1px solid var(--color-divider); display:flex; align-items:flex-start; gap:8px;">
                    <div style="flex:1; min-width:0;">
                      <div style="font-size:12px; font-weight:600; color:var(--color-text-dark);">
                        ${r.author} <span style="color:var(--color-gold);">${'⭐'.repeat(r.rating)}</span>
                      </div>
                      <div style="font-size:12px; color:var(--color-text-gray); margin-top:2px; line-height:1.4;">${r.text}</div>
                      ${r.reply ? `<div style="font-size:11px; color:var(--color-primary); margin-top:2px;">↳ ${r.reply}</div>` : ''}
                    </div>
                    <button onclick="window._deleteReview('${p.id}','${r.id}')" style="flex-shrink:0; padding:4px; cursor:pointer;">
                      <span class="material-symbols-rounded" style="font-size:16px; color:var(--color-red);">delete</span>
                    </button>
                  </div>
                `).join('') : `
                  <div style="padding:8px 0; font-size:12px; color:var(--color-text-light);">추가된 리뷰 없음 (기본 리뷰는 코드에서 관리)</div>
                `}
              </div>
            `}).join('')}
          </div>

          <!-- ========== 액션 버튼 ========== -->
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
            <button id="saveBtn" class="btn btn-primary btn-block" style="height:48px; border-radius:8px; font-size:15px;">
              <span class="material-symbols-rounded" style="font-size:18px;">save</span>
              설정 저장하기
            </button>
            <button id="resetBtn" class="btn btn-outline btn-block" style="height:44px; border-radius:8px; font-size:14px;">
              <span class="material-symbols-rounded" style="font-size:18px;">restart_alt</span>
              기본값으로 초기화
            </button>
          </div>

          <!-- ========== 배포 가이드 ========== -->
          <div class="admin-card" style="margin-top:16px;">
            <div class="admin-card-header">
              <span class="material-symbols-rounded">cloud_upload</span>
              <h2>배포(업로드) 방법</h2>
            </div>
            <div style="font-size:13px; color:var(--color-text-dark); line-height:1.8;">
              <p style="margin-bottom:10px;"><strong>1단계:</strong> 빌드 파일 생성</p>
              <code style="display:block; background:#1a1a2e; color:#0f0; padding:12px; border-radius:8px; font-size:12px; margin-bottom:14px;">npm run build</code>

              <p style="margin-bottom:10px;"><strong>2단계:</strong> Netlify에 배포</p>
              <ul style="padding-left:18px; margin-bottom:14px;">
                <li><a href="https://app.netlify.com" target="_blank" style="color:var(--color-primary);">app.netlify.com</a> 접속</li>
                <li><strong>dist/</strong> 폴더를 드래그앤드롭으로 업로드</li>
                <li>또는 아래 '자동 배포' 버튼 클릭</li>
              </ul>

              <button id="deployBtn" class="btn btn-blue-gradient btn-block" style="height:44px; border-radius:8px; font-size:14px;">
                <span class="material-symbols-rounded" style="font-size:18px;">rocket_launch</span>
                Netlify 자동 배포
              </button>
            </div>
          </div>

          <!-- 로그아웃 -->
          <div style="text-align:center; margin-top:20px;">
            <button id="logoutBtn" style="font-size:13px; color:var(--color-text-light); cursor:pointer;">로그아웃</button>
          </div>
        </div>
      </div>
    `;

    // === 이벤트 핸들러 ===

    // 저장
    document.getElementById('saveBtn').addEventListener('click', async () => {
      // 이미지 처리
      const trustFile = document.getElementById('img-trust').files[0];
      const promoFile = document.getElementById('img-promo').files[0];
      const footerFile = document.getElementById('img-footer').files[0];

      let trustImage = config.trustImage || '';
      let promoImage = config.promoImage || '';
      let footerImage = config.footerImage || '';

      try {
        if (trustFile) trustImage = await resizeImageFile(trustFile);
        if (promoFile) promoImage = await resizeImageFile(promoFile);
        if (footerFile) footerImage = await resizeImageFile(footerFile);
      } catch (e) {
        alert('❌ 이미지 리사이즈 실패: ' + e.message);
        return;
      }

      const newConfig = {
        videoUrl: document.getElementById('cfg-videoUrl').value.trim(),
        heroTitle: document.getElementById('cfg-heroTitle').value.trim(),
        heroSubtitle: document.getElementById('cfg-heroSubtitle').value.trim(),
        heroCaption: document.getElementById('cfg-heroCaption').value.trim(),
        ddayDate: document.getElementById('cfg-ddayDate').value + ':00',
        ddayEndDate: document.getElementById('cfg-ddayEndDate').value + ':00',
        promoText: document.getElementById('cfg-promoText').value.trim(),
        trustTitle: document.getElementById('cfg-trustTitle').value.trim(),
        trustSubtitle: document.getElementById('cfg-trustSubtitle').value.trim(),
        sectionTitle: document.getElementById('cfg-sectionTitle').value.trim(),
        footerSlogan: document.getElementById('cfg-footerSlogan').value.trim(),
        trustImage,
        promoImage,
        footerImage
      };
      await saveConfig(newConfig);
      await renderDashboard(); // 미리보기 업데이트
      alert('✅ 설정이 실시간 DB에 저장되었습니다!\n모든 기기에서 즉시 반영됩니다.');
    });

    // 초기화
    document.getElementById('resetBtn').addEventListener('click', async () => {
      if (confirm('정말 기본값으로 초기화하시겠습니까?')) {
        await resetConfig();
        await renderDashboard();
        alert('✅ 기본값으로 초기화되었습니다.');
      }
    });

    // 이미지 삭제 핸들러
    const delHandlers = [
      { id: 'img-trust-del',  key: 'trustImage' },
      { id: 'img-promo-del',  key: 'promoImage' },
      { id: 'img-footer-del', key: 'footerImage' }
    ];
    delHandlers.forEach(({ id, key }) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', async () => {
          const cfg = await getConfig();
          cfg[key] = '';
          await saveConfig(cfg);
          await renderDashboard();
        });
      }
    });

    // 리뷰 추가
    document.getElementById('rv-addBtn').addEventListener('click', async () => {
      const policyId = document.getElementById('rv-policy').value;
      const author = document.getElementById('rv-author').value.trim();
      const text = document.getElementById('rv-text').value.trim();
      const rating = parseInt(document.getElementById('rv-rating').value);
      const reply = document.getElementById('rv-reply').value.trim() || null;

      if (!author || !text) {
        alert('작성자와 리뷰 내용을 입력해주세요.');
        return;
      }

      await addReview(policyId, { author, text, rating, reply });
      await renderDashboard(); // UI 갱신
      alert('✅ 리뷰가 실시간 DB에 추가되었습니다!');
    });

    // 리뷰 삭제 (글로벌 핸들러)
    window._deleteReview = async (policyId, reviewId) => {
      if (confirm('이 리뷰를 삭제하시겠습니까?')) {
        await deleteReview(policyId, reviewId);
        await renderDashboard();
      }
    };

    // 공약 에디터 토글
    window._toggleEditPolicy = (policyId) => {
      const form = document.getElementById(`edit-form-${policyId}`);
      if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
      }
    };

    // 공약 에디터 저장
    window._savePolicyEdit = async (policyId) => {
      try {
        const title = document.getElementById(`edit-title-${policyId}`).value.trim();
        const subtitle = document.getElementById(`edit-sub-${policyId}`).value.trim();
        const buyPoint = document.getElementById(`edit-point-${policyId}`).value.trim();
        const details = document.getElementById(`edit-details-${policyId}`).value;
        const fileInput = document.getElementById(`edit-img-${policyId}`);

        const updates = { title, subtitle, buyPoint, details };

        if (fileInput && fileInput.files[0]) {
          const base64Img = await resizeImageFile(fileInput.files[0]);
          updates.image = base64Img;
        }

        await savePolicyOverride(policyId, updates);
        alert('공약 내용이 실시간 DB에 저장되었습니다.\n모든 기기에서 즉시 반영됩니다.');
        await renderDashboard();
      } catch (err) {
        alert('저장 중 오류가 발생했습니다.');
        console.error(err);
      }
    };

    // 공약 에디터 초기화
    window._resetPolicyEdit = async (policyId) => {
      if (confirm('이 공약의 모든 수정사항을 초기화하시겠습니까? (기본값으로 복구)')) {
        await resetPolicyOverride(policyId);
        await renderDashboard();
      }
    };

    // 배포
    document.getElementById('deployBtn').addEventListener('click', () => {
      alert('배포 기능은 개발자 도구에서 실행해주세요.\n\n터미널에서:\n1. npm run build\n2. npx netlify deploy --prod --dir=dist');
    });

    // 로그아웃
    document.getElementById('logoutBtn').addEventListener('click', () => {
      isAuthenticated = false;
      renderLogin();
    });
  }

  // 진입 시 인증 확인
  if (isAuthenticated) {
    await renderDashboard();
  } else {
    renderLogin();
  }
}
