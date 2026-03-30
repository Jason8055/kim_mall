// js/data/policies.js
/**
 * 군산 1번가 — 김재준 후보의 3대 킬러 공약 (상품) 데이터
 * ── 전략 보고서 원문을 그대로 반영 ──
 */
import { applyOverrides } from '../utils/policyManager.js';

/** 기본 공약 데이터 (원본) */
export const defaultPolicies = [
  {
    id: "economy-rocket",
    category: "economy",
    badge: "best",
    title: "[특가] 군산 경제 로켓배송 패키지",
    subtitle: "이재명의 실용주의 + 김재준의 중앙 인맥",
    description: "멈춘 군산 경제의 심장을 다시 뛰게 할 '산업 대전환' 정책입니다. 현대중공업, GM 폐쇄의 아픔을 딛고 이재명 대표가 보증하는 확실한 산업 전환을 구현하겠습니다. 경기도를 바꾼 이재명처럼, 군산을 바꿀 젊은 동력으로 경제를 로켓배송합니다.",
    buyPoint: "경기도를 바꾼 이재명처럼, 군산을 바꿀 젊은 동력!",
    details: [
      "이재명표 첨단 미래 산업단지 특별 유치",
      "군산형 청년 일자리 5,000개 창출 프로젝트",
      "지역 중소상공인 회복 및 자립 지원 패키지",
      "중앙정부 인맥을 활용한 대규모 국비 확보"
    ],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    supporters: 12450,
    rating: 4.9,
    reviews: [
      {
        id: "r1",
        author: "나운동 시민",
        rating: 5,
        text: "일자리 문제가 가장 심각했는데, 현대중공업 사태 이후의 대안이 절실했습니다. 이 공약 꼭 지켜주세요!",
        reply: "시민 여러분의 눈물, 반드시 닦아드리겠습니다. 경기도를 바꾼 이재명처럼, 군산을 바꾸겠습니다. - 김재준"
      },
      {
        id: "r2",
        author: "수송동 자영업자",
        rating: 5,
        text: "중앙정부와의 연결고리가 확실한 후보가 필요합니다. 청와대 경험이 큰 차별점!",
        reply: "대통령이 믿었던 보좌관, 이재명이 신뢰하는 파트너로서 반드시 해내겠습니다. - 김재준"
      }
    ],
    relatedIds: ["youth-54", "comm-direct"]
  },
  {
    id: "comm-direct",
    category: "communication",
    badge: "md-pick",
    title: "[MD추천] 청와대식 '오픈 시장실'",
    subtitle: "청와대의 소통 철학 + 춘추관장의 전문성",
    description: "시민이 제안하면 시장이 즉시 답하는 실시간 민원 해결 플랫폼을 구축하겠습니다. 청와대 춘추관장으로서 대통령의 소통 철학을 직접 실천한 경험을 군산 시정에 100% 적용합니다. 품격 있는 소통 행정으로 시민의 목소리를 청와대급으로 경청하겠습니다.",
    buyPoint: "청와대 춘추관장 출신의 품격 있는 소통 행정",
    details: [
      "24시간 열린 '오픈 시장실' 실시간 운영",
      "시민이 제안하면 시장이 즉시 답하는 민원 해결 시스템",
      "주요 현안 시민 직접 투표제 도입",
      "부서 칸막이 없는 통합 민원 원스톱 서비스"
    ],
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=800",
    supporters: 8932,
    rating: 4.8,
    reviews: [
      {
        id: "r3",
        author: "조촌동 청년",
        rating: 5,
        text: "공무원들 일처리가 늦어서 답답할 때가 많았는데, 청와대급 소통 행정 기대됩니다!",
        reply: "투명하고 신속한 행정, 춘추관장의 경험을 살려 반드시 만들어 내겠습니다! - 김재준"
      }
    ],
    relatedIds: ["economy-rocket", "youth-54"]
  },
  {
    id: "youth-54",
    category: "youth",
    badge: "urgent",
    title: "[한정판] 54세 젊은 리더십 패키지",
    subtitle: "54세 이재명이 그랬듯, 54세 김재준이 합니다",
    description: "낡은 정치를 끝내고 군산을 젊게 만들 '세대교체' 선언입니다. 이재명 대표의 당선 당시 나이였던 54세의 젊고 역동적인 리더십으로 군산에 새로운 활력을 불어넣겠습니다. 가장 일하기 좋은 나이, 검증된 젊은 시장이 되겠습니다!",
    buyPoint: "가장 일하기 좋은 나이, 검증된 젊은 시장!",
    details: [
      "청년 창업 및 주거 파격 지원 특구 지정",
      "군산형 미래 인재 양성 아카데미 설립",
      "청년이 돌아오는 문화·예술 거점 생태계 조성",
      "탁상행정 NO! 발로 뛰는 현장 시정 선언"
    ],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    supporters: 15890,
    rating: 5.0,
    reviews: [
      {
        id: "r4",
        author: "대학생 김OO",
        rating: 5,
        text: "졸업하고 군산에 남고 싶어도 일자리가 없었는데 세대교체가 절실합니다.",
        reply: "청년들이 군산을 떠나지 않아도 꿈을 이룰 수 있게, 54세의 젊은 동력으로 반드시 바꾸겠습니다! - 김재준"
      },
      {
        id: "r5",
        author: "미장동 주민",
        rating: 5,
        text: "이재명 대표도 54세에 해냈잖아요. 김재준 후보도 할 수 있다고 믿습니다!",
        reply: null
      }
    ],
    relatedIds: ["economy-rocket", "comm-direct"]
  }
];

/** 오버라이드 적용된 공약 목록 (동적으로 호출마다 최신 반영) */
export function getPolicies() {
  return applyOverrides(defaultPolicies);
}

/** 하위 호환용 — 직접 import { policies }로 쓰던 곳도 동작 */
export const policies = defaultPolicies;

// 카테고리 정의
export const categories = [
  { id: "all",     label: "전체보기" },
  { id: "best",    label: "베스트🔥" },
  { id: "md-pick", label: "MD추천💎" },
  { id: "urgent",  label: "마감임박⚡" }
];

// 바이럴(토스트) 알림용 랜덤 동네 데이터
export const neighborhoods = [
  "나운동", "수송동", "조촌동", "미장동", "월명동",
  "영화동", "중앙동", "해망동", "소룡동", "오식도동",
  "구암동", "경암동", "삼학동", "신풍동", "흥남동"
];
