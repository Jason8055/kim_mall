// js/utils/imageHelper.js
/**
 * 이미지 헬퍼 — 업로드된 이미지를 자동 리사이즈하여 Base64로 반환
 * localStorage 저장 용량 최적화 (최대 폭 800px, JPEG 80%)
 */

/**
 * 파일 input에서 이미지를 읽어 자동 리사이즈 후 Base64 URL 반환
 * @param {File} file - 이미지 파일
 * @param {number} maxWidth - 최대 가로 픽셀 (기본 800)
 * @returns {Promise<string>} base64 데이터 URL
 */
export function resizeImageFile(file, maxWidth = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 원본이 maxWidth보다 작으면 그대로 사용
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        // JPEG 80% 품질로 압축
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
}
