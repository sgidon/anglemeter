import * as THREE from './build/three.module.min.js';
import { MathUtils } from './build/three.module.min.js';
import { DeviceOrientationControls } from './build/DeviceOrientationControls.js';

document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const reset = document.getElementById('reset');
    const leftMaxInfo = document.getElementById('leftmax');
    const rightMaxInfo = document.getElementById('rightmax');
    const angleInfo = document.getElementById('angle');

    var loopStarted = false;
    var angle = 0;
    var correctedAngle = 0;
    var rightMax = 0;
    var leftMax = 0;

    var loopId = null;

    // Webカメラのストリームを取得
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            console.log("エラー: " + err);
        });

    // thee.jsの実装
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const controls = new DeviceOrientationControls(camera);

    function loop() {
        controls.update();
        // const x = MathUtils.radToDeg(camera.rotation.x);
        // const y = MathUtils.radToDeg(camera.rotation.y);
        angle = MathUtils.radToDeg(camera.rotation.z);
        // console.log("x: " + x + ", y: " + y + ", z: " + z);

        angle += correctedAngle;
        angle = Math.floor(angle * 100) / 100;

        leftMax = Math.max(leftMax, angle);
        rightMax = Math.min(rightMax, angle);

        leftMaxInfo.innerHTML = `${formatAngle(leftMax)} <`;
        angleInfo.innerHTML = `[ ${formatAngle(angle)} ]`;
        rightMaxInfo.innerHTML = `> ${formatAngle(Math.abs(rightMax))}`;

        loopId = requestAnimationFrame(loop);
    }

    // 傾きangleを補正する
    reset.addEventListener('click', function () {

        // loopが動いていない場合
        if (!loopId) {

            // iOSかどうかの判定
            var ua = navigator.userAgent;
            var isiOS = ua.match(/iPhone|iPad|iPod/i);
            if (isiOS) {
                // iOSの場合、クリックイベントを元にdeviceorientationの権限を有効にする
                DeviceOrientationEvent.requestPermission().then(function () {
                    // イベントリスナーを登録
                    loop();
                }).catch(function (e) { console.log(e) });

            } else {
                loop();
            }

            // リセットする
            correctedAngle += angle * -1;
            rightMax = 0;
            leftMax = 0;

            reset.innerHTML = '終了';

            // fullscreen化する
            if (document.fullscreenEnabled) {
                document.documentElement.requestFullscreen();
            }
        
        } else {
            //requestAnimationFrameを停止する
            cancelAnimationFrame(loopId);
            loopId = null;
            
            reset.innerHTML = '開始';

            // fullscreenを解除する
            if (document.fullscreenEnabled) {
                document.exitFullscreen();
            }

        }

    });

    function formatAngle(angle) {
        // 小数点以下2桁まで表示し、桁を固定
        let formattedAngle = angle.toFixed(2);

        // 整数部の桁数を揃えるために、必要な空白を追加
        if (angle >= 0) {
            formattedAngle = ' ' + formattedAngle; // 正の数の場合、先頭に空白を追加
        }

        return formattedAngle + "°";
    }
});
