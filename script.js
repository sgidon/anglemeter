document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const snap = document.getElementById('snap');
    const popup = document.getElementById('popup');
    const close = document.getElementById('close');
    const photo = document.getElementById('photo');

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
    snap.addEventListener('click', function () {
        correctedAlpha = alpha * -1 + correctedAlpha;
        rightMax = 0;
        leftMax = 0;
    });

    // 傾きを取得
    let angle = document.getElementById('angle');
    let rightMax = 0;
    let leftMax = 0;
    let alpha = 0;
    let correctedAlpha = 0;
    window.addEventListener('deviceorientation', function (event) {
        // alpha: z軸を中心に回転する角度。0度~360度の範囲で表現される。
        // それを-180度から180度の範囲の表現に変更する。
        alpha = event.alpha + correctedAlpha
        alpha = Math.floor((alpha < 180 ? alpha : alpha - 360) * 100) / 100;

        leftMax = Math.max(leftMax, alpha);
        rightMax = Math.min(rightMax, alpha);

        // angle.innerHTML に alpha leftMax rightMax を表示
        angle.innerHTML = `alpha: ${alpha}<br>leftMax: ${leftMax}<br>rightMax: ${Math.abs(rightMax)}`;
    });

});
