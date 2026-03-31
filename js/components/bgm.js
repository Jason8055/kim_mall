// js/components/bgm.js
/**
 * 백그라운드 음악(BGM) 모듈
 * 
 * - YouTube IFrame API를 활용하여 보이지 않는 플레이어로 음원만 재생합니다.
 * - 브라우저 자동 재생 정책을 스무스하게 우회하기 위해, 
 *   사용자의 첫 터치(클릭/스크롤) 발생 시 음원이 자연스럽게 나오도록 처리했습니다.
 * - 우측 하단 플로팅 버튼으로 켜고 끌 수 있게 하여 사용자 피해를 최소화합니다.
 */

let player;
let isPlaying = false;
let userInteracted = false;

export function initBGM() {
    // 1. YouTube API 로드
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if(firstScriptTag) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
        document.head.appendChild(tag);
    }

    // 2. 비밀 플레이어(iframe)를 담을 컨테이너 생성
    const playerDiv = document.createElement('div');
    playerDiv.id = 'bgm-player';
    // 화면에서 보이지 않도록 저 멀리 날려버리기
    playerDiv.style.position = 'absolute';
    playerDiv.style.top = '-9999px';
    playerDiv.style.left = '-9999px';
    playerDiv.style.width = '1px';
    playerDiv.style.height = '1px';
    playerDiv.style.opacity = '0';
    document.body.appendChild(playerDiv);

    // 3. UI 제어용 플로팅 버튼 생성
    const btn = document.createElement('button');
    btn.id = 'bgm-toggle-btn';
    btn.innerHTML = '<span class="material-symbols-rounded">music_off</span>';
    btn.className = 'bgm-btn';
    btn.title = '배경음악 켜기/끄기';
    document.body.appendChild(btn);

    // 전역 콜백 등록: YouTube 스크립트가 로드되면 실행됨
    window.onYouTubeIframeAPIReady = () => {
        player = new YT.Player('bgm-player', {
            videoId: 'CYNHYN2blQY', // 요청된 선거 캠페인송 영상 ID
            playerVars: {
                'autoplay': 0,      // 수동 트리거 할 것이므로 0
                'loop': 1,          // 반복 재생
                'playlist': 'CYNHYN2blQY',
                'controls': 0,
                'modestbranding': 1,
                'playsinline': 1
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event) {
        // 남에게 큰 피해가 안가도록 볼륨을 35% 정도로 제한 (너무 크면 깜짝 놀랄 수 있음)
        event.target.setVolume(35);
        
        // 사용자가 화면 어딘가를 터치/스크롤/클릭하면 자연스럽게 재생 시작
        const startAudioOnce = () => {
            if (!userInteracted && !isPlaying && player && typeof player.playVideo === 'function') {
                userInteracted = true;
                player.playVideo();
            }
            // 한 번 동작하면 리스너 해제
            window.removeEventListener('click', startAudioOnce, { capture: true });
            window.removeEventListener('touchstart', startAudioOnce, { capture: true });
            window.removeEventListener('scroll', startAudioOnce, { capture: true });
        };

        window.addEventListener('click', startAudioOnce, { capture: true, once: true });
        window.addEventListener('touchstart', startAudioOnce, { capture: true, once: true });
        window.addEventListener('scroll', startAudioOnce, { capture: true, once: true });
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            isPlaying = true;
            btn.innerHTML = '<span class="material-symbols-rounded">music_note</span>';
            btn.classList.add('playing');
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            isPlaying = false;
            btn.innerHTML = '<span class="material-symbols-rounded">music_off</span>';
            btn.classList.remove('playing');
        }
    }

    // 명시적인 버튼 클릭 시 켜고 끄기 토글
    btn.addEventListener('click', (e) => {
        // e.stopPropagation() 하지 않음 -> 클릭이 전파되어 첫 재생 트리거로도 작동
        if (!player || typeof player.playVideo !== 'function') return;
        
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    });
}
