export function controlVolume(audio, volume) {
    audio.volume = volume;
}

export function contolTime(audio, time) {
    audio.currentTime = time;
}

export function formTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

export function resizeCanvas() {
    const c = document.querySelector('canvas');
    c.width = c.clientWidth;
    c.height = c.clientHeight;
}