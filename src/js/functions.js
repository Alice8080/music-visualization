import { TRACKS } from "./constants.js";
import { controlVolume, contolTime, formTime } from './utils.js';

const allTracks = document.querySelector('.all-tracks');
const player = document.querySelector('.player__audio');
const canvas = document.getElementById('visualisation');

const playlist = { // Объект плейлиста, со свойствами которого работают функции
    activeAudio: undefined, // Объект аудио, воспроизводящегося в данный момент
    activeTrack: undefined, // HTML-элемент трека, воспроизводящегося в данный момент
    wave: undefined, // Визуализация активного аудио
};

async function renderPlayer(trackName) { // 
    const url = `././src/assets/audio/${trackName}.mp3`;
    const audio = new Audio(url); // Перед возвратом нового объекта медиа-ресурс загружается асинхронно, поэтому функция renderPlayer асинхронная
    playlist.activeAudio = audio;

    const playBtn = document.createElement('button'); // Кнопка воспроизведения аудио
    playBtn.classList.add('track__play-button');
    playBtn.innerHTML = `<img src="./src/assets/img/start.svg" />`;

    const pauseBtn = document.createElement('button'); // Кнопка остановки аудио
    pauseBtn.classList.add('track__pause-button');
    pauseBtn.innerHTML = `<img src="./src/assets/img/pause.svg" />`;

    const track = document.createElement('div'); // Элемент трека, воспроизводящегося в данный момент
    track.classList.add('track');

    const trackTitle = document.createElement('h3');
    trackTitle.innerHTML = trackName;

    const volume = document.createElement('input'); // Ползунок регулировки громкости
    volume.classList.add('volume');
    volume.type = "range";
    volume.min = 0;
    volume.max = 100;
    volume.value = 100;

    const trackLine = document.createElement('div');
    trackLine.classList.add('track__line');

    const line = document.createElement('input'); // Отображение текущего времени трека с возможностью промотать его
    line.classList.add('line');
    line.type = "range";
    line.min = 0;
    line.value = 0;

    const content = document.createElement('div');
    content.classList.add('track__content');

    player.appendChild(track);
    track.appendChild(content);
    content.appendChild(trackTitle);
    content.appendChild(volume);
    content.appendChild(playBtn);
    content.appendChild(pauseBtn);
    track.appendChild(trackLine);
    trackLine.appendChild(line);

    playBtn.style.display = 'none';
    pauseBtn.style.display = 'block';

    volume.addEventListener('input', (e) => {
        const newVolume = volume.value / 100;
        controlVolume(audio, newVolume); // Установка громкости трека пользователем
    });

    line.addEventListener('input', (e) => {
        const time = line.value;
        contolTime(audio, time); // Установка текущего времени трека пользователем
    });

    const currentTime = document.createElement('p');
    trackLine.appendChild(currentTime);
    const duration = document.createElement('p');
    trackLine.appendChild(duration);

    playlist.wave = new Wave(audio, canvas); // Создание объекта визуализации

    audio.play(); // Начало воспроизведения трека
    animation(playlist.wave); // Начало визуализации

    playBtn.addEventListener('click', () => {
        audio.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
    });

    pauseBtn.addEventListener('click', () => {
        audio.pause();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'block';
    });

    audio.addEventListener("canplaythrough", () => { // Событие происходит, как только трек загрузился достаточно, чтобы проигрываться без остановок для дозагрузки
        duration.textContent = formTime(audio.duration); // Установка общей продолжительности трека
        line.max = audio.duration;
    });

    audio.addEventListener("timeupdate", (e) => { // Событие происходит, когда currentTime трека обновляется, т. е. пока трек играет
        currentTime.textContent = formTime(audio.currentTime); // Обновление текущего времени трека на странице
        line.value = audio.currentTime;
    });

    audio.addEventListener("ended", (e) => { // Событие происходит, когда воспроизведение завершилось
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        line.value = 0;
    });
}

function animation(wave) { // Добавление визуализации
    wave.addAnimation(
        new wave.animations.Wave({
            lineColor: "#FFFFFF",
            lineWidth: 10,
            fillColor: { gradient: ["#E3A8FF", "#94B2FF", "#BC66FF", "#FF9EA4"], rotate: 90 },
            mirroredX: true,
            count: 5,
            rounded: true,
            frequencyBand: "base",
        })
    );

    wave.addAnimation(
        new wave.animations.Wave({
            lineColor: "#FFFFFF",
            lineWidth: 10,
            fillColor: { gradient: ["#E3A8FF", "#94B2FF", "#BC66FF", "#FF9EA4"], rotate: 40 },
            mirroredX: true,
            count: 5,
            rounded: true,
            frequencyBand: "lows",
        })
    );

    wave.addAnimation(
        new wave.animations.Wave({
            lineColor: "#FFFFFF",
            lineWidth: 10,
            fillColor: { gradient: ["#E3A8FF", "#E3A8FF", "#94B2FF", "#BC66FF", "#BC66FF", "#FF9EA4"], rotate: 0 },
            mirroredX: true,
            count: 5,
            rounded: true,
            frequencyBand: "mids",
        })
    );

    wave.addAnimation(
        new wave.animations.Wave({
            lineColor: "#FFFFFF",
            lineWidth: 10,
            fillColor: { gradient: ["#E3A8FF", "#94B2FF", "#BC66FF", "#FF9EA4"], rotate: 180 },
            mirroredX: true,
            count: 5,
            rounded: true,
            frequencyBand: "highs",
        })
    );

    wave.addAnimation(
        new wave.animations.Glob({
            fillColor: "#a3a3a300",
            lineColor: { gradient: ["#E3A8FF", "#94B2FF", "#BC66FF", "#FF9EA4", "#E3A8FF", "#94B2FF", "#BC66FF", "#FF9EA4"], rotate: 240 },
            lineWidth: 6,
            count: 45,
        })
    );

    const diameter = window.innerWidth < 930 ? 300 : 700;
    const lineWidth = window.innerWidth < 930 ? 0.1 : 3;

    wave.addAnimation(
        new wave.animations.Arcs({
            lineWidth: lineWidth,
            lineColor: { gradient: ["#E3A8FF", "#94B2FF", "#BC66FF", "#FF9EA4"] },
            diameter: diameter,
            fillColor: { gradient: ["#94B2FF", "#E3A8FF", "#94B2FF", "#BC66FF", "#FF9EA4", "#E3A8FF", "#94B2FF", "#BC66FF", "#FF9EA4"] }
        })
    );
}

export function renderPlaylist() { // Отображение всех загруженных треков
    for (let item of TRACKS) {
        const playBtn = document.createElement('button');
        playBtn.classList.add('track__play-button');
        playBtn.innerHTML = `<img src="./src/assets/img/start.svg" />`

        const track = document.createElement('div');
        track.classList.add('track');
        track.setAttribute('data-id', item);

        const trackTitle = document.createElement('h3');
        trackTitle.innerHTML = item;

        track.appendChild(trackTitle);
        track.appendChild(playBtn);

        playBtn.addEventListener('click', async () => {
            playBtn.style.display = 'none';
            const prevTrack = player.querySelector('.track');
            if (playlist.activeTrack) { // Если есть предыдущий трек, который играл до этого, останавливаем его и сбрасываем его визуализацию
                playlist.activeTrack.querySelector('.track__play-button').style.display = 'block';
                playlist.wave.clearAnimations();
                player.removeChild(prevTrack);
                playlist.activeAudio.pause(); 
            }
            playlist.activeTrack = track;
            await renderPlayer(item);
        });

        allTracks.appendChild(track);
    }
}