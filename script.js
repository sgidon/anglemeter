document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const reset = document.getElementById('reset');
    const angle = document.getElementById('angle');
    const leftMaxInfo = document.getElementById('leftmax');
    const rightMaxInfo = document.getElementById('rightmax');
    const alphaInfo = document.getElementById('alpha');

    // Webカメラのストリームを取得
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            console.log("エラー: " + err);
        });

    // 傾きalphaを補正する
    reset.addEventListener('click', function () {
        correctedAlpha += alpha * -1;
        rightMax = 0;
        leftMax = 0;
    });

    // 傾きを取得
    var alpha = 0;
    var correctedAlpha = 0;
    var rightMax = 0;
    var leftMax = 0;
    window.addEventListener('deviceorientation', function (event) {
        // alpha: z軸を中心に回転する角度。0度~360度の範囲で表現される。
        // それを-180度から180度の範囲の表現に変更する。
        alpha = event.alpha + correctedAlpha
        alpha = Math.floor((alpha < 180 ? alpha : alpha - 360) * 100) / 100;

        leftMax = Math.max(leftMax, alpha);
        rightMax = Math.min(rightMax, alpha);

        // angle.innerHTML に alpha leftMax rightMax を表示
        alphaInfo.innerHTML = `[ ${alpha}° ]`;
        leftMaxInfo.innerHTML = `${leftMax}° <`;
        rightMaxInfo.innerHTML = `> ${Math.abs(rightMax)}°`;

    });

});
